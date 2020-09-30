import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../Constants/ImagePath';
import strings from '../../Constants/String';

import storage from '../../auth/storage';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../components/loader/Loader';

export default function HomeScreen({navigation, route}) {
  const [token, setToken] = useState('');

  useEffect(() => {
    getToken();
  });

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        console.log('TOKEN RETRIVED... ');
        setToken(value);
      } else {
        console.log('TOKEN::::::::::::EMPTY');
      }
    } catch (e) {
      // error reading value
    }
  };

  return (
    <>
      <View style={styles.mainContainer}>
        {/* <Loader visible={true} /> */}
        <Image style={styles.background} source={PATH.orangeLayer} />
        <Image style={styles.background} source={PATH.signUpBg1} />
        <Text>{token}</Text>
      </View>
    </>
  );
}

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
  logo: {
    resizeMode: 'contain',
    alignContent: 'center',
    height: hp('15%'),
    marginBottom: hp('4%'),
  },
  logoTitle: {
    color: colors.whiteColor,
    fontSize: wp('9%'),
    // fontFamily: fonts.RBlack,
  },
  logoTagLine: {
    marginTop: hp('1%'),
    color: colors.whiteColor,
    fontSize: wp('4%'),
    // fontFamily: fonts.RBold,
  },
  welcome: {
    marginTop: hp('5%'),
    color: colors.whiteColor,
    fontSize: 25,
    textAlign: 'left',
    // fontFamily: fonts.RRegular,
    paddingLeft: wp('10%'),
  },
  welcomeText: {
    marginTop: hp('1%'),
    color: colors.whiteColor,
    fontSize: 18,
    textAlign: 'left',
    // fontFamily: fonts.RLight,
    paddingLeft: wp('10%'),
    marginRight: wp('5%'),
  },
  logoContainer: {
    marginTop: hp('10%'),
    flexDirection: 'column',
    alignItems: 'center',
  },
  allButton: {
    // backgroundColor: colors.whiteColor,
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '3%',
    borderRadius: 40,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },

  signUpText: {
    fontSize: 17,
    // fontFamily: fonts.RRegular,
    color: colors.themeColor,
    height: 50,
    padding: 12,
  },

  signUpImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  imgWithText: {
    flexDirection: 'row',
    paddingLeft: 80,
  },
  alreadyView: {
    position: 'absolute',
    bottom: hp('4%'),
    alignSelf: 'center',
  },
  alreadyMemberText: {
    fontSize: 16,
    // fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    textAlign: 'center',
  },
});
