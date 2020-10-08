import {api} from '../utils/apiConstants';
import {makeAPIRequest} from '../utils/Global';

export const getNewsFeedDetails = async () => {

  return makeAPIRequest({
    method: 'get',
    url: api.baseURL + api.newsFeed.newsFeedDetail,
    // headers: headers,
  })
    .then((response) => {
      console.log('Get Client Details Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Get Client Details Error ::', error.response);
    });
};
