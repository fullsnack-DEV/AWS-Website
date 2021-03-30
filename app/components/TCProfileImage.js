import React from 'react';
import {
 View, Image, StyleSheet, Text,
 } from 'react-native';

import TCImage from './TCImage';
import fonts from '../Constants/Fonts';
import colors from '../Constants/Colors';
import images from '../Constants/ImagePath';

export default function TCProfileImage({
  containerStyle,
  placeholderTextContainer,
  placeholderText,
  mainImageStyle,
  intialChar,
  entityType,
  source,
}) {
  let placeholder = images.profilePlaceHolder;
  if (entityType === 'club') {
    placeholder = images.clubPlaceholderSmall;
  } else if (entityType === 'team') {
    placeholder = images.teamPlaceholderSmall;
  }
  return (
    <View style={[styles.imageContainerStyle, containerStyle]}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.thinDividerColor,
        }}>
        <Image style={styles.placeHolderImage} source={placeholder} />
      </View>

      {entityType !== 'user' && (
        <View
          style={[styles.placeholderTextContainer, placeholderTextContainer]}>
          <Text style={[styles.placeholderText, placeholderText]}>
            {intialChar}
          </Text>
        </View>
      )}
      <TCImage
        containerStyle={[styles.mainImageStyle, mainImageStyle]}
        resizeMode={'cover'}
        imageStyle={styles.mainImageStyle}
        source={source}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainerStyle: {
    width: 40,
    height: 40,
    borderRadius: 80,
  },
  placeHolderImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  placeholderTextContainer: {
    width: 40,
    height: 40,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    textAlign: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBlack,
    fontSize: 17,
  },
  mainImageStyle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 80,
    alignSelf: 'center',
  },
});
