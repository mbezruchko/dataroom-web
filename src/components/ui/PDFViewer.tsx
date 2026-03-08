import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { useAppStore } from '@/store/useAppStore';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface PDFViewerProps {
  fileUrl: string;
}

export function PDFViewer({ fileUrl }: PDFViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const theme = useAppStore(state => state.theme);

  return (
    <div className="h-full flex flex-col">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <div className="flex-1 overflow-hidden" style={{ height: 'calc(95vh - 64px)' }}>
          <Viewer
            fileUrl={fileUrl}
            defaultScale={1.0}
            plugins={[defaultLayoutPluginInstance]}
            theme={theme}
          />
        </div>
      </Worker>
    </div>
  );
}
