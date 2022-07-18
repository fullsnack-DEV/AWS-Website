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
  StyleSheet,
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import EventAgendaSection from '../../../components/Schedule/EventAgendaSection';
import AuthContext from '../../../auth/context';
import * as Utility from '../../../utils/index';

import strings from '../../../Constants/String';

import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';
import ScheduleBlockedItems from '../../../components/Schedule/ScheduleBlockedItems';

let selectedDayMarking = {};
export default function ChooseTimeSlotScreen({navigation, route}) {
  const [settingObject] = useState(route?.params?.settingObject);
  const [comeFrom] = useState(route?.params?.comeFrom);
  console.log('settingObject :=>', settingObject);
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);

  const [showTimeTable, setShowTimeTable] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [listView, setListView] = useState(true);
  const [markingDays, setMarkingDays] = useState({});
  const [slots, setSlots] = useState();
  const [selectedSlot, setselectedSlot] = useState();
  const [availableSlot, setAvailavbleSlot] = useState();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();

  const [fromPickerVisible, setFromPickerVisible] = useState(false);
  const [toPickerVisible, setToPickerVisible] = useState(false);

  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();

  useEffect(() => {
    // selectedDayMarking[moment(new Date()).format('yyyy-MM-DD')] = {
    //   selected: true,
    // };
    // console.log('temp mark:', selectedDayMarking);
    // setMarkingDays(selectedDayMarking);

    if (settingObject?.sport?.toLowerCase() === 'tennis') {
      console.log('dsfsdfsadfasdf', settingObject);
      setHours(
        Utility.getHoursMinutesFromString(
          settingObject?.score_rules?.match_duration,
        ).hour,
      );
      setMinutes(
        Utility.getHoursMinutesFromString(
          settingObject?.score_rules?.match_duration,
        ).minute,
      );
    } else {
      setHours(settingObject?.game_duration?.totalHours);
      setMinutes(settingObject?.game_duration?.totalMinutes);
    }

    const dateObject = {
      dateString: moment(new Date()).format('YYYY-MM-DD'),
    };
    onDayPress(dateObject);
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
            if (from > to) {
              Alert.alert(
                strings.alertmessagetitle,
                'Please choose valid time slot.',
              );
            } else if (new Date(from).getTime() < new Date().getTime()) {
              Alert.alert(
                strings.alertmessagetitle,
                'Please choose future time for challenge.',
              );
            } else if (!selectedSlot) {
              console.log('selected slot', selectedSlot);
              Alert.alert(
                strings.alertmessagetitle,
                'Please choose time slot from the list.',
              );
            } else {
              navigation.navigate(comeFrom, {startTime: from, endTime: to});
            }
          }}
        >
          Save
        </Text>
      ),
    });
  }, [comeFrom, from, navigation, selectedSlot, to, hours, minutes]);

  const getBlockedSlots = () => {
    // setloading(true);

    // blockedSlots(
    //   authContext?.entity?.obj?.entity_type === 'player' ? 'users' : 'groups',
    //   authContext?.entity?.obj?.group_id || authContext?.entity?.obj?.user_id,
    //   authContext,
    // )
    Utility.getCalendar(
      authContext?.entity?.obj?.group_id || authContext?.entity?.obj?.user_id,
      new Date().getTime() / 1000,
    ).then((response) => {
      setloading(false);
      const bookSlots = response;
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

      console.log('Groups:=>', group);
      // eslint-disable-next-line array-callback-return
      (bookSlots || []).map((e) => {
        const original_date = moment(new Date(e.start_datetime * 1000)).format(
          'yyyy-MM-DD',
        );
        if (e.allDay === true) {
          markedDates[original_date] = {
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
        setMarkingDays({...markedDates, ...selectedDayMarking});
        console.log('BLOCKED::', markedDates);
      });

      console.log('Marked dates::', JSON.stringify(markedDates));
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
    console.log('dateObj onDayPress', dateObj);
    setFrom();
    setTo();

    getFreeslot(new Date(dateObj.dateString), minutes * 60 + hours * 60 * 60);

    console.log('Date string:=>', dateObj.dateString);
    getSelectedDayEvents(dateObj.dateString);

    const temp = [];
    (slots || []).map((e) => {
      if (
        getSimpleDateFormat(new Date(e.start_datetime)) ===
        getSimpleDateFormat(new Date(dateObj.dateString))
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

  const getFreeslot = (selectdate, slotTime) => {
    const date = new Date(selectdate);
    date.setHours(0, 0, 0, 0);
    let starttime = Math.round(date.getTime() / 1000);
    date.setHours(23, 59, 59, 0);
    const endtime = Math.round(date.getTime() / 1000);

    console.log('Start/End time:=>', starttime, endtime);

    let blockedSlot = (slots || []).filter(
      (slot) =>
        slot.blocked === true &&
        ((slot.start_datetime >= starttime && slot.start_datetime <= endtime) ||
          (slot.end_datetime >= starttime && slot.end_datetime <= endtime)),
    );

    blockedSlot = blockedSlot.map((calendar) => ({
      starttime: calendar.start_datetime,
      endtime: calendar.end_datetime,
    }));
    console.log('Blocked Slots:=>', blockedSlot);
    // eslint-disable-next-line no-undef
    // blockedSlot = _.orderBy(blockedSlot, 'starttime', 'asc')

    // blockedSlot = blockedSlot.sort((b, a) => new Date(b.starttime) - new Date(a.starttime));
    const freeslot = [];

    blockedSlot.forEach((slot) => {
      if (starttime < slot.starttime) {
        const startDateTime = starttime;
        const endDateTime = slot.starttime - 60;
        const diff = endDateTime - startDateTime;
        if (diff > 60) {
          freeslot.push({starttime: startDateTime, endtime: endDateTime, diff});
        }
        starttime = slot.endtime + 60;
      } else if (starttime < slot.endtime) {
        starttime = slot.endtime + 60;
      }
    });

    const diff = endtime - starttime;

    if (diff > 60) {
      freeslot.push({starttime, endtime, diff});
    }

    const getSlot = (freeslot || []).filter((slot) => slot.diff > slotTime);

    console.log('Free slot:=>', getSlot);
    setAvailavbleSlot(getSlot);
    // return freeslot
  };

  const renderSlotsList = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        console.log('selected:=> ', item);
        setselectedSlot(item);
        const date = new Date();

        if (item.starttime * 1000 < date.getTime()) {
          setFrom(date.setMinutes(date.getMinutes() + 5));
          const dt = new Date(date.getTime());
          dt.setHours(dt.getHours() + hours);
          dt.setMinutes(dt.getMinutes() + minutes);

          setTo(dt.getTime());
        } else {
          setFrom(item.starttime * 1000);
          const dt = new Date(item.starttime * 1000);
          dt.setHours(dt.getHours() + hours);
          dt.setMinutes(dt.getMinutes() + minutes);

          setTo(dt.getTime());
        }
      }}
    >
      <ScheduleBlockedItems
        startDate={item.starttime}
        endDate={item.endtime}
        allDay={item.allDay}
        selected={selectedSlot === item}
      />
    </TouchableOpacity>
  );
  const handleCancelPress = () => {
    setFromPickerVisible(false);
    setToPickerVisible(false);
  };

  const onFromDone = (date) => {
    setFromPickerVisible(false);
    setFrom(date.getTime());

    const dt = date;
    dt.setHours(dt.getHours() + hours);
    dt.setMinutes(dt.getMinutes() + minutes);

    setTo(dt.getTime());
  };

  const onToDone = (date) => {
    setToPickerVisible(false);
    console.log('To Date:=>', date);
    setTo(date.getTime());

    const dt = date;
    dt.setHours(dt.getHours() - hours);
    dt.setMinutes(dt.getMinutes() - minutes);

    setFrom(dt.getTime());
  };

  const maxFromDate = () => {
    const dt = new Date(selectedSlot?.endtime * 1000);
    dt.setHours(dt.getHours() - hours);
    dt.setMinutes(dt.getMinutes() - minutes);

    console.log('Date max:=>', dt);
    return dt;
  };

  const minToDate = () => {
    const dt = new Date();
    dt.setHours(dt.getHours() + hours);
    dt.setMinutes(dt.getMinutes() + minutes);

    console.log('Date min to:=>', dt);
    return dt;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{marginTop: 15, flex: 1}}>
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
        <ScrollView style={{flex: 1}}>
          <Text style={styles.slotHeader}>Available Time Zone</Text>
          {/* <SectionList
          sections={blockedGroups}
          renderItem={({ item }) => (
            <ScheduleBlockedItems
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
        /> */}
          <FlatList
            data={availableSlot}
            keyExtractor={(index) => index.toString()}
            renderItem={renderSlotsList}
            ItemSeparatorComponent={() => (
              <View style={styles.separatorLine}></View>
            )}
            style={{marginTop: 10, marginBottom: 10}}
          />

          <Text style={[styles.slotHeader, {marginBottom: 10}]}>
            Choose The Game Time
          </Text>
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <TouchableOpacity
              style={styles.fieldView}
              onPress={() => {
                if (from) {
                  setFromPickerVisible(!fromPickerVisible);
                } else {
                  Alert.alert('Please choose available time zone first.');
                }
              }}
            >
              <View
                style={{
                  height: 35,
                  justifyContent: 'center',
                }}
              >
                <Text style={styles.fieldTitle} numberOfLines={1}>
                  From
                </Text>
              </View>
              <View style={{marginRight: 15, flexDirection: 'row'}}>
                <Text style={styles.fieldValue} numberOfLines={1}>
                  {from
                    ? moment(new Date(from)).format('MMM DD, yyyy hh:mm a')
                    : ''}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <TouchableOpacity
              style={styles.fieldView}
              onPress={() => {
                if (to) {
                  setToPickerVisible(!toPickerVisible);
                } else {
                  Alert.alert('Please choose available time zone first.');
                }
              }}
            >
              <View
                style={{
                  height: 35,
                  justifyContent: 'center',
                }}
              >
                <Text style={styles.fieldTitle} numberOfLines={1}>
                  To
                </Text>
              </View>
              <View style={{marginRight: 15, flexDirection: 'row'}}>
                <Text style={styles.fieldValue} numberOfLines={1}>
                  {to
                    ? moment(new Date(to)).format('MMM DD, yyyy hh:mm a')
                    : ''}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.lightBlackColor,
              }}
            >
              Total Game Duration
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.themeColor,
              }}
            >{`${hours} Hours ${minutes} Minutes`}</Text>
          </View>
          <DateTimePickerView
            title={'Choose a Time'}
            date={new Date(from)}
            visible={fromPickerVisible}
            onDone={onFromDone}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            minimumDate={new Date()} //
            maximumDate={maxFromDate()}
            // minutesGap={5}
            mode={'time'}
          />
          <DateTimePickerView
            title={'Choose a Time'}
            date={new Date(to)}
            visible={toPickerVisible}
            onDone={onToDone}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            minimumDate={minToDate()}
            maximumDate={new Date(selectedSlot?.endtime * 1000)}
            // minutesGap={5}
            mode={'time'}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 8,
  },
  fieldView: {
    flexDirection: 'row',
    width: '92%',
    justifyContent: 'space-between',
    marginLeft: 15,
    height: 40,
    alignItems: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
  },
  fieldTitle: {
    fontSize: 16,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RLight,
    marginLeft: 10,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    textAlign: 'center',
  },
});
