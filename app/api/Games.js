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
const getSportsList = async (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/sports/`,
  authContext,
})

const getGameData = async (gameId, fetchTeamData = false, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/${gameId}?fetchTeamObject=${fetchTeamData}`,
  authContext,
})

const getGameScoreboardEvents = async (userID, params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/users/${userID}`,
  params,
  authContext,
})

const getGameStatsChartData = async (userID, params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/teams/${userID}/games/stats/chart`,
  params,
  authContext,
})

const getGameStatsData = async (userID, params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/teams/${userID}/games/stats`,
  params,
  authContext,
})

const getGameMatchRecords = async (gameId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/${gameId}/records?fetchTeamObject=true`,
  authContext,
})

const approveDisapproveGameRecords = (gameId, teamId, type = 'approve', params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/teams/${teamId}/games/${gameId}/${type}`,
  data: params,
  authContext,
})

const getGameStats = (gameId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/${gameId}/stats`,
  authContext,
})

const getGameReviews = (gameId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/${gameId}/reviews`,
  authContext,
})

const getGameLineUp = (teamId, gameId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}teams/${teamId}/games/${gameId}/roster?fetchNonRoster=true&reviewStatus=true`,
  authContext,
})

const getGameGallery = (gameId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/${gameId}/gallery`,
  authContext,
})
const createGameLineUp = (teamId, gameId, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}teams/${teamId}/games/${gameId}/roster`,
  data: params,
  authContext,
})
const deleteGameLineUp = (teamId, gameId, params, authContext) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}teams/${teamId}/games/${gameId}/removeMembers`,
  data: params,
  authContext,
})
const getGameByGameID = (gameId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}games/${gameId}?fetchTeamObject=true&fetchCallerReview=true`,
  authContext,
})
const addGameRecord = (gameId, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}games/${gameId}/records`,
  data: params,
  authContext,
})
const resetGame = (gameId, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}games/${gameId}/resetGame`,
  data: {},
  authContext,
})
const decreaseGameScore = (teamId, gameId, authContext) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}teams/${teamId}/games/${gameId}/score`,
  authContext,
})

const addGameReview = (gameId, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/games/${gameId}/reviews`,
  data: params,
  authContext,
})
const getGameRoster = (gameId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}games/${gameId}/roster`,
  authContext,
})

const getGameUser = (sportName, userType, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}users/${userType}?sport=${sportName}`,
  authContext,
});

const getRefereeReviewData = async (userID, params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/users/${userID}/reviews`,
  params,
  authContext,
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
  getGameRoster,
  getRefereeReviewData,
  getGameUser,
}
