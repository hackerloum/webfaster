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

RESPONSIVE DESIGN REQUIREMENTS (CRITICAL - MUST FOLLOW):
1. **Mobile-First Approach**: Always design for mobile (320px+) first, then enhance for tablets and desktops
2. **Breakpoints**: Use standard breakpoints:
   - Mobile: 320px - 767px (default, no media query needed)
   - Tablet: 768px - 1023px (@media (min-width: 768px))
   - Desktop: 1024px+ (@media (min-width: 1024px))
3. **Typography Scaling**:
   - Mobile: Smaller font sizes (h1: 2rem, h2: 1.5rem, base: 14-16px)
   - Desktop: Larger font sizes (h1: 3-4rem, h2: 2.5rem, base: 16-18px)
4. **Layout Responsiveness**:
   - Grid columns: Use CSS Grid with auto-fit and minmax for responsive columns
   - Example: grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))
   - Mobile: Single column (1fr), Tablet: 2 columns, Desktop: 3-4 columns
5. **Spacing & Padding**:
   - Mobile: Smaller padding (1-2rem vertical, 1rem horizontal)
   - Desktop: Larger padding (4-6rem vertical, 2rem horizontal)
   - Use relative units (rem, em, %) instead of fixed pixels where possible
6. **Images**:
   - Always use responsive images: width: 100%, height: auto, object-fit: cover
   - Use max-width: 100% to prevent overflow
   - Ensure images scale properly on all screen sizes
7. **Buttons & CTAs**:
   - Mobile: Full width or near-full width buttons for easy tapping
   - Desktop: Auto-width buttons
   - Minimum touch target: 44px x 44px on mobile
8. **Navigation & Menus**:
   - Mobile: Hamburger menu, stacked navigation
   - Desktop: Horizontal navigation
9. **Section Heights**:
   - Hero sections: 100vh on desktop, auto/min-height on mobile
   - Other sections: Auto height based on content
10. **Container Widths**:
    - Mobile: Full width with padding (padding: 1rem)
    - Desktop: Max-width container (max-width: 1200px, margin: 0 auto)
11. **Touch-Friendly**:
    - Larger tap targets on mobile (minimum 44px)
    - Adequate spacing between clickable elements
    - No hover-only interactions (always provide click alternative)
12. **Viewport Meta Tag**: Always include: <meta name="viewport" content="width=device-width, initial-scale=1.0">

CONTENT GUIDELINES:
- Generate REAL, relevant content (never use "lorem ipsum" or placeholder text)
- Content should be specific to the user's request and industry
- Use compelling headlines that grab attention
- Write clear, concise copy that communicates value
- Include appropriate CTAs (Call-to-Actions) with action-oriented text
- Make content scannable with bullet points, short paragraphs, and clear sections

IMAGE REQUIREMENTS:
- ALWAYS include images in hero sections (use high-quality, verified working URLs)
- Use ONLY these verified Unsplash image URLs (they are guaranteed to work):
  * Tech/Business: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop"
  * Business/Office: "https://images.unsplash.com/photo-1497366216548-37526070097c?w=1920&h=1080&fit=crop"
  * Modern Workspace: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&h=1080&fit=crop"
  * Food/Restaurant: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop"
  * Nature/Outdoor: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop"
  * Fashion/Style: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=1080&fit=crop"
  * Healthcare/Medical: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1920&h=1080&fit=crop"
  * Education: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&h=1080&fit=crop"
  * Creative/Design: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=1920&h=1080&fit=crop"
  * Fitness/Sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop"
- For feature sections: Use smaller versions (w=800&h=600) of the above URLs
- For about sections: Use portrait-oriented images (w=800&h=1000)
- For gallery sections: Use multiple verified Unsplash URLs
- NEVER use placeholder.com or via.placeholder.com - they are unreliable
- NEVER make up photo IDs - only use the verified URLs above
- Always set imageAlt text for accessibility
- Choose the most contextually relevant image from the list above

SECTION TYPES & BEST PRACTICES:

