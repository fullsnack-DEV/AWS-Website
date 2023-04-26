import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

function EventTimeItem({fromTime, toTime, location = '', eventOnlineUrl = ''}) {
  return (
    <View style={styles.containerStyle}>
      <View style={styles.timeValueStyle}>
        <Image
        source={images.eventClock}
        style={{width: 14, height: 14, marginRight: 10}}
        />
        <Text style={styles.fromTimeTextStyle}>{fromTime} &nbsp; {toTime}</Text>
      </View>
      {
      (location.length > 0 || eventOnlineUrl.length > 0) && (
      <View style={styles.timeValueStyle}>
        <Image
        source={images.eventMap}
        style={{width: 14, height: 18, marginRight: 10}}
        />
        {
          location ? (
            <Text style={styles.fromTimeTextStyle}>{location} </Text>
          ):(
              <Text style={[styles.fromTimeTextStyle, {
                  textDecorationLine: 'underline',
                  textDecorationStyle: 'solid',
                  textDecorationColor: colors.darkGrayColor
                }]}>
                  {eventOnlineUrl} 
              </Text>
          )
        }
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: wp('96%'),
    marginTop: 20
  },
  timeValueStyle: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginVertical: 3,
    alignContent: 'center',
    alignItems: 'center'
  },
  fromTimeTextStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    lineHeight: 24
  }
});

export default EventTimeItem;
