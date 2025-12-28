import { WebsiteStructure, Section } from '@/lib/types/website';

export class HTMLGenerator {
  generateFullHTML(website: WebsiteStructure): string {
    const css = this.generateCSS(website);
    const sectionsHTML = this.generateSections(website.sections);
    const interactivityScript = this.generateInteractivityScript();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${website.metadata.description}">
  <title>${website.metadata.title}</title>
  <style>${css}</style>
</head>
<body>
  ${sectionsHTML}
  <script>${interactivityScript}</script>
</body>
</html>`;
  }

  private generateCSS(website: WebsiteStructure): string {
    const { globalStyles } = website;

    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: ${globalStyles.typography.fontFamily};
        font-size: ${globalStyles.typography.fontSize.base};
        color: ${globalStyles.colorScheme.text};
        background-color: ${globalStyles.colorScheme.background};
        line-height: 1.6;
      }
      
      h1 { font-size: ${globalStyles.typography.fontSize.h1}; line-height: 1.2; margin-bottom: 1rem; }
      h2 { font-size: ${globalStyles.typography.fontSize.h2}; line-height: 1.3; margin-bottom: 0.875rem; }
      h3 { font-size: ${globalStyles.typography.fontSize.h3}; line-height: 1.4; margin-bottom: 0.75rem; }
      h4 { font-size: ${globalStyles.typography.fontSize.h4}; line-height: 1.5; margin-bottom: 0.625rem; }
      
      p { margin-bottom: 1rem; }
      
      a {
        color: ${globalStyles.colorScheme.primary};
        text-decoration: none;
        transition: opacity 0.2s;
      }
      
      a:hover {
        opacity: 0.8;
      }
      
      button, .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: ${globalStyles.colorScheme.primary};
        color: white;
        border: none;
        border-radius: 0.375rem;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      button:hover, .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 ${globalStyles.spacing.containerPadding};
      }
      
      section {
        margin-bottom: ${globalStyles.spacing.sectionGap};
      }
      
      [data-section-id] {
        position: relative;
        transition: outline 0.2s;
      }
      
      [data-section-id]:hover {
        outline: 2px dashed ${globalStyles.colorScheme.primary};
        outline-offset: 4px;
      }
      
      @media (max-width: 768px) {
        body {
          font-size: 14px;
        }
        h1 { font-size: 2rem; }
        h2 { font-size: 1.75rem; }
        h3 { font-size: 1.5rem; }
        h4 { font-size: 1.25rem; }
      }
    `;
  }

  private generateSections(sections: Section[]): string {
    return sections
      .filter((s) => s.visible)
      .sort((a, b) => a.order - b.order)
      .map((section) => this.generateSection(section))
      .join('\n');
  }

  private generateSection(section: Section): string {
    const styles = this.generateSectionStyles(section);

    switch (section.type) {
      case 'hero':
        return this.generateHeroSection(section, styles);
      case 'features':
        return this.generateFeaturesSection(section, styles);
      case 'about':
        return this.generateAboutSection(section, styles);
      case 'contact':
        return this.generateContactSection(section, styles);
      case 'footer':
        return this.generateFooterSection(section, styles);
      case 'services':
        return this.generateServicesSection(section, styles);
      case 'pricing':
        return this.generatePricingSection(section, styles);
      case 'testimonials':
        return this.generateTestimonialsSection(section, styles);
      case 'team':
        return this.generateTeamSection(section, styles);
      case 'cta':
        return this.generateCTASection(section, styles);
      case 'gallery':
        return this.generateGallerySection(section, styles);
      default:
        return this.generateCustomSection(section, styles);
    }
  }

  private generateSectionStyles(section: Section): string {
    const { styles } = section;
    let css = '';

    if (styles.backgroundColor) {
      css += `background-color: ${styles.backgroundColor};`;
    }
    if (styles.backgroundImage) {
      css += `background-image: url(${styles.backgroundImage}); background-size: cover; background-position: center; background-repeat: no-repeat;`;
    }
    if (styles.textColor) {
      css += `color: ${styles.textColor};`;
    }
    if (styles.padding) {
      const padding = styles.padding;
      css += `padding: ${padding.top || '0'} ${padding.right || '0'} ${padding.bottom || '0'} ${padding.left || '0'};`;
    }
    if (styles.margin) {
      const margin = styles.margin;
      css += `margin: ${margin.top || '0'} ${margin.right || '0'} ${margin.bottom || '0'} ${margin.left || '0'};`;
    }
    if (styles.borderRadius) {
      css += `border-radius: ${styles.borderRadius};`;
    }
    if (styles.boxShadow) {
      css += `box-shadow: ${styles.boxShadow};`;
    }
    if (styles.customCSS) {
      css += styles.customCSS;
    }

    return css;
  }

