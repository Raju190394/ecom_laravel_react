import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, UserPlus, Fingerprint } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

const Register = () => {
    const [data, setData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Note: In this project, we might not have the register endpoint yet, 
            // but a senior dev always prepares the flow.
            await api.post('/register', data);
            showToast('Identity created! Please authenticate now.', 'success');
            navigate('/login');
        } catch (err) {
            showToast(err.response?.data?.message || 'Membership request failed. Check your data.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh p-6">
            <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-12 premium-card overflow-hidden">
                {/* Brand Side (Reused for consistency) */}
                <div className="lg:col-span-5 brand-gradient p-12 text-white relative hidden lg:flex flex-col justify-between">
                    <div className="relative z-10 animate-slide-up">
                        <div className="flex items-center gap-3 mb-16">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter">Order Management System</span>
                        </div>
                        <h1 className="text-5xl font-black leading-tight mb-8">
                            Join the <br />
                            <span className="text-indigo-200">Global Supply</span> <br />
                            Network.
                        </h1>
                        <p className="text-indigo-100 text-lg font-medium opacity-90">
                            Create your corporate identity to start managing orders at scale.
                        </p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="lg:col-span-7 bg-white p-10 md:p-20 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full animate-slide-up">
                        <header className="mb-10">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                                <Fingerprint className="text-indigo-600 w-6 h-6" />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">Request Identity</h2>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="input-label">Full Legal Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
                                    <input
                                        type="text"
                                        required
                                        className="input-base pl-14"
                                        placeholder="Johnathan Doe"
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="input-label">Corporate Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
                                    <input
                                        type="email"
                                        required
                                        className="input-base pl-14"
                                        placeholder="user@enterprise.com"
                                        value={data.email}
                                        onChange={(e) => setData({ ...data, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="input-label">Secure Key</label>
                                    <input
                                        type="password"
                                        required
                                        className="input-base h-[58px]"
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={(e) => setData({ ...data, password: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="input-label">Confirm Key</label>
                                    <input
                                        type="password"
                                        required
                                        className="input-base h-[58px]"
                                        placeholder="••••••••"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData({ ...data, password_confirmation: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary h-16 group mt-4"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span className="text-lg">Initialize Onboarding</span>
                                        <UserPlus className="w-5 h-5 ml-3" />
                                    </>
                                )}
                            </button>
                        </form>

                        <footer className="mt-10 pt-8 border-t border-slate-100 text-center">
                            <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">Authorized Identity Found?</p>
                            <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors inline-flex items-center gap-2">
                                Jump to Authentication <ArrowRight className="w-4 h-4" />
                            </Link>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
