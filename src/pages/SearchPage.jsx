import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import InvoiceModalPage from "./InvoiceModalPage";
import { useNavigate } from "react-router-dom";

function SearchPage() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const navigate = useNavigate();

  const fetchBills = () => {
    axios
      .get(import.meta.env.VITE_APP_MAINURL)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setBills(data);
        } else {
          setBills([]);
          console.error("Unexpected API format:", data);
        }
      })
      .catch((err) => {
        console.error("Error fetching bills:", err);
        setBills([]);
      });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_APP_MAINURL}/${id}`
        );

        if (response.data.success) {
          fetchBills();
          alert("Bill deleted successfully.");
        } else {
          alert("Failed to delete bill: " + response.data.message);
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete bill. Please try again.");
      }
    }
  };

  const handleAddClick = (bill) => {
    const billData = {
      companyName: bill.companyName,
      gstin: bill.gstin,
      address: bill.address,
    };
    navigate("/dashboard/billform", { state: { prefilledData: billData } });
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const filteredBills = bills.filter(
    (bill) =>
      bill.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      bill.shippingTocompanyName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (id) => {
    setSelectedBillId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 h-[95vh] w-full mx-4 bg-white rounded-xl shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by company name..."
          className="w-full outline-none p-2 border border-gray-300 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <InvoiceModalPage
          billId={selectedBillId}
          onUpdate={() => fetchBills()}
        />
      </Modal>

      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="p-2">Invoice Number</th>
            <th className="p-2">Company</th>
            <th className="p-2">Shipping To</th>
            <th className="p-2">Invoice Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBills.length > 0 ? (
            filteredBills.map((bill, index) => (
              <tr
                key={bill._id || index}
                className="border border-black hover:bg-gray-50"
              >
                <td className="p-2">{bill.invoiceNumber}</td>
                <td className="p-2">{bill.companyName}</td>
                <td className="p-2">{bill.shippingTocompanyName}</td>
                <td className="p-2">{bill.invoiceDate}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => handleAddClick(bill)}
                  >
                    New
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => handleEditClick(bill._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleDelete(bill._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No matching bills found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SearchPage;
