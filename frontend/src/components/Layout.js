import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Chatbot from './ui/Chatbot';

const Layout = () => {
    const { theme } = useTheme();
    return (
        <div
            className={`flex flex-col min-h-screen relative ${theme} bg-theme-global transition-colors duration-500 overflow-x-hidden`}
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            {/* BACKGROUND OVERLAY */}
            <div className={`absolute inset-0 z-0 ${theme === 'dark' ? 'bg-black/85' : 'bg-gradient-to-br from-indigo-950/90 via-blue-900/70 to-purple-950/90'}`} />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Outlet />
                </main>
                <Footer />
            </div>
            <Chatbot />
        </div>
    );
};

export default Layout;
