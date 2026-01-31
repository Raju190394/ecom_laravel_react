import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Trash2, Plus, Minus, CreditCard, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';

const Checkout = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        if (cart.length === 0) return;

        setLoading(true);
        setError('');

        try {
            await api.post('/orders', {
                shipping_address: address,
                items: cart.map(item => ({ product_id: item.id, quantity: item.quantity }))
            });
            clearCart();
            showToast('Order transmitted successfully! Awaiting logistics deployment.', 'success');
            navigate('/orders');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process order.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="text-center py-40">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="text-slate-300" size={40} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
                <p className="text-slate-500 mb-8">Add components to your cart to begin your order.</p>
                <button onClick={() => navigate('/products')} className="btn-primary">Explore Products</button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
            <div className="lg:col-span-8 space-y-8">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                        <ShoppingBag className="mr-3 text-indigo-600" />
                        Order Summary
                    </h2>
                    <div className="divide-y divide-slate-100">
                        {cart.map((item) => (
                            <div key={item.id} className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 group">
                                <div className="flex items-center space-x-6 w-full">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-200 transition-colors">
                                        <CreditCard size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900">{item.name}</h3>
                                        <p className="text-sm font-bold text-indigo-600">${item.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-8 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-400 hover:text-indigo-600"><Minus size={14} /></button>
                                        <span className="w-8 text-center text-sm font-black text-slate-700">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-400 hover:text-indigo-600"><Plus size={14} /></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={20} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                        <Truck className="mr-3 text-indigo-600" />
                        Logistics Details
                    </h2>
                    <form id="orderForm" onSubmit={handlePlaceOrder} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">Shipping Destination</label>
                            <textarea
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="input-field min-h-[120px] resize-none"
                                placeholder="Enter full street address, city, state, and zip code..."
                            ></textarea>
                        </div>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-4">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-indigo-100/50 sticky top-24 space-y-8">
                    <h2 className="text-2xl font-bold text-slate-900">Total</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between text-slate-500 font-medium">
                            <span>Subtotal</span>
                            <span className="font-bold text-slate-900">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 font-medium">
                            <span>Processing</span>
                            <span className="font-bold text-emerald-500">Gratis</span>
                        </div>
                        <div className="pt-4 border-t border-slate-50 flex justify-between">
                            <span className="text-slate-900 font-bold">Total Payable</span>
                            <span className="text-3xl font-black text-indigo-600">${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {error && <div className="p-4 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl border border-rose-100 uppercase tracking-tight">{error}</div>}

                    <button
                        form="orderForm"
                        disabled={loading}
                        className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center space-x-3 text-lg"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>Place Secure Order</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <div className="pt-6 flex items-center justify-center space-x-3 text-slate-400">
                        <ShieldCheck size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">AES-256 Encrypted</span>
                    </div>

                    {!user && (
                        <div className="p-6 bg-indigo-50 rounded-2xl text-center">
                            <p className="text-sm font-medium text-indigo-700 mb-4">Authentication required for checkout.</p>
                            <button onClick={() => navigate('/login')} className="text-indigo-900 font-black underline decoration-2 underline-offset-4">Authorize Now</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkout;
