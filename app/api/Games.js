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

const getGameScoreboardEvents = async (userID, params) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/users/${userID}`,
  params,
})

const getGameStatsChartData = async (userID, params) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/teams/${userID}/games/stats/chart`,
  params,
})

const getGameStatsData = async (userID, params) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/teams/${userID}/games/stats`,
  params,
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

const getGameLineUp = (teamId, gameId) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}teams/${teamId}/games/${gameId}/roster?fetchNonRoster=true&reviewStatus=true`,
})
const getGameGallery = (gameId) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/${gameId}/gallery`,
})
const createGameLineUp = (teamId, gameId, params) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}teams/${teamId}/games/${gameId}/roster`,
  data: params,
})
const deleteGameLineUp = (teamId, gameId, params) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}teams/${teamId}/games/${gameId}/removeMembers`,
  data: params,
})
const getGameByGameID = (gameId) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}games/${gameId}?fetchTeamObject=true&fetchCallerReview=true`,
})
const addGameRecord = (gameId, params) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}games/${gameId}/records`,
  data: params,
})
const resetGame = (gameId) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}games/${gameId}/resetGame`,
  data: {},
})
const decreaseGameScore = (teamId, gameId) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}teams/${teamId}/games/${gameId}/decreaseScore`,
})

const addGameReview = (gameId, params) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/games/${gameId}/reviews`,
  data: params,
})

export {
  GameRecordStatus,
  getSportsList,
  getGameData,
  getGameMatchRecords,
  approveDisapproveGameRecords,
  getGameStats,
  getGameReviews,
  getGameLineUp,
  getGameGallery,
  createGameLineUp,
  deleteGameLineUp,
  getGameByGameID,
  addGameRecord,
  resetGame,
  decreaseGameScore,
  addGameReview,
  getGameScoreboardEvents,
  getGameStatsChartData,
  getGameStatsData,
}
