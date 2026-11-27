import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      gender,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (keyword && keyword.trim() !== '') {
      query.$or = [
        { name: { $regex: keyword.trim(), $options: 'i' } },
        { description: { $regex: keyword.trim(), $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      if (category === 'men') {
        query.$or = [{ gender: 'men' }, { category: 'men' }];
      } else if (category === 'women') {
        query.$or = [{ gender: 'women' }, { category: 'women' }];
      } else {
        query.category = category.toLowerCase().trim();
      }
    }

    if (gender && gender !== 'all') {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1, reviews: -1 };
    } else if (sort === 'featured') {
      sortOption = { isFeatured: -1, createdAt: -1 };
    }

    const pageSize = Math.max(1, Number(limit));
    const currentPage = Math.max(1, Number(page));
    const count = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (currentPage - 1));

    res.json({
      products,
      page: currentPage,
      pages: Math.ceil(count / pageSize),
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    let query = {};

    if (category === 'men') {
      query = { $or: [{ gender: 'men' }, { category: 'men' }] };
    } else if (category === 'women') {
      query = { $or: [{ gender: 'women' }, { category: 'women' }] };
    } else {
      query = { category: category.toLowerCase().trim() };
    }

    const products = await Product.find(query);
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.q || '';
    if (!keyword.trim()) {
      return res.json({ success: true, count: 0, products: [] });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: keyword.trim(), $options: 'i' } },
        { category: { $regex: keyword.trim(), $options: 'i' } },
        { description: { $regex: keyword.trim(), $options: 'i' } }
      ]
    }).limit(10);

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      gender,
      price,
      originalPrice,
      image,
      images,
      sizes,
      stock,
      rating,
      details,
      isFeatured,
      isNewItem
    } = req.body;

    if (!name || !price || !category || !image) {
      return res.status(400).json({ message: 'Product name, price, category, and primary image are required.' });
    }

    const product = new Product({
      name,
      description: description || 'Premium STYLEHUB garment crafted with minimal aesthetic and enduring quality.',
      category: category.toLowerCase().trim(),
      gender: gender || 'unisex',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price) * 1.5,
      image,
      images: images && images.length ? images : [image],
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      stock: stock !== undefined ? Number(stock) : 50,
      rating: rating ? Number(rating) : 4.8,
      details: details || ['100% Organic Combed Fabric', 'Pre-shrunk finish', 'Machine wash cold'],
      isFeatured: !!isFeatured,
      isNewItem: !!isNewItem
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name ?? product.name;
      product.description = req.body.description ?? product.description;
      product.category = req.body.category ? req.body.category.toLowerCase().trim() : product.category;
      product.gender = req.body.gender ?? product.gender;
      product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
      product.originalPrice = req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : product.originalPrice;
      product.image = req.body.image ?? product.image;
      product.images = req.body.images ?? product.images;
      product.sizes = req.body.sizes ?? product.sizes;
      product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
      product.rating = req.body.rating !== undefined ? Number(req.body.rating) : product.rating;
      product.details = req.body.details ?? product.details;
      product.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : product.isFeatured;
      product.isNewItem = req.body.isNewItem !== undefined ? req.body.isNewItem : product.isNewItem;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
