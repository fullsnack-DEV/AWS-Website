/* eslint-disable default-param-last */
import Config from 'react-native-config';

import makeAPIRequest from '../utils/Global';

const GameRecordStatus = {
  Approve: 'approve',
  Disapprove: 'disapprove',
  CancelApprove: 'cancelApprove',
  CancelDisApprove: 'cancelDisApprove',
  ApprovedByAll: 'approvedByAll',
  DisApprovedByAll: 'disapprovedByAll',
};
const getSportsList = async (authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/games/sports`,
    authContext,
  });

const getGameData = async (gameId, fetchTeamData = false, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/games/${gameId}?fetchTeamObject=${fetchTeamData}&fetchCallerReview=true`,
    authContext,
  });

const getGameScoreboardEvents = async (userID, params, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/games/users/${userID}`,
    params,
    authContext,
  });

const getRefereedMatch = async (userID, sport, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/games/users/${userID}?sport=${sport}&role=referee`,
    authContext,
  });
const getScorekeeperMatch = async (userID, sport, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/games/users/${userID}?sport=${sport}&role=scorekeeper`,
    authContext,
  });

const deleteGameRecord = (gameId, recordId, authContext) =>
  makeAPIRequest({
    method: 'delete',
    url: `${Config.BASE_URL}games/${gameId}/records/${recordId}`,
    authContext,
  });

const patchGameRecord = (gameId, recordId, data, authContext) =>
  makeAPIRequest({
    method: 'patch',
    url: `${Config.BASE_URL}games/${gameId}/records/${recordId}`,
    data,
    authContext,
  });

const getGameFeed = async (game_id, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/newsfeeds?entity_type=game&entity_id=${game_id}`,
    authContext,
  });

const getGameTimeline = async (game_id, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/games/timeline/${game_id}`,
    authContext,
  });

const getGameNextFeed = async (game_id, last_id, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/newsfeeds?entity_type=game&entity_id=${game_id}&id_lt=${last_id}`,
    authContext,
  });
const getGameNextTimeline = async (game_id, last_id, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/timeline/${game_id}&id_lt=${last_id}`,
    authContext,
  });
const createGamePost = async (bodyParams, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}/posts`,
    data: bodyParams,
    authContext,
  });

const getGameStatsChartData = async (userID, params, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/teams/${userID}/games/stats/chart`,
    params,
    authContext,
  });

const getGameStatsData = async (userID, params, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/teams/${userID}/games/stats`,
    params,
    authContext,
  });

const getStatsRDMData = async (entityID, params, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/teams/${entityID}/games/stats/RDM`,
    params,
    authContext,
  });

const getGameMatchRecords = async (gameId, authContext, extraQuery) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/games/${gameId}/records?fetchTeamObject=true&${extraQuery}`,
    authContext,
  });

const approveDisapproveGameRecords = (
  gameId,
  teamId,
  type = 'approve',
  params,
  authContext,
) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}/teams/${teamId}/games/${gameId}/${type}`,
    data: params,
    authContext,
  });

const getGameStats = (gameId, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/games/${gameId}/stats`,
    authContext,
  });

const getTeamReviews = (teamId, groupBy, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/teams/${teamId}/reviews?groupby_game=${groupBy}`,
    authContext,
  });

const getUserReviews = (userId, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/users/${userId}/reviews`,
    authContext,
  });

const getGameLineUp = (teamId, gameId, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}teams/${teamId}/games/${gameId}/roster?fetchNonRoster=true&reviewStatus=true`,
    authContext,
  });

const getGameGallery = (gameId, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/games/${gameId}/gallery`,
    authContext,
  });
const createGameLineUp = (teamId, gameId, params, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}teams/${teamId}/games/${gameId}/roster`,
    data: params,
    authContext,
  });
const getAllLineUp = (gameId, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}games/${gameId}/roster`,
    authContext,
  });
const deleteGameLineUp = (teamId, gameId, params, authContext) =>
  makeAPIRequest({
    method: 'delete',
    url: `${Config.BASE_URL}teams/${teamId}/games/${gameId}/removeMembers`,
    data: params,
    authContext,
  });
const getGameByGameID = (gameId, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}games/${gameId}?fetchTeamObject=true&fetchCallerReview=true`,
    authContext,
  });
const addGameRecord = (gameId, params, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}games/${gameId}/records`,
    data: params,
    authContext,
  });
