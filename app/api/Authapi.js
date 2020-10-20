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

export const getSportsList = async () => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.auth.sportsList,
})

export const searchLocationList = async (query) => makeAPIRequest({
  method: 'get',
  url: api.auth.locationSearch + query,
})

export const searchGroupList = async (params) => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.auth.groupSearch,
  params,
})
