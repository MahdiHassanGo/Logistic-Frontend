import { Link } from 'react-router-dom';
export function NotFoundPage(){return <div className="grid min-h-[60vh] place-items-center text-center"><div><div className="text-7xl font-bold text-blue-600">404</div><h1 className="mt-4 text-2xl font-bold">পৃষ্ঠা পাওয়া যায়নি</h1><Link to="/app/dashboard" className="lk-btn-primary mt-5">ড্যাশবোর্ডে ফিরুন</Link></div></div>}
