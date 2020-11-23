import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

const TCPopupMessage = ({
  top = 13, arrowFromLeft = 0, visible, message,
}) => (
  <View style={{ zIndex: 1, display: visible ? 'flex' : 'none' }}>
    <FastImage
            style={{ ...styles.upArrow, top: top - 15, left: arrowFromLeft }}
            source={images.popupUpArrow}
        />

    <LinearGradient
        colors={[colors.yellowColor, colors.themeColor]}
        style={{
          ...styles.mainContainer,
          top,
        }}
    >

      <Text style={styles.message}>
        {message}
      </Text>
    </LinearGradient>
  </View>
)

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    height: 'auto',
    width: '100%',
    padding: 15,
    zIndex: 1,
    alignSelf: 'center',
    borderRadius: 15,
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.RMedium,
    color: colors.whiteColor,
    textAlign: 'justify',
  },
  upArrow: {
    position: 'absolute',
    bottom: 100,
    height: 15,
    width: 15,
  },
})
export default TCPopupMessage;
