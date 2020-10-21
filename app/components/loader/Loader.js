import React from 'react';
import { View } from 'react-native';

import LottieView from 'lottie-react-native';

function Loader({ visible = false }) {
  if (!visible) return null;
  return (
    <View
      style={ {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        opacity: 0.5,

        zIndex: 1,
      } }>
      <LottieView
        // eslint-disable-next-line global-require
        source={ require('../../assets/animation/loading.json') }
        autoPlay
        loop
        speed={ 1.5 }
        style={ { width: 160, height: 160 } }
      />
    </View>
  );
}

export default Loader;
