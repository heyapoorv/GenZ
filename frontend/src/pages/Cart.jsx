import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  const subtotal = cart.products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = (subtotal + tax).toFixed(2);

  return (
    <main className="pt-[120px] px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto py-section-gap min-h-screen">
      <h1 className="font-display-xl text-display-xl uppercase mb-8">YOUR CART ({cart.products.length})</h1>
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow flex flex-col gap-6">
          {cart.products.length === 0 ? (
            <div className="py-24 border border-outline-variant/10 text-center bg-surface-container-low flex flex-col items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">shopping_bag</span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md uppercase mb-2">Cart is Empty</h2>
                <p className="font-body-md text-on-surface-variant max-w-xs mx-auto">Your tactical loadout is currently unassigned. Explore our latest transmissions to gear up.</p>
              </div>
              <Link to="/shop" className="mt-4 px-12 py-4 bg-primary text-on-primary font-button-text uppercase tracking-widest hover:opacity-90 transition-all">DEPART TO SHOP</Link>
            </div>
          ) : (
            cart.products.map((item, idx) => (
              <div key={`${item.product}-${item.size}-${idx}`} className="flex gap-6 border-b border-outline-variant/20 pb-6 group">
                <div className="w-24 h-32 bg-surface-container overflow-hidden">
                  <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.name} src={item.image || 'https://via.placeholder.com/150'} />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-headline-md uppercase">{item.name}</h4>
                      <button onClick={() => removeFromCart(item.product, item.size)} className="text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                    <p className="font-body-md text-on-surface-variant">Size: {item.size}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-outline-variant rounded">
                      <button onClick={() => updateQuantity(item.product, item.size, Math.max(1, item.quantity - 1))} className="px-3 py-1 hover:bg-surface-container-highest transition-colors">-</button>
                      <span className="px-4 font-button-text">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product, item.size, item.quantity + 1)} className="px-3 py-1 hover:bg-surface-container-highest transition-colors">+</button>
                    </div>
                    <span className="font-headline-md text-primary">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cart.products.length > 0 && (
          <div className="w-full lg:w-96 bg-surface-container-high p-8 h-fit border border-outline-variant/10">
            <h3 className="font-headline-md uppercase mb-6 tracking-tight">ORDER SUMMARY</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between font-body-md text-on-surface-variant uppercase tracking-widest text-xs">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-body-md text-on-surface-variant uppercase tracking-widest text-xs">
                <span>GST (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-outline-variant/10">
                <span className="font-headline-md">TOTAL</span>
                <span className="font-headline-lg text-primary">₹{total}</span>
              </div>
            </div>
            <Link to="/checkout" className="w-full py-4 bg-primary text-on-primary font-button-text uppercase hover:bg-on-primary-container transition-all block text-center tracking-widest">
              PROCEED TO CHECKOUT
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
