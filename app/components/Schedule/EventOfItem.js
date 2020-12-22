import React from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventOfItem({
  eventOfText,
  countryIcon,
}) {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.eventOfTextStyle}>{eventOfText}</Text>
      <View style={styles.eventImageViewStyle}>
        <Image source={countryIcon} style={styles.eventImageStyle} resizeMode={'cover'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 3,
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
  eventImageViewStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    shadowOpacity: 0.4,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    elevation: 5,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  eventImageStyle: {
    width: 26,
    height: 26,
    borderRadius: 26 / 2,
  },
});

export default EventOfItem;
