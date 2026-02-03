import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { Plus, Edit2, Trash2, Package, Search, Info } from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        price: '',
        stock_quantity: '',
        category_id: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const { showToast } = useToast();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/products', { params: { search: searchTerm } }),
                api.get('/categories')
            ]);
            setProducts(prodRes.data.data);
            setCategories(catRes.data);
        } catch (err) {
            console.error(err);
            showToast('Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('sku', formData.sku);
        data.append('category_id', formData.category_id);
        data.append('price', formData.price);
        data.append('stock_quantity', formData.stock_quantity);
        data.append('description', formData.description || '');
        if (formData.image instanceof File) {
            data.append('image', formData.image);
        }

        // Laravel needs _method for PUT with FormData
        if (currentProduct) {
            data.append('_method', 'PUT');
        }

        try {
            if (currentProduct) {
                await api.post(`/admin/products/${currentProduct.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showToast('Product updated successfully', 'success');
            } else {
                await api.post('/admin/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showToast('Product created successfully', 'success');
            }
            setIsModalOpen(false);
            fetchProducts();
            resetForm();
        } catch (err) {
            showToast(err.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/admin/products/${id}`);
                showToast('Product deleted', 'success');
                fetchProducts();
            } catch (err) {
                showToast('Failed to delete product', 'error');
            }
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setCurrentProduct(product);
            setFormData({
                name: product.name,
                sku: product.sku,
                description: product.description || '',
                price: product.price,
                stock_quantity: product.stock_quantity,
                category_id: product.category_id,
                image: null // Reset file input
            });
            setImagePreview(product.image ? `http://localhost:8000/storage/${product.image}` : null);
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setCurrentProduct(null);
        setFormData({
            name: '',
            sku: '',
            description: '',
            price: '',
            stock_quantity: '',
            category_id: categories.length > 0 ? categories[0].id : '',
            image: null
        });
        setImagePreview(null);
    };

    // Calculate quick stats
    const totalStock = products.reduce((acc, p) => acc + p.stock_quantity, 0);
    const lowStockCount = products.filter(p => p.stock_quantity < 10).length;
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock_quantity), 0);

    return (
        <div className="space-y-8 animate-slide-up">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Inventory Control</h1>
                    <div className="flex items-center space-x-2 text-slate-500 font-medium">
                        <span>Managed by</span>
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Admin Team</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="hidden lg:block bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-indigo-100">
                        <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">Total Valuation</p>
                        <p className="text-xl font-black text-slate-900">${totalValue.toLocaleString()}</p>
                    </div>
                    <div className="hidden lg:block bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-indigo-100">
                        <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">Low Stock Items</p>
                        <p className={`text-xl font-black ${lowStockCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {lowStockCount}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-lg shadow-slate-200/40">
                <div className="relative flex-1 md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search product name, SKU, or category..."
                        className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50/20 outline-none transition-all placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => openModal()} icon={Plus} className="shrink-0 shadow-indigo-300/50">
                    Add New Product
                </Button>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest first:pl-10">Product Details</th>
                                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Price</th>
                                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Inventory Status</th>
                                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right last:pr-10">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                            <p className="text-slate-400 font-medium">Syncing catalog data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                                                <Search className="text-slate-300 w-10 h-10" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">No matching products</h3>
                                            <p className="text-slate-500 mb-6">We couldn't find any products matching your search criteria. Try adjusting your filters or add a new item.</p>
                                            <Button variant="secondary" onClick={() => setSearchTerm('')}>Clear Search</Button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, index) => (
                                    <tr
                                        key={product.id}
                                        className="group hover:bg-indigo-50/30 transition-colors duration-200"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="px-8 py-5 first:pl-10">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 mr-4 shadow-sm group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                                    {product.image ? (
                                                        <img src={`http://localhost:8000/storage/${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package size={24} className="group-hover:text-indigo-600 transition-colors" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-base">{product.name}</div>
                                                    <div className="text-xs font-mono font-medium text-slate-400 mt-0.5">SKU: {product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                                                {product.category?.name}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-slate-700">${parseFloat(product.price).toFixed(2)}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center">
                                                <div className={`w-2 h-2 rounded-full mr-2.5 ${product.stock_quantity > 10 ? 'bg-emerald-400' : product.stock_quantity > 0 ? 'bg-amber-400' : 'bg-rose-400'}`}></div>
                                                <span className={`text-sm font-bold ${product.stock_quantity > 10 ? 'text-slate-600' : 'text-slate-900'}`}>
                                                    {product.stock_quantity} <span className="text-slate-400 text-xs font-medium ml-1">units</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right last:pr-10">
                                            <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => openModal(product)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all active:scale-95"
                                                    title="Edit Product"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:shadow-md transition-all active:scale-95"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentProduct ? "Edit Product Details" : "Add New Product"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 mb-6 flex items-start">
                        <Info className="w-5 h-5 text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
                        <p className="text-sm text-indigo-900/80 leading-relaxed">
                            Ensure all product details are accurate. SKU must be unique across the inventory. Changes reflect immediately in the customer app.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                            <label className="input-label">Product Image</label>
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center text-slate-300 relative group">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Package size={24} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
                                    />
                                    <p className="text-xs text-slate-400 mt-2 font-medium">Recommended: 800x800px or larger (Max 2MB)</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <Input
                                label="Product Name"
                                placeholder="e.g. Wireless Noise-Canceling Headphones"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <Input
                            label="SKU Code"
                            placeholder="PROD-001"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            required
                        />

                        <div className="space-y-2">
                            <label className="input-label">Category</label>
                            <div className="relative">
                                <select
                                    className="input-base appearance-none cursor-pointer"
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Select a Category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <Input
                                label="Unit Price ($)"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>

                        <Input
                            label="Stock Quantity"
                            type="number"
                            placeholder="0"
                            value={formData.stock_quantity}
                            onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="input-label">Description</label>
                        <textarea
                            className="input-base min-h-[120px] resize-none leading-relaxed"
                            placeholder="Describe the key features and specifications..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 mt-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <Button type="submit" loading={loading} icon={currentProduct ? Edit2 : Plus}>
                            {currentProduct ? 'Save Changes' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminProducts;
