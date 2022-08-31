import React, {useState, useEffect, useMemo, useCallback} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {Alert, StatusBar} from 'react-native';
import {decode, encode} from 'base-64';

// import firebase from '@react-native-firebase/app';
import Orientation from 'react-native-orientation';
import QB from 'quickblox-react-native-sdk';
import AuthContext from './app/auth/context';

// import { getQBSetting } from './app/utils/QuickBlox';
import NavigationMainContainer from './NavigationMainContainer';
// import { firebaseConfig } from './app/utils/constant';
import * as Utility from './app/utils';
import {strings} from './Localization/translation';
import {ImageUploadProvider} from './app/context/GetContexts';
import CommonAlert from './app/screens/account/commonScreen/CommonAlert';

console.disableYellowBox = true;
// if (__DEV__) {
//     console.log = () => {}
//     console.warn = () => {}
//     console.error = () => {}
// }
export default function App() {
  const [networkConnected, setNetworkConntected] = useState(true);
  const [user, setUser] = useState(null);
  const [sports, setSports] = useState([]);

  const [role, setRole] = useState('user');
  const [entity, setEntity] = useState(null);
  const [tokenData, setToken] = useState(null);
  const [QBCredential, setQBCredential] = useState({});
  const [alertData, setAlertData] = useState(null);
  const setTokenData = useCallback(async (token) => {
    setToken(token);
    await Utility.setStorage('tokenData', token);
  }, []);

  // useEffect(() => {
  //   axios({
  //     method: 'get',
  //     url: `${Config.BASE_URL}/app/settings`,
  //     withCredentials: true,
  //     headers: {
  //       Accept: 'application/json',
  //       setting_token: '3c5a5976-4831-41b3-a0cb-1aeb9d2e2c1c',
  //     },
  //   }).then((setting) => {
  //     console.log('response:=>', setting);
  //     setQBCredential(setting.data.payload.app)
  //         QB.settings
  //           .init({
  //             appId: setting.data.payload.app.quickblox.appId,
  //             authKey: setting.data.payload.app.quickblox.authKey,
  //             authSecret: setting.data.payload.app.quickblox.authSecret,
  //             accountKey: setting.data.payload.app.quickblox.accountKey,
  //           })
  //   });
  // }, []);

  if (!global.btoa) {
    global.btoa = encode;
  }

  if (!global.atob) {
    global.atob = decode;
  }

  useEffect(() => {
    if (!networkConnected) {
      showNetworkAlert();
    }
  }, [networkConnected]);

  const showNetworkAlert = () => {
    Alert.alert(
      strings.alertmessagetitle,
      strings.networkConnectivityErrorMessage,
    );
  };
  useEffect(() => {
    NetInfo.addEventListener((state) => {
      console.log('Connection : ', state.isConnected);
      setNetworkConntected(state.isConnected);
    });

    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('white');
    Orientation.lockToPortrait();

    const QBSetting = {
      accountKey: 'aaaaa',
      appId: '1111111',
      authKey: 'sdsdsdsdsdsd',
      authSecret: 'sfdfdfd',
    };

    QB.settings
      .init(QBSetting)
      .then(() => {})
      .catch(() => {
        // Some error occured, look at the exception message for more details
      });

    // getQBSetting().then(async (setting) => {
    //   console.log('App QB Setting:=>', setting);

    //   if (setting) {
    //     setQBCredential(setting)
    //     if (firebase.apps.length === 0) {
    //       await firebase.initializeApp(setting.firebaseConfig);
    //     }
    //     QB.settings
    //       .init({
    //         appId: setting.quickblox.appId,
    //         authKey: setting.quickblox.authKey,
    //         authSecret: setting.quickblox.authSecret,
    //         accountKey: setting.quickblox.accountKey,
    //       })
    //       .then(async () => {
    //         QB.settings.enableAutoReconnect({ enable: true });
    //       })
    //       .catch((e) => {
    //         console.log('QB ERROR:=>', e);
    //         // Some error occured, look at the exception message for more details
    //       });
    //   } else {
    //     const QBSetting = {
    //       accountKey: 'S3jzJdhgvNjrHTT8VRMi',
    //       appId: '92185',
    //       authKey: 'NGpyPS265yy4QBS',
    //       authSecret: 'bdxqa7sDzbODJew',
    //     };
    //     if (QBSetting) {
    //       setQBCredential(QBSetting)
    //     }
    //     QB.settings
    //       .init(QBSetting)
    //       .then(() => {})
    //       .catch(() => {
    //         // Some error occured, look at the exception message for more details
    //       });
    //   }
    // });
  }, []);

  const updateAuth = useCallback((e) => {
    setEntity({...e});
  }, []);

  const showAlert = (alertStuff) => {
    setAlertData(alertStuff);
    setTimeout(() => setAlertData(null), 1000);
  };

  const authValue = useMemo(
    () => ({
      role,
      setRole,
      user,
      setUser,
      entity,
      setEntity,
      setQBCredential,
      QBCredential,
      setSports,
      sports,
      tokenData,
      setTokenData,
      updateAuth,
      networkConnected,
      showNetworkAlert,
      showAlert,
    }),
    [
      role,
      user,
      entity,
      QBCredential,
      sports,
      tokenData,
      setTokenData,
      updateAuth,
      networkConnected,
    ],
  );

  return (
    <AuthContext.Provider value={authValue}>
      {alertData?.visible && <CommonAlert alertData={alertData} />}
      <ImageUploadProvider>
        <NavigationMainContainer />
      </ImageUploadProvider>
    </AuthContext.Provider>
  );
}
