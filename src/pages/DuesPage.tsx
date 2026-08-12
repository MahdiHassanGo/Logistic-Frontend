import { useQuery } from '@tanstack/react-query';
import { CircleDollarSign, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorBox, Loading, PageHeader, StatCard } from '../components/ui';
import { apiError } from '../services/api';
import { reportsApi } from '../services/endpoints';
import { money } from '../utils/format';

export function DuesPage() {
  const q = useQuery({
    queryKey: ['due-aging'],
    queryFn: () => reportsApi.dueAging()
  });

  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox message={apiError(q.error)} />;

  const summary = q.data?.summary || { totalDue: 0, bucket0_30: 0, bucket31_60: 0, bucket61_90: 0, bucket90Plus: 0 };
  const customers = q.data?.customers || [];

  return (
    <>
      <PageHeader title="বকেয়া ও Aging কাস্টমার তালিকা" description="Customer currentBalance ও Aging Buckets" />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="মোট বকেয়া" value={money(summary.totalDue)} icon={<CircleDollarSign />} tone="red" />
        <StatCard label="0-30 দিন" value={money(summary.bucket0_30)} tone="amber" />
        <StatCard label="31-60 দিন" value={money(summary.bucket31_60)} tone="amber" />
        <StatCard label="61-90 দিন" value={money(summary.bucket61_90)} tone="red" />
        <StatCard label="90+ দিন" value={money(summary.bucket90Plus)} tone="red" />
      </div>

      {!customers.length ? (
        <div className="lk-card">
          <EmptyState title="কোনো বকেয়া নেই" description="সকল কাস্টমারের বকেয়া পরিশোধিত রয়েছে।" />
        </div>
      ) : (
        <div className="lk-table-wrap">
          <table className="lk-table">
            <thead>
              <tr>
                <th>কাস্টমার কোড</th>
                <th>গ্রাহক</th>
                <th>ফোন</th>
                <th>মোট বকেয়া</th>
                <th>0-30 দিন</th>
                <th>31-60 দিন</th>
                <th>61-90 দিন</th>
                <th>90+ দিন</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c: any) => (
                <tr key={c.customerId}>
                  <td className="font-mono text-xs">{c.customerCode}</td>
                  <td className="font-bold text-slate-900">
                    <Link to={`/app/customers/${c.customerId}`}>{c.name}</Link>
                  </td>
                  <td>{c.phone}</td>
                  <td className="font-bold text-red-600">{money(c.totalDue)}</td>
                  <td>{money(c.bucket0_30)}</td>
                  <td>{money(c.bucket31_60)}</td>
                  <td>{money(c.bucket61_90)}</td>
                  <td className="font-bold text-red-700">{money(c.bucket90Plus)}</td>
                  <td>
                    <Link
                      to={`/app/payments/new?customerId=${c.customerId}`}
                      className="inline-flex items-center gap-1 font-bold text-blue-600"
                    >
                      <WalletCards size={16} /> পেমেন্ট
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
