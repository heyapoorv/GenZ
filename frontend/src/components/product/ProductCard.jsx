import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import toast from 'react-hot-toast';

const ProductCard = memo(({ product, inWishlist }) => {
  const { addToCart } = useCartStore();
  const { toggleWishlist } = useWishlistStore();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const availableSize = product.sizeStock.find(s => s.stock > 0)?.size || product.sizeStock[0]?.size || 'M';
    addToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      size: availableSize
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product._id);
  };

  return (
    <div className="group relative block">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative aspect-[4/5] bg-surface-container overflow-hidden mb-4">
          <img 
            loading="lazy" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            alt={product.name} 
            src={product.images[0]} 
          />
          <div className="absolute inset-0 bg-surface/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <button 
              onClick={handleQuickAdd}
              disabled={product.totalStock <= 0}
              className="w-full py-4 bg-primary text-on-primary font-button-text text-button-text uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-inverse-primary disabled:bg-surface-container-highest disabled:text-on-surface-variant disabled:cursor-not-allowed"
            >
              {product.totalStock > 0 ? 'Quick Add' : 'OUT OF STOCK'}
            </button>
          </div>
          {product.totalStock <= 0 ? (
            <div className="absolute top-4 left-4 bg-error text-on-error px-3 py-1">
              <span className="font-label-caps text-label-caps uppercase">Out of Stock</span>
            </div>
          ) : product.totalStock < 5 && (
            <div className="absolute top-4 left-4 bg-secondary text-on-secondary px-3 py-1">
              <span className="font-label-caps text-label-caps uppercase">Only {product.totalStock} Left</span>
            </div>
          )}
        </div>
      </Link>
      <button 
        onClick={handleToggleWishlist} 
        className="absolute top-4 right-4 z-10 text-on-surface-variant hover:text-primary transition-colors bg-surface-container-low/50 backdrop-blur-md p-2 rounded-full"
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <span className="material-symbols-outlined" style={inWishlist ? {fontVariationSettings: "'FILL' 1", color: '#b6c4ff'} : {}}>
          favorite
        </span>
      </button>
      <Link to={`/product/${product._id}`} className="flex justify-between items-start">
        <div>
          <h4 className="font-headline-md text-[18px] mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-1">{product.description}</p>
        </div>
        <span className="font-button-text text-button-text">₹{product.price.toFixed(2)}</span>
      </Link>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
