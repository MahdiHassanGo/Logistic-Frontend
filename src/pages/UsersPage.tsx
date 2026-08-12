import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit2, Plus, UserCog } from 'lucide-react';
import { useState } from 'react';
import { Badge, EmptyState, ErrorBox, Field, Loading, PageHeader } from '../components/ui';
import { apiError } from '../services/api';
import { usersApi } from '../services/endpoints';
import type { User, UserRole } from '../types/api';
import { dateTimeBn } from '../utils/format';

export function UsersPage() {
  const qc = useQueryClient();
  const [openCreate, setOpenCreate] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const [form, setForm] = useState<{ name: string; username: string; email: string; phone: string; password: string; role: UserRole }>({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'OPERATOR'
  });

  const [editForm, setEditForm] = useState<{ id: string; name: string; email: string; phone: string; password: string; role: UserRole }>({
    id: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'OPERATOR'
  });

  const q = useQuery({ queryKey: ['users'], queryFn: () => usersApi.list({ page: 1, limit: 100 }) });

  const create = useMutation({
    mutationFn: () => usersApi.create({ ...form, email: form.email || undefined, phone: form.phone || undefined }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setOpenCreate(false);
      setForm({ name: '', username: '', email: '', phone: '', password: '', role: 'OPERATOR' });
    }
  });

  const update = useMutation({
    mutationFn: () =>
      usersApi.update(editForm.id, {
        name: editForm.name,
        email: editForm.email || null,
        phone: editForm.phone || null,
        role: editForm.role,
        ...(editForm.password ? { password: editForm.password } : {})
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setEditUser(null);
    }
  });

  const status = useMutation({
    mutationFn: ({ id, s }: { id: string; s: string }) => usersApi.status(id, s),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] })
  });

  const handleStartEdit = (u: User) => {
    setEditUser(u);
    setEditForm({
      id: u.id,
      name: u.name,
      email: u.email || '',
      phone: u.phone || '',
      password: '',
      role: u.role
    });
  };

  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox message={apiError(q.error)} />;

  return (
    <>
      <PageHeader
        title="ব্যবহারকারী"
        description="Role, status এবং backend RBAC management"
        actions={
          <button onClick={() => setOpenCreate(true)} className="lk-btn-primary">
            <Plus size={17} /> নতুন ব্যবহারকারী
          </button>
        }
      />

      {!q.data?.data.length ? (
        <div className="lk-card">
          <EmptyState />
        </div>
      ) : (
        <div className="lk-table-wrap">
          <table className="lk-table">
            <thead>
              <tr>
                <th>নাম</th>
                <th>ইউজারনেম</th>
                <th>রোল</th>
                <th>স্ট্যাটাস</th>
                <th>শেষ লগইন</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {q.data.data.map((u) => (
                <tr key={u.id}>
                  <td>
                    <b>{u.name}</b>
                    <div className="text-xs text-slate-400">{u.email || u.phone || '—'}</div>
                  </td>
                  <td>{u.username}</td>
                  <td>
                    <Badge tone="blue">{u.role}</Badge>
                  </td>
                  <td>
                    <Badge tone={u.status === 'ACTIVE' ? 'green' : u.status === 'LOCKED' ? 'red' : 'slate'}>
                      {u.status}
                    </Badge>
                  </td>
                  <td>{dateTimeBn(u.lastLoginAt)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <select
                        disabled={status.isPending}
                        className="lk-input min-h-9 w-auto py-1 text-xs"
                        value={u.status}
                        onChange={(e) => status.mutate({ id: u.id, s: e.target.value })}
                      >
                        <option>ACTIVE</option>
                        <option>INACTIVE</option>
                        <option>LOCKED</option>
                      </select>
                      <button
                        onClick={() => handleStartEdit(u)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        title="এডিট করুন"
                      >
                        <Edit2 size={13} /> এডিট
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {status.error && (
        <div className="mt-4">
          <ErrorBox message={apiError(status.error)} />
        </div>
      )}

      {/* Create User Modal */}
      {openCreate && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <UserCog />
              </div>
              <h3 className="font-bold">নতুন ব্যবহারকারী</h3>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <Field label="নাম">
                <input className="lk-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="ইউজারনেম">
                <input className="lk-input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              </Field>
              <Field label="ইমেইল">
                <input className="lk-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label="ফোন">
                <input className="lk-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </Field>
              <Field label="পাসওয়ার্ড" help="Backend minimum 10 characters">
                <input
                  type="password"
                  className="lk-input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </Field>
              <Field label="রোল">
                <select
                  className="lk-input"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                >
                  {['OWNER', 'ADMIN', 'MANAGER', 'ACCOUNTANT', 'OPERATOR', 'DRIVER', 'VIEWER'].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              {create.error && (
                <div className="md:col-span-2">
                  <ErrorBox message={apiError(create.error)} />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 border-t bg-slate-50 p-4">
              <button onClick={() => setOpenCreate(false)} className="lk-btn-secondary">
                বাতিল
              </button>
              <button
                disabled={form.name.length < 2 || form.username.length < 3 || form.password.length < 10 || create.isPending}
                onClick={() => create.mutate()}
                className="lk-btn-primary"
              >
                তৈরি করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <UserCog />
              </div>
              <h3 className="font-bold">ব্যবহারকারী সম্পাদনা ({editUser.username})</h3>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <Field label="নাম">
                <input
                  className="lk-input"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </Field>
              <Field label="ইমেইল">
                <input
                  className="lk-input"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </Field>
              <Field label="ফোন">
                <input
                  className="lk-input"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </Field>
              <Field label="রোল">
                <select
                  className="lk-input"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                >
                  {['OWNER', 'ADMIN', 'MANAGER', 'ACCOUNTANT', 'OPERATOR', 'DRIVER', 'VIEWER'].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              <div className="md:col-span-2">
                <Field label="নতুন পাসওয়ার্ড (ঐচ্ছিক)" help="পরিবর্তন না করতে চাইলে ফাঁকা রাখুন (মিন ১০ অক্ষর)">
                  <input
                    type="password"
                    className="lk-input"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  />
                </Field>
              </div>
              {update.error && (
                <div className="md:col-span-2">
                  <ErrorBox message={apiError(update.error)} />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 border-t bg-slate-50 p-4">
              <button onClick={() => setEditUser(null)} className="lk-btn-secondary">
                বাতিল
              </button>
              <button
                disabled={editForm.name.length < 2 || update.isPending}
                onClick={() => update.mutate()}
                className="lk-btn-primary"
              >
                আপডেট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
