import Config from 'react-native-config';
import api from '../utils/endPoints';
import makeAPIRequest from '../utils/Global';

export const getNewsFeed = async () => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.newsFeed.getNewsFeed,
})

export const getReactions = async (params) => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.newsFeed.getReaction,
  params,
});

export const createReaction = async (data) => makeAPIRequest({
  method: 'post',
  url: Config.BASE_URL + api.newsFeed.reaction,
  data,
});

export const createPost = async (bodyParams) => makeAPIRequest({
  method: 'post',
  url: Config.BASE_URL + api.newsFeed.createPostEndPoint,
  data: bodyParams,
});

export const deletePost = async (data) => makeAPIRequest({
  method: 'delete',
  url: Config.BASE_URL + api.newsFeed.createPostEndPoint,
  data,
});

export const updatePost = async (params) => makeAPIRequest({
  method: 'put',
  url: Config.BASE_URL + api.newsFeed.postDetail,
  params,
});

export const getImagePreSignedURL = async (params) => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.newsFeed.presignedurl,
  params,
});

export const getUsers = async () => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.newsFeed.getUser,
});

export const getGroupsUser = async () => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.newsFeed.getGroup,
});
