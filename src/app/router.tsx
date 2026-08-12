import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthenticatedRoute, GuestOnlyRoute } from './guards';
import { ERPLayout } from '../layouts/ERPLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CustomersPage } from '../pages/CustomersPage';
import { CustomerFormPage } from '../pages/CustomerFormPage';
import { CustomerProfilePage } from '../pages/CustomerProfilePage';
import { ProductsPage } from '../pages/ProductsPage';
import { PurchasesPage } from '../pages/PurchasesPage';
import { NewPurchasePage } from '../pages/NewPurchasePage';
import { PurchaseDetailsPage } from '../pages/PurchaseDetailsPage';
import { InvoicesPage } from '../pages/InvoicesPage';
import { InvoiceDetailsPage } from '../pages/InvoiceDetailsPage';
import { PaymentsPage } from '../pages/PaymentsPage';
import { NewPaymentPage } from '../pages/NewPaymentPage';
import { PaymentDetailsPage } from '../pages/PaymentDetailsPage';
import { DuesPage } from '../pages/DuesPage';
import { DeliveriesPage } from '../pages/DeliveriesPage';
import { NewDeliveryPage } from '../pages/NewDeliveryPage';
import { DeliveryDetailsPage } from '../pages/DeliveryDetailsPage';
import { DriverVehiclePage } from '../pages/DriverVehiclePage';
import { ReportsPage } from '../pages/ReportsPage';
import { SmsHistoryPage } from '../pages/SmsHistoryPage';
import { UsersPage } from '../pages/UsersPage';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router=createBrowserRouter([
  {element:<GuestOnlyRoute/>,children:[{path:'/login',element:<LoginPage/>}]},
  {element:<AuthenticatedRoute/>,children:[
    {path:'/app',element:<ERPLayout/>,children:[
      {index:true,element:<Navigate to="dashboard" replace/>},{path:'dashboard',element:<DashboardPage/>},
      {path:'customers',element:<CustomersPage/>},{path:'customers/new',element:<CustomerFormPage/>},{path:'customers/:id',element:<CustomerProfilePage/>},
      {path:'products',element:<ProductsPage/>},
      {path:'purchases',element:<PurchasesPage/>},{path:'purchases/new',element:<NewPurchasePage/>},{path:'purchases/:id',element:<PurchaseDetailsPage/>},
      {path:'invoices',element:<InvoicesPage/>},{path:'invoices/:id',element:<InvoiceDetailsPage/>},
      {path:'payments',element:<PaymentsPage/>},{path:'payments/new',element:<NewPaymentPage/>},{path:'payments/:id',element:<PaymentDetailsPage/>},
      {path:'dues',element:<DuesPage/>},
      {path:'transport/deliveries',element:<DeliveriesPage/>},{path:'transport/deliveries/new',element:<NewDeliveryPage/>},{path:'transport/deliveries/:id',element:<DeliveryDetailsPage/>},
      {path:'transport/drivers',element:<DriverVehiclePage kind="driver"/>},{path:'transport/vehicles',element:<DriverVehiclePage kind="vehicle"/>},
      {path:'reports',element:<ReportsPage/>},{path:'sms-history',element:<SmsHistoryPage/>},{path:'users',element:<UsersPage/>},{path:'settings',element:<SettingsPage/>},
      {path:'*',element:<NotFoundPage/>}
    ]},
    {path:'/driver/deliveries',element:<Navigate to="/app/transport/deliveries" replace/>}
  ]},
  {path:'/',element:<Navigate to="/app/dashboard" replace/>},{path:'*',element:<Navigate to="/app/dashboard" replace/>}
]);
