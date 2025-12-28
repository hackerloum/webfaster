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
      css += `background-image: url(${styles.backgroundImage}); background-size: cover; background-position: center;`;
    }
    if (styles.textColor) {
      css += `color: ${styles.textColor};`;
    }
    if (styles.padding) {
      css += `padding: ${styles.padding.top} ${styles.padding.right} ${styles.padding.bottom} ${styles.padding.left};`;
    }
    if (styles.margin) {
      css += `margin: ${styles.margin.top} ${styles.margin.right} ${styles.margin.bottom} ${styles.margin.left};`;
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

  private generateCustomSection(section: Section, styles: string): string {
    const { content } = section;
    return `
      <section data-section-id="${section.id}" style="${styles}">
        <div class="container" style="padding: 4rem 1rem;">
          ${content.html || '<p>Custom section content</p>'}
        </div>
      </section>
    `;
  }

  private generateInteractivityScript(): string {
    return `
      document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('[data-section-id]').forEach(function(section) {
          section.addEventListener('click', function(e) {
            window.parent.postMessage({
              type: 'section-clicked',
              sectionId: section.getAttribute('data-section-id')
            }, '*');
          });
          
          section.addEventListener('mouseenter', function() {
            window.parent.postMessage({
              type: 'section-hovered',
              sectionId: section.getAttribute('data-section-id')
            }, '*');
          });
          
          section.addEventListener('mouseleave', function() {
            window.parent.postMessage({
              type: 'section-hover-end',
              sectionId: null
            }, '*');
          });
        });
      });
    `;
  }
}
