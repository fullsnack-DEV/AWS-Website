import React from 'react';
import {StyleSheet, View} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';

import constants from '../../config/constants';
const {strings, colors, fonts, urls, PATH} = constants;

function Loader({visible = false}) {
  if (!visible) return null;
  return (
    <View
      style={{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        opacity: 0.5,

        zIndex: 1,
      }}>
      <LottieView
        source={require('../../assets/animation/loading.json')}
        autoPlay
        loop
        speed={1.5}
        style={{width: 160, height: 160}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    backgroundColor: 'white',
    opacity: 0.5,
    zIndex: 1,
    
  },
});

export default Loader;
