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
    data: params,
  })
    .then((response) => {
      console.log('Get Client Details Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Get Client Details Error ::', error.response);
    });
};

export const getSportsList = async () => {
  return makeAPIRequest({
    method: 'get',
    url: api.baseURL + api.auth.sportsList,
  })
    .then((response) => {
      console.log('Get Client Details Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Get Client Details Error ::', error.response);
    });
};

export const searchLocationList = async (query) => {
  return makeAPIRequest({
    method: 'get',
    url: api.auth.locationSearch + query,
  })
    .then((response) => {
      console.log('Get Client Details Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Get Client Details Error ::', error.response);
    });
};

export const searchGroupList = async (params) => {
  return makeAPIRequest({
    method: 'get',
    url: api.baseURL + api.auth.groupSearch,
    params: params,
  })
    .then((response) => {
      console.log('Get Client Details Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Get Client Details Error ::', error.response);
    });
};
