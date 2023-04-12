import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, Pressable} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import {displayLocation} from '../../utils';
import Verbs from '../../Constants/Verbs';
import BottomSheet from '../modals/BottomSheet';

const UserHomeHeader = ({
  currentUserData,
  onConnectionButtonPress,
  onAction,
  isAdmin,
  loggedInEntity,
}) => {
  const isFocused = useIsFocused();
  const [isMember, setIsMember] = useState(false);
  const [options, setOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isFocused) {
      if (loggedInEntity.role === Verbs.entityTypeClub) {
        if (currentUserData.joined_clubs.length > 0) {
          const club = currentUserData.joined_clubs.find(
            (item) => item.group_id === loggedInEntity.uid,
          );
          if (club?.group_id) {
            setIsMember(true);
          } else {
            setIsMember(false);
          }
        } else {
          setIsMember(false);
        }
      }

      if (loggedInEntity.role === Verbs.entityTypeTeam) {
        if (currentUserData.joined_teams?.length > 0) {
          const team = currentUserData.joined_teams.find(
            (item) => item.group_id === loggedInEntity.uid,
          );
          if (team?.group_id) {
            setIsMember(true);
          } else {
            setIsMember(false);
          }
        } else {
          setIsMember(false);
        }
      }
    }
  }, [isFocused, currentUserData, loggedInEntity]);

  const getButtonTitle = () => {
    if (isAdmin) {
      return strings.editprofiletitle;
    }
    if (
      loggedInEntity.role === Verbs.entityTypePlayer ||
      loggedInEntity.role === Verbs.entityTypeUser
    ) {
      if (currentUserData.is_following) {
        return strings.following;
      }
      return strings.follow;
    }
    if (
      loggedInEntity.role === Verbs.entityTypeClub ||
      loggedInEntity.role === Verbs.entityTypeTeam
    ) {
      if (isMember) {
        return strings.member;
      }
      if (currentUserData.invite_request) {
        if (
          currentUserData.invite_request.entity_type === Verbs.entityTypeUser
        ) {
          return strings.requestPendingText;
        }
        if (
          currentUserData.invite_request.entity_type === Verbs.entityTypeClub ||
          currentUserData.invite_request.entity_type === Verbs.entityTypeTeam
        ) {
          return strings.requestPendingText;
        }
      }
      return strings.invite;
    }

    return '';
  };

  const handleButtonPress = (title) => {
    switch (title) {
      case strings.editprofiletitle:
        onAction(Verbs.editVerb);
        break;

      case strings.following:
        setShowModal(true);
        setOptions([strings.unfollowText]);
        break;

      case strings.follow:
        onAction(Verbs.followVerb);
        break;

      case strings.invite:
        onAction(Verbs.inviteVerb);
        break;

      case strings.requestPendingText:
        setShowModal(true);

        if (
          currentUserData.invite_request.entity_type === Verbs.entityTypeUser
        ) {
          setOptions([
            strings.acceptInvitateRequest,
            strings.declineMemberRequest,
          ]);
        } else if (
          currentUserData.invite_request.entity_type === Verbs.entityTypeClub ||
          currentUserData.invite_request.entity_type === Verbs.entityTypeTeam
        ) {
          setOptions(strings.cancelMembershipInvitation);
        }
        break;

      case strings.member:
        setShowModal(true);
        setOptions([strings.removeMemberFromTeamText]);
        break;

      default:
        break;
    }
  };

  const handleOptions = (option) => {
    setShowModal(false);
    switch (option) {
      case strings.unfollowText:
        onAction(Verbs.unfollowVerb);
        break;

      case strings.cancelMembershipInvitation:
      case strings.acceptInvitateRequest:
      case strings.declineMemberRequest:
        onAction(option);
        break;

      case strings.removeMemberFromTeamText:
        break;

      default:
        break;
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

        <Pressable
          style={[
            styles.buttonContainer,
            isMember ? {flexDirection: 'row', alignItems: 'center'} : {},
          ]}
          onPress={() => handleButtonPress(getButtonTitle())}>
          <Text style={styles.buttonText}>{getButtonTitle()}</Text>
          {isMember ? (
            <Image source={images.check} style={styles.checkIcon} />
          ) : null}
        </Pressable>
      </View>
      <View style={{marginTop: 15}}>
        <Text style={styles.title}>{currentUserData.full_name}</Text>
        <Text style={styles.location}>{displayLocation(currentUserData)}</Text>
        {currentUserData.description ? (
          <Text style={styles.description}>{currentUserData.description}</Text>
        ) : null}
      </View>
      <View style={[styles.row, {justifyContent: 'flex-start', marginTop: 20}]}>
        <Pressable
          style={[styles.row, {marginRight: 25}]}
          onPress={() => onConnectionButtonPress(Verbs.followingVerb)}>
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
          onPress={() => onConnectionButtonPress(Verbs.privacyTypeFollowers)}>
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
