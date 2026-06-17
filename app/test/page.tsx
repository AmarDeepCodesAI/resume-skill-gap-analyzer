"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function TestPage() {
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth * 0.9, 1200);
      setPageWidth(width);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Resume Preview
      </h1>

      <div className="flex flex-col items-center gap-8">
        <Document
          file="/sample.pdf"
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<p>Loading PDF...</p>}
          error={<p>Failed to load PDF.</p>}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <div
              key={index}
              className="shadow-lg bg-white p-4 rounded-lg"
            >
              <Page
                pageNumber={index + 1}
                width={pageWidth}
                renderTextLayer
                renderAnnotationLayer
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}