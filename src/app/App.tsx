import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { bootstrapSession } from '../services/api';
import { router } from './router';
const queryClient=new QueryClient({defaultOptions:{queries:{staleTime:30_000,retry:1,refetchOnWindowFocus:false},mutations:{retry:0}}});
export default function App(){useEffect(()=>{void bootstrapSession()},[]);return <QueryClientProvider client={queryClient}><RouterProvider router={router}/></QueryClientProvider>}
