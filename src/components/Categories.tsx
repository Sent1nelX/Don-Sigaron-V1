import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../lib/api';
import { Category } from '../types';

const categoryImages = {
  'hookahs': '/media/лев_кальяном.webp',
  'bongs': '/media/лев_бонгом.webp',
  'tobacco': '/media/лев_сигара.webp',
  'accessories': '/media/лев_акс.jpg',
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await api.getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Не удалось загрузить категории');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Фильтруем основные категории и подкатегории
  const mainCategories = categories.filter(cat => !cat.parent_id);
  const subCategories = selectedCategory 
    ? categories.filter(cat => cat.parent_id === selectedCategory.id)
    : [];

  if (loading) {
    return (
      <section className="py-16 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-48 mx-auto mb-8"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-24 w-24 bg-gray-700 rounded-full mx-auto"></div>
                    <div className="h-4 bg-gray-700 rounded w-20 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-gold hover:text-gold/80 transition"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gold mb-12 text-center">Категории</h2>
        
        {/* Main Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {mainCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(
                selectedCategory?.id === category.id ? null : category
              )}
              className={`flex flex-col items-center p-6 bg-black/50 rounded-lg border transition
                ${selectedCategory?.id === category.id 
                  ? 'border-gold' 
                  : 'border-gold/20 hover:border-gold/60'}`}
            >
              <img 
                src={categoryImages[category.slug as keyof typeof categoryImages]} 
                alt={category.name}
                className={`w-24 h-24 object-cover rounded-full mb-4 transition duration-300
                  ${selectedCategory?.id === category.id ? 'scale-110' : 'hover:scale-110'}`}
              />
              <span className="text-lg font-medium text-white">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Subcategories */}
        {selectedCategory && subCategories.length > 0 && (
          <div className="mt-8 animate-fade-in">
            <h3 className="text-2xl font-semibold text-gold mb-6">
              {selectedCategory.name}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subCategories.map((subCategory) => (
                <Link
                  key={subCategory.id}
                  to={`/catalog?category=${subCategory.slug}`}
                  className="p-4 bg-black/30 rounded-lg border border-gold/20 hover:border-gold transition-all hover:-translate-y-1"
                >
                  <span className="text-white hover:text-gold transition">
                    {subCategory.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}