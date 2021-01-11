import React from 'react';
import { setItem, removeItem } from './storage';
import useAuthReducer from './authReducer';
import setAuthUser from '../utils/setAuthUser';

const AuthContext = React.createContext();

export function useAuthContext() {
  return React.useContext(AuthContext);
}

export default function AuthContextProvider(props) {
  const [state, dispatch] = useAuthReducer()

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        setAuthUser(data.email);
        setItem('email', data.email);
        dispatch({ type: 'SIGN_IN', email: data.email });
      },
      signOut: () => {
        setAuthUser();
        removeItem('email');
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      {props.children}
    </AuthContext.Provider>
  )
}