import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            flex items-center gap-4 p-4 pr-3 min-w-[320px] rounded-2xl glass-effect shadow-2xl border-l-[6px] animate-slide-up
                            ${toast.type === 'success' ? 'border-emerald-500' :
                                toast.type === 'error' ? 'border-rose-500' : 'border-amber-500'}
                        `}
                    >
                        <div className="flex-shrink-0">
                            {toast.type === 'success' && <CheckCircle className="text-emerald-500 w-6 h-6" />}
                            {toast.type === 'error' && <XCircle className="text-rose-500 w-6 h-6" />}
                            {toast.type === 'warning' && <AlertCircle className="text-amber-500 w-6 h-6" />}
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm font-bold text-slate-800">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
