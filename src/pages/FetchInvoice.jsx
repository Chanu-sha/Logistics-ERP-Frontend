import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import InvoiceEditPage from "./InvoiceEditPage";

function FetchInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchInvoices = () => {
    axios
      .get(import.meta.env.VITE_APP_INVOICE_API)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setInvoices(data);
        } else {
          setInvoices([]);
          console.error("Unexpected API response:", data);
        }
      })
      .catch((err) => {
        console.error("Error fetching invoices:", err);
        setInvoices([]);
      });
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      setDeletingId(id);
      try {
        await axios.delete(`${import.meta.env.VITE_APP_INVOICE_API}/${id}`);
        await fetchInvoices();
        toast.success("Invoice deleted successfully");
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Failed to delete Invoice");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleAddClick = (invoice) => {
    const prefilledData = {
      companyName: invoice.companyName,
      gstin: invoice.gstin,
      address: invoice.address,
    };
    navigate("/dashboard/form/invoicform", { state: { prefilledData } });
  };

  const handleEditClick = (id) => {
    setSelectedInvoiceId(id);
    setIsModalOpen(true);
    l;
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      inv.shippingTocompanyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 h-[95vh] w-full mx-4 bg-white overflow-y-auto rounded-xl shadow">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by company or shipping company name..."
          className="w-full outline-none p-2 border border-gray-300 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <InvoiceEditPage
          billId={selectedInvoiceId}
          onUpdate={() => {
            fetchInvoices();
            setIsModalOpen(false);
          }}
        />
      </Modal>

      <table className="w-full table-fixed text-sm">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="p-2 w-36">Invoice Number</th>
            <th className="p-2 w-40">Company</th>
            <th className="p-2 w-48">Shipping To</th>
            <th className="p-2 w-32">Invoice Date</th>
            <th className="p-2 w-44">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((inv, index) => (
              <tr
                key={inv._id || index}
                className="border border-black hover:bg-gray-50"
              >
                <td className="p-2 truncate">{inv.invoiceNumber}</td>
                <td className="p-2 truncate">{inv.companyName}</td>
                <td className="p-2 truncate">{inv.shippingTocompanyName}</td>
                <td className="p-2 truncate">{inv.invoiceDate}</td>
                <td className="p-2 truncate space-x-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => handleAddClick(inv)}
                  >
                    New
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => handleEditClick(inv._id)}
                  >
                    Edit
                  </button>
                  <button
                    className={`px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 ${
                      deletingId === inv._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => handleDelete(inv._id)}
                    disabled={deletingId === inv._id}
                  >
                    {deletingId === inv._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No matching invoices found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FetchInvoice;
