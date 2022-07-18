import React, {memo, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import AuthContext from '../auth/context';
import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import ReservationStatus from '../Constants/ReservationStatus';
import {getSportName} from '../utils';

function GameCard({
  data,
  onPress,
  cardWidth = '86%',
  isSelected = false,
  showSelectionCheckBox = false,
}) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const authContext = useContext(AuthContext);

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
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.mainContainer, {width: wp(cardWidth)}]}
    >
      <View style={[styles.backgroundView, {width: wp(cardWidth)}]}>
        <LinearGradient
          colors={
            data?.status === ReservationStatus.cancelled
              ? [colors.startGrayGrdient, colors.endGrayGradient]
              : [colors.yellowColor, colors.assistTextColor]
          }
          style={
            data?.status === ReservationStatus.offered
              ? [styles.colorView, {opacity: 0.7}]
              : styles.colorView
          }
        >
          <View style={styles.dateView}>
            <Text style={styles.dateMonthText}>
              {months[new Date(data?.start_datetime * 1000).getMonth()]}
            </Text>
            <Text style={styles.dateText}>
              {new Date(data?.start_datetime * 1000).getDate()}
            </Text>
          </View>
        </LinearGradient>
        <View style={styles.eventText}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.eventTitle}>
              {getSportName(data, authContext)}
            </Text>
            <TouchableOpacity
              style={{marginRight: 7, marginBottom: 5}}
              onPress={onPress}
            >
              {/* eslint-disable-next-line no-nested-ternary */}
              {showSelectionCheckBox ? (
                isSelected ? (
                  <FastImage
                    source={images.orangeCheckBox}
                    resizeMode={'contain'}
                    style={styles.checkboxImg}
                  />
                ) : (
                  <FastImage
                    resizeMode={'contain'}
                    source={images.uncheckWhite}
                    style={styles.unCheckboxImg}
                  />
                )
              ) : null}
            </TouchableOpacity>
          </View>
          <View style={styles.bottomView}>
            <Text style={styles.eventTimeLocation}>
              {formatAMPM(new Date(data?.start_datetime * 1000))} -{' '}
              {formatAMPM(new Date(data?.end_datetime * 1000))}
            </Text>
            <Text style={styles.textSaperator}> | </Text>
            <Text style={styles.addressView} numberOfLines={1}>
              {data?.venue?.address ?? data?.venue?.description}
            </Text>
          </View>
          <View style={styles.gameVSView}>
            {data?.userChallenge || data?.user_challenge ? (
              <View style={styles.leftGameView}>
                {data?.home_team?.thumbnail ? (
                  <Image
                    source={{uri: data?.home_team?.thumbnail}}
                    style={styles.profileImage}
                  />
                ) : (
                  <Image
                    source={images.teamPlaceholder}
                    style={styles.profileImage}
                  />
                )}
                <Text style={styles.leftEntityText} numberOfLines={2}>
                  {data?.home_team?.full_name}
                </Text>
              </View>
            ) : (
              <View style={styles.leftGameView}>
                {data?.home_team?.thumbnail ? (
                  <Image
                    source={{uri: data?.home_team?.thumbnail}}
                    style={styles.profileImage}
                  />
                ) : (
                  <Image
                    source={images.teamPlaceholder}
                    style={styles.profileImage}
                  />
                )}
                <Text style={styles.leftEntityText} numberOfLines={2}>
                  {data?.home_team?.group_name}
                </Text>
              </View>
            )}

            <Text style={styles.vsView}>VS</Text>

            {data?.userChallenge || data?.user_challenge ? (
              <View style={styles.rightGameView}>
                <Text style={styles.rightEntityText} numberOfLines={2}>
                  {data?.away_team?.full_name}
                </Text>
                {data?.away_team?.thumbnail ? (
                  <Image
                    source={{uri: data?.away_team?.thumbnail}}
                    style={styles.profileImage}
                  />
                ) : (
                  <Image
                    source={images.teamPlaceholder}
                    style={styles.profileImage}
                  />
                )}
              </View>
            ) : (
              <View style={styles.rightGameView}>
                <Text style={styles.rightEntityText} numberOfLines={2}>
                  {data?.away_team?.group_name}
                </Text>
                {data?.away_team?.thumbnail ? (
                  <Image
                    source={{uri: data?.away_team?.thumbnail}}
                    style={styles.profileImage}
                  />
                ) : (
                  <Image
                    source={images.teamPlaceholder}
                    style={styles.profileImage}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    marginBottom: 15,

    elevation: 2,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1.5},
    shadowOpacity: 0.16,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    flexDirection: 'row',
    height: 102,
    width: wp('86%'),
  },
  bottomView: {
    flexDirection: 'row',
  },
  colorView: {
    borderBottomLeftRadius: 6,
    borderTopLeftRadius: 6,
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
    color: colors.googleColor,
    fontFamily: fonts.RRegular,
    fontSize: 12,
  },
  eventTitle: {
    color: colors.tabFontColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginBottom: 1,
  },

  gameVSView: {
    alignItems: 'center',

    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 5,
  },

  addressView: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.googleColor,

    flex: 1,
  },
  vsView: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.googleColor,
  },

  profileImage: {
    height: 30,
    width: 30,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 15,
  },

  leftGameView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

    flex: 0.4,
  },
  leftEntityText: {
    fontSize: 11,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    textAlign: 'left',
    marginLeft: 5,
    flex: 1,
  },
  rightEntityText: {
    color: colors.lightBlackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 11,
    marginRight: 5,
    textAlign: 'right',
  },
  rightGameView: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 0.4,
    justifyContent: 'flex-end',
  },
  textSaperator: {
    color: colors.userPostTimeColor,
    marginLeft: 5,
    marginRight: 5,
    opacity: 0.4,
  },
  unCheckboxImg: {
    width: 22,
    height: 22,
    tintColor: colors.whiteColor,
  },
  checkboxImg: {
    width: 22,
    height: 22,
  },
});

export default memo(GameCard);
