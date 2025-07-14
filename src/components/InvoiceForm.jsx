import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { BillingContext } from "../context/BillingContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function InvoiceForm() {
  const { setBillData } = useContext(BillingContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoiceNumber = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_INVOICE_API}/next-invoice-number`
        );
        if (response.status === 200) {
          setFormState((prev) => ({
            ...prev,
            invoiceNumber: response.data.nextInvoiceNumber,
          }));
        }
      } catch (error) {
        console.error("Error fetching invoice number:", error);
      }
    };

    fetchInvoiceNumber();
  }, []);

  const location = useLocation();
  const prefilledData = location.state?.prefilledData;

  const [formState, setFormState] = useState({
    companyName: prefilledData?.companyName || "",
    address: prefilledData?.address || "",
    invoiceDate: "",
    invoiceNumber: prefilledData?.invoiceNumber || "",
    grnNumber: "",
    shippingTocompanyName: "",
    shippingToAddress: "",
    packageCount: "",
    weight: "",
    chargeableWeight: "",
    perKgPrice: "",
    freightCharges: "",
    pickupCharges: "",
    deliveryCharges: "",
    otherExpenses: "",
    from: "",
    to: "",
    igstPercentage: 0,
    cgstPercentage: 0,
    sgstPercentage: 0,
  });

  const calculateFreightCharges = (chargeableWeight, price) => {
    const w = parseFloat(chargeableWeight) || 0;
    const p = parseFloat(price) || 0;
    return (w * p).toFixed(2);
  };

  const handleChargeableWeightPriceChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => {
      const newState = { ...prev, [name]: value };

      if (name === "chargeableWeight" || name === "perKgPrice") {
        newState.freightCharges = calculateFreightCharges(
          name === "chargeableWeight" ? value : prev.chargeableWeight,
          name === "perKgPrice" ? value : prev.perKgPrice
        );
      }

      return newState;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const parsedValue = [
      "igstPercentage",
      "cgstPercentage",
      "sgstPercentage",
    ].includes(name)
      ? parseFloat(value) || 0
      : value;

    setFormState((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const formatDateToDDMMYY = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formState,
      invoiceDate: formatDateToDDMMYY(formState.invoiceDate),
    };

    setBillData(formattedData);

    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_INVOICE_API,
        formattedData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        alert("Invoice Saved Successfully!");
        navigate("/dashboard/invoicepage");
      }
    } catch (error) {
      console.error("Error saving to DB:", error);
      alert("Failed to save invoice.");
    }
  };

  return (
    <div className="bg-white w-full h-[92vh] pt-0 p-4 overflow-auto">
      <div className="bg-white  p-6 rounded-xl flex flex-col">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Invoice Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* From Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="font-semibold mb-1">Sender</h2>
              <input
                name="companyName"
                value={formState.companyName}
                onChange={handleChange}
                placeholder="Company Name"
                className="border p-2 w-full rounded"
              />
              <textarea
                name="address"
                value={formState.address}
                onChange={handleChange}
                placeholder="Address"
                className="border p-2 w-full rounded mt-2 resize-none"
              />
            </div>

            {/* To Company */}
            <div>
              <h2 className="font-semibold mb-1">To</h2>
              <input
                name="shippingTocompanyName"
                value={formState.shippingTocompanyName}
                onChange={handleChange}
                placeholder="Company Name"
                className="border p-2 w-full rounded"
              />

              <textarea
                name="shippingToAddress"
                value={formState.shippingToAddress}
                onChange={handleChange}
                placeholder="Address"
                className="border p-2 w-full rounded mt-2 resize-none"
              />
            </div>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <input
              name="invoiceDate"
              type="date"
              value={formState.invoiceDate}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="invoiceNumber"
              value={formState.invoiceNumber}
              readOnly
              className="border p-2 rounded w-full bg-gray-100"
            />
            <input
              name="grnNumber"
              value={formState.grnNumber}
              onChange={handleChange}
              placeholder="GRN Number"
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Package & Charges */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
            <input
              name="packageCount"
              value={formState.packageCount}
              onChange={handleChange}
              placeholder="Packages"
              className="border p-2 rounded"
            />
            <input
              name="weight"
              value={formState.weight}
              onChange={handleChange}
              placeholder="Weight (kg)"
              type="number"
              step="0.01"
              className="border p-2 rounded text-sm"
            />
            <input
              name="chargeableWeight"
              value={formState.chargeableWeight}
              onChange={handleChargeableWeightPriceChange}
              placeholder="Chargeable Weight"
              type="number"
              step="0.01"
              className="border p-2 rounded text-sm"
            />
            <input
              name="perKgPrice"
              value={formState.perKgPrice}
              onChange={handleChargeableWeightPriceChange}
              placeholder="Per Kg Price (₹)"
              type="number"
              step="0.01"
              className="border p-2 rounded text-sm"
            />
            <input
              name="freightCharges"
              value={formState.freightCharges}
              readOnly
              className="border p-2 rounded bg-gray-100"
            />
            <input
              name="pickupCharges"
              value={formState.pickupCharges}
              onChange={handleChange}
              placeholder="Pickup (₹)"
              className="border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-2">
            <input
              name="deliveryCharges"
              value={formState.deliveryCharges}
              onChange={handleChange}
              placeholder="Delivery (₹)"
              className="border p-2 rounded"
            />
            <input
              name="otherExpenses"
              value={formState.otherExpenses}
              onChange={handleChange}
              placeholder="Other (₹)"
              className="border p-2 rounded"
            />
            <input
              name="from"
              value={formState.from}
              onChange={handleChange}
              placeholder="From (Location)"
              className="border p-2 rounded"
            />
            <input
              name="to"
              value={formState.to}
              onChange={handleChange}
              placeholder="To (Location)"
              className="border p-2 rounded"
            />
          </div>

          {/* GST Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <select
              name="igstPercentage"
              value={formState.igstPercentage}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value={0}>Select IGST</option>
              <option value={18}>18%</option>
              <option value={9}>9%</option>
              <option value={5}>5%</option>
              <option value={2.5}>2.5%</option>
            </select>
            <select
              name="cgstPercentage"
              value={formState.cgstPercentage}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value={0}>Select CGST</option>
              <option value={18}>18%</option>
              <option value={9}>9%</option>
              <option value={5}>5%</option>
              <option value={2.5}>2.5%</option>
            </select>
            <select
              name="sgstPercentage"
              value={formState.sgstPercentage}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value={0}>Select SGST</option>
              <option value={18}>18%</option>
              <option value={9}>9%</option>
              <option value={5}>5%</option>
              <option value={2.5}>2.5%</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InvoiceForm;
