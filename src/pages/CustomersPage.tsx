import { useQuery } from '@tanstack/react-query';
import { Edit2, Plus, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditCustomerModal } from '../components/EditCustomerModal';
import { Badge, EmptyState, ErrorBox, Loading, PageHeader, SearchInput } from '../components/ui';
import { apiError } from '../services/api';
import { customersApi } from '../services/endpoints';
import type { Customer } from '../types/api';
import { money } from '../utils/format';

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const q = useQuery({
    queryKey: ['customers', search, page],
    queryFn: () => customersApi.list({ page, limit: 20, search: search || undefined })
  });

  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox message={apiError(q.error)} />;

  return (
    <>
      <PageHeader
        title="গ্রাহক"
        description="গ্রাহকের প্রোফাইল, বকেয়া এবং কার্যক্রম পরিচালনা করুন"
        actions={
          <Link to="/app/customers/new" className="lk-btn-primary">
            <Plus size={17} /> নতুন গ্রাহক
          </Link>
        }
      />

      <div className="lk-card mb-4 flex flex-wrap items-center gap-3 p-4">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="নাম, ফোন বা কাস্টমার কোড..."
        />
      </div>

      {!q.data?.data.length ? (
        <div className="lk-card">
          <EmptyState title="কোনো গ্রাহক নেই" />
        </div>
      ) : (
        <div className="lk-table-wrap">
          <table className="lk-table">
            <thead>
              <tr>
                <th>গ্রাহক</th>
                <th>ফোন</th>
                <th>ঠিকানা</th>
                <th>ক্রয়</th>
                <th>পেমেন্ট</th>
                <th>বর্তমান বকেয়া</th>
                <th>স্ট্যাটাস</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {q.data.data.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                        <UserRound size={19} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-xs text-slate-400">
                          {c.customerCode}
                          {c.businessName ? ` · ${c.businessName}` : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{c.phone}</td>
                  <td>{[c.area, c.district].filter(Boolean).join(', ') || c.address || '—'}</td>
                  <td>{c._count?.purchases ?? 0}</td>
                  <td>{c._count?.payments ?? 0}</td>
                  <td className="font-bold text-red-600">{money(c.currentBalance)}</td>
                  <td>
                    <Badge tone={c.status === 'ACTIVE' ? 'green' : 'slate'}>{c.status}</Badge>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link to={`/app/customers/${c.id}`} className="font-bold text-blue-600">
                        দেখুন
                      </Link>
                      <button
                        onClick={() => setEditingCustomer(c)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-blue-600"
                        title="সম্পাদনা"
                      >
                        <Edit2 size={14} /> এডিট
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>মোট {q.data?.meta?.total ?? 0} জন</span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="lk-btn-secondary disabled:opacity-40"
          >
            পূর্ববর্তী
          </button>
          <button
            disabled={page >= (q.data?.meta?.pages ?? 1)}
            onClick={() => setPage((p) => p + 1)}
            className="lk-btn-secondary disabled:opacity-40"
          >
            পরবর্তী
          </button>
        </div>
      </div>

      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
        />
      )}
    </>
  );
}
