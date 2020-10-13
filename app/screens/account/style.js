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
  profileView: {height: 150 , marginTop:Platform.OS == 'ios' ? 50 : 0},
  profileImg: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    //backgroundColor: colors.themeColor,
    
    alignSelf: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  profileImgGroup: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    //backgroundColor: colors.themeColor,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 25,
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
  clubLable: {
    height: 20,
    width: 20,
    resizeMode: 'cover',
    borderRadius: 10,
    marginLeft:20,
  },
  clubLableView:{
    height: 40,
    width: 230,
    resizeMode: 'cover',
    //backgroundColor: colors.themeColor,
    position:'absolute',
    alignSelf: 'center',
   //marginLeft:20,
  },
  nameText: {
    marginTop: hp('1%'),
    fontSize: 20,
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
    fontSize: 14,
    fontFamily: fonts.RLight,
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
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    alignSelf: 'center',
    tintColor: colors.grayColor,

    marginRight: 10,
  },
  menuItem: {
    
    height: 25,
    width: 25,
    resizeMode: 'contain',
    alignSelf: 'center',
   marginLeft : 20,  
  },
  subMenuItem: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    alignSelf: 'center',
   marginLeft : 55,
  },
  switchAccountIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
   marginLeft : 10,
  },
  nextArrowClub: {
    position: 'absolute',
    right: 15,
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    alignSelf: 'center',
    tintColor: colors.grayColor,

    marginRight: 0,
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
    alignSelf:'center',
  },
  switchAccount: {
    flex: 1,
    padding: 15,
    paddingLeft: 10,
    fontSize: wp('4%'),
    // fontFamily: fonts.RRegular,
    color: colors.grayColor,
  },
  separatorLine: {
    backgroundColor: colors.lightgrayColor,
    width: wp('90%'),
    height: 0.5,
    alignSelf: 'center',
  },
  halfSeparatorLine: {
    alignSelf:'flex-end',
    backgroundColor: colors.lightgrayColor,
    width: wp('82%'),
    height: 0.5,
    marginRight:20,
  },
  separatorView: {
   
    backgroundColor: colors.lightgrayColor,
    width: wp('100%'),
    height: 10,
    alignSelf: 'center',
  },
  entityName: {
    
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  teamSportView: {
    
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.themeColor,
  },
  clubSportView: {
    
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.greeColor,
  },
  entityNameText: {
    
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  oneCharacterText: {
    //alignSelf:'center',
    position:'absolute',
    fontSize: 12,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
    paddingBottom:5,
  },
  entityLocationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginTop: 5,
  },
  placeholderView:{
    height: 50,
    width: 50,
   
    justifyContent:'center',
    alignItems:'center',
    alignSelf: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.offwhite,
    margin: 15,
  },
  entityImg: {
    height: 50,
    width: 50,
    resizeMode: 'cover',

    alignSelf: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.offwhite,
    margin: 15,
  },
  smallProfileImg: {
    height: 25,
    width: 25,
    resizeMode: 'cover',

    alignSelf: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.offwhite,
    margin: 15,
  },
  playerImg: {
    height: 50,
    width: 50,
    resizeMode: 'cover',

    alignSelf: 'center',
    borderRadius: 25,
    borderWidth: 3,
    borderColor: colors.offwhite,
    margin: 15,
  },
  imageContainer: {
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    
},
  textContainer: {
  justifyContent: 'center',
    height: 80,
  },
  entityTextContainer: {
    justifyContent: 'center',
    flexDirection:'row',
    height: 40,
    alignItems:'center',
    marginLeft : 40,
    marginRight:20,
    //backgroundColor:'red',
  },
  badgeView: {
    position: 'absolute',
    right: 10,
    top: 10,

    backgroundColor: 'red',
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  badgeCounter: {
    position:'absolute',
    height: 17,
    width: 17,
    alignSelf:'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.whiteColor,
    fontSize: 11,
    fontFamily: fonts.RBold,
  },
  identityView: {
    //backgroundColor: colors.lightBlueColor,
    height: 16,
    width: 16,
    borderRadius: 3,
    marginLeft: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  identityViewTop: {
    //backgroundColor: colors.lightBlueColor,
    height: 16,
    width: 16,
    borderRadius: 3,
    marginLeft: 10,
    
    
    alignSelf: 'center',
  },
  identityViewClub: {
    backgroundColor: colors.purpleColor,
    height: 16,
    width: 16,
    borderRadius: 3,
    marginLeft: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  clubBadge: {
    backgroundColor: colors.purpleColor,
    height: 16,
    width: 16,
    borderRadius: 3,
    marginLeft: 10,

    alignSelf: 'center',
  },
});

export default styles;
