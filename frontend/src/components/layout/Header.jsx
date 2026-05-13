import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import api from '../../api/client';

export default function Header() {
  const { userInfo } = useAuthStore();
  const { cart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickResults, setQuickResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef(null);

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

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 glass-nav border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-5 w-full max-w-container-max mx-auto">
        <div className="flex items-center gap-12">
          <Link className="font-headline-md text-headline-md text-on-surface tracking-tighter uppercase" to="/">
            ZENITH ARCADE
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link className="font-button-text text-button-text uppercase text-on-surface hover:text-primary transition-colors duration-300" to="/shop">SHOP ALL</Link>
            <Link className="font-button-text text-button-text uppercase text-on-surface hover:text-primary transition-colors duration-300" to="/shop?category=Anime">ANIME</Link>
            <Link className="font-button-text text-button-text uppercase text-on-surface hover:text-primary transition-colors duration-300" to="/shop?category=Gym">GYM</Link>
            <Link className="font-button-text text-button-text uppercase text-on-surface hover:text-primary transition-colors duration-300" to="/shop?category=Sports">SPORTS</Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative" ref={searchRef}>
            {searchOpen ? (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-surface-container-high rounded-full border border-outline-variant/30 shadow-lg pr-2">
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
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent animate-spin rounded-full mr-2"></div>
                  ) : searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} className="p-1 text-on-surface-variant hover:text-primary mr-1">
                      <span className="material-symbols-outlined text-[16px]">backspace</span>
                    </button>
                  )}
                  <button type="button" onClick={() => {setSearchOpen(false); setQuickResults([]); setSearchQuery('');}} className="p-2 text-on-surface-variant hover:text-error">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </form>
                
                {/* Quick Results Dropdown */}
                {hasSearched && !isSearching && (
                  <div className="absolute top-full mt-2 right-0 w-[300px] bg-surface-container-high border border-outline-variant/30 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="p-2 border-b border-outline-variant/10 bg-surface-container-highest">
                      <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">
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
                            className="flex items-center gap-4 p-3 hover:bg-primary/10 transition-colors group"
                          >
                            <div className="w-12 h-12 flex-shrink-0 bg-surface-container">
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-label-caps text-xs text-on-surface uppercase truncate">{product.name}</h4>
                              <p className="text-[10px] text-on-surface-variant">₹{product.price}</p>
                            </div>
                          </Link>
                        ))}
                        <button 
                          onClick={handleSearch}
                          className="w-full py-2 bg-primary/5 hover:bg-primary/10 text-primary font-label-caps text-[10px] uppercase tracking-widest transition-colors"
                        >
                          View All {quickResults.length}+ Matches
                        </button>
                      </>
                    ) : (
                      <div className="p-8 text-center">
                        <span className="material-symbols-outlined text-on-surface-variant/20 text-4xl mb-2">inventory_2</span>
                        <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">No items found in archive</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="scale-100 hover:text-primary active:scale-95 transition-all p-2 flex items-center">
                <span className="material-symbols-outlined text-[24px]">search</span>
              </button>
            )}
          </div>
          <Link className="scale-100 hover:text-primary active:scale-95 transition-all p-2 flex items-center relative" to={userInfo ? "/dashboard?tab=wishlist" : "/login"}>
            <span className="material-symbols-outlined text-[24px]">favorite</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-on-primary text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link className="scale-100 hover:text-primary active:scale-95 transition-all p-2 flex items-center relative" to="/cart">
            <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
            {cart.products.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cart.products.length}
              </span>
            )}
          </Link>
          <Link className="scale-100 hover:text-primary active:scale-95 transition-all p-2 flex items-center" to={userInfo ? "/dashboard" : "/login"}>
            <span className="material-symbols-outlined text-[24px]">person</span>
          </Link>
          <button className="md:hidden scale-100 hover:text-primary active:scale-95 transition-all p-2">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
