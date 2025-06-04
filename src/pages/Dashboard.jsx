import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

function Dashboard() {
  return (
    <div className="flex  h-screen overflow-hidden">
      <AdminNavbar />
      <main className="flex  justify-center items-center bg-gray-100 min-h-screen w-full ">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
