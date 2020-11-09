import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const blockedSlots = async (groupID) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}team/${groupID}/slots`,
})

export default blockedSlots;
