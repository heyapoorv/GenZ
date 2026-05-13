import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const { product, isLoading, error, fetchProductDetails } = useProductStore();
  const { addToCart } = useCartStore();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const [size, setSize] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetails(id);
  }, [fetchProductDetails, id]);

  useEffect(() => {
    if (product && product.sizeStock && product.sizeStock.length > 0) {
      const firstAvailable = product.sizeStock.find(s => s.stock > 0);
      setSize(firstAvailable ? firstAvailable.size : product.sizeStock[0].size);
    }
  }, [product]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (error || !product) {
    return <div className="min-h-screen flex items-center justify-center text-error">{error || 'Product not found'}</div>;
  }

  const selectedSizeStock = product.sizeStock?.find(s => s.size === size)?.stock || 0;

  const handleAddToCart = () => {
    if (selectedSizeStock <= 0) {
      toast.error('Selected size is out of stock');
      return;
    }
    addToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      size
    });
    setIsAdded(true);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => navigate('/cart'), 1500);
  };

  return (
    <main className="pt-[120px] pb-section-gap min-h-screen">
      <Helmet>
        <title>{product.name} | Zenith Arcade</title>
        <meta name="description" content={product.description} />
      </Helmet>
      
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-gutter">
          {/* Image Gallery */}
          <div className="md:col-span-7 space-y-gutter">
            <div className="aspect-[4/5] bg-surface-container overflow-hidden group">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={product.name} src={product.images[0]} />
            </div>
          </div>
          
          {/* Sticky Sidebar */}
          <div className="md:col-span-5">
            <div className="sticky top-32 space-y-8">
              <div>
                <span className="font-label-caps text-label-caps text-primary tracking-widest block mb-2 uppercase">{product.category}</span>
                <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase mb-4 leading-none">{product.name}</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                  {product.description}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-headline-md text-headline-md text-on-surface">₹{product.price.toFixed(2)}</span>
                <div className="flex flex-col gap-1">
                  {selectedSizeStock <= 0 ? (
                    <span className="bg-error/10 text-error text-[10px] font-label-caps px-2 py-1 rounded uppercase w-fit">OUT OF STOCK IN {size}</span>
                  ) : selectedSizeStock < 5 ? (
                    <span className="bg-secondary/10 text-secondary text-[10px] font-label-caps px-2 py-1 rounded uppercase w-fit">ONLY {selectedSizeStock} LEFT</span>
                  ) : (
                    <span className="bg-primary/10 text-primary text-[10px] font-label-caps px-2 py-1 rounded w-fit uppercase">IN STOCK</span>
                  )}
                  {product.totalStock > 0 && product.totalStock < 5 && (
                     <span className="text-[10px] font-label text-on-surface-variant italic">Limited overall availability</span>
                  )}
                </div>
              </div>
              
              {/* Size Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-[0.2em] text-xs">SELECT ARCHIVE SIZE</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizeStock?.map(s => (
                    <button 
                      key={s.size}
                      disabled={s.stock <= 0}
                      onClick={() => setSize(s.size)}
                      className={`relative py-4 font-button-text text-button-text transition-all group overflow-hidden ${size === s.size ? 'bg-primary text-on-primary' : 'border border-outline-variant hover:border-primary text-on-surface disabled:opacity-30 disabled:grayscale disabled:hover:border-outline-variant'}`}
                    >
                      {s.size}
                      {s.stock <= 0 && <div className="absolute top-0 right-0 w-full h-full flex items-center justify-center rotate-45 pointer-events-none opacity-20">
                        <div className="w-full h-[1px] bg-on-surface"></div>
                      </div>}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* CTA */}
              <div className="space-y-3">
                <button 
                  disabled={selectedSizeStock <= 0}
                  onClick={handleAddToCart} 
                  className="w-full py-5 bg-primary text-on-primary font-button-text text-button-text uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-all group disabled:opacity-50 disabled:bg-surface-container-highest disabled:text-on-surface-variant"
                >
                  {selectedSizeStock <= 0 ? 'OUT OF STOCK' : (isAdded ? 'ADDED TO CART ✓' : 'ADD TO CART')}
                  {selectedSizeStock > 0 && !isAdded && <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                </button>
                <button onClick={() => toggleWishlist(product._id)} className="w-full py-5 border border-outline-variant text-on-surface font-button-text text-button-text uppercase flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all">
                  {wishlist.find(item => item._id === product._id) ? (
                    <><span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span> REMOVE FROM WISHLIST</>
                  ) : (
                    <><span className="material-symbols-outlined text-[18px]">favorite</span> SAVE TO WISHLIST</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
