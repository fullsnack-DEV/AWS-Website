import React, {useState, useEffect, useMemo, useCallback} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {Alert, StatusBar} from 'react-native';
import {decode, encode} from 'base-64';
import messaging from '@react-native-firebase/messaging';
import Orientation from 'react-native-orientation';
import {StreamChat} from 'stream-chat';
import AuthContext from './app/auth/context';
import LocationContext from './app/context/LocationContext';
import NavigationMainContainer from './NavigationMainContainer';
import * as Utility from './app/utils';
import {strings} from './Localization/translation';

import {ImageUploadProvider} from './app/context/GetContexts';
import CommonAlert from './app/screens/account/commonScreen/CommonAlert';
import {getAppSettingsWithoutAuth} from './app/api/Users';

console.disableYellowBox = true;

function App() {
  const [networkConnected, setNetworkConntected] = useState(true);
  const [user, setUser] = useState(null);
  const [sports, setSports] = useState([]);
  const [role, setRole] = useState('user');
  const [entity, setEntity] = useState(null);
  const [tokenData, setToken] = useState(null);
  const [alertData, setAlertData] = useState(null);
  const [selectedLocation, setSelectedLoaction] = useState('');
  const [managedEntities, setManagedEntityList] = useState([]);
  const [unreadNotificationCount, setNotificationCount] = useState({});
  const [totalNotificationCount, setTotalNotificationCount] = useState(0);
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [streamChatToken, setStreamChatToken] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [baseUrlEventImages, setBaseUrlEventImages] = useState('');

  useEffect(() => {
    if (!chatClient?.userID) {
      getAppSettingsWithoutAuth()
        .then((res) => {
          setBaseUrlEventImages(res.payload.app.base_url_eventimages);
          const streamChatConfig = res.payload.app.stream;
          if (streamChatConfig.key) {
            const client = StreamChat.getInstance(streamChatConfig.key);

            setChatClient(client);
          }
        })
        .catch((err) => {
          console.log({err});
        });
    }
  }, [chatClient?.userID]);

  const setTokenData = useCallback(async (token) => {
    setToken(token);
    await Utility.setStorage('tokenData', token);
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

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
      setNetworkConntected(state.isConnected);
    });

    requestUserPermission();

    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('white');
    Orientation.lockToPortrait();
  }, []);

  const updateAuth = useCallback((e) => {
    setEntity({...e});
  }, []);

  const showAlert = (alertStuff) => {
    setAlertData(alertStuff);
    setTimeout(() => setAlertData(null), 3000);
  };

  const setUnreadNotificationCount = useCallback(
    (notificationsCount = {}, managedEntitiesList = []) => {
      setNotificationCount(notificationsCount);
      setManagedEntityList(managedEntitiesList);
    },
    [],
  );

  const setentityList = useCallback((list) => {
    setManagedEntityList(list);
  }, []);

  const clearAuthContext = useCallback(() => {
    setUser(null);
    setSports([]);
    setRole('user');
    setEntity(null);
    setToken(null);
    setSelectedLoaction('');
    setManagedEntityList([]);
    setNotificationCount({});
    setTotalNotificationCount(0);
    setStreamChatToken(null);
    setentityList([]);
  }, [setentityList]);

  const authValue = useMemo(
    () => ({
      role,
      setRole,
      user,
      setUser,
      entity,
      setEntity,

      setSports,
      sports,
      tokenData,
      setTokenData,
      updateAuth,
      networkConnected,
      showNetworkAlert,
      showAlert,
      setUnreadNotificationCount,
      managedEntities,
      unreadNotificationCount,
      totalNotificationCount,
      setTotalNotificationCount,
      clearAuthContext,
      isAccountDeactivated,
      setIsAccountDeactivated,
      streamChatToken,
      setStreamChatToken,
      chatClient,
      setentityList,
      baseUrlEventImages,
    }),
    [
      role,
      user,
      entity,
      sports,
      tokenData,
      setTokenData,
      updateAuth,
      networkConnected,
      setUnreadNotificationCount,
      managedEntities,
      unreadNotificationCount,
      totalNotificationCount,
      setTotalNotificationCount,
      clearAuthContext,
      isAccountDeactivated,
      streamChatToken,
      chatClient,
      setentityList,
      baseUrlEventImages,
    ],
  );

  return (
    <AuthContext.Provider value={authValue}>
      {alertData?.visible && <CommonAlert alertData={alertData} />}
      <LocationContext.Provider value={{selectedLocation, setSelectedLoaction}}>
        <ImageUploadProvider>
          <NavigationMainContainer />
        </ImageUploadProvider>
      </LocationContext.Provider>
    </AuthContext.Provider>
  );
}

export default React.memo(App);
