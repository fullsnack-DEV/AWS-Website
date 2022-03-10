/* eslint-disable no-promise-executor-return */
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import firebase from '@react-native-firebase/app';

import strings from '../Constants/String';

const prepareHeader = (headers) => {
  let apiHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  apiHeaders = { ...apiHeaders, ...headers };

  return apiHeaders;
};

const getRefereshToken = () => new Promise((resolve, reject) => {
  const unsubscribe = firebase
    .auth()
    .onAuthStateChanged(async (user) => {
      unsubscribe()
      const refreshedToken = await user
        .getIdTokenResult(true)
        .catch((err) => console.error(err))
      resolve(refreshedToken)
    }, reject)
})
const makeAPIWithoutAuthRequest = async ({
  method,
  url,
  data,
  headers,
  params,
  responseType,
}) => NetInfo.fetch().then(async (netStat) => {
  if (!netStat || !netStat.isConnected) {
    throw new Error(strings.networkConnectivityErrorMessage);
  } else {
    return new Promise((resolve, reject) => getRefereshToken()
      .then(async () => {
        resolve(globalApiCall({
          method, url, data, headers, params, responseType,
        }));
      }).catch((error) => {
        console.log('Token Related: ', error);
        reject(error);
      }))
  }
});

const globalApiCall = async ({
  method,
  url,
  data,
  headers,
  params,
  responseType,
  withRenewToken,
  cancelToken,
}) => {
  const headersParams = prepareHeader(headers);

  const options = {
    method, url, data, headers: headersParams, params, responseType, cancelToken,
  };
  console.log('BEFORE API Opetions::--->', JSON.stringify(options));
  try {
    const response = await axios(options);
    if (!response.data.status) {
      console.log('ERROR RESPONSE ::', response.data);
      throw (response.data.messages || response);
    }
    console.log('RESPONSE ::', response.data);
    return response.data;
  } catch (e) {
    const error = {
      withRenewToken,
      options,
    }
    console.log('SERVER WITHOUT AUTH ERROR ::--->', error);
    throw new Error(e);
  }
};

export default makeAPIWithoutAuthRequest;
