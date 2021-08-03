import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const getGroupDetails = (groupID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/${groupID}`,
  authContext,
})

export const createGroup = (params, caller_id, caller, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}groups`,
  caller_id,
  caller,
  data: params,
  authContext,
})

export const createGroupRequest = (params, caller_id, caller, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}groups/request`,
  caller_id,
  caller,
  data: params,
  authContext,
})

export const getGroupSearch = (name, city, teamID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/exist?group_name=${name}&city=${city}&team_id=${teamID}`,
  authContext,
})

export const getGroupName = (name, city, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/exist?group_name=${name}&city=${city}`,
  authContext,
})

export const getGroupRequest = (requestType, groupID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/groups/request/${requestType}/${groupID}`,
  authContext,
})

// export const getJoinedGroups = (player_id = undefined, authContext) => {
//   const query = player_id ? `?player_id= + ${player_id}` : ''
//   return makeAPIRequest({
//     method: 'get',
//     url: `${Config.BASE_URL}groups/joined${query}`,
//     authContext,
//   })
// }
export const getJoinedGroups = (entityType = '', authContext) => {
  const q = entityType === '' ? '' : `&entity_type=${entityType}`
  return makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}groups/joined?${q}`,
    authContext,
  })
  }

  export const getGroups = (authContext) => makeAPIRequest({
      method: 'get',
      url: `${Config.BASE_URL}groups/joined`,
      authContext,
    })

    export const getTeamPendingRequest = (authContext) => makeAPIRequest({
      method: 'get',
      url: `${Config.BASE_URL}groups/pending`,
      authContext,
    })

export const getTeamsOfClub = (clubID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/${clubID}/teams`,
  authContext,
})

export const getGroupFollowers = (group_id, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/${group_id}/followers`,
  authContext,
})

export const getGroupMembers = (group_id, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/${group_id}/members`,
  authContext,
})

export const getGroupMembersInfo = (groupID, memberID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}groups/${groupID}/members/${memberID}`,
  authContext,
})

export const connectProfile = (groupID, memberID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}groups/${groupID}/members/${memberID}/connect`,
  authContext,
})

export const createMemberProfile = (groupID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}groups/${groupID}/members/`,
  data: params,
  authContext,
})

export const patchGroup = (groupID, params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}groups/${groupID}`,
  data: params,
  authContext,
})

export const searchGroups = (params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}groups/search/`,
  params,
  authContext,
})

export const getMyGroups = (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}groups/`,
  authContext,
});

export const patchMember = (groupID, memberID, params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}groups/${groupID}/members/${memberID}`,
  data: params,
  authContext,
})

export const deleteMember = (groupID, memberID, authContext) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}groups/${groupID}/members/${memberID}`,
  authContext,
})

export const followGroup = (params, groupID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/groups/${groupID}/follow`,
  data: params,
  authContext,
});

export const unfollowGroup = (params, groupID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/groups/${groupID}/unfollow`,
  data: params,
  authContext,
});

export const joinTeam = (params, groupID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/groups/${groupID}/join`,
  data: params,
  authContext,
});

export const leaveTeam = (params, groupID, authContext) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}/groups/${groupID}/join`,
  data: params,
  authContext,
});

export const inviteTeam = (params, groupID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/groups/${groupID}/inviteTeams`,
  data: params,
  authContext,
});

export const updateGroupProfile = (params, groupID, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/groups/${groupID}`,
  data: params,
  authContext,
})
