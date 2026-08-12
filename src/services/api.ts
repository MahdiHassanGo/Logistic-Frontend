import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/auth';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://logistic-backend-beta.vercel.app/api/v1';
let accessToken: string | null = null;
let refreshing: Promise<string|null>|null = null;
export const setAccessToken=(token:string|null)=>{ accessToken=token };

export const api = axios.create({ baseURL, withCredentials:true, timeout:20000, headers:{'Content-Type':'application/json'} });
api.interceptors.request.use((config)=>{ if(accessToken) config.headers.Authorization=`Bearer ${accessToken}`; return config; });

async function refreshAccessToken(){
  if(!refreshing){
    refreshing=axios.post(`${baseURL}/auth/refresh`,{}, {withCredentials:true,timeout:20000}).then(res=>{
      const token=res.data?.data?.accessToken as string|undefined; if(token) setAccessToken(token);
      if(res.data?.data?.user) useAuthStore.getState().setSession(res.data.data.user, useAuthStore.getState().permissions);
      return token??null;
    }).catch(()=>{ setAccessToken(null); useAuthStore.getState().clear(); return null; }).finally(()=>{refreshing=null});
  }
  return refreshing;
}

api.interceptors.response.use(r=>r, async(error:AxiosError)=>{
  const original=error.config as (AxiosRequestConfig & {_retry?:boolean})|undefined;
  if(error.response?.status===401 && original && !original._retry && !String(original.url).includes('/auth/login') && !String(original.url).includes('/auth/refresh')){
    original._retry=true; const token=await refreshAccessToken();
    if(token){ original.headers={...(original.headers||{}),Authorization:`Bearer ${token}`}; return api.request(original); }
  }
  return Promise.reject(error);
});

export async function bootstrapSession(){
  try{
    const token=await refreshAccessToken(); if(!token) return false;
    const me=await api.get('/auth/me'); useAuthStore.getState().setSession(me.data.data.user,me.data.data.permissions); return true;
  } finally { useAuthStore.getState().setReady(true); }
}
export function apiError(error:unknown){
  if(axios.isAxiosError(error)) return (error.response?.data as any)?.error?.message || (error.response?.data as any)?.message || error.message;
  return error instanceof Error?error.message:'অজানা ত্রুটি';
}
