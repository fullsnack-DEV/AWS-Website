import { api } from '../utils/apiConstants';
import { makeAPIRequest } from '../utils/Global';

export const getNewsFeedDetails = async () => makeAPIRequest({
  method: 'get',
  url: api.baseURL + api.newsFeed.newsFeedDetail,
});

export const getPostDetails = async () => makeAPIRequest({
  method: 'get',
  url: api.baseURL + api.newsFeed.postDetail,
});

export const getReactions = async (params) => makeAPIRequest({
  method: 'get',
  url: api.baseURL + api.newsFeed.getReaction,
  params,
});

export const createReaction = async (bodyParams) => makeAPIRequest({
  method: 'post',
  url: api.baseURL + api.newsFeed.reaction,
  data: bodyParams,
});

export const createPost = async (bodyParams) => makeAPIRequest({
  method: 'post',
  url: api.baseURL + api.newsFeed.createPostEndPoint,
  data: bodyParams,
});

export const deletePost = async (params) => makeAPIRequest({
  method: 'delete',
  url: api.baseURL + api.newsFeed.createPostEndPoint,
  params,
});

export const updatePost = async (params) => makeAPIRequest({
  method: 'put',
  url: api.baseURL + api.newsFeed.postDetail,
  params,
});
