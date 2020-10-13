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
      fontSize: 25,
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
    whyAskingText:{
        marginLeft:20,
        marginRight:20,
        marginTop:10,
         color: colors.parrotColor,
         fontSize: 14,
         textAlign: 'left',
         fontFamily: fonts.RRegular,
    },
    fieldView: {
        marginTop: 15,
      },
      matchFeeTxt: {
        height: 40,
        width: wp('90%'),
        alignSelf: 'center',
        justifyContent:'center',
        //alignItems:'center',
        marginTop: 30,
        fontSize: wp('3.8%'),
        
    
        color: 'black',
       
        backgroundColor: colors.offwhite,
    
        paddingLeft:20,
        borderRadius: 5,
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        shadowRadius: 1,
    
        elevation: 3,
      },
      dateText:{
          fontSize:16,
          fontFamily:fonts.RRegular,
          color:colors.themeColor,
      }
  });
  export default styles