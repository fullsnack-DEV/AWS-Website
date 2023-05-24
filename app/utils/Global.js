/* eslint-disable no-promise-executor-return */
/* eslint-disable import/no-cycle */
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import firebase from '@react-native-firebase/app';
import jwtDecode from 'jwt-decode';
import * as Utility from '.';
import {strings} from '../../Localization/translation';

const prepareHeader = (headers, authToken, caller_id, caller) => {
  let apiHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (authToken) {
    apiHeaders = {...apiHeaders, Authorization: `Bearer ${authToken}`};
  }
  if (caller_id) {
    apiHeaders = {...apiHeaders, caller_id};
  }
  if (caller) {
    apiHeaders = {...apiHeaders, caller};
  }
  apiHeaders = {...apiHeaders, ...headers};

  return apiHeaders;
};

const resetApp = async (authContext) => {
  await Utility.onLogout(authContext);
};

const getRefereshToken = () =>
  new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      unsubscribe();
      const refreshedToken = await user
        .getIdTokenResult(true)
        .catch((err) => console.error(err));
      resolve(refreshedToken);
    }, reject);
  });
const makeAPIRequest = async ({
  method,
  url,
  data,
  headers,
  params,
  responseType,
  authContext,
  cancelToken,
}) =>
  NetInfo.fetch().then(async (netStat) => {
    if (!netStat || !netStat.isConnected) {
      throw new Error(strings.networkConnectivityErrorMessage);
    } else {
      let withRenewToken = false;
      const tokenData = authContext?.tokenData;
      let authToken = tokenData.token;
      const {exp} = await jwtDecode(authToken);
      const expiryDate = new Date(exp * 1000);
      const currentDate = new Date();
      if (expiryDate.getTime() > currentDate.getTime()) {
        return globalApiCall({
          method,
          url,
          data,
          headers,
          params,
          responseType,
          authContext,
          withRenewToken,
          authToken,
          cancelToken,
        });
      }
      withRenewToken = true;
      console.log('Token Expired');
      return new Promise((resolve, reject) =>
        getRefereshToken()
          .then(async (refereshToken) => {
            authToken = refereshToken.token;
            const token = {
              token: refereshToken.token,
              expirationTime: refereshToken.expirationTime,
            };
            await authContext.setTokenData(token);
            resolve(
              globalApiCall({
                method,
                url,
                data,
                headers,
                params,
                responseType,
                authContext,
                withRenewToken,
                authToken,
                cancelToken,
              }),
            );
          })
          .catch((error) => {
            console.log('Token Related: ', error);
            resetApp(authContext);
            reject(error);
          }),
      );
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
  withRenewToken,
  cancelToken,
}) => {
  const entity = authContext?.entity;

  let caller_id;
  let caller;
  if (entity.role === 'team' || entity.role === 'club') {
    caller_id = entity.uid;
    caller = entity.role;
  }
  const headersParams = prepareHeader(headers, authToken, caller_id, caller);

  const options = {
    method,
    url,
    data,
    headers: headersParams,
    params,
    responseType,
    cancelToken,
  };
  // console.log('BEFORE API Opetions::--->', JSON.stringify(options));
  try {
    const response = await axios(options);
    if (!response.data.status) {
      console.log('ERROR RESPONSE ::', response.data);
      throw response.data.messages || response;
    }
    // console.log('RESPONSE ::', options, '\n', response.data);
    return response.data;
  } catch (e) {
    const error = {
      withRenewToken,
      options,
      error: e,
    };
    console.log('SERVER ERROR ::--->', error);
    throw new Error(e);
  }
};

export default makeAPIRequest;
