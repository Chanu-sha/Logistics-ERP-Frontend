import { useState, useRef } from "react";
import DocketBill from "../components/DocketBill";
import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";

export default function DocketPage() {
  const copy1 = ["CONSIGNOR COPY","CONSIGNEE COPY"];
  const copy2 = ["POD COPY", "OFFICE COPY"];
  const copies = [copy1, copy2];
  const [currentPage, setCurrentPage] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const copyRefs = useRef([]);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    const pdf = new jsPDF("p", "pt", "a4");

    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.style.top = '0';
    document.body.appendChild(hiddenContainer);

    try {
      for (let i = 0; i < copies.length; i++) {
        const clone = copyRefs.current[i].cloneNode(true);
        clone.style.border = 'none';
        clone.style.display = 'block';
        hiddenContainer.appendChild(clone);

        await new Promise(resolve => setTimeout(resolve, 300));

        const dataUrl = await domtoimage.toPng(clone, {
          quality: 1,
          width: clone.offsetWidth,
          height: clone.offsetHeight,
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

        if (i !== 0) pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

        hiddenContainer.removeChild(clone);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      document.body.removeChild(hiddenContainer);
      setIsGeneratingPDF(false);
    }

    pdf.save("docket.pdf");
  };

  return (
    <div className="flex  items-center  w-full min-h-screen ">
      <div className="h-[60vh] mb-[65vh] scale-[.55]">
        {copies.map((copyTexts, idx) => (
          <div
            key={idx}
            ref={(el) => (copyRefs.current[idx] = el)}
            style={{
              display: idx === currentPage ? "block" : "none",
              width: "794px",
              height: "1123px",
            }}
            className="origin-top-left"
          >
            <DocketBill copyTexts={copyTexts} />
          </div>
        ))}
      </div>

      <div className="flex w-full justify-center space-x-4 mt-4">
        <button
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0 || isGeneratingPDF}
        >
          Previous
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, copies.length - 1))
          }
          disabled={currentPage === copies.length - 1 || isGeneratingPDF}
        >
          Next
        </button>

        <button
          className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded disabled:opacity-50"
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? "Generating..." : "Download PDF"}
        </button>
      </div>
    </div>
  );
}