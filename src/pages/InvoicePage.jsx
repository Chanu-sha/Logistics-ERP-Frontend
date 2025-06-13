import { useState, useRef } from "react";
import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";
import TaxInvoiceBill from "../components/TaxInvoiceBill";

export default function InvoicePage() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const invoiceRef = useRef();

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    const pdf = new jsPDF("p", "pt", "a4");

    try {
      const dataUrl = await domtoimage.toPng(invoiceRef.current, {
        quality: 1,
        width: invoiceRef.current.offsetWidth,
        height: invoiceRef.current.offsetHeight,
        style: {
          transform: "none",
          overflow: "visible",
          border: 'none',
        },
        filter: (n) => {
          if (n.style && (n.style.visibility === 'hidden' || n.style.display === 'none')) {
            return false;
          }
          if (n.style) {
            n.style.border = 'none';
            n.style.boxShadow = 'none';
          }
          return true;
        }
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }

    pdf.save("invoice.pdf");
  };

  return (
    <div className="flex items-center w-full min-h-screen p-4">
      <div className="scale-[.56]"> 
        <div
          ref={invoiceRef}
          style={{
            width: "794px",  
            height: "1123px", 
          }}
        >
          <TaxInvoiceBill />
        </div>
      </div>

      <button
        className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg disabled:opacity-50 text-lg"
        onClick={handleDownloadPDF}
        disabled={isGeneratingPDF}
      >
        {isGeneratingPDF ? "Generating PDF..." : "Download Invoice"}
      </button>
    </div>
  );
}