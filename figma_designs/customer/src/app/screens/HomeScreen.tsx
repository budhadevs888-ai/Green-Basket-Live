import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, Wallet, Minus, Plus, MapPin } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { mockProducts, categories } from '../data/mockData';
import { Product } from '../context/AppContext';

export const HomeScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState('');
  const { location, cart, addToCart, updateQuantity, getCartTotal, walletBalance } = useApp();
  const navigate = useNavigate();

  const getProductQuantity = (productId: string) => {
    const item = cart.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = getCartTotal();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {location?.area}, {location?.city}
                </p>
                <p className="text-xs text-gray-500">{location?.pincode}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('/profile')}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">₹{walletBalance}</span>
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50"
            />
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="overflow-x-auto px-4 pb-3 hide-scrollbar">
          <div className="flex gap-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className="flex flex-col items-center gap-2 min-w-[70px]"
              >
                <div
                  className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${
                    selectedCategory === category.id
                      ? 'border-green-600 ring-2 ring-green-100'
                      : 'border-gray-200'
                  }`}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span
                  className={`text-xs text-center font-medium ${
                    selectedCategory === category.id ? 'text-green-600' : 'text-gray-700'
                  }`}
                >
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 p-4">
        {filteredProducts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">No products found</p>
          </Card>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={getProductQuantity(product.id)}
                onAdd={() => addToCart(product)}
                onUpdateQuantity={(qty) => updateQuantity(product.id, qty)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-4 z-30">
          <Button
            onClick={() => navigate('/cart')}
            className="w-full max-w-2xl mx-auto bg-green-600 hover:bg-green-700 shadow-lg h-14 text-base"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span>{cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>₹{cartTotal}</span>
                <span>→</span>
              </div>
            </div>
          </Button>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bg-white border-t p-3 fixed bottom-0 left-0 right-0 z-20">
        <div className="flex justify-around max-w-2xl mx-auto">
          <Button variant="ghost" className="flex-col h-auto gap-1 text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/categories')}
            className="flex-col h-auto gap-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className="text-xs">Categories</span>
          </Button>
          <Button variant="ghost" onClick={() => navigate('/orders')} className="flex-col h-auto gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-xs">Orders</span>
          </Button>
          <Button variant="ghost" onClick={() => navigate('/profile')} className="flex-col h-auto gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, quantity, onAdd, onUpdateQuantity }) => {
  return (
    <Card className="overflow-hidden flex flex-col border-gray-200">
      <div className="relative aspect-square bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-red-600 text-white text-xs">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-2 flex-1 flex flex-col gap-1">
        <h3 className="text-xs font-medium text-gray-900 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500">{product.unit}</p>
        <p className="text-sm font-bold text-gray-900">₹{product.price}</p>
        
        <div className="mt-auto">
          {quantity === 0 ? (
            <Button
              onClick={onAdd}
              disabled={!product.available}
              size="sm"
              className="w-full bg-green-600 hover:bg-green-700 h-7 text-xs"
            >
              Add
            </Button>
          ) : (
            <div className="flex items-center justify-between bg-green-600 rounded-md h-7">
              <Button
                onClick={() => onUpdateQuantity(quantity - 1)}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-green-700 hover:text-white h-7 w-7 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-white font-medium text-xs">{quantity}</span>
              <Button
                onClick={() => onUpdateQuantity(quantity + 1)}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-green-700 hover:text-white h-7 w-7 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
