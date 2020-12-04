import React, { useState, useEffect, useMemo } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import AuthContext from './app/auth/context';
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import navigationTheme from './app/navigation/navigationTheme';
import * as Utility from './app/utils/index';
import { QBconnectAndSubscribe, QBinit } from './app/utils/QuickBlox';

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user');
  const [entity, setEntity] = useState(null);
  const updateAuth = (e) => {
    setEntity({ ...e })
  }
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
    const e = await Utility.getStorage('loggedInEntity');
    if (e && e.auth) {
      setEntity({ ...e })
      if (entity.role === 'user') {
        setUser(e.auth.user);
        await QBconnectAndSubscribe(e);
      } else {
        setUser(e.obj);
      }
    }
  };

  useEffect(() => {
    // requestPermission();
    console.log('##################  app.js is called   #################')
    if (entity) {
      console.log('entity is obj. storing in async now', entity)
      Utility.setStorage('loggedInEntity', entity)
    } else {
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
