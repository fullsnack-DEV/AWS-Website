import {api} from '../utils/apiConstants';
import {makeAPIRequest} from '../utils/Global';

export const getNewsFeedDetails = async () => {
  return makeAPIRequest({
    method: 'get',
    url: api.baseURL + api.newsFeed.newsFeedDetail,
  })
    .then((response) => {
      console.log('Get News Feed Details Response ::', response);
      return Promise.resolve(response.data.payload.results);
    })
    .catch((error) => {
      console.log('Get News Feed Details Error ::', error.response);
    });
};

export const getPostDetails = async () => {
  return makeAPIRequest({
    method: 'get',
    url: api.baseURL + api.newsFeed.postDetail,
  })
    .then((response) => {
      console.log('Get Post Details Response ::', response);
      return Promise.resolve(response.data.payload.results);
    })
    .catch((error) => {
      console.log('Get Post Details Error ::', error.response);
    });
};
