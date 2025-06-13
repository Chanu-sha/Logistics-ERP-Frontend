import { NavLink, Outlet } from "react-router-dom";

function FormLayout() {
  return (
    <div className="flex flex-col w-full  ">
      <div className="bg-white pb-0 p-4 flex space-x-4">
        <NavLink
          to="/dashboard/form/invoicform"
          className={({ isActive }) =>
            `px-4 py-2 rounded ${
              isActive ? "bg-blue-800 text-white" : "bg-gray-200 text-black"
            }`
          }
        >
          Invoice Form
        </NavLink>
        <NavLink
          to="/dashboard/form/docketform"
          className={({ isActive }) =>
            `px-4 py-2 rounded ${
              isActive ? "bg-blue-800 text-white" : "bg-gray-200 text-black"
            }`
          }
        >
          Docket Form
        </NavLink>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default FormLayout;
