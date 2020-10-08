import {api} from '../utils/apiConstants';
import {makeAPIRequest} from '../utils/Global';

export const patchRegisterPlayerDetails = async (params) => {
  return makeAPIRequest({
    method: 'patch',
    url: api.baseURL + api.account.registerPlayer,
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

export const getParentClubDetail = async (groupID) => {
  return makeAPIRequest({
    method: 'get',
    url: api.baseURL + api.account.parentClubDetail + groupID,
  })
    .then((response) => {
      console.log('Get Client Details Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Get Client Details Error ::', error.response);
    });
};

export const getUnreadCount = async () => {
  return makeAPIRequest({
    method: 'get',
    url: api.baseURL + api.account.unreadCount,
  })
    .then((response) => {
      console.log('Get Client Details Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Get Client Details Error ::', error.response);
    });
};

export const postGroups = async (params, caller_id, caller) => {
  return makeAPIRequest({
    method: 'post',
    url: api.baseURL + api.account.createGroups,
    caller_id: caller_id,
    caller: caller,
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
