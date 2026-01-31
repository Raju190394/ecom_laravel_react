import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, LayoutDashboard, LogOut, User as UserIcon, Package } from 'lucide-react';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const isAdmin = user && ['Admin', 'Manager', 'Staff'].includes(user.role.name);

    return (
        <div className="min-h-screen bg-mesh selection:bg-indigo-100 selection:text-indigo-900">
            <nav className="nav-blur">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center space-x-12">
                            <Link to="/" className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                    <ShoppingCart className="text-white w-6 h-6" />
                                </div>
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
                                    Antigravity OMS
                                </span>
                            </Link>
                            <div className="hidden md:flex items-center space-x-1">
                                <NavLink to="/products" icon={<Package className="w-4 h-4" />} label="Products" />
                                {user && <NavLink to="/orders" icon={<ShoppingBag className="w-4 h-4" />} label="My Orders" />}
                                {isAdmin && (
                                    <Link to="/admin" className="ml-4 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-all flex items-center">
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Admin Panel
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-sm font-bold text-slate-900">{user.name}</span>
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{user.role.name}</span>
                                    </div>
                                    <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer">
                                        <UserIcon className="w-5 h-5" />
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="btn-primary">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <Outlet />
            </main>

            <footer className="mt-20 border-t border-slate-200 py-10 text-center text-slate-400 text-sm">
                &copy; 2026 Antigravity OMS. Built for high performance.
            </footer>
        </div>
    );
};

const NavLink = ({ to, icon, label }) => (
    <Link
        to={to}
        className="px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl text-sm font-medium transition-all flex items-center space-x-2"
    >
        {icon}
        <span>{label}</span>
    </Link>
);

const ShoppingBag = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
);

export default MainLayout;
