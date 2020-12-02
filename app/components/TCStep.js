import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../Constants/Colors';

const TCStep = ({
  totalStep = 0,
  currentStep = 0,
  style,
}) => (
  <View style={{ ...styles.mainContainer, ...style }}>
    {Array(Number(currentStep)).fill().map((item, index) => (
      <LinearGradient
          key={index}
            colors={ [colors.yellowColor, colors.themeColor] }
            style={ styles.smallView }/>
    ))}
    {Array(Number(totalStep) - Number(currentStep)).fill().map((item, index) => (
      <LinearGradient
          key={index}
            colors={ ['#E4E4E4', '#E4E4E4'] }
            style={ styles.smallView }/>
    ))}
  </View>
)

const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: 'flex-end',
    padding: 10,
    flexDirection: 'row',
  },
  smallView: {
    width: 11,
    height: 5,
    borderRadius: 1,
    marginHorizontal: 2,
  },
})
export default TCStep;
