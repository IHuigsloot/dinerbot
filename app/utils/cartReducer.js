import React from 'react';
import { setItem } from './storage';

const initialState = {
  cart: [],
  total: 0,
}

const calculateTotal = cart => {
  return cart.reduce((prev, item) => prev + (item.count * item.price), 0).toFixed(2);
}

const saveCart = state => {
  setItem('cart', JSON.stringify(state.cart));
  setItem('total', state.total);
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      const check = state.cart.find(item => item._id === action.product._id);
      if (check) {
        state.cart[state.cart.findIndex(item => item._id === action.product._id)].count++;
        return {
          ...state,
          cart: [...state.cart],
          total: calculateTotal(state.cart),
          ...saveCart(state)
        }
      } else {
        return {
          ...state,
          ...state.cart.push({
            count: 1, ...action.product
          }),
          total: calculateTotal(state.cart),
          ...saveCart(state)
        }
      }

    case 'REMOVE':
      const count = state.cart.find(item => item._id === action.product._id).count;
      if (count > 1) {
        state.cart[state.cart.findIndex(item => item._id === action.product._id)].count--;
        return {
          ...state,
          cart: [...state.cart],
          total: calculateTotal(state.cart),
          ...saveCart(state)
        }
      } else {
        return {
          ...state,
          cart: [...state.cart.filter(item => item._id !== action.product._id)],
          total: calculateTotal(state.cart.filter(item => item._id !== action.product._id)),
          ...saveCart(state)
        }
      }
      
    default:
      return state
  }
}

export default function useCartReducer() {
  return React.useReducer(cartReducer, initialState);
}