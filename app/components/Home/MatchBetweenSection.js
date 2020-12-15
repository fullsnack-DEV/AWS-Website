import React from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function MatchBetweenSection({
  firstUserImage,
  firstText,
  secondUserImage,
  secondText,
  firstTeamPoint,
  secondTeamPoint,
  containerStyle,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <View style={styles.firstUserViewStyle}>
        <View style={styles.eventImageViewStyle}>
          <Image source={firstUserImage} style={styles.imageStyle} resizeMode={'cover'} />
        </View>
        <Text style={[styles.textStyle, { marginLeft: 8 }]}>{firstText}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontFamily: fonts.RBold, color: colors.themeColor }}>{firstTeamPoint}</Text>
        <Text style={{ marginHorizontal: 5 }}>:</Text>
        <Text style={{ fontSize: 16, fontFamily: fonts.RRegular, color: colors.googleColor }}>{secondTeamPoint}</Text>
      </View>
      <View style={styles.firstUserViewStyle}>
        <Text style={[styles.textStyle, { textAlign: 'right', marginRight: 8 }]}>{secondText}</Text>
        <View style={styles.eventImageViewStyle}>
          <Image source={secondUserImage} style={styles.imageStyle} resizeMode={'cover'} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  firstUserViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventImageViewStyle: {
    height: 35,
    width: 35,
    borderRadius: 35 / 2,
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
    borderRadius: 30 / 2,
  },
  textStyle: {
    width: 70,
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});

export default MatchBetweenSection;
