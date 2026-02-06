import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBasket, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  CircleDashed, 
  Ban,
  Wallet,
  History,
  User,
  Power,
  Navigation,
  ExternalLink,
  PackageCheck
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95",
      secondary: "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 active:scale-95",
      outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 active:scale-95",
      ghost: "text-emerald-600 hover:bg-emerald-50",
      danger: "bg-red-500 text-white hover:bg-red-600 active:scale-95",
    };
    return (
      <button
        ref={ref}
        className={cn(
          "w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

// --- Screens ---

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (phone.length < 10) return toast.error("Please enter a valid phone number");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      toast.success("OTP sent to your mobile");
    }, 1000);
  };

  const handleVerify = () => {
    if (otp.length < 4) return toast.error("Invalid OTP");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8 flex flex-col items-center"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBasket className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Green Basket</h1>
        <p className="text-gray-500 mt-2 font-medium">Delivery Partner Login</p>
      </motion.div>

      <div className="w-full max-w-sm space-y-4">
        {!otpSent ? (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input 
                type="tel" 
                placeholder="Enter 10 digit number" 
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-emerald-500 focus:outline-none transition-colors"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
            <Button onClick={handleSendOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </motion.div>
        ) : (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">OTP Sent to {phone}</label>
              <input 
                type="text" 
                placeholder="Enter 4 digit OTP" 
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-emerald-500 focus:outline-none transition-colors text-center text-2xl tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </div>
            <Button onClick={handleVerify} disabled={loading}>
              {loading ? "Verifying..." : "Verify & Login"}
            </Button>
            <button 
              onClick={() => setOtpSent(false)} 
              className="w-full text-sm text-emerald-600 font-semibold"
            >
              Change Phone Number
            </button>
          </motion.div>
        )}
      </div>
      
      <p className="mt-auto text-xs text-gray-400 text-center">
        By continuing, you agree to our Terms of Service
      </p>
    </div>
  );
};

const ApprovalStatusScreen = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Approval Status</h1>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <CircleDashed className="w-6 h-6 text-amber-600 animate-spin" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold mb-1">
              Pending Approval
            </span>
            <p className="text-sm font-medium text-gray-600">Your account is under review</p>
          </div>
        </div>

        <div className="space-y-4 border-t pt-4 border-gray-50">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Phone Number</label>
            <p className="text-gray-900 font-medium">+91 9876543210</p>
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Registered City</label>
            <p className="text-gray-900 font-medium">Mumbai, Maharashtra</p>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

const AvailabilityScreen = ({ isOnline, setIsOnline }: { isOnline: boolean, setIsOnline: (v: boolean) => void }) => {
  return (
    <div className="flex flex-col p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
        <p className="text-gray-500">Signal your readiness for orders</p>
      </header>

      <div className={cn(
        "rounded-3xl p-8 flex flex-col items-center justify-center gap-6 transition-all duration-500",
        isOnline ? "bg-emerald-50 border-2 border-emerald-100" : "bg-gray-100 border-2 border-gray-200"
      )}>
        <motion.div 
          animate={{ 
            scale: isOnline ? [1, 1.1, 1] : 1,
            rotate: isOnline ? [0, 5, -5, 0] : 0
          }}
          transition={{ repeat: isOnline ? Infinity : 0, duration: 3 }}
          className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-colors",
            isOnline ? "bg-emerald-600 text-white" : "bg-white text-gray-400"
          )}
        >
          <Power className="w-10 h-10" />
        </motion.div>

        <div className="text-center">
          <h2 className={cn("text-xl font-bold mb-2 transition-colors", isOnline ? "text-emerald-900" : "text-gray-900")}>
            {isOnline ? "You are available" : "You are offline"}
          </h2>
          <p className="text-sm text-gray-500 max-w-[200px]">
            {isOnline ? "Orders will be assigned shortly" : "Orders will not be assigned when offline"}
          </p>
        </div>

        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={cn(
            "w-20 h-10 rounded-full relative transition-colors duration-300 outline-none",
            isOnline ? "bg-emerald-600" : "bg-gray-400"
          )}
        >
          <motion.div 
            animate={{ x: isOnline ? 40 : 4 }}
            className="absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-md"
          />
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
        <CircleDashed className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <p className="text-sm text-blue-800 leading-relaxed font-medium">
          You can handle only one order at a time to ensure fast delivery.
        </p>
      </div>
    </div>
  );
};

