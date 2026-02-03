const Footer = () => {
    return (
        <footer className="mt-auto py-8 px-8 border-t border-slate-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} Antigravity OMS. All rights reserved.</p>
                <div className="flex items-center space-x-6">
                    <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
