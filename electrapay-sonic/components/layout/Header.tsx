"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coins, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Security', href: '#security' },
    { name: 'FAQ', href: '#faq' },
  ];
  
  // Modify navigation items based on pathname
  const currentNavItems = pathname.includes('/dashboard') 
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Payments', href: '/dashboard#payments' },
        { name: 'Profile', href: '/dashboard#profile' },
        { name: 'Liquidity', href: '/liquidity'}
      ] 
    : navItems;

  return (
    <header className={`fixed top-0 left-0 right-0 border-b border-white/10 backdrop-blur-xl z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/70 py-3' : 'bg-black/50 py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Coins className="h-7 w-7 text-emerald-500 transition-all duration-300 group-hover:scale-110" />
              <div className="absolute -inset-1 bg-emerald-500/30 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s' }}></div>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-300">
              FLUX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {currentNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-zinc-400 hover:text-white transition-colors hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-500 after:origin-center after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                {item.name}
              </Link>
            ))}
            {pathname !== '/' && pathname.includes('/dashboard') && (
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    sessionStorage.removeItem("user");
                    window.location.href = "/";
                  }
                }}
                className="text-sm px-4 py-2 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                Logout
              </button>
            )}
            {pathname !== '/' && !pathname.includes('/dashboard') && <ConnectButton />}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white relative z-30"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6 text-emerald-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6 text-emerald-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav 
              className="md:hidden mt-4 flex flex-col space-y-4 pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentNavItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors block py-2 px-3 rounded-lg hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              {pathname !== '/' && pathname.includes('/dashboard') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: currentNavItems.length * 0.1 }}
                >
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        sessionStorage.removeItem("user");
                        window.location.href = "/auth/employee";
                      }
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-sm text-emerald-400 hover:text-emerald-300 transition-colors block py-2 px-3 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/10"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
              {pathname !== '/' && !pathname.includes('/dashboard') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: currentNavItems.length * 0.1 }}
                >
                  <div className="py-2">
                    <ConnectButton />
                  </div>
                </motion.div>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}