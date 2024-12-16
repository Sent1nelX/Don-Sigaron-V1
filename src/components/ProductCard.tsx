import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../lib/store';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

// Изображения по умолчанию для основных категорий
const categoryImages = {
  'hookahs': '/лев_кальяном.webp',
  'bongs': '/лев_бонгом.webp',
  'tobacco': '/лев_сигара.webp',
  'accessories': '/лев_акс.jpg',
  // Подкатегории наследуют изображения от родительских категорий
  'hookah-devices': '/лев_кальяном.webp',
  'hookah-tobacco': '/лев_кальяном.webp',
  'hookah-accessories': '/лев_кальяном.webp',
  'bong-devices': '/лев_бонгом.webp',
  'bong-accessories': '/лев_бонгом.webp',
  'cigarettes': '/лев_сигара.webp',
  'cigars': '/лев_сигара.webp',
  'cigarillos': '/лев_сигара.webp',
  'hand-tobacco': '/лев_сигара.webp',
  'tobacco-accessories': '/лев_сигара.webp',
  'general-accessories': '/лев_акс.jpg'
};

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Получаем изображение товара или изображение по умолчанию для его категории
  const productImage = product.image || categoryImages[product.category_slug as keyof typeof categoryImages];

  // Проверяем, есть ли товар в наличии
  const isInStock = product.quantity > 0;

  return (
    <div className="card hover-glow">
      <Link to={`/catalog/${product.id}`}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg mb-4">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-64 object-cover object-center transform transition-transform duration-500 hover:scale-105"
          />
        </div>
      </Link>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">{product.name}</h3>
        <p className="text-gray-400">{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gold">{product.price.toLocaleString()} ₸</span>
            <div className="text-sm text-gray-400 mt-1">
              {isInStock 
                ? `В наличии: ${product.quantity} шт.`
                : 'Нет в наличии'
              }
            </div>
          </div>
          <button
            onClick={() => addItem(product)}
            className={`btn-gold flex items-center space-x-2 ${!isInStock && 'opacity-50 cursor-not-allowed'}`}
            disabled={!isInStock}
          >
            <ShoppingCart size={20} />
            <span>{isInStock ? 'В корзину' : 'Нет в наличии'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
