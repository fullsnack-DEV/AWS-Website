import {View} from 'react-native';
import React from 'react';
import {ShimmerView} from './ShimmerCommonComponents';
import colors from '../../../Constants/Colors';

const BackgroundProfileShimmer = () => (
  <View>
    <ShimmerView
      style={{width: '100%'}}
      height={200}
      marginVertical={0}
      borderRadius={0}
    />
    <ShimmerView
      style={{
        position: 'absolute',
        bottom: -30,
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 13,
        alignSelf: 'center',
        borderRadius: 50,
      }}
      width={75}
      height={75}
    />
  </View>
);

export default BackgroundProfileShimmer;
