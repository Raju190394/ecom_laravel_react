import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Package, ShoppingCart, ArrowRight, Search, Filter, Star, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToCart, cartCount } = useCart();
    const { showToast } = useToast();

    const handleAddToCart = (product) => {
        addToCart(product);
        showToast(`${product.name} added to your operational fleet!`, 'success');
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data.data);
            } catch (err) {
                console.error('Error fetching products', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col justify-center items-center py-40 animate-pulse">
            <div className="w-16 h-16 bg-slate-200 rounded-2xl mb-4"></div>
            <p className="text-slate-400 font-medium">Curating your collection...</p>
        </div>
    );

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Our Collection</h1>
                    <p className="text-slate-500 mt-1">Discover premium products curated for you.</p>
                </div>

                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="input-field pl-12"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 flex flex-col">
                        {/* Image Placeholder */}
                        <div className="h-64 bg-slate-50 relative overflow-hidden flex items-center justify-center p-8 group-hover:bg-indigo-50/30 transition-colors">
                            <div className="transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 text-slate-200 group-hover:text-indigo-200">
                                <Package size={100} />
                            </div>

                            <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                                <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-indigo-600">
                                    <Star size={18} />
                                </button>
                            </div>

                            <span className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                {product.category.name}
                            </span>
                        </div>

                        {/* Details */}
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                                    ${product.price}
                                </span>
                            </div>

                            <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">
                                {product.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Stock Status</span>
                                    <span className={`text-xs font-bold ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {product.stock_quantity > 0 ? `${product.stock_quantity} Units Left` : 'Out of Stock'}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.stock_quantity <= 0}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${product.stock_quantity > 0
                                        ? 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-200'
                                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                        }`}
                                >
                                    <ShoppingCart size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                    <Search className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-900">No products found</h3>
                    <p className="text-slate-500">Try adjusting your search terms.</p>
                </div>
            )}

            {/* Floating Action: Cart (Mobile Optimized) */}
            {cartCount > 0 && (
                <div className="fixed bottom-8 right-8 z-40">
                    <Link to="/checkout" className="flex items-center space-x-3 bg-indigo-600 py-4 px-6 rounded-2xl text-white shadow-2xl shadow-indigo-300 transform transition-all hover:scale-105 active:scale-95">
                        <div className="relative">
                            <ShoppingCart className="w-6 h-6" />
                            <span className="absolute -top-2 -right-2 bg-white text-indigo-600 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                                {cartCount}
                            </span>
                        </div>
                        <span className="font-bold tracking-tight">Checkout Now</span>
                        <ArrowRight className="w-5 h-5 lg:block hidden" />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Products;
