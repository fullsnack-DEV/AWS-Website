import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCButton from '../../components/TCButton';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';

export default function ForgotPasswordLinkSentScreen({navigation}) {
  return (
    <LinearGradient
      colors={[colors.themeColor1, colors.themeColor3]}
      style={styles.mainContainer}>
      <FastImage
        resizeMode={'stretch'}
        style={styles.background}
        source={images.loginBg}
      />
      <View style={styles.textContainer}>
        <Text style={styles.checkEmailText}>{strings.checkEmailText}</Text>
        <Text style={styles.resetText}>{strings.checkEmailDescText}</Text>
      </View>
      <TCButton
        title={'LOG IN'}
        onPress={() => {
          navigation.navigate('LoginScreen');
        }}
        extraStyle={{bottom: hp('4%'), position: 'absolute'}}
      />
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  background: {
    height: hp('100%'),
    position: 'absolute',
    width: wp('100%'),
  },
  checkEmailText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    textAlign: 'left',
  },
  mainContainer: {
    flex: 1,
    paddingVertical: 25,
  },
  resetText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
