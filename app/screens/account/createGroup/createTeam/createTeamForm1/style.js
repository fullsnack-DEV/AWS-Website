import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../../../config/constants';
const {colors, fonts, urls, PATH} = constants;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  fieldTitle: {
    marginTop: hp('2%'),
    color: colors.blackColor,
    fontSize: wp('3.8%'),
    textAlign: 'left',
    // fontFamily: fonts.RBold,
    paddingLeft: 15,

    color: colors.lightBlackColor,
  },
  playerTitle: {
    marginTop: hp('1%'),
    color: colors.blackColor,
    fontSize: wp('3.8%'),
    textAlign: 'left',
    marginLeft: 15,
    // fontFamily: fonts.RBold,
    paddingLeft: 15,

    color: colors.lightBlackColor,
  },
  smallTxt: {
    color: colors.grayColor,
    fontSize: wp('2.8%'),
    marginTop: hp('2%'),

    textAlign: 'left',
  },
  separatorLine: {
    backgroundColor: colors.grayColor,
    width: wp('92%'),
    height: 0.5,
    alignSelf: 'center',
    marginTop: 14,
  },

  nextButton: {
    width: '90%',
    height: hp('5%'),
    alignSelf: 'center',
    marginTop: wp('12%'),
    borderRadius: 30,
    marginBottom: 40,
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
  downArrow: {
    height: 12,
    width: 12,
    resizeMode: 'contain',

    alignSelf: 'center',
    tintColor: colors.grayColor,
    top: 25,
    right: 25,
  },
  miniDownArrow: {
    height: 12,
    width: 12,
    resizeMode: 'contain',

    alignSelf: 'center',
    tintColor: colors.grayColor,

    top: 15,
    right: 15,
  },
  mendatory: {
    color: 'red',
  },
  formSteps: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 15,
    marginTop: 15,
  },
  form1: {
    backgroundColor: colors.themeColor,
    height: 5,
    width: 10,
    marginLeft: 2,
    marginRight: 2,
  },
  form2: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    width: 10,
    marginLeft: 2,
    marginRight: 2,
  },
  form3: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    width: 10,
    marginLeft: 2,
    marginRight: 2,
  },
  form4: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    width: 10,
    marginLeft: 2,
    marginRight: 2,
  },
  matchFeeTxt: {
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
  },
  fieldView: {
    marginTop: 15,
  },
  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontSize: wp('4%'),
    marginVertical: 10,
  },

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
  searchView: {
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
    flexDirection: 'row',
  },
  searchTextField: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    color: '#424242',
  },
});

export default styles;
