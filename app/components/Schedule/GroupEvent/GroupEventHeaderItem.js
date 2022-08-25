import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

export default function GroupEventHeaderItem({
  onHeaderItemPress,
  source,
  title,
}) {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.titleTextStyle}>{title}</Text>
      <TouchableOpacity
        style={styles.touchCheckBoxStyle}
        onPress={onHeaderItemPress}>
        <Image
          source={source}
          style={styles.imageStyle}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    width: wp('87%'),
    alignSelf: 'center',
    marginTop: wp('2.5%'),
  },
  titleTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  touchCheckBoxStyle: {
    alignSelf: 'center',
    position: 'absolute',
    right: wp(0),
  },
  imageStyle: {
    width: wp('5.5%'),
    alignSelf: 'center',
  },
});
