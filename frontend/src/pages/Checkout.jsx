import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import api from '../api/client';

export default function Checkout() {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const subtotal = cart.products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST for India
  const total = (subtotal + tax).toFixed(2);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
      return;
    }
    
    // Check if script already exists
    if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [userInfo, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!window.Razorpay) {
      setErrorMessage('Razorpay SDK not loaded. Please check your connection.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Filter out invalid products and ensure IDs exist
      const validProducts = cart.products.filter(p => p.product);
      
      if (validProducts.length === 0) {
        setErrorMessage('Your cart is invalid or empty. Please re-add items.');
        setIsSubmitting(false);
        return;
      }

      // 1. Create Razorpay Order on backend
      const { data: order } = await api.post('/orders/create-razorpay-order', {
        products: validProducts.map(p => ({
          product: typeof p.product === 'object' ? p.product._id : p.product,
          quantity: p.quantity,
          size: p.size,
          price: p.price
        })),
        address: formData
      });

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_So0z0f8BsiEy3l',
        amount: order.amount,
        currency: order.currency,
        name: "ZENITH ARCADE",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const { data: createdOrder } = await api.post('/orders', {
              products: cart.products.map(p => ({
                product: typeof p.product === 'object' ? p.product._id : p.product,
                quantity: p.quantity,
                size: p.size,
                price: p.price
              })),
              address: formData,
              totalAmount: total,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });

            await clearCart();
            navigate(`/order-success?orderId=${createdOrder._id}`);
          } catch (err) {
            console.error(err);
            setErrorMessage('Payment successful but order creation failed. Please contact support.');
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: userInfo.email,
          contact: formData.phone
        },
        theme: {
          color: "#b6c4ff"
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setErrorMessage(response.error.description);
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-32 min-h-screen">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start pb-section-gap">
        {/* Left Side: Cart Items */}
        <section className="lg:col-span-7 space-y-8">
          <header className="flex items-center justify-between">
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase">CART <span className="text-primary-fixed-dim">({cart.products.length})</span></h1>
            <Link className="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant hover:text-on-surface transition-colors" to="/shop">CONTINUE SHOPPING</Link>
          </header>
          
          <div className="space-y-4">
            {cart.products.length === 0 ? (
              <p className="text-on-surface-variant">Your cart is empty.</p>
            ) : (
              cart.products.map((item, idx) => (
                <div key={`${item.product}-${item.size}-${idx}`} className="flex gap-6 p-4 bg-surface-container-low border border-outline-variant/10 rounded-lg group">
                  <div className="w-32 h-40 flex-shrink-0 bg-surface-container-highest overflow-hidden">
                    <img alt={item.name} className="w-full h-full object-cover" src={item.image || 'https://via.placeholder.com/150'} />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline-md text-headline-md tracking-tight">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.product, item.size)} className="text-on-surface-variant hover:text-error transition-colors">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-2">SIZE: {item.size}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-outline-variant/20 rounded">
                        <button onClick={() => updateQuantity(item.product, item.size, Math.max(1, item.quantity - 1))} className="px-3 py-1 hover:bg-surface-container-highest transition-colors">-</button>
                        <span className="px-4 font-label-caps">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product, item.size, item.quantity + 1)} className="px-3 py-1 hover:bg-surface-container-highest transition-colors">+</button>
                      </div>
                      <span className="font-headline-md text-headline-md">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-6 border border-primary-container/30 bg-primary-container/5 rounded-lg flex items-start gap-4">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            <div>
              <h4 className="font-label-caps text-label-caps text-primary">COMPLIMENTARY SHIPPING</h4>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Free express shipping across India. Estimated delivery: 2-4 business days.</p>
            </div>
          </div>
        </section>

        {/* Right Side: Checkout Form & Summary */}
        <section className="lg:col-span-5 sticky top-32">
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-surface-container-high border-b border-outline-variant/10">
              <div className="py-4 text-center border-b-2 border-outline-variant/20">
                <span className="font-label-caps text-label-caps text-on-surface-variant">SHIPPING</span>
              </div>
              <div className="py-4 text-center border-b-2 border-primary">
                <span className="font-label-caps text-label-caps text-primary">PAYMENT</span>
              </div>
              <div className="py-4 text-center border-b-2 border-outline-variant/20">
                <span className="font-label-caps text-label-caps text-on-surface-variant">REVIEW</span>
              </div>
            </div>
            
            <form onSubmit={handlePayment} className="p-8 space-y-8">
              {errorMessage && <div className="text-error bg-error/10 p-4 font-body-md border border-error/20">{errorMessage}</div>}
              
              <div className="space-y-6">
                <h2 className="font-headline-md text-headline-md uppercase tracking-tight">DELIVERY DETAILS</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">First Name</label>
                    <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-surface-container-highest border-outline-variant/10 focus:border-primary focus:ring-1 outline-none rounded-none text-on-surface h-12 px-4" placeholder="KYLE" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Last Name</label>
                    <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-surface-container-highest border-outline-variant/10 focus:border-primary focus:ring-1 outline-none rounded-none text-on-surface h-12 px-4" placeholder="CRANE" type="text" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Address</label>
                  <input required name="street" value={formData.street} onChange={handleInputChange} className="w-full bg-surface-container-highest border-outline-variant/10 focus:border-primary focus:ring-1 outline-none rounded-none text-on-surface h-12 px-4" placeholder="STREET ADDRESS, APARTMENT, SUITE" type="text" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">City</label>
                    <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-surface-container-highest border-outline-variant/10 focus:border-primary focus:ring-1 outline-none rounded-none text-on-surface h-12 px-4" placeholder="MUMBAI" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Postal Code</label>
                    <input required name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full bg-surface-container-highest border-outline-variant/10 focus:border-primary focus:ring-1 outline-none rounded-none text-on-surface h-12 px-4" placeholder="400001" type="text" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Phone Number</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-surface-container-highest border-outline-variant/10 focus:border-primary focus:ring-1 outline-none rounded-none text-on-surface h-12 px-4" placeholder="+91 98765 43210" type="tel" />
                </div>
              </div>

              <div className="pt-8 border-t border-outline-variant/10 space-y-4">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between font-body-md text-body-md">
                    <span className="text-on-surface-variant uppercase tracking-widest">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-body-md text-body-md">
                    <span className="text-on-surface-variant uppercase tracking-widest">GST (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-outline-variant/10">
                    <span className="font-headline-md text-headline-md">TOTAL</span>
                    <span className="font-headline-md text-headline-md">₹{total}</span>
                  </div>
                </div>

                <button disabled={isSubmitting || cart.products.length === 0} type="submit" className="w-full py-5 bg-primary text-on-primary font-button-text text-button-text uppercase tracking-[0.2em] hover:opacity-90 transition-colors duration-500 flex items-center justify-center gap-3 disabled:opacity-50">
                  {isSubmitting ? 'INITIATING...' : `PAY ₹${total}`}
                  {!isSubmitting && <span className="material-symbols-outlined text-[18px]">lock</span>}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
