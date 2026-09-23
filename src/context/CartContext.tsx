import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedModel?: string) => void;
  updateQuantity: (productId: string, selectedModel: string, quantity: number) => void;
  removeFromCart: (productId: string, selectedModel: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rerok_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rerok_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1, selectedModel?: string) => {
    const model = selectedModel || (product.compatibleModels?.[0] || 'Universal');

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product._id === product._id && item.selectedModel === model
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedModel: model }];
      }
    });

    showToast(`Added ${product.name} (${model}) to cart!`, 'success');
  };

  const updateQuantity = (productId: string, selectedModel: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedModel);
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.product._id === productId && item.selectedModel === selectedModel
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, selectedModel: string) => {
    setCart(prev =>
      prev.filter(item => !(item.product._id === productId && item.selectedModel === selectedModel))
    );
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 49;
  const totalAmount = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
