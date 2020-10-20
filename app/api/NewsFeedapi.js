import Config from 'react-native-config';
import api from '../utils/apiConstants';
import makeAPIRequest from '../utils/Global';

export const getNewsFeedDetails = async () => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.newsFeed.newsFeedDetail,
});

export const getPostDetails = async () => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.newsFeed.postDetail,
});

export const getReactions = async (params) => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.newsFeed.getReaction,
  params,
});

export const createReaction = async (bodyParams) => makeAPIRequest({
  method: 'post',
  url: Config.BASE_URL + api.newsFeed.reaction,
  data: bodyParams,
});

export const createPost = async (bodyParams) => makeAPIRequest({
  method: 'post',
  url: Config.BASE_URL + api.newsFeed.createPostEndPoint,
  data: bodyParams,
});

export const deletePost = async (params) => makeAPIRequest({
  method: 'delete',
  url: Config.BASE_URL + api.newsFeed.createPostEndPoint,
  params,
});

export const updatePost = async (params) => makeAPIRequest({
  method: 'put',
  url: Config.BASE_URL + api.newsFeed.postDetail,
  params,
});
