import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

const normalApiCall = async ({
  method,
  url,
  data,
  headers,
  params,
  responseType,
}) =>
  NetInfo.fetch().then(async (netStat) => {
    if (!netStat || !netStat.isConnected) {
      // showAlert(strings.networkConnectivityErrorMessage);
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
      return response.data;
    } catch (e) {
      throw new Error(e);
    }
  });

export default normalApiCall;
