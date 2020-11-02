import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const getNewsFeed = async () => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/newsfeeds/`,
})

export const getReactions = async (params) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/reactions`,
  params,
});

export const createReaction = async (data) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/reactions`,
  data,
});

export const createPost = async (bodyParams) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/posts`,
  data: bodyParams,
});

export const deletePost = async (data) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}/posts`,
  data,
});

export const updatePost = async (params) => makeAPIRequest({
  method: 'put',
  url: `${Config.BASE_URL}/posts`,
  params,
});

export const getUserPosts = async (params) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/posts/`,
  params,
});