**Hero Section:**
- Large, attention-grabbing headline (8-12 words max)
- Compelling subheadline that explains value proposition
- Clear primary CTA button
- MUST include: backgroundImage in content (use ONLY verified URLs from the IMAGE REQUIREMENTS list above)
- Optional: Secondary CTA, overlay gradient for text readability
- Background: Use backgroundImage with optional gradient overlay
- Responsive Height: min-height: 100vh on desktop, min-height: 70vh on tablet, min-height: 60vh on mobile
- Responsive Padding: padding: 5rem 2rem on desktop, padding: 4rem 1.5rem on tablet, padding: 3rem 1rem on mobile
- Text Alignment: Center-aligned, responsive font sizes (h1: 3rem desktop, 2rem mobile)
- CTA Buttons: Full-width on mobile (width: 100%), auto-width on desktop
- Example: For tech/business use "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop"

**Features Section:**
- 3-6 feature cards with icons/illustrations
- Each feature: Icon/image URL, title (3-5 words), description (1-2 sentences)
- Include image URLs for each feature using verified Unsplash URLs (use w=800&h=600 for feature images)
- Responsive Grid Layout: 
  * Desktop (1024px+): 3 columns (grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)))
  * Tablet (768px-1023px): 2 columns (auto-fit handles this)
  * Mobile (<768px): 1 column (auto-fit handles this)
- Responsive Padding: padding: 4rem 2rem on desktop, padding: 3rem 1.5rem on tablet, padding: 2rem 1rem on mobile
- Card Styling: Consistent styling with hover effects (desktop only), shadows, rounded corners
- Responsive Images: width: 100%, height: auto, object-fit: cover
- Example feature images: Use variations of the verified URLs from IMAGE REQUIREMENTS with w=800&h=600

**About Section:**
- Company/person story (2-3 paragraphs)
- Mission/vision statements
- Key achievements or milestones
- Team photos or company values
- Can include stats/metrics
- Responsive Layout:
  * Desktop: 2-column grid (image + text side by side)
  * Mobile: Single column (image above text, stacked)
- Responsive Images: width: 100%, max-width: 100%, height: auto
- Responsive Padding: padding: 4rem 2rem on desktop, padding: 3rem 1.5rem on tablet, padding: 2rem 1rem on mobile
- Text: Responsive font sizes, proper line-height for readability

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

**Contact Section (CRITICAL - Must be Professional):**
- Professional heading: "Get in Touch", "Contact Us", or "Let's Connect"
- Compelling subheading explaining why they should contact (e.g., "We'd love to hear from you", "Ready to start your project?")
- Contact form with professional styling:
  * Name field (required, placeholder: "Your Name")
  * Email field (required, placeholder: "your.email@example.com")
  * Phone field (optional, placeholder: "+1 (555) 000-0000")
  * Subject field (optional, placeholder: "How can we help?")
  * Message field (required, placeholder: "Tell us about your project...", rows: 5-6)
  * Professional submit button text: "Send Message", "Submit", or "Get Started"
- Contact information display (choose 2-3):
  * Business address (formatted professionally)
  * Phone number (formatted: +1 (555) 123-4567)
  * Email address (professional domain)
  * Business hours (e.g., "Monday - Friday: 9:00 AM - 6:00 PM EST")
