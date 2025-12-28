import { WebsiteStructure, Section } from '@/lib/types/website';
import { z } from 'zod';

const SectionValidationSchema = z.object({
  id: z.string().min(1),
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
  order: z.number().int().min(0),
  visible: z.boolean(),
});

const WebsiteValidationSchema = z.object({
  id: z.string().min(1),
  metadata: z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(500),
    favicon: z.string().url().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  sections: z.array(SectionValidationSchema),
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
  assets: z.array(z.any()),
});

export class ValidationService {
  validateWebsite(website: WebsiteStructure): { valid: boolean; errors: string[] } {
    try {
      WebsiteValidationSchema.parse(website);
      return { valid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        };
      }
      return { valid: false, errors: ['Unknown validation error'] };
    }
  }

  validateSection(section: Section): { valid: boolean; errors: string[] } {
    try {
      SectionValidationSchema.parse(section);
      return { valid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        };
      }
      return { valid: false, errors: ['Unknown validation error'] };
    }
  }

  sanitizeWebsite(website: WebsiteStructure): WebsiteStructure {
    // Deep clone to avoid mutations
    const sanitized = JSON.parse(JSON.stringify(website));

    // Sanitize metadata
    sanitized.metadata.title = sanitized.metadata.title.trim().slice(0, 200);
    sanitized.metadata.description = sanitized.metadata.description.trim().slice(0, 500);

    // Ensure sections are properly ordered
    sanitized.sections = sanitized.sections
      .map((section: Section, index: number) => ({
        ...section,
        order: index,
      }))
      .sort((a: Section, b: Section) => a.order - b.order);

    return sanitized;
  }
}
