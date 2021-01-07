import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
// import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import * as Utility from '.';
import { QBLogout } from './QuickBlox';

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

  apiHeaders = { ...apiHeaders, ...headers };

  return apiHeaders;
};

const resetApp = async (authContext) => {
  QBLogout();
  firebase.auth().signOut();
  await Utility.clearStorage();
  authContext.setUser(null);
  authContext.setEntity(null)
}

const makeAPIRequest = async ({
  method,
  url,
  data,
  headers,
  params,
  responseType,
  authContext,
}) => NetInfo.fetch().then(async (netStat) => {
  if (!netStat || !netStat.isConnected) {
    Alert.alert('Error: Internet not available');
    throw new Error('no-internet');
  } else {
    const entity = authContext?.entity;
    const authToken = entity.auth.token.token;
    const currentDate = new Date();
    const expiryDate = new Date(entity.auth.token.expirationTime);
    // const expiryDate = new Date('25 Dec 2020 14:30');
    console.log('EXP: ', expiryDate.getTime());
    if (expiryDate.getTime() > currentDate.getTime()) {
      return globalApiCall({
        method, url, data, headers, params, responseType, authContext, authToken,
      })
    }
    console.log('Token Expired');
    resetApp(authContext);
    return true;
    // return true;
    // return new Promise((resolve, reject) => auth().currentUser.getIdTokenResult()
    //   .then(async (idTokenResult) => {
    //     authToken = idTokenResult.token;
    //     const token = {
    //       token: idTokenResult.token,
    //       expirationTime: idTokenResult.expirationTime,
    //     };
    //     entity.auth.token = token;
    //     await authContext.setEntity({ ...entity });
    //     await Utility.setStorage('authContextEntity', { ...entity })
    //     resolve(globalApiCall({
    //       method, url, data, headers, params, responseType, authContext, authToken,
    //     }))
    //   }).catch((error) => {
    //     console.log('Token Related: ', error);
    //     reject(error);
    //   }))
  }
});

const globalApiCall = async ({
  method,
  url,
  data,
  headers,
  params,
  responseType,
  authContext,
  authToken,
}) => {
  const entity = authContext?.entity;
  console.log('entity::', entity, url);
  let caller_id;
  let caller;
  console.log('entity.role', entity.role);
  if (entity.role === 'team' || entity.role === 'club') {
    caller_id = entity.uid;
    caller = entity.role;
  }
  const headersParams = prepareHeader(headers, authToken, caller_id, caller);

  const options = {
    method, url, data, headers: headersParams, params, responseType,
  };
  console.log('API Opetions::--->', JSON.stringify(options));
  try {
    const response = await axios(options);
    console.log('Opetions ::', JSON.stringify(options));
    if (!response.data.status) {
      console.log('ERROR RESPONSE ::', response.data);
      throw (response.data.messages || response);
    }
    console.log('RESPONSE ::', response.data);
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

export default makeAPIRequest;
