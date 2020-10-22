import React, { useState } from 'react';
import {
  View, Text, Image, Alert, StyleSheet,
} from 'react-native';

import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import firebase from '@react-native-firebase/app';

import TCButton from '../../components/TCButton';
import TCTextField from '../../components/TCTextField';
import strings from '../../Constants/String';
import images from '../../Constants/ImagePath'
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  // Basic input validation
  const checkValidation = () => {
    if (email === '') {
      Alert.alert('Towns Cup', 'Email cannot be blank');
      return false
    } if (ValidateEmail(email) === false) {
      Alert.alert('Towns Cup', 'You have entered an invalid email address!');
      return false
    }
    return true
  };

  // Email input format validation
  const ValidateEmail = (emailAddress) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailAddress)) {
      return (true)
    }

    return (false)
  }
  // Firebase forgot pasword function
  const forgotPassword = (emailText) => {
    firebase.auth().sendPasswordResetEmail(emailText)
      .then(() => {
        navigation.navigate('ForgotPasswordLinkSentScreen');
      }).catch((e) => {
        Alert.alert('Towns Cup', e);
      })
  }
  return (

    <View style={ styles.mainContainer }>
      <Image style={ styles.background } source={ images.orangeLayer } />
      <Image style={ styles.background } source={ images.bgImage } />
      <Text style={ styles.forgotText }>{strings.forgotPassword}</Text>
      <Text style={ styles.resetText }>{strings.resetText}</Text>
      <TCTextField
        placeholder={ strings.enterEmailPlaceholder }
        secureText={ false }
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={ (text) => setEmail(text) } value={ email }
      />
      <View style={{ flex: 1 }}/>

      <View style={{ marginBottom: 20 }}>
        <TCButton
        title={ strings.nextTitle }
        onPress={ () => {
          if (checkValidation()) {
            forgotPassword(email);
          }
        } }
extraStyle={{ marginBottom: 10 }}
      />
        <TCButton
              title={ strings.cancelTitle }
              onPress={ () => navigation.goBack() }
              textColor={ { color: colors.whiteColor } }
              extraStyle={ {

                borderColor: colors.whiteColor,
                borderWidth: 1,

                backgroundColor: 'transparent',
              } }
              />
      </View>

    </View>

  );
}

const styles = StyleSheet.create({
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },
  forgotText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    marginTop: hp('12%'),
    paddingLeft: 30,
    textAlign: 'left',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  resetText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    marginBottom: hp('11%'),
    marginTop: hp('0.5%'),
    paddingLeft: 30,
    textAlign: 'left',
  },
});
