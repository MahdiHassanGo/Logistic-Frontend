import { api, setAccessToken } from './api';
import type { ApiResponse, Customer, DashboardSummary, Delivery, Driver, Invoice, LedgerEntry, Payment, Product, Purchase, User, Vehicle } from '../types/api';
import { idempotencyKey } from '../utils/format';

export const authApi = {
  login: async (input: { identifier: string; password: string }) => {
    const r = await api.post('/auth/login', { ...input, clientType: 'WEB' });
    setAccessToken(r.data.data.accessToken);
    return r.data.data;
  },
  me: async () => (await api.get('/auth/me')).data.data,
  logout: async () => {
    await api.post('/auth/logout', {});
    setAccessToken(null);
  }
};

export const dashboardApi = {
  summary: async () => (await api.get<ApiResponse<DashboardSummary>>('/dashboard/summary')).data.data
};

export const customersApi = {
  list: async (params: any = {}) => (await api.get<ApiResponse<Customer[]>>('/customers', { params })).data,
  get: async (id: string) => (await api.get<ApiResponse<Customer>>(`/customers/${id}`)).data.data,
  create: async (body: any) => (await api.post<ApiResponse<Customer>>('/customers', body)).data.data,
  update: async (id: string, body: any) => (await api.patch<ApiResponse<Customer>>(`/customers/${id}`, body)).data.data,
  ledger: async (id: string, params: any = {}) => (await api.get<ApiResponse<LedgerEntry[]>>(`/customers/${id}/ledger`, { params })).data,
  dueAging: async (params: any = {}) => (await api.get<ApiResponse<any>>('/customers/due-aging', { params })).data.data
};

export const productsApi = {
  list: async (params: any = {}) => (await api.get<ApiResponse<Product[]>>('/products', { params })).data,
  create: async (body: any) => (await api.post('/products', body)).data.data,
  update: async (id: string, body: any) => (await api.patch(`/products/${id}`, body)).data.data
};

export const purchasesApi = {
  list: async (params: any = {}) => (await api.get<ApiResponse<Purchase[]>>('/purchases', { params })).data,
  get: async (id: string) => (await api.get<ApiResponse<Purchase>>(`/purchases/${id}`)).data.data,
  create: async (body: any) => (await api.post('/purchases', body, { headers: { 'Idempotency-Key': idempotencyKey() } })).data.data
};

export const invoicesApi = {
  list: async (params: any = {}) => (await api.get<ApiResponse<Invoice[]>>('/invoices', { params })).data,
  get: async (id: string) => (await api.get<ApiResponse<Invoice>>(`/invoices/${id}`)).data.data,
  pdfUrl: (id: string) => `/api/v1/invoices/${id}/pdf`
};

export const paymentsApi = {
  list: async (params: any = {}) => (await api.get<ApiResponse<Payment[]>>('/payments', { params })).data,
  get: async (id: string) => (await api.get<ApiResponse<Payment>>(`/payments/${id}`)).data.data,
  create: async (body: any) => (await api.post('/payments', body, { headers: { 'Idempotency-Key': idempotencyKey() } })).data.data,
  reverse: async (id: string, reason: string) => (await api.post(`/payments/${id}/reverse`, { reason }, { headers: { 'Idempotency-Key': idempotencyKey() } })).data.data,
  pdfUrl: (id: string) => `/api/v1/payments/${id}/pdf`
};

export const deliveriesApi = {
  list: async (params: any = {}) => (await api.get<ApiResponse<Delivery[]>>('/deliveries', { params })).data,
  get: async (id: string) => (await api.get<ApiResponse<Delivery>>(`/deliveries/${id}`)).data.data,
  create: async (body: any) => (await api.post('/deliveries', body, { headers: { 'Idempotency-Key': idempotencyKey() } })).data.data,
  status: async (id: string, body: any) => (await api.patch(`/deliveries/${id}/status`, body, { headers: { 'Idempotency-Key': idempotencyKey() } })).data.data,
  listDrivers: async (params: any = {}) => (await api.get<ApiResponse<Driver[]>>('/deliveries/drivers', { params })).data,
  createDriver: async (body: any) => (await api.post('/deliveries/drivers', body)).data.data,
  updateDriver: async (id: string, body: any) => (await api.patch(`/deliveries/drivers/${id}`, body)).data.data,
  listVehicles: async (params: any = {}) => (await api.get<ApiResponse<Vehicle[]>>('/deliveries/vehicles', { params })).data,
  createVehicle: async (body: any) => (await api.post('/deliveries/vehicles', body)).data.data,
  updateVehicle: async (id: string, body: any) => (await api.patch(`/deliveries/vehicles/${id}`, body)).data.data
};

export const usersApi = {
  list: async (params: any = {}) => (await api.get<ApiResponse<User[]>>('/users', { params })).data,
  create: async (body: any) => (await api.post('/users', body)).data.data,
  update: async (id: string, body: any) => (await api.patch(`/users/${id}`, body)).data.data,
  status: async (id: string, status: string) => (await api.patch(`/users/${id}/status`, { status })).data.data,
  permissions: async (id: string, body: { allow: string[]; deny: string[] }) => (await api.put(`/users/${id}/permissions`, body)).data.data
};

export const reportsApi = {
  dueAging: async (params: any = {}) => (await api.get<ApiResponse<any>>('/reports/due-aging', { params })).data.data,
  summary: async (params: any = {}) => (await api.get<ApiResponse<any>>('/reports/summary', { params })).data.data,
  sales: async (params: any = {}) => (await api.get<ApiResponse<any>>('/reports/sales', { params })).data.data,
  payments: async (params: any = {}) => (await api.get<ApiResponse<any>>('/reports/payments', { params })).data.data,
  export: async (body: any) => (await api.post('/reports/export', body, { responseType: 'blob' })).data
};

export const smsApi = {
  history: async (params: any = {}) => (await api.get<ApiResponse<any[]>>('/sms-messages', { params })).data,
  resend: async (body: any) => (await api.post('/sms/resend', body)).data.data,
  getSettings: async () => (await api.get('/sms/settings')).data.data,
  updateSettings: async (body: any) => (await api.patch('/sms/settings', body)).data.data
};

export const settingsApi = {
  getCompany: async () => (await api.get('/settings/company')).data.data,
  updateCompany: async (body: any) => (await api.patch('/settings/company', body)).data.data,
  backup: async (body: any = {}) => (await api.post('/settings/backup', body)).data.data,
  backupHistory: async () => (await api.get('/settings/backup/history')).data.data,
  restore: async (body: { backupId: string }) => (await api.post('/settings/restore', body)).data.data
};
