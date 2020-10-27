import Config from 'react-native-config';
import api from '../utils/endPoints';
import makeAPIRequest from '../utils/Global';

export const patchRegisterPlayerDetails = async (params) => makeAPIRequest({
  method: 'patch',
  url: Config.BASE_URL + api.account.registerPlayer,
  data: params,
})

export const patchRegisterRefereeDetails = async (params) => makeAPIRequest({
  method: 'patch',
  url: Config.BASE_URL + api.account.registerPlayer,
  data: params,
})

export const getParentClubDetail = async (groupID) => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.account.parentClubDetail + groupID,
})

export const getUnreadCount = async () => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.account.unreadCount,
})

export const postGroups = async (params, caller_id, caller) => makeAPIRequest({
  method: 'post',
  url: Config.BASE_URL + api.account.createGroups,
  caller_id,
  caller,
  data: params,
})

export const getJoinedTeams = async () => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.account.joinedTeams,
})

export const getTeamsByClub = async (clubID) => makeAPIRequest({
  method: 'get',
  url:
      Config.BASE_URL
      + api.account.parentClubDetail
      + clubID
      + api.account.teamsByClub,
})

export const updateUserProfile = async (params) => makeAPIRequest({
  method: 'patch',
  url:
      Config.BASE_URL
      + api.account.registerPlayer,
  data: params,
})

export const getUsersList = async () => makeAPIRequest({
  method: 'get',
  url:
      Config.BASE_URL
      + api.account.registerPlayer,
})

export const getFollowersList = async (group_id) => makeAPIRequest({
  method: 'get',
  url:
      Config.BASE_URL
      + api.account.parentClubDetail + group_id + api.account.followers,
})

export const getMembersList = async (group_id) => makeAPIRequest({
  method: 'get',
  url:
      Config.BASE_URL
      + api.account.parentClubDetail + group_id + api.account.members,
})
export const sendInvitationInGroup = async (params) => makeAPIRequest({
  method: 'post',
  url:
      Config.BASE_URL
      + api.account.sendInvitation,
  data: params,
})
