import "./App.css";
import { Route, Routes } from "react-router";
import Dashboard from "./views/dashboard/dashboard";
import Layout from "./views/layout";
import NotificationSystems from "./views/notification/notification";
import MicroInteractionShowcase from "./views/microinteractions/microinteractions";
import InvoiceForm from "./views/form/form";
import DataVisualizationPage from "./views/dataviz/dataviz";
import LoadingShowcase from "./views/loading/loading";
import ContextualNavigationShowcase from "./views/navigations/navigations";
import InvoicePage from "./views/form/list";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="poc/form" element={<InvoiceForm />} />
        <Route path="poc/list" element={<InvoicePage />} />
        <Route path="poc/notification" element={<NotificationSystems />} />
        <Route
          path="poc/microinteractions"
          element={<MicroInteractionShowcase />}
        />
        <Route path="poc/dataviz" element={<DataVisualizationPage />} />
        <Route path="poc/loading" element={<LoadingShowcase />} />
        <Route
          path="poc/navigations"
          element={<ContextualNavigationShowcase />}
        />
      </Route>
    </Routes>
  );
}

export default App;
