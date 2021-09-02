import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

import strings from '../Constants/String';
import * as Utility from '.';

const makeElasticAPIRequest = async ({ method, url, data }) => NetInfo.fetch().then(async (netStat) => {
    const elasticCredential = await Utility.getStorage('appSetting');
console.log('elasticCredential', elasticCredential);
    if (!netStat || !netStat.isConnected) {
      throw new Error(strings.networkConnectivityErrorMessage);
    } else {
      return globalApiCall({
        method,
        url,
        data,
        auth: {
          username: elasticCredential?.elastic_cred?.user_name,
          password: elasticCredential?.elastic_cred?.pwd,
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
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const elasticCredential = await Utility.getStorage('appSetting');

  options.auth.username = elasticCredential?.elastic_cred?.user_name;
  options.auth.password = elasticCredential?.elastic_cred?.pwd;
  console.log('API Opetions elastic::--->', JSON.stringify(options));
  try {
    const response = await axios(options);
    if (!response.data) {
      console.log('ERROR RESPONSE ::', response.data);
      throw response.data.messages || response;
    }
    console.log('RESPONSE ::', response.data);
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

// const globalApiCall = async ({
//   method, url, data, auth,
//   }) => {
//      const dataa = '{ }\n{"query" : {"match" : { "message": "this is a test"}}}\n{"index": "entityindex"}\n{"query" : {"match_all" : {}}}\n';

//      console.log('data:=>', data);
//      console.log('dataa:=>', dataa);
// const config = {
//  method: 'post',
//  url: 'https://townscup.es.us-east-1.aws.found.io:9243/gameindex/_msearch',
//  headers: {
//  'Content-Type': 'application/json',
//  Authorization: 'Basic ZWxhc3RpYzp0cVJQaFlGbmpxR3VoOTliTHA0RjZqWlo=',
//  },
//  data,
// };

// axios(config)
// .then((response) => {
//  console.log(JSON.stringify(response.data));
// })
// .catch((error) => {
//  console.log(error);
// });
//  };

export default makeElasticAPIRequest;
