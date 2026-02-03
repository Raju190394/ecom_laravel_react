export const Card = ({ children, className = '', hover = false }) => {
    return (
        <div className={`premium-card p-8 ${hover ? 'hover:shadow-2xl hover:shadow-indigo-100' : ''} ${className}`}>
            {children}
        </div>
    );
};
