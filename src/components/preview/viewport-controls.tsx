'use client';

import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { Button } from '@/components/ui/button';

export function ViewportControls() {
  const { viewportSize, setViewportSize, zoomLevel, setZoomLevel } = useEditorStore();

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between px-3 md:px-6 py-2 md:py-3 bg-[#111118] border-b border-white/10 gap-2 md:gap-0">
      <div className="flex items-center gap-1 md:gap-2">
        <Button
          size="sm"
          variant={viewportSize === 'desktop' ? 'default' : 'ghost'}
          onClick={() => setViewportSize('desktop')}
          className={`p-2 md:px-3 ${
            viewportSize === 'desktop'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          title="Desktop"
        >
          <Monitor className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={viewportSize === 'tablet' ? 'default' : 'ghost'}
          onClick={() => setViewportSize('tablet')}
          className={`p-2 md:px-3 ${
            viewportSize === 'tablet'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          title="Tablet"
        >
          <Tablet className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={viewportSize === 'mobile' ? 'default' : 'ghost'}
          onClick={() => setViewportSize('mobile')}
          className={`p-2 md:px-3 ${
            viewportSize === 'mobile'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          title="Mobile"
        >
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <span className="text-xs md:text-sm text-white/70">Zoom:</span>
        <select
          value={zoomLevel}
          onChange={(e) => setZoomLevel(Number(e.target.value))}
          className="px-2 md:px-3 py-1.5 text-xs md:text-sm bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        >
          <option value={50} className="bg-[#111118]">50%</option>
          <option value={75} className="bg-[#111118]">75%</option>
          <option value={100} className="bg-[#111118]">100%</option>
          <option value={125} className="bg-[#111118]">125%</option>
          <option value={150} className="bg-[#111118]">150%</option>
        </select>
      </div>
    </div>
  );
}
