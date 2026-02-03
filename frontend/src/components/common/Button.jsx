export const Button = ({
    children,
    variant = 'primary',
    className = '',
    loading = false,
    icon: Icon,
    ...props
}) => {
    const baseStyles = "px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center transition-all duration-300 transform active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "brand-gradient text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02]",
        secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
        ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900",
        danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : Icon && (
                <Icon className="w-5 h-5 mr-2" />
            )}
            {children}
        </button>
    );
};
