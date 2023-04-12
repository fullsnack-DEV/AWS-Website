const {StyleSheet, Platform} = require('react-native');
const {default: colors} = require('../../../../Constants/Colors');
const {default: fonts} = require('../../../../Constants/Fonts');
const {
  widthPercentageToDP,
  heightPercentageToDP,
} = require('../../../../utils');

const styles = StyleSheet.create({
  fieldView: {
    marginTop: 15,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  inputAndroid: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: widthPercentageToDP('4%'),
    height: 40,
    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 12,
    width: widthPercentageToDP('92%'),
  },
  // eslint-disable-next-line react-native/no-unused-styles
  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: widthPercentageToDP('3.5%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: widthPercentageToDP('92%'),
  },
  mainContainer: {
    flex: 1,
  },
  matchFeeTxt: {
    alignSelf: 'center',
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    color: 'black',

    fontSize: widthPercentageToDP('3.8%'),
    height: 40,

    marginTop: 10,
    paddingHorizontal: 10,
    paddingRight: 30,

    paddingVertical: 12,

    width: widthPercentageToDP('92%'),
  },
  searchView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    marginTop: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    paddingLeft: 15,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: widthPercentageToDP('92%'),
  },
  searchTextField: {
    alignSelf: 'center',
    color: colors.blackColor,
    flex: 1,
    fontSize: widthPercentageToDP('3.8%'),
    width: widthPercentageToDP('80%'),
  },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    width: widthPercentageToDP('100%'),
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: widthPercentageToDP('4%'),
    lineHeight: 24,
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  cityList: {
    color: colors.lightBlackColor,
    fontSize: widthPercentageToDP('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    width: widthPercentageToDP('70%'),
    margin: widthPercentageToDP('4%'),
    textAlignVertical: 'center',
  },

  searchImg: {
    alignSelf: 'center',
    height: heightPercentageToDP('4%'),

    resizeMode: 'contain',
    width: widthPercentageToDP('4%'),
    tintColor: colors.lightBlackColor,
  },
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 25,

    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    margin: widthPercentageToDP('8%'),
    paddingLeft: 17,
    paddingRight: 5,

    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: widthPercentageToDP('4.5%'),
    paddingLeft: 10,
  },

  miniDownArrow: {
    height: 12,
    resizeMode: 'contain',
    right: 15,

    tintColor: colors.blackColor,

    top: 15,
    width: 12,
  },

  languageView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: widthPercentageToDP('92%'),
  },
  languageText: {
    backgroundColor: colors.whiteColor,
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  languagePlaceholderText: {
    backgroundColor: colors.whiteColor,
    color: colors.userPostTimeColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  LocationText: {
    marginTop: heightPercentageToDP('3%'),
    color: colors.lightBlackColor,
    fontSize: 20,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    paddingLeft: 15,
  },

  descriptionTxt: {
    height: 120,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: widthPercentageToDP('92%'),
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    paddingRight: 30,
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
  },

  describeTitle: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    marginTop: 5,
    marginBottom: 3,
    marginLeft: 25,
  },
  describeText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    marginTop: 5,
    marginBottom: 3,
    marginLeft: 25,
  },
  listItem: {
    flexDirection: 'row',
    //  marginLeft: widthPercentageToDP('10%'),
    //  width: widthPercentageToDP('80%'),
    paddingHorizontal: 80,
  },
  backArrowStyle: {
    height: 20,
    marginLeft: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 80,
  },

  topViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    // width: 200,
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 44,
    width: 44,
    borderRadius: 88,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
    marginTop: 5,
  },
  nameText: {
    fontSize: 20,
    fontFamily: fonts.RMedium,
    // width: 200,
  },
  mediumNameText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    width: 200,
  },
  locationText: {
    fontSize: 14,
    fontFamily: fonts.RLight,
  },
});

module.exports = styles;
