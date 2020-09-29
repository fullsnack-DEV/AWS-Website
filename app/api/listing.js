// import apiClient from './client';

// import constants from '../config/constants';
// const {endPoints} = constants;

// //Get all sports list of TC
// const getListing = () => apiClient.get(endPoints.sportsList);

// // Google api for search of city, state, country
// const getCityList = (searchText) =>
//   apiClient.get(
//     'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4&input=' +
//       searchText,
//   );

// // Get all teams of TC
// const getTeamList = (queryParams) =>
//   client.apiClient.get(endPoints.groupSearch, queryParams);

// // Get user detail by UID
// const getUserDetail = async (uid) =>
//   apiClient.get(endPoints.getUserDetail + uid);

// export default {getListing, getCityList, getTeamList, getUserDetail};

//****************Fetch api call */

import apiClient from './client';

import constants from '../config/constants';
const {endPoints} = constants;

//Get all sports list of TC
const getListing = () => apiClient.apiGetClient(endPoints.sportsList);

// Google api for search of city, state, country
const getCityList = (searchText) => apiClient.apiGetGoogleClient(searchText);

// Get all teams of TC
const getTeamList = (queryParams) =>
  apiClient.apiGetClientQuery(endPoints.groupSearch, queryParams);

// Get user detail by UID
const getUserDetail = (uid) =>
  apiClient.apiGetClient(endPoints.getUserDetail + uid);

const getUserFeedDetail = (uid) =>
  apiClient.apiGetClient(endPoints.getUserFeed + '?uid=' + uid);
const getFeedDetail = () => apiClient.apiGetClient(endPoints.getNewsFeeds);

export default {
  getListing,
  getCityList,
  getTeamList,
  getUserDetail,
  getUserFeedDetail,
  getFeedDetail,
};
