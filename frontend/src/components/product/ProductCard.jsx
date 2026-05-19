import { memo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import toast from 'react-hot-toast';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ProductCard = memo(({ product, inWishlist }) => {
  const { addToCart } = useCartStore();
  const { toggleWishlist } = useWishlistStore();
  
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  return (
    <motion.div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative block rounded-xl perspective-1000 cursor-none"
      data-cursor="view"
    >
      <Link to={`/product/${product._id}`} className="block relative h-full cursor-none">
        <motion.div 
          style={{ transform: "translateZ(30px)" }}
          className="relative aspect-[4/5] bg-surface-container overflow-hidden mb-4 rounded-xl shadow-2xl transition-all duration-500 ease-out border border-outline-variant/10 hover:border-primary/50"
        >
          {/* Animated Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay z-10"></div>
          
          <img 
            loading="lazy" 
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" 
            alt={product.name} 
            src={product.images[0]} 
          />
          
          <div className="absolute inset-0 bg-surface/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end z-20 backdrop-blur-[2px]">
            <motion.button 
              initial={{ y: "100%" }}
              animate={{ y: isHovered ? 0 : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={handleQuickAdd}
              disabled={product.totalStock <= 0}
              className="w-full py-5 bg-primary/90 backdrop-blur-md text-on-primary font-button-text text-button-text uppercase transition-colors duration-300 hover:bg-inverse-primary disabled:bg-surface-container-highest disabled:text-on-surface-variant disabled:cursor-not-allowed shadow-[0_0_20px_rgba(182,196,255,0.4)] hover:shadow-[0_0_30px_rgba(182,196,255,0.6)]"
            >
              {product.totalStock > 0 ? 'Quick Add' : 'OUT OF STOCK'}
            </motion.button>
          </div>
          {product.totalStock <= 0 ? (
            <div className="absolute top-4 left-4 bg-error/80 backdrop-blur-md text-on-error px-3 py-1 rounded-sm z-30">
              <span className="font-label-caps text-label-caps uppercase">Out of Stock</span>
            </div>
          ) : product.totalStock < 5 && (
            <div className="absolute top-4 left-4 bg-secondary/80 backdrop-blur-md text-on-secondary px-3 py-1 rounded-sm z-30">
              <span className="font-label-caps text-label-caps uppercase">Only {product.totalStock} Left</span>
            </div>
          )}
        </motion.div>
      </Link>
      <button 
        onClick={handleToggleWishlist} 
        style={{ transform: "translateZ(40px)" }}
        className="absolute top-4 right-4 z-30 text-on-surface-variant hover:text-primary transition-colors bg-surface-container-low/50 backdrop-blur-md p-2 rounded-full hover:shadow-[0_0_15px_rgba(182,196,255,0.3)] border border-outline-variant/20 hover:border-primary/50"
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <span className="material-symbols-outlined" style={inWishlist ? {fontVariationSettings: "'FILL' 1", color: '#b6c4ff'} : {}}>
          favorite
        </span>
      </button>
      <Link to={`/product/${product._id}`} className="flex justify-between items-start" style={{ transform: "translateZ(20px)" }}>
        <div>
          <h4 className="font-headline-md text-[18px] mb-1 group-hover:text-primary transition-colors duration-300 drop-shadow-md">{product.name}</h4>
          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-1 opacity-80">{product.description}</p>
        </div>
        <span className="font-button-text text-button-text bg-surface-container-low px-3 py-1 rounded-md border border-outline-variant/20">₹{product.price.toFixed(2)}</span>
      </Link>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
