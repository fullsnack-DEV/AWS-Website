import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

export default function GroupEventItems({
  eventImageSource,
  eventText,
  groupImageSource,
  onCheckBoxPress,
  checkBoxImage,
}) {
  return (
    <View style={styles.containerStyle}>
      <View style={styles.eventImageTextViewStyle}>
        <View style={styles.eventImageViewStyle}>
          <FastImage
            source={groupImageSource}
            style={styles.eventImageStyle}
            resizeMode={'contain'}
          />
        </View>
        <Text style={styles.eventTextStyle}>{eventText}</Text>
        <Image
          source={eventImageSource}
          style={styles.groupImageStyle}
          resizeMode={'contain'}
        />
      </View>
      <TouchableOpacity
        style={styles.touchCheckBoxStyle}
        onPress={onCheckBoxPress}>
        <Image
          source={checkBoxImage}
          style={styles.checkBoxImageStyle}
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
  },
  eventImageTextViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventImageViewStyle: {
    height: 28,
    width: 28,
    borderRadius: 14,
    shadowOpacity: 0.3,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    elevation: 10,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    // overflow:'hidden',
  },
  eventImageStyle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    
  },
  eventTextStyle: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  groupImageStyle: {
    marginLeft:6,
    width: 18,
    height: 18,
    alignSelf: 'center',
  },
  touchCheckBoxStyle: {
    alignSelf: 'center',
    position: 'absolute',
    right: wp(0),
  },
  checkBoxImageStyle: {
    width: wp('5.5%'),
    alignSelf: 'center',
  },
});
