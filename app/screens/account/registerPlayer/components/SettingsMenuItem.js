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
  handleOpetions = () => {},
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

        case strings.gameType:
          return (
            <Text style={styles.normalStyle}>{settingObject.game_type}</Text>
          );

        case strings.gameFee:
          return (
            <Text style={styles.normalStyle}>
              {`$${settingObject.game_fee?.fee} ${settingObject.game_fee?.currency_type}/${strings.match}`}
            </Text>
          );

        case strings.refundPolicy:
          return (
            <Text style={styles.normalStyle}>
              {settingObject.refund_policy}
            </Text>
          );

        // case strings.gameDuration:
        //   return <Text style={styles.normalStyle}>2h 00m</Text>;

        // case strings.setsPointsDuration:
        //   return (
        //     <Text
        //       style={
        //         styles.normalStyle
        //       }>{`${settingObject.score_rules?.match_duration}`}</Text>
        //   );

        case strings.setGamesDuration:
          return (
            <GameDurationDetails game_duration={settingObject.game_duration} />
          );

        case strings.venue:
          if ((settingObject?.venue ?? []).length > 0) {
            return <VenuesList list={settingObject.venue} />;
          }
          return <Text style={styles.venue}>{strings.noVenues}</Text>;

        case strings.gameRules:
          return (
            <Text style={styles.venue}>
              {settingObject.special_rules
                ? `${settingObject.general_rules}\n${settingObject.special_rules}`
                : settingObject.general_rules}
            </Text>
          );

        case strings.refereesTitle:
          return (
            <Text style={styles.normalStyle}>
              {format(
                // strings.nReferees,
                settingObject.responsible_for_referee?.who_secure
                  ? settingObject?.responsible_for_referee?.who_secure?.length
                  : strings.no,
              )}
            </Text>
          );

        case strings.scorekeeperTitle:
          return (
            <Text style={styles.normalStyle}>
              {format(
                // strings.nScorekeeper,
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

  return (
    <>
      <View style={[styles.headerRow, {paddingBottom: 0}]}>
        <Text style={[styles.headerTitle, {textAlign: 'left'}]}>
          {item.key.toUpperCase()}
        </Text>
        {item.key === strings.sport ? (
          <Text style={styles.normalStyle}>{sportName}</Text>
        ) : (
          <View
            style={[
              styles.headerRow,
              {paddingHorizontal: 0, paddingBottom: 0},
            ]}>
            {item.key !== strings.gameRules &&
            item.key !== strings.venue &&
            item.key !== strings.setGamesDuration
              ? getSettingValue(item.key)
              : null}

            <TouchableOpacity
              onPress={() => {
                handleOpetions(item.key);
              }}>
              <Text style={styles.completeStyle}>{strings.edit}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {item.key === strings.gameRules ||
      item.key === strings.venue ||
      item.key === strings.setGamesDuration
        ? getSettingValue(item.key)
        : null}

      <View style={styles.divider} />
    </>
  );
};

export default SettingsMenuItem;
