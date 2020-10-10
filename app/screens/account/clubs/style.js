import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

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
    width: '100%',
    height: '100%',
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
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

  profileView: {height: 180},
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
  profileImgGroup: {
    height: 70,
    width: 70,
    resizeMode: 'cover',
    //backgroundColor: colors.themeColor,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  clubView: {
    height: 30,
    width: 30,
    resizeMode: 'cover',
    //backgroundColor: colors.themeColor,

    alignSelf: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  nameText: {
    marginTop: hp('1%'),
    fontSize: wp('4.5%'),
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
  clubNameText: {
    fontSize: wp('3.5%'),
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    marginLeft: 10,
  },
  locationText: {
    fontSize: wp('4%'),
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
  separatorLine: {
    backgroundColor: colors.grayColor,
    width: wp('90%'),
    height: 0.5,
    alignSelf: 'center',
  },
});

export default styles;
