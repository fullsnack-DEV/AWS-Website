import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    ActivityIndicator,
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
    sportList: {
      color: colors.whiteColor,
      fontSize: wp('4%'),
      textAlign: 'left',
      fontFamily: fonts.RRegular,
  
      //paddingLeft: wp('1%'),
      width: wp('70%'),
      margin: wp('4%'),
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
  });
  export default styles;