import { API_BASE_URL } from './setting';

const api = {
  baseURL: API_BASE_URL,
  auth: {
    userDetail: 'users/',
    addUser: 'users',
    sportsList: 'games/sports',
    locationSearch:
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4&input=',
    groupSearch: '/groups/search?',
  },
  // NewsFeed Constants
  newsFeed: {
    newsFeedDetail: 'newsfeeds',
    postDetail: 'posts',
    getReaction: 'reactions',
    reaction: 'reactions',
    createPostEndPoint: 'posts',
  },
  // Search Constants
  search: {},
  // Home Constants
  home: {},
  // Notification Constants
  notification: {},
  // Account Constants
  account: {
    registerPlayer: 'users',
    unreadCount: 'notifications/unreadcount',
    parentClubDetail: 'groups/',
    createGroups: 'groups',
    joinedTeams: 'groups/joined',
    teamsByClub: '/teams',
  },
};

export default api;
