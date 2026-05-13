import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: '',
    sizes: 'S,M,L,XL',
    stock: 0,
    images: [''],
    description: ''
  });

  const fetchData = async () => {
    try {
      const [prodRes, ordRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders/admin')
      ]);
      setProducts(prodRes.data.products);
      setOrders(ordRes.data.orders || ordRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch system data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [userInfo, navigate]);

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    setUploading(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await api.post('/upload', uploadFormData, config);
      setFormData({ ...formData, images: [data.imageUrl] });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading(isEditing ? 'Updating item...' : 'Creating item...');
    try {
      const sizesArray = Array.isArray(formData.sizes) ? formData.sizes : formData.sizes.split(',').map(s => s.trim());
      
      if (isEditing) {
        await api.put(`/products/${editingId}`, { ...formData, sizes: sizesArray });
        toast.success('Product updated successfully', { id: loadToast });
      } else {
        await api.post('/products', { ...formData, sizes: sizesArray });
        toast.success('Product created successfully', { id: loadToast });
      }
      
      fetchData();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Operation failed', { id: loadToast });
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      sizes: product.sizes.join(','),
      stock: product.stock,
      images: product.images,
      description: product.description
    });
    setEditingId(product._id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
        toast.success('Product removed from archives');
      } catch (error) {
        console.error(error);
        toast.error('Delete failed');
      }
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      toast.success(`Order status: ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Status update failed');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: 0, category: '', sizes: 'S,M,L,XL', stock: 0, images: [''], description: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  if (loading) return <div className="pt-32 text-center min-h-screen font-label-caps animate-pulse">Initializing Admin Core...</div>;

  return (
    <main className="pt-[100px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
      <header className="mb-12 border-b border-outline-variant/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-label-caps text-primary tracking-[0.2em] uppercase block mb-2">SYSTEM ADMINISTRATION</span>
          <h1 className="font-display-xl text-headline-lg uppercase leading-none">COMMAND CENTER</h1>
        </div>
        <Link to="/dashboard" className="text-on-surface-variant hover:text-primary font-label-caps tracking-widest text-xs uppercase flex items-center gap-2 transition-colors border border-outline-variant/20 px-4 py-2">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> Dashboard
        </Link>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="flex lg:flex-col gap-2 sticky top-32 overflow-x-auto pb-4 lg:pb-0">
            <button onClick={() => { setActiveTab('products'); setSelectedOrder(null); }} className={`flex-grow lg:w-full text-left font-button-text text-button-text uppercase tracking-widest px-6 py-4 border-l-2 transition-all whitespace-nowrap ${activeTab === 'products' ? 'border-primary text-primary bg-primary-container/10' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}>
              INVENTORY
            </button>
            <button onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }} className={`flex-grow lg:w-full text-left font-button-text text-button-text uppercase tracking-widest px-6 py-4 border-l-2 transition-all whitespace-nowrap ${activeTab === 'orders' ? 'border-primary text-primary bg-primary-container/10' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}>
              ORDERS
            </button>
          </div>
        </aside>

        <section className="flex-grow min-w-0">
          {activeTab === 'products' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="bg-surface-container-low border border-outline-variant/10 p-8 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined text-[120px]">inventory_2</span>
                </div>
                <div className="flex justify-between items-center relative z-10">
                  <h2 className="font-headline-md text-headline-md uppercase tracking-tight">{isEditing ? `Edit Item: ${editingId.substring(0,8)}` : 'Initialize New Item'}</h2>
                  {isEditing && <button onClick={resetForm} className="text-error font-label-caps text-xs hover:underline">Cancel Edit</button>}
                </div>
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-label-caps text-[10px] text-on-surface-variant uppercase">Display Name</label>
                      <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface-container h-14 px-4 border border-outline-variant/10 focus:border-primary outline-none transition-colors" placeholder="e.g. CYBER-CORE JERSEY" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-caps text-[10px] text-on-surface-variant uppercase">Price (INR)</label>
                      <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-surface-container h-14 px-4 border border-outline-variant/10 focus:border-primary outline-none transition-colors" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-caps text-[10px] text-on-surface-variant uppercase">Classification</label>
                      <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-surface-container h-14 px-4 border border-outline-variant/10 focus:border-primary outline-none transition-colors" placeholder="e.g. PERFORMANCE" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-caps text-[10px] text-on-surface-variant uppercase">Stock Allocation</label>
                      <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full bg-surface-container h-14 px-4 border border-outline-variant/10 focus:border-primary outline-none transition-colors" placeholder="0" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-label-caps text-[10px] text-on-surface-variant uppercase">Available Sizes (Comma separated)</label>
                      <input required value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} className="w-full bg-surface-container h-14 px-4 border border-outline-variant/10 focus:border-primary outline-none transition-colors" placeholder="S, M, L, XL" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-[10px] text-on-surface-variant uppercase">System Description</label>
                    <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-surface-container p-4 border border-outline-variant/10 focus:border-primary outline-none transition-colors resize-none" placeholder="Enter technical specifications..."></textarea>
                  </div>
                  
                  <div className="p-6 border border-primary/20 bg-primary/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-label-caps text-xs text-primary uppercase tracking-widest">Aida Cloud Asset</h3>
                      {uploading && <div className="flex items-center gap-2 text-primary text-[10px] animate-pulse">SYSTEM UPLOADING...</div>}
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-24 bg-surface-container-highest border border-outline-variant/20 overflow-hidden flex-shrink-0">
                        {formData.images[0] ? <img src={formData.images[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20"><span className="material-symbols-outlined">image</span></div>}
                      </div>
                      <div className="flex-grow">
                        <input type="file" onChange={handleUploadImage} className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-label-caps file:bg-primary file:text-on-primary hover:file:opacity-90 transition-all cursor-pointer" />
                        <p className="mt-2 text-[10px] text-on-surface-variant uppercase opacity-50">Upload high-res PNG/JPG for system catalog</p>
                      </div>
                    </div>
                  </div>

                  <button disabled={uploading} type="submit" className="w-full py-5 bg-primary text-on-primary font-button-text uppercase tracking-[0.2em] hover:opacity-90 disabled:opacity-50 transition-all">
                    {isEditing ? 'COMMIT UPDATES' : 'INITIALIZE ITEM'}
                  </button>
                </form>
              </div>

              <div className="space-y-6">
                <h2 className="font-headline-md text-headline-md uppercase tracking-tight">System Inventory <span className="text-primary-fixed-dim opacity-50">({products.length})</span></h2>
                <div className="overflow-x-auto border border-outline-variant/10 bg-surface-container-lowest">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-surface-container-high font-label-caps text-label-caps uppercase border-b border-outline-variant/10">
                        <th className="p-5">Asset</th>
                        <th className="p-5">Classification</th>
                        <th className="p-5">Price</th>
                        <th className="p-5">Status</th>
                        <th className="p-5 text-right">Operation</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-md text-on-surface">
                      {products.map(product => (
                        <tr key={product._id} className="border-b border-outline-variant/5 hover:bg-surface-container-high/30 transition-colors group">
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-14 bg-surface-container-highest flex-shrink-0">
                                <img src={product.images[0]} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-bold uppercase tracking-tight">{product.name}</p>
                                <p className="text-[10px] text-on-surface-variant uppercase">ID: {product._id.substring(0,8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5"><span className="text-xs border border-outline-variant/20 px-2 py-0.5 font-label-caps opacity-60">{product.category}</span></td>
                          <td className="p-5 font-headline-md">₹{product.price.toFixed(2)}</td>
                          <td className="p-5">
                             {product.totalStock > 0 ? (
                               <span className="flex items-center gap-2 text-primary-fixed-dim text-xs font-label-caps"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> {product.totalStock} IN STOCK</span>
                             ) : (
                               <span className="flex items-center gap-2 text-error text-xs font-label-caps"><span className="w-1.5 h-1.5 bg-error rounded-full"></span> OUT OF STOCK</span>
                             )}
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEdit(product)} className="text-primary hover:underline text-[10px] font-label-caps uppercase">Edit</button>
                              <button onClick={() => handleDeleteProduct(product._id)} className="text-error hover:underline text-[10px] font-label-caps uppercase">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h2 className="font-headline-md text-headline-md uppercase tracking-tight">{selectedOrder ? 'Order Detail' : 'Active Orders'}</h2>
                {selectedOrder && (
                  <button onClick={() => setSelectedOrder(null)} className="font-label-caps text-xs text-on-surface-variant hover:text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">arrow_back</span> BACK TO LIST
                  </button>
                )}
              </div>
              
              {selectedOrder ? (
                <div className="bg-surface-container-low border border-outline-variant/10 overflow-hidden animate-in slide-in-from-right-4 duration-500">
                  <div className="p-8 border-b border-outline-variant/10 flex flex-col md:flex-row justify-between gap-6">
                    <div>
                      <p className="font-label-caps text-primary text-xs mb-1">AUDIT LOG #{selectedOrder._id}</p>
                      <h3 className="font-headline-md text-2xl uppercase">{selectedOrder.userId?.name || 'GUEST USER'}</h3>
                      <p className="text-on-surface-variant font-body-md uppercase text-xs mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <select 
                        value={selectedOrder.status} 
                        onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                        className="bg-primary text-on-primary font-label-caps text-xs p-3 outline-none uppercase border-none tracking-widest cursor-pointer"
                      >
                        <option value="pending">PENDING</option>
                        <option value="shipped">SHIPPED</option>
                        <option value="delivered">DELIVERED</option>
                        <option value="cancelled">CANCELLED</option>
                      </select>
                      <span className={`px-4 py-1 text-[10px] uppercase font-bold tracking-[0.2em] border ${selectedOrder.paymentStatus === 'paid' ? 'bg-success/10 text-success border-success/20' : 'bg-error/10 text-error border-error/20'}`}>
                        PAYMENT: {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 border-b border-outline-variant/10">
                    <div className="space-y-6">
                      <h4 className="font-label-caps text-on-surface-variant text-xs border-b border-outline-variant/10 pb-2">LOGISTICS TARGET</h4>
                      <div className="font-body-md text-on-surface space-y-1">
                        <p className="font-bold">{selectedOrder.address.firstName} {selectedOrder.address.lastName}</p>
                        <p>{selectedOrder.address.street}</p>
                        <p>{selectedOrder.address.city}, {selectedOrder.address.postalCode}</p>
                        <p className="pt-2">TEL: {selectedOrder.address.phone}</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="font-label-caps text-on-surface-variant text-xs border-b border-outline-variant/10 pb-2">FINANCIAL OVERVIEW</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-label-caps">
                          <span className="opacity-60">RAZORPAY ID</span>
                          <span>{selectedOrder.razorpayPaymentId}</span>
                        </div>
                        <div className="flex justify-between text-xs font-label-caps">
                          <span className="opacity-60">ORDER REF</span>
                          <span>{selectedOrder.razorpayOrderId}</span>
                        </div>
                        <div className="flex justify-between border-t border-outline-variant/10 pt-4 mt-4 font-headline-md text-xl">
                          <span>TOTAL</span>
                          <span className="text-primary">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 bg-surface-container">
                    <h4 className="font-label-caps text-on-surface-variant text-xs mb-6">MANIFEST ITEMS</h4>
                    <div className="space-y-4">
                      {selectedOrder.products.map((item, idx) => (
                        <div key={idx} className="flex gap-6 items-center p-4 bg-background border border-outline-variant/5">
                          <div className="w-16 h-20 bg-surface-container-highest flex-shrink-0">
                            <img src={item.product?.images?.[0] || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-bold text-on-surface uppercase tracking-tight">{item.product?.name || 'REDACTED ITEM'}</p>
                            <p className="text-[10px] text-on-surface-variant uppercase">SIZE: {item.size} • QUANTITY: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">₹{(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-[10px] opacity-40 uppercase">UNIT: ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto border border-outline-variant/10 bg-surface-container-lowest">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-surface-container-high font-label-caps text-label-caps uppercase border-b border-outline-variant/10">
                        <th className="p-5">Order ID</th>
                        <th className="p-5">Recipient</th>
                        <th className="p-5">Amount</th>
                        <th className="p-5">System Status</th>
                        <th className="p-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-md">
                      {orders.length === 0 ? (
                        <tr><td colSpan="5" className="p-12 text-center text-on-surface-variant opacity-50 font-label-caps">No active orders found</td></tr>
                      ) : orders.map(order => (
                        <tr key={order._id} onClick={() => setSelectedOrder(order)} className="border-b border-outline-variant/5 hover:bg-surface-container-high/30 transition-colors group cursor-pointer">
                          <td className="p-5 font-headline-md text-sm uppercase">#{order._id.substring(0,8)}</td>
                          <td className="p-5">
                            <p className="font-bold uppercase tracking-tight">{order.userId ? order.userId.name : 'GUEST'}</p>
                            <p className="text-[10px] text-on-surface-variant uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="p-5 font-headline-md text-primary">₹{order.totalAmount.toFixed(2)}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1 font-label-caps text-[10px] border ${order.status === 'delivered' ? 'border-success/30 text-success bg-success/5' : 'border-primary/30 text-primary bg-primary/5'}`}>
                              {order.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <span className={`px-2 py-0.5 text-[8px] uppercase font-bold tracking-wider ${order.paymentStatus === 'paid' ? 'bg-primary text-on-primary' : 'bg-error text-on-error'}`}>
                                {order.paymentStatus}
                              </span>
                              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">visibility</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
