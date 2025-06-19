import { useState, useRef, useEffect } from "react";
import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";
import axios from "axios";
import Logo from "../assets/SSL-Bill-Logo.png";
import numberToWords from "number-to-words";
import AuthorSign from "../assets/AuthorSign.png";

export default function InvoiceEditPage({ billId, onUpdate }) {
  const [billData, setBillData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const invoiceRef = useRef();

  useEffect(() => {
    if (!billId) return;

    const fetchBill = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_INVOICE_API}/${billId}`
        );
        setBillData(res.data);
      } catch (err) {
        console.error("Error fetching bill data:", err);
      }
    };
    fetchBill();
  }, [billId]);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    setIsGeneratingPDF(true);

    const invoiceElement = invoiceRef.current;

    const allElements = invoiceElement.querySelectorAll("*");
    const originalStyles = [];

    allElements.forEach((el) => {
      const style = {
        border: el.style.border,
      };
      originalStyles.push(style);

      el.style.border = "none";
    });

    try {
      const dataUrl = await domtoimage.toPng(invoiceElement, {
        quality: 1,
        width: invoiceElement.offsetWidth,
        height: invoiceElement.offsetHeight,
      });

      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(
        dataUrl,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight,
        undefined,
        "FAST"
      );
      pdf.save("invoice.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      // Step 2: Restore original styles
      allElements.forEach((el, i) => {
        el.style.border = originalStyles[i].border;
        el.style.outline = originalStyles[i].outline;
        el.style.boxShadow = originalStyles[i].boxShadow;
      });

      setIsGeneratingPDF(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_INVOICE_API}/${billId}`,
        billData
      );
      onUpdate();
    } catch (err) {
      console.error("Error saving changes:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setBillData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "weight" || field === "perKgPrice") {
        const weight = parseFloat(updated.weight || 0);
        const rate = parseFloat(updated.perKgPrice || 0);
        updated.freightCharges = parseFloat((weight * rate).toFixed(2));
      }

      return updated;
    });
  };

  if (!billData)
    return <div className="text-center p-4">Loading invoice data...</div>;

  // Calculate all values
  const docketCharges = 50;
  const freight = parseFloat(billData.freightCharges) || 0;
  const pickup = parseFloat(billData.pickupCharges) || 0;
  const delivery = parseFloat(billData.deliveryCharges) || 0;
  const subTotal = freight + pickup + delivery + docketCharges;

  // Use percentages from the schema
  const igstPercentage = parseFloat(billData.igstPercentage) || 0;
  const cgstPercentage = parseFloat(billData.cgstPercentage) || 0;
  const sgstPercentage = parseFloat(billData.sgstPercentage) || 0;

  const igst = (subTotal * igstPercentage) / 100;
  const cgst = (subTotal * cgstPercentage) / 100;
  const sgst = (subTotal * sgstPercentage) / 100;
  const total = subTotal + igst + cgst + sgst;

  return (
    <div className="flex justify-center items-center">
      <div className="scale-[.53]">
        <div
          ref={invoiceRef}
          style={{ width: "794px", height: "1123px" }}
          className="p-4 bg-white text-[12px] font-sans text-black outline"
        >
          <div className="flex flex-col justify-between items-start">
            <img src={Logo} alt="Logo" className="h-[130px] w-[100vw]" />
            <div className="flex gap-[200px]">
              <div className="text-[13px] mb-3">
                <p>
                  Plot No. B-27, Chandaka Industrial Estate, Patia,
                  Bhubaneswar-751024
                </p>
                <p>
                  Mob. 7077439999, 7381100322 Email:
                  sreesailogistics19@gmail.com
                </p>
                <div className="mt-1">
                  <strong>GSTIN:</strong> 21AUCPN6304N1ZP
                </div>
                <div>
                  <strong>PAN:</strong> AUCNG6304N
                </div>
                <div>
                  <strong>MSME :</strong> UDYAM-OD-19-0021152
                </div>
              </div>
              <div>
                <p className="font-bold">
                  Invoice No: {billData.invoiceNumber}
                </p>
                <div className="flex gap-1.5">
                  <p className="font-bold">Date:</p>
                  <input
                    value={billData.invoiceDate}
                    onChange={(e) =>
                      handleInputChange("invoiceDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-center text-lg font-bold bg-purple-400 mt-2 py-1">
            Tax Invoice
          </h2>

          <div className="flex justify-between my-4">
            <div className="w-1/2 pr-4">
              <p className="font-bold mb-1">Sender:</p>
              <p>Company Name:</p>
              <input
                value={billData.shippingTocompanyName}
                onChange={(e) =>
                  handleInputChange("shippingTocompanyName", e.target.value)
                }
                className="w-full pl-1.5 outline-black outline rounded-[2px] h-[20px] mb-2"
              />
              <p>Address:</p>
              <textarea
                value={billData.shippingToAddress}
                onChange={(e) =>
                  handleInputChange("shippingToAddress", e.target.value)
                }
                className="w-full h-18 pl-1 pt-1 outline-black outline rounded-[3px] mb-[10px] resize-none"
              />
              <div className="flex flex-col gap-1 items-start">
                <p>From:</p>
                <input
                  value={billData.from}
                  onChange={(e) => handleInputChange("from", e.target.value)}
                  className="w-full pl-1.5 outline-black outline rounded-[2px] h-[20px]"
                />
              </div>
            </div>
            <div className="w-1/2 pr-4">
              <p className="font-bold mb-1">Bill To:</p>
              <p>Company Name:</p>
              <input
                value={billData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                className="w-full pl-1.5 outline-black outline rounded-[2px] h-[20px] mb-2"
              />
              <p>Address:</p>
              <textarea
                value={billData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full h-18 pl-1 pt-1 outline-black outline rounded-[3px] mb-[10px] resize-none"
              />
              <div className="flex flex-col gap-1 items-start">
                <p>To:</p>
                <input
                  value={billData.to}
                  onChange={(e) => handleInputChange("to", e.target.value)}
                  className="w-full pl-1.5 outline-black outline rounded-[2px] h-[20px]"
                />
              </div>
            </div>
          </div>

          <table className="w-full text-left border-collapse mt-2">
            <thead className="bg-purple-300">
              <tr>
                <th className="outline px-1 text-center">SR No.</th>
                <th className="outline px-1 text-center">Gr No.</th>
                <th className="outline px-1 text-center">Packages</th>
                <th className="outline px-1 text-center">Weight</th>
                <th className="outline px-1 text-center">Price/Kg</th>
                <th className="outline px-1 text-center">Freight</th>
                <th className="outline px-1 text-center">Docket</th>
                <th className="outline px-1 text-center">Pickup</th>
                <th className="outline px-1 text-center">Delivery</th>
                <th className="outline px-1 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="outline text-center">1</td>
                <td className="outline text-center">
                  <input
                    value={billData.grnNumber}
                    onChange={(e) =>
                      handleInputChange("grnNumber", e.target.value)
                    }
                    className="w-[50px] text-center  rounded-[2px]"
                  />
                </td>
                <td className="outline text-center">
                  <input
                    value={billData.packageCount}
                    onChange={(e) =>
                      handleInputChange("packageCount", e.target.value)
                    }
                    className="w-[50px] text-center  rounded-[2px]"
                  />
                </td>
                <td className="outline text-center">
                  <input
                    value={billData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    className="w-[50px] text-center  rounded-[2px]"
                  />
                </td>
                <td className="outline text-center">
                  <input
                    value={billData.perKgPrice}
                    onChange={(e) =>
                      handleInputChange("perKgPrice", e.target.value)
                    }
                    className="w-[50px] text-center  rounded-[2px]"
                  />
                </td>
                <td className="outline text-center">
                  {billData.freightCharges}
                </td>
                <td className="outline text-center">50.00</td>
                <td className="outline text-center">
                  <input
                    value={billData.pickupCharges}
                    onChange={(e) =>
                      handleInputChange("pickupCharges", e.target.value)
                    }
                    className="w-[50px] text-center  rounded-[2px]"
                  />
                </td>
                <td className="outline text-center">
                  <input
                    value={billData.deliveryCharges}
                    onChange={(e) =>
                      handleInputChange("deliveryCharges", e.target.value)
                    }
                    className="w-[50px] text-center  rounded-[2px]"
                  />
                </td>
                <td className="outline text-center">{subTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex mt-5 text-[13px]">
            <div className="pt-6">
              <p className="mb-1 font-bold">Amount in words:</p>
              <p className="max-w-[350px]">
                {numberToWords.toWords(Math.floor(total))} Rupees Only
              </p>
            </div>
            <div className="ml-auto w-1/2 text-right bg-purple-200 p-2 rounded">
              <div className="w-full flex justify-between items-center ">
                <p className="font-semibold">Sub Total: </p>{" "}
                <p>₹{subTotal.toFixed(2)}</p>
              </div>
              <div className="w-full flex justify-between items-center">
                <p className="font-semibold">IGST {igstPercentage}%:</p>{" "}
                <p>₹{igst.toFixed(2)}</p>
              </div>
              <div className="w-full flex justify-between items-center">
                <p className="font-semibold">SGST {sgstPercentage}%:</p>{" "}
                <p>₹{sgst.toFixed(2)}</p>
              </div>
              <div className="w-full flex justify-between items-center">
                <p className="font-semibold">CGST {cgstPercentage}%:</p>{" "}
                <p>₹{cgst.toFixed(2)}</p>
              </div>
              <div className="w-full flex justify-between items-center ">
                <p className="font-bold text-lg">Total:</p>
                <p className="font-bold text-lg">₹{total.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <table className="w-full mt-6 border-collapse">
            <thead>
              <tr>
                <th
                  colSpan="2"
                  className="outline outline-black text-center bg-gray-300 py-1"
                >
                  Bank Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="outline outline-black px-2 py-1">
                  Beneficiary Name
                </td>
                <td className="outline outline-black px-2 py-1">
                  SHREE SAI LOGISTICS
                </td>
              </tr>
              <tr>
                <td className="outline outline-black px-2 py-1">Bank Name</td>
                <td className="outline outline-black px-2 py-1">AXIS BANK</td>
              </tr>
              <tr>
                <td className="outline outline-black px-2 py-1">
                  Bank Account No.
                </td>
                <td className="outline outline-black px-2 py-1">
                  919020042281965
                </td>
              </tr>
              <tr>
                <td className="outline outline-black px-2 py-1">MIRC Code</td>
                <td className="outline outline-black px-2 py-1">751211023</td>
              </tr>
              <tr>
                <td className="outline outline-black px-2 py-1">
                  RTGS/ NEFT code
                </td>
                <td className="outline outline-black px-2 py-1">UTIB0003878</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-5 relative flex justify-between flex-row gap-1">
            <div>
              <p className="mb-3 font-bold">Terms & Conditions</p>
              <p>
                1. Payment should be made to authorize officer only. <br /> 2.
                Payment should be made by Cheque/Draft/Rtgs/Neft in the name of
                SHREE SAI LOGISTICS.
                <br />
                3. Payment should be made within due date only if delayed
                interest will be levied @ 24% P.A. <br /> 4. Any discrepancy
                what so ever out of bill will lapse unless raised within 7 days.
              </p>
            </div>
            <div className="flex mt-auto">
              <img className="absolute top-0 w-[120px]" src={AuthorSign} />
              <p className="mt-auto text-blue-600 cursor-pointer">
                Company seal and Sign
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4 gap-3">
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          {isGeneratingPDF ? "Generating..." : "Download PDF"}
        </button>
        <button
          onClick={handleSaveChanges}
          className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
