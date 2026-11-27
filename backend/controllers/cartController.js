import User from '../models/User.js';
import Product from '../models/Product.js';

const computeCartTotals = (cartItems) => {
  let subtotal = 0;
  let originalTotal = 0;
  let totalCount = 0;

  const validatedItems = cartItems
    .filter((item) => item.product)
    .map((item) => {
      const prod = item.product;
      const price = prod.price;
      const originalPrice = prod.originalPrice || price;
      const qty = item.quantity;

      subtotal += price * qty;
      originalTotal += originalPrice * qty;
      totalCount += qty;

      return {
        _id: item._id,
        productId: prod._id,
        name: prod.name,
        price: prod.price,
        originalPrice: prod.originalPrice,
        image: prod.image,
        category: prod.category,
        selectedSize: item.selectedSize || 'M',
        quantity: item.quantity,
        stock: prod.stock
      };
    });

  const shippingFee = subtotal > 1999 || totalCount === 0 ? 0 : 149;
  const total = subtotal + shippingFee;

  return {
    items: validatedItems,
    count: totalCount,
    subtotal,
    originalTotal,
    savings: originalTotal - subtotal,
    shippingFee,
    total
  };
};

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const summary = computeCartTotals(user.cart);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, selectedSize = 'M', quantity = 1, syncItems } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (syncItems && Array.isArray(syncItems)) {
      for (const item of syncItems) {
        const prod = await Product.findById(item.productId || item.id);
        if (prod) {
          const existing = user.cart.find(
            (c) =>
              c.product.toString() === prod._id.toString() &&
              c.selectedSize === (item.selectedSize || 'M')
          );
          if (existing) {
            existing.quantity = Math.min(prod.stock, existing.quantity + (item.quantity || 1));
          } else {
            user.cart.push({
              product: prod._id,
              selectedSize: item.selectedSize || 'M',
              quantity: Math.min(prod.stock, item.quantity || 1)
            });
          }
        }
      }
      await user.save();
      const updatedUser = await User.findById(user._id).populate('cart.product');
      return res.json(computeCartTotals(updatedUser.cart));
    }

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: `Insufficient stock. Only ${product.stock} available.` });
    }

    const existingIndex = user.cart.findIndex(
      (item) =>
        item.product.toString() === productId.toString() &&
        item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      const newQty = user.cart[existingIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          message: `Cannot add more. Maximum available stock is ${product.stock}.`
        });
      }
      user.cart[existingIndex].quantity = newQty;
    } else {
      user.cart.push({
        product: productId,
        selectedSize,
        quantity: Number(quantity)
      });
    }

    await user.save();
    const updatedUser = await User.findById(user._id).populate('cart.product');
    res.json(computeCartTotals(updatedUser.cart));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { selectedSize = 'M', quantity } = req.body;

    if (quantity === undefined || Number(quantity) < 0) {
      return res.status(400).json({ message: 'Valid quantity is required.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (Number(quantity) === 0) {
      user.cart = user.cart.filter(
        (item) =>
          !(item.product.toString() === productId.toString() && item.selectedSize === selectedSize)
      );
    } else {
      if (Number(quantity) > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items currently in stock.`
        });
      }

      const item = user.cart.find(
        (c) =>
          c.product.toString() === productId.toString() &&
          c.selectedSize === selectedSize
      );

      if (item) {
        item.quantity = Number(quantity);
      } else {
        user.cart.push({
          product: productId,
          selectedSize,
          quantity: Number(quantity)
        });
      }
    }

    await user.save();
    const updatedUser = await User.findById(user._id).populate('cart.product');
    res.json(computeCartTotals(updatedUser.cart));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { selectedSize } = req.query;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.cart = user.cart.filter((item) => {
      const matchProduct = item.product.toString() === productId.toString();
      if (selectedSize) {
        return !(matchProduct && item.selectedSize === selectedSize);
      }
      return !matchProduct;
    });

    await user.save();
    const updatedUser = await User.findById(user._id).populate('cart.product');
    res.json(computeCartTotals(updatedUser.cart));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.cart = [];
    await user.save();

    res.json({
      items: [],
      count: 0,
      subtotal: 0,
      originalTotal: 0,
      savings: 0,
      shippingFee: 0,
      total: 0,
      message: 'Cart cleared successfully.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
