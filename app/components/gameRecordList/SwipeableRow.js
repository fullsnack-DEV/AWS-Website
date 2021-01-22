import React, { useRef } from 'react';
import {
  Animated, StyleSheet, TouchableOpacity,
  Image,
} from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import { widthPercentageToDP as wp } from '../../utils';
import images from '../../Constants/ImagePath';

const SwipeableRow = ({
  onPress,
  buttons = [{ key: 'delete', fillColor: '#E63E3F', image: images.deleteIcon }],
  enabled = true,
  children,
}) => {
  const swipeableRef = useRef(null);

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0.7, 0],
    })
    let buttonSize = 15;
    if (buttons?.length >= 2) buttonSize = 25
    return (
      <>
        {buttons?.map((item, index) => (
          <TouchableOpacity activeOpacity={1} key={index} onPress={() => onItemPress(item?.key)} style={{ backgroundColor: item?.fillColor, justifyContent: 'center' }}>
            <Animated.View
                  style={{
                    paddingHorizontal: 10,
                    width: wp(20),
                    transform: [{ scale }],
                  }}>
              <RectButton
                    style={styles.rightAction}>
                <Image source={item?.image} style={{ ...styles.deleteImgContainer, height: buttonSize, width: buttonSize }} />
              </RectButton>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </>
    )
  }

  const onItemPress = (key) => {
    swipableClose();
    onPress(key);
  }

  const swipableClose = () => {
    swipeableRef.current.close();
  }
  return (enabled
    ? <Swipeable
        ref={swipeableRef}
        friction={2}
        rightThreshold={40}
        renderRightActions={renderRightActions}>
      {children}
    </Swipeable> : children
  );
}

const styles = StyleSheet.create({
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  deleteImgContainer: {
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SwipeableRow;
