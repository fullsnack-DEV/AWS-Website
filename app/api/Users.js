 import Config from 'react-native-config';

import makeAPIRequest from '../utils/Global';
import makeAPIWithoutAuthRequest from '../utils/GlobleWithoutAuth';

import apiCall from '../utils/apiCall';

export const getAppSettings = (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/users/settings`,
  authContext,
  headers: {
    setting_token: '3c5a5976-4831-41b3-a0cb-1aeb9d2e2c1c',
  },
});

export const getAppSettingsWithoutAuth = () => makeAPIWithoutAuthRequest({
  method: 'get',
  url: `${Config.BASE_URL}/app/settings`,
  headers: {
    setting_token: '3c5a5976-4831-41b3-a0cb-1aeb9d2e2c1c',
  },
});

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

export const patchRegisterScorekeeperDetails = (params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/users`,
  data: params,
  authContext,
})

export const updateUserProfile = (params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/users`,
  data: params,
  authContext,
})

// export const getUserList = (authContext) => makeAPIRequest({
//   method: 'get',
//   url: `${Config.BASE_URL}/users`,
//   authContext,
// })

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
export const checkTownscupEmail = (email) => apiCall({
  method: 'get',
  url: `${Config.BASE_URL}/users/townscup?email=${email}`,
})

export const getUsers = (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/users/`,
  authContext,
});

export const getUsersByEmail = (email, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/users?email=${email}`,
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

export const payoutMethods = (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/payments/accounts`,
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
export const deletePayoutMethod = (authContext) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}/payments/merchant`,
  authContext,
});

export const getUserFollowerFollowing = (userId, entity_type, type, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/${entity_type}/${userId}/${type}`,
  authContext,
})

export const getUserDoubleTeamFollower = (sportName, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/doubleteam/member?sport=${sportName}`,
  authContext,
})
