/* eslint-disable guard-for-in */
import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, Text, SectionList, View} from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import TCEventView from '../../../components/TCEventView';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import AuthContext from '../../../auth/context';
import TCEventCard from '../../../components/Schedule/TCEventCard';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import { getJSDate } from '../../../utils';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function EventScheduleScreen({
  onItemPress,
  eventData,
  onThreeDotPress,
  entity,
  profileID,
  screenUserId,
  filterOptions,
  selectedFilter,
}) {
  const authContext = useContext(AuthContext);

  const [filterData, setFilterData] = useState(null);

  useEffect(() => {
    console.log('eventData aa', eventData)
    let events = eventData.filter(
      (obj) => (obj?.game_id && obj?.game) || obj?.title,
    );


    // Future or past event we commented now only supported future event
    // if (filterOptions.time === 0) {
    //   events = events.filter(
    //     (x) =>
    //       x.end_datetime > getTCDate(new Date()),
    //   );
    // } else {
    //   events = events.filter(
    //     (x) =>
    //       x.end_datetime < getTCDate(new Date()),
    //   );
    // }

    if (
      [
        Verbs.entityTypePlayer,
        Verbs.entityTypeUser,
        Verbs.entityTypeClub,
      ].includes(authContext.entity.role)
    ) {
      if (
        filterOptions.sort === 2 &&
        [Verbs.entityTypePlayer, Verbs.entityTypeUser].includes(
          authContext.entity.role,
        )
      ) {
        if (selectedFilter.title.sport !== 'All') {
          if (selectedFilter.title === 'Matches') {
            events = events.filter(
              (obj) =>
                obj?.game &&
                (obj?.game?.home_team?.user_id === authContext.entity.uid ||
                  obj?.game?.away_team?.user_id === authContext.entity.uid),
            );
          }
          if (selectedFilter.title === 'Refeering') {
            events = events.filter(
              (obj) => obj?.game && obj?.referee_id === authContext.entity.uid,
            );
          }
          if (selectedFilter.title === 'Scorekeepering') {
            events = events.filter(
              (obj) =>
                obj?.game && obj?.scorekeeper_id === authContext.entity.uid,
            );
          }
          if (selectedFilter.title === 'Others') {
            events = events.filter((obj) => !obj.game);
          }
        }
      } else if (filterOptions.sort === 1) {
        if (selectedFilter.title.sport !== 'All') {
          events = events.filter(
            (obj) => ((obj.game && obj.game.sport === selectedFilter.title.sport) || 
            (obj.selected_sport && obj.selected_sport.sport === selectedFilter.title.sport)),
          );
        }
      } else if (filterOptions.sort === 0) {
        if (selectedFilter.title.group_name !== 'All') {
          if (selectedFilter.title.group_name === 'Me') {
            events = events.filter(
              (obj) =>
                obj.created_by.uid === authContext.entity.uid ||
                obj.game?.home_team?.user_id === authContext.entity.uid ||
                obj.game?.away_team?.user_id === authContext.entity.uid,
            );
          } else if (selectedFilter.title.group_name === 'Others') {
            events = events.filter(
              (obj) =>
                obj.created_by.uid !== authContext.entity.uid &&
                obj.game?.home_team?.user_id !== authContext.entity.uid &&
                obj.game?.away_team?.user_id !== authContext.entity.uid,
            );
          } else {
            events = events.filter(
              (obj) =>
                obj.created_by.uid === selectedFilter.title.group_id ||
                obj.created_by.group_id === selectedFilter.title.group_id ||
                [
                  obj.game?.home_team?.user_id,
                  obj.game?.away_team?.user_id,
                  obj.game?.home_team?.group_id,
                  obj.game?.away_team?.group_id,
                ].includes(selectedFilter.title.group_id),
            );
          }
        }
      }
    }
    if (events.length > 0) {
      const result = _(events)
        .groupBy((event) =>
          moment(getJSDate(event.start_datetime)).format('MMM DD, YYYY'),
        )
        .value();
      const filData = [];
      for (const property in result) {
        let temp = {};
        const value = result[property];
        temp = {
          title: property,
          data: result[property].length > 0 ? value : [],
        };
        filData.push(temp);
      }
      setFilterData([...filData]);
    } else {
      setFilterData([]);
    }
  }, [eventData, filterOptions, selectedFilter]);

  return (
    <View style={styles.mainContainer}>
      {filterData && (
        <SectionList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{marginTop: 15}}>
              <Text style={styles.noEventText}>{strings.noEventText}</Text>
              <Text style={styles.dataNotFoundText}>
                {strings.newEventWillAppearHereText}
              </Text>
            </View>
          }
          renderItem={({item}) => {
            if (item.cal_type === 'event') {
              if (item?.game_id && item?.game) {
                return (
                  <TCEventView
                    onPress={() => onItemPress(item)}
                    data={item}
                    profileID={profileID}
                    screenUserId={screenUserId}
                    onThreeDotPress={() => onThreeDotPress(item)}
                    eventBetweenSection={item.game}
                    eventOfSection={
                      item.game &&
                      item.game.referees &&
                      item.game.referees.length > 0
                    }
                    entity={entity}
                  />
                );
              }
              return (
                <TCEventCard
                  onPress={() => onItemPress(item)}
                  data={item}
                  profileID={profileID}
                  screenUserId={screenUserId}
                  onThreeDotPress={() => onThreeDotPress(item)}
                  eventBetweenSection={item.game}
                  eventOfSection={
                    item.game &&
                    item.game.referees &&
                    item.game.referees.length > 0
                  }
                  entity={entity}
                />
              );
            }
            return null;
          }}
          renderSectionHeader={({section}) =>
            (section?.data || [])?.filter((obj) => obj.cal_type === 'event')
              .length > 0 && (
              <Text style={styles.sectionHeader}>
                {days[new Date(section.title).getDay()]}, {section.title}
              </Text>
            )
          }
          sections={filterData}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 20,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginBottom: 10,
    paddingLeft: 12,
    backgroundColor: colors.whiteColor,
    paddingTop: 10,
    paddingBottom: 10,
  },
  dataNotFoundText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.veryLightBlack,
    alignSelf: 'center',
  },
  noEventText: {
    fontSize: 20,
    fontFamily: fonts.RBold,
    color: colors.veryLightBlack,
    alignSelf: 'center',
  },
});
