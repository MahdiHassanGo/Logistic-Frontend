import { createContext, useContext, useState } from "react";

const AppDataContext = createContext();

const initialCustomers = [
  {
    id: "CUS-001",
    name: "মোঃ আব্দুল করিম",
    shopName: "করিম বিল্ডার্স",
    businessName: "করিম বিল্ডার্স",
    village: "চট্টগ্রাম সদর",
    phone: "01711223344",
    address: "৫ নং ওয়ার্ড, চট্টগ্রাম",
    due: 43900,
    status: "ACTIVE"
  },
  {
    id: "CUS-002",
    name: "মোঃ রফিকুল ইসলাম",
    shopName: "রফিক কনস্ট্রাকশন",
    businessName: "রফিক কনস্ট্রাকশন",
    village: "কুমিল্লা",
    phone: "01855667788",
    address: "কুমিল্লা সদর",
    due: 28500,
    status: "ACTIVE"
  },
  {
    id: "CUS-003",
    name: "মোঃ শহিদুল আলম",
    shopName: "শহিদ ডেভেলপার্স",
    businessName: "শহিদ ডেভেলপার্স",
    village: "সিলেট",
    phone: "01933445566",
    address: "সিলেট সদর, সিলেট",
    due: 0,
    status: "ACTIVE"
  },
  {
    id: "CUS-004",
    name: "মোসাম্মৎ ফাতেমা বেগম",
    shopName: "ফাতেমা বিল্ডিং মেটেরিয়ালস",
    businessName: "ফাতেমা বিল্ডিং মেটেরিয়ালস",
    village: "রাজশাহী",
    phone: "01744556677",
    address: "রাজশাহী নগর",
    due: -15000,
    status: "ACTIVE"
  },
  {
    id: "CUS-005",
    name: "মোঃ নুরুল হক",
    shopName: "হক ইঞ্জিনিয়ারিং",
    businessName: "হক ইঞ্জিনিয়ারিং",
    village: "ময়মনসিংহ",
    phone: "01622334455",
    address: "ময়মনসিংহ সদর",
    due: 67200,
    status: "ACTIVE"
  },
  {
    id: "CUS-006",
    name: "মোঃ জাহিদ হোসেন",
    shopName: "জাহিদ কন্ট্রাক্টর",
    businessName: "জাহিদ কন্ট্রাক্টর",
    village: "নারায়ণগঞ্জ",
    phone: "01988776655",
    address: "নারায়ণগঞ্জ সদর",
    due: 12300,
    status: "ACTIVE"
  },
  {
    id: "CUS-007",
    name: "মোঃ আমিনুল ইসলাম",
    shopName: "আমিন বিল্ডার্স",
    businessName: "আমিন বিল্ডার্স",
    village: "গাজীপুর",
    phone: "01511223344",
    address: "গাজীপুর সিটি",
    due: 0,
    status: "INACTIVE"
  }
];

