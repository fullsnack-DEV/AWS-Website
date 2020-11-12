import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const patchPlayer = async (params) => makeAPIRequest({
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

export const getUserList = async () => makeAPIRequest({
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

export const followUser = async (params, userID) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/players/${userID}/follow`,
  data: params,
});

export const unfollowUser = async (params, userID) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/players/${userID}/unfollow`,
  data: params,
});

export const inviteUser = async (params, userID) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/users/${userID}/invite`,
  data: params,
});
