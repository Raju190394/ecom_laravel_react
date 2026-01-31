import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    LayoutDashboard,
    ShoppingBag,
    DollarSign,
    AlertTriangle,
    CheckCircle,
    Truck,
    Package,
    XCircle,
    RefreshCw,
    TrendingUp,
    MoreVertical,
    Calendar,
    ArrowUpRight
} from 'lucide-react';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, ordersRes] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get('/orders')
            ]);
            setData(statsRes.data);
            setRecentOrders(ordersRes.data.data);
        } catch (err) {
            console.error('Error fetching dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingStatus(orderId);
        try {
            await api.patch(`/orders/${orderId}/status`, {
                status: newStatus,
                notes: `Status updated via Admin Dashboard to ${newStatus}`
            });
            fetchData();
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setUpdatingStatus(null);
        }
    };

    if (loading && !data) return (
        <div className="flex flex-col justify-center items-center py-40">
            <RefreshCw className="animate-spin text-indigo-600 mb-4" size={40} />
            <p className="text-slate-400 font-medium tracking-tight">Syncing your business intelligence...</p>
        </div>
    );

    const stats = data?.stats || {};

    return (
        <div className="space-y-10">
            {/* Page Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight flex items-center">
                        <LayoutDashboard className="mr-4 text-indigo-600" size={32} />
                        Executive Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">Monitor your logistics and sales performance in real-time.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold flex items-center shadow-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Today: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <button
                        onClick={fetchData}
                        className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Gross Revenue"
                    value={`$${parseFloat(stats.total_revenue || 0).toLocaleString()}`}
                    trend="+12.5%"
                    icon={<DollarSign className="text-emerald-600" />}
                    bgColor="bg-emerald-50"
                />
                <StatCard
                    title="Volume"
                    value={stats.total_orders}
                    trend="+8.2%"
                    icon={<ShoppingBag className="text-indigo-600" />}
                    bgColor="bg-indigo-50"
                />
                <StatCard
                    title="Pending Dispatch"
                    value={stats.pending_orders}
                    icon={<TrendingUp className="text-amber-600" />}
                    bgColor="bg-amber-50"
                />
                <StatCard
                    title="Critical Stock"
                    value={stats.low_stock_products}
                    icon={<AlertTriangle className="text-rose-600" />}
                    bgColor="bg-rose-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Orders Panel */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">Recent Transactions</h2>
                        <button className="text-indigo-600 text-sm font-bold flex items-center hover:underline">
                            View All <ArrowUpRight className="ml-1 w-4 h-4" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">Reference</th>
                                    <th className="px-8 py-5">Partner</th>
                                    <th className="px-8 py-5">Amount</th>
                                    <th className="px-8 py-5">Logistics</th>
                                    <th className="px-8 py-5 text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-indigo-50/20 transition-colors group">
                                        <td className="px-8 py-5 text-sm font-bold text-indigo-600">ID-{order.id}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs mr-3">
                                                    {order.user.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700">{order.user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-900">${order.total_amount}</td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                                                <StatusDot status={order.status} />
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <select
                                                    className="bg-transparent text-xs font-bold text-slate-400 outline-none focus:text-indigo-600 transition-colors cursor-pointer"
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    disabled={updatingStatus === order.id}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="packed">Packed</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <MoreVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance sidebar */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-8">Supply Integrity</h2>
                        <div className="space-y-6">
                            {data?.status_counts.map((item) => (
                                <div key={item.status} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <StatusCircleIcon status={item.status} />
                                        <span className="text-sm font-bold text-slate-600 capitalize ml-4">{item.status}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900">
                                        {item.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                        <TrendingUp className="absolute -bottom-10 -right-10 w-40 h-40 text-black/10" />
                        <h3 className="text-lg font-bold mb-2">Inventory Insight</h3>
                        <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
                            {stats.low_stock_products > 0
                                ? `Warning: ${stats.low_stock_products} products are below threshold. Reorder stock soon to avoid outages.`
                                : "Global inventory health is optimal. No critical restocks needed today."}
                        </p>
                        <button className="px-6 py-2 bg-white text-indigo-900 rounded-xl text-xs font-bold shadow-lg">
                            Run Analysis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, trend, icon, bgColor }) => (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
        <div className={`p-4 rounded-2xl ${bgColor} inline-block mb-4 transition-transform group-hover:scale-110 duration-300`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-1">{title}</p>
            <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
                {trend && <span className="text-xs font-bold text-emerald-500">{trend}</span>}
            </div>
        </div>
    </div>
);

const getStatusBadge = (status) => {
    const styles = {
        'pending': 'bg-amber-50 text-amber-700',
        'packed': 'bg-sky-50 text-sky-700',
        'shipped': 'bg-violet-50 text-violet-700',
        'delivered': 'bg-emerald-50 text-emerald-700',
        'cancelled': 'bg-rose-50 text-rose-700'
    };
    return styles[status] || 'bg-slate-50 text-slate-500 line-through';
};

const StatusDot = ({ status }) => {
    const dots = {
        'pending': 'bg-amber-400',
        'packed': 'bg-sky-400',
        'shipped': 'bg-violet-400',
        'delivered': 'bg-emerald-400',
        'cancelled': 'bg-rose-400'
    };
    return <span className={`w-1.5 h-1.5 rounded-full mr-2 ${dots[status] || 'bg-slate-400'}`} />;
};

const StatusCircleIcon = ({ status }) => {
    switch (status) {
        case 'delivered': return <CheckCircle size={18} className="text-emerald-500" />;
        case 'shipped': return <Truck size={18} className="text-violet-500" />;
        case 'packed': return <Package size={18} className="text-sky-500" />;
        case 'pending': return <RefreshCw size={18} className="text-amber-500" />;
        default: return <XCircle size={18} className="text-rose-500" />;
    }
};

export default AdminDashboard;
