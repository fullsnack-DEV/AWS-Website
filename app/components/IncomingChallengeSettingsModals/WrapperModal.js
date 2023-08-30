// @flow
/* eslint-disable no-nested-ternary */

import React, {useEffect, useState, useContext} from 'react';
import {View, Modal} from 'react-native';
import {getCountry} from 'country-currency-map';
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
import ScreenHeader from '../ScreenHeader';
import AuthContext from '../../auth/context';

import {currencyList} from '../../Constants/GeneralConstants';

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

  const authContext = useContext(AuthContext);

  const [currency, setCurrency] = useState();

  useEffect(() => {
    const gettingCurrency = getCountry(authContext.entity.obj.country);

    if (!currencyList.some((i) => i.currency === gettingCurrency.currency)) {
      setCurrency('USD');
    } else {
      setCurrency(gettingCurrency.currency);
    }
  }, []);

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
            gameType={settings.game_type ?? strings.friendlyGameType}
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
            currency={currency ?? Verbs.cad}
            entityType={entityType}
          />
        );

      case strings.refundPolicy:
        return (
          <CancellationPolicyModal
            refundPolicy={settings.refund_policy ?? Verbs.flexibleText}
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
              if (settings.sport?.toLowerCase() === Verbs.tennisSport) {
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
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={closeModal}>
      <View style={styles.parent}>
        <View style={styles.card}>
          <ScreenHeader
            leftIcon={images.crossImage}
            leftIconPress={closeModal}
            title={
              title === strings.venue ? strings.venuesAndCheckInPoint : title
            }
            isRightIconText
            rightButtonText={strings.save}
            onRightButtonPress={() => onSave(settings)}
          />
          <View style={styles.container}>{getScreen(title)}</View>
        </View>
      </View>
    </Modal>
  );
};

export default WrapperModal;
