import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/skin.jpg")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <img src="/logo_text.png" alt="DON SIGARON" className="max-w-md w-full" />
        </div>
        <p className="text-xl sm:text-2xl text-[#ffd700] mb-8">
          CHILL & FLAME
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/catalog"
            className="inline-block bg-[#ffd700] text-black px-8 py-3 rounded-md font-semibold hover:bg-[#ffd700]/80 transition"
          >
            Каталог
          </Link>
          <Link
            to="/about"
            className="inline-block border-2 border-[#ffd700] text-[#ffd700] px-8 py-3 rounded-md font-semibold hover:bg-[#ffd700] hover:text-black transition"
          >
            О нас
          </Link>
        </div>
      </div>
    </div>
  );
}