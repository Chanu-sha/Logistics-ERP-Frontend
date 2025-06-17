import { useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";

const LaserPage = () => {
  const [formData, setFormData] = useState({
    statementDate: "",
    statementId: "",
    accountOf: "",
    invoices: [createEmptyInvoice()],
    totalAmount: "",
    totalBalance: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const billRef = useRef();

  const addInvoice = (index) => {
    const newInvoices = [...formData.invoices];
    newInvoices.splice(index + 1, 0, createEmptyInvoice());
    setFormData({ ...formData, invoices: newInvoices });
  };

  const removeInvoice = (index) => {
    if (formData.invoices.length <= 1) return;
    const newInvoices = [...formData.invoices];
    newInvoices.splice(index, 1);
    setFormData({ ...formData, invoices: newInvoices });
  };

  function createEmptyInvoice() {
    return {
      invoiceNo: "",
      date: "",
      amount: "",
      paid: "",
      balance: "",
    };
  }

  const handleInputChange = (e, field, index = null) => {
    if (index !== null) {
      const newInvoices = [...formData.invoices];
      newInvoices[index][field] = e.target.value;

      if (field === "amount" || field === "paid") {
        const amount = parseFloat(newInvoices[index].amount) || 0;
        const paid = parseFloat(newInvoices[index].paid) || 0;
        newInvoices[index].balance = (amount - paid).toFixed(2);
      }

      setFormData({ ...formData, invoices: newInvoices });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const calculateTotals = () => {
    const totalAmount = formData.invoices.reduce((sum, invoice) => {
      return sum + (parseFloat(invoice.amount) || 0);
    }, 0);

    const totalBalance = formData.invoices.reduce((sum, invoice) => {
      return sum + (parseFloat(invoice.balance) || 0);
    }, 0);

    return { totalAmount, totalBalance };
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);

    const originalStyle = billRef.current.getAttribute("style");

    // Temporarily remove borders for export
    billRef.current.style.border = "none";

    // Optionally, remove borders of all children too
    const allElements = billRef.current.querySelectorAll("*");
    const originalBorders = [];
    allElements.forEach((el, i) => {
      originalBorders[i] = el.style.border;
      el.style.border = "none";
    });

    try {
      const dataUrl = await domtoimage.toPng(billRef.current, {
        quality: 1,
        width: billRef.current.offsetWidth,
        height: billRef.current.offsetHeight,
      });

      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("docket-edit.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      // Restore original styles
      billRef.current.setAttribute("style", originalStyle);
      allElements.forEach((el, i) => {
        el.style.border = originalBorders[i];
      });

      setDownloading(false);
    }
  };

  const { totalAmount, totalBalance } = calculateTotals();

  const handleSubmit = async () => {
    if (
      !formData.statementDate ||
      !formData.statementId ||
      !formData.accountOf
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    for (const invoice of formData.invoices) {
      if (!invoice.invoiceNo || !invoice.date || !invoice.amount) {
        toast.error("Please fill in all required invoice fields");
        return;
      }
    }

    const submissionData = {
      ...formData,
      totalAmount,
      totalBalance,
      invoices: formData.invoices.map((invoice) => ({
        ...invoice,
        amount: parseFloat(invoice.amount) || 0,
        paid: parseFloat(invoice.paid) || 0,
        balance: parseFloat(invoice.balance) || 0,
      })),
    };

    try {
      setIsLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/statements",
        submissionData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        toast.success("Statement created successfully!");
        setFormData({
          statementDate: "",
          statementId: "",
          accountOf: "",
          invoices: [createEmptyInvoice()],
          totalAmount: "",
          totalBalance: "",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create statement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center p-8 font-sans text-sm bg-sky-200 rounded-lg h-[97vh] w-[82vw]">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div
        className="bg-white scale-[.54]"
        style={{ width: "210mm", height: "297mm" }}
      >
        <div ref={billRef} className="relative p-8 h-full overflow-hidden outline outline-black  ">
          <div className="flex justify-between items-center mb-6">
            <div className="text-[13px] mb-1.5">
              <div className="font-bold text-lg">SHREE SAI LOGISTICS</div>
              <p>
                Plot No. B-27, Chandaka Industrial State, Patia,
                Bhubaneswar-751024 <br />
                Mob. 7077439999, 7381100322 Email: sreesailogistics19@gmail.com
              </p>
              <div className="mt-1">
                <strong>GSTIN:</strong> 21AUCPN6304N1ZP
              </div>
              <div>
                <strong>PAN:</strong> AUCNG6304N
              </div>
              <div>
                <strong> MSME :</strong> UDYAM-OD-19-0021152
              </div>
            </div>
            <h2 className="text-2xl font-bold text-blue-800">STATEMENT</h2>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <span className="w-30">STATEMENT DATE:</span>
                <input
                  type="text"
                  className="outline outline-black rounded px-2 py-1 w-48"
                  value={formData.statementDate}
                  onChange={(e) => handleInputChange(e, "statementDate")}
                  required
                />
              </label>

              <label className="flex items-center gap-2">
                <span>STATEMENT ID:</span>
                <input
                  type="text"
                  className="outline outline-black  rounded px-2 py-1 w-38"
                  value={formData.statementId}
                  onChange={(e) => handleInputChange(e, "statementId")}
                  required
                />
              </label>
            </div>

            <label className="flex items-center gap-2">
              <span className="w-30">ACCOUNT OF:</span>
              <input
                type="text"
                className="outline outline-black  rounded px-2 py-1 w-[65%]"
                value={formData.accountOf}
                onChange={(e) => handleInputChange(e, "accountOf")}
                required
              />
            </label>
          </div>

          <div className="overflow-x-auto outline outline-black ">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="outline outline-black  px-2 py-1 text-left">
                    INVOICE NO.
                  </th>
                  <th className="outline outline-black  px-2 py-1 text-left">
                    DATE
                  </th>
                  <th className="outline outline-black  px-2 py-1 text-left">
                    AMOUNT
                  </th>
                  <th className="outline outline-black  px-2 py-1 text-left">
                    PAID
                  </th>
                  <th className="outline outline-black  px-2 py-1 text-left">
                    BALANCE
                  </th>
                  <th className="outline outline-black  px-2 py-1 text-left">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.invoices.map((invoice, index) => (
                  <tr key={index}>
                    <td className="outline outline-black  p-1">
                      <input
                        type="text"
                        className="w-full px-1 py-1 border rounded"
                        value={invoice.invoiceNo}
                        onChange={(e) =>
                          handleInputChange(e, "invoiceNo", index)
                        }
                        required
                      />
                    </td>
                    <td className="outline outline-black  p-1">
                      <input
                        type="text"
                        className="w-full px-1 py-1 border rounded"
                        value={invoice.date}
                        onChange={(e) => handleInputChange(e, "date", index)}
                        required
                      />
                    </td>
                    <td className="outline outline-black  p-1">
                      <input
                        type="number"
                        className="w-full px-1 py-1 border rounded"
                        value={invoice.amount}
                        onChange={(e) => handleInputChange(e, "amount", index)}
                        required
                      />
                    </td>
                    <td className="outline outline-black  p-1">
                      <input
                        type="number"
                        className="w-full px-1 py-1 border rounded"
                        value={invoice.paid}
                        onChange={(e) => handleInputChange(e, "paid", index)}
                      />
                    </td>
                    <td className="outline outline-black  p-1">
                      <input
                        type="number"
                        className="w-full px-1 py-1 border rounded"
                        value={invoice.balance}
                        readOnly
                      />
                    </td>
                    <td className="outline outline-black  p-1 text-center">
                      <button
                        onClick={() => addInvoice(index)}
                        className="text-blue-600 text-sm px-2 py-1 border border-blue-600 rounded hover:bg-blue-600 hover:text-white mr-1"
                      >
                        +
                      </button>
                      {formData.invoices.length > 1 && (
                        <button
                          onClick={() => removeInvoice(index)}
                          className="text-red-600 text-sm px-2 py-1 border border-red-600 rounded hover:bg-red-600 hover:text-white"
                        >
                          -
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td
                    colSpan="2"
                    className="outline outline-black  text-right font-semibold p-2"
                  >
                    TOTAL
                  </td>
                  <td className="outline outline-black  p-1">
                    <input
                      type="number"
                      className="w-full px-1 py-1 border rounded"
                      value={totalAmount.toFixed(2)}
                      readOnly
                    />
                  </td>
                  <td className="outline outline-black  p-1"></td>
                  <td className="outline outline-black  p-1">
                    <input
                      type="number"
                      className="w-full px-1 py-1 border rounded"
                      value={totalBalance.toFixed(2)}
                      readOnly
                    />
                  </td>
                  <td className="outline outline-black "></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="absolute bottom-4 w-[92%]  pt-3 text-center font-semibold">
            SHREE SAI LOGISTICS
          </div>
        </div>
      </div>

      <div className="absolute right-[20%] flex gap-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={isLoading}
          onClick={handleDownloadPDF}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default LaserPage;
