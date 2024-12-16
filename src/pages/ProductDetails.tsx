import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types';
import { getProductById } from '../lib/storage';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../lib/store';

// Изображения по умолчанию для категорий
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

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const productData = await getProductById(parseInt(id));
          if (productData) {
            setProduct(productData);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <p className="text-gray-400">Товар не найден</p>
      </div>
    );
  }

  // Получаем изображение товара или изображение по умолчанию для его категории
  const productImage = product.image || categoryImages[product.category_slug as keyof typeof categoryImages];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-[#ffd700]">{product.name}</h1>
              <p className="text-gray-300 text-lg">{product.description}</p>

              <div className="text-3xl font-bold text-[#ffd700]">
                {product.price.toLocaleString()} ₸
              </div>

              <div className="text-gray-300">
                {product.quantity > 0 
                  ? `В наличии: ${product.quantity} шт.`
                  : 'Нет в наличии'
                }
              </div>

              <button
                onClick={() => addItem(product)}
                className={`w-full btn-gold flex items-center justify-center space-x-2 ${
                  !product.in_stock && 'opacity-50 cursor-not-allowed'
                }`}
                disabled={!product.in_stock}
              >
                <ShoppingCart size={24} />
                <span className="text-lg font-semibold">
                  {product.in_stock ? 'Добавить в корзину' : 'Нет в наличии'}
                </span>
              </button>

              <div className="border-t border-[#ffd700]/20 pt-6 mt-6">
                <h3 className="text-xl font-semibold text-white mb-4">Характеристики</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• Премиальное качество</li>
                  <li>• Эксклюзивный дизайн</li>
                  <li>• Ручная работа</li>
                  <li>• Гарантия подлинности</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}