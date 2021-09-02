import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';
import makeElasticAPIRequest from '../utils/ElasticGloble';

const elasticBaseURL = 'https://townscup.es.us-east-1.aws.found.io:9243';
// 'https://townscup.es.us-east-1.aws.found.io:9243';

export const postElasticSearch = async (query, path) => makeElasticAPIRequest({
  method: 'post',
  url: `${elasticBaseURL}/${path}/_search`,
  data: query,
})

export const postMultiElasticSearch = async (query) => makeElasticAPIRequest({
  method: 'post',
  url: `${elasticBaseURL}/gameindex/_msearch`,
  data: query,
})

export const getElasticSearch = async (reservationEntityType, refereeId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}${reservationEntityType}/reservation/${refereeId}/estimateGameFee`,
  authContext,
})
