// import React, {useContext} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {token_details} from '../utils/constant';
import firebase from '@react-native-firebase/app';
import * as Utility from '../utility/index';
// import {AppContext} from '../context/index';
// import {Value} from 'react-native-reanimated';

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
    // const {loading, updateLoadingState} = useContext(AppContext);
    //const tokenDetails = await AsyncStorage.getItem(token_details);

    const tokenDetails = await Utility.getStorage(token_details);
    var authToken = JSON.parse(tokenDetails).token;
    var expiryDate = new Date(JSON.parse(tokenDetails).expirationTime);
    var currentDate = new Date();

    // console.log('calleddd ... . ');
    // updateLoadingState(true);

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
        if (response.data.status) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch(async (error) => {
        alert(error.response.data.message);
        reject(error);
      });
  });
