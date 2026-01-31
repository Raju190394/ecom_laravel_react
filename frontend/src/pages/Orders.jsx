import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Package, Clock, MapPin, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data.data);
            } catch (err) {
                console.error('Error fetching orders', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return (
        <div className="flex flex-col justify-center items-center py-40">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-medium">Retrieving your order history...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Purchase History</h1>
                    <p className="text-slate-500 mt-2">Track and manage your recent orders.</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="text-slate-300" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No orders found</h3>
                    <p className="text-slate-500 mb-8">It looks like you haven't placed any orders yet.</p>
                    <Link to="/products" className="btn-primary inline-flex items-center">
                        Start Shopping <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="group bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/30 overflow-hidden hover:border-indigo-200 transition-all duration-300">
                            <div className="p-8">
                                <div className="flex flex-wrap justify-between items-center gap-6 mb-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
                                            #{order.id}
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Order Placed</p>
                                            <p className="text-sm font-bold text-slate-900">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right mr-4">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Total Value</p>
                                            <p className="text-xl font-black text-indigo-600">${order.total_amount}</p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-slate-50/50 rounded-2xl p-6 space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-100 mr-4 shadow-sm">
                                                    <Package size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{item.product.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium">Quantity: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">${item.subtotal}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm pt-6 border-t border-slate-50">
                                    <div className="flex items-start text-slate-500 font-medium">
                                        <MapPin size={18} className="mr-2 text-slate-300 flex-shrink-0" />
                                        <span>{order.shipping_address}</span>
                                    </div>
                                    <button className="flex items-center text-indigo-600 font-bold hover:translate-x-1 transition-transform">
                                        Download Invoice <ChevronRight size={18} className="ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const getStatusColor = (status) => {
    const colors = {
        'pending': 'bg-amber-50 text-amber-600 border-amber-100',
        'packed': 'bg-sky-50 text-sky-600 border-sky-100',
        'shipped': 'bg-violet-50 text-violet-600 border-violet-100',
        'delivered': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'cancelled': 'bg-rose-50 text-rose-600 border-rose-100'
    };
    return colors[status] || 'bg-slate-50 text-slate-400 border-slate-100';
};

export default Orders;
