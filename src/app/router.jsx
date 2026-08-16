import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth
import LoginPage from "../features/auth/pages/LoginPage";

// Pages
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CustomersListPage from "../features/customers/pages/CustomersListPage";
import AddCustomerPage from "../features/customers/pages/AddCustomerPage";
import CustomerProfilePage from "../features/customers/pages/CustomerProfilePage";

import ProductsPage from "../features/products/pages/ProductsPage";

import PurchasesListPage from "../features/purchases/pages/PurchasesListPage";
import NewPurchasePage from "../features/purchases/pages/NewPurchasePage";
import PurchaseDetailsPage from "../features/purchases/pages/PurchaseDetailsPage";

import InvoicesListPage from "../features/invoices/pages/InvoicesListPage";
import InvoicePage from "../features/invoices/pages/InvoicePage";

import PaymentsListPage from "../features/payments/pages/PaymentsListPage";
import ReceivePaymentPage from "../features/payments/pages/ReceivePaymentPage";
import PaymentDetailsPage from "../features/payments/pages/PaymentDetailsPage";

import DuesPage from "../features/dues/pages/DuesPage";

import DeliveriesListPage from "../features/transport/pages/DeliveriesListPage";
import NewDeliveryPage from "../features/transport/pages/NewDeliveryPage";
import DeliveryDetailsPage from "../features/transport/pages/DeliveryDetailsPage";
import DriversPage from "../features/transport/pages/DriversPage";
import VehiclesPage from "../features/transport/pages/VehiclesPage";

import ReportsPage from "../features/reports/pages/ReportsPage";
import SmsHistoryPage from "../features/sms/pages/SmsHistoryPage";
import UsersPage from "../features/users/pages/UsersPage";
import SettingsPage from "../features/settings/pages/SettingsPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/app/dashboard" replace />;
  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/app/dashboard" replace />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Navigate to="/app/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      
      { path: "customers", element: <CustomersListPage /> },
      { path: "customers/new", element: <AddCustomerPage /> },
      { path: "customers/:id", element: <CustomerProfilePage /> },
      
      { path: "products", element: <ProductsPage /> },
      
      { path: "purchases", element: <PurchasesListPage /> },
      { path: "purchases/new", element: <NewPurchasePage /> },
      { path: "purchases/:id", element: <PurchaseDetailsPage /> },
      
      { path: "invoices", element: <InvoicesListPage /> },
      { path: "invoices/:id", element: <InvoicePage /> },
      
      { path: "payments", element: <PaymentsListPage /> },
      { path: "payments/new", element: <ReceivePaymentPage /> },
      { path: "payments/:id", element: <PaymentDetailsPage /> },
      
      { path: "dues", element: <DuesPage /> },
      
      { path: "transport/deliveries", element: <DeliveriesListPage /> },
      { path: "transport/deliveries/new", element: <NewDeliveryPage /> },
      { path: "transport/deliveries/:id", element: <DeliveryDetailsPage /> },
      { path: "transport/drivers", element: <DriversPage /> },
      { path: "transport/vehicles", element: <VehiclesPage /> },
      
      { path: "reports", element: <ReportsPage /> },
      { path: "sms-history", element: <SmsHistoryPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "settings", element: <SettingsPage /> },
      
      { path: "*", element: <div className="card" style={{margin:"2rem"}}><h2>404 Not Found</h2><p>এই পেজটি খুঁজে পাওয়া যায়নি।</p></div>}
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
