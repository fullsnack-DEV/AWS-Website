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

const endPoints = {
  createProfile: 'users',
  searchTeams: 'groups/search',
  sportsList: 'games/sports',
  groupSearch: 'groups/search',
  getUserDetail: 'users/',
  getUserFeed: 'posts',
  getNewsFeeds: 'newsfeeds',
};

export default {urls, fonts, endPoints, colors};
