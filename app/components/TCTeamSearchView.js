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

const TCTeamSearchView = ({
  data = {},
  isClub = false,
  authContext = {},
  sportFilter = {},
  showStar = false,
  showLevelOnly = false,
  joinedGroups = {teams: [], clubs: []},
  onPress = () => {},
  onPressJoinButton = () => {},
  onPressChallengeButton = () => {},
  onPressMemberButton = () => {},
}) => {
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

  const handleButtonPress = (btnTitle = '') => {
    switch (btnTitle) {
      case strings.pausedText:
        break;

      case strings.challenge:
        onPressChallengeButton(data);
        break;

      case strings.join:
        onPressJoinButton(data.group_id);
        break;

      case strings.joining:
        onPressMemberButton(data.group_id);
        break;

      default:
        break;
    }
  };

  const getBtnColors = (btnTitle = '') => {
    switch (btnTitle) {
      case strings.pausedText:
        return {
          bgColor: colors.userPostTimeColor,
          labelColor: colors.whiteColor,
        };

      case strings.challenge:
        return {
          bgColor: colors.darkYellowColor,
          labelColor: colors.whiteColor,
        };

      case strings.join:
        return {
          bgColor: colors.lightGrey,
          labelColor: colors.themeColor,
        };

      case strings.joining:
        return {
          bgColor: colors.lightGrey,
          labelColor: colors.lightBlackColor,
        };

      default:
        return {
          bgColor: colors.lightBlackColor,
          labelColor: colors.lightBlackColor,
        };
    }
  };

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
        if (data.is_pause) {
          return strings.pausedText;
        }
        return strings.challenge;
      }
      if (
        ![Verbs.entityTypeClub, Verbs.entityTypeTeam].includes(
          loggedInEntity.role,
        )
      ) {
        if (joinedGroups.teams.includes(data.group_id)) {
          return strings.joining;
        }
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
    const btnObj = getBtnColors(buttonTitle);

    return buttonTitle ? (
      <TouchableWithoutFeedback onPress={() => handleButtonPress(buttonTitle)}>
        <View
          style={[styles.buttonContainer, {backgroundColor: btnObj.bgColor}]}>
          <Text style={[styles.buttonLabel, {color: btnObj.labelColor}]}>
            {buttonTitle}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    ) : null;
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
                format(
                  strings.andMore,
                  sportsList[0].sport_name,
                  sportsList.length - 1,
                )}
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
};

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
  buttonLabel: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    textAlign: 'center',
  },
  buttonContainer: {
    height: 25,
    // minWidth: 75,
    marginTop: 5,
    borderRadius: 5,
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});

export default memo(TCTeamSearchView);
