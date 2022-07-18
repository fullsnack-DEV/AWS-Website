import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import {Alert} from 'react-native';
import strings from '../Constants/String';

const apiCall = async ({method, url, data, headers, params, responseType}) =>
  NetInfo.fetch().then(async (netStat) => {
    if (!netStat || !netStat.isConnected) {
      Alert.alert(
        strings.alertmessagetitle,
        strings.networkConnectivityErrorMessage,
      );
      throw new Error('no-internet');
    }
    const options = {
      method,
      url,
      data,
      headers,
      params,
      responseType,
    };

    try {
      const response = await axios(options);
      console.log('Opetions ::', options);
      if (!response.data.status) {
        console.log('ERROR RESPONSE ::', response.data);
        throw response.data.messages || response;
      }
      console.log('RESPONSE ::', response.data);
      return response.data;
    } catch (e) {
      throw new Error(e);
    }
  });

export default apiCall;
