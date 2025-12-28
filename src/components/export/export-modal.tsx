'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWebsiteStore } from '@/store/website-store';
import { ExportService } from '@/lib/services/export-service';
import { toast } from 'react-hot-toast';
import { Download } from 'lucide-react';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const currentWebsite = useWebsiteStore((state) => state.currentWebsite);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'zip' | 'html' | 'json') => {
    if (!currentWebsite) return;

    setIsExporting(true);
    try {
      const exportService = new ExportService();

      switch (format) {
        case 'zip':
          const zipBlob = await exportService.exportAsZip(currentWebsite);
          exportService.downloadFile(
            zipBlob,
            `${currentWebsite.metadata.title.replace(/\s+/g, '-')}.zip`,
            'application/zip'
          );
          break;
        case 'html':
          const html = exportService.exportAsHTML(currentWebsite);
          exportService.downloadFile(html, `${currentWebsite.metadata.title.replace(/\s+/g, '-')}.html`, 'text/html');
          break;
        case 'json':
          const json = exportService.exportAsJSON(currentWebsite);
          exportService.downloadFile(json, `${currentWebsite.metadata.title.replace(/\s+/g, '-')}.json`, 'application/json');
          break;
      }

      toast.success('Export successful!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Website</DialogTitle>
          <DialogDescription>Choose a format to export your website</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-4">
          <Button
            variant="outline"
            onClick={() => handleExport('zip')}
            disabled={isExporting}
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <Download className="w-6 h-6" />
            <span>ZIP</span>
            <span className="text-xs text-muted-foreground">Complete project</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExport('html')}
            disabled={isExporting}
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <Download className="w-6 h-6" />
            <span>HTML</span>
            <span className="text-xs text-muted-foreground">Single file</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExport('json')}
            disabled={isExporting}
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <Download className="w-6 h-6" />
            <span>JSON</span>
            <span className="text-xs text-muted-foreground">Data only</span>
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
