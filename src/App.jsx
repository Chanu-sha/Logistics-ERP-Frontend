import { Routes, Route, Navigate } from "react-router-dom";
import WelcomeScreen from "./pages/WelcomeScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import TaxInvoiceBill from "./components/TaxInvoiceBill";
import BillForm from "./components/BillForm";
import SearchPage from "./pages/SearchPage";
import DocketPage from "./pages/DocketPage";
import InvoicePage from "./pages/InvoicePage";
import { BillingProvider } from "./context/BillingContext";

function App() {
  return (
    <BillingProvider>
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<BillForm />} />

          <Route path="docketPage" element={<DocketPage/>} />
          <Route path="invoicepage" element={<InvoicePage/>} />
          <Route path="invoice" element={<TaxInvoiceBill />} />
          <Route path="billform" element={<BillForm />} />
          <Route path="search" element={<SearchPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </BillingProvider>
  );
}

export default App;
