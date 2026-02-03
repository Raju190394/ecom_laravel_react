import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-mesh flex">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 md:pl-72">
                {/* Header */}
                <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                {/* Content */}
                <main className="flex-1 p-6 md:p-8 animate-fade-in">
                    <div className="w-full space-y-8">
                        <Outlet />
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;