/* ─── Construction Material Product Catalogue ─────────────────────── */
const initialProducts = [
  /* রড (Steel Rod) */
  { id: "ROD-001", code: "R001", name: "BSRM রড", category: "রড", brand: "BSRM", unit: "কেজি", price: 105, status: "ACTIVE" },
  { id: "ROD-002", code: "R002", name: "KSRM রড", category: "রড", brand: "KSRM", unit: "কেজি", price: 108, status: "ACTIVE" },
  { id: "ROD-003", code: "R003", name: "GPH রড",  category: "রড", brand: "GPH",  unit: "কেজি", price: 104, status: "ACTIVE" },
  { id: "ROD-004", code: "R004", name: "AKS রড",  category: "রড", brand: "AKS",  unit: "কেজি", price: 103, status: "ACTIVE" },
  { id: "ROD-005", code: "R005", name: "RSRM রড", category: "রড", brand: "RSRM", unit: "কেজি", price: 102, status: "ACTIVE" },
  /* সিমেন্ট (Cement) */
  { id: "CEM-001", code: "C001", name: "Crown Cement",       category: "সিমেন্ট", brand: "Crown Cement",       unit: "ব্যাগ", price: 570, status: "ACTIVE" },
  { id: "CEM-002", code: "C002", name: "Shah Cement",        category: "সিমেন্ট", brand: "Shah Cement",        unit: "ব্যাগ", price: 580, status: "ACTIVE" },
  { id: "CEM-003", code: "C003", name: "Seven Rings Cement", category: "সিমেন্ট", brand: "Seven Rings Cement", unit: "ব্যাগ", price: 565, status: "ACTIVE" },
  { id: "CEM-004", code: "C004", name: "Fresh Cement",       category: "সিমেন্ট", brand: "Fresh Cement",       unit: "ব্যাগ", price: 560, status: "ACTIVE" },
  { id: "CEM-005", code: "C005", name: "Bashundhara Cement", category: "সিমেন্ট", brand: "Bashundhara Cement", unit: "ব্যাগ", price: 555, status: "ACTIVE" },
  { id: "CEM-006", code: "C006", name: "Premier Cement",     category: "সিমেন্ট", brand: "Premier Cement",     unit: "ব্যাগ", price: 562, status: "ACTIVE" },
  /* ইট (Brick) */
  { id: "BRK-001", code: "B001", name: "১নং ইট",  category: "ইট", unit: "পিস",  price: 14,  status: "ACTIVE" },
  { id: "BRK-002", code: "B002", name: "২নং ইট",  category: "ইট", unit: "পিস",  price: 11,  status: "ACTIVE" },
  /* বালি (Sand) */
  { id: "SND-001", code: "S001", name: "মোটা বালি",   category: "বালি", unit: "CFT", price: 70, status: "ACTIVE" },
  { id: "SND-002", code: "S002", name: "মাঝারি বালি", category: "বালি", unit: "CFT", price: 65, status: "ACTIVE" },
  { id: "SND-003", code: "S003", name: "সিলেট বালি",  category: "বালি", unit: "CFT", price: 80, status: "ACTIVE" },
  /* পাথর / খোয়া (Stone / Aggregate) */
  { id: "STN-001", code: "ST001", name: "পাথর (১ ইঞ্চি)",    category: "পাথর", unit: "CFT", price: 95, status: "ACTIVE" },
  { id: "STN-002", code: "ST002", name: "খোয়া (ভাঙা ইট)", category: "খোয়া", unit: "CFT", price: 40, status: "ACTIVE" },
];

