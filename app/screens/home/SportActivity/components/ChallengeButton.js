// @flow
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, Modal} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import images from '../../../../Constants/ImagePath';
import styles from './ChallengeButtonStyles';

const ChallengeButton = ({
  isAdmin = false,
  isAvailable = false,
  isScorekeeper = false,
  isReferee = false,
  isUserWithSameSport = false,
  onPress = () => {},
  containerStyle = {},
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const getModalOptions = () => (
    <>
      {isUserWithSameSport ? (
        <>
          <TouchableOpacity
            style={styles.challengeContainer}
            onPress={() => {
              onPress(strings.inviteToChallenge);
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
              onPress(strings.refereeOffer);
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
            onPress(strings.scorekeeperOffer);
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
          setShowModal(true);
        }}>
        <Text style={styles.buttonText}>
          {strings.challenge}{' '}
          <Text style={styles.buttonText1}>$20 CAD / match</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonContainer2}
        onPress={() => {
          setShowOptionsModal(true);
        }}>
        <Image source={images.moreOptions} style={styles.image} />
      </TouchableOpacity>

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

      <Modal visible={showOptionsModal} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.container1}>
            <TouchableOpacity
              style={styles.challengeContainer}
              onPress={() => {
                onPress(strings.reportThisAccount);
                setShowOptionsModal(false);
              }}>
              <Text style={styles.challengeText}>
                {strings.reportThisAccount}
              </Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              style={styles.challengeContainer}
              onPress={() => {
                onPress(strings.blockThisAccount);
                setShowOptionsModal(false);
              }}>
              <Text style={styles.challengeText}>
                {strings.blockThisAccount}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowOptionsModal(false)}>
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
