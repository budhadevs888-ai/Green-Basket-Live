import { Product } from '../context/AppContext';

export const categories = [
  { 
    id: 'vegetables', 
    name: 'Vegetables', 
    image: 'https://images.unsplash.com/photo-1660295651445-5376c3760f0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGVzJTIwY2F0ZWdvcnklMjBiYXNrZXQlMjBncmVlbnxlbnwxfHx8fDE3NzAzOTU1OTR8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: 'fruits', 
    name: 'Fruits', 
    image: 'https://images.unsplash.com/photo-1605356989477-3a95636d95a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnVpdHMlMjBhcHBsZSUyMG9yYW5nZSUyMGJhc2tldHxlbnwxfHx8fDE3NzAzOTU1OTV8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: 'dairy', 
    name: 'Dairy', 
    image: 'https://images.unsplash.com/photo-1581868164904-77b124b80242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlyeSUyMG1pbGslMjBib3R0bGUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NzAzOTU1OTV8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: 'essentials', 
    name: 'Essentials', 
    image: 'https://images.unsplash.com/photo-1584093092919-3d551a9c5055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwZXNzZW50aWFscyUyMHBhbnRyeXxlbnwxfHx8fDE3NzAzOTU1OTV8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: 'masala', 
    name: 'Masala', 
    image: 'https://images.unsplash.com/photo-1547332226-395d746d139a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzcGljZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzAzOTU1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: 'spices', 
    name: 'Spices', 
    image: 'https://images.unsplash.com/photo-1547332226-395d746d139a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzcGljZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzAzOTU1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: 'others', 
    name: 'Others', 
    image: 'https://images.unsplash.com/photo-1584093092919-3d551a9c5055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwZXNzZW50aWFscyUyMHBhbnRyeXxlbnwxfHx8fDE3NzAzOTU1OTV8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
];

export const mockProducts: Product[] = [
  // Vegetables
  {
    id: 'veg-001',
    name: 'Tomato',
    category: 'vegetables',
    unit: '1kg',
    price: 40,
    image: 'https://images.unsplash.com/photo-1700064165267-8fa68ef07167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0b21hdG9lcyUyMGZyZXNofGVufDF8fHx8MTc3MDM2NzI1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    available: true,
  },
  {
    id: 'veg-002',
    name: 'Onion',
    category: 'vegetables',
    unit: '1kg',
    price: 35,
    image: 'https://images.unsplash.com/photo-1668295037389-292efc20dafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMG9uaW9ucyUyMGZyZXNofGVufDF8fHx8MTc3MDM5NTU5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    available: true,
  },
  {
    id: 'veg-003',
    name: 'Potato',
    category: 'vegetables',
    unit: '1kg',
    price: 30,
    image: 'https://images.unsplash.com/photo-1744659751904-3b2e5c095323?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3RhdG9lcyUyMGJyb3duJTIwZnJlc2h8ZW58MXx8fHwxNzcwMzk1NTk3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    available: true,
  },
  {
    id: 'veg-004',
    name: 'Carrot',
    category: 'vegetables',
    unit: '500g',
    price: 25,
    image: 'https://images.unsplash.com/photo-1617218607489-4d28d612bd07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJyb3RzJTIwb3JhbmdlJTIwZnJlc2h8ZW58MXx8fHwxNzcwMzk1NTk3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    available: true,
  },
  {
    id: 'veg-005',
    name: 'Cauliflower',
    category: 'vegetables',
    unit: '1 piece',
    price: 45,
    image: 'https://images.unsplash.com/photo-1613743983303-b3e89f8a2b80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXVsaWZsb3dlciUyMHdoaXRlJTIwZnJlc2h8ZW58MXx8fHwxNzcwMzk1NTk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    available: true,
  },
  {
    id: 'veg-006',
    name: 'Cabbage',
    category: 'vegetables',
    unit: '1 piece',
    price: 30,
    image: 'https://images.unsplash.com/photo-1587096677895-52478b441d9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGNhYmJhZ2UlMjBmcmVzaHxlbnwxfHx8fDE3NzAzOTU1OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    available: false,
  },

  // Fruits
  {
    id: 'fruit-001',
    name: 'Apple',
    category: 'fruits',
    unit: '1kg',
    price: 150,
    image: 'https://images.unsplash.com/photo-1623815242959-fb20354f9b8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZSUyMGZyZXNoJTIwZnJ1aXR8ZW58MXx8fHwxNzcwMzk1NTk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    available: true,
  },
  {
    id: 'fruit-002',
    name: 'Banana',
    category: 'fruits',
    unit: '1 dozen',
    price: 60,
    image: 'https://images.unsplash.com/photo-1711208224791-2cc390f53744?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBiYW5hbmFzJTIwYnVuY2h8ZW58MXx8fHwxNzcwMzY5MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    available: true,
  },
  {
    id: 'fruit-003',
    name: 'Orange',
    category: 'fruits',
    unit: '1kg',
    price: 80,
    image: 'https://images.unsplash.com/photo-1768909290022-81f4c82d8c40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG9yYW5nZXMlMjBjaXRydXN8ZW58MXx8fHwxNzcwMzE3NTM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    available: true,
  },
  {
    id: 'fruit-004',
    name: 'Mango',
    category: 'fruits',
    unit: '1kg',
    price: 120,
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400',
    available: true,
  },

  // Dairy
  {
    id: 'dairy-001',
    name: 'Milk',
    category: 'dairy',
    unit: '1L',
    price: 65,
    image: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxrJTIwYm90dGxlJTIwZ2xhc3N8ZW58MXx8fHwxNzcwMzgwNzkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    available: true,
  },
  {
    id: 'dairy-002',
    name: 'Curd',
    category: 'dairy',
    unit: '400g',
    price: 35,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400',
    available: true,
  },
  {
    id: 'dairy-003',
    name: 'Paneer',
    category: 'dairy',
    unit: '200g',
    price: 90,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    available: true,
  },
  {
    id: 'dairy-004',
    name: 'Butter',
    category: 'dairy',
    unit: '100g',
    price: 55,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400',
    available: true,
  },

  // Essentials
  {
    id: 'ess-001',
    name: 'Rice',
    category: 'essentials',
    unit: '5kg',
    price: 350,
    image: 'https://images.unsplash.com/photo-1743674452796-ad8d0cf38005?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2UlMjBncmFpbnN8ZW58MXx8fHwxNzcwMzYyNDEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    available: true,
  },
  {
    id: 'ess-002',
    name: 'Wheat Flour',
    category: 'essentials',
    unit: '5kg',
    price: 280,
    image: 'https://images.unsplash.com/photo-1628598872147-d2c1e5c79c13?w=400',
    available: true,
  },
  {
    id: 'ess-003',
    name: 'Sugar',
    category: 'essentials',
    unit: '1kg',
    price: 50,
    image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff56?w=400',
    available: true,
  },
  {
    id: 'ess-004',
    name: 'Cooking Oil',
    category: 'essentials',
    unit: '1L',
    price: 180,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    available: true,
  },

  // Masala & Spices
  {
    id: 'masala-001',
    name: 'Turmeric Powder',
    category: 'masala',
    unit: '100g',
    price: 45,
    image: 'https://images.unsplash.com/photo-1663071955544-bc8fb8c2e5f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzcGljZXMlMjBtYXNhbGF8ZW58MXx8fHwxNzcwMzk0ODI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    available: true,
  },
  {
    id: 'masala-002',
    name: 'Red Chilli Powder',
    category: 'masala',
    unit: '100g',
    price: 50,
    image: 'https://images.unsplash.com/photo-1599909533526-c12b03757e4c?w=400',
    available: true,
  },
  {
    id: 'spice-001',
    name: 'Cumin Seeds',
    category: 'spices',
    unit: '50g',
    price: 35,
    image: 'https://images.unsplash.com/photo-1596040033229-a0b8e863a4bf?w=400',
    available: true,
  },
  {
    id: 'spice-002',
    name: 'Coriander Powder',
    category: 'spices',
    unit: '100g',
    price: 40,
    image: 'https://images.unsplash.com/photo-1599909533526-c12b03757e4c?w=400',
    available: true,
  },

  // Others
  {
    id: 'other-001',
    name: 'Salt',
    category: 'others',
    unit: '1kg',
    price: 20,
    image: 'https://images.unsplash.com/photo-1598514982901-ae62764ae75e?w=400',
    available: true,
  },
  {
    id: 'other-002',
    name: 'Tea Leaves',
    category: 'others',
    unit: '250g',
    price: 150,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400',
    available: true,
  },
];