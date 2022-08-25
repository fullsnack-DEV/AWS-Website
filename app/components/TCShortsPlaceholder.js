import React, {memo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

import images from '../Constants/ImagePath';

const TCShortsPlaceholder = ({onPress}) => (
  <View style={styles.backgroundView}>
    <FastImage source={images.shortCard} style={styles.shortView} />
    <FastImage source={images.shortCard} style={styles.shortView} />
    <FastImage source={images.shortCard} style={styles.shortView} />
    <LinearGradient
        colors={[colors.whiteColor, colors.whiteColor]}
        style={styles.overlayStyle}>
      <Text style={styles.placeholderTextStyle}>{'NO SHORTS'}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.startTitle} numberOfLines={2}>
          {'Post your short >'}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  </View>
  );

const styles = StyleSheet.create({
  shortView: {
    height: 250,
    width: 150,
    resizeMode: 'cover',
  },

  backgroundView: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
  },
  overlayStyle: {
    alignSelf: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RMedium,
    color: colors.googleColor,
    textAlign: 'center',
  },

  startTitle: {
    fontSize: 20,
    fontFamily: fonts.RMedium,
    color: colors.themeColor,
    alignSelf: 'center',
    textAlign: 'center',
  },
});

export default memo(TCShortsPlaceholder);
