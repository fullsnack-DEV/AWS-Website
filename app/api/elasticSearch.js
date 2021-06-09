import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';
import makeElasticAPIRequest from '../utils/ElasticGloble';

export const postElasticSearch = async (query) => makeElasticAPIRequest({
  method: 'post',
  url: 'https://townscup.es.us-east-1.aws.found.io:9243/gameindex/game/_search',
  data: query,
})

export const getElasticSearch = async (reservationEntityType, refereeId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}${reservationEntityType}/reservation/${refereeId}/estimateGameFee`,
  authContext,
})
