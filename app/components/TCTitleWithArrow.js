import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';

import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import {strings} from '../../Localization/translation';

function TCTitleWithArrow({
  isNew = false,
  title,
  viewStyle,
  style,
  required = false,
  showArrow = false,
  onPress,
  isDisabled = false,
  ...otherProps
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress} disabled={isDisabled}>
      <View style={[styles.viewContainer, viewStyle]}>
        <Text style={[styles.labelText, style]} {...otherProps}>
          {title}
          {required && <Text style={styles.mendatory}> {strings.star} </Text>}
          {isNew && <Text style={styles.newText}> {strings.newText} </Text>}
        </Text>
        {showArrow && (
          <View style={styles.arrowContainerStyle}>
            <Image source={images.nextArrow} style={styles.arrowStyle} />
          </View>
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
    fontFamily: fonts.RMedium,
    marginRight: 10,
    lineHeight: 25,
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
    width: 4,
    height: 8,
    tintColor: colors.lightBlackColor,
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  arrowContainerStyle: {
    height: 16,
    width: 16,
    backgroundColor: '#F2F2F2',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TCTitleWithArrow;
