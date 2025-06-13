import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BillingContext } from "../context/BillingContext";
import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";
import logo from "../assets/DocketLogo.png";

export default function DocketEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { billData, setBillData } = useContext(BillingContext);
  const billRef = useRef();

  useEffect(() => {
    const fetchDocket = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_DOCKET_API}/${id}`
        );
        setBillData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching docket:", err);
        setLoading(false);
      }
    };
    fetchDocket();
  }, [id, setBillData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setBillData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${import.meta.env.VITE_APP_DOCKET_API}/${id}`, billData);
      navigate("/dashboard/fetchdocket");
    } catch (err) {
      console.error("Error updating docket:", err);
      alert(err.response?.data?.message || "Failed to update docket");
    } finally {
      setSaving(false);
    }
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


  if (loading) return <div className="p-4">Loading...</div>;
  if (!billData) return <div className="p-4">Docket not found.</div>;

  return (
    <div className="scale-[0.8]  ">
      {/* Editable DocketBill UI */}
      {/* <div className="w-[794px] h-[1123px] flex flex-col gap-[20px] items-center outline outline-black mb-4"> */}
        {/* First Copy - Editable */}
        <div
          ref={billRef}
          className="w-[793.7px] h-[552px] bg-white outline outline-black flex flex-col text-xs font-sans"
        >
          {/* Header Section */}
          <div
            className="relative"
            style={{ width: "100%", height: "648px", overflow: "hidden" }}
          >
            <img
              className="mx-auto ml-[10px] h-[108px] w-[780px]"
              src={logo}
              alt="logo"
            />

            {/* Company Info */}
            <div
              className="p-[24px] pl-[12px] pt-0"
              style={{ width: "1058.27px" }}
            >
              <div className="text-[13px] mb-1.5">
                <div className="text-[13px] mb-1.5">
                  <p>
                    Plot No. B-27, Chandaka Industrial State, Patia,
                    Bhubaneswar-751024 <br />
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
                    <strong> MSME :</strong> UDYAM-OD-19-0021152
                  </div>
                </div>
              </div>

              {/* GR Number and Date */}
              <div className="flex justify-between mt-1 text-sm">
                <div className="absolute top-[80px] right-[10px]">
                  <div>
                    <div>
                      <strong>G.R. No:</strong>
                      <input
                        name="grnNumber"
                        value={billData.grnNumber}
                        onChange={handleChange}
                        type="text"
                        className="outline outline-black ml-1 pl-1.5 rounded-sm w-[80px] h-[28.8px]"
                      />
                    </div>
                    <div>
                      <strong>Date:</strong>
                      <input
                        type="text"
                        name="invoiceDate"
                        value={billData.invoiceDate?.slice(0, 10)}
                        onChange={handleChange}
                        className="outline outline-black pl-1 ml-[24px] mt-[8px] rounded-sm w-[80px] h-[28.8px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Consignor/Consignee Info */}
              <div>
                <div className="flex flex-col text-sm">
                  <div className="flex flex-col">
                    <label className="font-semibold">
                      Consignor Name & Address:
                    </label>
                    <textarea
                      name="consignerInfo"
                      value={`${billData.consignerName}, ${billData.consignerAddress}`}
                      onChange={(e) => {
                        const [name, ...addressParts] =
                          e.target.value.split(", ");
                        setBillData((prev) => ({
                          ...prev,
                          consignerName: name,
                          consignerAddress: addressParts.join(", "),
                        }));
                      }}
                      className="w-[250px] outline outline-black h-[80px] resize-none p-2 rounded text-[14px] leading-tight"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold">
                      Consignee Name & Address:
                    </label>
                    <textarea
                      name="consigneeInfo"
                      value={`${billData.consigneeName}, ${billData.consigneeAddress}`}
                      onChange={(e) => {
                        const [name, ...addressParts] =
                          e.target.value.split(", ");
                        setBillData((prev) => ({
                          ...prev,
                          consigneeName: name,
                          consigneeAddress: addressParts.join(", "),
                        }));
                      }}
                      className="w-[250px] outline outline-black h-[80px] resize-none text-[14px] p-2 rounded"
                    />
                  </div>
                </div>

                {/* From/To Locations */}
                <div>
                  <div className="absolute right-[10px] top-[155px] flex flex-col gap-2">
                    <div className="flex gap-[40px]">
                      <strong>From:</strong>
                      <input
                        name="from"
                        value={billData.from}
                        onChange={handleChange}
                        type="text"
                        className="outline outline-black pl-1 rounded-sm w-[230px] h-[28.8px]"
                      />
                    </div>
                    <div className="flex gap-[36px]">
                      <strong>To:</strong>
                      <input
                        name="to"
                        value={billData.to}
                        onChange={handleChange}
                        type="text"
                        className="outline outline-black pl-1 ml-[20px] rounded-sm w-[230px] h-[28.8px]"
                      />
                    </div>
                  </div>

                  {/* Invoice Info */}
                  <div className="absolute scale-[.8] top-[400px] left-[-38px]">
                    <div className="flex gap-1">
                      <div className="mb-1 flex flex-col gap-1">
                        <strong>Invoice No.:</strong>
                        <input
                          name="invoiceNumber"
                          value={billData.invoiceNumber}
                          onChange={handleChange}
                          type="text"
                          className="outline outline-black pl-1.5 rounded-sm w-[255px] h-[28.8px]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <strong className="ml-[16px]">Invoice Date:</strong>
                        <input
                          type="text"
                          name="invoiceDate"
                          value={billData.invoiceDate?.slice(0, 10)}
                          onChange={handleChange}
                          className="outline outline-black pl-1.5 ml-[20px] rounded-sm w-[260px] h-[28.8px]"
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex gap-1">
                      <label className="font-bold text-[15px]">
                        Said to Contain:
                      </label>
                      <input
                        name="saidToContain"
                        value={billData.saidToContain}
                        onChange={handleChange}
                        className="boroutline outline-blackder pl-1 rounded-sm w-[422px] h-[28.8px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charges Table - Editable */}
              <div className="flex gap-2">
                <table className="absolute right-[-78px] top-[135px] scale-[.65] w-[507px] text-sm mt-4 outline outline-black border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="outline outline-black p-2 text-left">Freight Charges</th>
                      <th className="outline outline-black p-2">Rs.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="outline outline-black text-[16px] p-2">Freight Amount</td>
                      <td className="outline outline-black p-2">
                        <input
                          name="freightCharges"
                          value={billData.freightCharges || 0}
                          onChange={handleNumberChange}
                          type="number"
                          className="w-full text-right"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="outline outline-black text-[16px] p-2">Docket Charges</td>
                      <td className="outline outline-black p-2">
                        <input
                          name="docketCharges"
                          value={billData.docketCharges || 50}
                          onChange={handleNumberChange}
                          type="number"
                          className="w-full text-right"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="outline outline-black text-[16px] p-2">
                        Door Pickup Charges
                      </td>
                      <td className="outline outline-black p-2">
                        <input
                          name="pickupCharges"
                          value={billData.pickupCharges || 0}
                          onChange={handleNumberChange}
                          type="number"
                          className="w-full border-none text-right"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="outline outline-black text-[16px] p-2">
                        Door Delivery Charges
                      </td>
                      <td className="outline outline-black p-2">
                        <input
                          name="deliveryCharges"
                          value={billData.deliveryCharges || 0}
                          onChange={handleNumberChange}
                          type="number"
                          className="w-full text-right"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="outline outline-black text-[16px] p-2">Other Expenses</td>
                      <td className="outline outline-black p-2">
                        <input
                          name="otherExpenses"
                          value={billData.otherExpenses || 0}
                          onChange={handleNumberChange}
                          type="number"
                          className="w-full text-right"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="outline outline-black text-[16px] p-2">TOTAL</td>
                      <td className="outline outline-black p-2 text-right">
                        {(
                          (Number(billData.freightCharges) || 0) +
                          (Number(billData.docketCharges) || 50) +
                          (Number(billData.pickupCharges) || 0) +
                          (Number(billData.deliveryCharges) || 0) +
                          (Number(billData.otherExpenses) || 0)
                        ).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="outline outline-black text-[16px] p-2">
                        CGST @
                        <input
                          name="cgstPercentage"
                          value={billData.cgstPercentage || 0}
                          onChange={handleNumberChange}
                          type="number"
                          className="w-12  pl-1.5"
                        />
                        %
                      </td>
                      <td className="outline outline-black p-2 text-right">
                        {(
                          (((Number(billData.freightCharges) || 0) +
                            (Number(billData.docketCharges) || 50) +
                            (Number(billData.pickupCharges) || 0) +
                            (Number(billData.deliveryCharges) || 0) +
                            (Number(billData.otherExpenses) || 0)) *
                            (Number(billData.cgstPercentage) || 0)) /
                          100
                        ).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="outline outline-black text-[16px] p-2">
                        SGST @
                        <input
                          name="sgstPercentage"
                          value={billData.sgstPercentage || 0}
                          onChange={handleNumberChange}
                          type="number"
                          className="w-12  pl-1"
                        />
                        %
                      </td>
                      <td className="outline outline-black p-2 text-right">
                        {(
                          (((Number(billData.freightCharges) || 0) +
                            (Number(billData.docketCharges) || 50) +
                            (Number(billData.pickupCharges) || 0) +
                            (Number(billData.deliveryCharges) || 0) +
                            (Number(billData.otherExpenses) || 0)) *
                            (Number(billData.sgstPercentage) || 0)) /
                          100
                        ).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="outline outline-black text-[16px] p-2">
                        IGST @
                        <input
                          name="igstPercentage"
                          value={billData.igstPercentage || 0}
                          onChange={handleNumberChange}
                          type="number"
                          className="w-12 pl-1"
                        />
                        %
                      </td>
                      <td className="outline outline-black p-2 text-right">
                        {(
                          (((Number(billData.freightCharges) || 0) +
                            (Number(billData.docketCharges) || 50) +
                            (Number(billData.pickupCharges) || 0) +
                            (Number(billData.deliveryCharges) || 0) +
                            (Number(billData.otherExpenses) || 0)) *
                            (Number(billData.igstPercentage) || 0)) /
                          100
                        ).toFixed(2)}
                      </td>
                    </tr>
                    <tr className="bg-gray-100 font-bold">
                      <td className="outline outline-black p-2">GRAND TOTAL</td>
                      <td className="outline outline-black p-2 text-right">
                        ₹
                        {(
                          ((Number(billData.freightCharges) || 0) +
                            (Number(billData.docketCharges) || 50) +
                            (Number(billData.pickupCharges) || 0) +
                            (Number(billData.deliveryCharges) || 0) +
                            (Number(billData.otherExpenses) || 0)) *
                          (1 +
                            ((Number(billData.cgstPercentage) || 0) +
                              (Number(billData.sgstPercentage) || 0) +
                              (Number(billData.igstPercentage) || 0)) /
                              100)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Summary Table - Editable */}
                <table className="h-[225px] absolute left-[255px] top-[203px] scale-[.8] outline outline-black border-collapse text-sm table-fixed w-[129.2px]">
                  <tbody>
                    <tr>
                      <td className="outline outline-black text-[13px] bg-gray-200 font-semibold w-[130px] max-h-[20px] p-2">
                        No. of Packages
                      </td>
                      <td className="outline outline-black p-2 w-[80px] text-center">
                        <input
                          name="packageCount"
                          value={billData.packageCount}
                          onChange={handleChange}
                          type="text"
                          className="w-full text-center"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="outline outline-black text-[13px] bg-gray-200 font-semibold p-2">
                        Actual Weight
                      </td>
                      <td className="outline outline-black p-2 text-center">
                        <input
                          name="weight"
                          value={billData.weight}
                          onChange={handleChange}
                          type="text"
                          className="w-full  text-center"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="outline outline-black text-[13px] bg-gray-200 font-semibold p-2">
                        Chargeable Weight
                      </td>
                      <td className="outline outline-black p-2 text-center">
                        <input
                          name="chargeableWeight"
                          value={billData.chargeableWeight}
                          onChange={handleChange}
                          type="text"
                          className="w-full text-center"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="outline outline-black text-[13px] bg-gray-200 font-semibold p-2">
                        Transport Mode
                      </td>
                      <td className="outline outline-black p-2 text-center">
                        <select
                          name="transportMode"
                          value={billData.transportMode}
                          onChange={handleChange}
                          className="w-full  text-[12px] text-center"
                        >
                          <option value="Road">Surface</option>
                          <option value="Air">Air</option>
                          <option value="Rail">Rail</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td className="outline outline-black text-[13px] bg-gray-200 font-semibold p-2">
                        Payment status
                      </td>
                      <td className="outline outline-black p-2 text-center">
                        <select
                          name="paymentStatus"
                          value={billData.paymentStatus}
                          onChange={handleChange}
                          className="w-full text-center"
                        >
                          <option value="Paid">Paid</option>
                          <option value="Unpaid">Unpaid</option>
                          <option value="Partial">Partial</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="absolute left-[-60px] bottom-[-4px] scale-[.75] text-[13px]">
                <strong>TERMS & CONDITIONS:</strong>
                <p className="w-[580px]">
                  1. We do not accept cash, jewellery, drugs, inflammables/
                  explosives/ damage/ offensive and such commodities not
                  permissible under Govt. Rules or banned by civil authorities.
                  2. Not liable when seized by Tax/Sales Authorities. 3. Not
                  responsible for damage/delay due to fire, accidents, strikes,
                  etc. 4. No claim after 7 days of booking.
                </p>
              </div>

              {/* Signature Section */}
              <div className="absolute right-[6px] bottom-[8px] w-[333px] flex justify-between items-center">
                <div className="text-[12px] font-bold">
                  Customer's Signature
                </div>
                <div className="outline outline-black px-2 py-1 text-xsm font-semibold rounded">
                  <select
                    name="copyType"
                    value={billData.copyType || "CONSIGNOR COPY"}
                    onChange={handleChange}
                    className="border-none"
                  >
                    <option value="CONSIGNOR COPY">CONSIGNOR COPY</option>
                    <option value="CONSIGNEE COPY">CONSIGNEE COPY</option>
                    <option value="POD COPY">POD COPY</option>
                    <option value="OFFICE COPY">OFFICE COPY</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {downloading ? "Generating..." : "Download PDF"}
        </button>

        <button
          onClick={() => navigate("/dashboard/fetchdocket")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
