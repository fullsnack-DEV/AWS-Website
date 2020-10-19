import {
  StyleSheet,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../../../config/constants';

const {
  colors, fonts,
} = constants;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },
  LocationText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('6%'),
    marginTop: hp('0%'),
    paddingLeft: 30,
    textAlign: 'left',
  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    paddingLeft: 10,
  },
  searchImg: {
    alignSelf: 'center',
    height: hp('4%'),
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: wp('4%'),
  },
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 25,

    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    margin: wp('8%'),
    paddingLeft: 17,
    paddingRight: 5,

    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  cityList: {
    color: colors.whiteColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,

    // paddingLeft: wp('1%'),
    width: wp('70%'),
    margin: wp('4%'),
    textAlignVertical: 'center',
  },

  noDataText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    marginTop: hp('1%'),
    textAlign: 'center',
    width: wp('55%'),
  },
  sportText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('6%'),
    marginBottom: hp('4%'),
    marginTop: hp('12%'),
    paddingLeft: 30,
    textAlign: 'left',
    width: wp('70%'),
  },
  teamNameText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBlack,
    fontSize: wp('4%'),
    marginLeft: wp('4%'),

    textAlign: 'left',
    textAlignVertical: 'center',

    width: wp('80%'),
  },
  cityText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('3.5%'),
    marginLeft: wp('4%'),

    textAlign: 'left',
    textAlignVertical: 'center',

    width: wp('70%'),
  },
  sportImg: {
    width: wp('5%'),
    height: hp('4%'),
    // paddingLeft: wp('25%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  checkboxImg: {
    width: wp('5.5%'),

    // paddingLeft: wp('25%'),
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
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 20,
    paddingBottom: 15,
    paddingTop: 15,
  },
  teamImg: {
    alignSelf: 'center',
    borderRadius: 25,

    height: 50,
    resizeMode: 'stretch',
    width: 50,
  },
  followingBtn: {
    alignItems: 'center',
    backgroundColor: colors.lightBlackColor,
    borderColor: colors.lightBlackColor,
    borderRadius: 5,
    borderWidth: 1,
    height: 25,
    justifyContent: 'center',
    width: 70,
  },
  followBtn: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: colors.lightBlackColor,
    borderRadius: 5,
    borderWidth: 1,
    height: 25,
    justifyContent: 'center',
    width: 70,
  },
  followingText: {
    color: colors.themeColor,
    fontFamily: fonts.RBlack,
    fontSize: wp('3%'),
  },
  followText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBlack,
    fontSize: wp('3%'),
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    width: wp('90%'),
  },
  radioImage: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.radioButtonColor,
    width: 22,
  },
  unSelectRadioImage: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 22,
  },
  radioButtonView: {
    flexDirection: 'row',
  },
  nextButton: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 45,
    marginBottom: 30,
    marginTop: wp('5%'),
    width: '90%',
  },
  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginVertical: 10,
  },
});
export default styles;
