/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

import {strings} from '../../Localization/translation';
// eslint-disable-next-line import/no-cycle
import * as Utility from './index';

const makeElasticAPIRequest = async ({method, url, data}) =>
  NetInfo.fetch().then(async (netStat) => {
    if (!netStat || !netStat.isConnected) {
      throw new Error(strings.networkConnectivityErrorMessage);
    } else {
      return globalElasticApiCall({
        method,
        url,
        data,
      });
    }
  });

const globalElasticApiCall = async ({method, url, data}) => {
  const elasticCredential = await Utility.getStorage('appSetting');
  const URL = `${elasticCredential?.elastic?.host}${url}`;
  const options = {
    method,
    url: URL,
    data,
    auth: {
      username: elasticCredential?.elastic?.username,
      password: elasticCredential?.elastic?.password,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios(options);
    return response?.data?.hits?.hits?.map((item) => item?._source);
  } catch (error) {
    console.log('SERVER ELASTIC ERROR ::--->', error.response.status);
    
    if (error.response) {
      // Request made and server responded
      if (error.response.status === 404) {
        return [];
      }
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }

    throw new Error(error);
  }
};

export default makeElasticAPIRequest;
