import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../lib/api';
import { useAuthStore } from '../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      setAuth(data.token, data.user);
      navigate(data.user.isAdmin ? '/admin' : '/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <div className="bg-black/50 rounded-lg border border-[#ffd700]/20 p-8">
          <h1 className="text-3xl font-bold text-[#ffd700] mb-8 text-center">Вход</h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md bg-black/50 border-[#ffd700]/20 text-white focus:border-[#ffd700] focus:ring focus:ring-[#ffd700]/20"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#ffd700] text-black px-4 py-2 rounded-md transition ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#ffd700]/80'
              }`}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-300">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-[#ffd700] hover:text-[#ffd700]/80">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}