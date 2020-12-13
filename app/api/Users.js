import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const patchPlayer = (params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/users`,
  data: params,
  authContext,
})

export const patchRegisterRefereeDetails = (params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/users`,
  data: params,
  authContext,
})

export const updateUserProfile = (params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/users/`,
  data: params,
  authContext,
})

export const getUserList = (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/users`,
  authContext,
})

export const sendInvitationInGroup = (params, authContext) => makeAPIRequest({
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

export const createUser = (params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/users/`,
  data: params,
  authContext,
})

export const getUsers = (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/users/`,
  authContext,
});

export const getGallery = (userID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/players/${userID}/gallery/`,
  authContext,
});

export const followUser = (params, userID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/players/${userID}/follow`,
  data: params,
  authContext,
});

export const unfollowUser = (params, userID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/players/${userID}/unfollow`,
  data: params,
  authContext,
});

export const inviteUser = (params, userID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/users/${userID}/invite`,
  data: params,
  authContext,
});

export const createPaymentMethod = (params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/payments/cards`,
  data: params,
  authContext,
});

export const paymentMethods = (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/payments/cards`,
  authContext,
});

export const merchantAuthDetail = (authID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/payments/teams/${authID}/authdetail`,
  authContext,
});

export const addMerchantAccount = (authID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/payments/teams/${authID}/token`,
  data: params,
  authContext,
});

export const attachPaymentMethod = (params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/payments/attachPaymentMethod`,
  data: params,
  authContext,
});

export const deletePaymentMethod = (paymentMehtodId, authContext) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}/payments/cards/${paymentMehtodId}`,
  authContext,
});
