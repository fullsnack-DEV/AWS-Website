// import Config from 'react-native-config';
import envs from '../../src/config/env';

import makeAPIRequest from '../utils/Global';

const { BASE_URL } = envs;
const getImagePreSignedURL = async (params, authContext, cancelToken) => makeAPIRequest({
  method: 'get',
  url: `${BASE_URL}/pre-signed-url`,
  params,
  authContext,
  cancelToken,
});

export default getImagePreSignedURL
