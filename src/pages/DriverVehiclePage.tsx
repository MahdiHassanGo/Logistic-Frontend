import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Badge, EmptyState, ErrorBox, Field, Loading, PageHeader } from '../components/ui';
import { apiError } from '../services/api';
import { deliveriesApi } from '../services/endpoints';
import { normalizeMoney } from '../utils/format';

export function DriverVehiclePage({ kind }: { kind: 'driver' | 'vehicle' }) {
  const queryClient = useQueryClient();
  const isDriver = kind === 'driver';

  const [form, setForm] = useState<any>(
    isDriver
      ? { driverCode: '', name: '', phone: '', licenseNo: '', notes: '' }
      : { registrationNumber: '', type: 'Truck', capacity: '', notes: '' }
  );

  const queryKey = isDriver ? ['drivers-list'] : ['vehicles-list'];

  const q = useQuery({
    queryKey,
    queryFn: () => (isDriver ? deliveriesApi.listDrivers() : deliveriesApi.listVehicles())
  });

  const m = useMutation({
    mutationFn: () =>
      isDriver
        ? deliveriesApi.createDriver({
            ...form,
            driverCode: form.driverCode.toUpperCase(),
            licenseNo: form.licenseNo || undefined,
            notes: form.notes || undefined
          })
        : deliveriesApi.createVehicle({
            ...form,
            registrationNumber: form.registrationNumber.toUpperCase(),
            capacity: form.capacity ? normalizeMoney(form.capacity) : undefined,
            notes: form.notes || undefined
          }),
    onSuccess: () => {
      setForm(
        isDriver
          ? { driverCode: '', name: '', phone: '', licenseNo: '', notes: '' }
          : { registrationNumber: '', type: 'Truck', capacity: '', notes: '' }
      );
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const items = q.data?.data || [];

  return (
    <>
      <PageHeader
        title={isDriver ? 'ড্রাইভার ব্যবস্থাপনা' : 'যানবাহন ব্যবস্থাপনা'}
        description={isDriver ? 'ড্রাইভার তালিকা ও এন্ট্রি' : 'যানবাহন তালিকা ও এন্ট্রি'}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="lk-card h-fit overflow-hidden">
          <div className="border-b border-slate-200 p-5">
            <h3 className="font-bold">নতুন {isDriver ? 'ড্রাইভার' : 'যানবাহন'} তৈরি</h3>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-2">
            {isDriver ? (
              <>
                <Field label="ড্রাইভার কোড" required>
                  <input
                    className="lk-input"
                    value={form.driverCode}
                    onChange={(e) => setForm({ ...form, driverCode: e.target.value })}
                  />
                </Field>
                <Field label="নাম" required>
                  <input
                    className="lk-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </Field>
                <Field label="ফোন" required>
                  <input
                    className="lk-input"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </Field>
                <Field label="লাইসেন্স নং">
                  <input
                    className="lk-input"
                    value={form.licenseNo}
                    onChange={(e) => setForm({ ...form, licenseNo: e.target.value })}
                  />
                </Field>
              </>
            ) : (
              <>
                <Field label="রেজিস্ট্রেশন" required>
                  <input
                    className="lk-input"
                    value={form.registrationNumber}
                    onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                  />
                </Field>
                <Field label="টাইপ" required>
                  <input
                    className="lk-input"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  />
                </Field>
                <Field label="ক্যাপাসিটি">
                  <input
                    type="number"
                    className="lk-input"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  />
                </Field>
              </>
            )}
            <div className="md:col-span-2">
              <Field label="নোট">
                <textarea
                  className="lk-input min-h-24"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </Field>
            </div>
            {m.error && (
              <div className="md:col-span-2">
                <ErrorBox message={apiError(m.error)} />
              </div>
            )}
            {m.isSuccess && (
              <div className="md:col-span-2 rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">
                সফলভাবে তৈরি হয়েছে।
              </div>
            )}
          </div>
          <div className="flex justify-end border-t border-slate-200 p-5">
            <button onClick={() => m.mutate()} disabled={m.isPending} className="lk-btn-primary">
              <Plus size={17} /> তৈরি করুন
            </button>
          </div>
        </section>

        <section className="lk-card overflow-hidden">
          <div className="border-b border-slate-200 p-5">
            <h3 className="font-bold">{isDriver ? 'ড্রাইভার তালিকা' : 'যানবাহন তালিকা'}</h3>
          </div>

          {q.isLoading ? (
            <Loading />
          ) : q.error ? (
            <div className="p-5">
              <ErrorBox message={apiError(q.error)} />
            </div>
          ) : !items.length ? (
            <EmptyState title={`কোনো ${isDriver ? 'ড্রাইভার' : 'যানবাহন'} পাওয়া যায়নি`} />
          ) : (
            <div className="lk-table-wrap">
              <table className="lk-table">
                <thead>
                  <tr>
                    <th>{isDriver ? 'কোড / নাম' : 'রেজিস্ট্রেশন'}</th>
                    <th>{isDriver ? 'ফোন' : 'টাইপ'}</th>
                    <th>স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="font-bold text-slate-900">
                        {isDriver ? `${item.name} (${item.driverCode})` : item.registrationNumber}
                      </td>
                      <td>{isDriver ? item.phone : item.type}</td>
                      <td>
                        <Badge tone={item.status === 'ACTIVE' || item.status === 'AVAILABLE' ? 'green' : 'amber'}>
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
