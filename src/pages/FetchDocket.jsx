import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function FetchDocket() {
  const [dockets, setDockets] = useState([]);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchDockets = () => {
    axios
      .get(import.meta.env.VITE_APP_DOCKET_API)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setDockets(res.data);
        } else {
          setDockets([]);
          console.error("Unexpected response format:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching dockets:", err);
        setDockets([]);
      });
  };

  useEffect(() => {
    fetchDockets();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this docket?")) {
      setDeletingId(id);
      try {
        await axios.delete(`${import.meta.env.VITE_APP_DOCKET_API}/${id}`);
        fetchDockets();
        toast.success("Docket deleted successfully");
      } catch (err) {
        console.error("Error deleting docket:", err);
        toast.error("Failed to delete docket");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleAddClick = (docket) => {
    const prefilledData = {
      consignerName: docket.consignerName,
      consignerAddress: docket.consignerAddress,
    };
    navigate("/dashboard/form/docketform", { state: { prefilledData } });
  };

  const handleEditClick = (id) => {
    navigate(`/dashboard/editdocket/${id}`);
  };

  const filteredDockets = dockets.filter((d) =>
    [d.companyName, d.consignerName, d.consigneeName].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-4 h-[95vh] w-full mx-4 bg-white rounded-xl  overflow-y-auto shadow">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by company, consigner, or consignee name..."
          className="w-full outline-none p-2 border border-gray-300 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full table-fixed text-sm">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="p-2 w-32">GRN Number</th>
            <th className="p-2 w-40">Consigner</th>
            <th className="p-2 w-40">Consignee</th>
            <th className="p-2 w-32">Invoice Date</th>
            <th className="p-2 w-40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDockets.length > 0 ? (
            filteredDockets.map((docket) => (
              <tr
                key={docket._id}
                className="border border-black hover:bg-gray-50"
              >
                <td className="p-2 truncate ">{docket.grnNumber}</td>
                <td className="p-2 truncate ">{docket.consignerName}</td>
                <td className="p-2 truncate ">{docket.consigneeName}</td>
                <td className="p-2 truncate ">{docket.invoiceDate}</td>
                <td className="p-2 truncate  space-x-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => handleAddClick(docket)}
                  >
                    New
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => handleEditClick(docket._id)}
                  >
                    Edit
                  </button>
                  <button
                    className={`px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 ${
                      deletingId === docket._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => handleDelete(docket._id)}
                    disabled={deletingId === docket._id}
                  >
                    {deletingId === docket._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No matching dockets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FetchDocket;
