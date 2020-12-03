import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const patchPlayer = async (params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/users`,
  data: params,
  authContext,
})

export const patchRegisterRefereeDetails = async (params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/users`,
  data: params,
  authContext,
})

export const updateUserProfile = async (params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/users/`,
  data: params,
  authContext,
})

export const getUserList = async (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/users`,
  authContext,
})

export const sendInvitationInGroup = async (params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/users/invite`,
  data: params,
  authContext,
})

export const getUserDetails = (uid, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/users/${uid}`,
  authContext,
});

export const createUser = async (params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/users/`,
  data: params,
  authContext,
})

export const getUsers = async (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/users/`,
  authContext,
});

export const getGallery = async (userID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/players/${userID}/gallery/`,
  authContext,
});

export const followUser = async (params, userID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/players/${userID}/follow`,
  data: params,
  authContext,
});

export const unfollowUser = async (params, userID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/players/${userID}/unfollow`,
  data: params,
  authContext,
});

export const inviteUser = async (params, userID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/users/${userID}/invite`,
  data: params,
  authContext,
});
