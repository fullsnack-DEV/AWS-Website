import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

const getUnreadCount = async () => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/notifications/unreadcount/`,
})

export default getUnreadCount
