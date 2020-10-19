import { StyleSheet } from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../../../config/constants';

const {
  colors, fonts,
} = constants;

const styles = StyleSheet.create({
  badgeCounter: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 11,
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  clubBelongText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('3.5%'),
    marginBottom: 10,
    marginLeft: 15,
    marginTop: 10,
  },
  downArrow: {
    alignSelf: 'center',
    height: 12,
    resizeMode: 'contain',

    right: 25,
    tintColor: colors.grayColor,
    top: 25,
    width: 12,
  },
  fieldTitle: {
    marginTop: hp('2%'),

    fontSize: wp('3.8%'),
    textAlign: 'left',
    // fontFamily: fonts.RBold,
    paddingLeft: 15,

    color: colors.lightBlackColor,
  },
  fieldView: {
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
  form3: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form4: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
  },
  identityViewClub: {
    alignSelf: 'center',
    backgroundColor: colors.purpleColor,
    borderRadius: 3,
    height: 16,
    marginLeft: 10,
    width: 16,
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
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  matchFeeTxt: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('3.8%'),
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
  mendatory: {
    color: 'red',
  },
  miniDownArrow: {
    height: 12,
    resizeMode: 'contain',
    right: 15,

    tintColor: colors.grayColor,

    top: 15,
    width: 12,
  },
  nameText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: wp('3.5%'),
    marginLeft: 10,
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
  playerTitle: {
    marginTop: hp('1%'),

    fontSize: wp('3.8%'),
    textAlign: 'left',
    marginLeft: 15,
    // fontFamily: fonts.RBold,
    paddingLeft: 15,

    color: colors.lightBlackColor,
  },
  profileImg: {
    height: 70,
    width: 70,
    resizeMode: 'cover',
    // backgroundColor: colors.themeColor,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  profileImgGroup: {
    height: 30,
    width: 30,
    resizeMode: 'cover',
    // backgroundColor: colors.themeColor,
    // marginTop: 20,
    // alignSelf: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  profileView: { height: 180 },
  searchImg: {
    // width: wp('4%'),
    // height: hp('4%'),

    // resizeMode: 'contain',
    // alignSelf: 'center',

    padding: 8,
    width: 8,
    height: 10,
    tintColor: colors.grayColor,
  },
  searchTextField: {
    alignSelf: 'center',
    color: colors.blackColor,
    flex: 1,
    height: 40,
    marginLeft: 10,
    width: wp('80%'),

  },
  searchView: {
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
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 1,
    marginTop: 10,
    width: wp('100%'),
  },
  smallTxt: {
    color: colors.grayColor,
    fontSize: wp('2.8%'),
    marginTop: hp('2%'),

    textAlign: 'left',
  },
});

export default styles;
