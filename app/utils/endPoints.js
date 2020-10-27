const api = {
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
    getNewsFeed: 'newsfeeds',
    getUserPosts: 'posts',
    getReaction: 'reactions',
    reaction: 'reactions',
    createPostEndPoint: 'posts',
    presignedurl: 'pre-signed-url',
    getUser: 'users',
    getGroup: 'groups',
  },
  // Search Constants
  search: {},
  // Home Constants
  home: {
    getUserPosts: 'posts',
    getCurrentUser: 'users/',
    players: 'players/',
    gallery: '/gallery',
  },
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
  reservation: {
    reservationList: 'reservations?referenceObject=true',
  },
};

export default api;
