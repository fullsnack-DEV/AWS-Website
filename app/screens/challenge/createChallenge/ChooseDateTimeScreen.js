/* eslint-disable array-callback-return */
import React, {
  useEffect, useState, useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import AuthContext from '../../../auth/context';
import { blockedSlots } from '../../../api/Schedule';
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import UnavailableTimeView from '../../../components/challenge/UnavailableTimeView';
import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';

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
  const getNearDateTime = (date) => {
    const start = moment(date);
    const nearTime = 30 - (start.minute() % 30);
    const dateTime = moment(start).add(nearTime, 'm').toDate()
    return dateTime;
  };
  const daysNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const authContext = useContext(AuthContext);
  // For activity indigator
  const [loading, setloading] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    route?.params?.body?.start_datetime * 1000 || new Date(),
  );

  const [fromDate, setfromDate] = useState(
    route?.params?.body?.start_datetime * 1000 || getNearDateTime(new Date()),
  );
  const [toDate, setToDate] = useState(
    route?.params?.body?.end_datetime * 1000
      || getNearDateTime(new Date().setMinutes(new Date().getMinutes() + 30)),
  );
  const [datePickerFor, setDatePickerFor] = useState();
  const [blockedSlot, setBlockedSlot] = useState();
  const [slots, setSlots] = useState();
  const [marked, setMarked] = useState();
  const isFocused = useIsFocused();

  useEffect(() => {
    getSlots();
  }, [isFocused]);
  // useLayoutEffect(() => {}, [selectedDate]);

  const getDateFormat = (dateValue) => {
    moment.locale('en');
    const dateString = moment(new Date(dateValue)).format('MMM DD, yy    hh:mm A')
    return dateString;
  };
  const getSlots = () => {
    setloading(true);
    console.log('Other team Object:', route?.params?.otherTeam);
    blockedSlots(
      route?.params?.otherTeam?.entity_type === 'player' ? 'users' : 'groups',
      route?.params?.otherTeam?.group_id || route?.params?.otherTeam?.user_id,
      authContext,
    )
      .then((response) => {
        setloading(false);
        setSlots(response.payload);
        console.log('BOOKED SLOT::', JSON.stringify(response.payload));
        const markedDates = {};
        // eslint-disable-next-line array-callback-return
        (response?.payload || []).map((e) => {
          const original_date = moment(new Date(e.start_datetime * 1000)).format('yyyy-MM-DD');
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
              marked: true, dotColor: colors.themeColor, activeOpacity: 1,
            };
          }

          // markedDates={{
          //   '2021-01-01': { selected: true, marked: true, selectedColor: 'blue' },
          //   '2021-01-02': { marked: true },
          //   '2021-01-03': { marked: true, dotColor: 'red', activeOpacity: 0 },
          //   '2021-01-04': { disabled: true, disableTouchEvent: true },
          // }}
          console.log('BLOCKED::', markedDates);
        });
        markedDates[moment(new Date(fromDate).getTime()).format('yyyy-MM-DD')] = {
          selected: true, selectedColor: colors.themeColor,
        };
        setMarked(markedDates);
        console.log('Marked dates::', JSON.stringify(markedDates));
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.7);
      });
  };

  const getSelectedDayEvents = (date) => {
    const markedDates = { ...marked };
    console.log('MARKED::', Object.keys(markedDates));

    Object.keys(markedDates).forEach((e) => {
      if (markedDates[e].selected && markedDates[e].disabled) {
        markedDates[e].selected = false;
      } else if (markedDates[e].selected) {
        delete markedDates[e];
      }
    });
    if (markedDates[date]) {
      markedDates[date].selected = true;
    } else {
      markedDates[date] = { selected: true };
    }

    setMarked(markedDates);

    console.log('MARKED DATES::', JSON.stringify(markedDates));
  };

  const handleDonePress = (date) => {
    console.log('From date:', date);
    if (new Date(fromDate).getTime() === new Date(toDate).getTime()) {
      const todayDate = new Date(
        `${
          new Date().getMonth() + 1
        } ${new Date().getDate()} ${new Date().getFullYear()}`,
      );
      const selectDate = new Date(
        `${new Date(date).getMonth() + 1} ${new Date(
          date,
        ).getDate()} ${new Date(date).getFullYear()}`,
      );
      if (todayDate.getTime() === selectDate.getTime()) {
        setSelectedDate(
          new Date(date).setHours(
            new Date(getNearDateTime(new Date())).getHours(),
            new Date(getNearDateTime(new Date())).getMinutes(),
            0,
            0,
          ),
        );
        setfromDate(
          new Date(date).setHours(
            new Date(getNearDateTime(new Date())).getHours(),
            new Date(getNearDateTime(new Date())).getMinutes(),
            0,
            0,
          ),
        );
        setToDate(
          new Date(date).setHours(
            new Date(getNearDateTime(new Date())).getHours(),
            new Date(getNearDateTime(new Date())).getMinutes() + 30,
            0,
            0,
          ),
        );
      } else {
        setSelectedDate(new Date(date).setHours(0, 0, 0, 0));
        setfromDate(new Date(date).setHours(0, 0, 0, 0));
        setToDate(new Date(date).setHours(0, 30, 0, 0));
      }
    }

    setShow(!show);
    if (datePickerFor === 'from') {
      setfromDate(date);
      console.log(`from:->${new Date(fromDate)}to:->${new Date(toDate)}`);
      if (new Date(date).getTime() > new Date(toDate).getTime()) {
        setToDate(moment(date).add(30, 'm').toDate())
      }
    } else {
      setToDate(date);
    }
    setShow(false);
    filterSlots(fromDate);
  };
  const handleCancelPress = () => {
    setShow(false);
  };
  const getSimpleDateFormat = (dateValue) => {
    moment.locale('en');
    return moment(new Date(dateValue)).format('yy/MM/DD');
  };
  const filterSlots = (startDate) => {
    const resultProductData = slots.filter((a) => {
      console.log('AA data', new Date(a.start_datetime * 1000));
      return (
        new Date(a.start_datetime * 1000).getDate()
          === new Date(startDate).getDate()
        && new Date(a.start_datetime * 1000).getMonth()
          === new Date(startDate).getMonth()
        && new Date(a.start_datetime * 1000).getFullYear()
          === new Date(startDate).getFullYear()
      );
    });
    console.log('filtered data', resultProductData);
  };
  return (
    <>
      <ScrollView style={{ flex: 1 }}>
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
              const todayDate = new Date(
                `${
                  new Date().getMonth() + 1
                } ${new Date().getDate()} ${new Date().getFullYear()}`,
              );
              const selectDate = new Date(
                `${new Date(day.dateString).getMonth() + 1} ${new Date(
                  day.dateString,
                ).getDate()} ${new Date(day.dateString).getFullYear()}`,
              );
              // console.log(`date::${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}date::${new Date(day.dateString).getMonth() + 1}/${new Date(day.dateString).getDate()}/${new Date(day.dateString).getFullYear()}`);
              console.log(`Today::${todayDate}Selected::${selectDate}`);
              if (todayDate > selectDate) {
                Alert.alert(strings.chooseFutureDate);
              } else {
                const temp = [];
                slots.map((e) => {
                  if (
                    getSimpleDateFormat(new Date(e.start_datetime * 1000))
                    === getSimpleDateFormat(new Date(day.dateString))
                  ) {
                    temp.push(e);
                  }
                });
                setBlockedSlot(temp);

                if (todayDate.getTime() === selectDate.getTime()) {
                  console.log('date matched::::::');

                  setSelectedDate(
                    new Date(day.dateString).setHours(
                      new Date(getNearDateTime(new Date())).getHours(),
                      new Date(getNearDateTime(new Date())).getMinutes(),
                      0,
                      0,
                    ),
                  );
                  setfromDate(
                    new Date(day.dateString).setHours(
                      new Date(getNearDateTime(new Date())).getHours(),
                      new Date(getNearDateTime(new Date())).getMinutes(),
                      0,
                      0,
                    ),
                  );
                  setToDate(
                    new Date(day.dateString).setHours(
                      new Date(getNearDateTime(new Date())).getHours(),
                      new Date(getNearDateTime(new Date())).getMinutes() + 30,
                      0,
                      0,
                    ),
                  );
                } else {
                  setSelectedDate(
                    new Date(day.dateString).setHours(0, 0, 0, 0),
                  );
                  setfromDate(new Date(day.dateString).setHours(0, 0, 0, 0));
                  setToDate(new Date(day.dateString).setHours(0, 30, 0, 0));
                }

                getSelectedDayEvents(day.dateString);
                filterSlots(selectedDate);
              }
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

          {blockedSlot && (
            <View style={{ paddingBottom: 5 }}>
              <Text style={styles.dateHeader}>
                {daysNames[new Date(selectedDate).getDay()]},{' '}
                {new Date(selectedDate).getDate()}{' '}
                {monthNames[new Date(selectedDate).getMonth()]}
              </Text>

              <FlatList
                data={blockedSlot}
                renderItem={({ item }) => (
                  <UnavailableTimeView
                    startDate={item.start_datetime}
                    endDate={item.end_datetime}
                    allDay={item.allDay}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
          <TouchableOpacity
            style={{ marginLeft: 15, marginRight: 15, marginTop: 20 }}
            onPress={() => {
              setDatePickerFor('from');
              setShow(!show);
            }}>
            <View style={styles.fieldView}>
              <View
                style={{
                  height: 35,
                  justifyContent: 'center',
                }}>
                <Text style={styles.fieldTitle} numberOfLines={1}>
                  From
                </Text>
              </View>
              <View style={{ marginRight: 15, flexDirection: 'row' }}>
                <Text style={styles.fieldValue} numberOfLines={3}>
                  {getDateFormat(fromDate)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginLeft: 15, marginRight: 15, marginBottom: 2 }}
            onPress={() => {
              setDatePickerFor('to');
              setShow(!show);
            }}>
            <View style={styles.fieldView}>
              <View
                style={{
                  height: 35,
                  justifyContent: 'center',
                }}>
                <Text style={styles.fieldTitle} numberOfLines={1}>
                  To
                </Text>
              </View>
              <View style={{ marginRight: 15, flexDirection: 'row' }}>
                <Text style={styles.fieldValue} numberOfLines={3}>
                  {getDateFormat(toDate)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <DateTimePickerView
            // date={selectedDate}
            // visible={show}
            // onDone={handleDonePress}
            // onCancel={handleCancelPress}
            // onHide={handleCancelPress}
            // minutesGap={30}
            // minimumDate={selectedDate || new Date()}
            // maximumDate = {new Date(selectedDate).setHours(23, 59, 59, 999) || new Date().setHours(23, 59, 59, 999)}
            // mode={'datetime'}
            date={datePickerFor === 'from' ? fromDate : toDate}
            visible={show}
            onDone={handleDonePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            minutesGap={30}
            minimumDate={
              datePickerFor === 'to' ? moment(new Date(fromDate)).add(30, 'm').toDate() : getNearDateTime(new Date())
            }
            maximumDate={
              getNearDateTime(new Date()).setHours(23, 59, 59, 999)
            }
            mode={'time'}
          />

          <View style={{ flex: 1 }}></View>
        </SafeAreaView>
      </ScrollView>

      <TCGradientButton
        title={strings.applyTitle}
        onPress={() => {
          if (fromDate < new Date().getTime() / 1000) {
            Alert.alert(strings.chooseFutureDate);
          } else if (toDate > fromDate) {
            navigation.navigate('CreateChallengeForm1', {
              from: new Date(fromDate).getTime() / 1000,
              to: new Date(toDate).getTime() / 1000,
            });
          } else {
            Alert.alert(strings.chooseCorrectDate);
          }
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fieldView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  dateHeader: {
    marginTop: 15,
    marginLeft: 15,
    fontFamily: fonts.RMedium,
    fontSize: 25,
    color: colors.themeColor,
  },
});
