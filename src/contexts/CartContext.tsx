'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
  category: string;
  width?: number;
  height?: number;
  length?: number;
  weight?: number;
}

export interface ShippingAddress {
  name: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ShippingRate {
  id: string;
  provider: string;
  service: string;
  rate: number;
  days: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  isLoading: boolean;
  shippingRates: ShippingRate[];
  selectedShippingRate: ShippingRate | null;
  taxRate: number | null;
  address: ShippingAddress | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'SET_SHIPPING_RATES'; payload: ShippingRate[] }
  | { type: 'SELECT_SHIPPING_RATE'; payload: ShippingRate }
  | { type: 'SET_ADDRESS'; payload: ShippingAddress };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price,
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price,
      };
    }

    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove ? itemToRemove.price * itemToRemove.quantity : 0),
      };
    }

    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload.id);
      if (!item) return state;

      const quantityDiff = action.payload.quantity - item.quantity;
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff),
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        isLoading: false,
        shippingRates: [],
        selectedShippingRate: null,
        taxRate: null,
        address: null,
      };

    case 'SET_ITEMS':
      return {
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0),
        isLoading: false,
        shippingRates: [],
        selectedShippingRate: null,
        taxRate: null,
        address: null,
      };

    case 'SET_SHIPPING_RATES':
      return {
        ...state,
        shippingRates: action.payload,
      };

    case 'SELECT_SHIPPING_RATE':
      return {
        ...state,
        selectedShippingRate: action.payload,
      };

    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.payload,
      };

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  total: 0,
  isLoading: true,
  shippingRates: [],
  selectedShippingRate: null,
  taxRate: null,
  address: null,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        dispatch({
          type: 'SET_ITEMS',
          payload: items,
        });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
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

const validateAddress = (address: ShippingAddress): boolean => {
  const required = ['name', 'street', 'city', 'state', 'zipCode', 'country'];
  const isValid = required.every(field => 
    address[field as keyof ShippingAddress]?.trim().length > 0
  );
  
  if (!isValid) {
    // Show error message to user about missing fields
    return false;
  }

  return true;
}; 