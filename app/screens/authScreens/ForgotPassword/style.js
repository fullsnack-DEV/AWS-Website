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
    },
    background: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      resizeMode: 'stretch',
    },
    forgotText: {
      marginTop: hp('12%'),
      // color: colors.whiteColor,
      fontSize: wp('6%'),
      textAlign: 'left',
      fontFamily: fonts.RBold,
      paddingLeft: 30,
    },
    resetText: {
      marginTop: hp('0.5%'),
      marginBottom: hp('11%'),
      // color: colors.whiteColor,
      fontSize: 14,
      textAlign: 'left',
      fontFamily: fonts.RRegular,
      paddingLeft: 30,
    },
  });
  export default styles