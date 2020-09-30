import {
    StyleSheet,
 
  } from 'react-native';
  
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import colors from "../../../Constants/Colors"
  import constants from '../../../config/constants';
  const {strings,  fonts, urls, PATH} = constants;
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
      color: colors.whiteColor,
      fontSize: wp('4%'),
      textAlign: 'left',
      fontFamily: fonts.RBlack,
  
      paddingLeft: wp('4%'),
      width: wp('70%'),
  
      textAlignVertical: 'center',
    },
    cityText: {
      color: colors.whiteColor,
      fontSize: wp('3.5%'),
      textAlign: 'left',
      fontFamily: fonts.RRegular,
  
      paddingLeft: wp('4%'),
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
      width: wp('80%'),
    },
    checkbox: {
      alignSelf: 'center',
      position: 'absolute',
      right: wp('2%'),
    },
    listItemContainer: {
      flexDirection: 'row',
      paddingBottom: 20,
      paddingTop: 20,
      alignItems: 'center',
    },
    teamImg: {
      resizeMode: 'stretch',
      alignSelf: 'center',
  
      width: 45,
      height: 45,
      borderRadius: 6,
    },
    followBtn: {
      width: 70,
      height: 25,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: colors.whiteColor,
    },
    followingBtn: {
      width: 70,
      height: 25,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.whiteColor,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: colors.whiteColor,
    },
    followBtn: {
      width: 70,
      height: 25,
      alignItems: 'center',
      justifyContent: 'center',
  
      borderRadius: 5,
      borderWidth: 1,
      borderColor: colors.whiteColor,
    },
    followingText: {
      color: colors.themeColor,
      fontSize: wp('3%'),
      fontFamily: fonts.RBlack,
    },
    followText: {
      color: colors.whiteColor,
      fontSize: wp('3%'),
      fontFamily: fonts.RBlack,
    },
  });
  export default styles;
  