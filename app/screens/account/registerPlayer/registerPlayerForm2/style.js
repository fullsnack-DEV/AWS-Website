import { StyleSheet } from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import colors from '../../../../Constants/Colors'
import fonts from '../../../../Constants/Fonts'

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: '22%',
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
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
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
  // curruency: {
  //   height: 40,
  //   width: 50,
  //   marginTop: 12,
  //   backgroundColor: colors.textFieldColor,
  //   textAlign: 'center',
  //   lineHeight: 37,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   fontSize: wp('4%'),
  // },
  curruency: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 15,
    textAlign: 'center',
  },
  feeText: {
    fontSize: wp('3.8%'),
    width: '84%',
  },
  // matchFeeView: {
  //   flexDirection: 'row',
  //   height: 40,

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
  matchFeeTxt: {
    alignSelf: 'center',
    backgroundColor: colors.textFieldColor,
    fontSize: wp('4%'),
    height: 40,
    paddingLeft: 10,

    width: wp('77%'),
    // marginTop: 12,
  },

  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
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
    fontSize: wp('4%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,

    width: wp('92%'),
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 14,
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
    bottom: -8,
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
    borderColor: colors.blackColor,
    borderRadius: 6,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    marginTop: '5%',
    width: '35%',
  },
  addCertificateText: {
    fontSize: 12,
    // fontFamily: fonts.RBold,

    color: colors.blackColor,
  },
  delete: { alignSelf: 'flex-end', color: colors.fbTextColor, marginRight: 15 },

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
  radioButtonView: {
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
  },
  radioText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontSize: wp('3.8%'),
    marginLeft: 15,
    marginRight: 15,
  },
  radioImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    // tintColor: colors.radioButtonColor,
    alignSelf: 'center',
  },
  unSelectRadioImage: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 22,
  },
  membershipText: {
    color: colors.veryLightBlack,
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginLeft: 15,
    marginTop: 20,
  },
  mendatory: {
    color: 'red',
  },
  membershipSubText: {
    color: colors.veryLightBlack,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
    marginLeft: 15,
    marginTop: 20,
  },
  whoJoinText: {
    color: colors.veryLightBlack,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginBottom: 20,
    marginLeft: 15,
    marginTop: 10,
  },

});

export default styles;
