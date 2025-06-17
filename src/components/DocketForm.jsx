import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { BillingContext } from "../context/BillingContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function DocketForm() {
  const { setBillData } = useContext(BillingContext);
  const navigate = useNavigate();

  const location = useLocation();
  const [formState, setFormState] = useState({
    invoiceDate: "",
    invoiceNumber: "",
    grnNumber: "",
    grDate: "",
    from: "",
    to: "",
    packageCount: "",
    transportMode: "",
    weight: "",
    chargeableWeight: "",
    perKgPrice: "",
    freightCharges: "",
    pickupCharges: "",
    deliveryCharges: "",
    paymentStatus: "",
    otherExpenses: "",
    saidToContain: "",
    consignerName: "",
    consignerAddress: "",
    consigneeName: "",
    consigneeAddress: "",
    igstPercentage: 0,
    cgstPercentage: 0,
    sgstPercentage: 0,
  });

  useEffect(() => {
    const prefilled = location.state?.prefilledData;
    setFormState((prev) => ({
      ...prev,
      consignerName: prefilled?.consignerName || "",
      consignerAddress: prefilled?.consignerAddress || "",
      grnNumber: prefilled?.grnNumber || "",
    }));
  }, [location.state]);

  useEffect(() => {
    const prefilled = location.state?.prefilledData;

    const fetchGRNNumber = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_DOCKET_API}/generate/grn-number`
        );
        if (response.status === 200) {
          setFormState((prev) => ({
            ...prev,
            grnNumber: response.data.grnNumber,
            consignerName: prefilled?.consignerName || "",
            consignerAddress: prefilled?.consignerAddress || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching GRN Number:", err);
        alert("Failed to fetch GRN Number from server");
      }
    };

    fetchGRNNumber();
  }, [location.state]);

  const calculateFreightCharges = (weight, price) => {
    const w = parseFloat(weight) || 0;
    const p = parseFloat(price) || 0;
    return (w * p).toFixed(2);
  };

  const handleWeightPriceChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "weight" || name === "perKgPrice") {
        newState.freightCharges = calculateFreightCharges(
          name === "weight" ? value : prev.weight,
          name === "perKgPrice" ? value : prev.perKgPrice
        );
      }
      return newState;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: ["igstPercentage", "cgstPercentage", "sgstPercentage"].includes(
        name
      )
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // First update context
      setBillData(formState);

      // Then make API call
      const response = await axios.post(
        `${import.meta.env.VITE_APP_DOCKET_API}`,
        formState,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Docket Saved Successfully!");
        navigate("/dashboard/docketPage");
      }
    } catch (error) {
      console.error("Error saving to DB:", error);
      alert(`Failed to save Docket details. Error: ${error.message}`);
    }
  };

  return (
    <div className="w-full h-[92vh] pb-0 p-4 overflow-hidden bg-white ">
      <div className="p-6 pt-1 rounded-xl h-full overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Docket Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Consigner & Consignee */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Consigner & Consignee</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <input
                  name="consignerName"
                  value={formState.consignerName}
                  onChange={handleChange}
                  placeholder="Consigner Name"
                  className="border p-2 rounded text-sm"
                />
                <textarea
                  name="consignerAddress"
                  value={formState.consignerAddress}
                  onChange={handleChange}
                  placeholder="Consigner Address"
                  className="border p-2 rounded text-sm resize-none h-16"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <input
                  name="consigneeName"
                  value={formState.consigneeName}
                  onChange={handleChange}
                  placeholder="Consignee Name"
                  className="border p-2 rounded text-sm"
                />
                <textarea
                  name="consigneeAddress"
                  value={formState.consigneeAddress}
                  onChange={handleChange}
                  placeholder="Consignee Address"
                  className="border p-2 rounded text-sm resize-none h-16"
                />
              </div>
            </div>
          </div>

          {/* Company & Invoice Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <input
                name="invoiceDate"
                value={formState.invoiceDate}
                onChange={handleChange}
                placeholder="Invoice Date"
                className="border p-2 rounded text-sm"
              />
              <input
                name="invoiceNumber"
                value={formState.invoiceNumber}
                onChange={handleChange}
                placeholder="Invoice Number"
                className="border p-2 rounded text-sm"
              />
              <div className="flex items-center gap-1   w-[515px]">
                <p className="font-semibold">Gr No.</p>
                <input
                  name="grnNumber"
                  value={formState.grnNumber}
                  onChange={handleChange}
                  placeholder="GR Number"
                  className="border p-2 rounded text-sm bg-gray-100"
                  readOnly
                />
                <input
                  name="grDate"
                  value={formState.grDate}
                  onChange={handleChange}
                  placeholder="Gr Date"
                  className="border p-2 ml-5 rounded text-sm"
                />
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <input
                  name="from"
                  value={formState.from}
                  onChange={handleChange}
                  placeholder="From"
                  className="border p-2 rounded text-sm col-span-1"
                />
                <input
                  name="to"
                  value={formState.to}
                  onChange={handleChange}
                  placeholder="To"
                  className="border p-2 rounded text-sm col-span-1"
                />
              </div>
            </div>
          </div>

          {/* Package & Charges */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Package & Charges</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <input
                name="packageCount"
                value={formState.packageCount}
                onChange={handleChange}
                placeholder="Package Count"
                className="border p-2 rounded text-sm"
              />
              <input
                name="weight"
                value={formState.weight}
                onChange={handleWeightPriceChange}
                placeholder="Weight (kg)"
                type="number"
                step="0.01"
                className="border p-2 rounded text-sm"
              />
              <input
                name="chargeableWeight"
                value={formState.chargeableWeight}
                onChange={handleChange}
                placeholder="Chargeable Weight"
                type="number"
                step="0.01"
                className="border p-2 rounded text-sm"
              />
              <input
                name="perKgPrice"
                value={formState.perKgPrice}
                onChange={handleWeightPriceChange}
                placeholder="Per Kg Price (₹)"
                type="number"
                step="0.01"
                className="border p-2 rounded text-sm"
              />
              <input
                name="freightCharges"
                value={formState.freightCharges}
                onChange={handleChange}
                placeholder="Freight Charges (₹)"
                type="number"
                step="0.01"
                className="border p-2 rounded text-sm bg-gray-100"
                readOnly
              />
              <input
                name="pickupCharges"
                value={formState.pickupCharges}
                onChange={handleChange}
                placeholder="Pickup Charges (₹)"
                type="number"
                step="0.01"
                className="border p-2 rounded text-sm"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <input
                name="deliveryCharges"
                value={formState.deliveryCharges}
                onChange={handleChange}
                placeholder="Delivery Charges (₹)"
                type="number"
                step="0.01"
                className="border p-2 rounded text-sm"
              />

              <input
                name="otherExpenses"
                value={formState.otherExpenses}
                onChange={handleChange}
                placeholder="Other Expenses (₹)"
                type="number"
                step="0.01"
                className="border p-2 rounded text-sm"
              />
              <select
                name="paymentStatus"
                value={formState.paymentStatus}
                onChange={handleChange}
                className="border p-2 rounded text-sm"
              >
                <option value="">Payment Status</option>
                <option value="Paid">Paid</option>
                <option value="To Pay">To Pay</option>
                <option value="TBB">TBB</option>
              </select>
            </div>
          </div>

          {/* Transport Details */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Transport details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="saidToContain"
                value={formState.saidToContain}
                onChange={handleChange}
                placeholder="Description of Goods"
                className="border p-2 rounded text-sm"
              />
              <select
                name="transportMode"
                value={formState.transportMode}
                onChange={handleChange}
                className="border p-2 rounded text-sm"
              >
                <option value="">Transport Mode</option>
                <option value="Air">Air</option>
                <option value="Surface">Surface</option>
                <option value="Train">Train</option>
              </select>
            </div>
          </div>

          {/* GST Details */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">GST Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["IGST", "CGST", "SGST"].map((tax) => (
                <div className="flex gap-2" key={tax}>
                  <div className="flex-1 border p-2 rounded text-sm bg-gray-100 flex items-center">
                    {tax}
                  </div>
                  <select
                    name={`${tax.toLowerCase()}Percentage`}
                    value={formState[`${tax.toLowerCase()}Percentage`]}
                    onChange={handleChange}
                    className="border p-2 rounded text-sm flex-1"
                  >
                    <option value={0}>Select {tax}</option>
                    <option value={18}>18%</option>
                    <option value={9}>9%</option>
                    <option value={5}>5%</option>
                    <option value={2.5}>2.5%</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-800 text-white rounded hover:bg-blue-700 text-sm"
            >
              Submit Docket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DocketForm;
