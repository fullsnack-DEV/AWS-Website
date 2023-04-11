// @flow
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {strings} from '../../../Localization/translation';
import BottomSheet from '../../components/modals/BottomSheet';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';
import {getEntitySport} from '../../utils/sportsActivityUtils';

const GroupHomeButton = ({
  groupData = {},
  loggedInEntity = {},
  isAdmin = false,
  onPress = () => {},
}) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (groupData.setting) {
      setIsAvailable(groupData.setting.availibility === Verbs.on);
    }
  }, [groupData]);

  const checkIsRefereeOrScoreKeeper = (type) => {
    const sportObj = getEntitySport({
      user: loggedInEntity,
      role: type,
      sportType: groupData?.sport_Type,
      sport: groupData.sport,
    });
    if (sportObj?.group_id) {
      return true;
    }
    return false;
  };

  const getButtonTitle = () => {
    const obj = {
      btn1: '',
      btn2: '',
      btn3: '',
    };

    if (!isAdmin) {
      if (groupData.is_joined) {
        obj.btn1 =
          loggedInEntity.role === Verbs.entityTypeTeam &&
          groupData.entity_type === Verbs.entityTypeClub
            ? strings.member
            : strings.joining;
      } else if (groupData.invite_request) {
        if (groupData.invite_request.entity_type === Verbs.entityTypeUser) {
          obj.btn1 = strings.requestSent;
        } else if (
          groupData.invite_request.entity_type === Verbs.entityTypeClub ||
          groupData.invite_request.entity_type === Verbs.entityTypeTeam
        ) {
          obj.btn1 = strings.invitePending;
        }
      } else {
        obj.btn1 = strings.join;
      }
    }

    if (isAdmin) {
      obj.btn1 = strings.editprofiletitle;
    } else if (groupData.entity_type === Verbs.entityTypeTeam) {
      if (
        loggedInEntity.role === Verbs.entityTypePlayer ||
        loggedInEntity.role === Verbs.entityTypeUser
      ) {
        const isReferee = checkIsRefereeOrScoreKeeper(Verbs.entityTypeReferee);
        const isScorekeeper = checkIsRefereeOrScoreKeeper(
          Verbs.entityTypeScorekeeper,
        );
        if (isScorekeeper || isReferee) {
          obj.btn3 = '···';
        }
        const list = [];
        if (isScorekeeper) {
          list.push(strings.scorekeeperOffer);
        } else if (isReferee) {
          list.push(strings.refereeOffer);
        }
        setOptions(list);

        if (groupData.is_following) {
          obj.btn2 = strings.following;
          setOptions([strings.unfollowText]);
        } else {
          obj.btn2 = strings.follow;
        }
      }
      if (
        loggedInEntity.role === Verbs.entityTypeTeam &&
        isAvailable &&
        groupData.sport === loggedInEntity.obj.sport &&
        groupData.sport_type === loggedInEntity.obj.sport_Type
      ) {
        obj.btn1 = strings.challenge;
        obj.btn2 = '';
        obj.btn3 = '···';
        setOptions([strings.inviteToChallenge]);
      } else {
        obj.btn1 = '';
        obj.btn2 = '';
        obj.btn3 = '';
      }
    } else if (groupData.entity_type === Verbs.entityTypeClub) {
      if (
        loggedInEntity.role === Verbs.entityTypePlayer ||
        loggedInEntity.role === Verbs.entityTypeUser
      ) {
        if (groupData.is_following) {
          obj.btn2 = strings.following;
          setOptions([strings.unfollowText]);
        } else {
          obj.btn2 = strings.follow;
        }
      }

      if (loggedInEntity.role === Verbs.entityTypeClub) {
        obj.btn1 = '';
        obj.btn2 = '';
        obj.btn3 = '';
      }
    }

    return obj;
  };

  const handleButtonPress = (option) => {
    switch (option) {
      case strings.member:
        setOptions([strings.leaveTeamFromClub]);
        setShowOptions(true);
        break;

      default:
        onPress(option);
    }
  };

  return (
    <View style={styles.buttonRow}>
      {getButtonTitle().btn1 ? (
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            {flex: 1},
            loggedInEntity.role === Verbs.entityTypeTeam && !isAdmin
              ? {marginRight: 7, backgroundColor: colors.themeColor}
              : {},
          ]}
          onPress={() => handleButtonPress(getButtonTitle().btn1)}>
          <Text
            style={[
              styles.buttonText,
              loggedInEntity.role === Verbs.entityTypeTeam && !isAdmin
                ? {color: colors.whiteColor}
                : {},
            ]}>
            {getButtonTitle().btn1}
          </Text>
          {getButtonTitle().btn1 === strings.joining ||
          getButtonTitle().btn1 === strings.member ? (
            <Image source={images.check} style={styles.checkImg} />
          ) : null}
        </TouchableOpacity>
      ) : null}

      {getButtonTitle().btn2 ? (
        <TouchableOpacity
          style={[styles.buttonContainer, {marginHorizontal: 7, flex: 1}]}
          onPress={() => handleButtonPress(getButtonTitle().btn2)}>
          <Text style={styles.buttonText}>{getButtonTitle().btn2}</Text>
          {getButtonTitle().btn2 === strings.following && (
            <Image source={images.check} style={styles.checkImg} />
          )}
        </TouchableOpacity>
      ) : null}

      {getButtonTitle().btn3 ? (
        <TouchableOpacity
          style={[styles.buttonContainer, {paddingHorizontal: 8}]}
          onPress={() => {
            setShowOptions(true);
          }}>
          <Text style={styles.buttonText}>{getButtonTitle().btn3}</Text>
        </TouchableOpacity>
      ) : null}

      <BottomSheet
        isVisible={showOptions}
        closeModal={() => setShowOptions(false)}
        optionList={options}
        onSelect={(option) => {
          setShowOptions(false);
          handleButtonPress(option);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 7,
    backgroundColor: colors.grayBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  buttonRow: {
    marginHorizontal: 15,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkImg: {
    width: 8,
    height: 6,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    marginLeft: 5,
  },
});
export default GroupHomeButton;
