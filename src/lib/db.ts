import { createClient } from '@libsql/client';

export const db = createClient({
  url: 'file:shop.db',
});

// Initialize database tables
export async function initDB() {
  try {
    // Drop existing tables if they exist
    await db.execute(`
      DROP TABLE IF EXISTS cart;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS users;
    `);

    // Create tables
    await db.execute(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT 0
      );

      CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT NOT NULL,
        category TEXT NOT NULL,
        in_stock BOOLEAN DEFAULT 1
      );

      CREATE TABLE reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      );

      CREATE TABLE cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        session_id TEXT,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Failed to initialize database tables:', error);
    throw error;
  }
}

// Sample products data
const sampleProducts = [
  {
    name: 'Premium Hookah Gold Edition',
    description: 'Эксклюзивный кальян с золотыми акцентами',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'hookah',
    in_stock: 1
  },
  {
    name: 'Crystal Bong Deluxe',
    description: 'Элегантный бонг из хрусталя с золотыми элементами',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'bong',
    in_stock: 1
  },
  {
    name: 'Premium Cigarettes Pack',
    description: 'Коллекционный выпуск премиальных сигарет',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1525093485273-f28f7a341a6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'cigarettes',
    in_stock: 1
  }
];

// Initialize sample data
export async function initSampleData() {
  try {
    // Insert sample products one by one
    for (const product of sampleProducts) {
      await db.execute(
        'INSERT INTO products (name, description, price, image, category, in_stock) VALUES (?, ?, ?, ?, ?, ?)',
        [product.name, product.description, product.price, product.image, product.category, product.in_stock]
      );
    }

    // Create admin user
    const adminPasswordHash = '$2a$10$JcKzNWWCxZYxhZ2z5x5tQOzwdfZv8LTF8RyYq3YFY1ZG4wV4Zkp6q'; // password: admin123
    await db.execute(
      'INSERT INTO users (first_name, last_name, email, phone, password_hash, is_admin) VALUES (?, ?, ?, ?, ?, ?)',
      ['Admin', 'User', 'admin@donsigaron.com', '+7 (999) 999-99-99', adminPasswordHash, 1]
    );

    console.log('Sample data initialized successfully');
  } catch (error) {
    console.error('Failed to initialize sample data:', error);
    throw error;
  }
}