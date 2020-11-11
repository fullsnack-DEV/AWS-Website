import React from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventBetweenUserItem({
  firstUserImage, firstText, secondUserImage, secondText,
}) {
  return (
    <View style={styles.containerStyle}>
      <View style={styles.firstUserViewStyle}>
        <View style={styles.eventImageViewStyle}>
          <Image source={firstUserImage} style={styles.imageStyle} resizeMode={'contain'} />
        </View>
        <Text style={styles.textStyle}>{firstText}</Text>
      </View>
      <Text style={styles.vsTextStyle}>{'vs'}</Text>
      <View style={styles.firstUserViewStyle}>
        <View style={styles.eventImageViewStyle}>
          <Image source={secondUserImage} style={styles.imageStyle} resizeMode={'contain'} />
        </View>
        <Text style={styles.textStyle}>{secondText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginBottom: 8,
    justifyContent: 'space-between',
    width: wp('76%'),
  },
  firstUserViewStyle: {
    flexDirection: 'row',
    width: wp('32%'),
    alignItems: 'center',
  },
  eventImageViewStyle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    marginHorizontal: 5,
    elevation: 10,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: 30,
    height: 30,
  },
  textStyle: {
    width: wp('20%'),
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  vsTextStyle: {
    fontSize: 15,
    fontFamily: fonts.RLight,
    letterSpacing: 1,
    color: colors.userPostTimeColor,
  },
});

export default EventBetweenUserItem;
