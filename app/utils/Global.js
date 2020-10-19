import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '@react-native-firebase/app';
import { token_details } from './constant';
import * as Utility from '../utility/index';

const prepareHeader = function (headers, authToken, caller_id, caller) {
  let apiHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (authToken) {
    apiHeaders = { ...apiHeaders, Authorization: `Bearer ${authToken}` };
  }
  if (caller_id) {
    apiHeaders = { ...apiHeaders, caller_id };
  }
  if (caller) {
    apiHeaders = { ...apiHeaders, caller };
  }

  apiHeaders = { ...apiHeaders, headers };

  return apiHeaders;
};

export const makeAPIRequest = async function ({
  method,
  url,
  data,
  headers,
  params,
  responseType,
  caller_id,
  caller,
}) {
  const tokenDetails = await Utility.getStorage(token_details);
  console.log('tokenDetails', tokenDetails)
  let authToken = tokenDetails.token;
  const currentDate = new Date();
  const expiryDate = new Date(tokenDetails.expirationTime);
  if (expiryDate.getTime() <= currentDate.getTime()) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then(async (idTokenResult) => {
          authToken = idTokenResult.token;
          const tokenDetail = {
            token: idTokenResult.token,
            expirationTime: idTokenResult.expirationTime,
          };
          AsyncStorage.setItem(token_details, JSON.stringify(tokenDetail));
        });
      }
    });
  }
  headers = prepareHeader(headers, authToken, caller_id, caller);
  const options = {
    method,
    url,
    data,
    headers,
    params,
    responseType,
  };
  console.log('options', options)
  const response = await axios(options);
  if (response.data.status) {
    return response.data;
  }
  throw new Error(response.data || response);
};
