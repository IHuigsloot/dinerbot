import React from 'react';
import { setItem, removeItem, getItem } from './storage';
import useAuthReducer from './authReducer';

const AuthContext = React.createContext();

export function useAuthContext() {
  return React.useContext(AuthContext);
}

export default function AuthContextProvider(props) {
  const [state, dispatch] = useAuthReducer()
  
  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        setItem('email', data.email);
        dispatch({ type: 'SIGN_IN', email: data.email });
      },
      signOut: () => {
        removeItem('email');
        dispatch({ type: 'SIGN_OUT' })
      }
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      {props.children}
    </AuthContext.Provider>
  )
}