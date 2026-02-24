import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, X, Plane, Map, Phone, Info, ChevronLeft } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Map className="w-4 h-4 mr-1" /> },
    { name: 'Destinations', path: '/destinations', icon: <Map className="w-4 h-4 mr-1" /> },
    { name: 'About', path: '/about', icon: <Info className="w-4 h-4 mr-1" /> },
    { name: 'Contact', path: '/contact', icon: <Phone className="w-4 h-4 mr-1" /> },
  ];

  const isActive = (path) => {
    const isCurrent = location.pathname === path;
    return `relative flex items-center text-sm font-medium transition-all duration-300 ${isCurrent ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`;
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-3' : 'bg-white/30 backdrop-blur-md py-5 border-b border-white/10'}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo & Back Button */}
          <div className="flex items-center gap-2">
            {location.pathname !== '/' && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 mr-1 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center group/back"
                title="Go Back"
              >
                <ChevronLeft size={24} className="group-hover/back:-translate-x-0.5 transition-transform" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-blue-700 via-blue-500 to-indigo-600 p-2.5 rounded-full shadow-[0_4px_20px_0_rgba(37,99,235,0.4)] group-hover:shadow-[0_8px_25px_rgba(37,99,235,0.5)] group-hover:scale-110 transition-all duration-300 text-white flex items-center justify-center border border-white/20 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plane size={24} className="group-hover:rotate-[20deg] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 relative z-10" />
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-500 bg-clip-text text-transparent drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300">
                TripWell
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-full ${isActive(link.path)} relative group overflow-hidden`}
              >
                <span className="relative z-10 flex items-center">{link.name}</span>
                {location.pathname === link.path && (
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"></span>
                )}
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full scale-95 group-hover:scale-100 origin-center"></div>
              </Link>
            ))}

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2.5 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-2xl origin-top animate-in slide-in-from-top-2 duration-300">
          <div className="px-4 pt-4 pb-8 space-y-2 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 ${location.pathname === link.path
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
              >
                {React.cloneElement(link.icon, { className: 'w-5 h-5 mr-3' })}
                {link.name}
              </Link>
            ))}
            <div className="pt-6 mt-4 border-t border-gray-100 flex flex-col gap-3">
              {/* Removed Login/Sign Up */}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
