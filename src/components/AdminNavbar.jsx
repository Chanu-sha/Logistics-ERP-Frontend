import { NavLink } from "react-router-dom";

function AdminNavbar() {
  const links = [
    { name: "Dashboard Home", to: "/dashboard" },
    { name: "DocketPage", to: "/dashboard/docketPage" },
    { name: "InvoicePage", to: "/dashboard/invoicepage" },
    { name: "Search", to: "/dashboard/search" },
  ];

  return (
    <aside className="w-64 bg-blue-800 text-white min-h-screen p-6">
      <div className="mb-8 flex items-center">
        <div className="h-12 w-12 bg-gray-300 rounded-full mr-4" />
        <div>
          <h2 className="font-bold">Tapan Mandal</h2>
          <p className="text-sm">shreesailogistics.in</p>
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
