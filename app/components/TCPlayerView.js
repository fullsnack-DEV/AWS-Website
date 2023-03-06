import React, {memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
} from 'react-native';

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import {strings} from '../../Localization/translation';
import Verbs from '../Constants/Verbs';

function TCPlayerView({
  onPress,
  showStar = false,
  data,
  showSport = false,
  subTab,
  sportFilter,
  authContext,
  onPressChallengButton,
  onPressBookButton,
  onPressInviteButton,
}) {
  let sports = [];
  let isChallengeButtonShow = false;
  let isBookButtonShow = false;
  let isInviteButtonShow = false;

  const filterSport = () => {
    if (sportFilter.sport !== strings.all) {
      sports = sports.filter((value) => {
        if (value.sport === sportFilter.sport) {
          return value;
        }
        return false;
      });
    }
  };
  if (subTab === strings.playerTitle) {
    data.registered_sports.map((value) => sports.push(value));
    filterSport();
    if (
      sports.length === 1 &&
      sports[0].sport_type === 'single' &&
      sports[0].setting?.availibility === 'On' &&
      authContext.entity.role === Verbs.entityTypeUser &&
      authContext.entity.role !== Verbs.entityTypeTeam &&
      authContext.entity.role !== Verbs.entityTypeClub &&
      authContext.entity.uid !== data.user_id
    ) {
      isChallengeButtonShow = true;
    } else if (
      authContext.entity.role === Verbs.entityTypeTeam ||
      authContext.entity.role === Verbs.entityTypeClub
    ) {
      isInviteButtonShow = true;
    }
  } else if (subTab === strings.refereesTitle) {
    data.referee_data.map((value) => sports.push(value));
    filterSport();
    if (
      authContext.entity.role === Verbs.entityTypeUser &&
      sports.length === 1 &&
      sports[0].setting?.referee_availibility === 'On' &&
      authContext.entity.uid !== data.user_id &&
      authContext.user?.registered_sports?.some(
        (sport) => sport.sport === sports[0].sport,
      ) &&
      sports[0].sport_type === 'single'
    ) {
      isBookButtonShow = true;
    } else if (
      authContext.entity.role === Verbs.entityTypeTeam &&
      sports.length === 1 &&
      sports[0].setting?.referee_availibility === 'On' &&
      authContext.entity.uid !== data.user_id &&
      authContext.user?.registered_sports?.some(
        (sport) => sport.sport === sports[0].sport,
      )
    ) {
      isBookButtonShow = true;
    } else if (authContext.entity.role === Verbs.entityTypeClub) {
      isBookButtonShow = false;
    }
  } else if (subTab === strings.scorekeeperTitle) {
    data.scorekeeper_data.map((value) => sports.push(value));
    filterSport();

    if (
      authContext.entity.role === Verbs.entityTypeUser &&
      sports.length === 1 &&
      sports[0].setting?.scorekeeper_availibility === 'On' &&
      authContext.entity.uid !== data.user_id &&
      authContext.user?.registered_sports?.some(
        (sport) => sport.sport === sports[0].sport,
      ) &&
      sports[0].sport_type === 'single'
    ) {
      isBookButtonShow = true;
    } else if (
      authContext.entity.role === Verbs.entityTypeTeam &&
      sports.length === 1 &&
      sports[0].setting?.scorekeeper_availibility === 'On' &&
      authContext.entity.uid !== data.user_id &&
      authContext.user?.registered_sports?.some(
        (sport) => sport.sport === sports[0].sport,
      )
    ) {
      isBookButtonShow = true;
    } else if (authContext.entity.role === Verbs.entityTypeClub) {
      isBookButtonShow = false;
    }
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.viewContainer}>
        <Image
          source={
            data?.thumbnail ? {uri: data?.thumbnail} : images.profilePlaceHolder
          }
          style={styles.profileImage}
        />

        <View style={{flexDirection: 'column', marginLeft: 10, flex: 1}}>
          <Text style={styles.entityName} numberOfLines={2}>
            {data?.full_name}
          </Text>
          {showSport ? (
            <Text style={styles.locationText} numberOfLines={1}>
              {data?.city} ·{' '}
              {sports
                .map(
                  (value) =>
                    value.sport?.charAt(0).toUpperCase() +
                    value.sport?.slice(1),
                )
                .join(', ')}
            </Text>
          ) : (
            <Text style={styles.locationText} numberOfLines={1}>
              {data?.city}
            </Text>
          )}
          {showStar && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* <Image source={images.orangeStar} style={styles.starImage} /> */}
              <Text style={styles.starPoints} numberOfLines={2}>
                {'★ 5.0'} · {sports[0]?.setting?.game_fee?.fee}{' '}
                {sports[0].setting?.game_fee?.currency_type}
              </Text>
            </View>
          )}
        </View>
        {isChallengeButtonShow && (
          <TouchableWithoutFeedback
            onPress={() => {
              onPressChallengButton(data, sports[0]);
            }}>
            <View
              style={{
                backgroundColor: '#FF7F00',
                width: 74,
                height: 25,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.challengeBtn}>{strings.challenge}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        {isBookButtonShow && (
          <TouchableWithoutFeedback
            onPress={() => onPressBookButton(data, sports[0])}>
            <View
              style={{
                backgroundColor: '#FF7F00',
                width: 74,
                height: 25,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.challengeBtn}>{strings.book}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        {isInviteButtonShow && (
          <TouchableWithoutFeedback onPress={() => onPressInviteButton(data)}>
            <View
              style={{
                backgroundColor: '#FF7F00',
                width: 74,
                height: 25,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.challengeBtn}>{strings.invite}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    borderRadius: 80,
    marginLeft: 5,
  },
  entityName: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  locationText: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginTop: 1.5,
  },

  starPoints: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginTop: 1.5,
  },
  challengeBtn: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
    alignSelf: 'center',
  },
});

export default memo(TCPlayerView);
