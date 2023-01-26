import React, {useState, useLayoutEffect} from 'react';
import {
  Text,
  Alert,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import firebase from '@react-native-firebase/app';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import TCTextField from '../../components/TCTextField';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import ActivityLoader from '../../components/loader/ActivityLoader';

export default function ForgotPasswordScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.nextButtonStyle}
          onPress={() => {
            if (checkValidation()) {
              forgotPassword(email);
            }
          }}>
          {strings.next}
        </Text>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          <Image
            source={images.backArrow}
            style={{
              height: 20,
              width: 15,
              marginLeft: 20,
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),
    });
  });
  // Basic input validation
  const checkValidation = () => {
    if (email === '') {
      Alert.alert(
        strings.appName,
        strings.emailNotBlankText,

        [
          {
            text: strings.okTitleText,
            onPress: () => {},
          },
        ],
        {cancelable: false},
      );
      return false;
    }
    if (ValidateEmail(email) === false) {
      Alert.alert(
        strings.validEmailMessage,
        '',
        [
          {
            text: strings.okTitleText,
            onPress: () => {},
          },
        ],
        {cancelable: false},
      );
      return false;
    }
    return true;
  };

  // Email input format validation
  const ValidateEmail = (emailAddress) => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        emailAddress,
      )
    ) {
      return true;
    }

    return false;
  };
  // Firebase forgot pasword function
  const forgotPassword = (emailText) => {
    setLoading(true);
    firebase
      .auth()
      .sendPasswordResetEmail(emailText)
      .then(() => {
        setLoading(false);
        navigation.navigate('ForgotPasswordLinkSentScreen');
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          let message = e.message;
          if (e.code === 'auth/user-not-found') {
            message = strings.emailNotRegisterd;
          }
          if (e.code === 'auth/network-request-failed') {
            message = strings.networkConnectivityErrorMessage;
          }
          Alert.alert(strings.alertmessagetitle, message);
        }, 10);
      });
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient
        colors={[colors.themeColor1, colors.themeColor3]}
        style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <FastImage style={styles.background} source={images.loginBg} />
        <Text style={styles.forgotText}>{strings.forgotPassword}</Text>
        <Text style={styles.resetText}>{strings.resetText}</Text>
        <TCTextField
          placeholderTextColor={colors.darkYellowColor}
          style={{...styles.textFieldStyle}}
          placeholder={strings.enterEmailPlaceholder}
          secureText={false}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />

        {/* <View style={{flex: 1}} /> */}

        {/* <View style={{marginBottom: 20}}>
          <TCButton
            title={strings.nextTitle}
            onPress={() => {
              if (checkValidation()) {
                forgotPassword(email);
              }
            }}
            extraStyle={{marginBottom: 10}}
          />
        </View> */}
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    height: hp('100%'),
    position: 'absolute',
    width: wp('100%'),
  },
  forgotText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    marginTop: Platform.OS === 'ios' ? 40 + 25 : 25,
    paddingLeft: 25,
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
    marginTop: 5,
    paddingLeft: 25,
    textAlign: 'left',
  },
  textFieldStyle: {
    fontFamily: fonts.RRegular,
    flex: 0,
    paddingHorizontal: 5,
    shadowColor: 'rgba(0,0,0,0.16)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 2,
    marginTop: 42,
    alignSelf: 'center',
    marginLeft: 35,
    marginRight: 35,
  },
  nextButtonStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginRight: 15,
    color: colors.whiteColor,
  },
});
