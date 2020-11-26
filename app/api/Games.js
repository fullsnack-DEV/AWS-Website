import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

const GameRecordStatus = {
  Approve: 'approve',
  Disapprove: 'disapprove',
  CancelApprove: 'cancelApprove',
  CancelDisApprove: 'cancelDisApprove',
  ApprovedByAll: 'approvedByAll',
  DisApprovedByAll: 'disapprovedByAll',
}
const getSportsList = async () => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/sports/`,
})

const getGameData = async (gameId, fetchTeamData = false) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/${gameId}?fetchTeamObject=${fetchTeamData}`,
})

const getGameMatchRecords = async (gameId) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/${gameId}/records?fetchTeamObject=true`,
})

const approveDisapproveGameRecords = (gameId, teamId, type = 'approve', params) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/teams/${teamId}/games/${gameId}/${type}`,
  data: params,
})

const getGameStats = (gameId) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/${gameId}/stats`,
})

const getGameReviews = (gameId) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/${gameId}/reviews`,
})

export {
  GameRecordStatus,
  getSportsList,
  getGameData,
  getGameMatchRecords,
  approveDisapproveGameRecords,
  getGameStats,
  getGameReviews,
}
