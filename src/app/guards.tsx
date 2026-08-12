import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loading } from '../components/ui';
import { useAuthStore } from '../stores/auth';
export function AuthenticatedRoute(){const {user,ready}=useAuthStore();const loc=useLocation();if(!ready)return <Loading label="সেশন যাচাই হচ্ছে..."/>;if(!user)return <Navigate to="/login" replace state={{from:loc.pathname+loc.search}}/>;return <Outlet/>}
export function GuestOnlyRoute(){const {user,ready}=useAuthStore();if(!ready)return <Loading label="সেশন যাচাই হচ্ছে..."/>;return user?<Navigate to="/app/dashboard" replace/>:<Outlet/>}
