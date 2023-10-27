// @flow
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {format} from 'react-string-format';
import {strings} from '../../../Localization/translation';
import BottomSheet from '../../components/modals/BottomSheet';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';
import {getEntitySport} from '../../utils/sportsActivityUtils';
import {teamInvitePrivacy} from '../../Constants/GeneralConstants';

const GroupHomeButton = ({
  groupData = {},
  loggedInEntity = {},
  isAdmin = false,
  onPress = () => {},
}) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [options, setOptions] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [options3, setOptions3] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showOptions2, setShowOptions2] = useState(false);
  const [showOptions3, setShowOptions3] = useState(false);
  const [showOptions4, setShowOptions4] = useState(false);
  const [buttons, setButtons] = useState({
    btn1: '',
    btn2: '',
    btn3: '',
  });
  const [actionSheetTitle, setActionSheetTitle] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (groupData.setting) {
      setIsAvailable(groupData.setting.availibility === Verbs.on);
    }
  }, [groupData.setting]);

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

  const getTeamButtons = useCallback(() => {
    const obj = {};

    if (
      loggedInEntity.role === Verbs.entityTypePlayer ||
      loggedInEntity.role === Verbs.entityTypeUser
    ) {
      if (
        groupData.who_can_invite_member ===
          teamInvitePrivacy.teamAndMemberPrivacy &&
        groupData.is_joined
      ) {
        obj.btn2 = strings.inviteMemberText;
      } else if (
        groupData.who_can_invite_member ===
          teamInvitePrivacy.teamOnlyPrivacyOption &&
        groupData.is_joined
      ) {
        obj.btn2 = Verbs.HIDE_BUTTON;
      } else if (groupData?.follow_request) {
        obj.btn2 = strings.followReqSentText;
      } else if (groupData.is_following) {
        obj.btn2 = strings.following;
        setOptions2([strings.unfollowText, strings.cancel]);
      } else {
        obj.btn2 = strings.follow;
      }
      const isReferee = checkIsRefereeOrScoreKeeper(Verbs.entityTypeReferee);
      const isScorekeeper = checkIsRefereeOrScoreKeeper(
        Verbs.entityTypeScorekeeper,
      );
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
      list.push(strings.cancel);
      setOptions3(list);

      if (groupData.is_joined) {
        obj.btn1 = strings.joining;
        setOptions([strings.leaveTeam, strings.cancel]);
      } else if (groupData.invite_request?.action === Verbs.requestVerb) {
        obj.btn1 = strings.requestSent;
        setOptions([strings.cancelRequestText, strings.cancel]);
        setActionSheetTitle(
          format(strings.actionsheetTitle3, groupData.group_name),
        );
      } else if (groupData.invite_request?.action === Verbs.inviteVerb) {
        obj.btn1 = strings.invitePending;

        setOptions([
          strings.acceptInvite,
          strings.declineInvite,
          strings.cancel,
        ]);
      } else {
        obj.btn1 = strings.join;
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
      setOptions3([strings.inviteToChallenge]);
    }
    if (loggedInEntity.role === Verbs.entityTypeClub) {
      obj.btn2 = '';
      obj.btn3 = '';
      const teamId =
        groupData.parent_groups?.length > 0
          ? groupData.parent_groups.find((item) => item === loggedInEntity.uid)
          : null;
      if (teamId) {
        obj.btn1 = strings.member;
        setOptions([strings.removeTeamFromClub]);
      } else if (groupData.invite_request?.action === Verbs.inviteVerb) {
        obj.btn1 = strings.inviteSent;
        setOptions([strings.cancelInvite]);
        setActionSheetTitle(
          format(strings.actionsheetTitle8, loggedInEntity.obj.group_name),
        );
      } else if (groupData.invite_request?.action === Verbs.requestVerb) {
        obj.btn1 = strings.requestPendingText;
        setOptions([strings.acceptRequet, strings.cancelRequestText]);
        setActionSheetTitle(
          format(strings.actionsheetTitle9, groupData.group_name),
        );
      } else if (groupData.who_can_invite_for_club) {
        obj.btn1 = strings.invite;
      }
    }
    setButtons(obj);
  }, [groupData, checkIsRefereeOrScoreKeeper, loggedInEntity, isAvailable]);

  const getClubsBttons = useCallback(() => {
    const obj = {};
    if (
      loggedInEntity.role === Verbs.entityTypePlayer ||
      loggedInEntity.role === Verbs.entityTypeUser
    ) {
      if (groupData?.follow_request) {
        obj.btn2 = strings.followReqSentText;
      } else if (groupData.is_following) {
        obj.btn2 = strings.following;
        setOptions2([strings.unfollowText]);
      } else {
        obj.btn2 = strings.follow;
      }

      if (groupData.is_joined) {
        obj.btn1 = strings.joining;
        setOptions([strings.leaveClub]);
      } else if (groupData.invite_request?.action === Verbs.requestVerb) {
        obj.btn1 = strings.requestSent;
        setOptions([strings.cancelRequestText, strings.cancel]);
        setActionSheetTitle(
          format(strings.actionsheetTitle3, groupData.group_name),
        );
      } else if (groupData.invite_request?.action === Verbs.inviteVerb) {
        obj.btn1 = strings.invitePending;
        setOptions([strings.acceptInvite, strings.declineInvite]);
      } else {
        obj.btn1 = strings.join;
      }
    }
    if (loggedInEntity.role === Verbs.entityTypeTeam) {
      const teamId =
        groupData.joined_teams?.length > 0
          ? groupData.joined_teams.find(
              (item) => item.group_id === loggedInEntity.uid,
            )
          : null;

      if (teamId) {
        obj.btn1 = strings.joining;
        setOptions([strings.leaveClub]);
      } else if (groupData.invite_request?.action === Verbs.inviteVerb) {
        obj.btn1 = strings.invitePending;
        setOptions([strings.acceptInvite, strings.declineInvite]);
      } else if (groupData.invite_request?.action === Verbs.requestVerb) {
        obj.btn1 = strings.requestSent;
        setOptions([strings.cancelRequestText, strings.cancel]);
        setActionSheetTitle(
          format(strings.actionsheetTitle6, groupData.group_name),
        );
      } else {
        obj.btn1 = strings.join;
      }
    }
    if (loggedInEntity.role === Verbs.entityTypeClub) {
      obj.btn1 = '';
      obj.btn2 = '';
      obj.btn3 = '';
    }
    setButtons(obj);
  }, [groupData, loggedInEntity]);

  const getButtonTitle = useCallback(async () => {
    if (isAdmin) {
      setButtons({btn1: strings.editprofiletitle, btn2: '', btn3: ''});
    } else if (groupData.entity_type === Verbs.entityTypeTeam) {
      getTeamButtons();
    } else if (groupData.entity_type === Verbs.entityTypeClub) {
      getClubsBttons();
    }
  }, [groupData, isAdmin, getTeamButtons, getClubsBttons]);

  useEffect(() => {
    if (isFocused) {
      getButtonTitle();
    }
  }, [isFocused, getButtonTitle]);

  const handleButtonPress = (option) => {
    console.log(option, 'from option');
    switch (option) {
      case strings.member:
        setShowOptions(true);
        break;

      case strings.following:
        setShowOptions2(true);
        break;

      case strings.inviteSent:
      case strings.requestSent:
      case strings.requestPendingText:
        // actionSheetRef.current.show();
        setShowOptions4(true);
        break;

      case strings.invitePending:
        setShowOptions(true);
        break;

      case strings.joining:
        setShowOptions(true);

        break;

      case strings.cancel:
        setShowOptions2(false);
        setShowOptions(false);
        setShowOptions3(false);
        setShowOptions4(false);
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
            groupData.sport_type === Verbs.doubleSport
              ? {height: 25, paddingVertical: 0}
              : {},
            buttons.btn1 === strings.invite ? {paddingVertical: 4} : {},
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
              buttons.btn1 === strings.invite
                ? {color: colors.reservationAmountColor}
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

      {buttons.btn2 !== Verbs.HIDE_BUTTON ? (
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            {flex: 1},
            buttons.btn3 ? {marginHorizontal: 7} : {marginLeft: 7},
            groupData.sport_type === Verbs.doubleSport
              ? {height: 25, paddingVertical: 0}
              : {},
          ]}
          onPress={() => {
            handleButtonPress(buttons.btn2);
          }}>
          <Text
            style={[
              styles.buttonText,
              buttons.btn2 === strings.follow ? {color: colors.themeColor} : {},
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
          style={[
            styles.buttonContainer,
            {paddingHorizontal: 8},
            groupData.sport_type === Verbs.doubleSport
              ? {height: 25, paddingVertical: 0}
              : {},
            buttons.btn2 === Verbs.HIDE_BUTTON ? {marginLeft: 7} : {},
          ]}
          onPress={() => {
            setShowOptions3(true);
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
          setShowOptions2(false);
          handleButtonPress(option);
        }}
      />

      <BottomSheet
        isVisible={showOptions3}
        closeModal={() => setShowOptions3(false)}
        optionList={options3}
        onSelect={(option) => {
          setShowOptions3(false);
          handleButtonPress(option);
        }}
      />
      <BottomSheet
        isVisible={showOptions4}
        closeModal={() => setShowOptions4(false)}
        optionList={options}
        type="ios"
        title={actionSheetTitle}
        onSelect={(option) => {
          setShowOptions4(false);
          handleButtonPress(option);
        }}
        headerTitleStyle={{
          textAlign: 'center',
          fontSize: 14,
          lineHeight: 16,
          fontFamily: fonts.RRegular,
        }}
        headerStyle={{paddingHorizontal: 15}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 5,
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
