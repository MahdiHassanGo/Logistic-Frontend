import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, MessageSquareText, Printer, Send, WalletCards } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Badge, ErrorBox, Field, Loading } from '../components/ui';
import { apiError } from '../services/api';
import { invoicesApi, purchasesApi, smsApi } from '../services/endpoints';
import { dateBn, money } from '../utils/format';

export function InvoiceDetailsPage() {
  const { id = '' } = useParams();
  const [sp] = useSearchParams();
  const purchaseId = sp.get('purchaseId');
  const qc = useQueryClient();

  const [openSms, setOpenSms] = useState(false);
  const [smsText, setSmsText] = useState('');

  const invoiceQuery = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoicesApi.get(id),
    enabled: !!id
  });

  const purchaseQuery = useQuery({
    queryKey: ['invoice-purchase', purchaseId],
    queryFn: () => purchasesApi.get(purchaseId!),
    enabled: !invoiceQuery.data && !!purchaseId
  });

  const sendSmsMutation = useMutation({
    mutationFn: (body: { recipientPhone: string; message: string }) => smsApi.resend(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sms-history'] });
      setOpenSms(false);
    }
  });

  if (invoiceQuery.isLoading || (purchaseQuery.isLoading && !!purchaseId)) return <Loading />;

  const invoiceData = invoiceQuery.data;
  const purchaseData = purchaseQuery.data || invoiceData?.purchase;
  const customer = invoiceData?.customer || purchaseData?.customer;

  const i = invoiceData || purchaseData?.invoice;

  if (!i || !customer) {
    return <ErrorBox message="ইনভয়েসটি পাওয়া যায়নি।" />;
  }

  const pdfUrl = invoicesApi.pdfUrl(i.id);

  const handleOpenSms = () => {
    const defaultMsg = `LogiKhata ইনভয়েস: ${i.invoiceNumber}
গ্রাহক: ${customer.name}
তারিখ: ${dateBn(i.invoiceDate)}
মোট: ${money(i.grandTotal)}
পরিশোধিত: ${money(i.paidAmount)}
বর্তমান বকেয়া: ${money(i.currentDue)}
ধন্যবাদ, LogiKhata!`;
    setSmsText(defaultMsg);
    setOpenSms(true);
  };

  return (
    <>
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="lk-page-title">ইনভয়েস {i.invoiceNumber}</h1>
          <p className="text-sm text-slate-500">{dateBn(i.invoiceDate)} · {customer.name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => window.print()} className="lk-btn-secondary">
            <Printer size={17} /> প্রিন্ট
          </button>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lk-btn-secondary inline-flex items-center gap-1"
          >
            <Download size={17} /> PDF দেখুন / ডাউনলোড
          </a>
          <button onClick={handleOpenSms} className="lk-btn-secondary">
            <MessageSquareText size={17} /> SMS পাঠান
          </button>
          {Number(i.currentDue) > 0 && (
            <Link to={`/app/payments/new?customerId=${customer.id}`} className="lk-btn-primary">
              <WalletCards size={17} /> পেমেন্ট
            </Link>
          )}
        </div>
      </div>

      <article className="mx-auto max-w-[980px] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-xl print:border-0 print:shadow-none">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-100" />
        <div className="p-6 sm:p-10">
          <div className="grid gap-8 border-b border-slate-200 pb-7 md:grid-cols-2">
            <div>
              <div className="text-2xl font-bold text-slate-950">LogiKhata</div>
              <div className="mt-1 text-sm font-bold text-blue-600">Smart Logistics & Accounts</div>
            </div>
            <div className="md:text-right">
              <div className="text-4xl font-bold tracking-[.12em] text-blue-600">INVOICE</div>
              <div className="mt-4 text-sm">
                <span className="text-slate-400">নং:</span> <b>{i.invoiceNumber}</b>
              </div>
              <div className="mt-1 text-sm">
                <span className="text-slate-400">তারিখ:</span> <b>{dateBn(i.invoiceDate)}</b>
              </div>
              <div className="mt-3">
                <Badge tone={i.status === 'PAID' ? 'green' : i.status === 'UNPAID' ? 'red' : 'amber'}>
                  {i.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="my-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-blue-600">Bill To</div>
              <h3 className="mt-3 font-bold text-slate-950">{customer.name}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {customer.phone}
                <br />
                {[customer.address, customer.area, customer.district].filter(Boolean).join(', ')}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-blue-600">Reference</div>
              <h3 className="mt-3 font-bold text-slate-950">{purchaseData?.purchaseNumber ?? i.invoiceNumber}</h3>
              <p className="mt-1 text-sm text-slate-500">
                Invoice date: {dateBn(i.invoiceDate)}
              </p>
            </div>
          </div>

          {purchaseData?.items && purchaseData.items.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="lk-table">
                <thead>
                  <tr>
                    <th>পণ্য</th>
                    <th>পরিমাণ</th>
                    <th>ইউনিট</th>
                    <th>দর</th>
                    <th>ছাড়</th>
                    <th>মোট</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseData.items.map((x: any) => (
                    <tr key={x.id}>
                      <td className="font-bold">{x.nameSnapshot || x.name}</td>
                      <td>{x.quantity}</td>
                      <td>{x.unitSnapshot || x.unit}</td>
                      <td>{money(x.unitPrice)}</td>
                      <td>{money(x.discount)}</td>
                      <td>{money(x.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 ml-auto max-w-sm space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <b>{money(i.subtotal)}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Discount</span>
              <b>- {money(i.discount)}</b>
            </div>
            <div className="flex justify-between rounded-xl bg-blue-50 p-3">
              <span className="font-bold text-blue-700">Grand total</span>
              <b className="text-blue-700">{money(i.grandTotal)}</b>
            </div>
            <div className="flex justify-between">
              <span>Paid</span>
              <b className="text-green-700">{money(i.paidAmount)}</b>
            </div>
            <div className="flex justify-between rounded-xl bg-red-50 p-3">
              <span className="font-bold text-red-700">Current due</span>
              <b className="text-red-700">{money(i.currentDue)}</b>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
            LogiKhata ব্যবহার করার জন্য ধন্যবাদ।
          </div>
        </div>
      </article>

      {/* Send SMS Modal */}
      {openSms && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-200 p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <MessageSquareText />
              </div>
              <div>
                <h3 className="font-bold text-slate-950">গ্রাহককে SMS পাঠান</h3>
                <p className="text-xs text-slate-500">ইনভয়েস সামারি টেক্সট নোটিফিকেশন</p>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <Field label="প্রাপক ফোন নাম্বার">
                <input className="lk-input font-bold" value={customer.phone} disabled />
              </Field>

              <Field label="SMS মেসেজ টেক্সট">
                <textarea
                  className="lk-input min-h-36 font-mono text-sm leading-6"
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                />
              </Field>

              {sendSmsMutation.error && (
                <ErrorBox message={apiError(sendSmsMutation.error)} />
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 p-4">
              <button type="button" onClick={() => setOpenSms(false)} className="lk-btn-secondary">
                বাতিল
              </button>
              <button
                type="button"
                disabled={!smsText.trim() || sendSmsMutation.isPending}
                onClick={() =>
                  sendSmsMutation.mutate({
                    recipientPhone: customer.phone,
                    message: smsText
                  })
                }
                className="lk-btn-primary inline-flex items-center gap-1.5"
              >
                <Send size={16} /> {sendSmsMutation.isPending ? 'পাঠানো হচ্ছে...' : 'SMS পাঠান'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
