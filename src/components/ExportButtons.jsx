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
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors shadow-sm"
        title="Télécharger l'arbre généalogique en image PNG"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
          />
        </svg>
        <span>Exporter en PNG</span>
      </button>

      <button
        onClick={handleExportPDF}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors shadow-sm"
        title="Télécharger l'arbre généalogique en PDF"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
          />
        </svg>
        <span>Exporter en PDF</span>
      </button>
    </>
  );
}

export default ExportButtons;
