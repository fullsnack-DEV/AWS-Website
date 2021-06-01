import React, {
    useState, useEffect, useMemo, useCallback,
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
import strings from './app/Constants/String';
import { ImageUploadProvider } from './app/context/GetContexts';
import CommonAlert from './app/screens/account/commonScreen/CommonAlert';

console.disableYellowBox = true
// if (__DEV__) {
//     console.log = () => {}
//     console.warn = () => {}
//     console.error = () => {}
// }
export default function App() {
  const [networkConnected, setNetworkConntected] = useState(true);
  useEffect(() => {
    if (!networkConnected) {
      showNetworkAlert();
    }
  }, [networkConnected]);

  const showNetworkAlert = () => {
    Alert.alert(strings.alertmessagetitle, strings.networkConnectivityErrorMessage)
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
    firebaseAppInitialize();
  }, []);

  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user');
  const [entity, setEntity] = useState(null);
  const [tokenData, setToken] = useState(null);
  const [alertData, setAlertData] = useState(null);
  const setTokenData = useCallback(async (token) => {
    setToken(token);
    await Utility.setStorage('tokenData', token);
  }, []);

  const updateAuth = useCallback((e) => {
    setEntity({ ...e })
  }, []);

  const showAlert = (alertStuff) => {
      setAlertData(alertStuff)
      setTimeout(() => setAlertData(null), 1000)
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
      showAlert,
    }),
    [role, user, entity, tokenData, setTokenData, updateAuth, networkConnected],
  );
  QBinit();
  return (
    <AuthContext.Provider value={authValue}>
      {alertData?.visible && <CommonAlert alertData={alertData}/>}
      <ImageUploadProvider>
        <NavigationMainContainer/>
      </ImageUploadProvider>
    </AuthContext.Provider>
  );
}
