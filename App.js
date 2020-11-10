import React, { useState, useEffect, useMemo } from 'react';

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
  const [team, setTeam] = useState(null);
  const [club, setClub] = useState(null);
  const authValue = useMemo(
    () => ({
      role,
      setRole,
      user,
      setUser,
      team,
      setTeam,
      club,
      setClub,
    }),
    [role, user, team, club],
  );

  const getLoginUserDetail = async () => {
    const entity = await Utility.getStorage('loggedInEntity');
    if (entity) {
      if (entity.role === 'user') {
        setUser(entity.auth.user);
      } else {
        setUser(entity.obj);
      }
    }
    // if (entity ? entity.auth.user || entity.obj) {
    //   setUser(entity.auth.user || entity.obj);
    // }
  };

  useEffect(() => {
    // requestPermission();

    getLoginUserDetail();
  }, []);
  QBinit();

  return (
    <AuthContext.Provider value={authValue}>
      <NavigationContainer theme={navigationTheme}>
        {user ? <AppNavigator /> : <AuthNavigator />}
        {/* <AppNavigator /> */}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
