import { MessageSquareText, RefreshCw, Send } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { smsApi } from '../services/endpoints';
import { Badge, EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui';
import { apiError } from '../services/api';
import { dateBn } from '../utils/format';

export function SmsHistoryPage() {
  const queryClient = useQueryClient();
  const historyQuery = useQuery({
    queryKey: ['sms-history'],
    queryFn: () => smsApi.history({ page: 1, limit: 50 })
  });

  const resendMutation = useMutation({
    mutationFn: (smsId: string) => smsApi.resend({ smsId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sms-history'] });
    }
  });

  if (historyQuery.isLoading) return <Loading />;
  if (historyQuery.error) return <ErrorBox message={apiError(historyQuery.error)} />;

  const items = historyQuery.data?.data || [];

  return (
    <>
      <PageHeader
        title="SMS ইতিহাস"
        description="Customer notification ও resend history"
        actions={
          <button
            onClick={() => historyQuery.refetch()}
            className="lk-btn-secondary"
            title="রিফ্রেশ"
          >
            <RefreshCw size={17} /> রিফ্রেশ
          </button>
        }
      />

      <div className="lk-card mt-5">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <MessageSquareText />
            </div>
            <div>
              <h3 className="font-bold">SMS লগ</h3>
              <p className="text-xs text-slate-400">সর্বশেষ প্রেরিত মেসেজের তথ্য</p>
            </div>
          </div>
        </div>

        {!items.length ? (
          <EmptyState title="কোনো SMS রেকর্ড পাওয়া যায়নি" description="এখনও কোনো SMS নোটিফিকেশন পাঠানো হয়নি।" />
        ) : (
          <div className="lk-table-wrap">
            <table className="lk-table">
              <thead>
                <tr>
                  <th>প্রাপক (ফোন)</th>
                  <th>মেসেজ</th>
                  <th>স্ট্যাটাস</th>
                  <th>প্রেরণের সময়</th>
                  <th>অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id}>
                    <td className="font-bold text-slate-900">{item.recipient}</td>
                    <td className="max-w-xs truncate text-xs text-slate-600">{item.message}</td>
                    <td>
                      <Badge tone={item.status === 'SENT' ? 'green' : item.status === 'FAILED' ? 'red' : 'amber'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="text-xs text-slate-500">{dateBn(item.sentAt)}</td>
                    <td>
                      <button
                        onClick={() => resendMutation.mutate(item.id)}
                        disabled={resendMutation.isPending}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                      >
                        <Send size={14} /> পুনরায় পাঠান
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
