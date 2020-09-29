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
    color: colors.grayColor,
    fontSize: wp('3.5%'),
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
    fontSize: wp('4%'),
    backgroundColor: colors.textFieldColor,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 12,
    marginLeft: 15,
  },
  curruency: {
    height: 40,
    width: 50,
    marginTop: 12,
    backgroundColor: colors.textFieldColor,
    textAlign: 'center',
    lineHeight: 37,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: wp('4%'),
  },
  matchFeeView: {
    flexDirection: 'row',
    height: 40,

    marginBottom: 14,
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
    fontSize: wp('4%'),
    paddingVertical: 12,
    paddingHorizontal: 15,

    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.textFieldColor, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
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
  delete: {alignSelf: 'flex-end', marginRight: 15, color: colors.fbTextColor},
  curruency: {
    height: 40,
    width: 50,
    marginTop: 12,
    backgroundColor: colors.textFieldColor,
    textAlign: 'center',
    lineHeight: 37,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: wp('4%'),
  },
  matchFeeView: {
    flexDirection: 'row',
    height: 40,
    alignSelf: 'center',
    marginBottom: 14,
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
});

export default styles;
