import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedbackComponent,
  SafeAreaView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../config/constants';
const {strings, colors, fonts, urls, PATH} = constants;

function TCCheckbox({}) {
  const [checkbox, setCheckbox] = useState(false);
  return (
    <TouchableOpacity onPress={(checkbox) => setCheckbox(checkbox)}>
      {checkbox == true && (
        <Image source={PATH.checkWhite} style={styles.sportImg} />
      )}
      {checkbox == false && (
        <Image source={PATH.uncheckWhite} style={styles.sportImg} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sportImg: {
    width: wp('5%'),
    height: hp('4%'),
    //paddingLeft: wp('25%'),
    resizeMode: 'contain',

    alignSelf: 'center',
  },
});

export default TCCheckbox;
