import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const getNewsFeed = async (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/newsfeeds/`,
  authContext,
})

export const getNewsFeedNextList = async (params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/newsfeeds/`,
  params,
  authContext,
})

export const getReactions = async (params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/reactions`,
  params,
  authContext,
});

export const createReaction = async (data, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/reactions`,
  data,
  authContext,
});

export const createPost = async (bodyParams, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/posts`,
  data: bodyParams,
  authContext,
});

export const deletePost = async (data, authContext) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}/posts`,
  data,
  authContext,
});

export const updatePost = async (params, authContext) => makeAPIRequest({
  method: 'put',
  url: `${Config.BASE_URL}/posts`,
  data: params,
  authContext,
});

export const getUserPosts = async (params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/posts/`,
  params,
  authContext,
});
