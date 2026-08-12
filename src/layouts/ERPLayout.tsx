import { Bell, Boxes, ChartNoAxesCombined, CircleDollarSign, ClipboardList, FileText, Gauge, Menu, MessageSquareText, PackagePlus, Settings, Truck, UserCog, Users, WalletCards, X } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Brand } from '../components/Brand';
import { useUIStore } from '../stores/ui';
import { useAuthStore } from '../stores/auth';
import { authApi } from '../services/endpoints';

const nav=[
 ['ড্যাশবোর্ড','/app/dashboard',Gauge],['গ্রাহক','/app/customers',Users],['পণ্য','/app/products',Boxes],['ক্রয়','/app/purchases',ClipboardList],['ইনভয়েস','/app/invoices',FileText],['পেমেন্ট','/app/payments',WalletCards],['বকেয়া','/app/dues',CircleDollarSign],['পরিবহন','/app/transport/deliveries',Truck],['রিপোর্টস','/app/reports',ChartNoAxesCombined],['SMS ইতিহাস','/app/sms-history',MessageSquareText],['ব্যবহারকারী','/app/users',UserCog],['সেটিংস','/app/settings',Settings]
] as const;
export function ERPLayout(){const ui=useUIStore();const auth=useAuthStore();const navg=useNavigate();const loc=useLocation(); const title=nav.find(([,path])=>loc.pathname.startsWith(path))?.[0]||'LogiKhata';
const logout=async()=>{try{await authApi.logout()}catch{} auth.clear();navg('/login',{replace:true})};
return <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
  <aside className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-gradient-to-b from-slate-950 to-slate-800 text-white transition-transform lg:translate-x-0 ${ui.sidebarOpen?'translate-x-0':'-translate-x-full'}`}>
    <div className="flex min-h-[78px] items-center justify-between border-b border-white/10 px-5"><Brand inverse/><button onClick={ui.closeSidebar} className="lg:hidden"><X/></button></div>
    <nav className="flex-1 overflow-y-auto p-3"><p className="px-3 py-3 text-[11px] font-semibold tracking-wide text-white/35">প্রধান মেনু</p>{nav.map(([label,to,Icon])=><NavLink key={to} to={to} onClick={ui.closeSidebar} className={({isActive})=>`mb-1 flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${isActive?'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/20':'text-white/70 hover:bg-white/5 hover:text-white'}`}><Icon size={20}/>{label}</NavLink>)}</nav>
    <div className="p-4"><div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-white/50"><b className="mb-1 block text-sm text-white/80">LogiKhata ERP</b>একই API ব্যবহার করে Web এবং Mobile ক্লায়েন্ট।</div></div>
  </aside>
  {ui.sidebarOpen&&<button className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden" onClick={ui.closeSidebar}/>} 
  <main className="min-w-0 lg:col-start-2"><header className="sticky top-0 z-30 flex min-h-[78px] items-center justify-between border-b border-slate-200/90 bg-white/90 px-4 backdrop-blur-xl md:px-7"><div className="flex items-center gap-3"><button onClick={ui.toggleSidebar} className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 lg:hidden"><Menu/></button><div><h2 className="font-bold text-slate-950">{title}</h2><p className="text-xs text-slate-400">হোম / {title}</p></div></div><div className="flex items-center gap-2"><button className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-50"><Bell size={20}/><i className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500"/></button><div className="hidden text-right sm:block"><div className="text-xs font-bold text-slate-900">{auth.user?.name}</div><div className="text-[11px] text-slate-400">{auth.user?.role}</div></div><button onClick={logout} className="grid h-10 min-w-10 place-items-center rounded-xl bg-blue-600 px-3 text-xs font-bold text-white">লগআউট</button></div></header><div className="mx-auto max-w-[1500px] p-4 pb-24 md:p-7"><Outlet/></div></main>
</div>}
