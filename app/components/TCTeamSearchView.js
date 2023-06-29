import React, {memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import {format} from 'react-string-format';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import Verbs from '../Constants/Verbs';
import {strings} from '../../Localization/translation';
import GroupIcon from './GroupIcon';

function TCTeamSearchView({
  onPress,
  showStar = false,
  showLevelOnly = false,
  data = {},
  isClub = false,
  authContext,
  onPressChallengeButton,
  onPressJoinButton,
  sportFilter,
}) {
  let isChallengeButtonShow = false;
  let isJoinButton = false;
  let sports = [];

  const filterSport = () => {
    // Case - With Filter
    if (sportFilter.sport !== strings.allSport) {
      sports = sports.filter((value) => {
        if (value.sport_name === sportFilter.sport_name) {
          return value;
        }
        return false;
      });
    }
  };
  if (data.entity_type === Verbs.entityTypeTeam) {
    if (
      authContext.entity.role === Verbs.entityTypeUser &&
      authContext.user?.teamIds?.includes(data.group_id) === false
    ) {
      isJoinButton = true;
    } else if (
      authContext.entity.role === Verbs.entityTypeTeam &&
      data.setting?.availibility === Verbs.on &&
      authContext.entity.obj.sport === data.sport &&
      authContext.entity.uid !== data.group_id
    ) {
      isChallengeButtonShow = true;
    }
  } else if (data.entity_type === Verbs.entityTypeClub) {
    data.sports.map((value) => sports.push(value));
    filterSport();
    if (authContext.entity.role === Verbs.entityTypeUser) {
      isJoinButton = true;
    }
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.viewContainer}>
        <GroupIcon
          entityType={data.entity_type}
          imageUrl={data.thumbnail}
          groupName={data.group_name}
          grpImageStyle={{height: 29, width: 26}}
          containerStyle={styles.placeholderView}
          textstyle={styles.oneCharacterText}
        />
        <View
          style={{
            flexDirection: 'column',
            marginLeft: 10,
            flex: 1,
          }}>
          <Text style={styles.entityName} numberOfLines={1}>
            {data.group_name}
          </Text>

          {isClub ? (
            <Text style={styles.locationText} numberOfLines={1}>
              {data.city} ·{' '}
              {sports.length === 1 &&
                sports[0].sport_name?.charAt(0).toUpperCase() +
                  sports[0].sport_name?.slice(1)}
              {sports.length > 1 && format(strings.sportsText, sports.length)}
            </Text>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={styles.locationText}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {data.city}
              </Text>
              <Text
                style={styles.locationText}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {' · ' +
                  ` ${data.sport_name
                    ?.charAt(0)
                    .toUpperCase()}${data.sport_name?.slice(1)}`}
              </Text>
            </View>
          )}
          {showStar && (
            <Text style={styles.starPoints} numberOfLines={1}>
              LV {data.point}
              {' · '}
              {data.setting?.game_fee?.fee}{' '}
              {data.setting?.game_fee?.currency_type}
            </Text>
          )}
          {showLevelOnly && (
            <Text style={styles.starPoints} numberOfLines={1}>
              LV {data.point}
            </Text>
          )}
        </View>
        {isJoinButton && (
          <TouchableWithoutFeedback
            onPress={() => {
              onPressJoinButton(data.group_id);
            }}>
            <View
              style={{
                backgroundColor: colors.lightGrey,
                width: 75,
                height: 25,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 5,
              }}>
              <Text style={styles.joinBtn}>{strings.join}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        {isChallengeButtonShow && (
          <TouchableWithoutFeedback
            onPress={() => {
              onPressChallengeButton(data);
            }}>
            <View
              style={{
                backgroundColor: colors.darkYellowColor,
                width: 75,
                height: 25,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 5,
              }}>
              <Text style={styles.challengeBtn}>{strings.challenge}</Text>
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

  oneCharacterText: {
    position: 'absolute',
    fontSize: 12,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 40,
    backgroundColor: colors.whiteColor,
    borderWidth: 0.5,
    borderColor: colors.greyBorderColor,
  },
  challengeBtn: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
    alignSelf: 'center',
  },
  joinBtn: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.themeColor,
    alignSelf: 'center',
  },
});

export default memo(TCTeamSearchView);
