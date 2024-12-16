import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db, initDB } from './db.js';

// Инициализация конфигурации
dotenv.config();

// Настройка путей для ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Инициализация Express
const app = express();

// Настройка middleware
app.use(cors());
app.use(express.json());

// Настройка загрузки файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/media'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Только изображения!'));
    }
    cb(null, true);
  }
});

// Middleware для проверки JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

// Middleware для проверки прав администратора
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Требуются права администратора' });
  }
  next();
};

// Маршруты аутентификации
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    if (user.is_blocked) {
      return res.status(403).json({ error: 'Аккаунт заблокирован' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.is_admin },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Проверяем все обязательные поля
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim() || !password) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    // Проверяем, существует ли пользователь
    const existingUser = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email.trim()]
    });

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email уже используется' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.execute({
      sql: `INSERT INTO users (first_name, last_name, email, phone, password_hash)
            VALUES (?, ?, ?, ?, ?)`,
      args: [firstName.trim(), lastName.trim(), email.trim(), phone.trim(), passwordHash]
    });

    const userId = result.lastInsertId;
    const token = jwt.sign(
      { id: userId, email: email.trim(), isAdmin: false },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      token,
      user: {
        id: userId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        isAdmin: false
      }
    });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршруты для работы с категориями
app.get('/api/categories', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM categories ORDER BY parent_id NULLS FIRST, name');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршруты для работы с товарами
app.get('/api/products', async (req, res) => {
  try {
    const result = await db.execute(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/categories/:id/products', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const result = await db.execute({
      sql: `
        SELECT p.*, c.name as category_name, c.slug as category_slug
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = ?
        ORDER BY p.id DESC
      `,
      args: [categoryId]
    });
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении товаров категории:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/products', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category_id, quantity } = req.body;
    
    // Проверяем обязательные поля
    if (!name?.trim() || !description?.trim() || !price || !category_id || quantity === undefined) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    // Преобразуем значения в нужные типы
    const parsedPrice = parseFloat(price);
    const parsedCategoryId = parseInt(category_id);
    const parsedQuantity = parseInt(quantity);

    // Проверяем корректность значений
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: 'Некорректная цена' });
    }
    if (isNaN(parsedCategoryId) || parsedCategoryId <= 0) {
      return res.status(400).json({ error: 'Некорректная категория' });
    }
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({ error: 'Некорректное количество' });
    }

    // Обрабатываем изображение
    const image = req.file ? `/media/${req.file.filename}` : null;

    // Создаем товар
    const result = await db.execute({
      sql: `INSERT INTO products (name, description, price, image, category_id, quantity)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [name.trim(), description.trim(), parsedPrice, image, parsedCategoryId, parsedQuantity]
    });

    const productId = result.lastInsertId;

    // Получаем созданный товар
    const product = await db.execute({
      sql: `SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?`,
      args: [productId]
    });

    res.status(201).json(product.rows[0]);
  } catch (error) {
    console.error('Ошибка при создании товара:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/products/:id', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, description, price, category_id, quantity } = req.body;

    // Проверяем существование товара
    const existingProduct = await db.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [productId]
    });

    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    // Обрабатываем изображение
    let image = existingProduct.rows[0].image;
    if (req.file) {
      image = `/media/${req.file.filename}`;
    }

    // Обновляем товар
    await db.execute({
      sql: `UPDATE products 
            SET name = ?, description = ?, price = ?, image = ?, category_id = ?, quantity = ?
            WHERE id = ?`,
      args: [name, description, price, image, category_id, quantity, productId]
    });

    // Получаем обновленный товар
    const updatedProduct = await db.execute({
      sql: `SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?`,
      args: [productId]
    });
    
    res.json(updatedProduct.rows[0]);
  } catch (error) {
    console.error('Ошибка при обновлении товара:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/products/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    await db.execute({
      sql: 'DELETE FROM products WHERE id = ?',
      args: [productId]
    });

    res.json({ message: 'Товар успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении товара:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршруты для работы с пользователями
app.get('/api/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM users ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/users/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { isBlocked } = req.body;

    await db.execute({
      sql: 'UPDATE users SET is_blocked = ? WHERE id = ?',
      args: [isBlocked, userId]
    });

    res.json({ message: 'Статус пользователя обновлен' });
  } catch (error) {
    console.error('Ошибка при обновлении статуса пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршруты для работы с профилем
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const userId = req.user.id;

    // Проверяем, не занят ли email другим пользователем
    if (email !== req.user.email) {
      const existingUser = await db.execute({
        sql: 'SELECT id FROM users WHERE email = ? AND id != ?',
        args: [email, userId]
      });

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Email уже используется' });
      }
    }

    await db.execute({
      sql: `UPDATE users 
            SET first_name = ?, last_name = ?, email = ?, phone = ?
            WHERE id = ?`,
      args: [firstName, lastName, email, phone, userId]
    });

    res.json({ message: 'Профиль обновлен' });
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/profile/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Получаем текущий пароль пользователя
    const user = await db.execute({
      sql: 'SELECT password_hash FROM users WHERE id = ?',
      args: [userId]
    });

    const validPassword = await bcrypt.compare(currentPassword, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Неверный текущий пароль' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await db.execute({
      sql: 'UPDATE users SET password_hash = ? WHERE id = ?',
      args: [newPasswordHash, userId]
    });

    res.json({ message: 'Пароль успешно изменен' });
  } catch (error) {
    console.error('Ошибка при изменении пароля:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршруты для работы с заказами
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const isAdmin = req.user.isAdmin;
    const userId = req.user.id;

    const sql = isAdmin
      ? `SELECT o.*, u.first_name, u.last_name, u.email,
          json_group_array(json_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'name', p.name
          )) as items
          FROM orders o
          JOIN users u ON o.user_id = u.id
          JOIN order_items oi ON o.id = oi.order_id
          JOIN products p ON oi.product_id = p.id
          GROUP BY o.id
          ORDER BY o.created_at DESC`
      : `SELECT o.*,
          json_group_array(json_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'name', p.name
          )) as items
          FROM orders o
          JOIN order_items oi ON o.id = oi.order_id
          JOIN products p ON oi.product_id = p.id
          WHERE o.user_id = ?
          GROUP BY o.id
          ORDER BY o.created_at DESC`;

    const result = await db.execute({
      sql,
      args: isAdmin ? [] : [userId]
    });

    // Преобразуем строки JSON в объекты
    const orders = result.rows.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    res.json(orders);
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/orders/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    await db.execute({
      sql: 'UPDATE orders SET status = ? WHERE id = ?',
      args: [status, orderId]
    });

    res.json({ message: 'Статус заказа обновлен' });
  } catch (error) {
    console.error('Ошибка при обновлении статуса заказа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Статические файлы
app.use('/media', express.static(path.join(__dirname, '../public/media')));

// Запуск сервера
const startServer = async () => {
  try {
    await initDB();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Сервер запущен на порту ${port}`);
    });
  } catch (error) {
    console.error('Ошибка запуска сервера:', error);
    process.exit(1);
  }
};

startServer();