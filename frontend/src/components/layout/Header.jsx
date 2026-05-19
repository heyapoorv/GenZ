import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import api from '../../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from '../effects/Magnetic';

export default function Header() {
  const { userInfo } = useAuthStore();
  const { cart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickResults, setQuickResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        setHasSearched(true);
        try {
          const { data } = await api.get(`/products?keyword=${searchQuery}&limit=5`);
          setQuickResults(data.products || []);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setQuickResults([]);
        setHasSearched(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setQuickResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
      setQuickResults([]);
    }
  };

  const navLinks = [
    { name: 'SHOP ALL', path: '/shop' },
    { name: 'ANIME', path: '/shop?category=Anime' },
    { name: 'GYM', path: '/shop?category=Gym' },
    { name: 'SPORTS', path: '/shop?category=Sports' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-surface-container-highest/60 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3' : 'bg-transparent py-5'}`}>
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
        <div className="flex items-center gap-12">
          <Link className="font-headline-md text-headline-md text-on-surface tracking-tighter uppercase relative group cursor-none block" to="/" data-cursor="pointer">
            ZENITH ARCADE
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-500 group-hover:w-full"></span>
          </Link>
          <nav className="hidden md:flex gap-8 relative items-center">
            {navLinks.map((link) => {
              const isActive = location.pathname + location.search === link.path || (link.path === '/shop' && location.pathname === '/shop' && !location.search);
              return (
                <Link key={link.name} className="relative font-button-text text-button-text uppercase text-on-surface hover:text-primary transition-colors duration-300 group py-2 px-1 cursor-none block" to={link.path} data-cursor="pointer">
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(182,196,255,0.8)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {!isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative" ref={searchRef}>
            <AnimatePresence>
              {searchOpen ? (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "circOut" }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-surface-container-high/90 backdrop-blur-md rounded-full border border-outline-variant/30 shadow-[0_0_20px_rgba(0,0,0,0.3)] pr-2 overflow-hidden"
                >
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input 
                      autoFocus
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search archives..." 
                      className="bg-transparent border-none outline-none px-6 py-2 text-sm text-on-surface w-48 md:w-64 font-body-md" 
                    />
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent animate-spin rounded-full mr-2 shadow-[0_0_10px_rgba(182,196,255,0.5)]"></div>
                    ) : searchQuery && (
                      <button type="button" onClick={() => setSearchQuery('')} className="p-1 text-on-surface-variant hover:text-primary mr-1 transition-colors">
                        <span className="material-symbols-outlined text-[16px]">backspace</span>
                      </button>
                    )}
                    <button type="button" onClick={() => {setSearchOpen(false); setQuickResults([]); setSearchQuery('');}} className="p-2 text-on-surface-variant hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </form>
                  
                  {/* Quick Results Dropdown */}
                  <AnimatePresence>
                    {hasSearched && !isSearching && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-4 right-0 w-[320px] bg-surface-container-highest/95 backdrop-blur-xl border border-outline-variant/20 shadow-2xl overflow-hidden rounded-xl"
                      >
                        <div className="p-3 border-b border-outline-variant/10 bg-black/20">
                          <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest">
                            {quickResults.length > 0 ? 'Quick Results' : 'System Search'}
                          </span>
                        </div>
                        
                        {quickResults.length > 0 ? (
                          <>
                            {quickResults.map(product => (
                              <Link 
                                key={product._id} 
                                to={`/product/${product._id}`}
                                onClick={() => {setSearchOpen(false); setQuickResults([]); setSearchQuery('');}}
                                className="flex items-center gap-4 p-3 hover:bg-primary/10 transition-colors group border-b border-outline-variant/5 last:border-none"
                              >
                                <div className="w-12 h-12 flex-shrink-0 bg-surface-container rounded-sm overflow-hidden">
                                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-label-caps text-xs text-on-surface uppercase truncate group-hover:text-primary transition-colors">{product.name}</h4>
                                  <p className="text-[10px] text-on-surface-variant/70 mt-1">₹{product.price}</p>
                                </div>
                              </Link>
                            ))}
                            <button 
                              onClick={handleSearch}
                              className="w-full py-3 bg-primary/5 hover:bg-primary/15 text-primary font-label-caps text-[10px] uppercase tracking-widest transition-colors"
                            >
                              View All Matches <span className="material-symbols-outlined text-[12px] align-middle ml-1">arrow_forward</span>
                            </button>
                          </>
                        ) : (
                          <div className="p-8 text-center bg-black/10">
                            <span className="material-symbols-outlined text-primary/30 text-4xl mb-3 drop-shadow-[0_0_10px_rgba(182,196,255,0.2)]">inventory_2</span>
                            <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">No items found in archive</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchOpen(true)} 
                  className="scale-100 hover:text-primary active:scale-95 transition-all p-2 flex items-center hover:bg-surface-container/50 rounded-full"
                >
                  <span className="material-symbols-outlined text-[24px]">search</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <Link className="scale-100 hover:text-primary active:scale-95 transition-all p-2 flex items-center relative hover:bg-surface-container/50 rounded-full cursor-none" to={userInfo ? "/dashboard?tab=wishlist" : "/login"} data-cursor="pointer">
            <span className="material-symbols-outlined text-[24px]">favorite</span>
            {wishlist.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-secondary text-on-primary text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-[0_0_10px_rgba(200,198,197,0.5)]"
              >
                {wishlist.length}
              </motion.span>
            )}
          </Link>
          <Link className="scale-100 hover:text-primary active:scale-95 transition-all p-2 flex items-center relative hover:bg-surface-container/50 rounded-full cursor-none" to="/cart" data-cursor="pointer">
            <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
            {cart.products.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-[0_0_10px_rgba(182,196,255,0.5)]"
              >
                {cart.products.length}
              </motion.span>
            )}
          </Link>
          <Link className="scale-100 hover:text-primary active:scale-95 transition-all p-2 flex items-center hover:bg-surface-container/50 rounded-full cursor-none" to={userInfo ? "/dashboard" : "/login"} data-cursor="pointer">
            <span className="material-symbols-outlined text-[24px]">person</span>
          </Link>
          <button className="md:hidden scale-100 hover:text-primary active:scale-95 transition-all p-2 hover:bg-surface-container/50 rounded-full cursor-none" data-cursor="pointer">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
