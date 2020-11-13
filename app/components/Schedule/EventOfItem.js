import React from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventOfItem({
  eventOfText, countryIcon, leagueIcon, cityName, eventTextStyle,
}) {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.eventOfTextStyle}>{eventOfText}</Text>
      <View style={styles.eventImageTextViewStyle}>
        <View style={styles.eventImageViewStyle}>
          <Image source={countryIcon} style={styles.eventImageStyle} resizeMode={'contain'} />
        </View>
        <Text style={[styles.eventTextStyle, eventTextStyle]}>{cityName}</Text>
        <Image source={leagueIcon} style={styles.groupImageStyle} resizeMode={'contain'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  eventOfTextStyle: {
    marginRight: 8,
    fontSize: 12,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  eventImageTextViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventImageViewStyle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    elevation: 5,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventImageStyle: {
    width: 15,
    height: 15,
  },
  eventTextStyle: {
    marginLeft: 5,
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  groupImageStyle: {
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
});

export default EventOfItem;
