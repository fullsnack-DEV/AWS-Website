import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'
import images from '../Constants/ImagePath'

function TCTouchableLabel({
  title,
  onPress,
  placeholder,
  placeholderTextColor = colors.userPostTimeColor,
  textStyle,
  style,
  showNextArrow = false,
  showDownArrow = false,
}) {
  return (
    <View>
      <TouchableOpacity
        onPress={ onPress } style={[styles.containerStyle, style]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          style={[styles.textInput, textStyle]}
          value={title}
          editable={false}
          pointerEvents="none"
          />
        {showNextArrow && (
          <Image
        style={styles.iconStyle}
        source={ images.nextArrow }
      />
        )}
        {showDownArrow && (
          <Image
        style={styles.iconStyle}
        source={ images.dropDownArrow2 }
      />
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
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 3,
  },

  textInput: {
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingHorizontal: 10,
    color: colors.lightBlackColor,
  },
  iconStyle: {
    alignSelf: 'center',
    resizeMode: 'center',
    height: 24,
    width: 12,
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
