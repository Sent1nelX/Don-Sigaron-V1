import { Product, CartItem } from '../types';

// Mock data for products
const products: Product[] = [
  {
    id: 347,
    name: 'Кальян Калаш',
    description: 'Элитный кальян для вашего отдыха',
    price: 77000,
    image: 'https://example.com/kalyan-kalash.jpg',
    category: 'hookah',
    quantity: 4, // Количество товара
    inStock: 4 > 0, // Проверка наличия товара
  },
  {
    id: 976,
    name: 'Бонг Большой (Спираль)',
    description: 'Хрустальный бонг для любителей экстракций',
    price: 15000,
    image: 'https://example.com/bong-big-spiral.jpg',
    category: 'bong',
    quantity: 6, // Количество товара
    inStock: 6 > 0, // Проверка наличия товара
  },
  {
    id: 666,
    name: 'DAVIDOFF Mini Cigarillos',
    description: 'Мини-сигариллы для истинных гурманов',
    price: 16000,
    image: 'https://example.com/davidoff-mini-cigars.jpg',
    category: 'cigars',
    quantity: 5, // Количество товара
    inStock: 5 > 0, // Проверка наличия товара
  }
];

// Local Storage Keys
const CART_STORAGE_KEY = 'don_sigaron_cart';

// Product Methods
export const getProducts = (): Product[] => products;

export const getProductById = (id: number): Product | undefined => 
  products.find(product => product.id === id);

export const getProductsByCategory = (category: string): Product[] =>
  products.filter(product => product.category === category);

// Cart Methods
export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem(CART_STORAGE_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

// User Methods
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('user') !== null;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
