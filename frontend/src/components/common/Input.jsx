export const Input = ({
    label,
    icon: Icon,
    error,
    className = '',
    containerClassName = '',
    ...props
}) => {
    return (
        <div className={`space-y-1 ${containerClassName}`}>
            {label && <label className="input-label">{label}</label>}
            <div className="relative group">
                {Icon && (
                    <Icon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
                )}
                <input
                    className={`input-base ${Icon ? 'pl-14' : ''} ${error ? 'border-rose-500 focus:ring-rose-200' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-rose-500 font-bold ml-1">{error}</p>}
        </div>
    );
};
