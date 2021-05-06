/* eslint-disable react-native/no-unused-styles */
import React, { memo } from 'react';
import {
 View, Text, StyleSheet, Image, TouchableOpacity,
 } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';

// import strings from '../../../Constants/String'

const UserInfoPlaysInItem = ({
  title,
  // totalGames,
  thumbURL,
  onPlayInPress,
}) => (
  <TouchableOpacity onPress={onPlayInPress}>
    <View style={styles.containerStyle}>
      <Image source={thumbURL} style={styles.imageStyle} />
      <View style={{ marginLeft: 10, marginRight: 12 }}>
        <Text style={styles.titleStyle}>{title}</Text>
        {/* <Text style={styles.subTitleStyle}>
          {`${totalGames} ${strings.totalGames}` }
        </Text> */}
      </View>
      <LinearGradient
        colors={[colors.yellowColor, colors.orangeGradientColor]}
        style={styles.overlayStyle}
        end={{ x: 1, y: 1 }}
        start={{ x: 1, y: 0 }}></LinearGradient>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'column',
    height: 90,
    width: 90,
    borderRadius: 8,
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 2,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    height: 35,
    width: 35,
    borderColor: colors.whiteColor,
    borderWidth: 2,
  },
  titleStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  subTitleStyle: { fontFamily: fonts.RLight, fontSize: 12 },
  overlayStyle: {
    position: 'absolute',
    bottom: 0,
    height: 6,
    width: 90,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
});

export default memo(UserInfoPlaysInItem);
