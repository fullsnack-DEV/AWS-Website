/* eslint-disable no-nested-ternary */

import React, {useEffect, useState, useMemo} from 'react';
import {Text, StyleSheet, Platform} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import {useTabBar} from '../context/TabbarContext';

const InternetStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [showStatus, setShowStatus] = useState(false);
  const errorPositionX = useSharedValue(500); // Starting position (off the screen)cvbv v

  const {showTabBar} = useTabBar();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);

      if (!state.isConnected && !state.isInternetReachable) {
        errorPositionX.value = withSpring(0, {
          damping: 10,
          stiffness: 100,
          overshootClamping: true,
        });
        setShowStatus(true);

        setTimeout(() => {
          setShowStatus(false);
        }, 5000);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [errorPositionX, showStatus, showTabBar]);

  const animatedErrorStyle = useAnimatedStyle(() => ({
    transform: [{translateX: errorPositionX.value}],
  }));

  const memoizedStatusView = useMemo(
    () => (
      <Animated.View
        style={[
          styles.container,
          {
            bottom:
              Platform.OS === 'android'
                ? showTabBar
                  ? 50
                  : 0
                : showTabBar
                ? 80
                : 20,
          },
          {
            backgroundColor: isConnected
              ? colors.greenColorCard
              : colors.redColorCard,
          },
          animatedErrorStyle,
        ]}>
        <Text style={styles.text}>
          {isConnected ? 'Connection is stable' : 'No internet connection'}
        </Text>
      </Animated.View>
    ),
    [isConnected, showTabBar, animatedErrorStyle],
  );

  return <>{showStatus && memoizedStatusView}</>;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',

    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fonts.RBold,
  },
});

export default React.memo(InternetStatus);
