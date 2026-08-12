import { useQuery } from '@tanstack/react-query';
import { Banknote, Building2, CircleDollarSign, Edit2, MapPin, Phone, ShoppingCart, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EditCustomerModal } from '../components/EditCustomerModal';
import { Badge, EmptyState, ErrorBox, Loading, PageHeader, StatCard } from '../components/ui';
import { apiError } from '../services/api';
import { customersApi } from '../services/endpoints';
import { dateBn, money } from '../utils/format';

export function CustomerProfilePage() {
  const { id = '' } = useParams();
  const [editing, setEditing] = useState(false);

  const q = useQuery({ queryKey: ['customer', id], queryFn: () => customersApi.get(id), enabled: !!id });
  const ledger = useQuery({ queryKey: ['ledger', id], queryFn: () => customersApi.ledger(id, { page: 1, limit: 20 }), enabled: !!id });

  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox message={apiError(q.error)} />;

  const c = q.data!;
  const totalPurchase = (c.purchases || []).reduce((s, p) => s + Number(p.netAmount), 0);
  const totalPayment = (c.payments || []).reduce((s, p) => s + Number(p.amount), 0);

  return (
    <>
      <PageHeader
        title="গ্রাহক প্রোফাইল"
        description={`${c.customerCode} · সর্বশেষ তথ্য`}
        actions={
          <div className="flex gap-2">
            <button onClick={() => setEditing(true)} className="lk-btn-secondary">
              <Edit2 size={17} /> সম্পাদনা
            </button>
            <Link to={`/app/purchases/new?customerId=${c.id}`} className="lk-btn-primary">
              <ShoppingCart size={17} /> নতুন ক্রয়
            </Link>
            <Link to={`/app/payments/new?customerId=${c.id}`} className="lk-btn-secondary">
              <Banknote size={17} /> পেমেন্ট
            </Link>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <aside className="lk-card overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-700" />
          <div className="p-5 pt-0">
            <div className="-mt-12 mb-4 grid h-24 w-24 place-items-center rounded-3xl border-[6px] border-white bg-blue-50 text-blue-600 shadow-lg">
              <UserRound size={44} />
            </div>
            <Badge tone={c.status === 'ACTIVE' ? 'green' : 'slate'}>{c.status}</Badge>
            <h2 className="mt-3 text-xl font-bold text-slate-950">{c.name}</h2>
            <p className="text-sm text-slate-500">{c.businessName || 'ব্যক্তিগত গ্রাহক'}</p>

            <div className="mt-5 space-y-4 border-t border-slate-200 pt-5 text-sm">
              <div className="flex gap-3">
                <Phone className="text-blue-600" size={18} />
                <div>
                  <div className="text-xs text-slate-400">ফোন</div>
                  {c.phone}
                </div>
              </div>
              <div className="flex gap-3">
                <Building2 className="text-blue-600" size={18} />
                <div>
                  <div className="text-xs text-slate-400">ব্যবসা</div>
                  {c.businessName || '—'}
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="text-blue-600" size={18} />
                <div>
                  <div className="text-xs text-slate-400">ঠিকানা</div>
                  {[c.address, c.area, c.district].filter(Boolean).join(', ') || '—'}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="সাম্প্রতিক ক্রয় (১০টি পর্যন্ত)" value={money(totalPurchase)} icon={<ShoppingCart />} />
            <StatCard label="সাম্প্রতিক পেমেন্ট (১০টি পর্যন্ত)" value={money(totalPayment)} icon={<Banknote />} tone="green" />
            <StatCard label="বর্তমান বকেয়া" value={money(c.currentBalance)} icon={<CircleDollarSign />} tone="red" />
          </div>

          <section className="lk-card overflow-hidden">
            <div className="border-b border-slate-200 p-5">
              <h3 className="font-bold text-slate-950">লেজার</h3>
              <p className="text-xs text-slate-400">Backend ledger entries</p>
            </div>
            {ledger.isLoading ? (
              <Loading />
            ) : ledger.error ? (
              <div className="p-4">
                <ErrorBox message={apiError(ledger.error)} />
              </div>
            ) : !ledger.data?.data.length ? (
              <EmptyState />
            ) : (
              <div className="overflow-x-auto">
                <table className="lk-table">
                  <thead>
                    <tr>
                      <th>তারিখ</th>
                      <th>ধরন</th>
                      <th>বিবরণ</th>
                      <th>ডেবিট</th>
                      <th>ক্রেডিট</th>
                      <th>ব্যালেন্স</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.data.data.map((x) => (
                      <tr key={x.id}>
                        <td>{dateBn(x.entryDate || x.createdAt)}</td>
                        <td>{x.type}</td>
                        <td>{x.description || '—'}</td>
                        <td>{money(x.debit)}</td>
                        <td className="text-green-700">{money(x.credit)}</td>
                        <td className="font-bold">{money(x.balanceAfter)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>

      {editing && <EditCustomerModal customer={c} onClose={() => setEditing(false)} />}
    </>
  );
}
