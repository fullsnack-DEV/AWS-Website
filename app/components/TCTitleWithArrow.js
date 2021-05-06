import React from 'react';
import {
View, StyleSheet, Text, Image,
} from 'react-native';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import strings from '../Constants/String';

function TCTitleWithArrow({
  isNew = false,
  title,
  viewStyle,
  style,
  required = false,
  showArrow = false,
  onPress,
  ...otherProps
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.viewContainer, viewStyle]}>
        <Text style={[styles.labelText, style]} {...otherProps}>
          {title}
          {required && <Text style={styles.mendatory}> {strings.star} </Text>}
          {isNew && <Text style={styles.newText}> {strings.newText} </Text>}
        </Text>
        {showArrow && (
          <Image source={images.nextArrow} style={styles.arrowStyle} />
      )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  labelText: {
    color: colors.lightBlackColor,
    fontSize: 20,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    marginRight: 10,
  },
  mendatory: {
    color: 'red',
  },
  newText: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.newTextColor,
    textAlign: 'right',
  },
  arrowStyle: {
    resizeMode: 'cover',
    width: 9,
    height: 16,
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
});

export default TCTitleWithArrow;
