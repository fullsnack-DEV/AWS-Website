import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../config/constants';
const {strings, colors, fonts, urls, PATH} = constants;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  profileView: {height: 180, alignSelf: 'center'},
  profileImg: {
    height: 70,
    width: 70,
    resizeMode: 'cover',
    //backgroundColor: colors.themeColor,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  nameText: {
    marginTop: hp('1%'),
    fontSize: wp('5%'),
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
  locationText: {
    fontSize: wp('4%'),
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
  logout: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'red',
  },
  headerRightImg: {
    height: 28,
    width: 28,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    marginRight: 20,
  },

  nextArrow: {
    flex: 0.1,
    height: 18,
    width: 18,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    alignSelf: 'center',
    tintColor: colors.grayColor,

    marginRight: 10,
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listItems: {
    flex: 1,
    padding: 20,
    paddingLeft: 30,
    fontSize: wp('4%'),
    // fontFamily: fonts.RRegular,
    color: colors.blackColor,
  },
  switchAccount: {
    flex: 1,
    padding: 15,
    paddingLeft: 20,
    fontSize: wp('4%'),
    // fontFamily: fonts.RRegular,
    color: colors.grayColor,
  },
  separatorLine: {
    backgroundColor: colors.grayColor,
    width: wp('90%'),
    height: 0.5,
    alignSelf: 'center',
  },
  separatorView: {
    backgroundColor: colors.lightgrayColor,
    width: wp('100%'),
    height: 10,
    alignSelf: 'center',
  },
  entityNameText: {
    marginTop: hp('1%'),
    fontSize: wp('4%'),
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  entityLocationText: {
    fontSize: wp('3.8%'),
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
    marginTop: 5,
  },
  entityImg: {
    height: 60,
    width: 60,
    resizeMode: 'cover',

    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.whiteColor,
    margin: 15,
  },
  textContainer: {
    justifyContent: 'center',
    height: 80,
  },
});

export default styles;
