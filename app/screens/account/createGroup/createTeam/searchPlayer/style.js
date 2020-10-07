import {StyleSheet, View, Text, Image, TextInput, FlatList} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../../../config/constants';
const {strings, colors, fonts, urls, PATH} = constants;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  },
  LocationText: {
    marginTop: hp('0%'),
    color: colors.whiteColor,
    fontSize: wp('6%'),
    textAlign: 'left',
    fontFamily: fonts.RBold,
    paddingLeft: 30,
  },
  textInput: {
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    color: colors.blackColor,
    paddingLeft: 10,
  },
  searchImg: {
    width: wp('4%'),
    height: hp('4%'),
    tintColor: colors.grayColor,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    margin: wp('8%'),
    borderRadius: 25,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 4},
    shadowColor: colors.googleColor,
    shadowOpacity: 0.5,

    paddingLeft: 17,
    paddingRight: 5,
    height: 50,
    backgroundColor: colors.whiteColor,
  },
  cityList: {
    color: colors.whiteColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,

    //paddingLeft: wp('1%'),
    width: wp('70%'),
    margin: wp('4%'),
    textAlignVertical: 'center',
  },

  noDataText: {
    marginTop: hp('1%'),
    color: colors.whiteColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    width: wp('55%'),
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: fonts.RRegular,
  },
  ////////
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  },
  sportText: {
    marginTop: hp('12%'),
    marginBottom: hp('4%'),
    color: colors.whiteColor,
    fontSize: wp('6%'),
    textAlign: 'left',
    fontFamily: fonts.RBold,
    paddingLeft: 30,
    width: wp('70%'),
  },
  teamNameText: {
    color: colors.lightBlackColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RBlack,

    marginLeft: wp('4%'),
    width: wp('80%'),

    textAlignVertical: 'center',
  },
  cityText: {
    color: colors.lightBlackColor,
    fontSize: wp('3.5%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,

    marginLeft: wp('4%'),
    width: wp('70%'),

    textAlignVertical: 'center',
  },
  sportImg: {
    width: wp('5%'),
    height: hp('4%'),
    //paddingLeft: wp('25%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  checkboxImg: {
    width: wp('5.5%'),

    //paddingLeft: wp('25%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: wp('10%'),
    width: wp('90%'),
  },
  checkbox: {
    alignSelf: 'center',
    position: 'absolute',
    right: wp('2%'),
  },
  listItemContainer: {
    flexDirection: 'row',
    paddingBottom: 15,
    paddingTop: 15,
    marginLeft: 20,
    alignItems: 'center',
  },
  teamImg: {
    resizeMode: 'stretch',
    alignSelf: 'center',

    width: 50,
    height: 50,
    borderRadius: 25,
  },
  followBtn: {
    width: 70,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.lightBlackColor,
  },
  followingBtn: {
    width: 70,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightBlackColor,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.lightBlackColor,
  },
  followBtn: {
    width: 70,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.lightBlackColor,
  },
  followingText: {
    color: colors.themeColor,
    fontSize: wp('3%'),
    fontFamily: fonts.RBlack,
  },
  followText: {
    color: colors.lightBlackColor,
    fontSize: wp('3%'),
    fontFamily: fonts.RBlack,
  },
  separatorLine: {
    backgroundColor: colors.grayColor,
    width: wp('90%'),
    height: 0.5,
    alignSelf: 'center',
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
  radioButtonView: {
    flexDirection: 'row',
  },
  nextButton: {
    width: '90%',
    height: 45,
    alignSelf: 'center',
    marginTop: wp('5%'),
    borderRadius: 30,
    marginBottom: 30,
  },
  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontSize: wp('4%'),
    fontFamily: fonts.RBold,
    marginVertical: 10,
  },
});
export default styles;
