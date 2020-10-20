import Config from 'react-native-config';
import api from '../utils/apiConstants';
import makeAPIRequest from '../utils/Global';

export const getuserDetail = function (uid) {
  return makeAPIRequest({
    method: 'get',
    url: Config.BASE_URL + api.auth.userDetail + uid,
  });
};

export const createUser = async (params) => makeAPIRequest({
  method: 'post',
  url: Config.BASE_URL + api.auth.addUser,
  data: params,
})
  .then((response) => Promise.resolve(response.data))
  .catch((error) => {
    console.log('Get Client Details error ::', error.response);
    alert('Get Client Details Error ::', error.response);
  });

export const getSportsList = async () => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.auth.sportsList,
})
  .then((response) => {
    console.log('Get Client Details Response ::', response);
    return Promise.resolve(response.data);
  })
  .catch((error) => {
    alert('Get Client Details Error ::', error.response);
  });

export const searchLocationList = async (query) => makeAPIRequest({
  method: 'get',
  url: api.auth.locationSearch + query,
})
  .then((response) => {
    console.log('Get Client Details Response ::', response);
    return Promise.resolve(response.data);
  })
  .catch((error) => {
    alert('Get Client Details Error ::', error.response);
  });

export const searchGroupList = async (params) => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.auth.groupSearch,
  params,
})
  .then((response) => {
    console.log('Get Client Details Response ::', response);
    return Promise.resolve(response.data);
  })
  .catch((error) => {
    alert('Get Client Details Error ::', error.response);
  });
