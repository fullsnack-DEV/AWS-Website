import React, {useContext} from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {getSportName} from '../../utils';
import AuthContext from '../../auth/context';

export default function TCEventCard({
  onPress,
  data,
  // entity,
}) {
  console.log('datdtadtadtatd', data);
  const convertUTCDateToLocalDate = (date) => {
    const newDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60 * 1000,
    );
    return newDate;
  };

  const authContext = useContext(AuthContext);

  console.log('data::=>', data);
  const isGame = !!(data?.game_id && data?.game);

  const stDate = new Date(data.start_datetime * 1000);
  const startDate = data?.start_datetime
    ? convertUTCDateToLocalDate(stDate)
    : '';

  const enDate = new Date(data.end_datetime * 1000);
  const endDate = data?.end_datetime ? convertUTCDateToLocalDate(enDate) : '';

  console.log('stDate', stDate, startDate);
  console.log('endDate', enDate, endDate);

  const location =
    data?.location?.location_name ??
    data?.game?.venue?.address ??
    data?.game?.venue?.description ??
    '';
  const title = isGame ? getSportName(data.game, authContext) : data.title;

  return (
    <TouchableWithoutFeedback style={styles.backgroundView} onPress={onPress}>
      <View style={styles.backgroundView} onPress={onPress}>
        <LinearGradient
          colors={[colors.greenGradientEnd, colors.greenGradientStart]}
          style={styles.colorView}
        >
          {data?.allDay && data?.allDay === true ? (
            <Text style={styles.allTypeText}>{'All'}</Text>
          ) : (
            <Text style={styles.dateMonthText}>
              {moment(startDate).format('h')}
              <Text style={styles.dateMonthSmallText}>
                :{moment(startDate).format('mm')}
              </Text>
            </Text>
          )}
          {data?.allDay && data?.allDay === true ? (
            <Text style={styles.dateText}>Day</Text>
          ) : (
            <Text style={styles.dateText}>{moment(startDate).format('a')}</Text>
          )}
        </LinearGradient>
        <View style={styles.eventText}>
          <View style={styles.eventTitlewithDot}>
            <View>
              <Text
                style={[
                  styles.eventTitle,
                  {color: colors.greenGradientStart, width: 200},
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>
              <View style={styles.bottomView}>
                <Text style={styles.eventTime}>{`${moment(startDate).format(
                  'h:mma',
                )} - `}</Text>
                <Text style={styles.eventTime}>
                  {moment(endDate).format('h:mma')}
                </Text>
                {location !== '' && (
                  <Text style={[styles.eventTime, {marginHorizontal: 5}]}>
                    {' '}
                    |{' '}
                  </Text>
                )}
                <Text numberOfLines={1} style={{...styles.eventTime, flex: 1}}>
                  {data?.going?.length ?? 0}
                  {' going'}
                </Text>
              </View>

              <View style={styles.bottomView}>
                <Text numberOfLines={1} style={{...styles.eventTime, flex: 1}}>
                  {location !== '' && location}
                </Text>
              </View>
            </View>

            <FastImage
              source={
                data?.background_thumbnail
                  ? {uri: data?.background_thumbnail}
                  : images.backgroudPlaceholder
              }
              style={{height: 66, width: 66, borderRadius: 5}}
            />
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}
          >
            <FastImage
              source={
                data?.owner_obj?.thumbnail
                  ? {uri: data?.owner_obj?.thumbnail}
                  : images.profilePlaceHolder
              }
              style={{height: 15, width: 15, borderRadius: 30}}
            />
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                color: colors.lightBlackColor,
                fontFamily: fonts.RBold,
                flex: 1,
                marginLeft: 5,
              }}
            >
              {data?.owner_obj?.group_name ?? data?.owner_obj?.full_name}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    marginBottom: 15,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: wp('94%'),
  },
  bottomView: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  colorView: {
    alignItems: 'center',
    backgroundColor: colors.orangeColor,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    paddingTop: 10,
    paddingLeft: 5,
    width: wp('12%'),
  },
  dateMonthText: {
    color: colors.whiteColor,
    fontSize: 20,
    fontFamily: fonts.RBold,
  },
  dateMonthSmallText: {
    color: colors.whiteColor,
    fontSize: 10,
    fontFamily: fonts.RBold,
  },
  allTypeText: {
    color: colors.whiteColor,
    fontSize: 20,
    fontFamily: fonts.RBold,
  },
  dateText: {
    color: colors.whiteColor,
    fontSize: 16,
    fontFamily: fonts.RLight,
  },

  eventText: {
    padding: 10,
    width: wp('83%'),
  },
  eventTime: {
    fontSize: 12,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    width: wp('70%'),
    color: colors.googleColor,
  },
  eventTitlewithDot: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
