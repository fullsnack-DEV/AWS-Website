import React from 'react';
import { Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCPopupMessage = ({
  top = 13, message, style,
}) => (

  <LinearGradient
        colors={[colors.yellowColor, colors.themeColor]}
        style={{
          ...styles.mainContainer,
          top,
          ...style,

        }}
    >

    <Text style={styles.message}>
      {message}
    </Text>
  </LinearGradient>
)

const styles = StyleSheet.create({
  mainContainer: {
    height: 'auto',
    width: '100%',
    padding: 15,
    alignSelf: 'center',
    borderRadius: 15,
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.RMedium,
    color: colors.whiteColor,
    textAlign: 'justify',
  },
})
export default TCPopupMessage;
