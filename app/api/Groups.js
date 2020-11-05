import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const getGroupDetails = async (groupID) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/${groupID}`,
})

export const createGroup = async (params, caller_id, caller) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/groups`,
  caller_id,
  caller,
  data: params,
})

export const getJoinedGroups = async (player_id = undefined) => {
  const query = player_id ? `?player_id= + ${player_id}` : ''
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}groups/joined${query}`,
  })
}

export const getTeamsOfClub = async (clubID) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/${clubID}/teams`,
})

export const getGroupFollowers = async (group_id) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/${group_id}/followers`,
})

export const getGroupMembers = async (group_id) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/${group_id}/members`,
})

export const getGroupMembersInfo = async (groupID, memberID) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}groups/${groupID}/members/${memberID}`,
})

export const connectProfile = async (groupID, memberID) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}groups/${groupID}/members/${memberID}/connect`,
})

export const createMemberProfile = async (groupID, params) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}groups/${groupID}/members/`,
  data: params,
})

export const patchGroup = async (groupID, params) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}groups/${groupID}`,
  data: params,
})

export const searchGroups = async (params) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}groups/search/`,
  params,
})

export const getMyGroups = async () => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}groups/`,
});

export const patchMember = async (groupID, memberID, params) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}groups/${groupID}/members/${memberID}`,
  data: params,
})
export const deleteMember = async (groupID, memberID) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}groups/${groupID}/members/${memberID}`,
})
