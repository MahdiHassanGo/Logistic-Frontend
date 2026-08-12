import { create } from 'zustand';
import type { User } from '../types/api';

type AuthState = { user:User|null; permissions:string[]; ready:boolean; setSession:(user:User, permissions?:string[])=>void; setReady:(v:boolean)=>void; clear:()=>void; can:(permission:string)=>boolean };
export const useAuthStore = create<AuthState>((set,get)=>({
  user:null, permissions:[], ready:false,
  setSession:(user,permissions=[])=>set({user,permissions}),
  setReady:(ready)=>set({ready}),
  clear:()=>set({user:null,permissions:[]}),
  can:(p)=>get().user?.role==='OWNER'||get().permissions.includes('*')||get().permissions.includes(p),
}));
