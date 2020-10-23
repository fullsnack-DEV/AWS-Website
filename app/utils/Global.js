import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '@react-native-firebase/app';
import NetInfo from '@react-native-community/netinfo'
import { Alert } from 'react-native';
import { token_details } from './constant';
import * as Utility from './index';

const prepareHeader = (headers, authToken, caller_id, caller) => {
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

const makeAPIRequest = async ({
  method,
  url,
  data,
  headers,
  params,
  responseType,
  caller_id,
  caller,
}) => {
  const netStat = await NetInfo.fetch()
  if (!netStat || !netStat.isConnected) {
    Alert.alert('Error: Internet not available')
    throw new Error('no-internet')
  }
  const tokenDetails = await Utility.getStorage(token_details);
  let authToken = tokenDetails.token;
  const currentDate = new Date();
  const expiryDate = new Date(tokenDetails.expirationTime);
  // FIXME when token expire, wait for new token and then call api
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
  const headersParams = prepareHeader(headers, authToken, caller_id, caller);
  const options = {
    method,
    url,
    data,
    headers: headersParams,
    params,
    responseType,
  };
  console.log('Options :-', options);
  try {
    const response = await axios(options);
    if (!response.data.status) {
      throw new Error(response.data || response);
    }
    return response.data
  } catch (e) {
    throw new Error(e);
  }
}

export default makeAPIRequest;
