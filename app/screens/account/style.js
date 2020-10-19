import {
  StyleSheet,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../config/constants';

const {
  colors, fonts,
} = constants;

const styles = StyleSheet.create({
  badgeCounter: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 11,
    height: 17,
    position: 'absolute',
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 17,
  },
  badgeView: {
    backgroundColor: 'red',
    borderRadius: 10,
    height: 20,

    position: 'absolute',
    right: 10,
    top: 10,
    width: 20,
  },
  clubBadge: {
    alignSelf: 'center',
    backgroundColor: colors.purpleColor,
    borderRadius: 3,
    height: 16,
    marginLeft: 10,

    width: 16,
  },
  clubLable: {
    borderRadius: 10,
    height: 20,
    marginLeft: 20,
    resizeMode: 'cover',
    width: 20,
  },
  clubLableView: {
    height: 40,
    width: 230,
    resizeMode: 'cover',
    // backgroundColor: colors.themeColor,
    position: 'absolute',
    alignSelf: 'center',
    // marginLeft:20,
  },
  clubNameText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: wp('3.5%'),
    marginLeft: 10,
  },
  clubSportView: {

    color: colors.greeColor,
    fontFamily: fonts.RRegular,
    fontSize: 12,
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
    borderColor: colors.offwhite,
    borderRadius: 25,

    borderWidth: 1,
    height: 50,
    margin: 15,
    resizeMode: 'cover',
    width: 50,
  },
  entityLocationText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginTop: 5,
  },
  entityName: {

    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  entityNameText: {

    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },

  entityTextContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    marginLeft: 40,
    marginRight: 20,
    // backgroundColor:'red',
  },
  halfSeparatorLine: {
    alignSelf: 'flex-end',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    marginRight: 20,
    width: wp('82%'),
  },
  headerRightImg: {
    height: 28,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 28,
  },
  identityView: {
    // backgroundColor: colors.lightBlueColor,
    height: 16,
    width: 16,
    borderRadius: 3,
    marginLeft: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  identityViewClub: {
    alignSelf: 'center',
    backgroundColor: colors.purpleColor,
    borderRadius: 3,
    height: 16,
    marginLeft: 10,
    marginTop: 10,
    width: 16,
  },
  identityViewTop: {
    // backgroundColor: colors.lightBlueColor,
    height: 16,
    width: 16,
    borderRadius: 3,
    marginLeft: 10,

    alignSelf: 'center',
  },
  imageContainer: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,

  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listItems: {
    flex: 1,
    padding: 20,
    paddingLeft: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.blackColor,
    alignSelf: 'center',
  },
  locationText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: 14,
  },
  logout: {
    alignItems: 'center',
    backgroundColor: 'red',
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  menuItem: {

    alignSelf: 'center',
    height: 25,
    marginLeft: 20,
    resizeMode: 'contain',
    width: 25,
  },
  nameText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 20,
    marginTop: hp('1%'),
  },
  nextArrow: {
    alignSelf: 'center',
    flex: 0.1,
    height: 15,
    marginRight: 10,
    resizeMode: 'contain',

    tintColor: colors.grayColor,

    width: 15,
  },
  nextArrowClub: {
    alignSelf: 'center',
    height: 15,
    marginRight: 0,
    position: 'absolute',
    resizeMode: 'contain',
    right: 15,

    tintColor: colors.grayColor,

    width: 15,
  },
  oneCharacterText: {
    // alignSelf:'center',
    position: 'absolute',
    fontSize: 12,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
    paddingBottom: 5,
  },
  placeholderView: {
    alignItems: 'center',
    alignSelf: 'center',

    borderColor: colors.offwhite,
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    margin: 15,
    width: 50,
  },
  playerImg: {
    alignSelf: 'center',
    borderColor: colors.offwhite,
    borderRadius: 25,

    borderWidth: 3,
    height: 50,
    margin: 15,
    resizeMode: 'cover',
    width: 50,
  },
  profileImg: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    // backgroundColor: colors.themeColor,

    alignSelf: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  profileImgGroup: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    // backgroundColor: colors.themeColor,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  profileView: { height: 150, marginTop: Platform.OS === 'ios' ? 50 : 0 },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    width: wp('90%'),
  },
  separatorView: {

    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 10,
    width: wp('100%'),
  },
  smallProfileImg: {
    alignSelf: 'center',
    borderColor: colors.offwhite,
    borderRadius: 15,

    borderWidth: 1,
    height: 25,
    margin: 15,
    resizeMode: 'cover',
    width: 25,
  },
  subMenuItem: {
    alignSelf: 'center',
    height: 25,
    marginLeft: 55,
    resizeMode: 'contain',
    width: 25,
  },
  switchAccount: {
    flex: 1,
    padding: 15,
    paddingLeft: 10,
    fontSize: wp('4%'),
    // fontFamily: fonts.RRegular,
    color: colors.grayColor,
  },
  switchAccountIcon: {
    alignSelf: 'center',
    height: 30,
    marginLeft: 10,
    resizeMode: 'contain',
    width: 30,
  },
  teamSportView: {

    color: colors.themeColor,
    fontFamily: fonts.RRegular,
    fontSize: 12,
  },
  textContainer: {
    height: 80,
    justifyContent: 'center',
  },
});

export default styles;
