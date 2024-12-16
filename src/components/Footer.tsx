import { Instagram, Phone, MapPin, Clock, MessageCircle, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black/95 text-white border-t border-[#ffd700]/20">
      <div className="section-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Contact Info */}
            <div className="card">
              <h3 className="text-xl font-bold text-[#ffd700] mb-4">Контакты</h3>
              <div className="space-y-4">
                <a href="tel:+77714450880" className="flex items-center space-x-2 text-gray-300 hover:text-[#ffd700] transition">
                  <Phone size={20} />
                  <span>+7 (771) 445-08-80</span>
                </a>
                <a href="https://wa.me/77714450880" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-300 hover:text-[#ffd700] transition">
                  <MessageCircle size={20} />
                  <span>WhatsApp</span>
                </a>
                <a href="https://instagram.com/don_sigaron_kz" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-300 hover:text-[#ffd700] transition">
                  <Instagram size={20} />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="card">
              <h3 className="text-xl font-bold text-[#ffd700] mb-4">Время работы</h3>
              <div className="flex items-start space-x-2 text-gray-300">
                <Clock size={20} className="flex-shrink-0 mt-1" />
                <div>
                  <p>Пн-Вс: С 11:00 до 01:00</p>
                  <p className="text-sm text-gray-400 mt-2">Работаем без выходных</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="card">
              <h3 className="text-xl font-bold text-[#ffd700] mb-4">Адрес</h3>
              <div className="flex items-start space-x-2 text-gray-300">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <div>
                  <p>г. Алматы, ул. Розыбакиева, д. 220</p>
                  <p className="text-sm text-gray-400 mt-2">Скоро открытие новых магазинов</p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="card">
              <h3 className="text-xl font-bold text-[#ffd700] mb-4">Поддержка</h3>
              <div className="flex items-start space-x-2 text-gray-300">
                <Send size={20} className="flex-shrink-0 mt-1" />
                <div>
                  <a 
                    href="https://t.me/SoC_Sent1nelX" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[#ffd700] transition"
                  >
                    <p>Техническая поддержка</p>
                    <p className="text-sm text-gray-400 mt-2">Telegram: @SoC_Sent1nelX</p>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#ffd700]/20 text-center">
            <p className="text-gray-400">© 2024 DON SIGARON. Все права защищены.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}