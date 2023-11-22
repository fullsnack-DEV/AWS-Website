import React, {memo, useEffect, useState} from 'react';
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
import {JoinPrivacy} from '../Constants/GeneralConstants';

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
  joinedGroups = {teams: [], clubs: []},
}) {
  const [sportsList, setSportsList] = useState([]);

  useEffect(() => {
    if (data.entity_type === Verbs.entityTypeClub) {
      let list = [];
      if (sportFilter.sport !== strings.allSport) {
        list = data.sports.filter(
          (value) => value.sport_name === sportFilter.sport_name,
        );
      } else {
        list = [...data.sports];
      }
      setSportsList(list);
    }
  }, [data, sportFilter.sport_name, sportFilter.sport]);

  const getButtonTitle = () => {
    const loggedInEntity = authContext.entity;

    if (
      data.entity_type === Verbs.entityTypeTeam &&
      data.who_can_join_for_member !== JoinPrivacy.inviteOnly
    ) {
      if (
        loggedInEntity.uid !== data.group_id &&
        data.setting?.availibility === Verbs.on &&
        data.sport === loggedInEntity.obj.sport &&
        loggedInEntity.role === Verbs.entityTypeTeam
      ) {
        return strings.challenge;
      }
      if (
        ![Verbs.entityTypeClub, Verbs.entityTypeTeam].includes(
          loggedInEntity.role,
        ) &&
        !joinedGroups.teams.includes(data.group_id)
      ) {
        return strings.join;
      }
    } else if (
      data.entity_type === Verbs.entityTypeClub &&
      data.who_can_join_for_member !== JoinPrivacy.inviteOnly
    ) {
      if (
        loggedInEntity.role === Verbs.entityTypeTeam &&
        !joinedGroups.clubs.includes(data.group_id)
      ) {
        return strings.join;
      }
      if (
        loggedInEntity.role !== Verbs.entityTypeClub &&
        !joinedGroups.clubs.includes(data.group_id)
      ) {
        return strings.join;
      }
    }
    return '';
  };

  const renderJoinOrChallengeButton = () => {
    const buttonTitle = getButtonTitle();

    if (buttonTitle === strings.join) {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            onPressJoinButton(data.group_id);
          }}>
          <View style={styles.joinBtnContainer}>
            <Text style={styles.joinBtn}>{strings.join}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }

    if (buttonTitle === strings.challenge) {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            onPressChallengeButton(data);
          }}>
          <View style={styles.challengeBtnContainer}>
            <Text style={styles.challengeBtn}>{strings.challenge}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }

    return null;
  };

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
              {sportsList.length === 1 && sportsList[0].sport_name}
              {sportsList.length > 1 &&
                format(strings.sportsText, sportsList.length)}
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
                {` · ${data.sport_name}`}
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
        {renderJoinOrChallengeButton()}
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
  joinBtnContainer: {
    backgroundColor: colors.lightGrey,
    width: 75,
    height: 25,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  challengeBtnContainer: {
    backgroundColor: colors.darkYellowColor,
    // width: 75,
    height: 25,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    paddingHorizontal: 10,
  },
});

export default memo(TCTeamSearchView);
