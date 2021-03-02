import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import LinearGradient from 'react-native-linear-gradient';
import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import ReservationStatus from '../Constants/ReservationStatus';
import * as Utility from '../utils';

function TCChallengerCard({ data, onPress, cardWidth = '86%' }) {
  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours || 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const time = `${hours}:${minutes} ${ampm}`;
    return time;
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.backgroundView, { width: wp(cardWidth) }]}>
        <LinearGradient
          colors={[colors.greenGradientEnd, colors.greenGradientStart]}
          style={
            data?.status === ReservationStatus.offered
              ? [styles.colorView, { opacity: 0.7 }]
              : styles.colorView
          }>
          <View style={styles.dateView}>
            <Text style={styles.dateMonthText}>
              {Utility.monthNames[new Date(data.start_datetime * 1000).getMonth()]}
            </Text>
            <Text style={styles.dateText}>
              {new Date(data.start_datetime * 1000).getDate()}
            </Text>
          </View>
        </LinearGradient>
        <View style={{ borderRadius: 10, alignSelf: 'center', marginLeft: 10 }}>
          <Image
            source={images.soccerBackground}
            style={{
              height: 80,
              width: 100,
              resizeMode: 'cover',
              borderRadius: 10,
            }}
          />
          <Image
            style={{
              backgroundColor: 'black',
              height: 35,
              width: 35,
              position: 'absolute',
              bottom: -5,
              right: -5,
              borderRadius: 18,
            }}
          />
        </View>

        <View style={styles.eventText}>
          <View style={styles.bottomView}>
            <Text style={styles.eventTimeLocation}>
              {formatAMPM(new Date(data.start_datetime * 1000))} -{' '}
              {formatAMPM(new Date(data.end_datetime * 1000))}
            </Text>
            <Text style={styles.textSaperator}> | </Text>
            <Text style={styles.priceView} numberOfLines={1}>
              $100 CAD
            </Text>
          </View>
          <Text style={styles.eventTitle} numberOfLines={2}>
            United States women’s soccer team
          </Text>
          <View style={styles.gameVSView}>
            {/* images.requestOut */}
            <Image source={images.requestOut} style={styles.inOutImageView} />
            <Text style={styles.requesterText}>challenger</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 102,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: wp('86%'),
    // marginTop: 15,
  },
  bottomView: {
    flexDirection: 'row',
  },
  colorView: {
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    height: 102,
    width: 42,
  },
  dateMonthText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RLight,
    fontSize: 12,
  },
  dateText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 12,
  },
  dateView: {
    marginTop: 15,
  },
  eventText: {
    flexDirection: 'column',
    padding: 10,
    width: wp('76%'),
  },
  eventTimeLocation: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.greenGradientStart,
  },
  eventTitle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginBottom: 1,
    width: wp('50%'),
  },

  gameVSView: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  priceView: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.greenGradientStart,

    flex: 1,
  },
  textSaperator: {
    color: colors.userPostTimeColor,
    marginLeft: 5,
    marginRight: 5,
    opacity: 0.4,
  },
  inOutImageView: {
    alignSelf: 'center',
    height: 30,
    resizeMode: 'cover',
    width: 30,
    marginLeft: -5,
  },
  requesterText: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.greeColor,

    marginLeft: 5,
  },
});

export default memo(TCChallengerCard);
