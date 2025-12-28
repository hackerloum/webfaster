import { WebsiteStructure, Section } from '@/lib/types/website';
import { nanoid } from 'nanoid';
import DOMPurify from 'dompurify';
import { z } from 'zod';

const SectionSchema = z.object({
  type: z.enum([
    'hero',
    'about',
    'features',
    'services',
    'pricing',
    'testimonials',
    'team',
    'contact',
    'footer',
    'cta',
    'gallery',
    'custom',
  ]),
  content: z.record(z.any()),
  styles: z.object({
    backgroundColor: z.string().optional(),
    backgroundImage: z.string().optional(),
    textColor: z.string().optional(),
    padding: z
      .object({
        top: z.string(),
        right: z.string(),
        bottom: z.string(),
        left: z.string(),
      })
      .optional(),
    margin: z
      .object({
        top: z.string(),
        right: z.string(),
        bottom: z.string(),
        left: z.string(),
      })
      .optional(),
    borderRadius: z.string().optional(),
    boxShadow: z.string().optional(),
    customCSS: z.string().optional(),
  }),
  visible: z.boolean(),
});

const WebsiteSchema = z.object({
  metadata: z.object({
    title: z.string(),
    description: z.string(),
  }),
  globalStyles: z.object({
    colorScheme: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
      background: z.string(),
      text: z.string(),
    }),
    typography: z.object({
      fontFamily: z.string(),
      headingFont: z.string().optional(),
      fontSize: z.object({
        base: z.string(),
        h1: z.string(),
        h2: z.string(),
        h3: z.string(),
        h4: z.string(),
      }),
    }),
    spacing: z.object({
      sectionGap: z.string(),
      containerPadding: z.string(),
    }),
  }),
  sections: z.array(SectionSchema),
  assets: z.array(z.any()).optional(),
});

export class ParserService {
  parseAIResponse(response: string): WebsiteStructure {
    try {
      // Extract JSON from markdown code blocks if present
      let jsonStr = response.trim();
      const codeBlockMatch = jsonStr.match(/```json\n([\s\S]*?)\n```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        jsonStr = codeBlockMatch[1];
      } else {
        const anyCodeBlockMatch = jsonStr.match(/```\n([\s\S]*?)\n```/);
        if (anyCodeBlockMatch && anyCodeBlockMatch[1]) {
          jsonStr = anyCodeBlockMatch[1];
        }
      }

      // Parse JSON
      const parsed = JSON.parse(jsonStr);

      // Validate against schema
      const validated = WebsiteSchema.parse(parsed);

      // Generate IDs and add metadata
      const now = new Date();
      const sections: Section[] = validated.sections.map((section, idx) => ({
        ...section,
        id: nanoid(),
        order: idx,
        metadata: {
          generatedByAI: true,
          lastEditedAt: now,
          editHistory: [],
        },
      }));

      const website: WebsiteStructure = {
        id: nanoid(),
        metadata: {
          ...validated.metadata,
          createdAt: now,
          updatedAt: now,
        },
        globalStyles: validated.globalStyles,
        sections,
        assets: validated.assets || [],
      };

      return website;
    } catch (error) {
      console.error('Parse Error:', error);
      throw new Error('Failed to parse AI response. Invalid format.');
    }
  }

  parseSectionResponse(response: string): Section {
    try {
      let jsonStr = response.trim();
      const codeBlockMatch = jsonStr.match(/```json\n([\s\S]*?)\n```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        jsonStr = codeBlockMatch[1];
      }

      const parsed = JSON.parse(jsonStr);
      const validated = SectionSchema.parse(parsed);

      return {
        ...validated,
        id: nanoid(),
        order: 0,
        metadata: {
          generatedByAI: true,
          lastEditedAt: new Date(),
          editHistory: [],
        },
      };
    } catch (error) {
      console.error('Section Parse Error:', error);
      throw new Error('Failed to parse section response.');
    }
  }

  sanitizeContent(content: string): string {
    if (typeof window === 'undefined') {
      return content;
    }
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'a',
        'span',
        'div',
      ],
      ALLOWED_ATTR: ['href', 'target', 'class', 'style'],
    });
  }
}
