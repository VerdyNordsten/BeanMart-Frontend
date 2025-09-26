import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant } from '@/types/product';

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Product, variant: ProductVariant, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Getters
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemById: (itemId: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product: Product, variant: ProductVariant, quantity: number) => {
        const itemId = `${product.id}-${variant.id}`;
        const existingItem = get().items.find(item => item.id === itemId);
        
        if (existingItem) {
          // Update quantity if item already exists
          set(state => ({
            items: state.items.map(item =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }));
        } else {
          // Add new item
          const newItem: CartItem = {
            id: itemId,
            product,
            variant,
            quantity,
            price: Number(variant.price)
          };
          
          set(state => ({
            items: [...state.items, newItem]
          }));
        }
      },
      
      removeItem: (itemId: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId)
        }));
      },
      
      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        
        set(state => ({
          items: state.items.map(item =>
            item.id === itemId
              ? { ...item, quantity }
              : item
          )
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },
      
      openCart: () => {
        set({ isOpen: true });
      },
      
      closeCart: () => {
        set({ isOpen: false });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getItemById: (itemId: string) => {
        return get().items.find(item => item.id === itemId);
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
