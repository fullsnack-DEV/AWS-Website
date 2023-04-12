// @flow
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {strings} from '../../../Localization/translation';
import {getTeamsOfClub} from '../../api/Groups';
import AuthContext from '../../auth/context';
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
  const [options2, setOptions2] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showOptions2, setShowOptions2] = useState(false);
  const [buttons, setButtons] = useState({
    btn1: '',
    btn2: '',
    btn3: '',
  });

  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (groupData.setting) {
      setIsAvailable(groupData.setting.availibility === Verbs.on);
    }
  }, [groupData]);

  const checkIsRefereeOrScoreKeeper = useCallback(
    (type) => {
      const sportObj = getEntitySport({
        user: loggedInEntity.obj,
        role: type,
        sportType: groupData?.sport_Type,
        sport: groupData.sport,
      });

      if (sportObj?.sport) {
        return true;
      }
      return false;
    },
    [groupData, loggedInEntity],
  );

  const getButtonTitle = useCallback(async () => {
    const obj = {
      btn1: '',
      btn2: '',
      btn3: '',
    };

    if (!isAdmin) {
      if (groupData.invite_request) {
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
        if (groupData.is_joined) {
          obj.btn1 = strings.joining;
        }
        if (isScorekeeper || isReferee) {
          obj.btn3 = '···';
        }
        const list = [];
        if (isReferee) {
          list.push(strings.refereeOffer);
        }
        if (isScorekeeper) {
          list.push(strings.scorekeeperOffer);
        }
        setOptions(list);

        if (groupData.is_following) {
          obj.btn2 = strings.following;
          setOptions2([strings.unfollowText]);
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
      }
      if (loggedInEntity.role === Verbs.entityTypeClub) {
        const res = await getTeamsOfClub(loggedInEntity.uid, authContext);
        const team =
          res.payload?.length > 0
            ? res.payload.find((item) => item.group_id === groupData.group_id)
            : {};
        if (team?.group_id) {
          obj.btn1 = strings.joining;
        } else if (
          groupData.invite_request?.entity_type === Verbs.entityTypeClub
        ) {
          obj.btn1 = strings.invitePending;
        } else {
          obj.btn1 = strings.invite;
        }
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

      if (loggedInEntity.role === Verbs.entityTypeTeam) {
        if (
          groupData.invite_request?.entity_type === Verbs.entityTypeClub &&
          groupData.invite_request?.invited_id === loggedInEntity.uid &&
          groupData.invite_request?.action === Verbs.inviteVerb
        ) {
          obj.btn1 = strings.invitePending;
        } else {
          const team =
            groupData.joined_teams?.length > 0
              ? groupData.joined_teams.find(
                  (item) => item.group_id === loggedInEntity.uid,
                )
              : {};
          let isMember = false;
          if (team?.group_id) {
            isMember = true;
          }
          obj.btn1 = isMember ? strings.member : strings.join;
        }
      }

      if (loggedInEntity.role === Verbs.entityTypeClub) {
        obj.btn1 = '';
        obj.btn2 = '';
        obj.btn3 = '';
      }
    }

    setButtons(obj);
  }, [
    checkIsRefereeOrScoreKeeper,
    groupData,
    isAdmin,
    loggedInEntity,
    isAvailable,
    authContext,
  ]);

  useEffect(() => {
    if (isFocused) {
      getButtonTitle();
    }
  }, [isFocused, getButtonTitle]);

  const handleButtonPress = (option) => {
    switch (option) {
      case strings.member:
        setOptions([strings.leaveTeamFromClub]);
        setShowOptions(true);
        break;

      case strings.invitePending:
        if (
          loggedInEntity.role === Verbs.entityTypePlayer &&
          groupData.invite_request?.entity_type === Verbs.entityTypeTeam
        ) {
          setOptions([strings.acceptInvite, strings.declineInvite]);
        } else if (
          loggedInEntity.role === Verbs.entityTypeClub &&
          groupData.invite_request?.entity_type === Verbs.entityTypeClub
        ) {
          setOptions([strings.cancelMembershipInvitation]);
        } else if (
          loggedInEntity.role === Verbs.entityTypeTeam &&
          groupData.invite_request?.entity_type === Verbs.entityTypeClub
        ) {
          setOptions([
            strings.acceptInvitateRequest,
            strings.declineMemberRequest,
          ]);
        }
        setShowOptions(true);
        break;

      case strings.joining:
        if (
          loggedInEntity.role === Verbs.entityTypeClub &&
          groupData.entity_type === Verbs.entityTypeTeam
        ) {
          setOptions([strings.leaveTeamFromClub]);
          setShowOptions(true);
        }
        break;

      default:
        onPress(option);
    }
  };

  return (
    <View style={styles.buttonRow}>
      {buttons.btn1 ? (
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            {flex: 1},
            !isAdmin &&
            loggedInEntity.role === Verbs.entityTypeTeam &&
            buttons.btn1 === strings.challenge
              ? {marginRight: 7, backgroundColor: colors.themeColor}
              : {},
          ]}
          onPress={() => handleButtonPress(buttons.btn1)}>
          <Text
            style={[
              styles.buttonText,
              !isAdmin &&
              loggedInEntity.role === Verbs.entityTypeTeam &&
              buttons.btn1 === strings.challenge
                ? {color: colors.whiteColor}
                : {},

              buttons.btn1 === strings.join ||
              buttons.btn1 === strings.invitePending
                ? {color: colors.themeColor}
                : {},
            ]}>
            {buttons.btn1}
          </Text>
          {buttons.btn1 === strings.joining ||
          buttons.btn1 === strings.member ? (
            <Image source={images.check} style={styles.checkImg} />
          ) : null}
        </TouchableOpacity>
      ) : null}

      {buttons.btn2 ? (
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            {flex: 1},
            buttons.btn3 ? {marginHorizontal: 7} : {marginLeft: 7},
          ]}
          onPress={() => {
            if (options2.length > 0 && options2[0] === strings.unfollowText) {
              setShowOptions2(true);
            } else {
              handleButtonPress(buttons.btn2);
            }
          }}>
          <Text
            style={[
              styles.buttonText,
              buttons.btn1 === strings.follow ? {color: colors.themeColor} : {},
            ]}>
            {buttons.btn2}
          </Text>
          {buttons.btn2 === strings.following && (
            <Image source={images.check} style={styles.checkImg} />
          )}
        </TouchableOpacity>
      ) : null}

      {buttons.btn3 ? (
        <TouchableOpacity
          style={[styles.buttonContainer, {paddingHorizontal: 8}]}
          onPress={() => {
            setShowOptions(true);
          }}>
          <Text style={styles.buttonText}>{buttons.btn3}</Text>
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

      <BottomSheet
        isVisible={showOptions2}
        closeModal={() => setShowOptions2(false)}
        optionList={options2}
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
