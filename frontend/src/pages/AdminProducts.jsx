import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { Plus, Edit2, Trash2, Package, Search, X } from 'lucide-react';
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
        category_id: ''
    });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentProduct) {
                await api.put(`/admin/products/${currentProduct.id}`, formData);
                showToast('Product updated successfully', 'success');
            } else {
                await api.post('/admin/products', formData);
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
                category_id: product.category_id
            });
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
            category_id: categories.length > 0 ? categories[0].id : ''
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Product Inventory</h1>
                    <p className="text-slate-500 mt-1">Manage your catalog, stock levels, and pricing.</p>
                </div>
                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search SKU or Name..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => openModal()} icon={Plus} className="shrink-0">
                        Add Product
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5">Product</th>
                                <th className="px-8 py-5">SKU</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5">Price</th>
                                <th className="px-8 py-5">Stock</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-10 text-center text-slate-400">Loading catalog...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-10 text-center text-slate-400">No products found for this criteria.</td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 mr-4">
                                                    <Package size={20} />
                                                </div>
                                                <span className="font-bold text-slate-900">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-xs font-mono font-bold text-slate-500">{product.sku}</td>
                                        <td className="px-8 py-5">
                                            <span className="inline-block px-2 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                                                {product.category?.name}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 font-bold text-slate-700">${product.price}</td>
                                        <td className="px-8 py-5">
                                            <span className={`text-xs font-bold ${product.stock_quantity > 10 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {product.stock_quantity} units
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openModal(product)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                                    <Trash2 size={16} />
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
                title={currentProduct ? "Edit Product" : "Create Product"}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Product Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="SKU"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            required
                        />
                        <div className="space-y-1">
                            <label className="input-label">Category</label>
                            <div className="relative">
                                <select
                                    className="input-base appearance-none"
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Price ($)"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                        <Input
                            label="Stock"
                            type="number"
                            value={formData.stock_quantity}
                            onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="input-label">Description</label>
                        <textarea
                            className="input-base min-h-[100px] resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <Button type="submit">
                            {currentProduct ? 'Update Product' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminProducts;
