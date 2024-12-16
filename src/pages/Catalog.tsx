import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
}

const availableCategories: Category[] = [
  { id: 5, name: 'Кальяны', slug: 'hookah-devices', parent_id: null },
  { id: 6, name: 'Табаки', slug: 'hookah-tobacco', parent_id: null },
  { id: 7, name: 'Аксессуары для кальяна', slug: 'hookah-accessories', parent_id: null },
  { id: 8, name: 'Бонги', slug: 'bong-devices', parent_id: null },
  { id: 9, name: 'Аксессуары для бонга', slug: 'bong-accessories', parent_id: null },
  { id: 10, name: 'Сигареты', slug: 'cigarettes', parent_id: null },
  { id: 11, name: 'Сигары', slug: 'cigars', parent_id: null },
  { id: 12, name: 'Сигариллы', slug: 'cigarillos', parent_id: null },
  { id: 13, name: 'Ручной табак', slug: 'hand-tobacco', parent_id: null },
  { id: 14, name: 'Все для табачки', slug: 'tobacco-accessories', parent_id: null },
  { id: 15, name: 'Аксессуары', slug: 'general-accessories', parent_id: null },
];

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categorySlug = searchParams.get('category');
  const subCategorySlug = searchParams.get('subcategory');
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    if (categorySlug) {
      const selectedCategory = availableCategories.find(c => c.slug === categorySlug);
      setCurrentCategory(selectedCategory || null);
      setSubCategories(availableCategories.filter(c => c.parent_id === selectedCategory?.id));
    }
  }, [categorySlug]);

  useEffect(() => {
    // Fetch products for the current category
    if (currentCategory) {
      fetch(`/api/categories/${currentCategory.id}/products`)
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
    } else {
      // Fetch all products if no category is selected
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
    }
  }, [currentCategory]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchParams({ search: query, category: categorySlug || '', subcategory: subCategorySlug || '', minPrice: minPrice.toString(), maxPrice: maxPrice.toString() });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategorySlug = e.target.value;
    const selectedCategory = availableCategories.find(c => c.slug === selectedCategorySlug) || null;
    setCurrentCategory(selectedCategory);
    setSearchParams({ search: searchQuery, category: selectedCategorySlug, subcategory: '', minPrice: minPrice.toString(), maxPrice: maxPrice.toString() });
    setSubCategories(availableCategories.filter(c => c.parent_id === selectedCategory?.id));
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubCategorySlug = e.target.value;
    setSearchParams({ search: searchQuery, category: categorySlug || '', subcategory: selectedSubCategorySlug, minPrice: minPrice.toString(), maxPrice: maxPrice.toString() });
  };

  const handlePriceChange = () => {
    setSearchParams({ search: searchQuery, category: categorySlug || '', subcategory: subCategorySlug || '', minPrice: minPrice.toString(), maxPrice: maxPrice.toString() });
  };

  const filteredProducts = products.filter((product) => {
    const isWithinPriceRange = product.price >= minPrice && product.price <= maxPrice;
    const matchesSearchQuery = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory = categorySlug ? product.category_slug === categorySlug : true;
    const matchesSubCategory = subCategorySlug ? product.subcategory_slug === subCategorySlug : true;

    return matchesSearchQuery && isWithinPriceRange && matchesCategory && matchesSubCategory;
  });

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold">
            {currentCategory
              ? `${currentCategory.name}`
              : 'Все товары'}
          </h1>
        </div>

        {/* Поле поиска */}
        <div className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Поиск по товарам..."
            className="w-full sm:w-96 p-3 border rounded-lg text-gray-700"
          />
        </div>

        {/* Фильтрация по категориям */}
        <div className="mb-8">
          <label htmlFor="category" className="block text-lg text-gray-700">Категория:</label>
          <select
            id="category"
            value={categorySlug || ''}
            onChange={handleCategoryChange}
            className="w-full sm:w-96 p-3 border rounded-lg text-gray-700 mt-2"
          >
            <option value="">Все категории</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Фильтрация по подкатегориям */}
        {subCategories.length > 0 && (
          <div className="mb-8">
            <label htmlFor="subcategory" className="block text-lg text-gray-700">Подкатегория:</label>
            <select
              id="subcategory"
              value={subCategorySlug || ''}
              onChange={handleSubCategoryChange}
              className="w-full sm:w-96 p-3 border rounded-lg text-gray-700 mt-2"
            >
              <option value="">Все подкатегории</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.slug}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Фильтрация по ценам */}
        <div className="mb-8">
          <label htmlFor="price-range" className="block text-lg text-gray-700">Ценовой диапазон:</label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-gray-600 mt-2">
            <span>{minPrice} ₸</span>
            <span>{maxPrice} ₸</span>
          </div>
          <button
            onClick={handlePriceChange}
            className="btn-gold mt-4 p-2 rounded-lg"
          >
            Применить фильтр
          </button>
        </div>

        {/* Вывод товаров */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Нет товаров для отображения</p>
          </div>
        )}
      </div>
    </div>
  );
}
