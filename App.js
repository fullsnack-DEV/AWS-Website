import React, {useState, useEffect, useMemo} from 'react';

import {NavigationContainer} from '@react-navigation/native';
// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
// import {checkNotifications} from 'react-native-permissions';
// import firebase from '@react-native-firebase/app';
import QB from 'quickblox-react-native-sdk';

import AuthContext from './app/auth/context';
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import navigationTheme from './app/navigation/navigationTheme';
import AsyncStorage from '@react-native-community/async-storage';
// import ChooseSportsScreen from './app/screens/authScreens/ChooseSportsScreen';
// import NewsFeedVideoPlayer from './app/screens/newsfeeds/NewsFeedVideoPlayer';

export default function App() {
  const [user, setUser] = useState();
  const [switchBy, setSwitchBy] = useState('user');
  const [team, setTeam] = useState();
  const [club, setClub] = useState();
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
  const appSettings = {
    appId: '79537',
    authKey: 'bMFuNaWXVNJGqzY',
    authSecret: 'bpm8-gfaay9DWWv',
    accountKey: 'idPrZuxa3UseWLaRFRQU',
  };
  // const requestPermission = () => {
  //   request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
  //     if (result) {
  //       console.log('Thank you , you granted Photo library permission');
  //     }
  //   });
  //   checkNotifications().then(({status, settings}) => {
  //     if (status) {
  //       console.log('Thank you , you granted Notification permission');
  //     }
  //   });
  // };

  useEffect(() => {
    // firebase.initializeApp({
    //   apiKey: 'AIzaSyDgnt9jN8EbVwRPMClVf3Ac1tYQKtaLdrU',
    //   authDomain: 'townscup-fee6e.firebaseapp.com',
    //   databaseURL: 'https://townscup-fee6e.firebaseio.com',
    //   projectId: 'townscup-fee6e',
    //   storageBucket: 'townscup-fee6e.appspot.com',
    //   messagingSenderId: '1003329053001',
    //   appId: '1:1003329053001:web:f079b7ed53716fa8463a98',
    //   measurementId: 'G-N44NC0Z1Q7',
    // });
    // requestPermission();
  }, []);
  QB.settings
    .init(appSettings)
    .then(function () {
      // SDK initialized successfully
      console.log('SDK initialized successfully');
    })
    .catch(function (e) {
      // Some error occured, look at the exception message for more details
    });
  QB.settings.enableAutoReconnect({enable: true});

  return (
    <AuthContext.Provider value={authValue}>
      <NavigationContainer theme={navigationTheme}>
        {user ? <AppNavigator /> : <AuthNavigator />}
        {/* <AppNavigator /> */}
        {/* <NewsFeedVideoPlayer /> */}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
