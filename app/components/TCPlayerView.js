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
import {filterType} from '../utils/constant';

function TCPlayerView({
  onPress,
  showStar = false,
  showLevel = false,
  data = {},
  showSport = false,
  subTab,
  sportFilter,
  authContext,
  fType,
  onPressChallengButton,
  onPressBookButton,
  onPressInviteButton,
}) {
  let sports = [];
  let isChallengeButtonShow = false;
  let isBookButtonShow = false;
  let isInviteButtonShow = false;
  const filterSport = () => {
    // Case - With Filter
    if (sportFilter.sport !== strings.allSport) {
      sports = sports.filter((value) => {
        if (subTab === strings.playerTitle) {
          if (
            value.sport_name === sportFilter.sport_name &&
            value.is_active === true
          ) {
            return value;
          }
          return false;
        }
        if (
          subTab === strings.refereesTitle ||
          subTab === strings.scorekeeperTitle
        ) {
          if (value.sport === sportFilter.sport && value.is_active === true) {
            return value;
          }
          return false;
        }
        return false;
      });
    } else {
      // Case without filter
      sports = sports.filter((value) => {
        // Available challenge case
        if (fType === filterType.PLAYERAVAILABLECHALLENGE) {
          if (
            value.is_active === true &&
            value.sport_type === Verbs.singleSport
          ) {
            return value;
          }
        } else if (value.is_active === true) {
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
      sportFilter.sport !== strings.allSport &&
      sports.length === 1 &&
      sports[0].sport_type === Verbs.singleSport &&
      sports[0].setting?.availibility === Verbs.on &&
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
      sportFilter.sport !== strings.allSport &&
      authContext.entity.role === Verbs.entityTypeUser &&
      sports.length === 1 &&
      sports[0].setting?.referee_availibility === Verbs.on &&
      authContext.entity.uid !== data.user_id &&
      authContext.entity.obj.registered_sports?.some(
        (sport) => sport.sport === sports[0].sport,
      ) &&
      sports[0].sport_type === Verbs.singleSport
    ) {
      isBookButtonShow = true;
    } else if (
      sportFilter.sport !== strings.allSport &&
      authContext.entity.role === Verbs.entityTypeTeam &&
      sports.length === 1 &&
      sports[0].setting?.referee_availibility === Verbs.on &&
      authContext.entity.uid !== data.user_id &&
      authContext.entity?.obj.sport === sports[0].sport
    ) {
      isBookButtonShow = true;
    } else if (authContext.entity.role === Verbs.entityTypeClub) {
      isBookButtonShow = false;
    }
  } else if (subTab === strings.scorekeeperTitle) {
    data.scorekeeper_data.map((value) => sports.push(value));
    filterSport();
    if (
      sportFilter.sport !== strings.allSport &&
      authContext.entity.role === Verbs.entityTypeUser &&
      sports.length === 1 &&
      sports[0].setting?.scorekeeper_availibility === Verbs.on &&
      authContext.entity.uid !== data.user_id &&
      authContext.entity.obj.registered_sports?.some(
        (sport) => sport.sport === sports[0].sport,
      ) &&
      sports[0].sport_type === Verbs.singleSport
    ) {
      isBookButtonShow = true;
    } else if (
      sportFilter.sport !== strings.allSport &&
      authContext.entity.role === Verbs.entityTypeTeam &&
      sports.length === 1 &&
      sports[0].setting?.scorekeeper_availibility === Verbs.on &&
      authContext.entity.uid !== data.user_id &&
      authContext.entity?.obj.sport === sports[0].sport
    ) {
      isBookButtonShow = true;
    } else if (authContext.entity.role === Verbs.entityTypeClub) {
      isBookButtonShow = false;
    }
  }
  return (
    <TouchableOpacity
      onPress={() => {
        onPress(sports);
      }}>
      <View style={styles.viewContainer}>
        <Image
          source={
            data.thumbnail ? {uri: data.thumbnail} : images.profilePlaceHolder
          }
          style={styles.profileImage}
        />

        <View style={{flexDirection: 'column', marginLeft: 10, flex: 1}}>
          <Text style={styles.entityName} numberOfLines={2}>
            {data.full_name}
          </Text>
          {showSport ? (
            <Text
              style={styles.locationText}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {data.city} ·{' '}
              {sports.length === 1 &&
                sports[0].sport_name?.charAt(0).toUpperCase() +
                  sports[0].sport_name?.slice(1)}
              {sports.length > 1 &&
                `${
                  sports[0].sport_name.charAt(0).toUpperCase() +
                  sports[0].sport_name.slice(1)
                } & ${sports.length - 1} ${strings.moreText}`}
            </Text>
          ) : (
            <Text style={styles.locationText} numberOfLines={1}>
              {data.city}
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
                {sports[0]?.setting?.game_fee?.currency_type}
              </Text>
            </View>
          )}
          {showLevel && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* <Image source={images.orangeStar} style={styles.starImage} /> */}
              <Text style={styles.starPoints} numberOfLines={2}>
                {'Lv.13'} · {sports[0]?.setting?.game_fee?.fee}{' '}
                {sports[0]?.setting?.game_fee?.currency_type}
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
                backgroundColor: colors.darkYellowColor,
                width: 75,
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
                backgroundColor: colors.darkYellowColor,
                width: 75,
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
                backgroundColor: colors.lightGrey,
                width: 75,
                height: 25,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.inviteBtn}>{strings.invite}</Text>
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
  inviteBtn: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.themeColor,
    alignSelf: 'center',
  },
});

export default memo(TCPlayerView);
