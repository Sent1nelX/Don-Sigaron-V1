import { useEffect, useState } from 'react';

export default function About() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true); // Включение анимации при загрузке компонента
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Основной контейнер с мягким градиентом */}
        <div className="bg-gradient-to-r from-black to-gray-800 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl transform transition-transform duration-700 ease-in-out hover:scale-105 hover:shadow-2xl">
          
          {/* Заголовок с анимацией */}
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold text-gold mb-8 sm:mb-12 text-center ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-1000 ease-out`}>
            О нас
          </h1>

          {/* Основной контент с плавной анимацией */}
          <div className={`prose prose-invert text-center text-lg sm:text-xl text-gray-300 leading-relaxed ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-1000 ease-out`}>
            <p className="mb-8">
              <strong className="text-gold">DON SIGARON</strong> — это премиальный магазин табачных изделий, где качество встречается с роскошью.
              Мы специализируемся на предоставлении эксклюзивных товаров для истинных ценителей, создавая уникальное пространство для настоящих гурманов.
            </p>
            <p className="mb-8">
              Наша миссия — создавать исключительное пространство, где каждый клиент может найти именно то, что ищет:
              будь то элегантный кальян, изысканный бонг или редкие сигареты, и всё это по привлекательным ценам.
            </p>
            <p>
              Мы гордимся тем, что предоставляем только товары высочайшего качества, с уникальным сервисом и профессиональной консультацией.
            </p>
          </div>

          {/* Блок с ценностями с эффектом плавного появления */}
          <div className="mt-16 sm:mt-20 p-8 sm:p-12 bg-gradient-to-r from-gold via-yellow-500 to-gold rounded-xl shadow-2xl transform transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">Наши ценности</h2>
            <p className="text-lg sm:text-xl text-gray-800 leading-relaxed text-center">
              Мы заботимся о каждом клиенте и стремимся предоставить только лучшее, чтобы ваш опыт был незабываемым.
              Премиальные товары, уникальные вкусы и комфорт — это то, что мы гарантируем.
            </p>
          </div>

          {/* Карточки с продуктами */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            <div className="card hover:scale-105 transition-all duration-300 ease-in-out transform hover:shadow-2xl p-6 sm:p-8 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-lg">
              <h3 className="text-2xl sm:text-3xl text-gold font-semibold mb-4 sm:mb-6">Высококачественные материалы</h3>
              <p className="text-lg sm:text-xl text-gray-300">
                Мы тщательно отбираем материалы для наших продуктов, чтобы гарантировать их долговечность и исключительный вкус.
              </p>
            </div>

            <div className="card hover:scale-105 transition-all duration-300 ease-in-out transform hover:shadow-2xl p-6 sm:p-8 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-lg">
              <h3 className="text-2xl sm:text-3xl text-gold font-semibold mb-4 sm:mb-6">Индивидуальный подход</h3>
              <p className="text-lg sm:text-xl text-gray-300">
                Наши специалисты всегда готовы предоставить индивидуальные консультации и помочь выбрать лучший продукт для вас.
              </p>
            </div>

            <div className="card hover:scale-105 transition-all duration-300 ease-in-out transform hover:shadow-2xl p-6 sm:p-8 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-lg">
              <h3 className="text-2xl sm:text-3xl text-gold font-semibold mb-4 sm:mb-6">Роскошный сервис</h3>
              <p className="text-lg sm:text-xl text-gray-300">
                Мы предлагаем только лучший сервис для наших клиентов, начиная от покупки и до самой доставки.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
