import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import LinearGradient from 'react-native-linear-gradient';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';

const SwipeableRow = ({
  onPress = () => {},
  buttons = [{ key: 'delete', fillColor: '#E63E3F', image: images.deleteIcon }],
  enabled = true,
  children,
  showLabel = true,
  scaleEnabled = true,
}) => {
  const swipeableRef = useRef(null);

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0.7, 0],
    });
    let buttonSize = 30;
    if (buttons?.length >= 2 && scaleEnabled) buttonSize = 25;
    return (
      <>
        {buttons?.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            onPress={() => onItemPress(item?.key)}
            style={{ justifyContent: 'center', alignItems: 'center', width: 57 }}>
            <LinearGradient
              colors={
                Array.isArray(item.fillColor)
                  ? item.fillColor
                  : [item.fillColor, item.fillColor]
              }
              style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Animated.View
                style={{
                  paddingHorizontal: 10,
                  minWidth: 57,
                  ...(scaleEnabled && { transform: [{ scale }] }),
                }}>
                <View style={styles.rightAction}>
                  <Image
                    source={item?.image}
                    style={{
                      ...styles.deleteImgContainer,
                      height: buttonSize,
                      width: buttonSize,
                    }}
                  />
                  {showLabel && <Text style={styles.label}>{item?.label}</Text>}
                </View>
              </Animated.View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </>
    );
  };

  const onItemPress = (key) => {
    swipableClose();
    onPress(key);
  };

  const swipableClose = () => {
    swipeableRef.current.close();
  };
  return enabled ? (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={40}
      renderRightActions={renderRightActions}>
      {children}
    </Swipeable>
  ) : (
    children
  );
};

const styles = StyleSheet.create({
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  deleteImgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  label: {
    marginTop: 5,
    color: colors.whiteColor,
    fontSize: 12,
    fontFamily: fonts.RRegular,
  },
});

export default SwipeableRow;