  private generateHeroSection(section: Section, styles: string): string {
    const { content } = section;
    const hasBackgroundImage = content.backgroundImage || content.image;
    const backgroundImage = content.backgroundImage || content.image;
    const imageAlt = content.imageAlt || content.alt || 'Hero image';
    
    // If there's a background image, add overlay for text readability
    const backgroundStyle = hasBackgroundImage 
      ? `background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImage}); background-size: cover; background-position: center; background-repeat: no-repeat; min-height: 80vh; display: flex; align-items: center;`
      : '';
    
    const textColor = hasBackgroundImage ? 'color: white;' : '';
    
    return `
      <section data-section-id="${section.id}" style="${styles} ${backgroundStyle}">
        <div class="container" style="text-align: center; padding: 5rem 1rem; width: 100%; ${textColor}">
          <h1 style="${textColor} text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${content.heading || 'Welcome'}</h1>
          <p style="font-size: 1.25rem; margin-bottom: 2rem; ${textColor} text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">${content.subheading || ''}</p>
          ${
            content.ctaText
              ? `<a href="${content.ctaLink || '#'}" class="btn" style="background-color: ${this.getPrimaryColor(section)}; color: white; padding: 1rem 2rem; font-size: 1.1rem; font-weight: 600; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">${content.ctaText}</a>`
              : ''
          }
          ${
            content.secondaryCtaText
              ? `<a href="${content.secondaryCtaLink || '#'}" style="margin-left: 1rem; padding: 1rem 2rem; border: 2px solid white; color: white; text-decoration: none; border-radius: 0.375rem; display: inline-block; font-weight: 600;">${content.secondaryCtaText}</a>`
              : ''
          }
        </div>
      </section>
    `;
  }
  
  private getPrimaryColor(section: Section): string {
    // Try to get primary color from section styles or default
    return '#3b82f6'; // Default blue
  }

  private generateFeaturesSection(section: Section, styles: string): string {
    const { content } = section;
    const features = content.features || [];

    return `
      <section data-section-id="${section.id}" style="${styles}">
        <div class="container" style="padding: 4rem 1rem;">
          <h2 style="text-align: center; margin-bottom: 3rem; font-size: 2.5rem; font-weight: 700;">${content.heading || 'Features'}</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${features
              .map(
                (feature: any) => {
                  const hasImage = feature.image || feature.icon;
                  const imageUrl = feature.image || feature.icon;
                  return `
              <div style="padding: 2rem; border-radius: 1rem; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s, box-shadow 0.3s; cursor: pointer;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 12px rgba(0,0,0,0.15)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)';">
                ${hasImage ? `<img src="${imageUrl}" alt="${feature.imageAlt || feature.title || 'Feature'}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1.5rem;" />` : ''}
                ${feature.icon ? `<div style="font-size: 3rem; margin-bottom: 1rem; text-align: center;">${feature.icon}</div>` : ''}
                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">${feature.title || ''}</h3>
                <p style="color: #6b7280; line-height: 1.6;">${feature.description || ''}</p>
              </div>
            `;
                }
              )
              .join('')}
          </div>
        </div>
      </section>
    `;
  }

