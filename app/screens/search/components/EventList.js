// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SectionList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import AuthContext from '../../../auth/context';
import {strings} from '../../../../Localization/translation';
import {
  filterEventForPrivacy,
  getEventOccuranceFromRule,
  getJSDate,
} from '../../../utils';
import TCEventCard from '../../../components/Schedule/TCEventCard';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

const EventList = ({
  list = [],
  isUpcoming = false,
  onScrollHandler = () => {},
  onScrollBeginDrag = () => {},
  onItemPress = () => {},
  filters = {},
  eventType = '',
  loading = false,
}) => {
  const [events, setEvents] = useState([]);
  const [owners, setOwners] = useState([]);
  const authContext = useContext(AuthContext);

  const getFilteredList = useCallback(
    async (eventList = []) => {
      let updatedList = [...eventList];

      if (eventList.length > 0) {
        if (eventType === strings.upcomingTitleText) {
          updatedList = updatedList.filter(
            (item) =>
              item.start_datetime >=
              Number(parseFloat(new Date().getTime() / 1000).toFixed(0)),
          );
        } else if (eventType === strings.completedTitleText) {
          updatedList = updatedList.filter(
            (item) =>
              item.end_datetime <=
              Number(parseFloat(new Date().getTime() / 1000).toFixed(0)),
          );
        }

        if (filters.location !== strings.worldTitleText) {
          updatedList = updatedList.filter((item) =>
            item.location.location_name.includes(
              filters.location.toLowerCase(),
            ),
          );
        }

        if (filters.sport !== strings.allSport) {
          updatedList = updatedList.filter(
            (item) =>
              item.selected_sport.sport === filters.sport.toLowerCase() &&
              item.selected_sport.sport_type ===
                filters.sport_type.toLowerCase(),
          );
        }

        if (filters?.searchText) {
          updatedList = updatedList.filter((item) =>
            item.title.includes(filters.searchText.toLowerCase()),
          );
        }

        if (filters.fromDateTime && filters.toDateTime) {
          updatedList = updatedList.filter(
            (item) =>
              item.start_datetime >= filters.fromDateTime &&
              item.start_datetime <= filters.toDateTime,
          );
        } else if (filters.fromDateTime && !filters?.toDateTime) {
          updatedList = updatedList.filter(
            (item) => item.start_datetime >= filters.fromDateTime,
          );
        } else if (!filters?.fromDateTime && filters.toDateTime) {
          updatedList = updatedList.filter(
            (item) => item.start_datetime <= filters.toDateTime,
          );
        } else {
          return eventList;
        }
      }

      return updatedList;
    },
    [
      filters?.fromDateTime,
      filters?.toDateTime,
      filters.location,
      filters.sport,
      filters.sport_type,
      filters?.searchText,
      eventType,
    ],
  );

  const getEvents = useCallback(
    async (eventList = []) => {
      const response = await filterEventForPrivacy({
        list: eventList,
        loggedInEntityId: authContext.entity.uid,
      });

      if (response.owners.length > 0) {
        setOwners(response.owners);
      }

      let validEventList = [];
      if (response.validEventList.length > 0) {
        validEventList = response.validEventList;
      }

      let finalList = [];
      validEventList.forEach((item) => {
        if (item?.rrule) {
          const rEvents = getEventOccuranceFromRule(item);
          finalList = [...finalList, ...rEvents];
        } else {
          finalList.push(item);
        }
      });

      const filteredList = await getFilteredList(finalList);

      const result = _(filteredList)
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
    [authContext.entity.uid, getFilteredList],
  );

  useEffect(() => {
    if (list.length > 0) {
      getEvents(list);
    }
  }, [list, getEvents]);

  const renderListEmptyComponent = () => {
    if (loading) {
      // Show loader if data is still loading
      return (
        <View
          style={{
            minHeight: Dimensions.get('window').height * 0.4,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={'small'} />
        </View>
      );
    }
    if (list.length === 0) {
      // Show "No event to show" text if there are no events
      return (
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
    }
    // If there are events and loading is false, render nothing as empty component
    return null;
  };

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
        onEndReached={onScrollHandler}
        onEndReachedThreshold={0.01}
        onScrollBeginDrag={onScrollBeginDrag}
        renderSectionFooter={() => <View style={{height: 20}} />}
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
    backgroundColor: colors.whiteColor,
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
