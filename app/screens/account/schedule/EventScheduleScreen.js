import React, {useEffect, useState, useContext, useCallback} from 'react';
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
import {getJSDate, getTCDate} from '../../../utils';
import images from '../../../Constants/ImagePath';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function EventScheduleScreen({
  onItemPress = () => {},
  eventData = [],
  onThreeDotPress = () => {},
  entity = {},
  profileID,
  screenUserId,
  filterOptions = {},
  selectedFilter = {},
  owners = [],
  allUserData = [],
  timeSelectionOption = {},
  startDateTime = '',
  endDateTime = '',
}) {
  const authContext = useContext(AuthContext);
  const [filterData, setFilterData] = useState(null);

  const getDateTime = useCallback(
    (optionsState = strings.filterAntTime) => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setHours(0, 0, 0, 0);

      switch (optionsState) {
        case strings.filterAntTime:
          return null;

        case strings.filterToday:
          endDate.setMinutes(59);
          endDate.setHours(23);
          break;

        case strings.filterTomorrow:
          startDate.setHours(0, 0, 0, 0);
          startDate.setDate(startDate.getDate() + 1);
          endDate.setDate(endDate.getDate() + 2);
          break;

        case strings.filterNext7Day:
          endDate.setDate(endDate.getDate() + 7);
          break;

        case strings.filterThisMonth:
          endDate.setMonth(endDate.getMonth() + 1);
          endDate.setDate(0);
          endDate.setHours(0, 0, 0, 0);
          break;

        case strings.filterNextMonth:
          endDate.setMonth(endDate.getMonth() + 2);
          endDate.setDate(0);
          startDate.setMonth(endDate.getMonth());
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);
          break;

        case strings.filterYesterday:
          startDate.setHours(0, 0, 0, 0);
          startDate.setDate(startDate.getDate() - 1);

          break;

        case strings.filterLast7Day:
          startDate.setHours(0, 0, 0, 0);
          startDate.setDate(startDate.getDate() - 7);
          break;

        case strings.filterLastMonth:
          endDate.setMonth(endDate.getMonth());
          endDate.setDate(0);
          endDate.setHours(0, 0, 0, 0);
          startDate.setMonth(endDate.getMonth());
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);
          break;

        case strings.filterPickaDate:
          return {startDate: startDateTime, endDate: endDateTime};

        default:
          return null;
      }
      return {startDate, endDate};
    },
    [startDateTime, endDateTime],
  );

  const getEvents = useCallback(
    (optionsState = strings.filterAntTime, events = []) => {
      const dateTime = getDateTime(optionsState);

      if (dateTime === null) {
        if (filterOptions.time === 0) {
          return events.filter(
            (item) => new Date().getTime() <= getJSDate(item.start_datetime),
          );
        }
        if (filterOptions.time === 1) {
          return events.filter(
            (item) => new Date().getTime() >= getJSDate(item.start_datetime),
          );
        }
      }

      return events.filter(
        (item) =>
          dateTime.startDate <= getJSDate(item.start_datetime) &&
          dateTime.endDate >= getJSDate(item.end_datetime),
      );
    },
    [filterOptions.time, getDateTime],
  );

  const generateRandomImage = () => {
    const imageUrls = [
      {
        thumbnail: images.backgroudPlaceholder,
        full_image: images.backgroudFullImage,
      },
      {
        thumbnail: images.backgroudPlaceholder1,
        full_image: images.backgroudFullImage1,
      },
    ];
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    return imageUrls[randomIndex];
  };

  const setEventList = useCallback((eventList = []) => {
    if (eventList.length > 0) {
      const result = _(eventList)
        .groupBy((event) =>
          // event.start_datetime,
          moment(getJSDate(event.start_datetime)).format('MMM DD, YYYY'),
        )
        .value();

      const filData = [];
      const nextDateTime = getJSDate(getTCDate(new Date()) + 24 * 60 * 60);
      nextDateTime.setHours(0, 0, 0, 0);
      for (const property in result) {
        if (property) {
          let temp = {};
          const value = result[property];
          if (!value[0]?.background_thumbnail) {
            value[0].temp_background = generateRandomImage();
          }
          const start = getJSDate(result[property][0]?.start_datetime);
          start.setHours(0, 0, 0, 0);

          const currentDateTime = new Date();
          currentDateTime.setHours(0, 0, 0, 0);

          let title = `${
            days[getJSDate(result[property][0]?.start_datetime).getDay()]
          }, ${moment(getJSDate(result[property][0]?.start_datetime)).format(
            'MMM DD',
          )}`;

          if (start.getTime() === currentDateTime.getTime()) {
            title = strings.todayTitleText;
          }

          if (start.getTime() === nextDateTime.getTime()) {
            title = strings.tomorrowTitleText;
          }

          temp = {
            title,
            time:
              result[property].length > 0
                ? result[property][0]?.start_datetime
                : '',
            data: result[property].length > 0 ? value : [],
          };
          filData.push(temp);
        }
      }
      setFilterData([...filData]);
    } else {
      setFilterData([]);
    }
  }, []);

  useEffect(() => {
    let events = eventData.filter(
      (obj) => (obj.game_id && obj.game) || obj.title,
    );

    events = getEvents(timeSelectionOption, events);

    if (
      [
        Verbs.entityTypePlayer,
        Verbs.entityTypeUser,
        Verbs.entityTypeClub,
      ].includes(authContext.entity.role)
    ) {
      if (
        filterOptions.sort ===
          ([Verbs.entityTypeClub].includes(authContext.entity.role) ? -1 : 2) &&
        [Verbs.entityTypePlayer, Verbs.entityTypeUser].includes(
          authContext.entity.role,
        )
      ) {
        if (selectedFilter.title !== strings.all) {
          if (selectedFilter.title === strings.playingTitleText) {
            events = events.filter(
              (obj) =>
                obj?.game &&
                (obj?.game?.home_team?.user_id === authContext.entity.uid ||
                  obj?.game?.away_team?.user_id === authContext.entity.uid),
            );
          }
          if (selectedFilter.title === strings.refeeringText) {
            events = events.filter(
              (obj) => obj?.game && obj?.referee_id === authContext.entity.uid,
            );
          }
          if (selectedFilter.title === strings.scorekeeperingText) {
            events = events.filter(
              (obj) =>
                obj?.game && obj?.scorekeeper_id === authContext.entity.uid,
            );
          }
          if (selectedFilter.title === strings.othersText) {
            events = events.filter((obj) => !obj.game);
          }
        }
      } else if (
        filterOptions.sort ===
        ([Verbs.entityTypeClub].includes(authContext.entity.role) ? 2 : 3)
      ) {
        if (
          selectedFilter.title.sport !== strings.all &&
          selectedFilter.title !== strings.all
        ) {
          events = events.filter(
            (obj) =>
              (obj.game && obj.game.sport === selectedFilter.title.sport) ||
              (obj.selected_sport &&
                obj.selected_sport.sport === selectedFilter.title.sport),
          );
        }
      } else if (
        filterOptions.sort ===
        ([Verbs.entityTypeClub].includes(authContext.entity.role) ? 1 : 1)
      ) {
        if (
          selectedFilter.title.group_name !== strings.all &&
          selectedFilter.title !== strings.all
        ) {
          if (selectedFilter.title.group_name === Verbs.me) {
            events = events.filter(
              (obj) =>
                obj.created_by.uid === authContext.entity.uid ||
                obj.game?.home_team?.user_id === authContext.entity.uid ||
                obj.game?.away_team?.user_id === authContext.entity.uid,
            );
          } else if (selectedFilter.title.group_name === strings.othersText) {
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

    setEventList(events);
  }, [
    authContext.entity.uid,
    authContext.entity.role,
    filterOptions,
    eventData,
    selectedFilter,
    setEventList,
    timeSelectionOption,
    getEvents,
  ]);

  return (
    <>
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
            style={{backgroundColor: colors.whiteColor}}
            renderItem={({item}) => {
              if (item.cal_type === 'event') {
                if (item?.game_id && item?.game) {
                  return (
                    <View style={{backgroundColor: colors.whiteColor}}>
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
                    </View>
                  );
                }
                return (
                  <View style={{backgroundColor: colors.whiteColor}}>
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
                      owners={owners}
                      allUserData={allUserData}
                    />
                  </View>
                );
              }
              return null;
            }}
            renderSectionHeader={({section}) =>
              (section?.data || [])?.filter((obj) => obj.cal_type === 'event')
                .length > 0 && (
                <Text style={styles.sectionHeader}>
                  {section.title.toUpperCase()}
                </Text>
              )
            }
            sections={filterData}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </>
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
    paddingTop: 20,
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
