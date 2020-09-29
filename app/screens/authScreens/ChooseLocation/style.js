import {StyleSheet, View, Text, Image, TextInput, FlatList} from 'react-native';

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
      marginTop: hp('12%'),
      color: colors.whiteColor,
      fontSize: wp('6%'),
      textAlign: 'left',
      fontFamily: fonts.RBold,
      paddingLeft: 30,
    },
    textInput: {
      flex: 1,
      fontFamily: fonts.RRegular,
      fontSize: wp('4.5%'),
      color: colors.blackColor,
      paddingLeft: 10,
    },
    searchImg: {
      width: wp('4%'),
      height: hp('4%'),
  
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    sectionStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
  
      margin: wp('8%'),
      borderRadius: 25,
      shadowRadius: 4,
      shadowOffset: {width: 0, height: 4},
      shadowColor: colors.googleColor,
      shadowOpacity: 0.5,
  
      paddingLeft: 17,
      paddingRight: 5,
      height: 50,
      backgroundColor: colors.whiteColor,
    },
    cityList: {
      color: colors.whiteColor,
      fontSize: wp('4%'),
      textAlign: 'left',
      fontFamily: fonts.RRegular,
  
      //paddingLeft: wp('1%'),
      width: wp('70%'),
      margin: wp('4%'),
      textAlignVertical: 'center',
    },
    listItem: {
      flexDirection: 'row',
      marginLeft: wp('10%'),
      width: wp('80%'),
    },
    noDataText: {
      marginTop: hp('1%'),
      color: colors.whiteColor,
      fontSize: wp('4%'),
      textAlign: 'left',
      width: wp('55%'),
      textAlign: 'center',
      alignSelf: 'center',
      fontFamily: fonts.RRegular,
    },
  });
  export default styles