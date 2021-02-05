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
  url: `${Config.BASE_URL}/games/${gameId}?fetchTeamObject=${fetchTeamData}&fetchCallerReview=true`,
  authContext,
})

const getGameScoreboardEvents = async (userID, params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/users/${userID}`,
  params,
  authContext,
})

const getRefereedMatch = async (userID, sport, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/users/${userID}?sport=${sport}&role=referee`,
  authContext,
})

const deleteGameRecord = (gameId, recordId, authContext) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}games/${gameId}/records/${recordId}`,
  authContext,
});

const patchGameRecord = (gameId, recordId, data, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}games/${gameId}/records/${recordId}`,
  data,
  authContext,
});

const getGameFeed = async (params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/posts/`,
  params,
  authContext,
});

const createGamePost = async (bodyParams, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/posts`,
  data: bodyParams,
  authContext,
});

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

const getGameMatchRecords = async (gameId, authContext, extraQuery) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/${gameId}/records?fetchTeamObject=true&${extraQuery}`,
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

const getTeamReviews = (teamId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/teams/${teamId}/reviews`,
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
const getAllLineUp = (gameId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}games/${gameId}/roster`,
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
const patchGameReview = (gameId, reviewId, params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/games/${gameId}/reviews/${reviewId}`,
  data: params,
  authContext,
})

const getGameReview = (gameId, reviewId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/${gameId}/reviews/${reviewId}`,
  authContext,
})

const addPlayerReview = (playerId, gameId, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}players/${playerId}/games/${gameId}/reviews`,
  data: params,
  authContext,
})
const addRefereeReview = (refereeId, gameId, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}referees/${refereeId}/games/${gameId}/reviews`,
  data: params,
  authContext,
})

const patchRefereeReview = (refereeId, gameId, reviewID, params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}referees/${refereeId}/games/${gameId}/reviews/${reviewID}`,
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

const getRefereeReviewData = async (userID, sport, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/users/${userID}/reviews?sport=${sport}&role=referee`,
  authContext,
})

const getGameSlots = async (entity_type, entity_id, queryString, headers, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/${entity_type}/${entity_id}/slots/games?${queryString}`,
  headers,
  authContext,
});

const getGameRefereeReservation = (gameId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/referees/game/${gameId}/reservation`,
  authContext,
});

const getGameScorekeeperReservation = (gameId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/scorekeepers/game/${gameId}/reservation?scorekeeper_detail=true`,
  authContext,
});

const getScroreboardGameDetails = (userID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}teams/${userID}/games?status=ended`,
  authContext,
});

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
  getGameSlots,
  getGameRefereeReservation,
  getGameScorekeeperReservation,
  getScroreboardGameDetails,
  deleteGameRecord,
  patchGameRecord,
  getRefereedMatch,
  getGameFeed,
  createGamePost,
  addPlayerReview,
  getGameReview,
  patchGameReview,
  addRefereeReview,
  patchRefereeReview,
  getAllLineUp,
  getTeamReviews,
}
