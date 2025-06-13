import { useContext } from "react";
import logo from "../assets/DocketLogo.png";
import { BillingContext } from "../context/BillingContext";

function DocketBill({ copyTexts }) {
  const { billData } = useContext(BillingContext);

  // Fixed calculation functions
  const parseNumber = (value) => {
    if (typeof value === "number") return value;
    if (!value) return 0;
    const num = parseFloat(value.toString().replace(/,/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const docketCharges = 50;
  const freightCharges = parseNumber(billData.freightCharges) || 0;
  const pickupCharges = parseNumber(billData.pickupCharges) || 0;
  const deliveryCharges = parseNumber(billData.deliveryCharges) || 0;
  const otherExpenses = parseNumber(billData.otherExpenses) || 0;

  const totalBeforeTax = parseNumber(
    freightCharges +
      pickupCharges +
      deliveryCharges +
      otherExpenses +
      docketCharges
  );

  const cgstRate = parseNumber(billData.cgstPercentage) || 0;
  const sgstRate = parseNumber(billData.sgstPercentage) || 0;
  const igstRate = parseNumber(billData.igstPercentage) || 0;

  const cgst = parseNumber((totalBeforeTax * cgstRate) / 100);
  const sgst = parseNumber((totalBeforeTax * sgstRate) / 100);
  const igst = parseNumber((totalBeforeTax * igstRate) / 100);

  const grandTotal = parseNumber(totalBeforeTax + cgst + sgst + igst);

  // Formatting function for consistent display
  const formatCurrency = (value) => {
    return parseFloat(value).toFixed(2);
  };

  return (
    <div className="w-[794px] h-[1123px]  flex flex-col gap-[20px] items-center outline  outline-black ">
      {/* First Copy */}
      <div className="w-[793.7px] h-[552px] bg-white outline outline-black flex flex-col text-xs font-sans">
        <div
          className="relative"
          style={{
            width: "100%",
            height: "648px",
            overflow: "hidden",
          }}
        >
          <img
            className="mx-auto ml-[10px] h-[108px] w-[780px]"
            src={logo}
            alt="logo"
          />
          <div
            className="p-[24px] pl-[12px] pt-0"
            style={{ width: "1058.27px" }}
          >
            <div className="text-[13px] mb-1.5">
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
            <div className="flex justify-between mt-1 text-sm">
              <div className="absolute top-[80px] right-[10px]">
                <div>
                  <div>
                    <strong>G.R. No:</strong>
                    <input
                      value={billData.grnNumber}
                      readOnly
                      type="text"
                      className="outline outline-black ml-1 pl-1.5 rounded-sm w-[80px] h-[28.8px]"
                    />
                  </div>
                  <div>
                    <strong>Date:</strong>
                    <input
                      type="text"
                      value={billData.invoiceDate}
                      readOnly
                      className="outline pl-1 outline-black ml-[24px] mt-[8px] rounded-sm w-[80px] h-[28.8px]"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col text-sm">
                <div className="flex flex-col">
                  <label className="font-semibold">
                    Consignor Name & Address:
                  </label>
                  <textarea
                    value={`${billData.consignerName}, ${billData.consignerAddress}`}
                    readOnly
                    className="w-[250px] outline outline-black h-[80px] resize-none p-2 rounded text-[14px] leading-tight"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold">
                    Consignee Name & Address:
                  </label>
                  <textarea
                    value={`${billData.consigneeName}, ${billData.consigneeAddress}`}
                    readOnly
                    className="w-[250px] outline outline-black h-[80px] resize-none text-[14px] p-2 rounded"
                  />
                </div>
              </div>

              <div>
                <div className="absolute right-[10px] top-[155px] flex flex-col gap-2">
                  <div className="flex gap-[40px]">
                    <strong>From:</strong>
                    <input
                      value={billData.from}
                      readOnly
                      type="text"
                      className="outline pl-1 outline-black rounded-sm w-[230px] h-[28.8px]" // 17vw=129.2px
                    />
                  </div>
                  <div className="flex gap-[36px]">
                    <strong>To:</strong>
                    <input
                      value={billData.to}
                      readOnly
                      type="text"
                      className="outline pl-1 outline-black ml-[20px] rounded-sm w-[230px] h-[28.8px]"
                    />
                  </div>
                </div>
                <div className="absolute scale-[.8] top-[400px] left-[-38px]">
                  <div className="flex gap-1">
                    <div className="mb-1 flex flex-col gap-1">
                      <strong>Invoice No.:</strong>
                      <input
                        value={billData.invoiceNumber}
                        readOnly
                        type="text"
                        className="outline pl-1.5 outline-black rounded-sm w-[255px] h-[28.8px]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <strong className="ml-[16px]">Invoce Date:</strong>
                      <input
                        value={billData.invoiceDate}
                        readOnly
                        type="text"
                        className="outline pl-1.5 outline-black ml-[20px] rounded-sm w-[260px] h-[28.8px]"
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex gap-1">
                    <label className="font-bold text-[15px]">
                      Said to Contain:
                    </label>
                    <input
                      value={billData.saidToContain}
                      readOnly
                      className="outline pl-1 outline-black rounded-sm w-[422px] h-[28.8px]"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Charges Table */}
            <div className="flex gap-2">
              <table className="absolute right-[-78px] top-[135px] scale-[.65] w-[507px] text-sm mt-4 border border-gray-300 border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="outline outline-black p-2 text-left">
                      Freight Charges
                    </th>
                    <th className="outline outline-black p-2">Rs.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      Freight Amount
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(freightCharges)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      Docket Charges
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(docketCharges)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      Door Pickup Charges
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(pickupCharges)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      Door Delivery Charges
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(deliveryCharges)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      Other Expenses
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(otherExpenses)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      TOTAL
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(totalBeforeTax)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      CGST @ {cgstRate}%
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(cgst)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      SGST @ {sgstRate}%
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(sgst)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      IGST @ {igstRate}%
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(igst)}
                    </td>
                  </tr>
                  <tr className="bg-gray-100 font-bold">
                    <td className="outline outline-black p-2">GRAND TOTAL</td>
                    <td className="outline outline-black p-2">
                     ₹ {formatCurrency(grandTotal)} 
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Summary Table */}
              <table className="h-[225px] absolute left-[255px] top-[203px] scale-[.8] outline outline-black border-collapse text-sm table-fixed w-[129.2px]">
                <tbody>
                  <tr>
                    <td className="outline outline-black text-[13px] bg-gray-200 font-semibold w-[130px] max-h-[20px] p-2">
                      No. of Packages
                    </td>
                    <td
                      className="outline outline-black p-2 w-[80px] overflow-hidden text-ellipsis whitespace-nowrap text-center" /* 3vw=22.8px */
                      title={billData.packageCount}
                    >
                      {billData.packageCount}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[13px] bg-gray-200 font-semibold p-2">
                      Actual Weight
                    </td>
                    <td
                      className="outline outline-black p-2 overflow-hidden text-ellipsis whitespace-nowrap text-center"
                      title={billData.weight}
                    >
                      {billData.weight} Kg
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[13px] bg-gray-200 font-semibold p-2">
                      Chargeable Weight
                    </td>
                    <td
                      className="outline outline-black p-2 overflow-hidden text-ellipsis whitespace-nowrap text-center"
                      title={billData.chargeableWeight}
                    >
                      {billData.chargeableWeight} Kg
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[13px] bg-gray-200 font-semibold p-2">
                      Transport Mode
                    </td>
                    <td
                      className="outline outline-black p-2 overflow-hidden text-ellipsis whitespace-nowrap text-center"
                      title={billData.transportMode}
                    >
                      {billData.transportMode}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[13px] bg-gray-200 font-semibold p-2">
                      Payment status
                    </td>
                    <td
                      className="outline outline-black p-2 overflow-hidden text-ellipsis whitespace-nowrap text-center"
                      title={billData.paymentStatus}
                    >
                      {billData.paymentStatus}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Terms & Signature */}
            <div className="absolute left-[-60px] bottom-[-4px] scale-[.75] text-[13px]">
              <strong>TERMS & CONDITIONS:</strong>
              <p className="w-[580px]">
                1. We do not accept cash, jewellery, drugs, inflammables/
                explosives/ damage/ offensive and such commodities not
                permissible under Govt. Rules or banned by civil authorities. 2.
                Not liable when seized by Tax/Sales Authorities. 3. Not
                responsible for damage/delay due to fire, accidents, strikes,
                etc. 4. No claim after 7 days of booking.
              </p>
            </div>
            <div className="absolute right-[6px] bottom-[8px] w-[333px] flex justify-between items-center">
              <div className="text-[12px] font-bold">Customer's Signature</div>
              <div className="outline outline-black px-2 py-1 text-xsm font-semibold rounded">
                {copyTexts[0]}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Second Copy */}
      <div className="w-[793.7px] h-[552px] bg-white outline outline-black flex flex-col text-xs font-sans">
        <div
          className="relative"
          style={{
            width: "100%",
            height: "648px",
            overflow: "hidden",
          }}
        >
          <img
            className="mr-auto ml-[13px]  h-[108px] w-[780px]"
            src={logo}
            alt="logo"
          />
          <div
            className="p-[24px] pl-[12px] pt-0"
            style={{ width: "1058.27px" }}
          >
            <div className="text-[13px] mb-1.5">
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
            <div className="flex justify-between mt-1 text-sm">
              <div className="absolute top-[80px] right-[10px]">
                <div>
                  <div>
                    <strong>G.R. No:</strong>
                    <input
                      value={billData.grnNumber}
                      readOnly
                      type="text"
                      className="outline outline-black ml-1 pl-1.5 rounded-sm w-[80px] h-[28.8px]"
                    />
                  </div>
                  <div>
                    <strong>Date:</strong>
                    <input
                      type="text"
                      value={billData.invoiceDate}
                      readOnly
                      className="outline pl-1 outline-black ml-[24px] mt-[8px] rounded-sm w-[80px] h-[28.8px]"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col text-sm">
                <div className="flex flex-col">
                  <label className="font-semibold">
                    Consignor Name & Address:
                  </label>
                  <textarea
                    value={`${billData.consignerName}, ${billData.consignerAddress}`}
                    readOnly
                    className="w-[250px] outline outline-black h-[80px] resize-none p-2 rounded text-[14px] leading-tight"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold">
                    Consignee Name & Address:
                  </label>
                  <textarea
                    value={`${billData.consigneeName}, ${billData.consigneeAddress}`}
                    readOnly
                    className="w-[250px] outline outline-black h-[80px] resize-none text-[14px] p-2 rounded"
                  />
                </div>
              </div>

              <div>
                <div className="absolute right-[10px] top-[155px] flex flex-col gap-2">
                  <div className="flex gap-[40px]">
                    <strong>From:</strong>
                    <input
                      value={billData.from}
                      readOnly
                      type="text"
                      className="outline pl-1 outline-black rounded-sm w-[230px] h-[28.8px]" // 17vw=129.2px
                    />
                  </div>
                  <div className="flex gap-[36px]">
                    <strong>To:</strong>
                    <input
                      value={billData.to}
                      readOnly
                      type="text"
                      className="outline pl-1 outline-black ml-[20px] rounded-sm w-[230px] h-[28.8px]"
                    />
                  </div>
                </div>
                <div className="absolute scale-[.8] top-[400px] left-[-38px]">
                  <div className="flex gap-1">
                    <div className="mb-1 flex flex-col gap-1">
                      <strong>Invoice No.:</strong>
                      <input
                        value={billData.invoiceNumber}
                        readOnly
                        type="text"
                        className="outline pl-1.5 outline-black rounded-sm w-[255px] h-[28.8px]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <strong className="ml-[16px]">Invoce Date:</strong>
                      <input
                        value={billData.invoiceDate}
                        readOnly
                        type="text"
                        className="outline pl-1.5 outline-black ml-[20px] rounded-sm w-[260px] h-[28.8px]"
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex gap-1">
                    <label className="font-bold text-[15px]">
                      Said to Contain:
                    </label>
                    <input
                      value={billData.saidToContain}
                      readOnly
                      className="outline pl-1 outline-black rounded-sm w-[422px] h-[28.8px]"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Charges Table */}
            <div className="flex gap-2">
              <table className="absolute right-[-78px] top-[135px] scale-[.65] w-[507px] text-sm mt-4 border border-gray-300 border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="outline outline-black p-2 text-left">
                      Freight Charges
                    </th>
                    <th className="outline outline-black p-2">Rs.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      Freight Amount
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(freightCharges)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      Docket Charges
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(docketCharges)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      Door Pickup Charges
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(pickupCharges)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      Door Delivery Charges
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(deliveryCharges)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      Other Expenses
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(otherExpenses)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      TOTAL
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(totalBeforeTax)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      CGST @ {cgstRate}%
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(cgst)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      SGST @ {sgstRate}%
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(sgst)}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[16px] p-2">
                      IGST @ {igstRate}%
                    </td>
                    <td className="outline outline-black p-2">
                      {formatCurrency(igst)}
                    </td>
                  </tr>
                  <tr className="bg-gray-100 font-bold">
                    <td className="outline outline-black p-2">GRAND TOTAL</td>
                    <td className="outline outline-black p-2">
                     ₹ {formatCurrency(grandTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Summary Table */}
              <table className="h-[225px] absolute left-[255px] top-[203px] scale-[.8] outline outline-black border-collapse text-sm table-fixed w-[129.2px]">
                <tbody>
                  <tr>
                    <td className="outline outline-black text-[13px] bg-gray-200 font-semibold w-[130px] max-h-[20px] p-2">
                      No. of Packages
                    </td>
                    <td
                      className="outline outline-black p-2 w-[80px] overflow-hidden text-ellipsis whitespace-nowrap text-center" /* 3vw=22.8px */
                      title={billData.packageCount}
                    >
                      {billData.packageCount}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[13px] bg-gray-200 font-semibold p-2">
                      Actual Weight
                    </td>
                    <td
                      className="outline outline-black p-2 overflow-hidden text-ellipsis whitespace-nowrap text-center"
                      title={billData.weight}
                    >
                      {billData.weight} Kg
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[13px] bg-gray-200 font-semibold p-2">
                      Chargeable Weight
                    </td>
                    <td
                      className="outline outline-black p-2 overflow-hidden text-ellipsis whitespace-nowrap text-center"
                      title={billData.chargeableWeight}
                    >
                      {billData.chargeableWeight} Kg
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[13px] bg-gray-200 font-semibold p-2">
                      Transport Mode
                    </td>
                    <td
                      className="outline outline-black p-2 overflow-hidden text-ellipsis whitespace-nowrap text-center"
                      title={billData.transportMode}
                    >
                      {billData.transportMode}
                    </td>
                  </tr>
                  <tr>
                    <td className="outline outline-black text-[13px] bg-gray-200 font-semibold p-2">
                      Payment status
                    </td>
                    <td
                      className="outline outline-black p-2 overflow-hidden text-ellipsis whitespace-nowrap text-center"
                      title={billData.paymentStatus}
                    >
                      {billData.paymentStatus}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Terms & Signature */}
            <div className="absolute left-[-60px] bottom-[-4px] scale-[.75] text-[13px]">
              <strong>TERMS & CONDITIONS:</strong>
              <p className="w-[580px]">
                1. We do not accept cash, jewellery, drugs, inflammables/
                explosives/ damage/ offensive and such commodities not
                permissible under Govt. Rules or banned by civil authorities. 2.
                Not liable when seized by Tax/Sales Authorities. 3. Not
                responsible for damage/delay due to fire, accidents, strikes,
                etc. 4. No claim after 7 days of booking.
              </p>
            </div>
            <div className="absolute right-[6px] bottom-[8px] w-[333px] flex justify-between items-center">
              <div className="text-[12px] font-bold">Customer's Signature</div>
              <div className="outline outline-black px-2 py-1 text-xsm font-semibold rounded">
                {copyTexts[1]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocketBill;
