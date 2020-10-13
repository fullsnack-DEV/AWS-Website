import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
  } from 'react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

const {strings, urls, PATH, endPoints} = constants;
import   colors from "../../../Constants/Colors";
import constants from '../../../config/constants';
const {fonts} = constants;

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      flexDirection: 'column',
    },
    background: {
      position: 'absolute',
      height: hp('100%'),
      width: wp('100%'),
      resizeMode: 'stretch',
    },
    profile: {
      resizeMode: 'contain',
      alignContent: 'center',
      width: wp('25%'),
      height: hp('25%'),
      marginTop: hp('3%'),
      marginBottom: hp('3%'),
      alignSelf: 'center',
    },
    passwordEyes: {
      width: 22,
      height: 22,
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    passwordView: {
      flexDirection: 'row',
      height: 40,
      width:wp('84%'),
     
      alignSelf: 'center',
      marginTop: 2,
      marginBottom:16,
      fontSize: wp('4%'),
      color: 'black',
      backgroundColor: colors.whiteColor,
  
      borderRadius: 5,
      shadowColor: colors.googleColor,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 3,
    },
    textInput: {
      
      borderRadius: 5,
      fontSize: wp('4%'),
      color: colors.blackColor,
      fontFamily: fonts.RRegular,
      paddingLeft: 17,
      height: 40,
      width:wp('75%'),
      
      backgroundColor: colors.whiteColor,
    },
  });
  export default styles;