const AssignedOrderScreen = ({ order, onStartPickup }: { order: any, onStartPickup: () => void }) => {
  return (
    <div className="flex flex-col min-h-full">
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Active Delivery</h1>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Assigned
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-24">
        {/* Order Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID: {order.id}</span>
            <span className="text-sm font-semibold text-emerald-600">{order.items.length} Items</span>
          </div>

          <div className="p-4 space-y-6">
            {/* Pickup */}
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
              </div>
              <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-100 border-l-2 border-dashed border-gray-200 h-12" />
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pickup from</h3>
                <p className="font-bold text-gray-900 leading-tight mb-2">{order.seller.name}</p>
                <p className="text-sm text-gray-500 mb-3">{order.seller.address}</p>
                <div className="flex gap-2">
                  <Button variant="secondary" className="w-auto py-2 text-xs flex-1">
                    <Navigation className="w-3 h-3" /> Map
                  </Button>
                  <Button variant="secondary" className="w-auto py-2 text-xs flex-1">
                    <Phone className="w-3 h-3" /> Call
                  </Button>
                </div>
              </div>
            </div>

            {/* Drop */}
            <div className="relative pl-8 pt-4">
              <div className="absolute left-0 top-4 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Deliver to</h3>
                <p className="font-bold text-gray-900 leading-tight mb-2">{order.customer.name}</p>
                <p className="text-sm text-gray-500 mb-3">{order.customer.address}</p>
                <div className="flex gap-2">
                  <Button variant="secondary" className="w-auto py-2 text-xs flex-1">
                    <Navigation className="w-3 h-3" /> Map
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-bold text-gray-900">x{item.qty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 p-6 bg-white/80 backdrop-blur-md">
        <Button onClick={onStartPickup}>
          Start Pickup
        </Button>
      </div>
    </div>
  );
};

const PickupConfirmScreen = ({ order, onConfirmPickup }: { order: any, onConfirmPickup: () => void }) => {
  return (
    <div className="flex flex-col p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Pickup Confirmed?</h1>
        <p className="text-gray-500">Confirm items received from seller</p>
      </header>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <ShoppingBasket className="text-orange-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{order.seller.name}</h2>
            <p className="text-sm text-gray-500">Order #{order.id}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 font-medium">Verify that all items are packed and sealed correctly.</p>
          <div className="bg-gray-50 p-4 rounded-xl">
            <ul className="space-y-2">
              {order.items.map((i: any, idx: number) => (
                <li key={idx} className="flex gap-2 items-center text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {i.name} (x{i.qty})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Button onClick={onConfirmPickup}>
          Proceed to Delivery
        </Button>
      </div>
    </div>
  );
};

const OtpVerificationScreen = ({ order, onVerify }: { order: any, onVerify: () => void }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (otp.length < 6) return toast.error("Please enter 6-digit delivery OTP");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerify();
    }, 1500);
  };

  return (
    <div className="flex flex-col p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Deliver Order</h1>
        <p className="text-gray-500">Hand over to customer & verify OTP</p>
      </header>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <User className="text-emerald-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{order.customer.name}</h2>
            <p className="text-sm text-gray-500">{order.customer.address}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 text-center uppercase tracking-widest">
            Enter Customer OTP
          </label>
          <input 
            type="text" 
            placeholder="0 0 0 0 0 0" 
            className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-emerald-500 focus:outline-none transition-colors text-center text-3xl tracking-[1em] font-bold"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
          <p className="mt-4 text-xs text-gray-400 text-center">
            Ask the customer for the 6-digit delivery code
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <Button onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Confirm Delivery"}
        </Button>
      </div>
    </div>
  );
};

