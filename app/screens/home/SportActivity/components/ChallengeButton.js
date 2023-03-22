// @flow
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, Modal} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import images from '../../../../Constants/ImagePath';
import Verbs from '../../../../Constants/Verbs';
import styles from './ChallengeButtonStyles';

const ChallengeButton = ({
  isAdmin = false,
  isAvailable = false,
  isScorekeeper = false,
  isReferee = false,
  isUserWithSameSport = false,
  inviteToChallenge = () => {},
  containerStyle = {},
  continueToChallenge = () => {},
  gameFee = {},
  entityType = Verbs.entityTypePlayer,
  bookReferee = () => {},
  bookScoreKeeper = () => {},
}) => {
  const [showModal, setShowModal] = useState(false);

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

  return !isAdmin && isAvailable ? (
    <View style={[styles.parent, containerStyle]}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          if (entityType === Verbs.entityTypePlayer) {
            continueToChallenge();
          }
          if (entityType === Verbs.entityTypeReferee) {
            bookReferee();
          }
          if (entityType === Verbs.entityTypeScorekeeper) {
            bookScoreKeeper();
          }
        }}>
        {entityType === Verbs.entityTypePlayer ? (
          <Text style={styles.buttonText}>
            {strings.challenge}{' '}
            <Text style={styles.buttonText1}>
              {gameFee?.fee ?? 0} {gameFee?.currency_type ?? Verbs.cad} /{' '}
              {strings.matchText}
            </Text>
          </Text>
        ) : (
          <Text style={styles.buttonText}>
            {strings.book}{' '}
            <Text style={styles.buttonText1}>
              {gameFee?.fee ?? 0} {gameFee?.currency_type ?? Verbs.cad} /{' '}
              {strings.hourText}
            </Text>
          </Text>
        )}
      </TouchableOpacity>
      {entityType === Verbs.entityTypePlayer ? (
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
