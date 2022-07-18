import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

function TCTouchableLabel({
  disabled = false,
  title = '',
  subTitle,
  onPress,
  placeholder,
  placeholderTextColor = colors.userPostTimeColor,
  textStyle,
  style,
  showNextArrow = false,
  showDownArrow = false,
  showShadow = true,
}) {
  return (
    <View>
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={
          !showShadow
            ? [styles.containerStyle, style]
            : [
                styles.containerStyle,
                style,
                {
                  borderRadius: 5,
                  shadowColor: colors.blackColor,
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.16,
                  shadowRadius: 1,
                  elevation: 3,
                },
              ]
        }
      >
        {!subTitle && (
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            style={[styles.textInput, textStyle]}
            value={title}
            editable={false}
            pointerEvents="none"
          />
        )}
        {subTitle && (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.text}>{subTitle}</Text>
          </View>
        )}
        {showNextArrow && (
          <Image style={styles.nextIconStyle} source={images.nextArrow} />
        )}
        {showDownArrow && (
          <Image style={styles.downIconStyle} source={images.dropDownArrow2} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    marginHorizontal: 15,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
  },

  textInput: {
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingHorizontal: 10,
    color: colors.lightBlackColor,
  },
  text: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  nextIconStyle: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 14,
    width: 8,
    marginEnd: 10,
    tintColor: colors.userPostTimeColor,
  },
  downIconStyle: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 12,
    width: 18,
    marginEnd: 10,
    tintColor: colors.userPostTimeColor,
  },
});

export default TCTouchableLabel;

/*
keyboardType :
The following values work across platforms:

default
number-pad
decimal-pad
numeric
email-address
phone-pad
*/
