import { useCallback } from 'react';
import { getNodesBounds, getViewportForBounds, useReactFlow } from '@xyflow/react';
import { toPng } from 'html-to-image';

function ExportButtons() {
  const { getNodes } = useReactFlow();

  const downloadImage = useCallback((dataUrl, filename) => {
    const a = document.createElement('a');
    a.setAttribute('download', filename);
    a.setAttribute('href', dataUrl);
    a.click();
  }, []);

  const handleExportPNG = useCallback(() => {
    const nodesBounds = getNodesBounds(getNodes());
    const imageWidth = nodesBounds.width;
    const imageHeight = nodesBounds.height;
    const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2, 0.1);
    const viewportElement = document.querySelector('.react-flow__viewport');
    
    if (!viewportElement) return;

    toPng(viewportElement, {
      backgroundColor: '#f3f4f6',
      width: imageWidth,
      height: imageHeight,
      pixelRatio: 3,
      quality: 1,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then((dataUrl) => {
      downloadImage(dataUrl, 'arbre-genealogique.png');
    }).catch((error) => {
      console.error('Erreur lors de l\'export PNG:', error);
    });
  }, [getNodes, downloadImage]);

  const handleExportPDF = useCallback(async () => {
    const nodesBounds = getNodesBounds(getNodes());
    const imageWidth = nodesBounds.width;
    const imageHeight = nodesBounds.height;
    const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2, 0.1);
    const viewportElement = document.querySelector('.react-flow__viewport');
    
    if (!viewportElement) return;
    
    try {
      const dataUrl = await toPng(viewportElement, {
        backgroundColor: '#f3f4f6',
        width: imageWidth,
        height: imageHeight,
        pixelRatio: 3,
        quality: 1,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      });

      // Dynamically import jsPDF to reduce bundle size
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: imageWidth > imageHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imageWidth, imageHeight],
        compress: true,
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, imageWidth, imageHeight, undefined, 'FAST');
      pdf.save('arbre-genealogique.pdf');
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
    }
  }, [getNodes]);

  return (
    <>
      <button
        onClick={handleExportPNG}
        className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors shadow-sm text-sm"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        <span>PNG</span>
      </button>

      <button
        onClick={handleExportPDF}
        className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors shadow-sm text-sm"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
        <span>PDF</span>
      </button>
    </>
  );
}

export default ExportButtons;
