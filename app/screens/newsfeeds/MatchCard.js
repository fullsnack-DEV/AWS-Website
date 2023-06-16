// @flow
import moment from 'moment';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import GroupIcon from '../../components/GroupIcon';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import Verbs from '../../Constants/Verbs';
import {getJSDate} from '../../utils';

const MatchCard = ({item = {}}) => (
  <View style={styles.parent}>
    <View style={styles.row}>
      <Text style={styles.dateTime}>
        {moment(getJSDate(item?.actual_startdatetime).getTime()).format(
          'ddd, MMM DD · HH:mma',
        )}
      </Text>
      <View style={styles.verticalLineSeparator} />
      <View style={{flex: 1}}>
        <Text
          style={[styles.dateTime, {fontFamily: fonts.RRegular}]}
          numberOfLines={1}>
          {item.venue?.address}
        </Text>
      </View>
    </View>
    <View style={[styles.row, {justifyContent: 'space-between', marginTop: 8}]}>
      <View style={[styles.row, {justifyContent: 'flex-start', flex: 1}]}>
        <GroupIcon
          entityType={Verbs.entityTypeTeam}
          groupName={item.home_team_name}
          textstyle={{fontSize: 12}}
          showPlaceholder={false}
          containerStyle={[styles.logoContainer, {marginRight: 5}]}
        />
        <View style={{flex: 1}}>
          <Text
            style={[styles.dateTime, {fontFamily: fonts.RMedium}]}
            numberOfLines={2}>
            {item.home_team_name}
          </Text>
        </View>
      </View>

      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={[
            styles.score,
            item.home_team_goal > item.away_team_goal
              ? styles.winnerScore
              : {color: colors.userPostTimeColor},
          ]}>
          {item.home_team_goal} <Text style={styles.score}>:</Text>{' '}
          <Text
            style={[
              styles.score,
              item.home_team_goal < item.away_team_goal
                ? styles.winnerScore
                : {color: colors.userPostTimeColor},
            ]}>
            {item.away_team_goal}
          </Text>
        </Text>
      </View>

      <View style={[styles.row, {justifyContent: 'flex-end', flex: 1}]}>
        <View style={{flex: 1}}>
          <Text
            style={[
              styles.dateTime,
              {fontFamily: fonts.RMedium, textAlign: 'right'},
            ]}
            numberOfLines={2}>
            {item.away_team_name}
          </Text>
        </View>
        <GroupIcon
          entityType={Verbs.entityTypeTeam}
          groupName={item.away_team_name}
          textstyle={{fontSize: 12}}
          showPlaceholder={false}
          containerStyle={[styles.logoContainer, {marginLeft: 5}]}
        />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 7,
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    elevation: 5,
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1608,
    shadowRadius: 15,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 30,
    height: 30,
    borderWidth: 1,
  },
  dateTime: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  verticalLineSeparator: {
    width: 1,
    height: 10,
    backgroundColor: colors.darkGrey,
    marginLeft: 8,
    marginRight: 10,
  },
  score: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  winnerScore: {
    fontFamily: fonts.RBold,
    color: colors.tabFontColor,
  },
});
export default MatchCard;
