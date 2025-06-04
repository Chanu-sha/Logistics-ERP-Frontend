import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { BillingContext } from "../context/BillingContext";

function BillForm() {
  const { setBillData } = useContext(BillingContext);
  const [formState, setFormState] = useState({
    companyName: "",
    gstin: "",
    address: "",
    invoiceDate: "",
    invoiceNumber: "",
    grnNumber: "",
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
    BillingState: "",
    shippingTocompanyName: "",
    shippingTogstin: "",
    shippingToAddress: "",
    shippingToState: "",
    igstPercentage: 0, // Initial value 0
    cgstPercentage: 0, // Initial value 0
    sgstPercentage: 0, // Initial value 0
  });

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

    if (
      name === "igstPercentage" ||
      name === "cgstPercentage" ||
      name === "sgstPercentage"
    ) {
      setFormState((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const generateRandomNumber = (prefix) => {
    const random4Digit = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${random4Digit}`;
  };

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      invoiceNumber: generateRandomNumber("INVC"),
      grnNumber: generateRandomNumber("GRN"),
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBillData(formState);

    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_MAINURL,
        formState,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Bill Details Saved Successfully!");
        setFormState({
          companyName: "",
          gstin: "",
          address: "",
          invoiceDate: "",
          invoiceNumber: generateRandomNumber("INVC"),
          grnNumber: generateRandomNumber("GRN"),
          shippingTocompanyName: "",
          shippingTogstin: "",
          shippingToAddress: "",
          shippingToState: "",
          packageCount: "",
          weight: "",
          perKgPrice: "",
          freightCharges: "",
          pickupCharges: "",
          deliveryCharges: "",
          sgstPercentage: 0,
          cgstPercentage: 0,
          igstPercentage: 0,
          from: "",
          to: "",
          chargeableWeight: "",
          paymentStatus: "",
          otherExpenses: "",
          saidToContain: "",
          consignerName: "",
          consignerAddress: "",
          consigneeName: "",
          consigneeAddress: "",
          BillingState: "",
        });
      }
    } catch (error) {
      console.error("Error saving to DB:", error);
      alert("Failed to save bill details.");
    }
  };

  return (
    <div className="bg-white w-full h-full p-4 overflow-auto">
      <div className="bg-white p-6 rounded-xl flex flex-col">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Billing Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company & Invoice Details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Billing To</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  name="companyName"
                  value={formState.companyName}
                  onChange={handleChange}
                  placeholder="Shipping Company Name"
                  className="border p-2 rounded text-sm"
                />
                <input
                  name="gstin"
                  value={formState.gstin}
                  onChange={handleChange}
                  placeholder="Shipping GSTIN"
                  className="border p-2 rounded text-sm"
                />
                <textarea
                  name="address"
                  value={formState.address}
                  onChange={handleChange}
                  placeholder="Shipping Address (From)"
                  className="border p-2 rounded text-sm resize-none h-16 md:col-span-2"
                />
                <input
                  name="BillingState"
                  value={formState.BillingState}
                  onChange={handleChange}
                  placeholder="Billing To State"
                  className="border p-2 rounded text-sm"
                />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Shipping To</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  name="shippingTocompanyName"
                  value={formState.shippingTocompanyName}
                  onChange={handleChange}
                  placeholder="Shipping To Company Name"
                  className="border p-2 rounded text-sm"
                />
                <input
                  name="shippingTogstin"
                  value={formState.shippingTogstin}
                  onChange={handleChange}
                  placeholder="Shipping To GSTIN"
                  className="border p-2 rounded text-sm"
                />
                <textarea
                  name="shippingToAddress"
                  value={formState.shippingToAddress}
                  onChange={handleChange}
                  placeholder="Shipping Address (To)"
                  className="border p-2 rounded text-sm resize-none h-16 md:col-span-2"
                />
                <input
                  name="shippingToState"
                  value={formState.shippingToState}
                  onChange={handleChange}
                  placeholder="Shipping To State"
                  className="border p-2 rounded text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                readOnly
              />
              <input
                name="grnNumber"
                value={formState.grnNumber}
                onChange={handleChange}
                placeholder="GR Number"
                className="border p-2 rounded text-sm"
                readOnly
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="from"
                  value={formState.from}
                  onChange={handleChange}
                  placeholder="From"
                  className="border p-2 rounded text-sm"
                />
                <input
                  name="to"
                  value={formState.to}
                  onChange={handleChange}
                  placeholder="To"
                  className="border p-2 rounded text-sm"
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
              <select
                name="paymentStatus"
                value={formState.paymentStatus}
                onChange={handleChange}
                className="border p-2 rounded text-sm"
              >
                <option value="">Payment Status</option>
                <option value="Paid">Paid</option>
                <option value="To Be Paid">To Be Paid</option>
                <option value="TBB">TBB</option>
              </select>
              <input
                name="otherExpenses"
                value={formState.otherExpenses}
                onChange={handleChange}
                placeholder="Other Expenses (₹)"
                type="number"
                step="0.01"
                className="border p-2 rounded text-sm"
              />
            </div>
          </div>

          {/* Transport details */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Transport details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="saidToContain"
                value={formState.saidToContain}
                onChange={handleChange}
                placeholder="Said to Contain"
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
              <div className="flex gap-2">
                <div className="flex-1 border p-2 rounded text-sm bg-gray-100 flex items-center">
                  IGST
                </div>
                <select
                  name="igstPercentage"
                  value={formState.igstPercentage}
                  onChange={handleChange}
                  className="border p-2 rounded text-sm flex-1"
                >
                  <option value={0}>Select IGST</option>
                  <option value={18}>18%</option>
                  <option value={9}>9%</option>
                  <option value={5}>5%</option>
                  <option value={2.5}>2.5%</option>
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 border p-2 rounded text-sm bg-gray-100 flex items-center">
                  CGST
                </div>
                <select
                  name="cgstPercentage"
                  value={formState.cgstPercentage}
                  onChange={handleChange}
                  className="border p-2 rounded text-sm flex-1"
                >
                  <option value={0}>Select CGST</option>
                  <option value={18}>18%</option>
                  <option value={9}>9%</option>
                  <option value={5}>5%</option>
                  <option value={2.5}>2.5%</option>
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 border p-2 rounded text-sm bg-gray-100 flex items-center">
                  SGST
                </div>
                <select
                  name="sgstPercentage"
                  value={formState.sgstPercentage}
                  onChange={handleChange}
                  className="border p-2 rounded text-sm flex-1"
                >
                  <option value={0}>Select SGST</option>
                  <option value={18}>18%</option>
                  <option value={9}>9%</option>
                  <option value={5}>5%</option>
                  <option value={2.5}>2.5%</option>
                </select>
              </div>
            </div>
          </div>

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

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-800 text-white rounded hover:bg-blue-700 text-sm"
            >
              Submit Bill Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BillForm;
