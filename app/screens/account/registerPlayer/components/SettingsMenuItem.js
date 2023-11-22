// @flow
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {format} from 'react-string-format';
import {strings} from '../../../../../Localization/translation';
import GameDurationDetails from '../../../../components/GameDurationDetails';

import Verbs from '../../../../Constants/Verbs';
import styles from '../IncomingChallengeSettingsStyles';
import VenuesList from './VenuesList';

const SettingsMenuItem = ({
  item,
  settingObject,
  sportName,
  handleOptions = () => {},
}) => {
  const getSettingValue = (key) => {
    if (settingObject) {
      switch (key) {
        case strings.availability:
          return (
            <Text style={styles.normalStyle}>
              {settingObject.availibility || Verbs.off}
            </Text>
          );

        case strings.gameTypeTitle:
          return (
            <Text style={styles.normalStyle}>
              {settingObject.game_type || strings.friendlyGameType}
            </Text>
          );

        case strings.gameFee:
          return (
            <Text style={styles.normalStyle}>
              {`${settingObject.game_fee?.fee || 0} ${
                settingObject.game_fee?.currency_type || Verbs.usd
              }/${strings.match}`}
            </Text>
          );

        case strings.refundPolicy:
          return (
            <Text style={styles.normalStyle}>
              {settingObject.refund_policy || Verbs.flexibleText}
            </Text>
          );

        case strings.setGamesDuration:
          return (
            <GameDurationDetails game_duration={settingObject.game_duration} />
          );

        case strings.venue:
          if ((settingObject?.venue ?? []).length > 0) {
            return <VenuesList list={settingObject.venue} />;
          }
          return <Text style={styles.venue}>{strings.noVenues}</Text>;

        case strings.gameRulesTitle:
          return (
            <Text style={styles.venue}>
              {settingObject.special_rules
                ? `${settingObject.general_rules}\n${settingObject.special_rules}`
                : settingObject.general_rules}
            </Text>
          );

        case strings.Referee:
          return (
            <Text style={styles.normalStyle}>
              {format(
                strings.nReferees,
                settingObject.responsible_for_referee?.who_secure
                  ? settingObject?.responsible_for_referee?.who_secure?.length
                  : strings.no,
              )}
            </Text>
          );

        case strings.scorekeeperText:
          return (
            <Text style={styles.normalStyle}>
              {format(
                strings.nScorekeeperText,
                settingObject.responsible_for_scorekeeper?.who_secure
                  ? settingObject.responsible_for_scorekeeper.who_secure?.length
                  : strings.no,
              )}
            </Text>
          );

        default:
          return <Text style={styles.normalStyle}>{strings.incomplete}</Text>;
      }
    }
    return <Text style={styles.normalStyle}>{strings.incomplete}</Text>;
  };

  return item.key ? (
    <>
      <View style={styles.menuItemRow}>
        <View style={{flex: 1}}>
          <Text style={[styles.headerTitle, {textAlign: 'left'}]}>
            {item.key}
          </Text>
        </View>
        {item.key === strings.sport ? (
          <Text style={styles.normalStyle}>{sportName}</Text>
        ) : (
          <View style={[styles.menuItemRow, {paddingHorizontal: 0}]}>
            {item.key !== strings.gameRulesTitle &&
            item.key !== strings.venue &&
            item.key !== strings.setGamesDuration
              ? getSettingValue(item.key)
              : null}

            <TouchableOpacity
              onPress={() => {
                handleOptions(item.key);
              }}>
              <Text style={styles.completeStyle}>
                {item.key === strings.venue &&
                (settingObject.venue ?? []).length === 0
                  ? strings.addText
                  : strings.edit}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {item.key === strings.gameRulesTitle ||
      item.key === strings.venue ||
      item.key === strings.setGamesDuration
        ? getSettingValue(item.key)
        : null}

      <View style={styles.divider} />
    </>
  ) : null;
};

export default SettingsMenuItem;
