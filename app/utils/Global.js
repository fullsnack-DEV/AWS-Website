import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {token_details} from '../utils/constant';
import firebase from '@react-native-firebase/app';

export const makeAPIRequest = ({
  method,
  url,
  data,
  headers,
  params,
  responseType,
  caller_id,
  caller,
}) =>
  new Promise(async (resolve, reject) => {
    const tokenDetails = await AsyncStorage.getItem(token_details);
    var authToken = JSON.parse(tokenDetails).token;
    var expiryDate = new Date(JSON.parse(tokenDetails).expirationTime);
    var currentDate = new Date();

    if (expiryDate.getTime() <= currentDate.getTime()) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          user.getIdTokenResult().then(async (idTokenResult) => {
            authToken = idTokenResult.token;
            let tokenDetail = {
              token: idTokenResult.token,
              expirationTime: idTokenResult.expirationTime,
            };
            await AsyncStorage.setItem(
              token_details,
              JSON.stringify(tokenDetail),
            );
          });
        }
      });
    }

    let apiHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (authToken) {
      apiHeaders = {
        ...apiHeaders,
        Authorization: 'Bearer ' + authToken,
      };
    }
    if (caller_id) {
      apiHeaders = {
        ...apiHeaders,
        caller_id,
      };
    }
    if (caller) {
      apiHeaders = {
        ...apiHeaders,
        caller,
      };
    }

    apiHeaders = {
      ...apiHeaders,
      headers,
    };

    const options = {
      method: method,
      url: url,
      data: data,
      headers: apiHeaders,
      params: params,
      responseType: responseType,
    };

    console.log('API Option ::', JSON.stringify(options));
    await axios(options)
      .then((response) => {
        resolve(response);
      })
      .catch(async (error) => {
        reject(error);
      });
  });
