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

function TCRecentMatchCard({ data, onPress, cardWidth = '86%' }) {
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

  // const renderMediaList = useCallback(
  //   () => (
  //     <Image
  //       source={images.soccerBackground}
  //       style={{
  //         height: 66,
  //         width: 66,
  //         resizeMode: 'cover',
  //         borderRadius: 10,
  //       }}
  //     />
  //   ),
  //   [],
  // );

  // const keyExtractor = useCallback((item, index) => index.toString(), []);
  // const renderSeparator = () => (
  //   <View
  //     style={{
  //       height: 50,
  //       width: 10,
  //     }}
  //   />
  // );
  return (
    <TouchableOpacity onPress={onPress}>

      <View style={[styles.backgroundView, { width: wp(cardWidth) }]}>
        <LinearGradient
          colors={
            data?.status === ReservationStatus.cancelled
              ? [colors.startGrayGrdient, colors.endGrayGradient]
              : [colors.yellowColor, colors.assistTextColor]
          }
          style={
            data?.status === ReservationStatus.offered
              ? [styles.colorView, { opacity: 0.7 }]
              : styles.colorView
          }>
          <View style={styles.dateView}>
            <Text style={styles.dateMonthText}>
              {months[new Date(data.start_datetime * 1000).getMonth()]}
            </Text>
            <Text style={styles.dateText}>
              {new Date(data.start_datetime * 1000).getDate()}
            </Text>
          </View>
        </LinearGradient>
        <View style={styles.eventText}>
          <Text style={styles.eventTitle}>{data.sport}</Text>
          <View style={styles.bottomView}>
            <Text style={styles.eventTimeLocation}>
              {formatAMPM(new Date(data.start_datetime * 1000))} -{' '}
              {formatAMPM(new Date(data.end_datetime * 1000))}
            </Text>
            <Text style={styles.textSaperator}> | </Text>
            <Text style={styles.addressView} numberOfLines={1}>
              {data.venue.address}
            </Text>
          </View>
          <View style={styles.gameVSView}>
            {data.userChallenge || data.singlePlayerGame ? (
              <View style={styles.leftGameView}>
                {data.home_team.thumbnail ? (
                  <Image
                    source={{ uri: data.home_team.thumbnail }}
                    style={styles.profileImage}
                  />
                ) : (
                  <Image
                    source={images.teamPlaceholder}
                    style={styles.profileImage}
                  />
                )}
                <Text style={styles.leftEntityText} numberOfLines={2}>
                  {data.home_team.full_name}
                </Text>
              </View>
            ) : (
              <View style={styles.leftGameView}>
                {data.home_team.thumbnail ? (
                  <Image
                    source={{ uri: data.home_team.thumbnail }}
                    style={styles.profileImage}
                  />
                ) : (
                  <Image
                    source={images.teamPlaceholder}
                    style={styles.profileImage}
                  />
                )}
                <Text style={styles.leftEntityText} numberOfLines={2}>
                  {data.home_team.group_name}
                </Text>
              </View>
            )}

            <Text style={styles.scoreView}>{data.home_team_goal}</Text>
            <Text style={styles.vsView}>:</Text>
            <Text style={styles.scoreView}>{data.away_team_goal}</Text>

            {data.userChallenge || data.singlePlayerGame ? (
              <View style={styles.rightGameView}>
                <Text style={styles.rightEntityText} numberOfLines={2}>
                  {data.away_team.full_name}
                </Text>
                {data.away_team.thumbnail ? (
                  <Image
                    source={{ uri: data.away_team.thumbnail }}
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
                  {data.away_team.group_name}
                </Text>
                {data.away_team.thumbnail ? (
                  <Image
                    source={{ uri: data.away_team.thumbnail }}
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
          {/* <View
            style={{
              flex: 1,
              flexDirection: 'row',
              backgroundColor: 'red',
              marginTop: 15,
            }}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={['', '', '', '', '']}
              keyExtractor={keyExtractor}
              renderItem={renderMediaList}
              ItemSeparatorComponent={renderSeparator}
            />
          </View> */}
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
    // 183
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
    // 183
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
    width: wp('82%'),
  },
  eventTimeLocation: {
    color: colors.googleColor,
    fontFamily: fonts.RRegular,
    fontSize: 12,
  },
  eventTitle: {
    color: colors.googleColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginBottom: 1,
  },

  gameVSView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
  scoreView: {

      fontSize: 20,
      fontFamily: fonts.RLight,
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
});

export default memo(TCRecentMatchCard);
