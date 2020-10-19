/* eslint-disable global-require */
const urls = {
  // Dev configuration
  BASEURL: 'https://90gtjgmtoe.execute-api.us-east-1.amazonaws.com/dev/',
  CognitoIdentityUserPoolRegion: 'US East (Ohio)',
  CognitoIdentityUserPoolId: 'us-east-1_Yudi38m09',
  CognitoIdentityUserPoolAppClientId: '6f9cb27nateihan1tdiu83u2q2',
  AWSCognitoUserPoolsSignInProviderKey: 'dev-TownsCupUserPoolClient',
  AWSCognitoUserPoolsIndentityID:
    'us-east-1:25e75343-1d5e-4642-a48a-331efcf425d1',
  FireBaseFileName: 'GoogleService-Info',
};

const colors = {
  kHexColor6368F2: '#6368F2',
  kHexColor45C1C0: '#45C1C0',
  kHexColor3073E3: '#3073E3',
  kHexColor24CBCC: '#24CBCC',
  kHexColorFF8A01: '#FF8A01',
  kHexColor35B9A8: '#35B9A8',
  themeColor: '#FF8A01',
  whiteColor: '#FFFFFF',
  parrotColor: '#E8FFB4',
  fbTextColor: '#4574DB',
  googleColor: '#616161',
  blackColor: '#000000',
  grayColor: '#A0A0A0',
  tabBackgroundColor: '#F6F6F6',
  lightgrayColor: '#E1E1E1',
  blueColor: '#3166d1',
  lightBlueColor: '#c1d2f2',
  pinkColor: '#FF658E',
  yellowColor: '#FFAE01',
  darkGrayColor: '#565656',
  gameDetailColor: '#10b9b6',
  grayBackgroundColor: '#F2F2F2',
  lightYellowColor: '#fff7ee',
  graySeparater: '#e1e1e1',
  textFieldColor: '#f3f3f3',
  doneButtonColor: '#29bce5',
  offwhite: '#fcfcfc',
  radioButtonColor: '#45C1C0',
  lightBlackColor: '#333333',
  veryLightBlack: '#616161',
  userPostTimeColor: '#999999',
  reactionCountColor: '#5c5c5c',
  purpleColor: '#c08bd1',
  lightBlueColor: '#5ecceb',
  disableColor: '#cccccc',
  postSeprator: '#e1e1e1',
  greeColor: '#45C188',
  writePostSepratorColor: '#E0E0E0',
  reservationAmountColor: '#FF8A01',
  yellowEventColor: '#ffd780',
  grayEventColor: '#AAAAAA',
  orangeEventColor: '#FFAE01',
  veryLightGray: '#C4C4C4',
};

