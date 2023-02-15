// @flow
import React, {useEffect, useState} from 'react';
import {View, Modal, Pressable, Image, Text} from 'react-native';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import AvailabilityModal from './AvailabilityModal';
import CancellationPolicyModal from './CancellationPolicyModal';
import MatchFeeModal from './MatchFeeModal';
import MatchTypeModal from './MatchTypeModal';
import RefreeModal from './RefreeModal';
import ScorekeeperModal from './ScorekeeperModal';
import SetsGamesDurationModal from './SetsGamesDurationModal';
import VenueModal from './VenueModal';
import styles from './WrapperModalStyles';

const WrapperModal = ({
  isVisible = false,
  closeModal = () => {},
  title = '',
  onSave = () => {},
  settingsObj = null,
  sportName = '',
  onChangeCurrency = () => {},
  currency = '',
}) => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    if (settingsObj) {
      setSettings(settingsObj);
    }
  }, [settingsObj]);

  const getScreen = (screenName) => {
    switch (screenName) {
      case strings.availability:
        return (
          <AvailabilityModal
            availability={settings?.availability}
            sportName={sportName}
            onChange={(availability) => {
              setSettings({...settings, availability});
            }}
          />
        );

      case strings.gameType:
        return (
          <MatchTypeModal
            gameType={settings.game_type}
            onChange={(gameType) => {
              setSettings({...settings, game_type: gameType});
            }}
          />
        );

      case strings.gameFee:
        return (
          <MatchFeeModal
            gameFee={settings.game_fee}
            onChange={(gameFee) => {
              setSettings({...settings, game_fee: gameFee});
            }}
            onChangeCurrency={onChangeCurrency}
            currency={currency}
          />
        );

      case strings.refundPolicy:
        return (
          <CancellationPolicyModal
            refundPolicy={settings.refund_policy}
            onChange={(refundPolicy) => {
              setSettings({...settings, refund_policy: refundPolicy});
            }}
          />
        );

      case strings.refereesTitle:
        return (
          <RefreeModal
            refreeCount={settings.responsible_for_referee?.who_secure?.length}
            onChange={(refereeDetails) => {
              setSettings({...settings, ...refereeDetails});
            }}
          />
        );

      case strings.scorekeeperTitle:
        return (
          <ScorekeeperModal
            scorekeeperCount={
              settings.responsible_for_scorekeeper?.who_secure?.length
            }
            onChange={(scorekeeperDetails) => {
              setSettings({...settings, ...scorekeeperDetails});
            }}
          />
        );

      case strings.setGamesDuration:
        return (
          <SetsGamesDurationModal
            gameDuration={settings.game_duration}
            onChange={(gameDuration) => {
              setSettings({...settings, game_duration: {...gameDuration}});
            }}
          />
        );

      case strings.venue:
        return (
          <VenueModal
            venues={
              (settings.venue ?? []).length > 0
                ? settings.venue
                : [
                    {
                      name: '',
                      address: '',
                      details: '',
                      region: {},
                      coordinate: {},
                    },
                  ]
            }
            onChange={(venuesList) => {
              setSettings({...settings, venue: [...venuesList]});
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.parent}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Pressable style={{width: 26, height: 26}} onPress={closeModal}>
              <Image source={images.crossImage} style={styles.image} />
            </Pressable>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
            <Pressable
              style={styles.buttonContainer}
              onPress={() => onSave(settings)}>
              <Text style={styles.buttonText}>{strings.save}</Text>
            </Pressable>
          </View>
          <View style={styles.divider} />
          <View style={styles.container}>{getScreen(title)}</View>
        </View>
      </View>
    </Modal>
  );
};

export default WrapperModal;
