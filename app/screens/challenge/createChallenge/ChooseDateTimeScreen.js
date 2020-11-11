import React, {
  useEffect, useRef, useState, useLayoutEffect,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,

  FlatList,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import TimePicker from 'react-native-24h-timepicker';
import moment from 'moment';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import { blockedSlots } from '../../../api/Schedule';
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import UnavailableTimeView from '../../../components/challenge/UnavailableTimeView';
import TCDateTimePicker from '../../../components/TCDateTimePicker';

export default function ChooseDateTimeScreen({ navigation, route }) {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const daysNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // For activity indigator
  const [loading, setloading] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`);

  const [fromTime, setfromTime] = useState('00:00:00');
  const [toTime, setToTime] = useState('00:00:00');
  const [fromDate, setfromDate] = useState();
  const [toDate, setToDate] = useState();
  const [timePickerFor, setTimePickerFor] = useState();
  const [datePickerFor, setDatePickerFor] = useState();
  const [filteredData, setFilterdData] = useState();

  const [slots, setSlots] = useState();
  const [marked, setMarked] = useState();
  const isFocused = useIsFocused();
  const timePicker = useRef();

  useEffect(() => {
    getSlots();
  }, [isFocused]);
  useLayoutEffect(() => {}, [selectedDate]);

  const onConfirm = (hour, minute) => {
    console.log('HHMM', hour, minute);
    const hr = hour < 10 ? `0${hour}` : hour

    if (timePickerFor === 'from') {
      const str = `${hr}:${minute}:00`;
      console.log('DONE FROM TIME::', str);
      setfromTime(str);
    } else {
      const str = `${hr}:${minute}:00`;
      console.log('DONE TO TIME::', str);
      setToTime(str);
    }
    timePicker.current.close();
  };

  const tConvert = (timeString) => {
    const timeString12hr = new Date(
      `1970-01-01T${timeString}Z`,
    ).toLocaleTimeString(
      {},
      {
        timeZone: 'UTC',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
      },
    );
    return timeString12hr;
  };

  const getSlots = () => {
    setloading(true);
    blockedSlots(route.params.otherTeam.group_id)
      .then((response) => {
        setloading(false);
        setSlots(response.payload);
        console.log('BOOKED SLOT::', response.payload);

        const alldayBlocked = response.payload.filter((item) => item.allDay === true)
        const markedDates = {};
        // eslint-disable-next-line array-callback-return
        alldayBlocked.map((e) => {
          const todate = new Date(e.start_datetime * 1000).getDate();
          const tomonth = new Date(e.start_datetime * 1000).getMonth() + 1;
          const toyear = new Date(e.start_datetime * 1000).getFullYear();
          const original_date = `${toyear}-${tomonth}-${todate}`;
          markedDates[original_date] = {
            disabled: true,
            startingDay: true,
            endingDay: true,
            color: colors.lightgrayColor,
            customStyles: {
              container: {
                backgroundColor: colors.lightgrayColor,
              },
              text: {
                color: colors.grayColor,

              },
            },
          };
          console.log('BLOCKED::', markedDates);
        })
        setMarked(markedDates);
      })
      .catch((error) => {
        Alert.alert(error.messages);
      });
  };

  const getSelectedDayEvents = (date) => {
    const markedDates = { ...marked };
    console.log('MARKED::', Object.keys(markedDates));

    Object.keys(markedDates).forEach((e) => {
      if (markedDates[e].selected && markedDates[e].disabled) {
        markedDates[e].selected = false
      } else if (markedDates[e].selected) {
        delete markedDates[e]
      }
    });
    if (markedDates[date]) {
      markedDates[date].selected = true
    } else {
      markedDates[date] = { selected: true };
    }

    setMarked(markedDates);

    console.log('MARKED DATES::', markedDates);
  };

  const handleDonePress = ({ date }) => {
    setShow(!show);
    if (datePickerFor === 'from') {
      const str = date;
      setfromDate(str);
    } else {
      const str = date;
      setToDate(str);
    }
    filterSlots(fromDate)
  };
  const handleCancelPress = () => {
    setShow(!show);
  };

  const filterSlots = (startDate) => {
    const resultProductData = slots.filter((a) => {
      console.log('AA data', new Date(a.start_datetime * 1000))
      return (new Date(a.start_datetime * 1000).getDate() === new Date(startDate).getDate()
      && new Date(a.start_datetime * 1000).getMonth() === new Date(startDate).getMonth()
      && new Date(a.start_datetime * 1000).getFullYear() === new Date(startDate).getFullYear());
    });
    console.log('filtered data', resultProductData)
    setFilterdData(resultProductData)
  }
  return (
    <>
      <ScrollView>
        <ActivityLoader visible={loading} />
        <SafeAreaView>
          <Calendar
            theme={{
              todayTextColor: colors.themeColor,
              textSectionTitleDisabledColor: '#d9e1e8',
              selectedDayTextColor: colors.whiteColor,
              selectedDayBackgroundColor: colors.themeColor,
              textDisabledColor: colors.grayColor,
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              arrowColor: colors.grayColor,
              disabledArrowColor: '#d9e1e8',

              monthTextColor: colors.themeColor,
              indicatorColor: colors.themeColor,
              textDayFontFamily: fonts.RLight,

              textDayHeaderFontFamily: fonts.RMedium,
              textDayHeaderFontSize: 12,
              dayTextColor: colors.lightBlackColor,
              textDayFontSize: 18,
              textMonthFontFamily: fonts.RMedium,
              textMonthFontWeight: 'bold',
              textMonthFontSize: 16,
            }}
            hideExtraDays={true}
            onDayPress={(day) => {
              setfromDate();
              setToDate();
              setSelectedDate(day.dateString);
              getSelectedDayEvents(day.dateString);
              filterSlots(selectedDate)
              console.log('selected day', day);
            }}
            markedDates={marked}
            // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
            markingType={'custom'}
            style={{
              shadowColor: colors.grayColor,
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 1,
            }}
          />

          {/* <SectionList
            sections={[
              {
                title: 'Tue, 17 Feb',
                data: ['ALTERED', 'ABBY', 'ACTION U.S.A.', 'AMUCK', 'ANGUISH'],
              },
              {
                title: 'Tue, 18 Feb',
                data: [
                  'BEST MEN',
                  'BEYOND JUSTICE',
                  'BLACK GUNN',
                  'BLOOD RANCH',
                  'BEASTIES',
                ],
              },
              {
                title: 'Tue, 19 Feb',
                data: [
                  'CARTEL',
                  'CASTLE OF EVIL',
                  'CHANCE',
                  'COP GAME',
                  'CROSS FIRE',
                ],
              },
            ]}
            renderItem={({ item }) => <UnavailableTimeView />}
            renderSectionHeader={({ section }) => (
              <Text style={styles.dateHeader}>{section.title}</Text>
            )}
            keyExtractor={(item, index) => index}
          /> */}
          {/* <Text style={styles.dateHeader}>Tue, 17 Feb</Text>
        <UnavailableTimeView/>
        <UnavailableTimeView/>
        <UnavailableTimeView/>

        <Text style={styles.dateHeader}>Tue, 19 Feb</Text>
        <UnavailableTimeView/> */}
          {filteredData && <Text style={styles.dateHeader}>{daysNames[new Date(selectedDate).getDay()]}, {new Date(selectedDate).getDate()} {monthNames[new Date(selectedDate).getMonth()]}</Text>}
          <FlatList
         data={filteredData}
         renderItem={({ item }) => <UnavailableTimeView startDate={item.start_datetime} endDate={item.end_datetime}/>}
         keyExtractor={(item, index) => index.toString()}
          />
          <View style={{ marginLeft: 15, marginRight: 15, marginTop: 20 }}>
            <View style={styles.fieldView}>
              <View
                style={{
                  flex: 0.4,
                  height: 35,
                  justifyContent: 'center',
                }}>
                <Text style={styles.fieldTitle} numberOfLines={1}>
                  From
                </Text>
              </View>
              <View style={{ flex: 0.6, flexDirection: 'row' }}>
                {fromDate ? (
                  <Text
                    style={styles.fieldValue}
                    numberOfLines={3}
                    onPress={() => {
                      setDatePickerFor('from');
                      setShow(!show);
                    }}>
                    {monthNames[new Date(fromDate).getMonth()]}{' '}
                    {new Date(fromDate).getDate()} ,
                    {new Date(fromDate).getFullYear()}
                  </Text>
                ) : (
                  <Text
                    style={styles.fieldValue}
                    numberOfLines={3}
                    onPress={() => {
                      setDatePickerFor('from');
                      setShow(!show);
                    }}>
                    {monthNames[new Date(selectedDate).getMonth()]}{' '}
                    {new Date(selectedDate).getDate()} ,
                    {new Date(selectedDate).getFullYear()}
                  </Text>
                )}
                <Text
                  style={styles.timeValue}
                  onPress={() => {
                    setTimePickerFor('from');
                    timePicker.current.open();
                  }}>
                  {'   '}
                  {tConvert(fromTime)}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginLeft: 15, marginRight: 15 }}>
            <View style={styles.fieldView}>
              <View
                style={{
                  flex: 0.4,
                  height: 35,
                  justifyContent: 'center',
                }}>
                <Text style={styles.fieldTitle} numberOfLines={1}>
                  To
                </Text>
              </View>
              <View style={{ flex: 0.6, flexDirection: 'row' }}>
                {toDate ? (
                  <Text
                    style={styles.fieldValue}
                    numberOfLines={3}
                    onPress={() => {
                      setDatePickerFor('to');
                      setShow(!show);
                    }}>
                    {monthNames[new Date(toDate).getMonth()]}{' '}
                    {new Date(toDate).getDate()} ,
                    {new Date(toDate).getFullYear()}
                  </Text>
                ) : (
                  <Text
                    style={styles.fieldValue}
                    numberOfLines={3}
                    onPress={() => {
                      setDatePickerFor('to');
                      setShow(!show);
                    }}>
                    {monthNames[new Date(selectedDate).getMonth()]}{' '}
                    {new Date(selectedDate).getDate()} ,
                    {new Date(selectedDate).getFullYear()}
                  </Text>
                )}
                <Text
                  style={styles.timeValue}
                  onPress={() => {
                    setTimePickerFor('to');
                    timePicker.current.open();
                  }}>{'   '}
                  {tConvert(toTime)}
                </Text>
              </View>
            </View>
          </View>
          <TimePicker
            ref={timePicker}
            onCancel={() => timePicker.current.close()}
            onConfirm={(hour, minute) => onConfirm(hour, minute)}
            minuteInterval={5}
            minuteUnit={' min'}
          />
          <TCDateTimePicker
            title={'Choose Date'}
            visible={show}
            onDone={handleDonePress}
            onCancel={handleCancelPress}
          />
          <View style={{ flex: 1 }}></View>
        </SafeAreaView>
      </ScrollView>

      <TCGradientButton
        title={strings.applyTitle}
        onPress={() => {
          const fromStr = fromDate || selectedDate
          const toStr = toDate || selectedDate
          const fromStamp = moment(`${fromStr} ${fromTime}`).format('YYYY-MM-DDTHH:mm:ss');
          const toStamp = moment(`${toStr} ${toTime}`).format('YYYY-MM-DDTHH:mm:ss');

          console.log('FROM-TO D/T:', `${new Date(fromStamp).getHours()}:${new Date(
            fromStamp,
          ).getMinutes()}:${new Date(
            fromStamp,
          ).getSeconds()}`);

          navigation.navigate('CreateChallengeForm1', { from: `${new Date(moment(fromStamp).utcOffset(0))}`, to: `${new Date(moment(toStamp).utcOffset(0))}` })
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fieldView: {
    flexDirection: 'row',
    marginTop: 10,
    height: 35,
    alignItems: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 1,
  },
  fieldTitle: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    marginLeft: 10,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    textAlign: 'center',
  },
  timeValue: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  dateHeader: {
    marginTop: 15,
    marginLeft: 15,
    fontFamily: fonts.RMedium,
    fontSize: 25,
    color: colors.themeColor,
  },
});
