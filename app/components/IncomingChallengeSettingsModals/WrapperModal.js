// @flow
/* eslint-disable no-nested-ternary */

import React, {useEffect, useState} from 'react';
import {View, Modal, Pressable, Image, Text} from 'react-native';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';
import AvailabilityModal from './AvailabilityModal';
import CancellationPolicyModal from './CancellationPolicyModal';
import GameRulesModal from './GameRulesModal';
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
  entityType = '',
  show_Double = 'false',
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
            availability={
              settings?.availibility ||
              settings?.referee_availibility ||
              settings?.scorekeeper_availibility
            }
            sportName={sportName}
            onChange={(obj) => {
              setSettings({...settings, ...obj});
            }}
            entityType={entityType}
          />
        );

      case strings.gameTypeTitle:
        return (
          <MatchTypeModal
            gameType={settings.game_type}
            onChange={(gameType) => {
              setSettings({...settings, game_type: gameType});
            }}
          />
        );

      case strings.gameFee:
      case strings.refereeFee:
      case strings.scorekeeperFee:
        return (
          <MatchFeeModal
            gameFee={settings.game_fee}
            onChange={(gameFee) => {
              setSettings({
                ...settings,
                game_fee: {...settings.game_fee, fee: gameFee},
              });
            }}
            onChangeCurrency={(selectedCurrency) => {
              setSettings({
                ...settings,
                game_fee: {
                  ...settings.game_fee,
                  currency_type: selectedCurrency,
                },
              });
            }}
            currency={settings?.game_fee?.currency_type ?? Verbs.cad}
            entityType={entityType}
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

      case strings.Referee:
        return (
          <RefreeModal
            refreeCount={settings.responsible_for_referee?.who_secure?.length}
            onChange={(refereeDetails) => {
              setSettings({...settings, ...refereeDetails});
            }}
          />
        );

      case strings.scorekeeperText:
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
            gameDuration={
              settings?.sport?.toLowerCase() === Verbs.tennisSport
                ? show_Double
                  ? settings.game_duration
                  : settings.score_rules
                : settings.game_duration
            }
            onChange={(gameDuration) => {
              if (settings.sport.toLowerCase() === Verbs.tennisSport) {
                if (show_Double) {
                  setSettings({
                    ...settings,
                    game_duration: {...settings.game_duration, ...gameDuration},
                  });
                } else {
                  setSettings({...settings, score_rules: {...gameDuration}});
                }
              } else {
                setSettings({...settings, game_duration: {...gameDuration}});
              }
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

      case strings.gameRulesTitle:
        return (
          <GameRulesModal
            generalRules={settings.general_rules}
            onChange={(generalRules) => {
              setSettings({
                ...settings,
                general_rules: generalRules,
              });
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
            <View style={{flex: 1}}>
              <Pressable style={{width: 26, height: 26}} onPress={closeModal}>
                <Image source={images.crossImage} style={styles.image} />
              </Pressable>
            </View>
            <View style={styles.headerTitleContainer}>
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
