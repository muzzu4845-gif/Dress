import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { products as staticProducts } from '../data/products';
import { productService } from '../services/productService';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';

const ShopContext = createContext();

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

export const ShopProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());

  const [products, setProducts] = useState(staticProducts);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('stylehub_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error reading cart from localStorage', error);
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('stylehub_wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error('Error reading wishlist from localStorage', error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3200);
  }, []);

  const refreshProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const data = await productService.getProducts({ limit: 50 });
      if (data && data.products && data.products.length > 0) {
        const formatted = data.products.map((p) => ({
          ...p,
          id: p._id
        }));
        setProducts(formatted);
      } else {
        setProducts(staticProducts);
      }
      setProductsError(null);
    } catch (err) {
      setProducts(staticProducts);
      setProductsError(err.message);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    try {
      localStorage.setItem('stylehub_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage', error);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('stylehub_wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Failed to save wishlist to localStorage', error);
    }
  }, [wishlist]);

  useEffect(() => {
    const handleExpired = () => {
      setCurrentUser(null);
      showToast('Your session has expired. Please log in again.', 'info');
    };
    window.addEventListener('auth_token_expired', handleExpired);
    return () => window.removeEventListener('auth_token_expired', handleExpired);
  }, [showToast]);

  const syncBackendCart = useCallback(async (userToken) => {
    if (!userToken) return;
    try {
      const localCart = JSON.parse(localStorage.getItem('stylehub_cart') || '[]');
      if (localCart.length > 0) {
        await cartService.syncCart(
          localCart.map((item) => ({
            productId: item.productId || item._id || item.id,
            selectedSize: item.selectedSize || 'M',
            quantity: item.quantity || 1
          }))
        );
      }

      const serverCart = await cartService.getCart();
      if (serverCart && serverCart.items) {
        const formattedCart = serverCart.items.map((it) => ({
          id: it.productId,
          productId: it.productId,
          name: it.name,
          price: it.price,
          originalPrice: it.originalPrice,
          image: it.image,
          category: it.category,
          selectedSize: it.selectedSize,
          quantity: it.quantity,
          stock: it.stock
        }));
        setCart(formattedCart);
      }

      const serverWishlist = await orderService.getWishlist();
      if (Array.isArray(serverWishlist)) {
        setWishlist(serverWishlist.map((w) => ({ ...w, id: w._id })));
      }
    } catch (err) {
      console.warn('Backend cart sync note:', err.message);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.token) {
      syncBackendCart(currentUser.token);
    }
  }, [currentUser, syncBackendCart]);

  const login = async (email, password) => {
    const user = await authService.login(email, password);
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}! ✨`);
    return user;
  };

  const register = async (name, email, password) => {
    const user = await authService.register(name, email, password);
    setCurrentUser(user);
    showToast(`Welcome to STYLEHUB, ${user.name}! 🎉`);
    return user;
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    showToast('Logged out successfully.', 'info');
  };

  const addToCart = async (product, selectedSize = 'M', quantity = 1) => {
    const prodId = product._id || product.id;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => (item.productId === prodId || item.id === prodId) && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: prodId,
            productId: prodId,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            category: product.category,
            selectedSize: selectedSize,
            quantity: quantity,
            stock: product.stock
          }
        ];
      }
    });

    showToast(`Added "${product.name}" (${selectedSize}) to bag!`);

    if (currentUser?.token) {
      try {
        await cartService.addToCart(prodId, selectedSize, quantity);
      } catch (err) {
        console.warn('Backend cart save note:', err.message);
      }
    }
  };

  const updateQuantity = async (productId, selectedSize, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.productId === productId || item.id === productId) && item.selectedSize === selectedSize
          ? { ...item, quantity: newQty }
          : item
      )
    );

    if (currentUser?.token) {
      try {
        await cartService.updateCartItem(productId, selectedSize, newQty);
      } catch (err) {
        console.warn('Backend quantity update note:', err.message);
      }
    }
  };

  const removeFromCart = async (productId, selectedSize) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !((item.productId === productId || item.id === productId) && item.selectedSize === selectedSize)
      )
    );
    showToast('Item removed from bag', 'info');

    if (currentUser?.token) {
      try {
        await cartService.removeFromCart(productId, selectedSize);
      } catch (err) {
        console.warn('Backend remove note:', err.message);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (currentUser?.token) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.warn('Backend clear note:', err.message);
      }
    }
  };

  const toggleWishlist = async (product) => {
    const prodId = product._id || product.id;
    const exists = wishlist.some((item) => (item._id === prodId || item.id === prodId));

    if (exists) {
      setWishlist((prev) => prev.filter((item) => (item._id !== prodId && item.id !== prodId)));
      showToast(`Removed "${product.name}" from wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved "${product.name}" to wishlist! ❤️`);
    }

    if (currentUser?.token) {
      try {
        await orderService.toggleWishlist(prodId);
      } catch (err) {
        console.warn('Backend wishlist note:', err.message);
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id === productId || item.id === productId));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartOriginalTotal = cart.reduce(
    (total, item) => total + (item.originalPrice || item.price) * item.quantity,
    0
  );
  const cartSavings = cartOriginalTotal - cartSubtotal;
  const shippingFee = cartSubtotal > 1999 || cartCount === 0 ? 0 : 149;
  const cartTotal = cartSubtotal + shippingFee;

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <ShopContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        register,
        logout,
        products,
        loadingProducts,
        productsError,
        refreshProducts,
        cart,
        cartCount,
        cartSubtotal,
        cartOriginalTotal,
        cartSavings,
        shippingFee,
        cartTotal,
        wishlist,
        wishlistCount: wishlist.length,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        toast,
        showToast,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        formatPrice
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
