import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, UserPlus, Globe, Ghost } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(credentials);
            showToast('Welcome back! Authentication successful.', 'success');
            navigate('/products');
        } catch (err) {
            showToast(err.response?.data?.message || 'Access denied. Please check your credentials.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh p-6">
            <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-12 premium-card overflow-hidden">
                {/* Brand Side */}
                <div className="lg:col-span-5 brand-gradient p-12 text-white relative hidden lg:flex flex-col justify-between">
                    <div className="relative z-10 animate-slide-up">
                        <div className="flex items-center gap-3 mb-16">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter">Order Management System</span>
                        </div>

                        <h1 className="text-6xl font-black leading-[1.1] mb-8">
                            Empowering <br />
                            <span className="text-indigo-200 uppercase text-4xl tracking-widest block mt-4">Logistics Elite</span>
                        </h1>
                        <p className="text-indigo-100 text-lg font-medium leading-relaxed max-w-sm opacity-90">
                            Experience the future of order placement and inventory tracking with our state-of-the-art OMS engine.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-6 animate-slide-up delay-200">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-indigo-400 overflow-hidden">
                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase italic">AG</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-indigo-200">Trusted by 500+ Enterprises</p>
                    </div>

                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-96 h-96 border-[40px] border-white rounded-full"></div>
                        <div className="absolute bottom-20 -left-20 w-64 h-64 border-[20px] border-white rounded-full opacity-50"></div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="lg:col-span-7 bg-white p-10 md:p-20 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full animate-slide-up">
                        <header className="mb-12">
                            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">Sign In</h2>
                            <p className="text-slate-500 font-medium">Please enter your specialized access credentials.</p>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="input-label">Corporate Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
                                    <input
                                        type="email"
                                        required
                                        className="input-base pl-14"
                                        placeholder="user@enterprise.com"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="input-label">Secure Key</label>
                                    <button type="button" className="text-sm text-indigo-600 font-bold hover:text-indigo-800 transition-colors">Recover Key?</button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
                                    <input
                                        type="password"
                                        required
                                        className="input-base pl-14"
                                        placeholder="••••••••••••"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary h-16 group"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span className="text-lg">Authorize Access</span>
                                        <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <footer className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm font-bold text-slate-400">Need corporate identity?</p>
                            <Link to="/register" className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all text-sm">
                                <UserPlus className="w-4 h-4 text-indigo-600" />
                                Request Membership
                            </Link>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
