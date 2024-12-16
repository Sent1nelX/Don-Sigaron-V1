import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../lib/api';
import { useAuthStore } from '../lib/auth';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const data = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при регистрации');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <div className="bg-black/50 rounded-lg border border-[#ffd700]/20 p-8">
          <h1 className="text-3xl font-bold text-[#ffd700] mb-8 text-center">Регистрация</h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                Имя
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-black/50 border-[#ffd700]/20 text-white focus:border-[#ffd700] focus:ring focus:ring-[#ffd700]/20"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                Фамилия
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-black/50 border-[#ffd700]/20 text-white focus:border-[#ffd700] focus:ring focus:ring-[#ffd700]/20"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-black/50 border-[#ffd700]/20 text-white focus:border-[#ffd700] focus:ring focus:ring-[#ffd700]/20"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                Телефон
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-black/50 border-[#ffd700]/20 text-white focus:border-[#ffd700] focus:ring focus:ring-[#ffd700]/20"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-black/50 border-[#ffd700]/20 text-white focus:border-[#ffd700] focus:ring focus:ring-[#ffd700]/20"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Подтвердите пароль
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-black/50 border-[#ffd700]/20 text-white focus:border-[#ffd700] focus:ring focus:ring-[#ffd700]/20"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#ffd700] text-black px-4 py-2 rounded-md hover:bg-[#ffd700]/80 transition"
            >
              Зарегистрироваться
            </button>
          </form>

          <p className="mt-4 text-center text-gray-300">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-[#ffd700] hover:text-[#ffd700]/80">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}