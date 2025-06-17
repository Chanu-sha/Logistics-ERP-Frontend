import { NavLink } from "react-router-dom";
import Logo  from "../assets/F-Logo.png";

function AdminNavbar() {
  const links = [
    { name: "Dashboard", to: "/dashboard" },
    { name: "DocketPage", to: "/dashboard/docketPage" },
    { name: "InvoicePage", to: "/dashboard/invoicepage" },
    { name: "LaserPage", to: "/dashboard/laserpage" },
    { name: "InvoiceList", to: "/dashboard/fetchInvoice" },
    { name: "DocketList", to: "/dashboard/fetchDocket" },
    { name: "LaserList", to: "/dashboard/fetchLaser" },
  ];

  return (
    <aside className="w-64 bg-blue-800 text-white min-h-screen p-6">
      <div className="mb-8 flex items-center">
        <img src={Logo} className="h-12  mr-4" />
        <div>
          <h2 className="font-bold">Tapan Mandal</h2>
          <a href="https://shreesailogistics.in/" className="text-sm">shreesailogistics.in</a>
        </div>
      </div>
      <nav className="space-y-2">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded hover:bg-blue-700 ${
                isActive ? "bg-blue-900" : ""
              }`
            }
          >
            {l.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AdminNavbar;
