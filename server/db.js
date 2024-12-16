import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const DB_PATH = 'shop.db';

// Проверяем существование файла БД
const dbExists = fs.existsSync(DB_PATH);

export const db = createClient({
  url: `file:${DB_PATH}`
});

export async function initDB() {
  try {
    // Инициализируем только если БД не существует
    if (dbExists) {
      console.log('База данных уже существует, пропускаем инициализацию');
      return;
    }

    // Создаем таблицу категорий
    await db.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        parent_id INTEGER,
        FOREIGN KEY (parent_id) REFERENCES categories (id)
      )
    `);
    console.log('Таблица categories создана');

    // Создаем таблицу пользователей
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT 0,
        is_blocked BOOLEAN DEFAULT 0
      )
    `);
    console.log('Таблица users создана');

    // Создаем таблицу товаров
    await db.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT,
        category_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        in_stock BOOLEAN GENERATED ALWAYS AS (quantity > 0) STORED,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )
    `);
    console.log('Таблица products создана');

    // Создаем таблицу заказов
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        total REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    console.log('Таблица orders создана');

    // Создаем таблицу позиций заказа
    await db.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `);
    console.log('Таблица order_items создана');

    // Создаем основные категории
    const mainCategories = [
      { name: 'Кальяны', slug: 'hookahs' },
      { name: 'Бонги', slug: 'bongs' },
      { name: 'Табачные изделия', slug: 'tobacco' },
      { name: 'Аксессуары', slug: 'accessories' }
    ];

    for (const category of mainCategories) {
      await db.execute({
        sql: 'INSERT INTO categories (name, slug) VALUES (?, ?)',
        args: [category.name, category.slug]
      });
    }

    // Получаем ID основных категорий
    const categoriesResult = await db.execute('SELECT * FROM categories');
    const categories = categoriesResult.rows;
    
    const getCategoryId = (slug) => categories.find(c => c.slug === slug)?.id;

    // Создаем подкатегории
    const subCategories = [
      { name: 'Кальяны', slug: 'hookah-devices', parentSlug: 'hookahs' },
      { name: 'Табаки', slug: 'hookah-tobacco', parentSlug: 'hookahs' },
      { name: 'Аксессуары для кальяна', slug: 'hookah-accessories', parentSlug: 'hookahs' },
      
      { name: 'Бонги', slug: 'bong-devices', parentSlug: 'bongs' },
      { name: 'Аксессуары для бонга', slug: 'bong-accessories', parentSlug: 'bongs' },
      
      { name: 'Сигареты', slug: 'cigarettes', parentSlug: 'tobacco' },
      { name: 'Сигары', slug: 'cigars', parentSlug: 'tobacco' },
      { name: 'Сигариллы', slug: 'cigarillos', parentSlug: 'tobacco' },
      { name: 'Ручной табак', slug: 'hand-tobacco', parentSlug: 'tobacco' },
      { name: 'Все для табачки', slug: 'tobacco-accessories', parentSlug: 'tobacco' },
      
      { name: 'Аксессуары', slug: 'general-accessories', parentSlug: 'accessories' }
    ];

    for (const subCategory of subCategories) {
      await db.execute({
        sql: 'INSERT INTO categories (name, slug, parent_id) VALUES (?, ?, ?)',
        args: [subCategory.name, subCategory.slug, getCategoryId(subCategory.parentSlug)]
      });
    }

    // Создаем администратора
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    await db.execute({
      sql: `INSERT INTO users (first_name, last_name, email, phone, password_hash, is_admin)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: ['Admin', 'User', 'donsigaronkz@gmail.com', '+77714450880', adminPasswordHash, 1]
    });
    console.log('Администратор создан');

    console.log('База данных успешно инициализирована');
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    throw error;
  }
}