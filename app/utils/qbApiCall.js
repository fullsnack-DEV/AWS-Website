import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import strings from '../Constants/String';

const qbApiCall = async ({
  method,
  url,
  data,
  qbToken,
  params,
  responseType,
}) => NetInfo.fetch().then(async (netStat) => {
  if (!netStat || !netStat.isConnected) {
    Alert.alert(strings.alertmessagetitle, strings.networkConnectivityErrorMessage)
    throw new Error('no-internet');
  }
  const options = {
    method,
    url,
    data,
    headers: {
      'Content-Type': 'application/json',
      'QB-Token': qbToken,
    },
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

export default qbApiCall;
