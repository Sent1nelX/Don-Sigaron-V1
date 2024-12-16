import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, ShoppingBag, Search } from 'lucide-react';
import { useAuthStore } from '../lib/auth';
import * as api from '../lib/api';
import { Product, Category } from '../types';
import CategorySelect from '../components/CategorySelect';
import ImageUpload from '../components/ImageUpload';

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> & { id?: number }>({
    name: '',
    description: '',
    price: 0,
    category_id: 0,
    quantity: 0,
    image: null,
  });

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [productsData, categoriesData, usersData, ordersData] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getUsers(),
          api.getOrders(),
        ]);
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
        setUsers(usersData);
        setFilteredUsers(usersData);
        setOrders(ordersData);
        setFilteredOrders(ordersData);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    switch (activeTab) {
      case 'products':
        setFilteredProducts(
          products.filter(
            (p) =>
              p.name.toLowerCase().includes(query.toLowerCase()) ||
              p.description.toLowerCase().includes(query.toLowerCase())
          )
        );
        break;
      case 'users':
        setFilteredUsers(
          users.filter((u) =>
            `${u.first_name} ${u.last_name}`.toLowerCase().includes(query.toLowerCase())
          )
        );
        break;
      case 'orders':
        setFilteredOrders(
          orders.filter(
            (o) =>
              o.id.toString().includes(query) ||
              o.status.toLowerCase().includes(query.toLowerCase())
          )
        );
        break;
      default:
        break;
    }
  };

  const renderSearchBar = () => (
    <div className="mb-4">
      <label htmlFor="search" className="block text-sm font-medium text-gray-400">
        Поиск
      </label>
      <div className="flex items-center gap-2 mt-2">
        <Search className="text-gray-500" />
        <input
          type="text"
          id="search"
          placeholder={
            activeTab === 'products'
              ? 'Введите название или описание товара'
              : activeTab === 'users'
              ? 'Введите имя или фамилию пользователя'
              : 'Введите ID заказа или статус'
          }
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();

      // Проверяем и добавляем все обязательные поля
      if (!editingProduct.name?.trim()) throw new Error('Введите название товара');
      if (!editingProduct.description?.trim()) throw new Error('Введите описание товара');
      if (!editingProduct.price || editingProduct.price <= 0) throw new Error('Введите корректную цену');
      if (!editingProduct.category_id) throw new Error('Выберите категорию');
      if (editingProduct.quantity === undefined || editingProduct.quantity < 0) {
        throw new Error('Укажите количество товара');
      }

      // Добавляем поля в FormData
      formData.append('name', editingProduct.name.trim());
      formData.append('description', editingProduct.description.trim());
      formData.append('price', editingProduct.price.toString());
      formData.append('category_id', editingProduct.category_id.toString());
      formData.append('quantity', editingProduct.quantity.toString());

      // Обрабатываем изображение
      if (editingProduct.image) {
        if (typeof editingProduct.image === 'string' && editingProduct.image.startsWith('data:image')) {
          const response = await fetch(editingProduct.image);
          const blob = await response.blob();
          formData.append('image', blob, 'product-image.jpg');
        } else if (editingProduct.image instanceof File) {
          formData.append('image', editingProduct.image);
        }
      }

      if (editingProduct.id) {
        await api.updateProduct(editingProduct.id, formData);
      } else {
        await api.createProduct(formData);
      }

      const updatedProducts = await api.getProducts();
      setProducts(updatedProducts);
      setFilteredProducts(
        updatedProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setEditingProduct({
        name: '',
        description: '',
        price: 0,
        category_id: 0,
        quantity: 0,
        image: null,
      });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при сохранении товара');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return;
    try {
      await api.deleteProduct(id);
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);
      setFilteredProducts(
        updatedProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при удалении товара');
    }
  };

  const handleUpdateUserStatus = async (id: number, isBlocked: boolean) => {
    try {
      await api.updateUserStatus(id, isBlocked);
      const updatedUsers = users.map((u) =>
        u.id === id ? { ...u, is_blocked: isBlocked } : u
      );
      setUsers(updatedUsers);
      setFilteredUsers(
        updatedUsers.filter((u) =>
          `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении статуса пользователя');
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      await api.updateOrderStatus(id, status);
      const updatedOrders = orders.map((o) =>
        o.id === id ? { ...o, status } : o
      );
      setOrders(updatedOrders);
      setFilteredOrders(
        updatedOrders.filter(
          (o) =>
            o.id.toString().includes(searchQuery) ||
            o.status.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении статуса заказа');
    }
  };

  const renderProductsTab = () => (
    <div className="admin-card">
      <h2 className="text-2xl font-semibold text-white mb-6">Управление товарами</h2>
      {renderSearchBar()}

      {/* Форма добавления/редактирования товара */}
      <form onSubmit={handleProductSubmit} className="admin-form-group mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Название</label>
            <input
              type="text"
              value={editingProduct.name || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Категория</label>
            <CategorySelect
              categories={categories}
              value={editingProduct.category_id || 0}
              onChange={(value) => setEditingProduct({ ...editingProduct, category_id: value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Цена (₸)</label>
            <input
              type="number"
              value={editingProduct.price || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Количество</label>
            <input
              type="number"
              value={editingProduct.quantity || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, quantity: Number(e.target.value) })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400">Описание</label>
            <textarea
              value={editingProduct.description || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Изображение</label>
            <ImageUpload
              currentImage={editingProduct.image}
              onImageChange={(image) => setEditingProduct({ ...editingProduct, image })}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md mt-4">
            {error}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() =>
              setEditingProduct({
                name: '',
                description: '',
                price: 0,
                category_id: 0,
                quantity: 0,
                image: null,
              })
            }
            className="px-4 py-2 border border-[#ffd700] text-[#ffd700] rounded-md hover:bg-[#ffd700]/20 transition"
            disabled={loading}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#ffd700] text-black rounded-md hover:bg-[#ffd700]/80 transition"
            disabled={loading}
          >
            {loading ? 'Сохранение...' : editingProduct.id ? 'Сохранить' : 'Добавить'}
          </button>
        </div>
      </form>

      {/* Список товаров */}
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-black/30 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={product.image || `/media/лев_${product.category_slug}.webp`}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-white">{product.name}</h3>
                <p className="text-gray-400">{product.description}</p>
                <p className="text-[#ffd700]">{product.price.toLocaleString()} ₸</p>
                <p className="text-gray-400">Количество: {product.quantity}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="px-3 py-1 rounded-md bg-[#ffd700] text-black hover:bg-[#ffd700]/80 transition"
                >
                  Изменить
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <p className="text-gray-400">Товары не найдены.</p>
        )}
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="admin-card">
      <h2 className="text-2xl font-semibold text-white mb-6">Управление пользователями</h2>
      {renderSearchBar()}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-black/30 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-white">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-gray-400">{user.phone}</p>
              </div>
              <button
                onClick={() => handleUpdateUserStatus(user.id, !user.is_blocked)}
                className={`px-3 py-1 rounded-md ${
                  user.is_blocked ? 'bg-red-500' : 'bg-green-500'
                } text-white hover:opacity-80 transition`}
              >
                {user.is_blocked ? 'Разблокировать' : 'Заблокировать'}
              </button>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <p className="text-gray-400">Пользователи не найдены.</p>
        )}
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="admin-card">
      <h2 className="text-2xl font-semibold text-white mb-6">Управление заказами</h2>
      {renderSearchBar()}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-black/30 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-medium text-white">
                    Заказ #{order.id} от {new Date(order.created_at).toLocaleDateString()}
                  </h3>
                  <p className="text-gray-400">
                    {order.first_name} {order.last_name} ({order.email})
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                  className="rounded-md bg-black/50 border-[#ffd700]/20 text-white"
                >
                  <option value="pending">В обработке</option>
                  <option value="confirmed">Подтвержден</option>
                  <option value="shipped">Отправлен</option>
                  <option value="delivered">Доставлен</option>
                  <option value="cancelled">Отменен</option>
                </select>
              </div>
              <div className="space-y-2">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-gray-300">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString()} ₸</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#ffd700]/20">
                  <div className="flex justify-between text-[#ffd700] font-semibold">
                    <span>Итого:</span>
                    <span>{order.total.toLocaleString()} ₸</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <p className="text-gray-400">Заказы не найдены.</p>
        )}
      </div>
    </div>
  );

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#ffd700] mb-8">Панель администратора</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-black/50 rounded-lg border border-[#ffd700]/20 p-4 sm:p-8">
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
                activeTab === 'products' ? 'bg-[#ffd700] text-black' : 'text-[#ffd700] hover:bg-[#ffd700]/20'
              }`}
            >
              <Package size={20} />
              <span>Товары</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
                activeTab === 'users' ? 'bg-[#ffd700] text-black' : 'text-[#ffd700] hover:bg-[#ffd700]/20'
              }`}
            >
              <Users size={20} />
              <span>Пользователи</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
                activeTab === 'orders' ? 'bg-[#ffd700] text-black' : 'text-[#ffd700] hover:bg-[#ffd700]/20'
              }`}
            >
              <ShoppingBag size={20} />
              <span>Заказы</span>
            </button>
          </div>

          {activeTab === 'products' && renderProductsTab()}
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'orders' && renderOrdersTab()}
        </div>
      </div>
    </div>
  );
}
