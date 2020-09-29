import {useState} from 'react';

import storage from '../auth/storage';

import auth from '@react-native-firebase/auth';

export default useTokenizer = async () => {
  const [token, setToken] = useState('');

  //  const getToken = async () => {
  const expiryTime = await storage.retriveData('expiryTime');
  var expiryDate = new Date(JSON.parse(expiryTime));
  const authToken = await storage.retriveData('token');
  var expiryTimestamp = expiryDate.getTime();

  var date = new Date();
  var curruentTimestamp = date.getTime();
  console.log('TIME: ', expiryTimestamp, ':::', curruentTimestamp);
  console.log('RETRIVE TOKEN FROM STORAGE: ', authToken);

  if (expiryTimestamp >= curruentTimestamp) {
    auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then(function (idTokenResult) {
          try {
            console.log('User JWT Expiry time: ', idTokenResult.expirationTime);
            setToken(idTokenResult.token);
            storage.storeData('token', idTokenResult.token);
            storage.storeData('expiryTime', idTokenResult.expirationTime);
          } catch (error) {
            console.log('error in refresh token', error.message);
          }
        });
      }
    });
  } else {
    setToken(authToken);
  }
  // };

  // const request = async (...args) => {
  //   setLoading(true);
  //   const response = await apiFunction(...args);

  //   setLoading(false);

  //   if (!response.ok) return setError(true);

  //   setData(response.data);
  //   setError(false);
  // };
  return {token};
};
