import React, {
  useState, useEffect, useMemo, useContext,
} from 'react';

import { NavigationContainer } from '@react-navigation/native';
import AuthContext from './app/auth/context';
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import navigationTheme from './app/navigation/navigationTheme';
import * as Utility from './app/utils/index';
import { QBinit } from './app/utils/QuickBlox';

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user');
  const [entity, setEntity] = useState(null);
  const updateAuth = (e) => {
    setEntity({ ...e })
  }
  const authContext = useContext(AuthContext);
  const authValue = useMemo(
    () => ({
      role,
      setRole,
      user,
      setUser,
      entity,
      setEntity,
      updateAuth,
    }),
    [role, user, entity],
  );

  const getLoginUserDetail = async () => {
    const authContextEntity = await Utility.getStorage('authContextEntity');
    const authContextUser = await Utility.getStorage('authContextUser');
    if (authContextEntity) {
      setEntity({ ...authContextEntity })
      authContext.setEntity({ ...entity })
      authContext.setUser({ ...authContextUser });
      // if (entity.role === 'user') {
      //   setUser(e.auth.user);
      //   await QBconnectAndSubscribe(e);
      // } else {
      //   setUser(e.obj);
      // }
    }
  };

  useEffect(() => {
    // requestPermission();
    if (!entity) {
      getLoginUserDetail();
    }
  }, []);
  QBinit();

  return (
    <AuthContext.Provider value={authValue}>
      <NavigationContainer theme={navigationTheme}>
        {entity ? <AppNavigator /> : <AuthNavigator />}
        {/* <AppNavigator /> */}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
