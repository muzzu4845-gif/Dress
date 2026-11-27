import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';
import { products as initialProducts } from '../frontend/src/data/products.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing collections in connected MongoDB...');
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log('Seeding initial admin and customer accounts...');
    const adminUser = await User.create({
      name: 'STYLEHUB Admin',
      email: 'admin@stylehub.com',
      password: 'AdminPassword123!',
      role: 'admin'
    });

    const standardUser = await User.create({
      name: 'Priya Sharma',
      email: 'user@stylehub.com',
      password: 'UserPassword123!',
      role: 'user'
    });

    console.log('Seeding products from catalog...');
    const formattedProducts = initialProducts.map((p) => ({
      name: p.name,
      description: p.description,
      category: p.category,
      gender: p.gender || 'unisex',
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      image: p.image,
      images: p.images || [p.image],
      sizes: p.sizes || ['S', 'M', 'L', 'XL'],
      stock: 45,
      rating: p.rating || 4.8,
      reviews: p.reviewsCount || 100,
      details: p.details || [],
      isFeatured: Boolean(p.isFeatured),
      isNewItem: Boolean(p.isNew)
    }));

    const insertedProducts = await Product.insertMany(formattedProducts);

    standardUser.cart.push({
      product: insertedProducts[0]._id,
      selectedSize: 'M',
      quantity: 1
    });
    standardUser.wishlist.push(insertedProducts[1]._id);
    await standardUser.save();

    console.log(`STYLEHUB Database Seeded Successfully!`);
    console.log(`- Created ${insertedProducts.length} Luxury Fashion Products`);
    console.log(`- Admin: admin@stylehub.com (Password: AdminPassword123!)`);
    console.log(`- User: user@stylehub.com (Password: UserPassword123!)`);

    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
