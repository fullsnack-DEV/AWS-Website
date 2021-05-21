/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */

/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {
 StyleSheet, View, Text, Alert, SectionList,
 } from 'react-native';
import moment from 'moment';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import EventAgendaSection from '../../../components/Schedule/EventAgendaSection';
import AuthContext from '../../../auth/context';
import { blockedSlots } from '../../../api/Schedule';

import strings from '../../../Constants/String';

import BlockSlotView from '../../../components/Schedule/BlockSlotView';

let selectedDayMarking = {};
export default function ChooseTimeSlotScreen({ navigation }) {
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);

  const [showTimeTable, setShowTimeTable] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [listView, setListView] = useState(true);
  const [markingDays, setMarkingDays] = useState({});
  const [slots, setSlots] = useState();

  const [blockedGroups, setBlockedGroups] = useState([]);

  useEffect(() => {
    selectedDayMarking[moment(new Date()).format('yyyy-MM-DD')] = {
      selected: true,
    };
    console.log('temp mark:', selectedDayMarking);
    setMarkingDays(selectedDayMarking);
    getBlockedSlots();
  }, []);

  const getSimpleDateFormat = (dateValue) => {
    moment.locale('en');
    return moment(new Date(dateValue)).format('yy/MM/DD');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => {
            navigation.navigate('ManageChallengeScreen');
          }}>
          Save
        </Text>
      ),
    });
  }, [navigation]);

  const getBlockedSlots = () => {
    setloading(true);

    blockedSlots(
      authContext?.entity?.obj?.entity_type === 'player' ? 'users' : 'groups',
      authContext?.entity?.obj?.group_id || authContext?.entity?.obj?.user_id,
      authContext,
    )
      .then((response) => {
        console.table(response.payload);
        setloading(false);
        const bookSlots = response.payload;
        setSlots(bookSlots);

        const markedDates = {};

        const group = bookSlots.reduce((groups, data) => {
          const title = moment(new Date(data.start_datetime * 1000)).format(
            'yyyy-MM-DD',
          );
          if (!groups[title]) {
            groups[title] = [];
          }
          groups[title].push(data);
          return groups;
        }, {});
        const groupArrays = Object.keys(group).map((date) => ({
          title: date,
          data: group[date],
        }));

        setBlockedGroups(
          groupArrays.sort((b, a) => new Date(b.title) - new Date(a.title)),
        );
        console.log('Groups:=>', group);
        // eslint-disable-next-line array-callback-return
        (bookSlots || []).map((e) => {
          const original_date = moment(
            new Date(e.start_datetime * 1000),
          ).format('yyyy-MM-DD');
          if (e.allDay === true) {
            markedDates['2021-05-22'] = {
              disabled: true,
              startingDay: true,
              endingDay: true,
              disableTouchEvent: true,
              customStyles: {
                container: {
                  backgroundColor: colors.lightgrayColor,
                },
                text: {
                  color: colors.grayColor,
                },
              },
            };
          } else {
            markedDates[original_date] = {
              marked: true,
              dotColor: colors.themeColor,
              activeOpacity: 1,
            };
          }
          setMarkingDays({ ...markedDates, ...selectedDayMarking });
          console.log('BLOCKED::', markedDates);
        });

        console.log('Marked dates::', JSON.stringify(markedDates));
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const onPressListView = useCallback((value, buttonIndex) => {
    console.log('List view Pressed:=>', value, buttonIndex);
    if (buttonIndex === 2) {
      setListView(value);
    } else if (buttonIndex === 1) {
      setShowTimeTable(value);
      // setMonthView(true)
    } else if (buttonIndex === 0) {
      setIsMenu(value);
      console.log('menu:=>', buttonIndex);
    }
  }, []);

  const onPressGridView = useCallback((value, buttonIndex) => {
    console.log('Grid view Pressed:=>', value, buttonIndex);
    if (buttonIndex === 2) {
      setListView(value);
    } else if (buttonIndex === 1) {
      setShowTimeTable(value);
      // setMonthView(false)
    } else if (buttonIndex === 0) {
      setIsMenu(value);
      console.log('menu:=>', buttonIndex);
    }
  }, []);

  const getSelectedDayEvents = useCallback((date) => {
    selectedDayMarking = {};
    selectedDayMarking[date] = {
      selected: true,
    };

    // const markedDates = { ...markingDays };

    // Object.keys(markedDates).forEach((e) => {
    //   if (markedDates[e].selected) {
    //     markedDates[e].selected = false;
    //   } else if (markedDates[e].selected) {
    //     if (!markedDates[e].event) {
    //       markedDates[e].selected = false;
    //       delete markedDates[e];
    //     }
    //   }
    // });

    setMarkingDays(selectedDayMarking);

    console.log('MARKED DATES::', selectedDayMarking);
  }, []);

  const onDayPress = (dateObj) => {
    console.log('Date string:=>', dateObj.dateString);
    getSelectedDayEvents(dateObj.dateString);

    const temp = [];
    (slots || []).map((e) => {
      if (
        getSimpleDateFormat(new Date(e.start_datetime))
        === getSimpleDateFormat(new Date(dateObj.dateString))
      ) {
        temp.push(e);
      }
    });

    return null;
  };

  const onKnobPress = () => {
    console.log('Knob press');
    setShowTimeTable(!showTimeTable);
    setListView(!listView);
  };

  // const getFreeslot = (calendars) => {
  //   const date = new Date()
  //   date.setHours(0, 0, 0, 0)
  //   let starttime = Math.round((date.getTime()) / 1000) + (2 * 24 * 3600)
  //   date.setHours(23, 59, 59, 0)
  //   const endtime = Math.round((date.getTime()) / 1000) + (2 * 24 * 3600)

  //   let blockedSlots = calendars.filter((slot) => (slot.blocked === true
  //   && ((slot.start_datetime >= starttime && slot.start_datetime <= endtime)
  //   || (slot.end_datetime >= starttime && slot.end_datetime <= endtime))))
  //   blockedSlots = blockedSlots.map((calendar) => ({
  //   starttime: calendar.start_datetime,
  //   endtime: calendar.end_datetime,
  //   }))
  //   // eslint-disable-next-line no-undef
  //   blockedSlots = _.orderBy(blockedSlots, 'starttime', 'asc')

  //   const freeslot = []

  //   blockedSlots.forEach((slot) => {
  //   if (starttime < slot.starttime) {
  //   const startDateTime = starttime
  //   const endDateTime = slot.starttime - 60
  //   const diff = endDateTime - startDateTime
  //   if (diff > 60) {
  //   freeslot.push({ starttime: startDateTime, endtime: endDateTime, diff })
  //   }
  //   starttime = slot.endtime + 60
  //   } else if (starttime < slot.endtime) {
  //   starttime = slot.endtime + 60
  //   }
  //   })

  //   const diff = endtime - starttime

  //   if (diff > 60) {
  //   freeslot.push({ starttime, endtime, diff })
  //   }

  //   return freeslot
  //  }

  return (
    <View style={{ marginTop: 15 }}>
      <ActivityLoader visible={loading} />
      <EventAgendaSection
        onKnobPress={onKnobPress}
        showTimeTable={showTimeTable}
        isMenu={isMenu}
        horizontal={!listView}
        onPressListView={onPressListView}
        onPressGridView={onPressGridView}
        onDayPress={onDayPress}
        // selectedCalendarDate={selectedCalendarDateString}
        calendarMarkedDates={markingDays}
      />
      <View>
        <Text style={styles.slotHeader}>Available Time Zone</Text>
        <SectionList
          sections={blockedGroups}
          renderItem={({ item }) => (
            <BlockSlotView
              startDate={item.start_datetime}
              endDate={item.end_datetime}
              allDay={item.allDay}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>
              {moment(new Date(title)).format('dddd, MMM DD, YYYY')}
            </Text>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 8,
    marginTop: 8,
  },

  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },
  slotHeader: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
});
