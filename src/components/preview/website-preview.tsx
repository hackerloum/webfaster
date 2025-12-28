'use client';

import { useEffect, useRef, useState } from 'react';
import { useWebsiteStore } from '@/store/website-store';
import { useEditorStore } from '@/store/editor-store';
import { HTMLGenerator } from '@/lib/services/html-generator';
import { ViewportControls } from './viewport-controls';

export function WebsitePreview() {
  const currentWebsite = useWebsiteStore((state) => state.currentWebsite);
  const { selectSection, viewportSize, zoomLevel } = useEditorStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (currentWebsite) {
      const generator = new HTMLGenerator();
      const generatedHTML = generator.generateFullHTML(currentWebsite);
      setHtml(generatedHTML);
    }
  }, [currentWebsite]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'section-clicked') {
        selectSection(event.data.sectionId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectSection]);

  const getViewportStyles = () => {
    const sizes = {
      desktop: { width: '100%', height: '100%' },
      tablet: { width: '768px', height: '1024px' },
      mobile: { width: '375px', height: '667px' },
    };
    return sizes[viewportSize];
  };

  if (!currentWebsite) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No website to preview</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <ViewportControls />

      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div
          style={{
            ...getViewportStyles(),
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'all 0.3s ease',
          }}
          className="bg-white shadow-2xl"
        >
          <iframe
            ref={iframeRef}
            srcDoc={html}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="Website Preview"
          />
        </div>
      </div>
    </div>
  );
}
