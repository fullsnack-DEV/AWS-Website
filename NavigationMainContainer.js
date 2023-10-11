import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  Fragment,
} from 'react';
import {View, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
// eslint-disable-next-line import/no-extraneous-dependencies
import SplashScreen from 'react-native-splash-screen';
import firebase from '@react-native-firebase/app';
import jwtDecode from 'jwt-decode';
import {Host} from 'react-native-portalize';
import {createStackNavigator} from '@react-navigation/stack';
import AuthContext from './app/auth/context';
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import navigationTheme from './app/navigation/navigationTheme';
import * as Utility from './app/utils/index';
import LoneStackNavigator from './app/navigation/LoneStackNavigator';
import {getSportsList} from './app/api/Games';
import {connectUserToStreamChat} from './app/utils/streamChat';
import images from './app/Constants/ImagePath';
import colors from './app/Constants/Colors';

// import {getUnreadNotificationCount} from './app/utils/accountUtils';

const Stack = createStackNavigator();

function NavigationMainContainer() {
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

  useEffect(() => {
    if (!loading) {
      SplashScreen.hide();
    }
  }, [loading]);

  return (
    <Fragment>
      {!loading ? (
        <NavigationContainer theme={navigationTheme}>
          <Host>
            {authContext.entity?.isLoggedIn &&
            authContext.entity?.isLoggedIn !== undefined ? (
              <Stack.Navigator
                initialRouteName="App"
                detachInactiveScreens={true}>
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
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.kHexColorFF8A01,
          }}>
          <View>
            <Image
              resizeMethod="resize"
              style={{
                width: 250,
                height: 60,
              }}
              source={images.townsCupLogoNew}
            />
          </View>
        </View>
      )}
    </Fragment>
  );
}

export default React.memo(NavigationMainContainer);
