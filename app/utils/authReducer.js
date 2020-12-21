import React from 'react';

const initialSate = {
  isLoading: true,
  isSignout: false,
  email: null,
}

function authReducer(prevState, action) {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        email: action.email,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        email: action.email,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        email: null,
      };
  }
}

export default function useAuthReducer() {
  return React.useReducer(authReducer, initialSate)
}