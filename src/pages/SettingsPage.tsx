import { useMutation, useQuery } from '@tanstack/react-query';
import { Database, MessageSquareText, Moon, Save, ShieldCheck, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Field, PageHeader } from '../components/ui';
import { settingsApi, smsApi } from '../services/endpoints';
import { useUIStore } from '../stores/ui';

export function SettingsPage() {
  const ui = useUIStore();
  const [company, setCompany] = useState({ name: 'LogiKhata', phone: '', address: '', code: 'SHOP-001' });

  const [smsSettings, setSmsSettings] = useState({
    provider: 'MOCK',
    apiKey: '',
    senderId: 'LOGIKHATA',
    autoSmsOnPurchase: true,
    autoSmsOnPayment: true
  });

  const companyQuery = useQuery({
    queryKey: ['company-settings'],
    queryFn: settingsApi.getCompany
  });

  const smsSettingsQuery = useQuery({
    queryKey: ['sms-settings'],
    queryFn: smsApi.getSettings
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

  useEffect(() => {
    if (smsSettingsQuery.data) {
      setSmsSettings({
        provider: smsSettingsQuery.data.provider || 'MOCK',
        apiKey: smsSettingsQuery.data.apiKey || '',
        senderId: smsSettingsQuery.data.senderId || 'LOGIKHATA',
        autoSmsOnPurchase: smsSettingsQuery.data.autoSmsOnPurchase ?? true,
        autoSmsOnPayment: smsSettingsQuery.data.autoSmsOnPayment ?? true
      });
    }
  }, [smsSettingsQuery.data]);

  const saveCompanyMutation = useMutation({
    mutationFn: () => settingsApi.updateCompany(company),
    onSuccess: () => companyQuery.refetch()
  });

  const saveSmsMutation = useMutation({
    mutationFn: () => smsApi.updateSettings(smsSettings),
    onSuccess: () => smsSettingsQuery.refetch()
  });

  const backupMutation = useMutation({
    mutationFn: () => settingsApi.backup({ notes: 'Manual UI Backup' })
  });

  const handleSaveAll = () => {
    saveCompanyMutation.mutate();
    saveSmsMutation.mutate();
  };

  return (
    <>
      <PageHeader
        title="সেটিংস"
        description="Company, appearance, SMS Gateway এবং system configuration"
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
              onClick={handleSaveAll}
              disabled={saveCompanyMutation.isPending || saveSmsMutation.isPending}
              className="lk-btn-primary"
            >
              <Save size={17} /> সংরক্ষণ করুন
            </button>
          </div>
        }
      />

      {(saveCompanyMutation.isSuccess || saveSmsMutation.isSuccess) && (
        <div className="mb-4 rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">
          সেটিংস সফলভাবে সংরক্ষিত হয়েছে।
        </div>
      )}

      {backupMutation.isSuccess && (
        <div className="mb-4 rounded-xl bg-blue-50 p-3 text-sm font-bold text-blue-700">
          সিস্টেম ব্যাকআপ জেনারেট করা হয়েছে (ID: {backupMutation.data?.backupId})।
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        <aside className="lk-card h-fit p-3">
          <a href="#company" className="block rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
            কোম্পানি
          </a>
          <a href="#sms" className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
            SMS Gateway
          </a>
          <a href="#appearance" className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
            Appearance
          </a>
        </aside>

        <div className="space-y-5">
          <section id="company" className="lk-card overflow-hidden">
            <div className="border-b p-5">
              <h3 className="font-bold text-slate-950">কোম্পানি তথ্য</h3>
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

          {/* SMS Gateway Configuration */}
          <section id="sms" className="lk-card overflow-hidden">
            <div className="flex items-center gap-3 border-b p-5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <MessageSquareText size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-950">SMS Gateway Configuration</h3>
                <p className="text-xs text-slate-500">গ্রাহককে রিয়েল মোবাইল SMS পাঠানোর জন্য গেটওয়ে কানেক্ট করুন</p>
              </div>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <Field label="SMS Provider Gateway">
                <select
                  className="lk-input font-bold"
                  value={smsSettings.provider}
                  onChange={(e) => setSmsSettings({ ...smsSettings, provider: e.target.value })}
                >
                  <option value="MOCK">MOCK (Simulation / Local Test)</option>
                  <option value="GREENWEB">Greenweb BD (api.greenweb.com.bd)</option>
                  <option value="BULKSMSBD">BulkSMS BD (bulksmsbd.net)</option>
                  <option value="SSLWIRELESS">SSL Wireless (sslwireless.com)</option>
                </select>
              </Field>

              <Field label="Sender ID / Masking Name">
                <input
                  className="lk-input"
                  placeholder="LOGIKHATA"
                  value={smsSettings.senderId}
                  onChange={(e) => setSmsSettings({ ...smsSettings, senderId: e.target.value })}
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="API Key / Token" help="গেটওয়ে প্রোভাইডারের প্রদেয় গোপন API Key বা Token লিখুন">
                  <input
                    type="password"
                    className="lk-input"
                    placeholder="আপনার API Key লিখুন..."
                    value={smsSettings.apiKey}
                    onChange={(e) => setSmsSettings({ ...smsSettings, apiKey: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          </section>

          <section id="appearance" className="lk-card p-5">
            <h3 className="font-bold text-slate-950">Appearance</h3>
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
