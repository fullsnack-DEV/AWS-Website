import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventBetweenUserItem({
  firstUserImage,
  firstText,
  secondUserImage,
  secondText,
}) {
  return (
    <View style={styles.containerStyle}>
      <View style={styles.firstUserViewStyle}>
        <View style={styles.eventImageViewStyle}>
          <Image
            source={firstUserImage}
            style={styles.imageStyle}
            resizeMode={'cover'}
          />
        </View>
        <Text style={styles.textStyle}>{firstText}</Text>
      </View>
      <Text style={styles.vsTextStyle}>{'vs'}</Text>
      <View style={styles.firstUserViewStyle}>
        <Text style={styles.textStyle}>{secondText}</Text>
        <View style={styles.eventImageViewStyle}>
          <Image
            source={secondUserImage}
            style={styles.imageStyle}
            resizeMode={'cover'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // width: wp('95%'),
    backgroundColor :'#fff'
  },
  firstUserViewStyle: {
    flexDirection: 'row',
    width: wp('32%'),
    alignItems: 'center',
  },
  eventImageViewStyle: {
    height: 35,
    width: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
    elevation: 5,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
  },
  textStyle: {
    width: wp('20%'),
    fontSize: 12,
    fontFamily: fonts.RMedium,
    lineHeight:25,
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
