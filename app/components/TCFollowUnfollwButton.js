import React, {memo} from 'react';
import {StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCFollowUnfollowButton = ({
  title,
  onPress,

  rightIcon,
  rightIconStyle,
  startGradientColor = colors.whiteColor,
  endGradientColor = colors.whiteColor,
  isFollowing,
}) => (
  <TouchableOpacity onPress={onPress} style={styles.outerContainerStyle}>
    <LinearGradient
      colors={[endGradientColor, startGradientColor]}
      style={styles.containerStyle}
    >
      <Text
        style={[
          styles.buttonText,
          {color: isFollowing ? colors.lightBlackColor : colors.themeColor},
        ]}
      >
        {title}
      </Text>
      {rightIcon && (
        <Image
          style={[styles.rightIconStyle, rightIconStyle]}
          source={rightIcon}
        />
      )}
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  outerContainerStyle: {
    alignSelf: 'center',
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 1.5,
  },
  containerStyle: {
    flexDirection: 'row',
    borderRadius: 5,
    justifyContent: 'center',
    margin: 0,
    height: 24,
    width: 80,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 12,
    fontFamily: fonts.RBold,
  },
  rightIconStyle: {
    alignSelf: 'center',
  },
});

export default memo(TCFollowUnfollowButton);
