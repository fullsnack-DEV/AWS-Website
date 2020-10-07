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
    marginBottom: '22%',
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
    fontSize: wp('4%'),
    alignSelf: 'flex-end',
  },
  feeText: {
    width: '96%',
    fontSize: wp('3.8%'),
  },
  // matchFeeView: {
  //   flexDirection: 'row',
  //   height: 40,

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
  separatorLine: {
    backgroundColor: colors.grayColor,
    width: wp('92%'),
    height: 0.5,
    alignSelf: 'center',
    marginTop: 14,
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
    bottom: -8,
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
  delete: {alignSelf: 'flex-end', marginRight: 15, color: colors.fbTextColor},

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
  radioButtonView: {
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  radioText: {
    fontSize: wp('3.8%'),
    marginLeft: 15,
    alignSelf: 'center',
    marginRight: 15,
    color: colors.lightBlackColor,
  },
  radioImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    tintColor: colors.radioButtonColor,
    alignSelf: 'center',
  },
  unSelectRadioImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    alignSelf: 'center',
  },
  membershipText: {
    fontSize: wp('5%'),
    marginLeft: 15,
    marginTop: 20,
    color: colors.lightBlackColor,
    //fontWeight: 'bold',
  },
  mendatory: {
    color: 'red',
  },
});

export default styles;
