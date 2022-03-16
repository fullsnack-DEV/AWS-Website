import React, {
  useState,
  Fragment,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import QB from 'quickblox-react-native-sdk';

import {NavigationContainer} from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import jwtDecode from 'jwt-decode';
import {Host} from 'react-native-portalize';
import AuthContext from './app/auth/context';
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import navigationTheme from './app/navigation/navigationTheme';
import * as Utility from './app/utils/index';
import {
  getQBSetting,
  QBconnectAndSubscribe,
  QBLogout,
} from './app/utils/QuickBlox';
import ActivityLoader from './app/components/loader/ActivityLoader';

export default function NavigationMainContainer() {
  const authContext = useContext(AuthContext);
  const [appInitialize, setAppInitialize] = useState(false);
  const [loading, setLoading] = useState(false);


  const resetApp = useCallback(async () => {
    QBLogout();
    firebase.auth().signOut();
    await Utility.clearStorage();
    await authContext.setTokenData(null);
    authContext.setUser(null);
    authContext.setEntity(null);
    setAppInitialize(true);
  }, [authContext]);

  const getRefereshToken = () =>
    new Promise((resolve, reject) => {
      

      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        unsubscribe();
        if (user) {
          user
            .getIdTokenResult(true)
            .then((refreshedToken) => {
              setLoading(false)
              console.log('refreshedToken', refreshedToken);
              resolve(refreshedToken);
            })
            .catch(() => {
              setLoading(false)

              reject();
            });
        } else {
          reject();
        }
      }, reject);
    });

  const checkToken = useCallback(async () => {
    getQBSetting().then( (setting) => {
     
      console.log('App QB Setting:=>', setting);

      if (setting) {
        authContext.setQBCredential(setting);
        QB.settings
          .init({
            appId: setting.quickblox.appId,
            authKey: setting.quickblox.authKey,
            authSecret: setting.quickblox.authSecret,
            accountKey: setting.quickblox.accountKey,
          })
          .then( () => {
            setLoading(false)

            QB.settings.enableAutoReconnect({enable: true});
          })
          .catch((e) => {
            setLoading(false)

            console.log('QB ERROR:=>', e);
            // Some error occured, look at the exception message for more details
          });
      }
      // else {
      //   const QBSetting = {
      //     accountKey: 'S3jzJdhgvNjrHTT8VRMi',
      //     appId: '92185',
      //     authKey: 'NGpyPS265yy4QBS',
      //     authSecret: 'bdxqa7sDzbODJew',
      //   };
      //   QB.settings
      //     .init(QBSetting)
      //     .then(() => {})
      //     .catch(() => {
      //       // Some error occured, look at the exception message for more details
      //     });
      // }
    });

    const contextEntity = await Utility.getStorage('authContextEntity');
    const authContextUser = await Utility.getStorage('authContextUser');
    const tokenData = await Utility.getStorage('tokenData');
    if (contextEntity && tokenData && authContextUser) {
      const {exp} = await jwtDecode(tokenData.token);
      const expiryDate = new Date(exp * 1000);
      const currentDate = new Date();
      // const expiryDate = new Date('08 Jan 2021 09:13');
      if (expiryDate.getTime() > currentDate.getTime()) {
        await QBconnectAndSubscribe({...contextEntity});
        await authContext.setTokenData(tokenData);
        await QBconnectAndSubscribe(contextEntity);
        await authContext.setEntity({...contextEntity});
        await authContext.setUser({...authContextUser});
        setAppInitialize(true);
      } else {
        getRefereshToken()
          .then(async (refereshToken) => {
            const token = {
              token: refereshToken.token,
              expirationTime: refereshToken.expirationTime,
            };
            await QBconnectAndSubscribe({...contextEntity});
            await authContext.setTokenData(token);
            await authContext.setEntity({...contextEntity});
            await Utility.setStorage('authContextEntity', {...contextEntity});
            setAppInitialize(true);
          })
          .catch(() => {
            resetApp();
          });
      }
    } else {
      resetApp();
    }
  }, [authContext, resetApp]);

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <Fragment>
      <ActivityLoader visible={loading} />
      {appInitialize ? (
        <NavigationContainer theme={navigationTheme}>
          <Host>
            {authContext?.entity?.isLoggedIn ? (
              <AppNavigator />
            ) : (
              <AuthNavigator />
            )}
          </Host>
        </NavigationContainer>
      ) : (
        <ActivityLoader visible={true} />
      )}
    </Fragment>
  );
}