const SuccessScreen = ({ onReset }: { onReset: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
      >
        <PackageCheck className="w-12 h-12 text-emerald-600" />
      </motion.div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Delivery Completed</h1>
      <p className="text-gray-500 mb-8 max-w-[240px]">
        Great job! Your earnings for this order have been credited.
      </p>

      <div className="w-full space-y-3 mb-8">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
          <span className="text-sm text-gray-500 font-medium">Order Earnings</span>
          <span className="text-lg font-bold text-emerald-600">₹45.00</span>
        </div>
      </div>

      <Button onClick={onReset}>
        Go Back to Availability
      </Button>
    </div>
  );
};

const EarningsScreen = () => {
  const earnings = [
    { id: '12845', date: 'Feb 06, 2026', amount: '₹45.00', status: 'Credited' },
    { id: '12844', date: 'Feb 06, 2026', amount: '₹42.00', status: 'Credited' },
    { id: '12841', date: 'Feb 05, 2026', amount: '₹55.00', status: 'Paid' },
    { id: '12839', date: 'Feb 05, 2026', amount: '₹38.00', status: 'Paid' },
  ];

  return (
    <div className="p-6 space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-600 p-4 rounded-2xl text-white">
          <Wallet className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-xs font-medium opacity-80 mb-1">Total Earned</p>
          <p className="text-xl font-bold">₹2,840</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <Clock className="w-6 h-6 mb-2 text-emerald-600" />
          <p className="text-xs text-gray-400 font-bold uppercase mb-1">Pending</p>
          <p className="text-xl font-bold text-gray-900">₹142</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Recent Transactions</h3>
          <span className="text-xs font-bold text-emerald-600">VIEW ALL</span>
        </div>
        <div className="divide-y divide-gray-50">
          {earnings.map((e) => (
            <div key={e.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-gray-900">Order #{e.id}</p>
                <p className="text-xs text-gray-400">{e.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600">{e.amount}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">{e.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HistoryScreen = () => {
  const history = [
    { id: '12845', date: 'Feb 06, 2026', amount: '₹45.00', status: 'Delivered', items: 3 },
    { id: '12844', date: 'Feb 06, 2026', amount: '₹42.00', status: 'Delivered', items: 5 },
    { id: '12841', date: 'Feb 05, 2026', amount: '₹55.00', status: 'Delivered', items: 2 },
    { id: '12839', date: 'Feb 05, 2026', amount: '₹38.00', status: 'Delivered', items: 4 },
  ];

  return (
    <div className="p-6 space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-gray-900">Delivery History</h1>
      <div className="space-y-4">
        {history.map((h) => (
          <div key={h.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
              <PackageCheck className="text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <p className="text-sm font-bold text-gray-900">Order #{h.id}</p>
                <span className="text-xs font-bold text-emerald-600">{h.amount}</span>
              </div>
              <p className="text-xs text-gray-400">{h.date} • {h.items} items</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfileScreen = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div className="p-6 space-y-8 pb-24">
      <header className="flex flex-col items-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4 ring-4 ring-emerald-50">
          <User className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Rahul Sharma</h2>
        <p className="text-sm text-gray-500 font-medium">+91 9876543210</p>
      </header>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500 font-medium">Registered City</span>
            <span className="text-sm font-bold text-gray-900">Mumbai</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500 font-medium">Approval Status</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">APPROVED</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500 font-medium">Last Active</span>
            <span className="text-sm font-bold text-gray-900">Today, 09:30 AM</span>
          </div>
        </div>
      </div>

      <Button variant="danger" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'approval' | 'dashboard'>('login');
  const [activeTab, setActiveTab] = useState<'orders' | 'earnings' | 'history' | 'profile'>('orders');
  const [isOnline, setIsOnline] = useState(false);
  const [deliveryStep, setDeliveryStep] = useState<'idle' | 'assigned' | 'pickup' | 'otp' | 'success'>('idle');
  
  // Mock Active Order
  const [activeOrder] = useState({
    id: 'GB-1029',
    seller: {
      name: 'Fresh Mart Supermarket',
      address: 'Shop 12, Crystal Plaza, Andheri West, Mumbai'
    },
    customer: {
      name: 'Anjali Gupta',
      address: 'A-402, Sea View Apartments, Versova, Mumbai'
    },
    items: [
      { name: 'Organic Bananas', qty: 1 },
      { name: 'Whole Wheat Bread', qty: 2 },
      { name: 'Full Cream Milk (1L)', qty: 1 }
    ]
  });

  // Simple routing logic
  useEffect(() => {
    if (isOnline && deliveryStep === 'idle') {
      // Simulate order assignment after 5 seconds of being online
      const timer = setTimeout(() => {
        setDeliveryStep('assigned');
        toast("New order assigned!", { 
          description: "Fresh Mart Supermarket",
          action: {
            label: "View",
            onClick: () => setActiveTab('orders')
          }
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, deliveryStep]);

  if (currentScreen === 'login') {
    return (
      <div className="bg-white min-h-screen text-gray-900 font-sans">
        <LoginScreen onLogin={() => setCurrentScreen('approval')} />
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  if (currentScreen === 'approval') {
    return (
      <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
        <ApprovalStatusScreen onLogout={() => setCurrentScreen('login')} />
        {/* For demo purposes, allow "bypassing" after 3 seconds or clicking somewhere */}
        <div className="fixed bottom-0 left-0 w-full p-4 flex justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button onClick={() => setCurrentScreen('dashboard')} className="text-[8px] text-gray-300">DEMO: SKIP APPROVAL</button>
        </div>
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans flex flex-col">
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div 
              key="orders" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              {!isOnline && deliveryStep === 'idle' ? (
                <AvailabilityScreen isOnline={isOnline} setIsOnline={setIsOnline} />
              ) : isOnline && deliveryStep === 'idle' ? (
                <AvailabilityScreen isOnline={isOnline} setIsOnline={setIsOnline} />
              ) : deliveryStep === 'assigned' ? (
                <AssignedOrderScreen order={activeOrder} onStartPickup={() => setDeliveryStep('pickup')} />
              ) : deliveryStep === 'pickup' ? (
                <PickupConfirmScreen order={activeOrder} onConfirmPickup={() => setDeliveryStep('otp')} />
              ) : deliveryStep === 'otp' ? (
                <OtpVerificationScreen order={activeOrder} onVerify={() => setDeliveryStep('success')} />
              ) : (
                <SuccessScreen onReset={() => {
                  setDeliveryStep('idle');
                  setIsOnline(false);
                }} />
              )}
            </motion.div>
          )}

          {activeTab === 'earnings' && (
            <motion.div 
              key="earnings" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
            >
              <EarningsScreen />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
            >
              <HistoryScreen />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
            >
              <ProfileScreen onLogout={() => setCurrentScreen('login')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
        <NavButton 
          active={activeTab === 'orders'} 
          onClick={() => setActiveTab('orders')} 
          icon={<ShoppingBasket size={24} />} 
          label="Orders" 
        />
        <NavButton 
          active={activeTab === 'earnings'} 
          onClick={() => setActiveTab('earnings')} 
          icon={<Wallet size={24} />} 
          label="Earnings" 
        />
        <NavButton 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
          icon={<History size={24} />} 
          label="History" 
        />
        <NavButton 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')} 
          icon={<User size={24} />} 
          label="Profile" 
        />
      </nav>

      <Toaster position="top-center" richColors />
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-colors relative",
        active ? "text-emerald-600" : "text-gray-400"
      )}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-pill"
          className="absolute -top-3 w-8 h-1 bg-emerald-600 rounded-full"
        />
      )}
    </button>
  );
}