/* ─── Sample invoices: মোঃ আব্দুল করিম (CUS-001) ─────────────────── */
const initialInvoices = [
  {
    id: "DK-INV-2026-1001",
    customerId: "CUS-001",
    date: "2026-08-16",
    items: [
      { product: "BSRM রড — ১০ মিমি — ৫০০ কেজি × ৳১০৫", category: "রড", brand: "BSRM", size: "১০ মিমি", quantity: 500, unit: "কেজি", unitPrice: 105, discount: 0 },
      { product: "Crown Cement — ৫০ কেজি — ২০ ব্যাগ × ৳৫৭০",  category: "সিমেন্ট", brand: "Crown Cement", bagSize: "৫০ কেজি", quantity: 20, unit: "ব্যাগ", unitPrice: 570, discount: 0 },
    ],
    amount: 63900,
    paid: 20000,
    due: 43900,
    status: "UNPAID"
  },
  {
    id: "DK-INV-2026-1002",
    customerId: "CUS-001",
    date: "2026-08-18",
    items: [
      { product: "KSRM রড — ১২ মিমি — ৩০০ কেজি × ৳১০৮", category: "রড", brand: "KSRM", size: "১২ মিমি", quantity: 300, unit: "কেজি", unitPrice: 108, discount: 0 },
      { product: "Shah Cement — ৫০ কেজি — ১৫ ব্যাগ × ৳৫৮০",   category: "সিমেন্ট", brand: "Shah Cement", bagSize: "৫০ কেজি", quantity: 15, unit: "ব্যাগ", unitPrice: 580, discount: 0 },
    ],
    amount: 41100,
    paid: 15000,
    due: 26100,
    status: "UNPAID"
  },
  {
    id: "DK-INV-2026-1003",
    customerId: "CUS-001",
    date: "2026-08-20",
    items: [
      { product: "১নং ইট — ২,০০০ পিস × ৳১৪",     category: "ইট",  quantity: 2000, unit: "পিস",  unitPrice: 14, discount: 0 },
      { product: "মাঝারি বালি — ১৫০ CFT × ৳৬৫", category: "বালি", quantity: 150,  unit: "CFT",  unitPrice: 65, discount: 0 },
    ],
    amount: 37750,
    paid: 10000,
    due: 27750,
    status: "UNPAID"
  },
  {
    id: "DK-INV-2026-1004",
    customerId: "CUS-001",
    date: "2026-08-22",
    items: [
      { product: "Crown Cement — ৫০ কেজি — ৩০ ব্যাগ × ৳৫৭০", category: "সিমেন্ট", brand: "Crown Cement", bagSize: "৫০ কেজি", quantity: 30, unit: "ব্যাগ", unitPrice: 570, discount: 0 },
      { product: "BSRM রড — ১৬ মিমি — ২০০ কেজি × ৳১০৬",       category: "রড", brand: "BSRM", size: "১৬ মিমি", quantity: 200, unit: "কেজি", unitPrice: 106, discount: 0 },
    ],
    amount: 38300,
    paid: 25000,
    due: 13300,
    status: "UNPAID"
  },
  /* ─── মোঃ রফিকুল ইসলাম (CUS-002) ─── */
  {
    id: "DK-INV-2026-2001",
    customerId: "CUS-002",
    date: "2026-08-10",
    items: [
      { product: "GPH রড — ১২ মিমি — ৪০০ কেজি × ৳১০৪", category: "রড", brand: "GPH", size: "১২ মিমি", quantity: 400, unit: "কেজি", unitPrice: 104, discount: 0 },
      { product: "Seven Rings Cement — ৫০ কেজি — ১০ ব্যাগ × ৳৫৬৫", category: "সিমেন্ট", brand: "Seven Rings Cement", bagSize: "৫০ কেজি", quantity: 10, unit: "ব্যাগ", unitPrice: 565, discount: 0 },
    ],
    amount: 47250,
    paid: 18750,
    due: 28500,
    status: "UNPAID"
  },
  /* ─── মোঃ নুরুল হক (CUS-005) ─── */
  {
    id: "DK-INV-2026-5001",
    customerId: "CUS-005",
    date: "2026-08-14",
    items: [
      { product: "BSRM রড — ২০ মিমি — ৬০০ কেজি × ৳১০৬", category: "রড", brand: "BSRM", size: "২০ মিমি", quantity: 600, unit: "কেজি", unitPrice: 106, discount: 0 },
      { product: "Bashundhara Cement — ৫০ কেজি — ২৫ ব্যাগ × ৳৫৫৫", category: "সিমেন্ট", brand: "Bashundhara Cement", bagSize: "৫০ কেজি", quantity: 25, unit: "ব্যাগ", unitPrice: 555, discount: 0 },
      { product: "পাথর (১ ইঞ্চি) — ১০০ CFT × ৳৯৫", category: "পাথর", quantity: 100, unit: "CFT", unitPrice: 95, discount: 0 },
    ],
    amount: 86175,
    paid: 18975,
    due: 67200,
    status: "UNPAID"
  }
];

const initialPurchases = [...initialInvoices];
const initialPayments = [];
const initialDeliveries = [];
const initialDrivers = [];
const initialVehicles = [];
const initialUsers = [
  { id: "USER-001", name: "Admin", username: "admin", role: "OWNER", status: "ACTIVE" }
];

export function AppDataProvider({ children }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [products, setProducts] = useState(initialProducts);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [purchases, setPurchases] = useState(initialPurchases);
  const [payments, setPayments] = useState(initialPayments);
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [users, setUsers] = useState(initialUsers);

  const addCustomer = (customer) => setCustomers(prev => [...prev, customer]);
  const addProduct = (product) => setProducts(prev => [...prev, product]);
  const addPurchase = (purchase) => setPurchases(prev => [...prev, purchase]);
  const addInvoice = (invoice) => setInvoices(prev => [...prev, invoice]);
  const addPayment = (payment) => setPayments(prev => [...prev, payment]);
  const addDelivery = (delivery) => setDeliveries(prev => [...prev, delivery]);
  const addDriver = (driver) => setDrivers(prev => [...prev, driver]);
  const addVehicle = (vehicle) => setVehicles(prev => [...prev, vehicle]);
  const addUser = (user) => setUsers(prev => [...prev, user]);

  return (
    <AppDataContext.Provider
      value={{
        customers, addCustomer, setCustomers,
        products, addProduct, setProducts,
        invoices, addInvoice, setInvoices,
        purchases, addPurchase, setPurchases,
        payments, addPayment, setPayments,
        deliveries, addDelivery, setDeliveries,
        drivers, addDriver, setDrivers,
        vehicles, addVehicle, setVehicles,
        users, addUser, setUsers,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}
