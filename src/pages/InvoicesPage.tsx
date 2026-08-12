import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Badge, EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui';
import { apiError } from '../services/api';
import { invoicesApi } from '../services/endpoints';
import { dateBn, money } from '../utils/format';

export function InvoicesPage() {
  const q = useQuery({
    queryKey: ['invoices-list'],
    queryFn: () => invoicesApi.list({ page: 1, limit: 100 })
  });

  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox message={apiError(q.error)} />;

  const rows = q.data?.data || [];

  return (
    <>
      <PageHeader title="ইনভয়েস" description="আপনার সমস্ত ইনভয়েসের তালিকা" />

      {!rows.length ? (
        <div className="lk-card">
          <EmptyState title="কোনো ইনভয়েস পাওয়া যায়নি" description="এখনও কোনো ইনভয়েস তৈরি করা হয়নি।" />
        </div>
      ) : (
        <div className="lk-table-wrap">
          <table className="lk-table">
            <thead>
              <tr>
                <th>ইনভয়েস নং</th>
                <th>তারিখ</th>
                <th>গ্রাহক</th>
                <th>মোট</th>
                <th>পেইড</th>
                <th>বকেয়া</th>
                <th>স্ট্যাটাস</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((i: any) => (
                <tr key={i.id}>
                  <td className="font-mono text-xs font-bold text-blue-700">{i.invoiceNumber}</td>
                  <td>{dateBn(i.invoiceDate)}</td>
                  <td>{i.customer?.name || '—'}</td>
                  <td className="font-bold">{money(i.grandTotal)}</td>
                  <td className="text-green-700">{money(i.paidAmount)}</td>
                  <td className="font-bold text-red-600">{money(i.currentDue)}</td>
                  <td>
                    <Badge tone={i.status === 'PAID' ? 'green' : i.status === 'UNPAID' ? 'red' : 'amber'}>
                      {i.status}
                    </Badge>
                  </td>
                  <td>
                    <Link to={`/app/invoices/${i.id}`} className="font-bold text-blue-600">
                      দেখুন
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
