import axios from 'axios';

import NetInfo from '@react-native-community/netinfo';

// eslint-disable-next-line import/no-cycle
import {showAlert} from '.';

import {strings} from '../../Localization/translation';

const apiCall = async ({method, url, data, headers, params, responseType}) =>
  NetInfo.fetch().then(async (netStat) => {
    if (!netStat || !netStat.isConnected) {
      showAlert(strings.networkConnectivityErrorMessage);
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
        throw response.data.messages || response;
      }
      return response.data;
    } catch (e) {
      throw new Error(e);
    }
  });

export default apiCall;
