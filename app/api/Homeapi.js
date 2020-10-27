import Config from 'react-native-config';
import api from '../utils/endPoints';
import makeAPIRequest from '../utils/Global';

export const getUserPosts = async (params) => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.home.getUserPosts,
  params,
});

export const getUserDetails = async (userID) => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.home.getCurrentUser + userID,
});

export const getGallery = async (userID) => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.home.players + userID + api.home.gallery,
});
