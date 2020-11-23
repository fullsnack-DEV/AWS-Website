import React from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function MatchBetweenUpcomingView({
  firstUserImage, firstText, secondUserImage, secondText,
}) {
  return (
    <View style={styles.containerStyle}>
      <View style={styles.firstUserViewStyle}>
        <View style={styles.eventImageViewStyle}>
          <Image source={firstUserImage} style={styles.imageStyle} resizeMode={'contain'} />
        </View>
        <Text style={[styles.textStyle, { marginLeft: 8 }]}>{firstText}</Text>
      </View>
      <Text style={styles.vsTextStyle}>{'VS'}</Text>
      <View style={styles.firstUserViewStyle}>
        <Text style={[styles.textStyle, { textAlign: 'right', marginRight: 8 }]}>{secondText}</Text>
        <View style={styles.eventImageViewStyle}>
          <Image source={secondUserImage} style={styles.imageStyle} resizeMode={'contain'} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  firstUserViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventImageViewStyle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    shadowOpacity: 0.3,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    elevation: 5,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: 30,
    height: 30,
  },
  textStyle: {
    width: 70,
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  vsTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RLight,
    letterSpacing: 1,
    color: colors.userPostTimeColor,
  },
});

export default MatchBetweenUpcomingView;