  private generateAboutSection(section: Section, styles: string): string {
    const { content } = section;
    const hasImage = content.image || content.backgroundImage;
    const imageUrl = content.image || content.backgroundImage;
    const imageAlt = content.imageAlt || content.alt || 'About us';
    
    return `
      <section data-section-id="${section.id}" style="${styles}">
        <div class="container" style="padding: 4rem 1rem;">
          <div style="display: grid; grid-template-columns: ${hasImage ? '1fr 1fr' : '1fr'}; gap: 3rem; align-items: center;">
            ${hasImage ? `
            <div>
              <img src="${imageUrl}" alt="${imageAlt}" style="width: 100%; height: auto; border-radius: 1rem; box-shadow: 0 8px 16px rgba(0,0,0,0.1);" />
            </div>
            ` : ''}
            <div>
              <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1.5rem;">${content.heading || 'About Us'}</h2>
              <p style="font-size: 1.1rem; line-height: 1.8; color: #4b5563; margin-bottom: 1rem;">${content.text || content.description || ''}</p>
              ${content.mission ? `<p style="font-size: 1.1rem; line-height: 1.8; color: #4b5563; margin-top: 1.5rem;"><strong>Our Mission:</strong> ${content.mission}</p>` : ''}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private generateContactSection(section: Section, styles: string): string {
    const { content } = section;
    return `
      <section data-section-id="${section.id}" style="${styles}">
        <div class="container" style="padding: 4rem 1rem; max-width: 600px;">
          <h2 style="text-align: center; margin-bottom: 2rem;">${content.heading || 'Contact Us'}</h2>
          <form style="display: flex; flex-direction: column; gap: 1rem;">
            <input type="text" placeholder="Name" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <input type="email" placeholder="Email" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <textarea placeholder="Message" rows="5" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem;"></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>
    `;
  }

  private generateFooterSection(section: Section, styles: string): string {
    const { content } = section;
    return `
      <footer data-section-id="${section.id}" style="${styles} background-color: #1f2937; color: white;">
        <div class="container" style="padding: 3rem 1rem; text-align: center;">
          <p>${content.text || '© 2024 All rights reserved.'}</p>
        </div>
      </footer>
    `;
  }

  private generateServicesSection(section: Section, styles: string): string {
    const { content } = section;
    const services = content.services || content.items || [];
    
    return `
      <section data-section-id="${section.id}" style="${styles}">
        <div class="container" style="padding: 4rem 1rem;">
          ${content.heading ? `<h2 style="text-align: center; margin-bottom: 3rem; font-size: 2.5rem; font-weight: 700;">${content.heading}</h2>` : ''}
          ${content.subheading ? `<p style="text-align: center; font-size: 1.2rem; color: #6b7280; margin-bottom: 3rem; max-width: 700px; margin-left: auto; margin-right: auto;">${content.subheading}</p>` : ''}
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${services
              .map(
                (service: any) => `
              <div style="padding: 2.5rem; border-radius: 1rem; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s, box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 12px rgba(0,0,0,0.15)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)';">
                ${service.icon ? `<div style="font-size: 3rem; margin-bottom: 1rem; text-align: center;">${service.icon}</div>` : ''}
                ${service.image ? `<img src="${service.image}" alt="${service.imageAlt || service.title || 'Service'}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1.5rem;" />` : ''}
                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">${service.title || service.name || 'Service'}</h3>
                <p style="color: #6b7280; line-height: 1.6; margin-bottom: 1rem;">${service.description || ''}</p>
                ${service.price ? `<p style="font-size: 1.5rem; font-weight: 700; color: #3b82f6; margin-top: 1rem;">${service.price}</p>` : ''}
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </section>
    `;
  }

  private generatePricingSection(section: Section, styles: string): string {
    const { content } = section;
    const plans = content.plans || content.pricing || content.items || [];
    
    return `
      <section data-section-id="${section.id}" style="${styles}">
        <div class="container" style="padding: 4rem 1rem;">
          ${content.heading ? `<h2 style="text-align: center; margin-bottom: 1rem; font-size: 2.5rem; font-weight: 700;">${content.heading}</h2>` : ''}
          ${content.subheading ? `<p style="text-align: center; font-size: 1.2rem; color: #6b7280; margin-bottom: 3rem; max-width: 700px; margin-left: auto; margin-right: auto;">${content.subheading}</p>` : ''}
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto;">
            ${plans
              .map(
                (plan: any, index: number) => {
                  const isPopular = plan.popular || plan.featured || index === 1;
                  return `
              <div style="padding: 2.5rem; border-radius: 1rem; background: white; box-shadow: ${isPopular ? '0 8px 16px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)'}; border: ${isPopular ? '2px solid #3b82f6' : '2px solid transparent'}; transition: transform 0.3s, box-shadow 0.3s; position: relative;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 12px 20px rgba(0,0,0,0.2)';" onmouseout="this.style.transform=''; this.style.boxShadow='${isPopular ? '0 8px 16px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)'}';">">
                ${isPopular ? `<div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #3b82f6; color: white; padding: 0.25rem 1rem; border-radius: 1rem; font-size: 0.875rem; font-weight: 600;">Most Popular</div>` : ''}
                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; color: #1f2937;">${plan.name || plan.title || 'Plan'}</h3>
                <div style="margin-bottom: 1.5rem;">
                  <span style="font-size: 3rem; font-weight: 700; color: #1f2937;">${plan.price || '$0'}</span>
                  ${plan.period ? `<span style="color: #6b7280; font-size: 1rem;">/${plan.period}</span>` : ''}
                </div>
                ${plan.description ? `<p style="color: #6b7280; margin-bottom: 1.5rem; min-height: 3rem;">${plan.description}</p>` : ''}
                <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
                  ${(plan.features || plan.items || []).map((feature: string) => `<li style="padding: 0.5rem 0; color: #4b5563;"><span style="color: #10b981; margin-right: 0.5rem;">✓</span>${feature}</li>`).join('')}
                </ul>
                <a href="${plan.ctaLink || '#'}" class="btn" style="display: block; text-align: center; background-color: ${isPopular ? '#3b82f6' : '#6b7280'}; color: white; padding: 0.875rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='${isPopular ? '#2563eb' : '#4b5563}'" onmouseout="this.style.backgroundColor='${isPopular ? '#3b82f6' : '#6b7280}'">${plan.ctaText || plan.buttonText || 'Get Started'}</a>
              </div>
            `;
                }
              )
              .join('')}
          </div>
        </div>
      </section>
    `;
  }

  private generateTestimonialsSection(section: Section, styles: string): string {
    const { content } = section;
    const testimonials = content.testimonials || content.items || [];
    
    return `
      <section data-section-id="${section.id}" style="${styles}">
        <div class="container" style="padding: 4rem 1rem;">
          ${content.heading ? `<h2 style="text-align: center; margin-bottom: 3rem; font-size: 2.5rem; font-weight: 700;">${content.heading}</h2>` : ''}
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${testimonials
              .map(
                (testimonial: any) => `
              <div style="padding: 2rem; border-radius: 1rem; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                  ${testimonial.avatar || testimonial.image ? `<img src="${testimonial.avatar || testimonial.image}" alt="${testimonial.name || 'Customer'}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-right: 1rem;" />` : ''}
                  <div>
                    <h4 style="font-size: 1.125rem; font-weight: 600; color: #1f2937; margin-bottom: 0.25rem;">${testimonial.name || 'Customer'}</h4>
                    ${testimonial.role || testimonial.title ? `<p style="font-size: 0.875rem; color: #6b7280;">${testimonial.role || testimonial.title}</p>` : ''}
                  </div>
                </div>
                ${testimonial.rating ? `<div style="margin-bottom: 1rem; color: #fbbf24;">${'★'.repeat(Math.min(5, Math.max(1, testimonial.rating)))}</div>` : ''}
                <p style="color: #4b5563; line-height: 1.6; font-style: italic;">"${testimonial.text || testimonial.quote || testimonial.content || ''}"</p>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </section>
    `;
  }

  private generateTeamSection(section: Section, styles: string): string {
    const { content } = section;
    const members = content.members || content.team || content.items || [];
    
    return `
      <section data-section-id="${section.id}" style="${styles}">
        <div class="container" style="padding: 4rem 1rem;">
          ${content.heading ? `<h2 style="text-align: center; margin-bottom: 1rem; font-size: 2.5rem; font-weight: 700;">${content.heading}</h2>` : ''}
          ${content.subheading ? `<p style="text-align: center; font-size: 1.2rem; color: #6b7280; margin-bottom: 3rem; max-width: 700px; margin-left: auto; margin-right: auto;">${content.subheading}</p>` : ''}
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
            ${members
              .map(
                (member: any) => `
              <div style="text-align: center; padding: 1.5rem; border-radius: 1rem; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)';" onmouseout="this.style.transform='';">
                ${member.image || member.avatar ? `<img src="${member.image || member.avatar}" alt="${member.name || 'Team member'}" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem; display: block; border: 4px solid #e5e7eb;" />` : ''}
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #1f2937;">${member.name || 'Team Member'}</h3>
                ${member.role || member.title ? `<p style="font-size: 1rem; color: #3b82f6; margin-bottom: 0.5rem; font-weight: 500;">${member.role || member.title}</p>` : ''}
                ${member.bio || member.description ? `<p style="font-size: 0.875rem; color: #6b7280; line-height: 1.5; margin-top: 0.5rem;">${member.bio || member.description}</p>` : ''}
                ${member.social ? `<div style="margin-top: 1rem; display: flex; justify-content: center; gap: 0.75rem;">${Object.entries(member.social).map(([platform, url]: [string, any]) => `<a href="${url}" style="color: #6b7280; font-size: 1.25rem; text-decoration: none;">${platform === 'linkedin' ? '🔗' : platform === 'twitter' ? '🐦' : '📧'}</a>`).join('')}</div>` : ''}
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </section>
    `;
  }

  private generateCTASection(section: Section, styles: string): string {
    const { content } = section;
    
    return `
      <section data-section-id="${section.id}" style="${styles} background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
        <div class="container" style="padding: 5rem 1rem; text-align: center;">
          ${content.heading ? `<h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; color: white;">${content.heading}</h2>` : ''}
          ${content.subheading || content.text ? `<p style="font-size: 1.25rem; margin-bottom: 2rem; color: rgba(255,255,255,0.9); max-width: 700px; margin-left: auto; margin-right: auto;">${content.subheading || content.text || ''}</p>` : ''}
          ${content.ctaText ? `
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <a href="${content.ctaLink || '#'}" class="btn" style="background-color: white; color: #667eea; padding: 1rem 2.5rem; font-size: 1.125rem; font-weight: 600; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 4px 6px rgba(0,0,0,0.2); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='';">${content.ctaText}</a>
              ${content.secondaryCtaText ? `<a href="${content.secondaryCtaLink || '#'}" style="padding: 1rem 2.5rem; border: 2px solid white; color: white; text-decoration: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 600; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)';" onmouseout="this.style.backgroundColor='transparent';">${content.secondaryCtaText}</a>` : ''}
            </div>
          ` : ''}
        </div>
      </section>
    `;
  }

  private generateGallerySection(section: Section, styles: string): string {
    const { content } = section;
    const images = content.images || content.items || [];
    
    return `
      <section data-section-id="${section.id}" style="${styles}">
        <div class="container" style="padding: 4rem 1rem;">
          ${content.heading ? `<h2 style="text-align: center; margin-bottom: 3rem; font-size: 2.5rem; font-weight: 700;">${content.heading}</h2>` : ''}
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
            ${images
              .map(
                (image: any) => {
                  const imageUrl = typeof image === 'string' ? image : (image.url || image.src || image.image);
                  const imageAlt = typeof image === 'string' ? 'Gallery image' : (image.alt || image.caption || 'Gallery image');
                  return `
              <div style="position: relative; overflow: hidden; border-radius: 0.5rem; aspect-ratio: 1; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)';" onmouseout="this.style.transform='';">
                <img src="${imageUrl}" alt="${imageAlt}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            `;
                }
              )
              .join('')}
          </div>
        </div>
      </section>
    `;
  }

  private generateCustomSection(section: Section, styles: string): string {
    const { content } = section;
    
    // If there's HTML content, use it
    if (content.html) {
      return `
        <section data-section-id="${section.id}" style="${styles}">
          <div class="container" style="padding: 4rem 1rem;">
            ${content.html}
          </div>
        </section>
      `;
    }
    
    // Otherwise, try to generate content from the content object
    let htmlContent = '';
    
    if (content.heading) {
      htmlContent += `<h2 style="text-align: center; margin-bottom: 1.5rem; font-size: 2.5rem; font-weight: 700;">${content.heading}</h2>`;
    }
    
    if (content.subheading) {
      htmlContent += `<p style="text-align: center; font-size: 1.2rem; color: #6b7280; margin-bottom: 2rem; max-width: 700px; margin-left: auto; margin-right: auto;">${content.subheading}</p>`;
    }
    
    if (content.text || content.description) {
      htmlContent += `<p style="font-size: 1.1rem; line-height: 1.8; color: #4b5563; margin-bottom: 1rem;">${content.text || content.description}</p>`;
    }
    
    if (content.items && Array.isArray(content.items)) {
      htmlContent += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 2rem;">';
      content.items.forEach((item: any) => {
        htmlContent += `
          <div style="padding: 1.5rem; border-radius: 0.5rem; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${item.title ? `<h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #1f2937;">${item.title}</h3>` : ''}
            ${item.description ? `<p style="color: #6b7280; line-height: 1.6;">${item.description}</p>` : ''}
            ${item.image ? `<img src="${item.image}" alt="${item.imageAlt || item.title || 'Item'}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 0.5rem; margin-top: 1rem;" />` : ''}
          </div>
        `;
      });
      htmlContent += '</div>';
    }
    
    if (content.ctaText) {
      htmlContent += `
        <div style="text-align: center; margin-top: 2rem;">
          <a href="${content.ctaLink || '#'}" class="btn" style="display: inline-block; background-color: #3b82f6; color: white; padding: 1rem 2rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600;">${content.ctaText}</a>
        </div>
      `;
    }
    
    // If we still have no content, show a helpful message
    if (!htmlContent) {
      htmlContent = '<p style="text-align: center; color: #9ca3af; font-style: italic;">This section needs content. Please edit it to add your content.</p>';
    }
    
    return `
      <section data-section-id="${section.id}" style="${styles}">
        <div class="container" style="padding: 4rem 1rem;">
          ${htmlContent}
        </div>
      </section>
    `;
  }

  private generateInteractivityScript(): string {
    return `
      document.addEventListener('DOMContentLoaded', function() {
        // Prevent all link navigation
        document.querySelectorAll('a').forEach(function(link) {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // If it's a hash link, just scroll within the page
            if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
              const targetId = link.getAttribute('href').substring(1);
              const targetElement = document.getElementById(targetId);
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
              }
            }
            return false;
          });
          // Make links look clickable but non-functional
          link.style.cursor = 'pointer';
        });

        // Prevent all form submissions
        document.querySelectorAll('form').forEach(function(form) {
          form.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            alert('Form submission is disabled in preview mode.');
            return false;
          });
        });

        // Prevent button navigation (if buttons have onclick that navigates)
        document.querySelectorAll('button').forEach(function(button) {
          button.addEventListener('click', function(e) {
            // Only prevent if it's a link button or has navigation
            if (button.getAttribute('onclick') && button.getAttribute('onclick').includes('window.location')) {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
          });
        });

        // Section selection for editor
        document.querySelectorAll('[data-section-id]').forEach(function(section) {
          section.addEventListener('click', function(e) {
            // Only send message if clicking on the section itself, not on interactive elements
            if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && !e.target.closest('a') && !e.target.closest('button') && !e.target.closest('form')) {
              window.parent.postMessage({
                type: 'section-clicked',
                sectionId: section.getAttribute('data-section-id')
              }, '*');
            }
          });
          
          section.addEventListener('mouseenter', function(e) {
            if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON' && !e.target.closest('a') && !e.target.closest('button')) {
              window.parent.postMessage({
                type: 'section-hovered',
                sectionId: section.getAttribute('data-section-id')
              }, '*');
            }
          });
          
          section.addEventListener('mouseleave', function() {
            window.parent.postMessage({
              type: 'section-hover-end',
              sectionId: null
            }, '*');
          });
        });

        // Prevent any window.location changes
        // Use try-catch since location might already be defined
        try {
          const originalLocation = window.location;
          Object.defineProperty(window, 'location', {
            get: function() { return originalLocation; },
            set: function() { console.log('Navigation blocked in preview mode'); }
          });
        } catch (e) {
          // Location property might not be redefinable, which is fine
          // We'll rely on event prevention instead
          console.log('Could not override location (expected in some browsers)');
        }
        
        // Override location methods as a fallback
        if (window.location.assign) {
          window.location.assign = function() { console.log('Navigation blocked in preview mode'); };
        }
        if (window.location.replace) {
          window.location.replace = function() { console.log('Navigation blocked in preview mode'); };
        }
        if (window.location.reload) {
          window.location.reload = function() { console.log('Navigation blocked in preview mode'); };
        }
      });
    `;
  }
}
