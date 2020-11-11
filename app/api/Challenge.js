import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const getFeesEstimation = async (entityID, params) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}challenge/${entityID}/estimateGameFee`,
  data: params,
})

export const getGroupDetails = async (entityID) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}challenge/${entityID}/estimateGameFee`,
})
