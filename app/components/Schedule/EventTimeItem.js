import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

const EventTimeItem = ({
  fromTime,
  toTime,
  location = '',
  eventOnlineUrl = '',
  is_Offline,
}) => (
  <View style={styles.containerStyle}>
    <View style={[styles.timeValueStyle, {marginBottom: 5}]}>
      <Image
        source={images.eventClock}
        style={{width: 14, height: 14, marginRight: 10}}
      />
      <View style={styles.timeValueStyle}>
        <Text style={styles.fromTimeTextStyle}>{fromTime}</Text>
        <View style={styles.separator} />
        <Text style={styles.fromTimeTextStyle}>{toTime}</Text>
      </View>
    </View>
    {(location.length > 0 || eventOnlineUrl.length > 0) && (
      <View style={styles.timeValueStyle}>
        <Image
          source={images.eventMap}
          style={{width: 14, height: 18, marginRight: 10}}
        />
        {is_Offline ? (
          <Text style={styles.fromTimeTextStyle}>{location} </Text>
        ) : (
          <Text
            style={[
              styles.fromTimeTextStyle,
              {textDecorationLine: 'underline'},
            ]}>
            {eventOnlineUrl}
          </Text>
        )}
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 15,
  },
  timeValueStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fromTimeTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  separator: {
    width: 1,
    height: 10,
    marginHorizontal: 10,
    backgroundColor: colors.darkGrey,
  },
});

export default EventTimeItem;
