import { useQuery } from '@tanstack/react-query';
import { Banknote, CircleDollarSign, Download, ShoppingCart, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ErrorBox, Loading, PageHeader, StatCard } from '../components/ui';
import { apiError } from '../services/api';
import { dashboardApi, reportsApi } from '../services/endpoints';
import { dateBn, money } from '../utils/format';

export function ReportsPage() {
  const dash = useQuery({ queryKey: ['dashboard', 'reports'], queryFn: dashboardApi.summary });
  const sales = useQuery({ queryKey: ['reports-sales'], queryFn: () => reportsApi.sales() });
  const payments = useQuery({ queryKey: ['reports-payments'], queryFn: () => reportsApi.payments() });

  if (dash.isLoading || sales.isLoading || payments.isLoading) return <Loading />;
  const err = dash.error || sales.error || payments.error;
  if (err) return <ErrorBox message={apiError(err)} />;

  const salesDays = sales.data?.dailySales || [];
  const paymentDays = payments.data?.dailyPayments || [];

  const map = new Map<string, { date: string; sales: number; collections: number }>();
  salesDays.forEach((s: any) => {
    const k = s.date;
    const r = map.get(k) || { date: k, sales: 0, collections: 0 };
    r.sales += Number(s.sales);
    map.set(k, r);
  });
  paymentDays.forEach((p: any) => {
    const k = p.date;
    const r = map.get(k) || { date: k, sales: 0, collections: 0 };
    r.collections += Number(p.amount);
    map.set(k, r);
  });

  const chart = [...map.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14)
    .map((x) => ({ ...x, label: dateBn(x.date) }));

  const handleExport = async (type: 'SALES' | 'PAYMENTS' | 'DUE_AGING') => {
    try {
      const blob = await reportsApi.export({ type, format: 'CSV' });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_Report.csv`;
      a.click();
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  return (
    <>
      <PageHeader
        title="রিপোর্টস & অ্যানালিটিক্স"
        description="বিক্রয়, কালেকশন ও বকেয়া রিপোর্ট"
        actions={
          <div className="flex gap-2">
            <button onClick={() => handleExport('SALES')} className="lk-btn-secondary">
              <Download size={16} /> Sales Export (CSV)
            </button>
            <button onClick={() => handleExport('DUE_AGING')} className="lk-btn-secondary">
              <Download size={16} /> Due Aging Export (CSV)
            </button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="আজকের বিক্রয়" value={money(dash.data!.todaySales)} icon={<ShoppingCart />} />
        <StatCard label="আজকের কালেকশন" value={money(dash.data!.todayCollections)} icon={<Banknote />} tone="green" />
        <StatCard label="মোট বকেয়া" value={money(dash.data!.totalDue)} icon={<CircleDollarSign />} tone="red" />
        <StatCard label="সক্রিয় গ্রাহক" value={dash.data!.activeCustomers} icon={<Users />} tone="sky" />
      </div>

      <section className="lk-card p-5">
        <h3 className="font-bold text-slate-950">Sales vs Collection (সাপ্তাহিক ও দৈনিক চিত্র)</h3>
        <p className="mb-5 text-xs text-slate-400">Server-side aggregate data</p>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: any) => money(v)} />
              <Bar dataKey="sales" name="Sales" fill="#2563eb" radius={[5, 5, 0, 0]} />
              <Bar dataKey="collections" name="Collection" fill="#22c55e" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}
