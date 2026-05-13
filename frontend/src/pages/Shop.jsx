import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useProductStore } from '../store/productStore';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/product/ProductCard';

export default function Shop() {
  const navigate = useNavigate();
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const { wishlist } = useWishlistStore();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category');

  const [activeCategories, setActiveCategories] = useState(urlCategory ? [urlCategory] : []);
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedSizes, setSelectedSizes] = useState([]);

  useEffect(() => {
    // Sync with URL if it changes
    if (urlCategory && !activeCategories.includes(urlCategory)) {
      setActiveCategories([urlCategory]);
    }
  }, [urlCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(
        searchQuery, 
        activeCategories.join(','), 
        sort, 
        1, 
        priceRange.min, 
        priceRange.max, 
        selectedSizes.join(',')
      );
    }, 500); // Debounce for price inputs

    return () => clearTimeout(timer);
  }, [fetchProducts, searchQuery, activeCategories, sort, priceRange, selectedSizes]);

  const handleLoadMore = () => {
    fetchProducts(
      searchQuery, 
      activeCategories.join(','), 
      sort, 
      useProductStore.getState().page + 1,
      priceRange.min,
      priceRange.max,
      selectedSizes.join(',')
    );
  };

  const toggleCategory = (cat) => {
    const newCategories = activeCategories.includes(cat) 
      ? activeCategories.filter(c => c !== cat) 
      : [...activeCategories, cat];
    setActiveCategories(newCategories);
  };

  const toggleSize = (size) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(newSizes);
  };

  const clearFilters = () => {
    setActiveCategories([]);
    setPriceRange({ min: '', max: '' });
    setSelectedSizes([]);
    navigate('/shop');
  };

  const filteredProducts = products;

  return (
    <main className="pt-[120px] pb-section-gap min-h-screen">
      <Helmet>
        <title>{searchQuery ? `Search: ${searchQuery}` : 'Shop All Collections'} | Zenith Arcade</title>
        <meta name="description" content="Browse our entire collection of cyberpunk, high-performance streetwear." />
      </Helmet>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h1 className="font-display-xl text-headline-lg uppercase mb-4 tracking-tighter">
              {searchQuery ? `SEARCH: ${searchQuery}` : 'ALL PRODUCTS'}
            </h1>
            <p className="font-body-md text-on-surface-variant max-w-xl">
              {searchQuery ? `Showing results for "${searchQuery}"` : 'Browse our complete catalog of performance gear.'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Sort By</span>
            <div className="relative group">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="flex items-center gap-2 font-button-text text-button-text border border-outline-variant/30 px-4 py-2 bg-transparent hover:border-primary transition-colors outline-none cursor-pointer uppercase appearance-none"
                style={{ backgroundImage: 'none' }}
              >
                <option value="newest" className="bg-surface-container">Newest</option>
                <option value="price_asc" className="bg-surface-container">Price: Low to High</option>
                <option value="price_desc" className="bg-surface-container">Price: High to Low</option>
              </select>
              <span className="material-symbols-outlined text-[18px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-10">
              {/* Category Filter */}
              <div className="space-y-4">
                <h3 className="font-label-caps text-label-caps uppercase border-b border-outline-variant/20 pb-2">Category</h3>
                <ul className="space-y-2">
                  <li><button onClick={() => setActiveCategories([])} className={`font-body-md text-body-md flex items-center justify-between w-full transition-colors ${activeCategories.length === 0 ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>All Items</button></li>
                  {['Anime', 'Gym', 'Sports'].map(cat => (
                    <li key={cat}>
                      <button onClick={() => toggleCategory(cat)} className={`font-body-md text-body-md flex items-center justify-between w-full transition-colors ${activeCategories.includes(cat) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
                        {cat}
                        {activeCategories.includes(cat) && <span className="material-symbols-outlined text-sm">check</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-4">
                <h3 className="font-label-caps text-label-caps uppercase border-b border-outline-variant/20 pb-2">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full bg-surface-container-high border border-outline-variant/30 px-3 py-2 font-body-sm text-on-surface outline-none focus:border-primary transition-colors"
                  />
                  <span className="text-on-surface-variant">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full bg-surface-container-high border border-outline-variant/30 px-3 py-2 font-body-sm text-on-surface outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Size Filter */}
              <div className="space-y-4">
                <h3 className="font-label-caps text-label-caps uppercase border-b border-outline-variant/20 pb-2">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button 
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`py-2 border font-label-caps text-xs transition-all ${selectedSizes.includes(size) ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant/30 text-on-surface-variant hover:border-primary'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={clearFilters}
                className="w-full py-3 border border-error/30 text-error font-label-caps text-xs uppercase tracking-widest hover:bg-error/10 transition-all"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <section className="flex-grow">
            {isLoading && products.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-error bg-error/10 p-4 border border-error/20">{error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-gutter">
                  {filteredProducts.length > 0 ? filteredProducts.map(product => {
                    const inWishlist = wishlist.some(item => item._id === product._id);
                    return <ProductCard key={product._id} product={product} inWishlist={inWishlist} />;
                  }) : (
                    <div className="col-span-full py-24 text-center border border-outline-variant/10 bg-surface-container-low flex flex-col items-center gap-4">
                      <span className="material-symbols-outlined text-[48px] opacity-20">search_off</span>
                      <p className="font-headline-md text-on-surface uppercase tracking-tight">No Products Found</p>
                      <p className="font-body-md text-on-surface-variant max-w-xs mx-auto">Adjust your filters or search keywords to find the gear you're looking for.</p>
                      <button onClick={clearFilters} className="mt-4 text-primary font-label-caps text-xs hover:underline">Clear All Filters</button>
                    </div>
                  )}
                </div>

                {!isLoading && products.length > 0 && useProductStore.getState().page < useProductStore.getState().pages && (
                  <div className="mt-12 flex justify-center">
                    <button 
                      onClick={handleLoadMore}
                      className="px-8 py-3 border border-outline-variant text-on-surface hover:border-primary hover:text-primary transition-all font-button-text tracking-widest uppercase"
                    >
                      Load More Archives
                    </button>
                  </div>
                )}
                
                {isLoading && products.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
