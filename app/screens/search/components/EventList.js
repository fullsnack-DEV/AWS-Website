// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  SectionList,
  Dimensions,
} from 'react-native';
import {RRule} from 'rrule';
import moment from 'moment';
import _ from 'lodash';
import Verbs from '../../../Constants/Verbs';
import AuthContext from '../../../auth/context';
import {getGroupIndex, getUserIndex} from '../../../api/elasticSearch';
import {strings} from '../../../../Localization/translation';
import {getJSDate, getTCDate} from '../../../utils';
import TCEventCard from '../../../components/Schedule/TCEventCard';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

const EventList = ({
  list = [],
  loading = false,
  isUpcoming = false,
  fetchData = () => {},
  onItemPress = () => {},
  refreshData = () => {},
}) => {
  const [events, setEvents] = useState([]);
  const [owners, setOwners] = useState([]);
  const authContext = useContext(AuthContext);

  const getEventOccuranceFromRule = (event) => {
    const ruleObj = RRule.parseString(event.rrule);
    ruleObj.dtstart = getJSDate(event.start_datetime);
    ruleObj.until = getJSDate(event.untilDate);
    const rule = new RRule(ruleObj);
    const duration = event.end_datetime - event.start_datetime;
    let occr = rule.all();
    if (event.exclusion_dates) {
      // _.remove(occr, function (date) {
      //   return event.exclusion_dates.includes(Utility.getTCDate(date))
      // })
      occr = occr.filter(
        (date) => !event.exclusion_dates.includes(getTCDate(date)),
      );
    }
    occr = occr.map((RRItem) => {
      // console.log('Item', Math.round(new Date(RRItem) / 1000))
      const newEvent = {...event};
      newEvent.start_datetime = getTCDate(RRItem);
      newEvent.end_datetime = newEvent.start_datetime + duration;
      //   RRItem = newEvent;
      return newEvent;
    });
    return occr;
  };

  const getEvents = useCallback(
    (eventList = []) => {
      const filteredList = eventList.filter(
        (item) => item.cal_type === Verbs.eventVerb,
      );
      const validEventList = [];
      const groupIds = [];
      const userIds = [];

      filteredList.forEach((event) => {
        if (
          event.who_can_see?.value === 0 ||
          event.owner_id === authContext.entity.uid
        ) {
          validEventList.push(event);
          if (
            event.created_by.group_id &&
            !groupIds.includes(event.created_by.group_id)
          ) {
            groupIds.push(event.created_by.group_id);
          } else if (!userIds.includes(event.created_by.uid)) {
            userIds.push(event.created_by.uid);
          }
        }
      });
      const getUserDetailQuery = {
        size: 1000,
        from: 0,
        query: {
          terms: {
            'user_id.keyword': [...userIds],
          },
        },
      };
      const getGroupDetailQuery = {
        size: 1000,
        from: 0,
        query: {
          terms: {
            'group_id.keyword': [...groupIds],
          },
        },
      };

      const promiseArr = [
        getUserIndex(getUserDetailQuery),
        getGroupIndex(getGroupDetailQuery),
      ];
      Promise.all(promiseArr)
        .then((res) => {
          const result = [...res[0], ...res[1]];
          setOwners(result);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });

      let finalList = [];
      validEventList.forEach((item) => {
        if (item?.rrule) {
          const rEvents = getEventOccuranceFromRule(item);
          finalList = [...finalList, ...rEvents];
        } else {
          filteredList.push(item);
        }
      });

      const result = _(finalList)
        .groupBy((event) =>
          moment(getJSDate(event.start_datetime)).format('MMM DD, YYYY'),
        )
        .value();
      const keys = Object.keys(result);

      const finalEventList = keys.map((key) => ({
        title: key,
        data: result[key],
      }));
      setEvents(finalEventList);
    },
    [authContext.entity.uid],
  );

  useEffect(() => {
    if (list.length > 0) {
      getEvents(list);
    }
  }, [list, getEvents]);

  const renderListEmptyComponent = () => (
    <View
      style={{
        minHeight: Dimensions.get('window').height * 0.4,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={styles.noEventText}>
        {isUpcoming
          ? strings.noUpcomingEventToShow
          : strings.noCompletedEventToShow}
      </Text>
      <Text style={styles.dataNotFoundText}>
        {isUpcoming
          ? strings.newEventWillAppearHereText
          : strings.newCompletedEventOccurHere}
      </Text>
    </View>
  );

  const renderSectionHeader = ({section: {title}}) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title.toUpperCase()}</Text>
    </View>
  );

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <TCEventCard
        onPress={() => onItemPress(item)}
        data={item}
        profileID={authContext.entity.uid}
        //   onThreeDotPress={() => onThreeDotPress(item)}
        eventBetweenSection={item.game}
        eventOfSection={
          item.game && item.game.referees && item.game.referees.length > 0
        }
        entity={authContext.entity}
        owners={owners}
        allUserData={owners}
      />
    </View>
  );

  return (
    <View style={styles.parent}>
      <SectionList
        sections={events}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: colors.whiteColor}}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={renderListEmptyComponent}
        refreshing={loading}
        onRefresh={refreshData}
        onEndReachedThreshold={0.01}
        onEndReached={fetchData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {},
  item: {
    backgroundColor: colors.whiteColor,
    marginHorizontal: 15,
  },
  sectionHeader: {
    paddingLeft: 15,
    marginBottom: 10,
    marginTop: 20,
  },
  sectionHeaderText: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  dataNotFoundText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.veryLightBlack,
    alignSelf: 'center',
  },
  noEventText: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RBold,
    color: colors.veryLightBlack,
    alignSelf: 'center',
  },
});
export default EventList;
