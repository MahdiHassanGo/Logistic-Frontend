import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserCheck } from 'lucide-react';
import { useState } from 'react';
import { ErrorBox, Field } from './ui';
import { apiError } from '../services/api';
import { customersApi } from '../services/endpoints';
import type { Customer } from '../types/api';
import { normalizeMoney } from '../utils/format';

interface EditCustomerModalProps {
  customer: Customer;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditCustomerModal({ customer, onClose, onSuccess }: EditCustomerModalProps) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: customer.name || '',
    phone: customer.phone || '',
    alternatePhone: customer.alternatePhone || '',
    businessName: customer.businessName || '',
    address: customer.address || '',
    area: customer.area || '',
    district: customer.district || '',
    creditLimit: customer.creditLimit || '0',
    notes: customer.notes || '',
    status: customer.status || 'ACTIVE'
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      customersApi.update(customer.id, {
        name: form.name,
        phone: form.phone,
        alternatePhone: form.alternatePhone || undefined,
        businessName: form.businessName || undefined,
        address: form.address || undefined,
        area: form.area || undefined,
        district: form.district || undefined,
        notes: form.notes || undefined,
        creditLimit: normalizeMoney(form.creditLimit),
        status: form.status
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      qc.invalidateQueries({ queryKey: ['customer', customer.id] });
      if (onSuccess) onSuccess();
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-200 p-5">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <UserCheck />
          </div>
          <div>
            <h3 className="font-bold text-slate-950">গ্রাহক তথ্য সম্পাদনা ({customer.customerCode})</h3>
            <p className="text-xs text-slate-500">গ্রাহকের প্রোফাইল ও ক্রেডিট লিমিট আপডেট করুন</p>
          </div>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <Field label="নাম" required>
            <input
              className="lk-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="গ্রাহকের পূর্ণ নাম"
            />
          </Field>
          <Field label="ফোন" required>
            <input
              className="lk-input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="01XXXXXXXXX"
            />
          </Field>
          <Field label="বিকল্প ফোন">
            <input
              className="lk-input"
              value={form.alternatePhone}
              onChange={(e) => setForm({ ...form, alternatePhone: e.target.value })}
            />
          </Field>
          <Field label="ব্যবসার নাম">
            <input
              className="lk-input"
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            />
          </Field>
          <Field label="এলাকা">
            <input
              className="lk-input"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
            />
          </Field>
          <Field label="জেলা">
            <input
              className="lk-input"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="ঠিকানা">
              <textarea
                className="lk-input min-h-20"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </Field>
          </div>
          <Field label="ক্রেডিট লিমিট">
            <input
              type="number"
              step="0.01"
              min="0"
              className="lk-input"
              value={form.creditLimit}
              onChange={(e) => setForm({ ...form, creditLimit: e.target.value })}
            />
          </Field>
          <Field label="স্ট্যাটাস">
            <select
              className="lk-input"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field label="নোট">
              <textarea
                className="lk-input min-h-20"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </Field>
          </div>

          {updateMutation.error && (
            <div className="md:col-span-2">
              <ErrorBox message={apiError(updateMutation.error)} />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 p-4">
          <button type="button" onClick={onClose} className="lk-btn-secondary">
            বাতিল
          </button>
          <button
            type="button"
            disabled={form.name.length < 2 || form.phone.length < 7 || updateMutation.isPending}
            onClick={() => updateMutation.mutate()}
            className="lk-btn-primary"
          >
            {updateMutation.isPending ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
          </button>
        </div>
      </div>
    </div>
  );
}
