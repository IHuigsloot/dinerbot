import React from 'react';
import useCartReducer from './cartReducer';

const CartContext = React.createContext();

export function useCartContext() {
  return React.useContext(CartContext);
}

export default function CartContextProvider(props) {
  const [state, dispatch] = useCartReducer();

  const addItem = async (product) => {
    dispatch({type: 'ADD', product});
  }

  const deleteItem = (product) => {
    dispatch({type: 'REMOVE', product});
  }

  const value = {
    addItem,
    deleteItem,
    ...state
  }


  return (
    <CartContext.Provider value={value} >
      {props.children}
    </CartContext.Provider>
  )
} 