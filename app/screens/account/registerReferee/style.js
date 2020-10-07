import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../config/constants';
const {strings, colors, fonts, urls, PATH} = constants;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  LocationText: {
    marginTop: hp('2%'),
    color: colors.lightBlackColor,
    fontSize: wp('3.8%'),
    textAlign: 'left',
    // fontFamily: fonts.RBold,
    paddingLeft: 15,
  },
  smallTxt: {
    color: colors.grayColor,
    fontSize: wp('2.8%'),
    marginTop: hp('2%'),

    textAlign: 'left',
    // fontFamily: fonts.RBold,
  },
  descriptionTxt: {
    height: 120,
    // alignSelf: 'center',
    width: wp('92%'),
    fontSize: wp('3.8%'),

    marginTop: 12,

    width: wp('92%'),
    alignSelf: 'center',
    marginTop: 12,

    paddingVertical: 12,
    paddingHorizontal: 15,

    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },

  matchFeeView: {
    flexDirection: 'row',
    height: 40,

    width: wp('92%'),
    alignSelf: 'center',
    marginTop: 12,
    fontSize: wp('3.5%'),
    paddingVertical: 12,
    paddingHorizontal: 15,

    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
  matchFeeTxt: {
    height: 40,
    alignSelf: 'center',
    width: wp('77%'),
    fontSize: wp('4%'),
    backgroundColor: colors.textFieldColor,

    paddingLeft: 10,
    //marginTop: 12,
  },

  inputIOS: {
    height: 40,
    width: wp('92%'),
    alignSelf: 'center',
    marginTop: 12,
    fontSize: wp('3.5%'),
    paddingVertical: 12,
    paddingHorizontal: 15,

    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
  inputAndroid: {
    height: 40,
    width: wp('92%'),
    alignSelf: 'center',
    marginTop: 12,
    fontSize: wp('4%'),
    paddingVertical: 12,
    paddingHorizontal: 15,

    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.offwhite,

    borderRadius: 5,

    elevation: 3,
  },

  doneButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: colors.doneButtonColor,
    marginLeft: '7%',
    marginRight: '5%',

    marginTop: hp('2%'),
    borderRadius: 8,
    height: 45,
    alignSelf: 'center',
    width: '75%',
  },
  signUpText: {
    fontSize: 17,
    // fontFamily: fonts.RBold,
    height: 50,
    padding: 12,
    textAlign: 'center',
    color: colors.whiteColor,
  },
  downArrow: {
    height: 18,
    width: 18,
    resizeMode: 'contain',

    alignSelf: 'center',
    tintColor: colors.grayColor,
    top: 22,
    right: 25,
  },
  certificateImg: {
    height: 45,
    width: 45,
    resizeMode: 'contain',

    alignSelf: 'center',

    marginRight: 15,
    backgroundColor: colors.textFieldColor,
    borderRadius: 10,
  },
  chooseImage: {
    position: 'absolute',
    right: 8,
    bottom: 0,
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  addCertificateView: {
    flexDirection: 'row',
    //backgroundColor: 'red',
    marginTop: 12,
    marginBottom: 12,
    width: wp('92%'),
    alignSelf: 'center',
  },
  addCertificateButton: {
    marginTop: '5%',

    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.blackColor,
    height: 30,
    alignSelf: 'center',
    width: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCertificateText: {
    fontSize: 12,
    // fontFamily: fonts.RBold,

    color: colors.blackColor,
  },
  delete: {
    alignSelf: 'flex-end',
    marginRight: 15,
    color: colors.fbTextColor,
  },
  curruency: {
    fontSize: wp('4%'),
    alignSelf: 'flex-end',
  },
  // matchFeeView: {
  //   flexDirection: 'row',
  //   height: 40,
  //   alignSelf: 'center',
  //   marginBottom: 14,
  // },
  matchFeeView: {
    flexDirection: 'row',
    height: 40,

    width: wp('92%'),
    alignSelf: 'center',
    marginTop: 12,
    fontSize: wp('3.5%'),
    paddingVertical: 12,
    paddingHorizontal: 15,

    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
  feeText: {
    width: '96%',
    fontSize: wp('3.8%'),
  },
  matchFeeTxt: {
    height: 40,
    //alignSelf: 'center',
    width: wp('80%'),
    backgroundColor: colors.textFieldColor,

    paddingLeft: 10,
    marginTop: 12,
  },
  certificateDescription: {
    height: 40,
    alignSelf: 'center',
    width: wp('76%'),
    backgroundColor: colors.textFieldColor,
    paddingLeft: 10,
  },
  nextButton: {
    width: '90%',
    height: 45,
    alignSelf: 'center',
    marginTop: wp('12%'),
    borderRadius: 30,
    marginBottom: 40,
  },
  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontSize: wp('4%'),
    fontFamily: fonts.RBold,
    marginVertical: 10,
  },
  mendatory: {
    color: 'red',
  },
  separatorLine: {
    backgroundColor: colors.grayColor,
    width: wp('100%'),
    height: 0.5,
    alignSelf: 'center',
  },
  languageApplyButton: {
    width: '90%',
    height: 45,
    alignSelf: 'center',
    marginTop: wp('5%'),
    borderRadius: 30,
    marginBottom: 40,
  },
  shortSeparatorLine: {
    backgroundColor: colors.grayColor,
    width: wp('90%'),
    height: 0.5,
    alignSelf: 'center',
  },
  languageList: {
    marginLeft: 20,
    marginBottom: 20,
    marginTop: 20,
    color: colors.lightBlackColor,
    fontSize: wp('4%'),
    fontFamily: fonts.RRegular,
  },
  checkboxImg: {
    width: wp('5.5%'),

    //paddingLeft: wp('25%'),
    resizeMode: 'contain',
    alignSelf: 'center',
    tintColor: colors.themeColor,
  },
  checkbox: {
    alignSelf: 'center',
    position: 'absolute',
    right: wp('5%'),
  },
  searchView: {
    height: 40,
    width: wp('92%'),
    alignSelf: 'center',
    marginTop: 12,
    paddingLeft: 15,
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    flexDirection: 'row',

    elevation: 3,
  },
  searchTextField: {
    flex: 1,
    color: colors.blackColor,
    fontSize: wp('3.8%'),
    height: 40,
    width: wp('80%'),
    alignSelf: 'center',
  },
});

export default styles;
