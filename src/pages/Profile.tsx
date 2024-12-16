import { useState, useEffect } from 'react';
import { useAuthStore } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Lock } from 'lucide-react';
import * as api from '../lib/api';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setProfileForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
    });

    // Загрузка заказов
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const data = await api.getOrders();
        setOrders(data);
      } catch (err) {
        console.error('Ошибка загрузки заказов:', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.updateProfile(profileForm);
      setSuccess('Профиль успешно обновлен');
      setIsEditingProfile(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении профиля');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }

    try {
      await api.updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setSuccess('Пароль успешно изменен');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при изменении пароля');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black/50 rounded-lg border border-[#ffd700]/20 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-[#ffd700]">Личный кабинет</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition"
            >
              <LogOut size={20} />
              <span>Выйти</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-[#ffd700]/20 p-4 rounded-full">
                  <User size={40} className="text-[#ffd700]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="bg-black/30 rounded-lg border border-[#ffd700]/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Личные данные</h3>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="text-[#ffd700] hover:text-[#ffd700]/80 transition"
                  >
                    {isEditingProfile ? 'Отмена' : 'Изменить'}
                  </button>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-md">
                        {success}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Имя</label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="mt-1 block w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Фамилия</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="mt-1 block w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="mt-1 block w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Телефон</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="mt-1 block w-full"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#ffd700] text-black px-4 py-2 rounded-md hover:bg-[#ffd700]/80 transition"
                    >
                      Сохранить изменения
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Имя</label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        readOnly
                        className="mt-1 block w-full bg-black/50 border-[#ffd700]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Фамилия</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        readOnly
                        className="mt-1 block w-full bg-black/50 border-[#ffd700]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        readOnly
                        className="mt-1 block w-full bg-black/50 border-[#ffd700]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Телефон</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        readOnly
                        className="mt-1 block w-full bg-black/50 border-[#ffd700]/20 text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Password Change Section */}
              <div className="bg-black/30 rounded-lg border border-[#ffd700]/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Изменить пароль</h3>
                  <button
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    className="flex items-center space-x-2 text-[#ffd700] hover:text-[#ffd700]/80 transition"
                  >
                    <Lock size={20} />
                    <span>{isChangingPassword ? 'Отмена' : 'Изменить'}</span>
                  </button>
                </div>

                {isChangingPassword && (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400">
                        Текущий пароль
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="mt-1 block w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">
                        Новый пароль
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="mt-1 block w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">
                        Подтвердите новый пароль
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="mt-1 block w-full"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#ffd700] text-black px-4 py-2 rounded-md hover:bg-[#ffd700]/80 transition"
                    >
                      Сохранить новый пароль
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Order History */}
            <div className="bg-black/30 rounded-lg border border-[#ffd700]/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">История заказов</h3>
              
              {ordersLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Загрузка заказов...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-black/50 rounded-lg border border-[#ffd700]/20 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#ffd700] font-semibold">Заказ #{order.id}</span>
                        <span className="text-gray-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="text-gray-300">
                          {item.product.name} x{item.quantity}
                        </div>
                      ))}
                      <div className="text-[#ffd700] font-semibold mt-2">
                        {order.total.toLocaleString()} ₸
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        Статус: {order.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">У вас пока нет заказов</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}