const Verbs = {
  entityTypeGame: 'game',
  entityTypeClub: 'club',
  entityTypeClubs: 'clubs',
  entityTypeTeam: 'team',
  entityTypeTeams: 'teams',
  entityTypeLeague: 'league',
  entityTypeUser: 'user',
  entityTypePlayer: 'player',
  entityTypeGroupMember: 'groupmember',
  entityTypePlayers: 'players',
  entityTypeGroups: 'groups',
  entityTypeUsers: 'users',
  entityTypeReferee: 'referee',
  entityTypeScorekeeper: 'scorekeeper',
  entityTypeOpponent: 'opponent',

  tennisSport: 'tennis',
  doubleSport: 'double',
  singleSport: 'single',
  tennisSingleSport: 'Tennis Singles',
  tennisDoubleSport: 'Tennis Double',
  privacyTypeEveryone: 'everyone',
  privacyTypeFollowers: 'followers',
  privacyTypeMembers: 'members',
  privacyTypeAdmins: 'admins',
  sportType: 'sport',
  locationType: 'location',
  open: 'Open',
  paid: 'Paid',
  me: 'Me',
  norefund: 'norefund',
  refundStatus: 'refund',
  allStatus: 'All',
  male: 'male',
  female: 'female',
  otherVerb: 'other',
  on: 'On',
  off: 'Off',
  acceptVerb: 'accept',
  declineVerb: 'decline',
  cancelVerb: 'cancel',
  restoredVerb: 'restored',
  winnerVerb: 'winner',
  drawVerb: 'draw',
  looserVerb: 'looser',
  followVerb: 'follow',
  unfollowVerb: 'unfollow',
  inviteVerb: 'invite',
  bothVerb: 'both',
  messageVerb: 'message',
  editVerb: 'edit',
  joinVerb: 'join',
  leaveVerb: 'leave',
  leaveTeamVerb: 'leaveTeam',
  joinTeamVerb: 'joinTeam',
  dotVerb: 'dot',
  followingVerb: 'following',
  eventVerb: 'event',
  blockedVerb: 'blocked',
  unpauseVerb: 'unpause',
  reactivateVerb: 'reactivate',
  pauseVerb: 'pause',
  terminate: 'terminate',
  deactivateVerb: 'deactivate',
  activateVerb: 'activate',
  challengeVerb: 'challenge',
  allVerb: 'All',
  soccer: 'Soccer',
  todayVerb: 'Today',
  tomorrowVerb: 'Tomorrow',
  futureVerb: 'Future',
  challenge: 'Challenge',
  reservation: 'Reservation',
  usd: 'USD',
  cad: 'CAD',
  strictText: 'Strict',
  moderateText: 'Moderate',
  flexibleText: 'Flexible',
  card: 'card',
  friendly: 'Friendly',
  official: 'Official',
  comment: 'comment',
  like: 'like',
  unlike: 'unlike',
  reply: 'reply',
  screenTypeModal: 'modal',
  screenTypeMainScreen: 'mainScreen',
  eventRecurringEnum: {
    Never: 0,
    Daily: 1,
    Weekly: 2,
    WeekOfMonth: 3,
    DayOfMonth: 4,
    WeekOfYear: 5,
    DayOfYear: 6,
  },
  gpsErrorDeined: 'gpsErrorForDenied',

  sportTypeSingle: 'single',
  sportTypeDouble: 'double',
  sportTypeTeam: 'team',

  countTypeRatio: 'Ratio',
  countTypeSets: 'Sets',
  countTypeTime: 'Time',
  requestVerb: 'request',
  menuOptionTypePlaying: 'Playing',
  menuOptionTypeRefereeing: 'Refereeing',
  menuOptionTypeScorekeeping: 'Scorekeeping',

  PRIVACY_GROUP_MEMBER_EVERYONE: 0,
  PRIVACY_GROUP_MEMBER_FOLLOWER: 1,
  PRIVACY_GROUP_MEMBER_TEAMMEMBERS: 2,
  PRIVACY_GROUP_MEMBER_CLUBMEMBERS: 3,
  PRIVACY_GROUP_MEMBER_TEAM: 4,
  PRIVACY_GROUP_MEMBER_CLUB: 5,
  PRIVACY_GROUP_MEMBER_TEAMCLUB: 6,

  allText: 'all',
  homeText: 'home',
  awayText: 'away',

  REQUESTALREADYEXIST: 101,
  PLAYERLEAVED: 102,
  GROUPTERMINATION: 103,
  RESENDREQUEST: 'resendrequest',
  ACCEPTDECLINE: 'acceptdecline',

  setText: 'Set',
  EVENT_FILTER_TIME_ANY: 0,
  EVENT_FILTER_TIME_ONE_WEEK: 7,
  EVENT_FILTER_TIME_ONE_MONTH: 30,
  EVENT_FILTER_TIME_THREE_MONTH: 90,

  MAXIMUM_RECIPIENT_INVOICE: 75,
  INVOICE_TRANSACTION_SENT: 'sent',
  INVOICE_TRANSACTION_RECEIVED: 'received',
  UNPAID: 'Unpaid',
  PARTIALLY_PAID: 'Partially Paid',
  INVOICE_REJECTED: 'Rejected',
  INVOICE_CANCELLED: 'Cancelled',
  INVOICESENT: 'InvoiceSent',
  INVOICERECEVIED: 'InvoiceReceived',
  defaultHeightType: 'ft',
  defaultWeightType: 'lb',
  incomingChallenge: 'Incoming Challenge',
  INVOICECANCELLED: 'InvoiceCancelled',

  team: 'Team',
  club: 'Club',

  PAYMENT: 'payment',
  CASH: 'Cash',
  DATE_FORMAT: 'MMM DD, YYYY, hh:mmA',
  CHEQUE: 'Cheque',
  // Tag verbs
  entityID: 'entityID',
  searchText: 'searchText',
  sport_type: 'sport_type',
  sport_name: 'sport_name',
  location_Type: 'locationType',
  locationOption: 'locationOption',
  sportType_tag: 'sportType',
  isSearchPlaceholder: 'isSearchPlaceholder',
  minFee: 'minFee',
  maxFee: 'maxFee',
  sortOption: 'sortOption',
  searchCityLoc: 'searchCityLoc',
  fromDateTime: 'fromDateTime',
  toDateTime: 'toDateTime',
  DATE_MDY_FORMAT: 'll',
  THOUSAND_SECOND: '1000',
  AVAILABILITY_DATE_FORMATE: 'YYYY-MM-DD',
  mediaTypeImage: 'image',
  mediaTypeVideo: 'video',
  repostVerb: 'repost',
  CREATE_TEAM: 'Create Team',
  CREATE_CLUB: 'Create Club',
  CREATE_LEAGUE: 'Create League',
  JOIN_TEAM: 'Join Team',
  JOIN_CLUB: 'Join Club',
  JOIN_LEAGUE: 'Join League',
  TEAM_DATA: 'teamData',
  SPORT_DATA: 'sportData',
  delete: 'delete',
  report: 'report',
  ITEM_HEIGHT: 178,
  ITEM_LENGTH: 25,
  VIEW_POSITION: 0.9,
};

export default Verbs;
