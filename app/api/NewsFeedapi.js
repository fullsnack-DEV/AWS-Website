import {api} from '../utils/apiConstants';
import {makeAPIRequest} from '../utils/Global';

export const getNewsFeedDetails = async () => {
  return makeAPIRequest({
    method: 'get',
    url: api.baseURL + api.newsFeed.newsFeedDetail,
  })
    .then((response) => {
      console.log('Get News Feed Details Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Get News Feed Details Error ::', error.response);
    });
};

export const getPostDetails = async () => {
  return makeAPIRequest({
    method: 'get',
    url: api.baseURL + api.newsFeed.postDetail,
  })
    .then((response) => {
      console.log('Get Post Details Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Get Post Details Error ::', error.response);
      return Promise.reject(error);
    });
};

export const getReactions = async (params) => {
  return makeAPIRequest({
    method: 'get',
    url: api.baseURL + api.newsFeed.getReaction,
    params: params
  })
    .then((response) => {
      console.log('Get Reactions Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Get Reactions Error ::', error.response);
      return Promise.reject(error);
    });
};

export const createReaction = async (bodyParams) => {
  return makeAPIRequest({
    method: 'post',
    url: api.baseURL + api.newsFeed.reaction,
    data: bodyParams
  })
    .then((response) => {
      console.log('Create Reaction Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Create Reaction Error ::', error.response);
      return Promise.reject(error);
    });
};

export const createPost = async (bodyParams) => {
  return makeAPIRequest({
    method: 'post',
    url: api.baseURL + api.newsFeed.createPostEndPoint,
    data: bodyParams
  })
    .then((response) => {
      console.log('Create Post Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Create Post Error ::', error.response);
      return Promise.reject(error);
    });
};

export const deletePost = async (params) => {
  return makeAPIRequest({
    method: 'delete',
    url: api.baseURL + api.newsFeed.createPostEndPoint,
    params: params
  })
    .then((response) => {
      console.log('Delete Post Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Delete Post Error ::', error);
      return Promise.reject(error);
    });
};

export const updatePost = async (params) => {
  console.log('Params :-', params);
  return makeAPIRequest({
    method: 'put',
    url: api.baseURL + api.newsFeed.postDetail,
    params: params
  })
    .then((response) => {
      console.log('Update Post Response ::', response);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      console.log('Update Post Error ::', error);
      return Promise.reject(error);
    });
};