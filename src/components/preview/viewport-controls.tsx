'use client';

import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { Button } from '@/components/ui/button';

export function ViewportControls() {
  const { viewportSize, setViewportSize, zoomLevel, setZoomLevel } = useEditorStore();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={viewportSize === 'desktop' ? 'default' : 'ghost'}
          onClick={() => setViewportSize('desktop')}
        >
          <Monitor className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={viewportSize === 'tablet' ? 'default' : 'ghost'}
          onClick={() => setViewportSize('tablet')}
        >
          <Tablet className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={viewportSize === 'mobile' ? 'default' : 'ghost'}
          onClick={() => setViewportSize('mobile')}
        >
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Zoom:</span>
        <select
          value={zoomLevel}
          onChange={(e) => setZoomLevel(Number(e.target.value))}
          className="px-2 py-1 text-sm border border-gray-200 rounded"
        >
          <option value={50}>50%</option>
          <option value={75}>75%</option>
          <option value={100}>100%</option>
          <option value={125}>125%</option>
          <option value={150}>150%</option>
        </select>
      </div>
    </div>
  );
}
