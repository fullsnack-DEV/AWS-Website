/* eslint-disable no-promise-executor-return */
/* eslint-disable import/no-cycle */
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

import * as Utility from '.';

import {strings} from '../../Localization/translation';

const prepareHeader = (headers) => {
  let apiHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  apiHeaders = {...apiHeaders, ...headers};

  return apiHeaders;
};

const makeAPIRequest = async ({method, url, headers, responseType}) =>
  NetInfo.fetch().then(async (netStat) => {
    const setting = await Utility.getStorage('appSetting');
    const key = `${url}&key=${setting.google_place_key}`;

    if (!netStat || !netStat.isConnected) {
      throw new Error(strings.networkConnectivityErrorMessage);
    } else {
      return googleApiCall({
        method,
        url: key,
        headers,
        responseType,
      });
    }
  });

const googleApiCall = async ({method, url, headers}) => {
  const options = {
    method,
    url,
    headers: prepareHeader(headers),
  };
  console.log('BEFORE API Opetions::--->', JSON.stringify(options));
  try {
    const response = await axios(options);
    if (!response.data.status) {
      console.log('ERROR RESPONSE ::', response.data);
      throw response.data.messages || response;
    }
    console.log('RESPONSE ::', options, '\n', response.data);
    return response.data;
  } catch (e) {
    const error = {
      options,
      error: e,
    };
    console.log('SERVER ERROR ::--->', error);
    throw new Error(e);
  }
};

export default makeAPIRequest;
