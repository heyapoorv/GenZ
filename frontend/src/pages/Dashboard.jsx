import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { userInfo, logout } = useAuthStore();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'dashboard';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();
  const { wishlist, fetchWishlist, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    password: '',
    confirmPassword: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    fetchWishlist();
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, [fetchWishlist, userInfo, navigate]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (profileData.password !== profileData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setIsUpdating(true);
    try {
      const { data } = await api.put('/users/profile', {
        name: profileData.name,
        email: profileData.email,
        password: profileData.password
      });
      
      // Update local storage and state
      localStorage.setItem('userInfo', JSON.stringify(data));
      useAuthStore.setState({ userInfo: data });
      
      toast.success('Profile updated successfully');
      setProfileData({ ...profileData, password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMoveToCart = (item) => {
    addToCart({
      product: item._id,
      name: item.name,
      price: item.price,
      image: item.images[0],
      quantity: 1,
      size: item.sizes[0] || 'M'
    });
    toggleWishlist(item._id);
    toast.success('Moved to cart');
  };

  return (
    <main className="pt-32 min-h-screen">
      <Helmet>
        <title>Command Center | Zenith Arcade</title>
      </Helmet>
      
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
            <div className="mb-8">
              <h1 className="font-display-xl text-headline-md tracking-tighter text-primary uppercase">{userInfo?.name || 'USER'}</h1>
              <p className="font-body-md text-label-caps text-on-surface-variant mt-1 opacity-60 uppercase">{userInfo?.email}</p>
            </div>
            
            <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${activeTab === 'dashboard' ? 'text-primary font-bold bg-primary-container/10 border-l-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="font-body-md">Dashboard</span>
            </button>
            <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${activeTab === 'orders' ? 'text-primary font-bold bg-primary-container/10 border-l-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span className="font-body-md">Order History</span>
            </button>
            <button onClick={() => setActiveTab('wishlist')} className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${activeTab === 'wishlist' ? 'text-primary font-bold bg-primary-container/10 border-l-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined text-[20px]">favorite</span>
              <span className="font-body-md">Wishlist</span>
            </button>
            <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${activeTab === 'settings' ? 'text-primary font-bold bg-primary-container/10 border-l-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="font-body-md">Settings</span>
            </button>
            
            {userInfo?.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-3 px-4 py-3 mt-4 border border-primary/30 text-primary hover:bg-primary-container/10 transition-colors duration-200">
                <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                <span className="font-body-md font-bold uppercase tracking-widest text-xs">Admin Portal</span>
              </Link>
            )}
            
            <div className="mt-8 pt-8 border-t border-outline-variant/10">
              <button onClick={handleLogout} className="w-full bg-surface-container-lowest border border-error/30 p-4 flex items-center justify-center gap-4 text-error font-label-caps text-sm hover:bg-error hover:text-on-error transition-all duration-300">
                <span className="material-symbols-outlined">logout</span>
                LOG OUT
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-grow">
            
            {activeTab === 'dashboard' && (
              <>
                <section className="mb-12">
                  <div className="relative overflow-hidden group rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-surface-dim to-transparent z-10"></div>
                    <img alt="Background" className="w-full h-48 object-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDedanKv1ChDqqbXYwKKFAQqrBc5W1wK5o_zXnQaxOlJ5-Y8ZKg52uhw24FgWT4WxXiR-b7ALRlfb7I0czQzjWtxf4cR-KXw2N-_tqu2UIgqLks1-W3qn74S8ObkkTCebEkq0WnYRJJW8GdjxEulohjUlDIjZCW5vm1ZxsNub7LD0pkaEqTPcc7oFaANf5S0FStyfvLSI0Cul3xQoCUCgsCsJwr1vc3_vz04nukCAmPXEoa5ipMYvqycYGTgjU35zN7_DHEVcgAHc40" />
                    <div className="absolute inset-0 z-20 flex items-center px-8">
                      <div className="flex items-end gap-6">
                        <div className="relative">
                          <div className="w-24 h-24 border-2 border-primary p-1 rounded-full overflow-hidden bg-background flex items-center justify-center">
                            <span className="font-headline-lg text-[40px] text-primary">{userInfo?.name?.charAt(0) || 'U'}</span>
                          </div>
                          <div className="absolute bottom-0 right-0 bg-primary px-2 py-0.5 rounded-full text-[10px] font-label-caps text-on-primary">{userInfo?.role === 'admin' ? 'ADMIN' : 'USER'}</div>
                        </div>
                        <div className="mb-2">
                          <h2 className="font-display-xl text-headline-lg tracking-tight leading-none uppercase">{userInfo?.name || 'USER'}</h2>
                          <p className="font-label-caps text-primary mt-2 uppercase">{userInfo?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                  <div className="md:col-span-8 space-y-gutter">
                    <div className="flex justify-between items-end mb-4">
                      <h3 className="font-headline-md text-headline-md text-on-surface uppercase">RECENT ACTIVITY</h3>
                      <button onClick={() => setActiveTab('orders')} className="font-label-caps text-primary hover:underline">VIEW ALL ORDERS</button>
                    </div>
                    {orders.length === 0 ? (
                      <div className="bg-surface-container-low border border-outline-variant/10 p-12 text-center">
                        <p className="text-on-surface-variant font-body-md">No orders yet. Start shopping to see your history!</p>
                        <Link to="/shop" className="mt-4 inline-block text-primary font-label-caps border-b border-primary">Explore Products</Link>
                      </div>
                    ) : orders.slice(0, 2).map(order => (
                       <div key={order._id} onClick={() => { setSelectedOrder(order); setActiveTab('orders'); }} className="bg-surface-container border border-outline-variant/10 p-6 flex flex-col sm:flex-row gap-6 group hover:border-primary transition-colors duration-300 cursor-pointer">
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <span className="font-label-caps text-xs text-on-surface-variant">ORDER #{order._id.substring(0, 8)}</span>
                                <span className={`text-[10px] px-2 py-1 font-label-caps uppercase ${order.status === 'delivered' ? 'bg-success/20 text-success' : 'bg-primary-container/20 text-primary'}`}>{order.status}</span>
                              </div>
                              <h4 className="font-headline-md text-lg mt-2 uppercase">{order.products.length} Items</h4>
                            </div>
                            <div className="flex justify-between items-end mt-4 sm:mt-0">
                              <p className="font-display-xl text-headline-md">₹{order.totalAmount.toFixed(2)}</p>
                              <span className="text-[10px] text-on-surface-variant uppercase">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                       </div>
                    ))}
                  </div>

                  <div className="md:col-span-4 grid grid-cols-1 gap-4 h-fit">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2 uppercase">QUICK ACCESS</h3>
                    <button onClick={() => setActiveTab('orders')} className="bg-surface-container-high border border-outline-variant/10 p-5 flex items-center justify-between group hover:bg-primary transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary group-hover:text-on-primary">inventory_2</span>
                        <span className="font-label-caps text-sm group-hover:text-on-primary">MY ORDERS</span>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-primary">chevron_right</span>
                    </button>
                    <button onClick={() => setActiveTab('wishlist')} className="bg-surface-container-high border border-outline-variant/10 p-5 flex items-center justify-between group hover:bg-primary transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary group-hover:text-on-primary">favorite</span>
                        <span className="font-label-caps text-sm group-hover:text-on-primary">WISHLIST ({wishlist.length})</span>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-primary">chevron_right</span>
                    </button>
                    <button onClick={() => setActiveTab('settings')} className="bg-surface-container-high border border-outline-variant/10 p-5 flex items-center justify-between group hover:bg-primary transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary group-hover:text-on-primary">settings</span>
                        <span className="font-label-caps text-sm group-hover:text-on-primary">ACCOUNT SETTINGS</span>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-primary">chevron_right</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ORDER HISTORY TAB */}
            {activeTab === 'orders' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="mb-12 flex justify-between items-end">
                  <div>
                    <span className="font-label-caps text-label-caps text-primary uppercase mb-2 block">Order History</span>
                    <h2 className="font-display-xl text-headline-lg uppercase leading-none">Past Purchases</h2>
                  </div>
                  {selectedOrder && (
                    <button onClick={() => setSelectedOrder(null)} className="text-on-surface-variant hover:text-primary font-label-caps flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">arrow_back</span> BACK TO LIST
                    </button>
                  )}
                </section>

                {selectedOrder ? (
                  <div className="bg-surface-container-low border border-outline-variant/10 overflow-hidden">
                    <div className="p-8 border-b border-outline-variant/10 flex justify-between items-start">
                      <div>
                        <h3 className="font-headline-md text-headline-md uppercase">Order Details</h3>
                        <p className="text-on-surface-variant font-label-caps mt-1">ID: {selectedOrder._id}</p>
                      </div>
                      <span className={`px-4 py-2 font-label-caps text-sm uppercase ${selectedOrder.status === 'delivered' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div>
                        <h4 className="font-label-caps text-on-surface-variant mb-4 uppercase">Shipping Address</h4>
                        <p className="font-body-lg text-on-surface">{selectedOrder.address.firstName} {selectedOrder.address.lastName}</p>
                        <p className="font-body-md text-on-surface-variant mt-1">{selectedOrder.address.street}</p>
                        <p className="font-body-md text-on-surface-variant">{selectedOrder.address.city}, {selectedOrder.address.postalCode}</p>
                        <p className="font-body-md text-on-surface-variant mt-4">Phone: {selectedOrder.address.phone}</p>
                      </div>
                      <div>
                        <h4 className="font-label-caps text-on-surface-variant mb-4 uppercase">Payment Info</h4>
                        <div className="flex justify-between mb-2">
                          <span className="font-body-md text-on-surface-variant uppercase">Method</span>
                          <span className="font-body-md text-on-surface uppercase">Razorpay</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="font-body-md text-on-surface-variant uppercase">Transaction ID</span>
                          <span className="font-body-md text-on-surface text-xs">{selectedOrder.razorpayPaymentId}</span>
                        </div>
                        <div className="flex justify-between border-t border-outline-variant/10 pt-4 mt-4">
                          <span className="font-headline-md text-on-surface uppercase">Total Amount</span>
                          <span className="font-headline-md text-primary">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 bg-surface-container">
                      <h4 className="font-label-caps text-on-surface-variant mb-6 uppercase">Items Ordered</h4>
                      <div className="space-y-4">
                        {selectedOrder.products.map((item, idx) => (
                          <div key={idx} className="flex gap-6 items-center">
                            <div className="w-16 h-20 bg-surface-container-highest flex-shrink-0">
                              <img src={item.product?.images?.[0] || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                              <p className="font-bold text-on-surface">{item.product?.name || 'Product'}</p>
                              <p className="text-xs text-on-surface-variant uppercase">{item.size} • Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {orders.length === 0 ? <p className="text-on-surface-variant text-center py-12">No past orders found.</p> : orders.map(order => (
                      <div key={order._id} onClick={() => setSelectedOrder(order)} className="group border border-outline-variant/10 bg-surface-container-low hover:border-primary/50 transition-all duration-300 cursor-pointer">
                        <div className="flex flex-col md:flex-row items-stretch">
                          <div className="p-6 flex-1 flex flex-col md:flex-row justify-between gap-gutter">
                            <div className="flex flex-col justify-between">
                              <div>
                                <p className="font-label-caps text-[10px] text-outline-variant uppercase mb-1">Order Ref.</p>
                                <p className="font-headline-md text-on-surface">#{order._id.substring(0, 8)}</p>
                              </div>
                              <div className="mt-4">
                                <p className="font-label-caps text-[10px] text-outline-variant uppercase mb-1">Date</p>
                                <p className="font-body-md text-on-surface">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex flex-col justify-between">
                              <div>
                                <p className="font-label-caps text-[10px] text-outline-variant uppercase mb-1">Items</p>
                                <div className="flex -space-x-2">
                                  {order.products.map((p, i) => i < 3 && (
                                    <div key={p._id || i} className="w-10 h-10 border border-surface-container-highest overflow-hidden rounded-full">
                                      <img alt="Product" className="w-full h-full object-cover" src={p.product?.images?.[0] || 'https://via.placeholder.com/150'} />
                                    </div>
                                  ))}
                                  {order.products.length > 3 && (
                                    <div className="w-10 h-10 bg-surface-container-highest flex items-center justify-center rounded-full text-[10px] font-bold">+{order.products.length - 3}</div>
                                  )}
                                </div>
                              </div>
                              <div className="mt-4">
                                <p className="font-label-caps text-[10px] text-outline-variant uppercase mb-1">Total</p>
                                <p className="font-headline-md text-primary">₹{order.totalAmount.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="flex flex-col justify-between items-end">
                              <span className={`px-3 py-1 font-label-caps uppercase text-[10px] flex items-center gap-1 border ${order.status === 'delivered' ? 'bg-success/10 text-success border-success/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'delivered' ? 'bg-success' : 'bg-primary animate-pulse'}`}></span> {order.status}
                              </span>
                              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">arrow_forward</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="flex flex-col gap-4 mb-12">
                  <div className="flex items-end justify-between border-b border-outline-variant/10 pb-8">
                    <div>
                      <span className="font-label-caps text-label-caps text-primary uppercase tracking-[0.2em]">Saved Items</span>
                      <h2 className="font-display-xl text-headline-lg uppercase mt-2">Your Wishlist</h2>
                    </div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                      {wishlist.length} Items Saved
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                  {wishlist.length === 0 ? (
                    <div className="col-span-3 py-24 text-center bg-surface-container-low border border-outline-variant/10">
                       <span className="material-symbols-outlined text-6xl text-on-surface-variant opacity-20 mb-4">favorite</span>
                       <p className="text-on-surface-variant font-body-lg">Your wishlist is empty.</p>
                       <Link to="/shop" className="mt-6 inline-block bg-primary text-on-primary px-8 py-3 font-label-caps hover:opacity-90 transition-opacity">GO SHOPPING</Link>
                    </div>
                  ) : wishlist.map(item => (
                    <div key={item._id} className="flex flex-col group">
                      <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low border border-outline-variant/10 transition-all duration-300 hover:border-primary">
                        <img alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={item.images[0]} />
                        <button onClick={() => toggleWishlist(item._id)} className="absolute top-4 right-4 bg-background/80 p-2 rounded-full text-on-surface-variant hover:text-error transition-colors backdrop-blur-sm">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <button onClick={() => handleMoveToCart(item)} className="w-full bg-primary text-on-primary font-button-text text-button-text py-4 uppercase hover:bg-primary-container transition-colors shadow-2xl">Add to Cart</button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-headline-md text-lg truncate uppercase">{item.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="font-label-caps text-xs text-on-surface-variant uppercase">{item.category}</span>
                          <span className="font-display-xl text-lg text-primary">₹{item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                <section className="mb-12">
                  <span className="font-label-caps text-label-caps text-primary uppercase mb-2 block">Account Settings</span>
                  <h2 className="font-display-xl text-headline-lg uppercase leading-none">Profile Security</h2>
                </section>

                <form onSubmit={handleProfileUpdate} className="space-y-8 bg-surface-container-low border border-outline-variant/10 p-8 rounded-lg">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="font-label-caps text-xs text-on-surface-variant uppercase">Full Name</label>
                      <input 
                        type="text" 
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full bg-surface-container-high border-none focus:ring-1 focus:ring-primary outline-none p-4 text-on-surface font-body-md" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-caps text-xs text-on-surface-variant uppercase">Email Address</label>
                      <input 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full bg-surface-container-high border-none focus:ring-1 focus:ring-primary outline-none p-4 text-on-surface font-body-md" 
                        required
                      />
                    </div>
                    <div className="pt-4 border-t border-outline-variant/10">
                      <h3 className="font-label-caps text-on-surface-variant mb-6 text-xs">CHANGE PASSWORD (LEAVE BLANK TO KEEP CURRENT)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="font-label-caps text-[10px] text-on-surface-variant uppercase">New Password</label>
                          <input 
                            type="password" 
                            value={profileData.password}
                            onChange={(e) => setProfileData({...profileData, password: e.target.value})}
                            className="w-full bg-surface-container-high border-none focus:ring-1 focus:ring-primary outline-none p-4 text-on-surface font-body-md" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-label-caps text-[10px] text-on-surface-variant uppercase">Confirm New Password</label>
                          <input 
                            type="password" 
                            value={profileData.confirmPassword}
                            onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                            className="w-full bg-surface-container-high border-none focus:ring-1 focus:ring-primary outline-none p-4 text-on-surface font-body-md" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={isUpdating}
                    type="submit" 
                    className="w-full bg-primary text-on-primary font-button-text py-5 uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {isUpdating ? 'UPDATING...' : 'SAVE CHANGES'}
                  </button>
                </form>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </main>
  );
}
