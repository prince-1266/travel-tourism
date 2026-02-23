import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
    const { theme } = useTheme();
    return (
        <div className={`flex flex-col min-h-screen relative ${theme} bg-theme-global transition-colors duration-500`}>
            {/* BACKGROUND OVERLAY */}
            <div className={`absolute inset-0 z-0 ${theme === 'dark' ? 'bg-black/80' : 'bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-blue-900/40'}`} />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
