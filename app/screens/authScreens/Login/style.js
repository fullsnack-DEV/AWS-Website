import {StyleSheet, View, Text, Image, TouchableOpacity, Alert} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import   colors from "../../../Constants/Colors";
import constants from '../../../config/constants';
const {strings, urls, PATH, endPoints,fonts} = constants;

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
      fontSize: wp('4%'),
      bottom: hp('3%'),
      color: colors.whiteColor,
    },
    hyperlinkText: {
      fontFamily: fonts.RLight,
      fontSize: wp('4%'),
      textDecorationLine: 'underline',
    },
  });
  export default styles;
  
  