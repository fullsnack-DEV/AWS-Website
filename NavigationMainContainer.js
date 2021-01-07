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
    authContext.setEntity(null)
    authContext.setUser(null);
    await Utility.clearStorage();
    setAppInitialize(true);
  }

  const checkToken = async () => {
    const contextEntity = await Utility.getStorage('authContextEntity');
    const authContextUser = await Utility.getStorage('authContextUser');
    if (contextEntity) {
      const currentDate = new Date();
      const expiryDate = new Date(contextEntity.auth.token.expirationTime);
      if (expiryDate.getTime() > currentDate.getTime()) {
        await QBconnectAndSubscribe(contextEntity);
        await authContext.setEntity({ ...contextEntity })
        await authContext.setUser({ ...authContextUser });
        setAppInitialize(true);
      } else {
        resetApp();
        // await firebase.auth()?.currentUser?.getIdTokenResult()
        //   .then(async (idTokenResult) => {
        //     const token = {
        //       token: idTokenResult.token,
        //       expirationTime: idTokenResult.expirationTime,
        //     };
        //     contextEntity.auth.token = token;
        //     await authContext.setEntity({ ...contextEntity });
        //     await Utility.setStorage('authContextEntity', { ...contextEntity })
        //     setAppInitialize(true);
        //   }).catch((error) => {
        //     console.log('Token Related: ', error);
        //     resetApp();
        //   });
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
