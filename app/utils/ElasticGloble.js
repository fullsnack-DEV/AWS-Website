import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

import strings from '../Constants/String';

const makeElasticAPIRequest = async ({ method, url, data }) => NetInfo.fetch().then(async (netStat) => {
    if (!netStat || !netStat.isConnected) {
      throw new Error(strings.networkConnectivityErrorMessage);
    } else {
      return globalApiCall({
        method,
        url,
        data,
        auth: {
          username: 'elastic',
          password: 'tqRPhYFnjqGuh99bLp4F6jZZ',
        },
      });
    }
  });

const globalApiCall = async ({
 method, url, data, auth,
 }) => {
  const options = {
    method,
    url,
    data,
    auth,
  };
  console.log('BEFORE API Opetions::--->', JSON.stringify(options));
  try {
    const response = await axios(options);
    if (!response.data.hits) {
      console.log('ERROR RESPONSE ::', response.data);
      throw response.data.messages || response;
    }
    console.log('RESPONSE ::', response.data);
    return response.data;
  } catch (e) {
    const error = {
      options,
    };
    console.log('SERVER ERROR ::--->', error);
    throw new Error(e);
  }
};

export default makeElasticAPIRequest;
