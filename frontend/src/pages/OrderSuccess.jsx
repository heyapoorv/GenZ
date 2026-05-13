import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = new URLSearchParams(location.search).get('orderId');

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  return (
    <main className="pt-32 min-h-screen flex items-center justify-center">
      <Helmet>
        <title>Transmission Confirmed | Zenith Arcade</title>
      </Helmet>
      
      <div className="max-w-2xl w-full px-margin-mobile md:px-margin-desktop py-12 text-center space-y-12">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-on-primary text-5xl">check_circle</span>
          </div>
          <div className="absolute -inset-4 border border-primary/20 rounded-full animate-ping"></div>
        </div>
        
        <div className="space-y-4">
          <span className="font-label-caps text-primary tracking-[0.4em] uppercase text-xs">Transmission Successful</span>
          <h1 className="font-display-xl text-headline-lg-mobile md:text-headline-lg uppercase leading-none">ORDER CONFIRMED</h1>
          <p className="font-body-lg text-on-surface-variant max-w-md mx-auto">
            Your technical gear is being prepared for deployment. 
            Transmission ID: <span className="text-primary font-bold">#{orderId?.substring(0, 8)}</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/dashboard?tab=orders" className="bg-surface-container border border-outline-variant/10 p-6 flex flex-col items-center gap-2 group hover:border-primary transition-all duration-300">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">inventory_2</span>
            <span className="font-label-caps text-xs uppercase tracking-widest">View History</span>
          </Link>
          <Link to="/shop" className="bg-primary text-on-primary p-6 flex flex-col items-center gap-2 group hover:opacity-90 transition-all duration-300">
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">shopping_bag</span>
            <span className="font-label-caps text-xs uppercase tracking-widest">Back to Shop</span>
          </Link>
        </div>
        
        <p className="text-[10px] font-label-caps text-on-surface-variant opacity-40 uppercase tracking-widest">
          A confirmation email has been dispatched to your registered address.
        </p>
      </div>
    </main>
  );
}
