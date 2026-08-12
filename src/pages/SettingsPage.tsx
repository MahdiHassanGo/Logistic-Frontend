import { useMutation, useQuery } from '@tanstack/react-query';
import { Database, Moon, Save, ShieldCheck, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Field, PageHeader } from '../components/ui';
import { settingsApi } from '../services/endpoints';
import { useUIStore } from '../stores/ui';

export function SettingsPage() {
  const ui = useUIStore();
  const [company, setCompany] = useState({ name: 'LogiKhata', phone: '', address: '', code: 'SHOP-001' });

  const companyQuery = useQuery({
    queryKey: ['company-settings'],
    queryFn: settingsApi.getCompany
  });

  useEffect(() => {
    if (companyQuery.data) {
      setCompany({
        name: companyQuery.data.name || 'LogiKhata',
        phone: companyQuery.data.phone || '',
        address: companyQuery.data.address || '',
        code: companyQuery.data.code || 'SHOP-001'
      });
    }
  }, [companyQuery.data]);

  const saveMutation = useMutation({
    mutationFn: () => settingsApi.updateCompany(company),
    onSuccess: () => {
      companyQuery.refetch();
    }
  });

  const backupMutation = useMutation({
    mutationFn: () => settingsApi.backup({ notes: 'Manual UI Backup' })
  });

  return (
    <>
      <PageHeader
        title="সেটিংস"
        description="Company, appearance, SMS এবং backup configuration"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => backupMutation.mutate()}
              disabled={backupMutation.isPending}
              className="lk-btn-secondary"
            >
              <Database size={17} /> ব্যাকআপ নেন
            </button>
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="lk-btn-primary"
            >
              <Save size={17} /> সংরক্ষণ করুন
            </button>
          </div>
        }
      />

      {saveMutation.isSuccess && (
        <div className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-700 font-bold">
          কোম্পানি তথ্য সফলভাবে সেভ হয়েছে।
        </div>
      )}

      {backupMutation.isSuccess && (
        <div className="mb-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-700 font-bold">
          সিস্টেম ব্যাকআপ জেনারেট করা হয়েছে (ID: {backupMutation.data?.backupId})।
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        <aside className="lk-card h-fit p-3">
          <a href="#company" className="block rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
            কোম্পানি
          </a>
          <a href="#appearance" className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-500">
            Appearance
          </a>
        </aside>

        <div className="space-y-5">
          <section id="company" className="lk-card overflow-hidden">
            <div className="border-b p-5">
              <h3 className="font-bold">কোম্পানি তথ্য</h3>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <Field label="কোম্পানি নাম">
                <input
                  className="lk-input"
                  value={company.name}
                  onChange={(e) => setCompany({ ...company, name: e.target.value })}
                />
              </Field>
              <Field label="ফোন">
                <input
                  className="lk-input"
                  value={company.phone}
                  onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                />
              </Field>
              <Field label="কোড">
                <input
                  className="lk-input"
                  value={company.code}
                  onChange={(e) => setCompany({ ...company, code: e.target.value })}
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="ঠিকানা">
                  <textarea
                    className="lk-input min-h-24"
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          </section>

          <section id="appearance" className="lk-card p-5">
            <h3 className="font-bold">Appearance</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button
                onClick={() => ui.setTheme('light')}
                className={`rounded-2xl border p-4 text-left ${ui.theme === 'light' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}
              >
                <Sun className="mb-2 text-amber-500" />
                <b>Light</b>
              </button>
              <button
                onClick={() => ui.setTheme('dark')}
                className={`rounded-2xl border p-4 text-left ${ui.theme === 'dark' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}
              >
                <Moon className="mb-2 text-slate-700" />
                <b>Dark preference</b>
              </button>
              <button
                onClick={() => ui.setTheme('system')}
                className={`rounded-2xl border p-4 text-left ${ui.theme === 'system' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}
              >
                <ShieldCheck className="mb-2 text-blue-600" />
                <b>System</b>
              </button>
            </div>
            <label className="mt-5 flex items-center gap-3">
              <input
                type="checkbox"
                checked={ui.compact}
                onChange={(e) => ui.setCompact(e.target.checked)}
                className="h-5 w-5 accent-blue-600"
              />
              Compact table mode
            </label>
          </section>
        </div>
      </div>
    </>
  );
}
