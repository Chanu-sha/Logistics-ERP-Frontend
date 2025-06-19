import { useContext } from "react";
import Logo from "../assets/SSL-Bill-Logo.png";
import { BillingContext } from "../context/BillingContext";
import numberToWords from "number-to-words";
import AuthorSign from "../assets/AuthorSign.png";

const TaxInvoiceBill = () => {
  const { billData } = useContext(BillingContext);

  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Parse all numeric values with proper fallbacks
  const parseNumber = (value) => {
    if (typeof value === "number") return value;
    if (!value) return 0;
    const num = parseFloat(value.toString().replace(/,/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const docketCharges = 50;
  const freight = parseNumber(billData.freightCharges);
  const pickup = parseNumber(billData.pickupCharges);
  const delivery = parseNumber(billData.deliveryCharges);
  const otherExpenses = parseNumber(billData.otherExpenses);

  const subTotal = freight + pickup + delivery + docketCharges + otherExpenses;

  // Get tax rates from billData or use defaults
  const igstRate = parseNumber(billData.igstPercentage) || 0;
  const cgstRate = parseNumber(billData.cgstPercentage) || 0;
  const sgstRate = parseNumber(billData.sgstPercentage) || 0;

  // Calculate taxes based on dynamic rates
  const igst = (subTotal * igstRate) / 100;
  const cgst = (subTotal * cgstRate) / 100;
  const sgst = (subTotal * sgstRate) / 100;

  const total = subTotal + igst + cgst + sgst;

  return (
    <div className="w-[794px] p-4 h-[1123px] bg-white outline text-[12px] font-sans text-black">
      {/* Header section remains the same */}
      <div className="text-[14px]">
        <div className="flex flex-col justify-between items-start">
          <img
            src={Logo}
            alt="Shree Sai Logistics Logo"
            className="h-[130px] w-[794px]"
          />
          <div className="flex gap-[200px]">
            <div className="text-[13px] mb-3">
              <p>
                Plot No. B-27, Chandaka Industrial State, Patia,
                Bhubaneswar-751024 <br />
                Mob. 7077439999, 7381100322 Email: sreesailogistics19@gmail.com
              </p>
              <div className="flex gap-1.5 ">
                <p className="font-semibold">GSTIN:</p> <p>21AUCPN6304N1ZP</p>
              </div>
              <div className="flex gap-1.5 ">
                <p className="font-semibold">PAN:</p> <p>AUCNG6304N</p>
              </div>
              <div className="flex gap-1.5 ">
                <p className="font-semibold"> MSME :</p>
                <p>UDYAM-OD-19-0021152</p>
              </div>
            </div>
            <div>
              <p className="font-bold w-[190px] ">
                Invoice No: {billData.invoiceNumber}
              </p>
              <p className="font-bold">Date: {billData.invoiceDate}</p>
            </div>
          </div>
        </div>

        <h2 className="text-center text-lg font-bold bg-purple-400 mt-2 py-1">
          Tax Invoice
        </h2>

        {/* Bill To and Shipping To sections remain the same */}
        <div className="flex justify-between mb-2.5 ">
          <div className="w-[397px] pr-4">
            <p className="font-bold mb-1">Sender:</p>
            <p>Company Name:</p>
            <input
              value={billData.shippingTocompanyName}
              readOnly
              className="w-full pl-1.5 outline outline-black rounded-[2px] h-[20px] mb-2"
            />
            <p>Address:</p>
            <textarea
              value={billData.shippingToAddress}
              readOnly
              className="w-full h-[72px] leading-none pl-1 pt-1 rounded-[3px] mb-[10px] resize-none outline outline-black"
            />
            <div>
              <div className="flex gap-1 items-center">
                <p>From:</p>
                <input
                  value={billData.from}
                  readOnly
                  className="w-full pl-1.5 outline outline-black rounded-[2px]"
                />
              </div>
            </div>
          </div>
          <div className="w-[397px] pr-4">
            <p className="font-bold mb-1">Bill To:</p>
            <p>Company Name:</p>
            <input
              value={billData.companyName}
              readOnly
              className="w-full pl-1.5 outline outline-black rounded-[2px] h-[20px] mb-2"
            />
            <p>Address:</p>
            <textarea
              value={billData.address}
              readOnly
              className="w-full h-[72px] leading-none pl-1 pt-1 rounded-[3px] mb-[10px] resize-none outline outline-black"
            />
            <div>
              <div className="flex gap-1 items-center">
                <p>To:</p>
                <input
                  value={billData.to}
                  readOnly
                  className="w-full pl-1.5 outline outline-black rounded-[2px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <table className="w-full text-left border-collapse ">
        <thead className="bg-purple-300">
          <tr>
            <th className="outline outline-black px-1 text-center w-[40px]">
              SR No.
            </th>
            <th className="outline outline-black px-1 text-center w-[80px]">
              GR No.
            </th>
            <th className="outline outline-black px-1 text-center w-[80px]">
              Packages
            </th>
            <th className="outline outline-black px-1 text-center w-[80px]">
              Weight
            </th>
            <th className="outline outline-black px-1 text-center w-[80px]">
              Price/Kg
            </th>
            <th className="outline outline-black px-1 text-center w-[80px]">
              Freight Charges
            </th>
            <th className="outline outline-black px-1 text-center w-[80px]">
              Docket Charges
            </th>
            <th className="outline outline-black px-1 text-center w-[80px]">
              Pickup Charges
            </th>
            <th className="outline outline-black px-1 text-center w-[80px]">
              Delivery Charges
            </th>
            <th className="outline outline-black px-1 text-center w-[80px]">
              Other Expenses
            </th>
            <th className="outline outline-black px-1 text-center w-[80px]">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="outline outline-black px-1 py-1">1</td>
            <td className="outline outline-black px-1 text-center py-1">
              {billData.grnNumber}
            </td>
            <td className="outline outline-black px-1 text-center py-1">
              {billData.packageCount}
            </td>
            <td className="outline outline-black px-1 text-center py-1">
              {billData.weight} Kg
            </td>
            <td className="outline outline-black px-1 text-center py-1">
              {billData.perKgPrice}
            </td>
            <td className="outline outline-black px-1 text-center py-1">
              {freight.toFixed(2)}
            </td>
            <td className="outline outline-black px-1 text-center py-1">
              50.00
            </td>
            <td className="outline outline-black px-1 text-center py-1">
              {pickup.toFixed(2)}
            </td>
            <td className="outline outline-black px-1 text-center py-1">
              {delivery.toFixed(2)}
            </td>
            <td className="outline outline-black px-1 text-center py-1">
              {otherExpenses.toFixed(2)}
            </td>
            <td className="outline outline-black px-1 text-center py-1">
              {subTotal.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="text-[15px] flex mt-5">
        <div className="pt-6">
          <p className="mb-2 text-[16px] font-bold">Amount in words:</p>
          <p className="text-[12px] max-w-[350px]">
            {toTitleCase(numberToWords.toWords(Math.floor(total.toFixed(2))))}{" "}
            Rupees Only
          </p>
        </div>

        <div className="ml-auto w-[397px]  text-right bg-purple-200">
          <div className="flex justify-between  px-3 bg-purple-600 text-[15.6px] font-semibold">
            <span>Sub Total:</span>
            <span>{subTotal.toFixed(2)} </span>
          </div>
          <div className="flex justify-between px-3">
            <span>IGST {igstRate}%</span>
            <span>{igst.toFixed(2)} </span>
          </div>
          <div className="flex justify-between px-3">
            <span>SGST {sgstRate}%</span>
            <span>{sgst.toFixed(2)} </span>
          </div>
          <div className="flex justify-between px-3">
            <span>CGST {cgstRate}%</span>
            <span>{cgst.toFixed(2)} </span>
          </div>
          <div className="flex justify-between px-3 text-[15.6px] font-semibold text-black">
            <span>Total</span>
            <span> ₹ {total.toFixed(2)} </span>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
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
            <td className="outline outline-black px-2 py-1">919020042281965</td>
          </tr>
          <tr>
            <td className="outline outline-black px-2 py-1">MIRC Code</td>
            <td className="outline outline-black px-2 py-1">751211023</td>
          </tr>
          <tr>
            <td className="outline outline-black px-2 py-1">RTGS/ NEFT code</td>
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
            3. Payment should be made within due date only if delayed interest
            will be levied @ 24% P.A. <br /> 4. Any discrepancy what so ever out
            of bill will lapse unless raised within 7 days.
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
  );
};

export default TaxInvoiceBill;
