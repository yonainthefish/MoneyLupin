import React, { createContext, useReducer, useEffect } from 'react';
import { appAuth } from '../firebase/config';
import { User } from 'firebase/auth';

interface State {
  user: null | User;
  isAuthReady: boolean;
}

type Action =
  | { type: 'login'; payload: User }
  | { type: 'logout'; payload: null }
  | { type: 'isAuthReady'; payload: null | User }
  | { type: ''; payload: null | User };

interface ContextType extends State {
  dispatch: React.Dispatch<Action>;
}

const AuthContext = createContext<ContextType>({
  user: null,
  isAuthReady: false,
  dispatch: () => {},
});

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const authReducer = (state: State, action: Action) => {
    console.log(action.type, typeof action.payload);
    switch (action.type) {
      case 'login':
        return { ...state, user: action.payload };
      case 'logout':
        return { ...state, user: null };
      case 'isAuthReady':
        return { ...state, user: action.payload, isAuthReady: true };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthReady: false,
  });

  useEffect(() => {
    const unsubscribe = appAuth.onAuthStateChanged((user) => {
      dispatch({ type: 'isAuthReady', payload: user });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
