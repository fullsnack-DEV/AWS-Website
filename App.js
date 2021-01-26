import React, {
  useState, useEffect, useMemo,
} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {
  Alert,
  StatusBar,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import Orientation from 'react-native-orientation';
import AuthContext from './app/auth/context';
import { QBinit } from './app/utils/QuickBlox';
import NavigationMainContainer from './NavigationMainContainer';
import { firebaseConfig } from './app/utils/constant';
import * as Utility from './app/utils';

console.disableYellowBox = true
if (!__DEV__) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}
export default function App() {
  const [networkConnected, setNetworkConntected] = useState(false);
  useEffect(() => {
    if (!networkConnected) {
      showNetworkAlert();
    }
  }, [networkConnected]);

  const showNetworkAlert = () => {
    Alert.alert('Internet not avaiable')
  }
  useEffect(() => {
    NetInfo.addEventListener((state) => {
      console.log('Connection : ', state.isConnected)
      setNetworkConntected(state.isConnected);
    });

    StatusBar.setBarStyle('dark-content')
    StatusBar.setBackgroundColor('white')
    Orientation.lockToPortrait();
    const firebaseAppInitialize = async () => {
      if (firebase.apps.length === 0) {
        await firebase.initializeApp(firebaseConfig);
      }
    }
    console.log('1');
    firebaseAppInitialize();
  }, []);

  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user');
  const [entity, setEntity] = useState(null);
  const [tokenData, setToken] = useState(null);
  const setTokenData = async (token) => {
    setToken(token);
    await Utility.setStorage('tokenData', token);
  }
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
      tokenData,
      setTokenData,
      updateAuth,
      networkConnected,
      showNetworkAlert,
    }),
    [role, user, entity, tokenData, networkConnected],
  );
  QBinit();
  return (
    <AuthContext.Provider value={authValue}>
      <NavigationMainContainer/>
    </AuthContext.Provider>
  );
}
