import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import AsyncStorage from '@react-native-community/async-storage';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors'

export default function HomeScreen() {
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
          <View style={ styles.mainContainer }>
              {/* <Loader visible={true} /> */}
              <Image style={ styles.background } source={ images.orangeLayer } />
              <Image style={ styles.background } source={ images.signUpBg1 } />
              <Text>{token}</Text>
          </View>
      </>
  );
}

const styles = StyleSheet.create({
  allButton: {
    // backgroundColor: colors.whiteColor,
    borderRadius: 40,
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '3%',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  alreadyMemberText: {
    color: colors.whiteColor,
    fontSize: 16,
    textAlign: 'center',
  },
  alreadyView: {
    alignSelf: 'center',
    bottom: hp('4%'),
    position: 'absolute',
  },
  background: {
    height: hp('100%'),
    position: 'absolute',
    resizeMode: 'stretch',
    width: wp('100%'),
  },
  imgWithText: {
    flexDirection: 'row',
    paddingLeft: 80,
  },
  logo: {
    alignContent: 'center',
    height: hp('15%'),
    marginBottom: hp('4%'),
    resizeMode: 'contain',
  },
  logoContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: hp('10%'),
  },
  logoTagLine: {
    color: colors.whiteColor,
    fontSize: wp('4%'),
    marginTop: hp('1%'),
    // fontFamily: fonts.RBold,
  },
  logoTitle: {
    color: colors.whiteColor,
    fontSize: wp('9%'),
    // fontFamily: fonts.RBlack,
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  signUpImg: {
    alignSelf: 'center',
    height: 20,
    resizeMode: 'contain',
    width: 20,
  },
  signUpText: {
    color: colors.themeColor,
    fontSize: 17,
    height: 50,
    padding: 12,
  },
  welcome: {
    color: colors.whiteColor,
    fontSize: 25,
    marginTop: hp('5%'),
    paddingLeft: wp('10%'),
    textAlign: 'left',
  },
  welcomeText: {
    color: colors.whiteColor,
    fontSize: 18,
    marginRight: wp('5%'),
    marginTop: hp('1%'),
    paddingLeft: wp('10%'),
    textAlign: 'left',
  },
});
