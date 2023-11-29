// @flow
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image, Modal} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import images from '../../../../Constants/ImagePath';
import Verbs from '../../../../Constants/Verbs';
import styles from './ChallengeButtonStyles';

const ChallengeButton = ({
  isAdmin = false,
  isAvailable = false,
  inviteToChallenge = () => {},
  continueToChallenge = () => {},
  bookReferee = () => {},
  bookScoreKeeper = () => {},
  // ownerDetails = {},
  loggedInEntity = {},
  sportObj = {},
  containerStyle = {},
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isScorekeeper, setIsScoreKeeper] = useState(false);
  const [isReferee, setIsReferee] = useState(false);
  const [isUserWithSameSport, setIsUserWithSameSport] = useState(false);
  const [isActiveSportActivity, setIsActiveSportActivity] = useState(false);

  useEffect(() => {
    if (sportObj.sport && (sportObj?.is_active || !('is_active' in sportObj))) {
      setIsActiveSportActivity(true);
    }
  }, [sportObj]);

  useEffect(() => {
    const playingSport = (loggedInEntity.registered_sports ?? []).filter(
      (item) => item.sport === sportObj?.sport,
    );

    setIsUserWithSameSport(playingSport.length > 0);
    if (
      sportObj.sport_type === Verbs.singleSport &&
      loggedInEntity.entity_type === Verbs.entityTypePlayer
    ) {
      const sportList = (loggedInEntity.scorekeeper_data ?? []).filter(
        (item) => item.sport === sportObj?.sport,
      );

      setIsScoreKeeper(sportList.length > 0);

      const sportList1 = (loggedInEntity.referee_data ?? []).filter(
        (item) => item.sport === sportObj?.sport,
      );

      setIsReferee(sportList1.length > 0);
    } else {
      setIsScoreKeeper(false);
      setIsReferee(false);
      setIsUserWithSameSport(false);
    }
  }, [loggedInEntity, sportObj]);

  const getModalOptions = () => (
    <>
      {isUserWithSameSport ? (
        <>
          <TouchableOpacity
            style={styles.challengeContainer}
            onPress={() => {
              inviteToChallenge();
              setShowModal(false);
            }}>
            <Text style={styles.challengeText}>
              {strings.inviteToChallenge}
            </Text>
            <Text style={styles.normalText}>
              Invite this player to challenge you. You will be the match host
              and the opponent will be the challenger.
            </Text>
          </TouchableOpacity>
          <View style={styles.separator} />
        </>
      ) : null}

      {isReferee ? (
        <>
          <TouchableOpacity
            style={styles.challengeContainer}
            onPress={() => {
              bookReferee();
              setShowModal(false);
            }}>
            <Text style={styles.challengeText}>{strings.refereeOffer}</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
        </>
      ) : null}
      {isScorekeeper ? (
        <TouchableOpacity
          style={styles.challengeContainer}
          onPress={() => {
            bookScoreKeeper();
            setShowModal(false);
          }}>
          <Text style={styles.challengeText}>{strings.scorekeeperOffer}</Text>
        </TouchableOpacity>
      ) : null}
    </>
  );

  const getButtonLabel = () => {
    const playingSport = (loggedInEntity.registered_sports ?? []).filter(
      (item) => {
        if (
          item.sport_type === Verbs.sportTypeSingle &&
          item.sport === sportObj?.sport
        ) {
          return true;
        }
        return false;
      },
    );

    if (
      sportObj?.sport_type === Verbs.singleSport &&
      loggedInEntity.entity_type === Verbs.entityTypePlayer &&
      isAvailable &&
      isUserWithSameSport
    ) {
      return strings.challenge;
    }

    if (
      sportObj?.type === Verbs.entityTypeReferee ||
      sportObj?.type === Verbs.entityTypeScorekeeper
    ) {
      if (
        loggedInEntity.entity_type === Verbs.entityTypeTeam &&
        isAvailable &&
        sportObj.sport === loggedInEntity.sport
      ) {
        return strings.book;
      }
      if (
        (loggedInEntity.entity_type === Verbs.entityTypePlayer ||
          loggedInEntity.entity_type === Verbs.entityTypeUser) &&
        isUserWithSameSport &&
        isAvailable
      ) {
        return strings.book;
      }
      if (
        loggedInEntity.entity_type === Verbs.entityTypePlayer &&
        isAvailable &&
        playingSport.length > 0
      ) {
        return strings.book;
      }
    }

    return '';
  };

  if (
    isAdmin ||
    !isActiveSportActivity ||
    (sportObj?.sport_type === Verbs.doubleSport &&
      sportObj?.type === Verbs.entityTypePlayer)
  ) {
    return null;
  }

  const handleButtonPress = () => {
    const option = getButtonLabel();
    if (option === strings.challenge) {
      continueToChallenge();
    } else if (option === strings.book) {
      if (sportObj?.type === Verbs.entityTypeReferee) {
        bookReferee();
      }
      if (sportObj?.type === Verbs.entityTypeScorekeeper) {
        bookScoreKeeper();
      }
    }
  };

  return getButtonLabel() ? (
    <View style={[styles.parent, containerStyle]}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => handleButtonPress()}>
        <Text style={styles.buttonText}>
          {getButtonLabel()}{' '}
          <Text style={styles.buttonText1}>
            {sportObj.setting?.game_fee?.fee ?? 0}{' '}
            {sportObj.setting?.game_fee?.currency_type ?? Verbs.cad} /{' '}
            {loggedInEntity.entity_type === Verbs.entityTypePlayer
              ? strings.matchText
              : strings.hourText}
          </Text>
        </Text>
      </TouchableOpacity>
      {sportObj?.sport_type === Verbs.singleSport &&
      loggedInEntity.entity_type === Verbs.entityTypePlayer &&
      isAvailable &&
      (isUserWithSameSport || isReferee || isScorekeeper) ? (
        <TouchableOpacity
          style={styles.buttonContainer2}
          onPress={() => {
            setShowModal(true);
          }}>
          <Image source={images.moreOptions} style={styles.image} />
        </TouchableOpacity>
      ) : null}
      <Modal visible={showModal} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.container1}>{getModalOptions()}</View>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowModal(false)}>
            <Text style={[styles.challengeText, {marginBottom: 0}]}>
              {strings.cancel}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  ) : null;
};

export default ChallengeButton;
