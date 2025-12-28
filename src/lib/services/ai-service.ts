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
    return `You are an elite web designer and developer with 15+ years of experience creating award-winning websites for Fortune 500 companies, startups, and creative agencies. Your expertise includes modern UI/UX design, responsive layouts, accessibility, performance optimization, and conversion-focused design.

YOUR MISSION:
Generate complete, production-ready website structures that are:
- Visually stunning and modern
- Fully responsive (mobile-first approach)
- Accessible (WCAG 2.1 AA compliant)
- SEO-optimized
- Conversion-focused
- Fast-loading and performant
- Professional and polished

DESIGN PRINCIPLES:
1. **Visual Hierarchy**: Use size, color, spacing, and typography to guide user attention
2. **Whitespace**: Generous spacing creates breathing room and elegance
3. **Color Psychology**: Choose colors that match the brand/industry and evoke the right emotions
4. **Typography**: Use clear, readable fonts with proper hierarchy (h1 > h2 > h3)
5. **Consistency**: Maintain consistent spacing, colors, and styling throughout
6. **Mobile-First**: Design for mobile, then enhance for larger screens
7. **Accessibility**: High contrast ratios, semantic HTML, ARIA labels where needed
8. **Modern Aesthetics**: Clean, minimal, with subtle gradients, shadows, and animations

CONTENT GUIDELINES:
- Generate REAL, relevant content (never use "lorem ipsum" or placeholder text)
- Content should be specific to the user's request and industry
- Use compelling headlines that grab attention
- Write clear, concise copy that communicates value
- Include appropriate CTAs (Call-to-Actions) with action-oriented text
- Make content scannable with bullet points, short paragraphs, and clear sections

SECTION TYPES & BEST PRACTICES:

**Hero Section:**
- Large, attention-grabbing headline (8-12 words max)
- Compelling subheadline that explains value proposition
- Clear primary CTA button
- Optional: Secondary CTA, hero image/illustration
- Background: Can use gradients, images, or solid colors
- Height: Full viewport or substantial (80-100vh on desktop)

**Features Section:**
- 3-6 feature cards with icons/illustrations
- Each feature: Icon, title (3-5 words), description (1-2 sentences)
- Grid layout: 3 columns on desktop, 2 on tablet, 1 on mobile
- Use consistent card styling with hover effects

**About Section:**
- Company/person story (2-3 paragraphs)
- Mission/vision statements
- Key achievements or milestones
- Team photos or company values
- Can include stats/metrics

**Services/Products:**
- List of services/products with descriptions
- Pricing information if applicable
- Benefits and use cases
- Visual elements (icons, images)

**Testimonials:**
- 3-6 testimonials from real-sounding customers
- Include: Name, role/company, photo (use placeholder), quote
- Star ratings (4-5 stars)
- Rotating carousel or grid layout

**Contact Section:**
- Contact form with: Name, Email, Message (required fields)
- Phone number, email, address
- Social media links
- Map integration placeholder

**Footer:**
- Links organized in columns (About, Services, Legal, etc.)
- Social media icons
- Copyright notice
- Newsletter signup (optional)

COLOR SCHEME GUIDELINES:
- **Tech/SaaS**: Blues, purples, teals (trust, innovation)
- **Healthcare**: Blues, greens (trust, health)
- **Finance**: Blues, dark grays (stability, trust)
- **Creative/Agency**: Bold colors, gradients (creativity)
- **E-commerce**: Warm colors, reds for CTAs (urgency)
- **Food/Restaurant**: Warm colors, oranges, reds (appetite)
- **Luxury**: Golds, blacks, deep purples (premium)
- Always ensure sufficient contrast (minimum 4.5:1 for text)

OUTPUT FORMAT:
Return ONLY valid JSON matching this exact structure (no markdown, no explanations, just JSON):
{
  "metadata": {
    "title": "Website Title - Should be specific and SEO-friendly",
    "description": "Compelling meta description (150-160 characters)"
  },
  "globalStyles": {
    "colorScheme": {
      "primary": "#hex-color",
      "secondary": "#hex-color",
      "accent": "#hex-color",
      "background": "#hex-color",
      "text": "#hex-color"
    },
    "typography": {
      "fontFamily": "Modern font stack (e.g., 'Inter', 'system-ui', 'sans-serif')",
      "headingFont": "Optional heading font",
      "fontSize": {
        "base": "16px",
        "h1": "3rem to 4rem",
        "h2": "2.25rem to 3rem",
        "h3": "1.875rem to 2.25rem",
        "h4": "1.5rem to 1.875rem"
      }
    },
    "spacing": {
      "sectionGap": "4rem to 6rem",
      "containerPadding": "1rem to 2rem"
    }
  },
  "sections": [
    {
      "type": "hero|about|features|services|pricing|testimonials|team|contact|footer|cta|gallery|custom",
      "content": {
        // Section-specific content (see examples below)
      },
      "styles": {
        "backgroundColor": "#hex-color or gradient",
        "textColor": "#hex-color",
        "padding": {"top": "value", "right": "value", "bottom": "value", "left": "value"}
      },
      "visible": true
    }
  ],
  "assets": []
}

CRITICAL RULES:
1. Generate 4-8 sections minimum (hero + 3-7 other sections)
2. Always include a hero section as the first section
3. Always include a footer as the last section
4. Content must be REAL and relevant (no placeholders)
5. Use appropriate section types based on the user's request
6. Ensure logical flow: hero → about/features → services → testimonials → contact → footer
7. Colors must be valid hex codes
8. All text must be in English unless user specifies otherwise
9. Make content compelling and conversion-focused
10. Ensure mobile responsiveness in design decisions

Remember: Quality over quantity. Create a website that looks like it was designed by a top-tier agency.`;
  }

  private analyzePrompt(prompt: string): {
    websiteType: string;
    industry: string;
    keyFeatures: string[];
    tone: string;
    colorHints: string[];
  } {
    const lowerPrompt = prompt.toLowerCase();

    // Detect website type
    let websiteType = 'business';
    if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('personal')) {
      websiteType = 'portfolio';
    } else if (lowerPrompt.includes('e-commerce') || lowerPrompt.includes('shop') || lowerPrompt.includes('store')) {
      websiteType = 'ecommerce';
    } else if (lowerPrompt.includes('landing page') || lowerPrompt.includes('landing')) {
      websiteType = 'landing';
    } else if (lowerPrompt.includes('blog')) {
      websiteType = 'blog';
    } else if (lowerPrompt.includes('saas') || lowerPrompt.includes('software')) {
      websiteType = 'saas';
    }

    // Detect industry
    let industry = 'general';
    const industries = [
      'tech', 'healthcare', 'finance', 'education', 'food', 'restaurant',
      'fashion', 'real estate', 'legal', 'consulting', 'creative', 'agency',
      'nonprofit', 'fitness', 'beauty', 'travel', 'hospitality'
    ];
    for (const ind of industries) {
      if (lowerPrompt.includes(ind)) {
        industry = ind;
        break;
      }
    }

    // Extract key features mentioned
    const keyFeatures: string[] = [];
    const featureKeywords = [
      'contact form', 'pricing', 'testimonials', 'gallery', 'blog',
      'team', 'services', 'products', 'about', 'features', 'portfolio'
    ];
    featureKeywords.forEach(keyword => {
      if (lowerPrompt.includes(keyword)) {
        keyFeatures.push(keyword);
      }
    });

    // Detect tone
    let tone = 'professional';
    if (lowerPrompt.includes('modern') || lowerPrompt.includes('minimal')) {
      tone = 'modern';
    } else if (lowerPrompt.includes('bold') || lowerPrompt.includes('vibrant')) {
      tone = 'bold';
    } else if (lowerPrompt.includes('elegant') || lowerPrompt.includes('luxury')) {
      tone = 'elegant';
    }

    // Extract color hints
    const colorHints: string[] = [];
    const colors = ['blue', 'red', 'green', 'purple', 'orange', 'yellow', 'pink', 'teal', 'black', 'white', 'gray'];
    colors.forEach(color => {
      if (lowerPrompt.includes(color)) {
        colorHints.push(color);
      }
    });

    return { websiteType, industry, keyFeatures, tone, colorHints };
  }

  private enhancePrompt(prompt: string, options?: GenerationOptions): string {
    const analysis = this.analyzePrompt(prompt);
    
    let enhanced = `Create a complete, professional website based on this description: "${prompt}"\n\n`;

    // Add context from analysis
    enhanced += `WEBSITE TYPE: ${analysis.websiteType}\n`;
    enhanced += `INDUSTRY: ${analysis.industry}\n`;
    enhanced += `DESIGN TONE: ${analysis.tone}\n`;

    if (analysis.keyFeatures.length > 0) {
      enhanced += `REQUIRED SECTIONS: ${analysis.keyFeatures.join(', ')}\n`;
    }

    if (analysis.colorHints.length > 0) {
      enhanced += `COLOR PREFERENCES: ${analysis.colorHints.join(', ')}\n`;
    }

    // Add options if provided
    if (options?.stylePreference) {
      enhanced += `\nSTYLE PREFERENCE: ${options.stylePreference}\n`;
    }
    if (options?.industry) {
      enhanced += `\nINDUSTRY: ${options.industry}\n`;
    }
    if (options?.targetAudience) {
      enhanced += `\nTARGET AUDIENCE: ${options.targetAudience}\n`;
    }
    if (options?.colorScheme) {
      enhanced += `\nCOLOR SCHEME: ${options.colorScheme}\n`;
    }

    // Add generation instructions
    enhanced += `\nINSTRUCTIONS:
1. Generate a complete website with 5-8 sections
2. Always start with a hero section
3. Always end with a footer section
4. Include sections that match the website type and industry
5. Use real, compelling content (no placeholders or lorem ipsum)
6. Choose colors appropriate for the industry and tone
7. Ensure the design is modern, professional, and conversion-focused
8. Make it mobile-responsive
9. Include appropriate CTAs throughout
10. Create content that is specific and relevant to the user's request

Generate the complete website structure as JSON now.`;

    return enhanced;
  }

  async generateWebsite(
    prompt: string,
    options?: GenerationOptions
  ): Promise<WebsiteStructure> {
    try {
      const enhancedPrompt = this.enhancePrompt(prompt, options);

      const client = getOpenAIClient();
      
      // Use gpt-4-turbo or gpt-4o for better results, fallback to gpt-4
      const model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
      
      // Models that support JSON mode
      const supportsJsonMode = ['gpt-4-turbo', 'gpt-4-turbo-preview', 'gpt-4o', 'gpt-4o-mini'].includes(model);
      
      const requestConfig: any = {
        model: model,
        messages: [
          { role: 'system', content: this.buildSystemPrompt() },
          { role: 'user', content: enhancedPrompt },
        ],
        temperature: 0.8, // Slightly higher for more creativity
        max_tokens: 6000, // Increased for more detailed responses
      };

      // Add JSON mode if supported
      if (supportsJsonMode) {
        requestConfig.response_format = { type: 'json_object' };
      }
      
      const response = await client.chat.completions.create(requestConfig);

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      // Parse the JSON response
      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (parseError) {
        // If JSON parsing fails, try to extract JSON from markdown
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse AI response as JSON');
        }
      }

      const website = this.parserService.parseAIResponse(JSON.stringify(parsedContent));
      return website;
    } catch (error) {
      console.error('AI Generation Error:', error);
      
      // Provide more helpful error messages
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
        }
        if (error.message.includes('rate limit')) {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        }
        if (error.message.includes('insufficient_quota')) {
          throw new Error('OpenAI API quota exceeded. Please check your account billing.');
        }
      }
      
      throw new Error('Failed to generate website. Please try again with a more detailed description.');
    }
  }

  async modifySection(section: Section, instruction: string): Promise<Section> {
    try {
      const systemPrompt = `You are an expert web designer. Modify the provided section according to the user's instruction while maintaining design consistency and quality.

RULES:
- Preserve the section's ID and order
- Maintain the overall design style
- Follow the same content structure
- Ensure accessibility and responsiveness
- Return ONLY the modified section as valid JSON (no markdown, no explanations)`;

      const userPrompt = `Current section:
${JSON.stringify(section, null, 2)}

User instruction: ${instruction}

Return the modified section as JSON matching the original structure.`;

      const client = getOpenAIClient();
      const model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
      const supportsJsonMode = ['gpt-4-turbo', 'gpt-4-turbo-preview', 'gpt-4o', 'gpt-4o-mini'].includes(model);
      
      const requestConfig: any = {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      };

      if (supportsJsonMode) {
        requestConfig.response_format = { type: 'json_object' };
      }
      
      const response = await client.chat.completions.create(requestConfig);

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse response');
        }
      }

      const modifiedSection = this.parserService.parseSectionResponse(JSON.stringify(parsedContent));

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
      const model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
      const supportsJsonMode = ['gpt-4-turbo', 'gpt-4-turbo-preview', 'gpt-4o', 'gpt-4o-mini'].includes(model);
      
      const requestConfig: any = {
        model: model,
        messages: [
          {
            role: 'system',
            content:
              'You are a web design expert. Provide 3-5 specific, actionable improvement suggestions for the given section. Return as a JSON object with a "suggestions" array.',
          },
          {
            role: 'user',
            content: `Section: ${JSON.stringify(section, null, 2)}

Provide specific improvement suggestions as a JSON object: {"suggestions": ["Improve contrast ratio for better accessibility", "Add hover effects to increase interactivity"]}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      };

      if (supportsJsonMode) {
        requestConfig.response_format = { type: 'json_object' };
      }
      
      const response = await client.chat.completions.create(requestConfig);

      const content = response.choices[0]?.message?.content;
      if (!content) return [];

      try {
        const parsed = JSON.parse(content);
        // Handle different response formats
        if (Array.isArray(parsed)) {
          return parsed;
        } else if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
          return parsed.suggestions;
        } else if (parsed.improvements && Array.isArray(parsed.improvements)) {
          return parsed.improvements;
        }
        return [];
      } catch {
        return [];
      }
    } catch (error) {
      console.error('AI Suggestions Error:', error);
      return [];
    }
  }
}
