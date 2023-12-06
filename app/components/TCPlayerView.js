import React, {memo, useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import {strings} from '../../Localization/translation';
import Verbs from '../Constants/Verbs';
import {filterType} from '../utils/constant';
import {getButtonStateForPeople} from '../utils/sportsActivityUtils';

function TCPlayerView({
  onPress,
  showStar = false,
  showLevel = false,
  data = {},
  showSport = false,
  isUniversalSearch = false,
  subTab,
  sportFilter,
  authContext,
  fType,
  onPressChallengButton,
  onPressBookButton,
  onPressInviteButton,
}) {
  const [sports, setSports] = useState([]);
  const [buttonState, setButtonState] = useState({
    book: false,
    challenge: false,
    unavailable: false,
  });
  const [isInviteButtonShow, setIsInviteButtonShow] = useState(false);
  const [filteredSportData, setFilteredSportData] = useState([]);

  const filterSport = useCallback(() => {
    let sportList = [];
    if (sportFilter.sport !== strings.allSport) {
      sportList = sports.filter(
        (value) =>
          value.sport === sportFilter.sport && value.is_active === true,
      );
    } else {
      sportList = sports.filter((value) => {
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
    setFilteredSportData(sportList);
  }, [sportFilter.sport, fType, sports]);

  useEffect(() => {
    if (
      isUniversalSearch === false &&
      (authContext.entity.role === Verbs.entityTypeTeam ||
        authContext.entity.role === Verbs.entityTypeClub)
    ) {
      setIsInviteButtonShow(true);
    }
  }, [isUniversalSearch, authContext.entity]);

  useEffect(() => {
    if (sportFilter.sport) {
      filterSport();
    } else {
      setFilteredSportData([]);
    }
  }, [sportFilter.sport, filterSport]);

  useEffect(() => {
    if (sportFilter.sport !== strings.allSport && sports.length === 1) {
      const btnState = getButtonStateForPeople({
        entityId: data.user_id,
        entityType: Verbs.entityTypePlayer,
        sportObj: sports[0],
        authContext,
      });
      setButtonState(btnState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sports, sportFilter.sport, data.user_id]);

  useEffect(() => {
    if (subTab) {
      if (subTab === strings.playerTitle) {
        setSports([...data.registered_sports]);
      } else if (subTab === strings.refereesTitle) {
        setSports([...data.referee_data]);
      } else if (subTab === strings.scorekeeperTitle) {
        setSports([...data.scorekeeper_data]);
      }
    }
  }, [subTab, data]);

  const getSportName = (list = []) => {
    if (list.length === 1) {
      return (
        list[0].sport_name?.charAt(0).toUpperCase() +
        list[0].sport_name?.slice(1)
      );
    }

    if (list.length > 1) {
      return `${
        list[0].sport_name?.charAt(0).toUpperCase() +
        list[0].sport_name?.slice(1)
      } & ${list.length - 1} ${strings.moreText}`;
    }
    return '';
  };

  return (
    <TouchableOpacity
      onPress={() => {
        if (sportFilter?.sport) {
          onPress(filteredSportData);
        } else {
          onPress(sports);
        }
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
              numberOfLines={2}
              ellipsizeMode={'tail'}>
              {data.city} ·{' '}
              {getSportName(sportFilter?.sport ? filteredSportData : sports)}
            </Text>
          ) : (
            <Text style={styles.locationText} numberOfLines={2}>
              {data.city}
            </Text>
          )}
          {showStar && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
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
              <Text style={styles.starPoints} numberOfLines={2}>
                {'Lv.13'} · {sports[0]?.setting?.game_fee?.fee}{' '}
                {sports[0]?.setting?.game_fee?.currency_type}
              </Text>
            </View>
          )}
        </View>

        {buttonState.challenge && (
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              onPressChallengButton(data, sports[0]);
            }}>
            <Text style={styles.buttonText}>{strings.challenge}</Text>
          </TouchableOpacity>
        )}
        {buttonState.book && (
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => onPressBookButton(data, sports[0])}>
            <Text style={styles.buttonText}>{strings.book}</Text>
          </TouchableOpacity>
        )}
        {isInviteButtonShow && (
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              {backgroundColor: colors.lightGrey},
            ]}
            onPress={() => onPressInviteButton(data)}>
            <Text style={[styles.buttonText, {color: colors.themeColor}]}>
              {strings.invite}
            </Text>
          </TouchableOpacity>
        )}

        {isUniversalSearch && buttonState.unavailable ? (
          <View
            style={[
              styles.buttonContainer,
              {backgroundColor: colors.userPostTimeColor},
            ]}>
            <Text style={styles.buttonText}>{strings.unavailableText}</Text>
          </View>
        ) : null}
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
  buttonContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.themeColor,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
  },
});

export default memo(TCPlayerView);
