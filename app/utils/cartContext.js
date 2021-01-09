import React from 'react';
import useCartReducer from './cartReducer';
import { getItem, setItem } from './storage';

const CartContext = React.createContext();

export function useCartContext() {
  return React.useContext(CartContext);
}

export default function CartContextProvider(props) {
  const [state, dispatch] = useCartReducer();

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      console.log('Restoring states');
      let cart, total;

      cart = await getItem('cart').then(res => res === 'undefined' ? [] : JSON.parse(res));
      total = await getItem('total').then(res => res === 'undefined' ? 0 : JSON.parse(res));

      dispatch({type: 'RESTORE_STATES', cart, total});
    }

    bootstrapAsync();
  }, []); 

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