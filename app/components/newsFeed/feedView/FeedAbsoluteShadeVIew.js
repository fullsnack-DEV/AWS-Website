import React, { Fragment, memo } from 'react';
import { SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getHeight, getWidth } from '../../../utils';

const FeedAbsoluteShadeView = ({ isLandscape = false }) => (
  <Fragment>
    <SafeAreaView style={{
                zIndex: -1,
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
    }}>
      <LinearGradient
                    colors={['rgba(0,0,0,0.2)', 'transparent']}
                    style={{
                        position: 'absolute',
                        top: 0,
                        width: getWidth(isLandscape, 100),
                        height: getHeight(isLandscape, 30),
                    }}/>
      <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.2)']}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: getWidth(isLandscape, 100),
                        height: getHeight(isLandscape, 30),
                    }}/>
    </SafeAreaView>
  </Fragment>
    )

export default memo(FeedAbsoluteShadeView)
