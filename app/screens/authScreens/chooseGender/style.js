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
        marginTop:wp('25%'),
        marginLeft:20,
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
      textAlign: 'left',
      fontFamily: fonts.RRegular,
      
    },
    textContainer:{
      flex:1,
      justifyContent: 'center',
      alignItems: 'center'},
      whyAskingText:{
        marginLeft:20,
        marginRight:20,
        marginTop:10,
         color: colors.parrotColor,
         fontSize: 14,
         textAlign: 'left',
         fontFamily: fonts.RRegular,
    },
    radioImage: {
        height: 22,
        width: 22,
        resizeMode: 'contain',
        tintColor: colors.whiteColor,
        alignSelf: 'center',
        
      },
      unSelectRadioImage: {
        height: 22,
        width: 22,
        resizeMode: 'contain',
        tintColor: colors.whiteColor,
        alignSelf: 'center',
      },
      radioButtonView: {
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 20,
        marginRight: 15,
      },
      radioText: {
        fontSize: 15,
        fontFamily:fonts.RMedium,
        marginLeft: 15,
        alignSelf: 'center',
        marginRight: 15,
        color: colors.whiteColor,
      },
  });
  export default styles