const resetGame = (gameId, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}games/${gameId}/resetGame`,
    data: {},
    authContext,
  });
const decreaseGameScore = (teamId, gameId, authContext) =>
  makeAPIRequest({
    method: 'delete',
    url: `${Config.BASE_URL}teams/${teamId}/games/${gameId}/score`,
    authContext,
  });

const addGameReview = (gameId, params, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}/games/${gameId}/reviews`,
    data: params,
    authContext,
  });
const patchGameReview = (gameId, reviewId, params, authContext) =>
  makeAPIRequest({
    method: 'patch',
    url: `${Config.BASE_URL}/games/${gameId}/reviews/${reviewId}`,
    data: params,
    authContext,
  });

const getGameReview = (gameId, reviewId, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/games/${gameId}/reviews/${reviewId}`,
    authContext,
  });

const addPlayerReview = (playerId, gameId, params, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}players/${playerId}/games/${gameId}/reviews`,
    data: params,
    authContext,
  });
const patchPlayerReview = (playerId, gameId, reviewId, params, authContext) =>
  makeAPIRequest({
    method: 'patch',
    url: `${Config.BASE_URL}players/${playerId}/games/${gameId}/reviews/${reviewId}`,
    data: params,
    authContext,
  });
const addRefereeReview = (refereeId, gameId, params, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}referees/${refereeId}/games/${gameId}/reviews`,
    data: params,
    authContext,
  });

const patchRefereeReview = (refereeId, gameId, reviewID, params, authContext) =>
  makeAPIRequest({
    method: 'patch',
    url: `${Config.BASE_URL}referees/${refereeId}/games/${gameId}/reviews/${reviewID}`,
    data: params,
    authContext,
  });

const addScorekeeperReview = (scorekeeperId, gameId, params, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}scorekeepers/${scorekeeperId}/games/${gameId}/reviews`,
    data: params,
    authContext,
  });

const patchScorekeeperReview = (
  scorekeeperId,
  gameId,
  reviewID,
  params,
  authContext,
) =>
  makeAPIRequest({
    method: 'patch',
    url: `${Config.BASE_URL}scorekeepers/${scorekeeperId}/games/${gameId}/reviews/${reviewID}`,
    data: params,
    authContext,
  });

const getGameRoster = (gameId, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}games/${gameId}/roster`,
    authContext,
  });

const getRefereeReviewData = async (userID, sport, groupBy, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/users/${userID}/reviews?sport=${sport}&role=referee&groupby_game=${groupBy}`,
    authContext,
  });
const getScorekeeperReviewData = async (userID, sport, groupBy, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/users/${userID}/reviews?sport=${sport}&role=scorekeeper&groupby_game=${groupBy}`,
    authContext,
  });

const getGameRefereeReservation = (
  gameId,
  fetchReview = true,
  lightVersion = false,
  authContext,
) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/referees/game/${gameId}/reservation?fetchReview=${fetchReview}&lightVersion=${lightVersion}`,
    authContext,
  });

const getGameScorekeeperReservation = (gameId, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/scorekeepers/game/${gameId}/reservation?fetchReview=true`, // &scorekeeper_detail=true
    authContext,
  });

const getScroreboardGameDetails = (userID, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}teams/${userID}/games?status=ended`,
    authContext,
  });

const getRecentGameDetails = (sportName, status, location, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}games?sport=${sportName}&status=${status}&location=${location}`,
    authContext,
  });

const getGameMemberDetails = (gameID, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}games/${gameID}/members`,
    authContext,
  });

const getShortsList = async (location, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}shorts?location=${location}`,
    authContext,
  });

const getReviewsByRole = async (userID, sport, role, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/users/${userID}/reviews?sport=${sport}&role=${role}`,
    authContext,
  });

export {
  GameRecordStatus,
  getSportsList,
  getGameData,
  getGameMatchRecords,
  approveDisapproveGameRecords,
  getGameStats,
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
  getGameRefereeReservation,
  getGameScorekeeperReservation,
  getScroreboardGameDetails,
  deleteGameRecord,
  patchGameRecord,
  getRefereedMatch,
  getGameFeed,
  getGameTimeline,
  createGamePost,
  addPlayerReview,
  getGameReview,
  patchGameReview,
  addRefereeReview,
  patchRefereeReview,
  getAllLineUp,
  getTeamReviews,
  getScorekeeperReviewData,
  getScorekeeperMatch,
  addScorekeeperReview,
  patchScorekeeperReview,
  getGameNextFeed,
  getGameNextTimeline,
  getRecentGameDetails,
  getShortsList,
  patchPlayerReview,
  getUserReviews,
  getGameMemberDetails,
  getStatsRDMData,
  getReviewsByRole,
};
