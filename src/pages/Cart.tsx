import { useCartStore } from '../lib/store';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function Cart() {
  const { items, removeItem, updateQuantity } = useCartStore();

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleWhatsAppCheckout = () => {
    // Формируем сообщение с товарами и их фотографиями
    const message = `Здравствуйте, хотел бы приобрести:\n\n${items
      .map((item) => {
        let itemMessage = `${item.product.name} - ${item.quantity} шт. (${(item.product.price * item.quantity).toLocaleString()} ₸)`;
        // Если у товара есть изображение, добавляем ссылку на него
        if (item.product.image) {
          // Получаем полный URL изображения
          const imageUrl = `${window.location.origin}${item.product.image}`;
          itemMessage += `\nФото: ${imageUrl}`;
        }
        return itemMessage;
      })
      .join('\n\n')}\n\nОбщая сумма: ${total.toLocaleString()} ₸`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/77714450880?text=${encodedMessage}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <p className="text-gray-400">Корзина пуста</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gold mb-8">Корзина</h1>

        <div className="bg-black/50 rounded-lg border border-gold/20 p-8">
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center space-x-4 p-4 bg-black/30 rounded-lg border border-gold/10"
              >
                <img
                  src={item.product.image || `/media/лев_${item.product.category_slug}.webp`}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-white">{item.product.name}</h3>
                  <p className="text-gray-400">{item.product.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                      className="text-gold hover:text-gold/80 transition"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-white w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="text-gold hover:text-gold/80 transition"
                      disabled={item.quantity >= (item.product.quantity || 0)}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="text-xl font-semibold text-gold w-32 text-right">
                    {(item.product.price * item.quantity).toLocaleString()} ₸
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gold/20">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl text-white">Итого:</span>
              <span className="text-2xl font-bold text-gold">{total.toLocaleString()} ₸</span>
            </div>
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full bg-gold text-black px-6 py-3 rounded-md text-lg font-semibold hover:bg-gold/80 transition"
            >
              Оформить заказ через WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}