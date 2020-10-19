import { StyleSheet } from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../config/constants';

const {
  colors, fonts,
} = constants;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  LocationText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('3.8%'),
    marginTop: hp('2%'),
    paddingLeft: 15,
    textAlign: 'left',
  },
  certificateSubText: {
    color: colors.googleColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    marginTop: 8,
    paddingLeft: 15,
    textAlign: 'left',
  },
  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
  },
  form1: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form2: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
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
    fontFamily: fonts.RRegular,
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,

    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },

  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontFamily: fonts.RRegular,
    fontSize: wp('3.5%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  inputAndroid: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,

    width: wp('92%'),
  },

  doneButton: {
    alignSelf: 'center',
    backgroundColor: colors.doneButtonColor,
    borderRadius: 8,
    bottom: 30,
    height: 45,

    marginLeft: '7%',
    marginRight: '5%',
    marginTop: hp('2%'),
    position: 'absolute',
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
    alignSelf: 'center',
    height: 18,
    resizeMode: 'contain',

    right: 25,
    tintColor: colors.grayColor,
    top: 22,
    width: 18,
  },
  certificateImg: {
    alignSelf: 'center',
    backgroundColor: colors.textFieldColor,
    borderRadius: 10,

    height: 45,

    marginRight: 15,
    resizeMode: 'contain',
    width: 45,
  },
  chooseImage: {
    bottom: 0,
    height: 20,
    position: 'absolute',
    resizeMode: 'contain',
    right: 8,
    width: 20,
  },
  addCertificateView: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    marginTop: 12,
    marginBottom: 12,
    width: wp('92%'),
    alignSelf: 'center',
  },
  addCertificateButton: {
    alignItems: 'center',

    alignSelf: 'center',
    borderColor: colors.userPostTimeColor,
    borderRadius: 6,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    marginTop: '5%',
    width: '35%',
  },
  addCertificateText: {
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,

    fontSize: 12,
  },
  delete: {
    alignSelf: 'flex-end',
    color: colors.fbTextColor,
    marginRight: 15,
  },
  curruency: {
    alignSelf: 'flex-end',
    fontSize: wp('4%'),
  },
  // matchFeeView: {
  //   flexDirection: 'row',
  //   height: 40,
  //   alignSelf: 'center',
  //   marginBottom: 14,
  // },
  matchFeeView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: wp('3.5%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  feeText: {
    fontSize: wp('3.8%'),
    width: '96%',
  },
  matchFeeTxt: {
    height: 40,
    // alignSelf: 'center',
    width: wp('80%'),
    backgroundColor: colors.textFieldColor,

    paddingLeft: 10,
    marginTop: 12,
  },
  certificateDescription: {
    // height: 40,
    // alignSelf: 'center',
    // width: wp('76%'),
    // backgroundColor: colors.textFieldColor,
    // paddingLeft: 10,
    height: 40,
    width: wp('78%'),
    alignSelf: 'center',

    fontSize: wp('3.8%'),
    fontFamily: fonts.RRegular,
    paddingVertical: 12,
    paddingHorizontal: 15,

    color: colors.lightBlackColor,
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,

    elevation: 3,
  },
  nextButton: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 45,
    marginBottom: 40,
    marginTop: wp('12%'),
    width: '90%',
  },
  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginVertical: 10,
  },
  mendatory: {
    color: 'red',
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    width: wp('100%'),
  },
  languageApplyButton: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 45,
    marginBottom: 40,
    marginTop: wp('5%'),
    width: '90%',
  },
  shortSeparatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    width: wp('90%'),
  },
  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  checkboxImg: {
    width: wp('5.5%'),

    // paddingLeft: wp('25%'),
    resizeMode: 'contain',
    alignSelf: 'center',
    // tintColor: colors.grayColor,
  },
  checkbox: {
    alignSelf: 'center',
    position: 'absolute',
    right: wp('5%'),
  },
  searchView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    height: 40,

    marginTop: 12,
    paddingLeft: 15,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: wp('92%'),
  },
  searchTextField: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: wp('3.8%'),
    height: 40,
    width: wp('80%'),
  },
});

export default styles;
