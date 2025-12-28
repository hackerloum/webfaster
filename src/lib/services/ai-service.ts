import OpenAI from 'openai';
import { WebsiteStructure, Section } from '@/lib/types/website';
import { GenerationOptions } from '@/lib/types/editor';
import { ParserService } from './parser-service';

// Lazy initialization to prevent browser instantiation
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  // Safety check: ensure we're in a server environment
  if (typeof window !== 'undefined') {
    throw new Error(
      'AIService cannot be used in browser. Use API routes instead: /api/ai/generate or /api/ai/modify'
    );
  }

  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openai = new OpenAI({
      apiKey,
    });
  }

  return openai;
}

export class AIService {
  private parserService: ParserService;

  constructor() {
    this.parserService = new ParserService();
  }

  private buildSystemPrompt(): string {
    return `You are an expert web designer and developer. Generate complete, modern website structures based on user descriptions.

RULES:
- Create semantic, accessible HTML structure
- Use modern design principles (whitespace, hierarchy, contrast)
- Generate realistic, relevant content (not lorem ipsum)
- Include appropriate sections based on website type
- Provide detailed styling instructions
- Ensure mobile responsiveness
- Follow web accessibility guidelines (WCAG 2.1)
- Use professional, business-appropriate content

OUTPUT FORMAT: Return ONLY valid JSON matching this structure:
{
  "metadata": {
    "title": "Website Title",
    "description": "Brief description"
  },
  "globalStyles": {
    "colorScheme": {
      "primary": "#0ea5e9",
      "secondary": "#8b5cf6",
      "accent": "#f59e0b",
      "background": "#ffffff",
      "text": "#1f2937"
    },
    "typography": {
      "fontFamily": "Inter, system-ui, sans-serif",
      "fontSize": {
        "base": "16px",
        "h1": "3rem",
        "h2": "2.25rem",
        "h3": "1.875rem",
        "h4": "1.5rem"
      }
    },
    "spacing": {
      "sectionGap": "5rem",
      "containerPadding": "1rem"
    }
  },
  "sections": [
    {
      "type": "hero",
      "content": {
        "heading": "Main headline",
        "subheading": "Supporting text",
        "ctaText": "Call to action",
        "ctaLink": "#",
        "backgroundImage": "optional-image-url"
      },
      "styles": {
        "backgroundColor": "#f9fafb",
        "textColor": "#1f2937",
        "padding": {"top": "5rem", "right": "2rem", "bottom": "5rem", "left": "2rem"}
      },
      "visible": true
    }
  ],
  "assets": []
}`;
  }

  async generateWebsite(
    prompt: string,
    options?: GenerationOptions
  ): Promise<WebsiteStructure> {
    try {
      const enhancedPrompt = this.enhancePrompt(prompt, options);

      const client = getOpenAIClient();
      const response = await client.chat.completions.create({
        model: 'gpt-4.1',
        messages: [
          { role: 'system', content: this.buildSystemPrompt() },
          { role: 'user', content: enhancedPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      const website = this.parserService.parseAIResponse(content);
      return website;
    } catch (error) {
      console.error('AI Generation Error:', error);
      throw new Error('Failed to generate website. Please try again.');
    }
  }

  private enhancePrompt(prompt: string, options?: GenerationOptions): string {
    let enhanced = `Create a website: ${prompt}`;

    if (options?.stylePreference) {
      enhanced += `\nStyle: ${options.stylePreference}`;
    }
    if (options?.industry) {
      enhanced += `\nIndustry: ${options.industry}`;
    }
    if (options?.targetAudience) {
      enhanced += `\nTarget audience: ${options.targetAudience}`;
    }
    if (options?.colorScheme) {
      enhanced += `\nColor scheme: ${options.colorScheme}`;
    }

    return enhanced;
  }

  async modifySection(section: Section, instruction: string): Promise<Section> {
    try {
      const systemPrompt = `You are a web design expert. Modify the provided section according to the user's instruction. Return ONLY the modified section as valid JSON.`;

      const userPrompt = `Current section:
${JSON.stringify(section, null, 2)}

User instruction: ${instruction}

Return the modified section as JSON.`;

      const client = getOpenAIClient();
      const response = await client.chat.completions.create({
        model: 'gpt-4.1',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      const modifiedSection = this.parserService.parseSectionResponse(content);

      return {
        ...modifiedSection,
        id: section.id, // Preserve original ID
        order: section.order, // Preserve order
      };
    } catch (error) {
      console.error('AI Modification Error:', error);
      throw new Error('Failed to modify section. Please try again.');
    }
  }

  async suggestImprovements(section: Section): Promise<string[]> {
    try {
      const client = getOpenAIClient();
      const response = await client.chat.completions.create({
        model: 'gpt-4.1',
        messages: [
          {
            role: 'system',
            content:
              'You are a web design expert. Provide 3-5 specific, actionable improvement suggestions for the given section.',
          },
          {
            role: 'user',
            content: `Section: ${JSON.stringify(section, null, 2)}

Provide specific improvement suggestions as a JSON array of strings.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return [];

      const suggestions = JSON.parse(content);
      return Array.isArray(suggestions) ? suggestions : [];
    } catch (error) {
      console.error('AI Suggestions Error:', error);
      return [];
    }
  }
}
