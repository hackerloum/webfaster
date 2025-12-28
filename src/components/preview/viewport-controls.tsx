'use client';

import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { Button } from '@/components/ui/button';

export function ViewportControls() {
  const { viewportSize, setViewportSize, zoomLevel, setZoomLevel } = useEditorStore();

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-[#111118] border-b border-white/10">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={viewportSize === 'desktop' ? 'default' : 'ghost'}
          onClick={() => setViewportSize('desktop')}
          className={
            viewportSize === 'desktop'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }
        >
          <Monitor className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={viewportSize === 'tablet' ? 'default' : 'ghost'}
          onClick={() => setViewportSize('tablet')}
          className={
            viewportSize === 'tablet'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }
        >
          <Tablet className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={viewportSize === 'mobile' ? 'default' : 'ghost'}
          onClick={() => setViewportSize('mobile')}
          className={
            viewportSize === 'mobile'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }
        >
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-white/70">Zoom:</span>
        <select
          value={zoomLevel}
          onChange={(e) => setZoomLevel(Number(e.target.value))}
          className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
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
