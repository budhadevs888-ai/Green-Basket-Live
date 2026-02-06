import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  image: string;
  available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  house: string;
  area: string;
  city: string;
  pincode: string;
  lat?: number;
  lng?: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  address: Address;
  status: 'placed' | 'preparing' | 'out_for_delivery' | 'delivered';
  date: string;
  estimatedDelivery?: string;
  paymentMethod: 'cod' | 'upi' | 'card' | 'wallet';
  deliverySlot?: string;
}

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  phoneNumber: string | null;
  login: (phone: string) => void;
  logout: () => void;

  // Location
  hasLocation: boolean;
  location: Address | null;
  setLocation: (address: Address) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Orders
  orders: Order[];
  placeOrder: (address: Address, paymentMethod: 'cod' | 'upi' | 'card' | 'wallet', deliverySlot?: string) => string;
  getOrderById: (orderId: string) => Order | undefined;
  
  // Wallet
  walletBalance: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [location, setLocationState] = useState<Address | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [walletBalance, setWalletBalance] = useState(500);

  // Load from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem('greenBasket_auth');
    const storedLocation = localStorage.getItem('greenBasket_location');
    const storedCart = localStorage.getItem('greenBasket_cart');
    const storedOrders = localStorage.getItem('greenBasket_orders');
    const storedWallet = localStorage.getItem('greenBasket_wallet');

    if (storedAuth) {
      const auth = JSON.parse(storedAuth);
      setIsAuthenticated(auth.isAuthenticated);
      setPhoneNumber(auth.phoneNumber);
    }

    if (storedLocation) {
      setLocationState(JSON.parse(storedLocation));
    }

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }

    if (storedWallet) {
      setWalletBalance(JSON.parse(storedWallet));
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('greenBasket_auth', JSON.stringify({ isAuthenticated, phoneNumber }));
  }, [isAuthenticated, phoneNumber]);

  useEffect(() => {
    if (location) {
      localStorage.setItem('greenBasket_location', JSON.stringify(location));
    }
  }, [location]);

  useEffect(() => {
    localStorage.setItem('greenBasket_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('greenBasket_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('greenBasket_wallet', JSON.stringify(walletBalance));
  }, [walletBalance]);

  const login = (phone: string) => {
    setIsAuthenticated(true);
    setPhoneNumber(phone);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPhoneNumber(null);
    setLocationState(null);
    setCart([]);
    localStorage.clear();
  };

  const hasLocation = !!location;

  const setLocation = (address: Address) => {
    setLocationState(address);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const placeOrder = (address: Address, paymentMethod: 'cod' | 'upi' | 'card' | 'wallet', deliverySlot?: string): string => {
    const orderId = `ORD${Date.now()}`;
    const deliveryFee = getCartTotal() >= 500 ? 0 : 40;
    const total = getCartTotal() + deliveryFee;

    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      total,
      deliveryFee,
      address,
      status: 'placed',
      date: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      paymentMethod,
      deliverySlot,
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return orderId;
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        phoneNumber,
        login,
        logout,
        hasLocation,
        location,
        setLocation,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        orders,
        placeOrder,
        getOrderById,
        walletBalance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
