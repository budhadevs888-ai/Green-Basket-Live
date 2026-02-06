import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Minus, Plus, MapPin, Loader2 } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import api from '../../utils/api';

export default function CustomerHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gb_cart')) || []; } catch { return []; }
  });
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/customer/products').then(r => { setProducts(r.data.products || []); setLoading(false); }).catch(() => setLoading(false));
    api.get('/api/customer/profile').then(r => setProfile(r.data)).catch(() => {});
  }, []);

  useEffect(() => { localStorage.setItem('gb_cart', JSON.stringify(cart)); }, [cart]);

  const getQty = (id) => { const item = cart.find(c => c.product_id === id); return item ? item.quantity : 0; };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(c => c.product_id === product.id);
      if (existing) return prev.map(c => c.product_id === product.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { product_id: product.id, name: product.name, unit: product.unit, price: product.price, quantity: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) { setCart(prev => prev.filter(c => c.product_id !== id)); return; }
    setCart(prev => prev.map(c => c.product_id === id ? { ...c, quantity: qty } : c));
  };

  const filtered = products.filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  const cartTotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20" data-testid="customer-home-screen">
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{profile?.area || 'Location'}, {profile?.city || ''}</p><p className="text-xs text-gray-500">{profile?.pincode || ''}</p></div>
            </div>
          </div>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input data-testid="product-search-input" placeholder="Search for products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-gray-50" /></div>
        </div>
      </div>

      <div className="flex-1 p-4">
        {loading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div> : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center"><p className="text-gray-500">No products available</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map(product => {
              const qty = getQty(product.id);
              return (
                <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col" data-testid={`product-card-${product.id}`}>
                  <div className="relative aspect-square bg-green-50 flex items-center justify-center">
                    <div className="text-4xl">🥬</div>
                    {!product.available && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Badge className="bg-red-600 text-white text-xs">Out of Stock</Badge></div>}
                  </div>
                  <div className="p-3 flex-1 flex flex-col gap-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.unit}</p>
                    <p className="text-sm font-bold text-gray-900">₹{product.price}</p>
                    <div className="mt-auto pt-2">
                      {qty === 0 ? (
                        <Button onClick={() => addToCart(product)} disabled={!product.available} size="sm" className="w-full bg-green-600 hover:bg-green-700 h-8 text-xs" data-testid={`add-to-cart-${product.id}`}>Add</Button>
                      ) : (
                        <div className="flex items-center justify-between bg-green-600 rounded-md h-8">
                          <Button onClick={() => updateQty(product.id, qty - 1)} size="sm" variant="ghost" className="text-white hover:bg-green-700 hover:text-white h-8 w-8 p-0"><Minus className="w-3 h-3" /></Button>
                          <span className="text-white font-medium text-xs">{qty}</span>
                          <Button onClick={() => updateQty(product.id, qty + 1)} size="sm" variant="ghost" className="text-white hover:bg-green-700 hover:text-white h-8 w-8 p-0"><Plus className="w-3 h-3" /></Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {cartCount > 0 && (
        <div className="fixed bottom-16 left-0 right-0 px-4 z-30">
          <Button data-testid="view-cart-btn" onClick={() => navigate('/customer/cart')} className="w-full max-w-2xl mx-auto bg-green-600 hover:bg-green-700 shadow-lg h-14 text-base">
            <div className="flex items-center justify-between w-full"><div className="flex items-center gap-2"><ShoppingCart className="w-5 h-5" /><span>{cartCount} items</span></div><span>₹{cartTotal} →</span></div>
          </Button>
        </div>
      )}

      <div className="bg-white border-t p-3 fixed bottom-0 left-0 right-0 z-20">
        <div className="flex justify-around max-w-2xl mx-auto">
          <Button variant="ghost" className="flex-col h-auto gap-1 text-green-600"><ShoppingCart className="w-5 h-5" /><span className="text-xs">Home</span></Button>
          <Button variant="ghost" onClick={() => navigate('/customer/orders')} className="flex-col h-auto gap-1"><MapPin className="w-5 h-5" /><span className="text-xs">Orders</span></Button>
          <Button variant="ghost" onClick={() => navigate('/customer/profile')} className="flex-col h-auto gap-1"><MapPin className="w-5 h-5" /><span className="text-xs">Profile</span></Button>
        </div>
      </div>
    </div>
  );
}
