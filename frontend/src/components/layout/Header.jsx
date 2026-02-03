import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Menu, Search, ShoppingCart, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ toggleSidebar }) => {
    const { cart } = useCart();
    const { user } = useAuth();

    return (
        <header className="h-20 sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Search Bar - Hidden on small mobile */}
                <div className="hidden sm:flex items-center w-full max-w-md">
                    <div className="relative group w-64 focus-within:w-80 transition-all duration-300">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 w-5 h-5 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {/* Notifications */}
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Cart */}
                <Link
                    to="/checkout"
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative group"
                >
                    <ShoppingCart className="w-5 h-5" />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                            {cart.length}
                        </span>
                    )}
                </Link>

                {/* Mobile User Avatar (Functional Fallback) */}
                <div className="md:hidden w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                    {user ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
            </div>
        </header>
    );
};

export default Header;
