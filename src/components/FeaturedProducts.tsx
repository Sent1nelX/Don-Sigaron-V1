import { useEffect, useState } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { getProducts } from '../lib/storage';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts.slice(0, 3)); // Show first 3 products
  }, []);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gold mb-12 text-center">Популярные товары</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
