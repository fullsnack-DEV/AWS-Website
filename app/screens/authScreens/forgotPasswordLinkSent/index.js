import React from 'react';
import {
  View, Text, Image,
} from 'react-native';

import {

  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import TCButton from '../../../components/TCButton';

import strings from '../../../Constants/String';
import images from '../../../Constants/ImagePath';
import styles from './style'

export default function ForgotPasswordLinkSentScreen({ navigation }) {
  return (
    <View style={ styles.mainContainer }>
      <Image style={ styles.background } source={ images.orangeLayer } />
      <Image style={ styles.background } source={ images.bgImage } />
      <View style={ styles.textContainer }>
        <Text style={ styles.checkEmailText }>{strings.checkEmailText}</Text>
        <Text style={ styles.resetText }>{strings.checkEmailDescText}</Text>
      </View>
      <TCButton
        title={ strings.loginCapTitle }
        onPress={ () => {
          navigation.navigate('LoginScreen');
        } }
        extraStyle={ { bottom: hp('4%'), position: 'absolute' } }
      />
    </View>
  );
}
