import Config from 'react-native-config';

import makeAPIRequest from '../utils/Global';

const getImagePreSignedURL = async (params, authContext, cancelToken) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/pre-signed-url`,
  params,
  authContext,
  cancelToken,
});

export default getImagePreSignedURL
