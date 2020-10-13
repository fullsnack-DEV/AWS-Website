import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../config/constants';
const {colors, fonts} = constants;
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
    checkEmailText: {
      
      color: colors.whiteColor,
      fontSize: 28,
      textAlign: 'left',
      fontFamily: fonts.RBold,
     
    },
    resetText: {
     marginLeft:20,
     marginRight:20,
     marginTop:10,
      color: colors.whiteColor,
      fontSize: 16,
      textAlign: 'center',
      fontFamily: fonts.RRegular,
      
    },
    textContainer:{
      flex:1,
      justifyContent: 'center',
      alignItems: 'center'}
  });
  export default styles