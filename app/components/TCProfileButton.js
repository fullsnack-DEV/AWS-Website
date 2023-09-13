import React, {memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

const TCProfileButton = ({
  title = 'Profile',
  showArrow = true,
  onPressProfile = () => {},
  style,
  rightImage = images.arrowGraterthan,
  imageStyle,
  textStyle,
  tickImage = false,
}) => (
  <TouchableWithoutFeedback onPress={onPressProfile}>
    <View style={[styles.buttonView, style]}>
      <Text style={[styles.textStyle, textStyle]} numberOfLines={1}>
        {title}
      </Text>
      {showArrow && (
        <Image source={rightImage} style={[styles.arrowImage, imageStyle]} />
      )}
      {tickImage && (
        <Image source={images.tickImage} style={styles.tickImage} />
      )}
    </View>
  </TouchableWithoutFeedback>
);
const styles = StyleSheet.create({
  buttonView: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    height: 25,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  textStyle: {
    alignSelf: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 12,
    textAlign: 'center',
    color: colors.lightBlackColor,
  },
  arrowImage: {
    alignSelf: 'center',
    height: 10,
    resizeMode: 'contain',
    width: 5,
    marginLeft: 8,
    tintColor: colors.lightBlackColor,
  },
  tickImage: {
    alignSelf: 'center',
    height: 10,
    resizeMode: 'contain',
    width: 10,
    marginLeft: 4,
    marginTop: 2,
    tintColor: colors.lightBlackColor,
  },
});

export default memo(TCProfileButton);
