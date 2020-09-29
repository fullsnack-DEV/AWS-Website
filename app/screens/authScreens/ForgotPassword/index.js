import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../config/constants';
import TCButton from '../../../components/TCButton';
import TCTextField from '../../../components/TCTextField';
import styles from "./style"
const {strings, colors, fonts, urls, PATH} = constants;

function ForgotPasswordScreen({navigation}) {
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={PATH.orangeLayer} />
      <Image style={styles.background} source={PATH.bgImage} />
      <Text style={styles.forgotText}>{strings.forgotPassword}</Text>
      <Text style={styles.resetText}>{strings.resetText}</Text>
      <TCTextField
        placeholder={strings.enterEmailPlaceholder}
        secureText={false}
        keyboardType="email-address"
      />
      <TCButton
        title={strings.nextTitle}
        onPress={() => alert('Next clicked..')}
        extraStyle={{bottom: hp('13%'), position: 'absolute'}}
      />
      <TCButton
        title={strings.cancelTitle}
        onPress={() => alert('Next clicked..')}
        textColor={{color: colors.whiteColor}}
        extraStyle={{
          bottom: hp('4%'),
          position: 'absolute',
          borderColor: colors.whiteColor,
          borderWidth: 1,

          backgroundColor: 'transparent',
        }}
      />
    </View>
  );
}

export default ForgotPasswordScreen;
