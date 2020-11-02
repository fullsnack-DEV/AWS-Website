import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const patchRegisterPlayerDetails = async (params) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/users`,
  data: params,
})

export const patchRegisterRefereeDetails = async (params) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/users`,
  data: params,
})

export const updateUserProfile = async (params) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/users/`,
  data: params,
})

export const getUsersList = async () => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/users`,
})

export const sendInvitationInGroup = async (params) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/users/invite`,
  data: params,
})

export const getUserDetails = (uid) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/users/${uid}`,
});

export const createUser = async (params) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/users/`,
  data: params,
})

export const getUsers = async () => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/users/`,
});

export const getGallery = async (userID) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/players/${userID}/gallery/`,
});
