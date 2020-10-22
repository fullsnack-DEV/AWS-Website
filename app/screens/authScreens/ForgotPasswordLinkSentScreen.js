import React from 'react';
import {
  View, Text, Image, StyleSheet,
} from 'react-native';

import {

  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCButton from '../../components/TCButton';
import strings from '../../Constants/String';
import images from '../../Constants/ImagePath';

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
const styles = StyleSheet.create({
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },
  checkEmailText: {

    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 28,
    textAlign: 'left',

  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  resetText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
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
