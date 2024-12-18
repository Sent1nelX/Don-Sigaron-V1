import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function Contacts() {
  return (
    <div className="min-h-screen bg-neutral-900 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black/50 rounded-xl border border-gold/20 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gold mb-12 text-center">Контакты</h1>

          {/* Контент: 2 колонки на больших экранах, 1 колонка на мобильных */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Левый блок с контактами */}
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <Phone className="text-gold flex-shrink-0 w-8 h-8" />
                <div>
                  <h3 className="text-xl font-semibold text-white">Телефон</h3>
                  <a
                    href="tel:+77714450880"
                    className="text-gray-300 hover:text-gold transition-all duration-300 ease-in-out"
                  >
                    +7 (771) 445-08-80
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <MessageCircle className="text-gold flex-shrink-0 w-8 h-8" />
                <div>
                  <h3 className="text-xl font-semibold text-white">WhatsApp</h3>
                  <a
                    href="https://wa.me/77714450880"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-gold transition-all duration-300 ease-in-out"
                  >
                    +7 (771) 445-08-80
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <Mail className="text-gold flex-shrink-0 w-8 h-8" />
                <div>
                  <h3 className="text-xl font-semibold text-white">Email</h3>
                  <p className="text-gray-300">donsigaronkz@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <MapPin className="text-gold flex-shrink-0 w-8 h-8" />
                <div>
                  <h3 className="text-xl font-semibold text-white">Адрес</h3>
                  <p className="text-gray-300">г. Алматы, ул. Розыбакиева, д. 220</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <Clock className="text-gold flex-shrink-0 w-8 h-8" />
                <div>
                  <h3 className="text-xl font-semibold text-white">Режим работы</h3>
                  <p className="text-gray-300">Пн-Вс: С 11:00 до 01:00</p>
                  <p className="text-gray-300">Работаем без выходных</p>
                </div>
              </div>
            </div>

            {/* Правый блок с рилс */}
            <div className="bg-black/30 p-8 rounded-xl border border-gold/10 shadow-lg">
              <h3 className="text-2xl font-semibold text-white mb-6">Как нас найти?</h3>
              <p className="text-gray-300 mb-4">Мы находимся по адресу:</p>
              <p className="text-gray-300 mb-8">г. Алматы, ул. Розыбакиева, д. 220</p>

              {/* Встроенный рилс Instagram через iframe */}
              <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.instagram.com/p/DAI8sepoPqy/embed"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  allow="encrypted-media"
                  title="Instagram Reel"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
