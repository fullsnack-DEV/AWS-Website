import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';

export default function UserInfoScorekeeperInItem({
  title,
  thumbURL,
  onRefereesInPress,
}) {
  return (
    <TouchableOpacity style={styles.containerStyle} onPress={onRefereesInPress}>
      <Image source={thumbURL} style={styles.imageStyle} />
      <View style={{marginLeft: 10, marginRight: 12}}>
        <Text
          style={[styles.titleStyle, {fontSize: title.length > 12 ? 12 : 14}]}>
          {title}
        </Text>
      </View>
      <LinearGradient
        colors={[colors.blueGradiantEnd, colors.blueGradiantStart]}
        style={styles.overlayStyle}
        end={{x: 1, y: 1}}
        start={{x: 1, y: 0}}></LinearGradient>
    </TouchableOpacity>
  );
}

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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageStyle: {
    height: 42,
    width: 42,
    resizeMode: 'contain',
    borderColor: colors.whiteColor,
    borderWidth: 2,
  },
  titleStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  overlayStyle: {
    position: 'absolute',
    bottom: 0,
    height: 6,
    width: 90,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
});
