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
  import constants from '../../../config/constants';
const {strings, urls, PATH, endPoints} = constants;
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
  });
  export default styles;