- Social media links (if applicable): LinkedIn, Twitter, Facebook, Instagram
- Professional color scheme: Usually darker background (#1f2937, #111827) with light text, or light background with dark text
- Include trust indicators: "We respond within 24 hours", "Secure & Confidential", etc.
- Layout: Split layout (form on left/right, contact info on opposite side) OR centered form with contact info below
- Spacing: Generous padding (4-6rem vertical, 2-3rem horizontal)
- Visual elements: Subtle background pattern, gradient, or professional image

**Footer (CRITICAL - Must be Enterprise-Grade):**
- Professional multi-column layout (3-4 columns on desktop, stacked on mobile)
- Column 1 - Brand/Company Info:
  * Company/Website name (bold, prominent)
  * Tagline or brief description (1-2 sentences, professional)
  * Social media icons (LinkedIn, Twitter, Facebook, Instagram, etc.)
- Column 2 - Quick Links:
  * "Product" or "Services" heading
  * 4-6 relevant links (Features, Pricing, About, Blog, etc.)
- Column 3 - Company/Support:
  * "Company" or "Support" heading
  * Links: About Us, Careers, Contact, Help Center, Documentation, etc.
- Column 4 - Legal/Resources (optional):
  * "Legal" or "Resources" heading
  * Links: Privacy Policy, Terms of Service, Cookie Policy, Sitemap, etc.
- Bottom section (full width):
  * Horizontal divider/line
  * Copyright notice: "© [Current Year] [Company Name]. All rights reserved."
  * Additional legal text if needed
  * Optional: Newsletter signup with email input and subscribe button
- Professional styling:
  * Dark background (#0f172a, #1e293b, or #111827) with light text
  * Subtle borders/separators between sections
  * Hover effects on links (color change, underline)
  * Consistent spacing and typography
  * Responsive: Stacks vertically on mobile
- Content must be REAL and relevant - no placeholder links
- Professional typography: Clear hierarchy, readable font sizes (14-16px for body, 18-20px for headings)

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
You MUST return ONLY valid JSON matching this exact structure. Do NOT include markdown code blocks, explanations, or any text outside the JSON object. Start directly with the opening brace { and end with the closing brace }.
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
        // For hero: heading, subheading, ctaText, ctaLink, backgroundImage, imageAlt
        // For features: heading, features: [{title, description, image, icon}]
        // For about: heading, description, image, imageAlt
        // ALWAYS include image URLs where appropriate
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
2. Always include a hero section as the first section WITH a backgroundImage (MANDATORY - never skip this)
3. Always include a footer as the last section
4. Content must be REAL and relevant (no placeholders)
5. Use appropriate section types based on the user's request
6. Ensure logical flow: hero → about/features → services → testimonials → contact → footer
7. Colors must be valid hex codes
8. All text must be in English unless user specifies otherwise
9. Make content compelling and conversion-focused
10. RESPONSIVE DESIGN IS MANDATORY: Every section MUST work perfectly on mobile (320px+), tablet (768px+), and desktop (1024px+)
11. ALWAYS include images: hero sections MUST have backgroundImage in content object (e.g., "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop"), features should have images for each feature
12. Use high-quality image URLs from Unsplash or similar (e.g., "https://images.unsplash.com/photo-[ID]?w=1200&h=600&fit=crop")
13. Include proper styling: gradients, shadows, rounded corners, hover effects (desktop only)
14. Make sections visually appealing with proper spacing, typography, and color contrast
15. For hero sections: The content object MUST include "backgroundImage" field with a valid image URL - this is non-negotiable
16. Image URLs must be real, accessible URLs (use Unsplash photo IDs or similar services)
17. RESPONSIVE PADDING: Use responsive padding values in styles (smaller on mobile, larger on desktop)
18. RESPONSIVE FONT SIZES: Ensure font sizes scale appropriately for mobile vs desktop
19. RESPONSIVE GRIDS: Use CSS Grid with auto-fit and minmax for all grid layouts
20. TOUCH-FRIENDLY: Ensure all interactive elements are at least 44px x 44px on mobile

RESPONSIVE DESIGN CHECKLIST (Must follow for every section):
- ✅ Uses responsive grid/flexbox layouts (auto-fit, minmax, flex-wrap)
- ✅ Padding scales: 1-2rem mobile, 3-4rem tablet, 4-6rem desktop
- ✅ Font sizes scale: smaller on mobile, larger on desktop
- ✅ Images use width: 100%, max-width: 100%, height: auto
- ✅ Buttons are full-width on mobile, auto-width on desktop
- ✅ Text is readable and properly sized for each breakpoint
- ✅ No horizontal scrolling on any device
- ✅ Proper spacing between elements on all screen sizes
- ✅ Touch targets are at least 44px on mobile

Remember: Quality over quantity. Create a website that looks like it was designed by a top-tier agency. NEVER generate a hero section without a backgroundImage. EVERY website MUST be fully responsive and work perfectly on mobile, tablet, and desktop devices.`;
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
      let enhancedPrompt = this.enhancePrompt(prompt, options);

      const client = getOpenAIClient();
      
      // Use gpt-4.1 as default, with fallback to gpt-5.2
      const primaryModel = process.env.OPENAI_MODEL || 'gpt-4.1';
      const fallbackModel = 'gpt-5.2';
      
      const requestConfig: any = {
        model: primaryModel,
        messages: [
          { role: 'system', content: this.buildSystemPrompt() },
          { role: 'user', content: enhancedPrompt },
        ],
        temperature: 0.7, // Balanced for creativity and consistency
        max_tokens: 6000, // Increased for more detailed responses
      };
      
      // Note: Not using JSON mode to avoid compatibility issues
      // We'll parse JSON from the response text instead (more reliable)
      
      let response;
      try {
        response = await client.chat.completions.create(requestConfig);
      } catch (modelError: any) {
        // If primary model fails, try fallback
        if (modelError?.code === 'model_not_found' || modelError?.message?.includes('model')) {
          console.warn(`Model ${primaryModel} not available, trying ${fallbackModel}`);
          requestConfig.model = fallbackModel;
          response = await client.chat.completions.create(requestConfig);
        } else {
          throw modelError;
        }
      }

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
      const systemPrompt = `You are an expert web designer with 15+ years of experience. Modify the provided section according to the user's instruction while maintaining design consistency and quality.

CRITICAL RULES:
- Preserve the section's ID exactly as provided (do not change it)
- Preserve the section's order exactly as provided (do not change it)
- Maintain the section type (do not change it)
- Follow the EXACT same JSON structure as the input section
- Ensure all required fields are present
- If adding images, use high-quality placeholder URLs (e.g., "https://images.unsplash.com/photo-[ID]?w=1200&h=600&fit=crop")
- Apply the user's instruction precisely while keeping the structure intact
- Return ONLY the modified section as valid JSON (no markdown, no explanations, no code blocks)
- Start directly with { and end with }
- The content object must maintain its structure (e.g., if it has "heading", "subheading", "features", etc., keep those keys)
- The styles object must maintain its structure (e.g., if it has "backgroundColor", "padding", etc., keep those keys)

RESPONSIVE DESIGN (CRITICAL - MUST MAINTAIN):
- When modifying sections, ALWAYS maintain responsive design
- Keep responsive padding values (smaller on mobile, larger on desktop)
- Keep responsive font sizes (mobile: smaller, desktop: larger)
- Keep responsive grid layouts (use auto-fit, minmax for flexibility)
- Ensure images remain responsive (width: 100%, max-width: 100%, height: auto)
- Keep buttons touch-friendly on mobile (full-width or minimum 44px)
- Do NOT remove responsive CSS classes or inline styles
- Maintain mobile-first approach in all modifications

IMAGE HANDLING (CRITICAL):
- For hero sections: If user asks to add an image, add "backgroundImage" to the content object with a VERIFIED Unsplash URL
- Use ONLY these verified URLs (they are guaranteed to work):
  * Tech/Business: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop"
  * Business/Office: "https://images.unsplash.com/photo-1497366216548-37526070097c?w=1920&h=1080&fit=crop"
  * Modern Workspace: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&h=1080&fit=crop"
  * Food/Restaurant: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop"
  * Nature/Outdoor: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop"
  * Fashion/Style: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=1080&fit=crop"
  * Healthcare/Medical: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1920&h=1080&fit=crop"
  * Education: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&h=1080&fit=crop"
  * Creative/Design: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=1920&h=1080&fit=crop"
  * Fitness/Sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop"
- For hero sections, you can also add "image" or "imageAlt" fields if needed
- For feature sections: Add "image" to each feature object (use w=800&h=600 versions of the above URLs)
- For about sections: Add "image" to the content object (use w=800&h=1000 for portraits)
- NEVER make up photo IDs or use unverified URLs
- Choose the most contextually relevant image from the verified list above

OUTPUT FORMAT:
Return the complete section object with ALL fields, including:
- id (must match original exactly)
- type (must match original exactly)
- order (must match original exactly)
- content (modified according to instruction, but keep the same structure and keys)
- styles (modified according to instruction, but keep the same structure and keys)
- visible (preserve original value)

EXAMPLE - Adding image to hero section:
If the original section has:
{
  "id": "abc123",
  "type": "hero",
  "content": { "heading": "Hello", "subheading": "World" },
  "styles": { "backgroundColor": "#fff", "padding": { "top": "2rem" } }
}

And user says "add an image to the hero section", return:
{
  "id": "abc123",
  "type": "hero",
  "content": { 
    "heading": "Hello", 
    "subheading": "World",
    "backgroundImage": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop",
    "imageAlt": "Hero background image"
  },
  "styles": { "backgroundColor": "#fff", "padding": { "top": "2rem" } }
}

EXAMPLE - Modifying styles:
If user says "make heading larger and change background to blue", return:
{
  "id": "abc123",
  "type": "hero",
  "content": { "heading": "Hello", "subheading": "World" },
  "styles": { "backgroundColor": "#0000ff", "padding": { "top": "2rem" } }
}`;

      const userPrompt = `Current section (modify this according to the instruction):
${JSON.stringify(section, null, 2)}

User instruction: ${instruction}

IMPORTANT: Return the COMPLETE modified section as JSON. Include ALL fields (id, type, order, content, styles, visible). The id, type, and order must remain exactly the same. Only modify content and styles according to the instruction.`;

      const client = getOpenAIClient();
      const model = process.env.OPENAI_MODEL || 'gpt-4.1';
      const supportsJsonMode = ['gpt-4.1', 'gpt-5.2', 'gpt-4-turbo-preview', 'gpt-4-0125-preview', 'gpt-4-1106-preview', 'gpt-4o', 'gpt-4o-mini'].includes(model);
      
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
      } catch (parseError) {
        // Try to extract JSON from markdown code blocks or text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedContent = JSON.parse(jsonMatch[0]);
          } catch {
            throw new Error('Failed to parse JSON from response');
          }
        } else {
          throw new Error('No valid JSON found in response');
        }
      }

      // Validate that we got a section object
      if (!parsedContent || typeof parsedContent !== 'object') {
        throw new Error('Invalid response format: expected section object');
      }

      // Log the parsed content for debugging
      console.log('Parsed AI response:', parsedContent);
      console.log('Original section:', section);

      // Deep merge content and styles to preserve structure
      // This ensures new fields are added while preserving existing ones
      const mergedContent = parsedContent.content 
        ? { 
            ...section.content, 
            ...parsedContent.content,
            // Explicitly preserve image fields if they exist in either original or new
            backgroundImage: parsedContent.content.backgroundImage || section.content.backgroundImage || parsedContent.content.image || section.content.image,
            image: parsedContent.content.image || section.content.image || parsedContent.content.backgroundImage || section.content.backgroundImage,
            imageAlt: parsedContent.content.imageAlt || section.content.imageAlt || parsedContent.content.alt || section.content.alt,
          }
        : section.content;
      
      const mergedStyles = parsedContent.styles
        ? {
            ...section.styles,
            ...parsedContent.styles,
            // Deep merge padding and margin if they exist
            padding: parsedContent.styles.padding 
              ? { ...section.styles.padding, ...parsedContent.styles.padding }
              : section.styles.padding,
            margin: parsedContent.styles.margin
              ? { ...section.styles.margin, ...parsedContent.styles.margin }
              : section.styles.margin,
          }
        : section.styles;

      // Ensure required fields are present and preserve critical fields
      const modifiedSection: Section = {
        id: section.id, // CRITICAL: Always preserve original ID
        type: section.type, // CRITICAL: Always preserve original type
        order: section.order, // CRITICAL: Always preserve original order
        content: mergedContent, // Use merged content
        styles: mergedStyles, // Use merged styles
        visible: parsedContent.visible !== undefined ? parsedContent.visible : section.visible, // Use modified or fallback to original
        metadata: {
          generatedByAI: section.metadata?.generatedByAI ?? true,
          lastEditedAt: new Date(),
          editHistory: [
            ...(section.metadata?.editHistory || []),
            {
              timestamp: new Date(),
              type: 'ai' as const,
              description: instruction,
              changes: { 
                content: parsedContent.content ? Object.keys(parsedContent.content) : [],
                styles: parsedContent.styles ? Object.keys(parsedContent.styles) : [],
              },
            },
          ],
        },
      };

      // Validate the section structure
      if (!modifiedSection.content || typeof modifiedSection.content !== 'object') {
        console.error('Invalid content:', modifiedSection.content);
        throw new Error('Modified section has invalid content');
      }
      
      if (!modifiedSection.styles || typeof modifiedSection.styles !== 'object') {
        console.error('Invalid styles:', modifiedSection.styles);
        throw new Error('Modified section has invalid styles');
      }

      console.log('Final modified section:', modifiedSection);
      return modifiedSection;
    } catch (error) {
      console.error('AI Modification Error:', error);
      throw new Error('Failed to modify section. Please try again.');
    }
  }

  async suggestImprovements(section: Section): Promise<string[]> {
    try {
      const client = getOpenAIClient();
      const model = process.env.OPENAI_MODEL || 'gpt-4.1';
      const supportsJsonMode = ['gpt-4.1', 'gpt-5.2', 'gpt-4-turbo-preview', 'gpt-4-0125-preview', 'gpt-4-1106-preview', 'gpt-4o', 'gpt-4o-mini'].includes(model);
      
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
