import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const getGroupDetails = async (groupID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/${groupID}`,
  authContext,
})

export const createGroup = async (params, caller_id, caller, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/groups`,
  caller_id,
  caller,
  data: params,
  authContext,
})

export const getJoinedGroups = async (player_id = undefined, authContext) => {
  const query = player_id ? `?player_id= + ${player_id}` : ''
  return makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}groups/joined${query}`,
    authContext,
  })
}

export const getTeamsOfClub = async (clubID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/${clubID}/teams`,
  authContext,
})

export const getGroupFollowers = async (group_id, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/${group_id}/followers`,
  authContext,
})

export const getGroupMembers = async (group_id, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/${group_id}/members`,
  authContext,
})

export const getGroupMembersInfo = async (groupID, memberID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}groups/${groupID}/members/${memberID}`,
  authContext,
})

export const connectProfile = async (groupID, memberID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}groups/${groupID}/members/${memberID}/connect`,
  authContext,
})

export const createMemberProfile = async (groupID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}groups/${groupID}/members/`,
  data: params,
  authContext,
})

export const patchGroup = async (groupID, params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}groups/${groupID}`,
  data: params,
  authContext,
})

export const searchGroups = async (params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}groups/search/`,
  params,
  authContext,
})

export const getMyGroups = async (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}groups/`,
  authContext,
});

export const patchMember = async (groupID, memberID, params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}groups/${groupID}/members/${memberID}`,
  data: params,
  authContext,
})

export const deleteMember = async (groupID, memberID, authContext) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}groups/${groupID}/members/${memberID}`,
  authContext,
})

export const followGroup = async (params, groupID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/groups/${groupID}/follow`,
  data: params,
  authContext,
});

export const unfollowGroup = async (params, groupID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/groups/${groupID}/unfollow`,
  data: params,
  authContext,
});

export const joinTeam = async (params, groupID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/groups/${groupID}/join`,
  data: params,
  authContext,
});

export const leaveTeam = async (params, groupID, authContext) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}/groups/${groupID}/join`,
  data: params,
  authContext,
});

export const inviteTeam = async (params, groupID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/groups/${groupID}/inviteTeams`,
  data: params,
  authContext,
});

export const updateGroupProfile = async (params, groupID, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/groups/${groupID}`,
  data: params,
  authContext,
})
