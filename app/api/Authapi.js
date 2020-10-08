import {api} from '../utils/apiConstants';
import {makeAPIRequest} from '../utils/Global';

export const getuserDetail = async (uid) => {
  return makeAPIRequest({
    method: 'get',
    url: api.baseURL + api.auth.userDetail + uid,
  })
    .then((response) => {
      console.log('Get Client Details Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Get Client Details Error ::', error.response);
    });
};

export const createUser = async (params) => {
  return makeAPIRequest({
    method: 'post',
    url: api.baseURL + api.auth.addUser,
    params,
  })
    .then((response) => {
      console.log('Get Client Details Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Get Client Details Error ::', error.response);
    });
};
