import React, {
  useState, Fragment, useEffect, useContext,
} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import AuthContext from './app/auth/context';
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import navigationTheme from './app/navigation/navigationTheme';
import * as Utility from './app/utils/index';
import { QBconnectAndSubscribe, QBLogout } from './app/utils/QuickBlox';
import ActivityLoader from './app/components/loader/ActivityLoader';

export default function NavigationMainContainer() {
  const authContext = useContext(AuthContext);

  const [appInitialize, setAppInitialize] = useState(false);

  const resetApp = async () => {
    QBLogout();
    firebase.auth().signOut();
    await Utility.clearStorage();
    await authContext.setTokenData(null);
    authContext.setUser(null);
    authContext.setEntity(null)
    setAppInitialize(true);
  }

  const getRefereshToken = () => new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      unsubscribe()
      if (user) {
        const refreshedToken = await user.getIdTokenResult(true).catch(() => reject());
        resolve(refreshedToken)
      } else {
        reject();
      }
    }, reject);
  });

  const checkToken = async () => {
    const contextEntity = await Utility.getStorage('authContextEntity');
    const authContextUser = await Utility.getStorage('authContextUser');
    const tokenData = await Utility.getStorage('tokenData');
    if (contextEntity) {
      const currentDate = new Date();
      const expiryDate = new Date(tokenData.expirationTime);
      // const expiryDate = new Date('08 Jan 2021 09:13');
      if (expiryDate.getTime() > currentDate.getTime()) {
        await authContext.setTokenData(tokenData);
        await QBconnectAndSubscribe(contextEntity);
        await authContext.setEntity({ ...contextEntity })
        await authContext.setUser({ ...authContextUser });
        setAppInitialize(true);
      } else {
        getRefereshToken().then(async (refereshToken) => {
          const token = {
            token: refereshToken.token,
            expirationTime: refereshToken.expirationTime,
          };
          await authContext.setTokenData(token);
          await authContext.setEntity({ ...contextEntity });
          await Utility.setStorage('authContextEntity', { ...contextEntity })
          setAppInitialize(true);
        }).catch(() => {
          resetApp();
        });
      }
    } else {
      setAppInitialize(true);
    }
  }

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <Fragment>
      {appInitialize ? (
        <NavigationContainer theme={navigationTheme}>
          {authContext?.entity?.isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      ) : (
        <ActivityLoader visible={true}/>
      )}
    </Fragment>
  );
}
