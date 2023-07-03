import Config from 'react-native-config';

import makeAPIRequest from '../utils/Global';

const getUserToken = async (authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}users/streamtoken`,
    authContext,
  });

  export default getUserToken;