import React, {
  useState,
  Fragment,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import jwtDecode from 'jwt-decode';
import {Host} from 'react-native-portalize';
import {createStackNavigator} from '@react-navigation/stack';
import AuthContext from './app/auth/context';
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import navigationTheme from './app/navigation/navigationTheme';
import * as Utility from './app/utils/index';
import ActivityLoader from './app/components/loader/ActivityLoader';
import LoneStackNavigator from './app/navigation/LoneStackNavigator';
import {getSportsList} from './app/api/Games';
import {connectUserToStreamChat} from './app/utils/streamChat';
// import {getUnreadNotificationCount} from './app/utils/accountUtils';

const Stack = createStackNavigator();

export default function NavigationMainContainer() {
  const authContext = useContext(AuthContext);
  const {setTokenData, setEntity, setUser} = authContext;
  const [loading, setLoading] = useState(false);

  const fetchSportList = useCallback(() => {
    getSportsList(authContext).then((res) => {
      authContext.setSports(res.payload);
    });
  }, [authContext]);

  useEffect(() => {
    if (authContext.entity?.isLoggedIn && authContext.sports?.length === 0) {
      fetchSportList();
    }
  }, [authContext, fetchSportList]);

  const getRefereshToken = () =>
    new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        unsubscribe();
        if (user) {
          user
            .getIdTokenResult(true)
            .then((refreshedToken) => {
              setLoading(false);
              resolve(refreshedToken);
            })
            .catch(() => {
              setLoading(false);

              reject();
            });
        } else {
          reject();
        }
      }, reject);
    });

  const setLocalData = useCallback(
    async (tokenData = {}) => {
      setLoading(true);
      const contextEntity = await Utility.getStorage('authContextEntity');
      const authContextUser = await Utility.getStorage('authContextUser');

      const {exp} = await jwtDecode(tokenData.token);
      const expiryDate = new Date(exp * 1000);
      const currentDate = new Date();

      if (expiryDate.getTime() > currentDate.getTime()) {
        setEntity({...contextEntity});
        setUser({...authContextUser});
        setLoading(false);
      } else {
        const refereshToken = await getRefereshToken();
        const token = {
          token: refereshToken.token,
          expirationTime: refereshToken.expirationTime,
        };

        setTokenData(token);
        setEntity({...contextEntity});
        Utility.setStorage('authContextEntity', {...contextEntity});
        setLoading(false);
      }
    },
    [setTokenData, setEntity, setUser],
  );

  useEffect(() => {
    Utility.getStorage('tokenData').then((res) => {
      if (res.token) {
        setTokenData(res);
        setLocalData(res);
      } else {
        setLoading(false);
      }
    });
  }, [setTokenData, setLocalData]);

  // useEffect(() => {
  //   if (authContext.tokenData?.token) {
  //     getUnreadNotificationCount(authContext);
  //   }
  // }, [authContext.tokenData]);

  useEffect(() => {
    authContext.setIsAccountDeactivated(
      authContext?.entity?.obj?.is_pause ||
        authContext?.entity?.obj?.is_deactivate,
    );
  }, [authContext]);

  useEffect(() => {
    if (authContext.entity?.uid && authContext.chatClient?.key) {
      connectUserToStreamChat(authContext);
    }
  }, [authContext.entity?.uid, authContext.chatClient?.key]);

  return (
    <Fragment>
      {!loading ? (
        <NavigationContainer theme={navigationTheme}>
          <Host>
            {authContext.entity?.isLoggedIn ? (
              <Stack.Navigator initialRouteName="App">
                <Stack.Screen
                  name="App"
                  component={AppNavigator}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="LoneStack"
                  component={LoneStackNavigator}
                  options={{headerShown: false}}
                />
              </Stack.Navigator>
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
