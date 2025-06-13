import { Routes, Route, Navigate } from "react-router-dom";
import WelcomeScreen from "./pages/WelcomeScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import TaxInvoiceBill from "./components/TaxInvoiceBill";
import DocketPage from "./pages/DocketPage";
import InvoicePage from "./pages/InvoicePage";
import { BillingProvider } from "./context/BillingContext";
import InvoiceForm from "./components/InvoiceForm";
import DocketForm from "./components/DocketForm";
import FetchInvoice from "./pages/FetchInvoice";
import FetchDocket from "./pages/FetchDocket";
import DocketEditPage from "./pages/DocketEditPage";
import FormLayout from "./components/FormLayout";

function App() {
  return (
    <BillingProvider>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            {/* Redirect /dashboard to /dashboard/form */}
            <Route index element={<Navigate to="form" replace />} />

            {/* Form layout with nested routes */}
            <Route path="form" element={<FormLayout />}>
              {/* Redirect /dashboard/form to /dashboard/form/invoicform */}
              <Route index element={<Navigate to="invoicform" replace />} />
              <Route path="invoicform" element={<InvoiceForm />} />
              <Route path="docketform" element={<DocketForm />} />
            </Route>

            {/* Other dashboard routes */}
            <Route path="docketPage" element={<DocketPage />} />
            <Route path="invoicepage" element={<InvoicePage />} />
            <Route path="invoice" element={<TaxInvoiceBill />} />
            <Route path="fetchInvoice" element={<FetchInvoice />} />
            <Route path="fetchDocket" element={<FetchDocket />} />
            <Route path="editdocket/:id" element={<DocketEditPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BillingProvider>
  );
}

export default App;
