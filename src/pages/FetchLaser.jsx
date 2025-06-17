import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function FetchLaser() {
  const [statements, setStatements] = useState([]);
  const [search, setSearch] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const handleEditClick = (id) => {
    navigate(`/dashboard/editlaser/${id}`);
  };
  const fetchStatements = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_APP_STATEMENT_API);
      const data = res.data;
      if (Array.isArray(data)) {
        setStatements(data);
      } else {
        setStatements([]);
        console.error("Unexpected API response:", data);
      }
    } catch (err) {
      console.error("Error fetching statements:", err);
      setStatements([]);
    }
  };

  useEffect(() => {
    fetchStatements();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this statement?")) {
      setDeletingId(id);
      try {
        await axios.delete(`${import.meta.env.VITE_APP_STATEMENT_API}/${id}`);
        await fetchStatements();
        toast.success("Statement deleted successfully");
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Failed to delete statement");
      } finally {
        setDeletingId(null);
      }
    }
  };



  const filteredStatements = statements.filter((stmt) =>
    stmt.accountOf?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 h-[95vh] w-full mx-4 bg-white rounded-xl shadow-lg">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Account Of..."
          className="w-full outline-none p-3 border border-gray-300 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>


      <div className="overflow-x-auto  border border-gray-200">
        <table className="min-w-full border border-black text-sm text-gray-700">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Statement ID</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Account Of</th>
              <th className="p-3 border">Total Amount</th>
              <th className="p-3 border">Balance</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStatements.length > 0 ? (
              filteredStatements.map((stmt) => (
                <tr
                  key={stmt._id}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="p-3 border">{stmt.statementId}</td>
                  <td className="p-3 border">{stmt.statementDate}</td>
                  <td className="p-3 border">{stmt.accountOf}</td>
                  <td className="p-3 border">₹ {stmt.totalAmount}</td>
                  <td className="p-3 border">₹ {stmt.totalBalance}</td>
                  <td className="p-3  flex flex-wrap gap-2">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => handleEditClick(stmt._id)}
                    >
                      Edit
                    </button>
                    <button
                      className={`px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 ${
                        deletingId === stmt._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => handleDelete(stmt._id)}
                      disabled={deletingId === stmt._id}
                    >
                      {deletingId === stmt._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No matching statements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FetchLaser;
