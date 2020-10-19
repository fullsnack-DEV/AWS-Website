import React, { useState, useEffect, useMemo } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import QB from 'quickblox-react-native-sdk';

import AuthContext from './app/auth/context';
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import navigationTheme from './app/navigation/navigationTheme';
import * as Utility from './app/utility/index';

export default function App() {
  const [user, setUser] = useState(null);
  const [switchBy, setSwitchBy] = useState('user');
  const [team, setTeam] = useState(null);
  const [club, setClub] = useState(null);
  const authValue = useMemo(
    () => ({
      switchBy,
      setSwitchBy,
      user,
      setUser,
      team,
      setTeam,
      club,
      setClub,
    }),
    [switchBy, user, team, club],
  );

  const getLoginUserDetail = async () => {
    const loginUserObject = await Utility.getStorage('user');
    if (loginUserObject !== null || loginUserObject !== undefined) {
      setUser(loginUserObject);
    }
  };

  const appSettings = {
    appId: '79537',
    authKey: 'bMFuNaWXVNJGqzY',
    authSecret: 'bpm8-gfaay9DWWv',
    accountKey: 'idPrZuxa3UseWLaRFRQU',
  };

  useEffect(() => {
    // requestPermission();

    getLoginUserDetail();
  }, []);
  QB.settings
    .init(appSettings)
    .then(() => {})
    .catch(() => {
      // Some error occured, look at the exception message for more details
    });
  QB.settings.enableAutoReconnect({ enable: true });

  return (
      <AuthContext.Provider value={authValue}>
          <NavigationContainer theme={navigationTheme}>
              {user ? <AppNavigator /> : <AuthNavigator />}
              {/* <AppNavigator /> */}
          </NavigationContainer>
      </AuthContext.Provider>
  );
}
