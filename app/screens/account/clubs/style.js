import {
  StyleSheet,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../config/constants';

const {
  colors, fonts,
} = constants;

const styles = StyleSheet.create({
  clubNameText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: wp('3.5%'),
    marginLeft: 10,
  },
  clubView: {
    height: 30,
    width: 30,
    resizeMode: 'cover',
    // backgroundColor: colors.themeColor,

    alignSelf: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  entityImg: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 10,

    borderWidth: 1,
    height: 60,
    margin: 15,
    resizeMode: 'cover',
    width: 60,
  },
  entityLocationText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: wp('3.8%'),
    marginTop: 5,
  },
  entityNameText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginTop: hp('1%'),
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  locationText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  nameText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4.5%'),
    marginTop: hp('1%'),
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
    height: 70,
    width: 70,
    resizeMode: 'cover',
    // backgroundColor: colors.themeColor,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  profileView: { height: 180 },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    width: wp('90%'),
  },
  textContainer: {
    height: 80,
    justifyContent: 'center',
  },
});

export default styles;
