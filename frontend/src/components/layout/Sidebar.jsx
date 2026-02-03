import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, ShoppingBag, Package, LogOut, X, ShieldCheck, Home } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const isAdmin = user && ['Admin', 'Manager', 'Staff'].includes(user.role?.name);

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/products', label: 'Products', icon: Package },
        ...(user ? [{ path: '/orders', label: 'My Orders', icon: ShoppingBag }] : []),
        ...(isAdmin ? [{ path: '/admin', label: 'Admin Panel', icon: LayoutDashboard }] : []),
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl border-r border-slate-200 text-slate-900">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-8 border-b border-slate-100">
                <Link to="/" className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                        <ShieldCheck className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-900">
                        ANTIGRAVITY
                    </span>
                </Link>
                <button
                    onClick={onClose}
                    className="md:hidden ml-auto p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium ${isActive(item.path)
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                            }`}
                    >
                        <item.icon
                            className={`w-5 h-5 transition-colors ${isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                                }`}
                        />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* User Profile / Logout - Bottom */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                {user ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                        <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="truncate">
                                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                                <p className="text-xs text-slate-500 truncate">{user.role?.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="flex items-center justify-center w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-30">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <div className={`md:hidden fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={onClose}
                />

                {/* Visual Sidebar */}
                <aside
                    className={`absolute inset-y-0 left-0 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <SidebarContent />
                </aside>
            </div>
        </>
    );
};

export default Sidebar;
