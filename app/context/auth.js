import React, {useState} from 'react';
import * as Utility from '../utils/index';

const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
  const [authEntity, setAuthEntity] = useState();
  const [user, setUser] = useState();

  const updateAuth = async (_authEntity) => {
    setAuthEntity({..._authEntity});
    Utility.setStorage('authEntity', _authEntity);
  };
  return (
    <AuthContext.Provider
      value={{
        authEntity,
        updateAuth,
        user,
        setUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
