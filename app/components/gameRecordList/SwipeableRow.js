import React, {useRef} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Image} from 'react-native';
import Animated from 'react-native-reanimated';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';

const SwipeableRow = ({
  onPress = () => {},
  buttons = [],
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

    return buttons.map((item, index) => (
      <Animated.View
        key={index}
        style={{
          ...(scaleEnabled && {transform: [{scale}]}),
        }}>
        <TouchableOpacity
          onPress={() => onItemPress(item.key)}
          style={styles.parent}>
          <LinearGradient
            colors={
              Array.isArray(item.fillColor)
                ? item.fillColor
                : [item.fillColor, item.fillColor]
            }
            style={{width: '100%', height: '100%'}}>
            <View style={styles.container}>
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
              </View>

              {showLabel ? (
                <Text style={styles.label}>{item.label}</Text>
              ) : null}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    ));
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
  parent: {
    width: 57,
    marginBottom: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  label: {
    marginTop: 5,
    color: colors.whiteColor,
    fontSize: 12,
    fontFamily: fonts.RRegular,
  },
});

export default SwipeableRow;
