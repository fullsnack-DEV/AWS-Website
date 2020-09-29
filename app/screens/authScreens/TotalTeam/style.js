import {
    StyleSheet,
  
  } from 'react-native';
  
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
    LocationText: {
      color: colors.whiteColor,
      fontSize: wp('6.5%'),
      fontFamily: fonts.RBold,
      width: wp('60%'),
      marginTop: 20,
      textAlign: 'center',
    },
    foundText: {
      color: colors.whiteColor,
      fontSize: wp('6.5%'),
      fontFamily: fonts.RRegular,
    },
  
    groupsImg: {
      width: 60,
      height: 60,
  
      resizeMode: 'contain',
    },
    sectionStyle: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  export default styles;