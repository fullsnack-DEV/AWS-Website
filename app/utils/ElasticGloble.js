/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

import strings from '../Constants/String';
// eslint-disable-next-line import/no-cycle
import * as Utility from './index';

const makeElasticAPIRequest = async ({ method, url, data }) => NetInfo.fetch().then(async (netStat) => {
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

const globalElasticApiCall = async ({
 method, url, data,
 }) => {
  const elasticCredential = await Utility.getStorage('appSetting');

  const options = {
    method,
    url,
    data,
    auth: {
      username: elasticCredential?.elastic_cred?.user_name,
      password: elasticCredential?.elastic_cred?.pwd,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios(options);
    // if (response.data.error) {
    //   console.log('ERROR RESPONSE ::', response.data.error);
    //   throw response.data.error;
    // }
    console.log('RESPONSE ELASTIC ::', response.data.hits.hits.map((item) => item._source));
    return response.data.hits.hits.map((item) => item._source);
  } catch (e) {
    console.log('SERVER ERROR ::--->', e);
    throw new Error(e);
  }
};

export default makeElasticAPIRequest;
