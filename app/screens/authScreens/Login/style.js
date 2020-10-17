import {StyleSheet, View, Text, Image, TouchableOpacity, Alert} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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
      
      height: '100%',
      width: '100%',
      resizeMode: 'stretch',
    },
    loginText: {
      marginTop: hp('12%'),
      marginBottom: hp('3%'),
      color: colors.whiteColor,
      fontSize: wp('6%'),
      textAlign: 'left',
      fontFamily: fonts.RBold,
      paddingLeft: 30,
    },
    orText: {
      marginTop: hp('3%'),
      marginBottom: hp('3%'),
      color: colors.whiteColor,
      fontSize: wp('3%'),
      textAlign: 'center',
      fontFamily: fonts.RBold,
    },
    forgotPasswordText: {
      color: colors.whiteColor,
      fontFamily: fonts.RMedium,
      fontSize: 16,
      textAlign: 'center',
      marginTop: hp('3%'),
    },
    bottomText: {
      width: '100%',
      textAlign: 'center',
      position: 'absolute',
      fontFamily: fonts.RLight,
      fontSize: wp('3%'),
     bottom: hp('3%'),
      
      color: colors.whiteColor,
    },
    hyperlinkText: {
      fontFamily: fonts.RLight,
      fontSize: wp('3%'),
      textDecorationLine: 'underline',
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
      marginTop: 4,
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
    contentContainer: {
      flex: 1, 
  },
  });
  export default styles;
  
  