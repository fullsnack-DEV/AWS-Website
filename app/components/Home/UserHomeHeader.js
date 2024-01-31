import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import {displayLocation} from '../../utils';
import Verbs from '../../Constants/Verbs';
import BottomSheet from '../modals/BottomSheet';
import {PrivacyKeyEnum} from '../../Constants/PrivacyOptionsConstant';

const UserHomeHeader = ({
  currentUserData,
  onConnectionButtonPress,
  onAction,
  isAdmin,
  loggedInEntity,
  privacyObj = {},
}) => {
  const isFocused = useIsFocused();
  const [isMember, setIsMember] = useState(false);
  const [options, setOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [buttonTitle, setButtonTitle] = useState('');

  const getButtonTitle = useCallback(
    (checkIsMember) => {
      let name = '';
      if (isAdmin) {
        name = strings.editprofiletitle;
      } else {
        if (
          loggedInEntity.role === Verbs.entityTypePlayer ||
          loggedInEntity.role === Verbs.entityTypeUser
        ) {
          if (currentUserData.follow_request) {
            name = strings.followReqSentText;
          } else if (currentUserData.is_following) {
            name = strings.following;
          } else {
            name = strings.follow;
          }
        }
        if (
          loggedInEntity.role === Verbs.entityTypeClub ||
          loggedInEntity.role === Verbs.entityTypeTeam
        ) {
          if (checkIsMember) {
            name = strings.member;
          } else if (
            currentUserData.invite_request?.action === Verbs.requestVerb
          ) {
            name = strings.requestPendingText;
          } else if (
            currentUserData.invite_request?.action === Verbs.inviteVerb
          ) {
            name = strings.requestSent;
          } else {
            name = strings.invite;
          }
        }
      }

      if (name === strings.invite) {
        if (
          loggedInEntity.role === Verbs.entityTypeTeam &&
          !privacyObj[PrivacyKeyEnum.InviteForTeam]
        ) {
          setButtonTitle('');
        } else if (
          loggedInEntity.role === Verbs.entityTypeClub &&
          !privacyObj[PrivacyKeyEnum.InviteForClub]
        ) {
          setButtonTitle('');
        } else {
          setButtonTitle(name);
        }
      } else {
        setButtonTitle(name);
      }
    },
    [isAdmin, currentUserData, loggedInEntity, privacyObj],
  );

  useEffect(() => {
    if (isFocused) {
      let flag = false;
      if (loggedInEntity.role === Verbs.entityTypeClub) {
        if (currentUserData.clubIds?.length > 0) {
          const club = currentUserData.clubIds.find(
            (item) => item === loggedInEntity.uid,
          );
          if (club !== undefined) {
            flag = true;
          } else {
            flag = false;
          }
        } else {
          flag = false;
        }
      }

      if (loggedInEntity.role === Verbs.entityTypeTeam) {
        if (currentUserData.teamIds?.length > 0) {
          const team = currentUserData.teamIds.find(
            (item) => item === loggedInEntity.uid,
          );

          if (team !== undefined) {
            flag = true;
          } else {
            flag = false;
          }
        } else {
          flag = false;
        }
      }
      setIsMember(flag);
      getButtonTitle(flag);
    }
  }, [isFocused, currentUserData, loggedInEntity, getButtonTitle]);

  const handleButtonPress = (title) => {
    switch (title) {
      case strings.editprofiletitle:
        onAction(Verbs.editVerb);
        break;

      case strings.followReqSentText:
        if (
          loggedInEntity.role === Verbs.entityTypePlayer ||
          loggedInEntity.role === Verbs.entityTypeUser
        ) {
          setOptions([strings.cancelFollowReqText]);
        } else {
          setOptions([strings.cancelRequestText]);
        }
        setShowModal(true);
        break;

      case strings.following:
        setOptions([strings.unfollowText]);
        setShowModal(true);

        break;

      case strings.follow:
        onAction(Verbs.followVerb);

        break;

      case strings.invite:
        onAction(Verbs.inviteVerb);
        break;

      case strings.requestSent:
        setOptions([strings.cancelRequestText]);
        setShowModal(true);
        break;

      case strings.requestPendingText:
        onAction(strings.requestPendingText);

        break;

      case strings.member:
        setOptions([
          format(
            strings.removeMemberFromTeamText,
            loggedInEntity.role === Verbs.entityTypeTeam
              ? Verbs.entityTypeTeam
              : Verbs.entityTypeClub,
          ),
        ]);
        setShowModal(true);
        break;

      default:
        break;
    }
  };

  const handleOptions = (option) => {
    setShowModal(false);
    if (option === strings.unfollowText) {
      onAction(Verbs.unfollowVerb);
    } else {
      onAction(option);
    }
  };

  return (
    <View style={styles.parent}>
      <View style={styles.row}>
        <View style={styles.profileImage}>
          <Image
            source={
              currentUserData?.full_image
                ? {uri: currentUserData?.full_image}
                : images.profilePlaceHolder
            }
            style={styles.image}
          />
        </View>

        {buttonTitle && (
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              isMember ? {flexDirection: 'row', alignItems: 'center'} : {},
            ]}
            onPress={() => handleButtonPress(buttonTitle)}>
            <Text
              style={[
                styles.buttonText,
                buttonTitle === strings.follow
                  ? {color: colors.darkYellowColor}
                  : {},

                buttonTitle === strings.invite
                  ? {color: colors.darkYellowColor}
                  : {},
              ]}>
              {buttonTitle}
            </Text>
            {isMember ? (
              <Image source={images.check} style={styles.checkIcon} />
            ) : null}
          </TouchableOpacity>
        )}
      </View>
      <View style={{marginTop: 15}}>
        <Text style={styles.title}> {currentUserData.full_name}</Text>
        <Text style={styles.location}>{displayLocation(currentUserData)}</Text>
        {currentUserData.description && privacyObj[PrivacyKeyEnum.Slogan] ? (
          <Text style={styles.description}>{currentUserData.description}</Text>
        ) : null}
      </View>

      <View style={[styles.row, {justifyContent: 'flex-start', marginTop: 20}]}>
        <Pressable
          style={[styles.row, {marginRight: 25}]}
          onPress={() => onConnectionButtonPress(strings.following)}>
          <Text
            style={[
              styles.location,
              {fontFamily: fonts.RBold, marginRight: 5},
            ]}>
            {currentUserData.following_count}
          </Text>
          <Text style={styles.location}>{strings.following}</Text>
        </Pressable>
        <Pressable
          style={styles.row}
          onPress={() => onConnectionButtonPress(strings.followerTitleText)}>
          <Text
            style={[
              styles.location,
              {fontFamily: fonts.RBold, marginRight: 5},
            ]}>
            {currentUserData.follower_count}
          </Text>
          <Text style={styles.location}>{strings.followerTitleText}</Text>
        </Pressable>
      </View>

      <BottomSheet
        isVisible={showModal}
        type="ios"
        closeModal={() => setShowModal(false)}
        optionList={options}
        onSelect={handleOptions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.grayBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 30,
  },
  buttonContainer: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  location: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    marginTop: 10,
  },
  checkIcon: {
    width: 8,
    height: 6,
    tintColor: colors.lightBlackColor,
    marginLeft: 5,
  },
});

export default UserHomeHeader;
