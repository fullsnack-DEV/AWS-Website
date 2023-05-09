// @flow
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';
import fonts from '../../../Constants/Fonts';
import Verbs from '../../../Constants/Verbs';
import {getSportName} from '../../../utils/sportsActivityUtils';
import * as Utility from '../../../utils';
import colors from '../../../Constants/Colors';

const GroupBasicInfo = ({groupDetails = {}}) => {
  const authContext = useContext(AuthContext);
  const [sportName, setSportName] = useState('');

  useEffect(() => {
    if (groupDetails.entity_type === Verbs.entityTypeClub) {
      if (groupDetails.sports?.length > 0) {
        let name = '';

        groupDetails.sports.forEach((item, index) => {
          const sportname = getSportName(
            item.sport,
            item.sport_type,
            authContext.sports,
          );

          if (index < 4) {
            name += index !== 0 ? `, ${sportname}` : sportname;
          }
        });

        setSportName(name);
      }
    } else if (groupDetails.entity_type === Verbs.entityTypeTeam) {
      const sportname = getSportName(
        groupDetails.sport,
        groupDetails.sport_type,
        authContext.sports,
      );
      setSportName(sportname);
    }
  }, [groupDetails, authContext]);

  return (
    <View style={styles.parent}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>{strings.sport}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.longTextStyle}>{sportName}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>{strings.homeCity}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.longTextStyle}>{`${groupDetails.city}, ${
            groupDetails.state_abbr ?? groupDetails.state
          }, ${groupDetails.country}`}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>{strings.membersgender}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.longTextStyle}>
            {groupDetails.gender
              ? Utility.capitalize(groupDetails.gender)
              : strings.NA}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>{strings.membersage}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.longTextStyle}>{`${
            groupDetails.min_age
              ? `${strings.minPlaceholder} ${groupDetails.min_age}`
              : ''
          } ${
            groupDetails.max_age
              ? `${strings.maxPlaceholder} ${groupDetails.max_age}`
              : ''
          }`}</Text>
        </View>
      </View>

      <View
        style={[
          styles.row,
          groupDetails.entity_type === Verbs.entityTypeClub
            ? {}
            : {marginBottom: 0},
        ]}>
        <View style={styles.col}>
          <Text style={styles.label}>{strings.languages}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.longTextStyle}>
            {groupDetails.language?.length > 0
              ? groupDetails.language.join(', ')
              : strings.NA}
          </Text>
        </View>
      </View>
      {groupDetails.entity_type === Verbs.entityTypeClub ? (
        <View style={[styles.row, {marginBottom: 0}]}>
          <View style={styles.col}>
            <Text style={styles.label}>{strings.officeAddress}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.longTextStyle}>
              {groupDetails.office_address ?? strings.NA}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {},
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.veryLightBlack,
    fontFamily: fonts.RMedium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  col: {
    flex: 1,
    alignItems: 'flex-start',
  },
  longTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
export default GroupBasicInfo;