const fonts = {
  RLight: 'Roboto-Light',
  RMedium: 'Roboto-Medium',
  RRegular: 'Roboto-Regular',
  RThin: 'Roboto-Thin',
  RItalic: 'Roboto-Italic',
  RLightItalic: 'Roboto-LightItalic',
  RBlack: 'Roboto-Black',
  RMediumItalic: 'Roboto-MediumItalic',
  RBold: 'Roboto-Bold',
  RThinItalic: 'Roboto-ThinItalic',
  RBlackItalic: 'Roboto-BlackItalic',

  LLight: 'Lato-Light',
  LRegular: 'Lato-Regular',
  LBlack: 'Lato-Black',
  LBold: 'Lato-Bold',
  LBlackItalic: 'Lato-BlackItalic',
};
const PATH = {
  orangeLayer: require('../assets/images/orange_layer.png'),
  signUpBg1: require('../assets/images/ic_signup_bg_1.png'),
  signUpBg2: require('../assets/images/ic_signup_bg_2.png'),
  signUpBg3: require('../assets/images/ic_signup_bg_3.png'),
  townsCupLogo: require('../assets/images/ic_townscup_logo.png'),
  email: require('../assets/images/normal_signup.png'),
  signUpFb: require('../assets/images/signup_fb.png'),
  signUpGoogle: require('../assets/images/signup_google.png'),
  bgImage: require('../assets/images/ic_bg.png'),
  profilePlaceHolder: require('../assets/images/profileplaceholder.png'),
  searchLocation: require('../assets/images/ic_search_orange.png'),
  archerySport: require('../assets/images/ic_archery.png'),
  bandySport: require('../assets/images/ic_Bandy.png'),
  baseballSport: require('../assets/images/ic_Baseball.png'),
  backetballSport: require('../assets/images/ic_Basketball.png'),
  footballSport: require('../assets/images/ic_Basketball.png'),

  checkWhite: require('../assets/images/ic_white_check.png'),
  uncheckWhite: require('../assets/images/ic_white_uncheck.png'),
  checkEditor: require('../assets/images/ic_check_editor.png'),
  uncheckEditor: require('../assets/images/ic_uncheck_editor.png'),

  groupIcon: require('../assets/images/ic_group.png'),
  club_ph: require('../assets/images/club_profile_placeholder.png'),
  team_ph: require('../assets/images/team_profile_placeholder.png'),
  tab_newsfeed: require('../assets/images/tab_newsfeed.png'),
  tab_search: require('../assets/images/tab_search.png'),
  tab_home: require('../assets/images/tab_home.png'),
  tab_notification: require('../assets/images/tab_notification.png'),
  tab_account: require('../assets/images/tab_account.png'),
  messageBox_account: require('../assets/images/ic_message_box.png'),
  nextArrow: require('../assets/images/ic_next_arrow.png'),
  backArrow: require('../assets/images/ic_back_arrow.png'),
  vertical3Dot: require('../assets/images/ic_dot.png'),
  downArrow: require('../assets/images/ic_down_arrow.png'),
  upArrow: require('../assets/images/ic_up_arrow.png'),
  dropDownArrow: require('../assets/images/down_arrow.png'),
  curruentTime: require('../assets/images/ic_game_curruent_time.png'),
  gamePlus: require('../assets/images/ic_game_plus.png'),
  gameRecord: require('../assets/images/ic_record.png'),
  gamePause: require('../assets/images/ic_game_pause.png'),
  gameStart: require('../assets/images/ic_game_start.png'),
  gameDetail: require('../assets/images/ic_details.png'),
  deleteRecentGoal: require('../assets/images/ic_delete_recent_goal.png'),

  gameYC: require('../assets/images/ic_yc.png'),
  gameRC: require('../assets/images/ic_rc.png'),
  gameGoal: require('../assets/images/ic_goal.png'),
  gameOwnGoal: require('../assets/images/ic_own_goal.png'),
  gameIn: require('../assets/images/ic_in.png'),
  gameOut: require('../assets/images/ic_out.png'),
  feedComment: require('../assets/images/feed_comment.png'),
  feedShare: require('../assets/images/feed_share.png'),
  feedLike: require('../assets/images/feed_like.png'),
  lock: require('../assets/images/lock.png'),
  pickImage: require('../assets/images/pick_image.png'),
  commentReport: require('../assets/images/comment_report.png'),
  tagImage: require('../assets/images/tag.png'),
  cancelImage: require('../assets/images/cancel.png'),
  videoPlayerHandle: require('../assets/images/oval.png'),

  gallaryImage: require('../assets/images/image.png'),
  bagTick: require('../assets/images/bagTick.png'),
  attatchmentGrey: require('../assets/images/attachmentGrey.png'),

  allSportLoader: require('../assets/images/all_sport_loader.png'),
  basketballLoader: require('../assets/images/basketball_loader.png'),
  soccerLoader: require('../assets/images/soccer_loader.png'),
  volleyballLoader: require('../assets/images/volleyball_loader.png'),
  baseballLoader: require('../assets/images/baseball_loader.png'),
  badmintonLoader: require('../assets/images/badminton_loader.png'),
  footballLoader: require('../assets/images/football_loader.png'),
  football2Loader: require('../assets/images/football2_loader.png'),

};

const endPoints = {
  createProfile: 'users',
  searchTeams: 'groups/search',
  sportsList: 'games/sports',
  groupSearch: 'groups/search',
  getUserDetail: 'users/',
  getUserFeed: 'posts',
  getNewsFeeds: 'newsfeeds',
};

export const development = 'DEVELOPMENT';

export const staging = 'STAGING';

export const production = 'PRODUCTION';

export default {
  urls, fonts, endPoints, colors, PATH,
};
