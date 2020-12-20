import React, {
  useEffect, useState, useLayoutEffect, useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,

  FlatList,
  SectionList,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import AuthContext from '../../../auth/context'
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
  const daysNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const authContext = useContext(AuthContext)
  // For activity indigator
  const [loading, setloading] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [fromDate, setfromDate] = useState();
  const [toDate, setToDate] = useState();
  const [datePickerFor, setDatePickerFor] = useState();
  const [filteredData, setFilterdData] = useState();

  const [slots, setSlots] = useState();
  const [marked, setMarked] = useState();
  const isFocused = useIsFocused();

  useEffect(() => {
    getSlots();
  }, [isFocused]);
  useLayoutEffect(() => {}, [selectedDate]);

  const getDateFormat = (dateValue) => {
    moment.locale('en');
    const a = 1000 * 60 * 30;
    const date = new Date(dateValue); // or use any other date
    const rounded = new Date(Math.round(date.getTime() / a) * a)
    return moment(new Date(rounded)).format('MMM DD, yy      hh:mm A');
  };
  const getSlots = () => {
    setloading(true);
    console.log('Other team Object:', route?.params?.otherTeam);
    blockedSlots(route.params.otherTeam.group_id, authContext)
      .then((response) => {
        setloading(false);
        setSlots(response.payload);
        console.log('BOOKED SLOT::', JSON.stringify(response.payload));

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

  const handleDonePress = (date) => {
    setShow(!show);
    if (datePickerFor === 'from') {
      console.log('From Date:', Math.trunc(date.getTime() / 1000));
      setfromDate(date);
    } else {
      console.log('TO Date:', date.getTime());
      setToDate(date);
    }
    setShow(false)
    filterSlots(fromDate)
  };
  const handleCancelPress = () => {
    setShow(false);
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

          <SectionList
            sections={slots}
            renderItem={() => <UnavailableTimeView />}
            renderSectionHeader={({ section }) => (
              <Text style={styles.dateHeader}>{section.title}</Text>
            )}
            keyExtractor={(item, index) => index}
          />
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

                  height: 35,
                  justifyContent: 'center',
                }}>
                <Text style={styles.fieldTitle} numberOfLines={1}>
                  From
                </Text>
              </View>
              <View style={{ marginRight: 15, flexDirection: 'row' }}>
                {fromDate ? (
                  <Text
                    style={styles.fieldValue}
                    numberOfLines={3}
                    onPress={() => {
                      setDatePickerFor('from');
                      setShow(!show);
                    }}>
                    {getDateFormat(fromDate)}
                  </Text>
                ) : (
                  <Text
                    style={styles.fieldValue}
                    numberOfLines={3}
                    onPress={() => {
                      setDatePickerFor('from');
                      setShow(!show);
                    }}>
                    {getDateFormat(selectedDate)}
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View style={{ marginLeft: 15, marginRight: 15 }}>
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
                {toDate ? (
                  <Text
                    style={styles.fieldValue}
                    numberOfLines={3}
                    onPress={() => {
                      setDatePickerFor('to');
                      setShow(!show);
                    }}>
                    {getDateFormat(toDate)}
                  </Text>
                ) : (
                  <Text
                    style={styles.fieldValue}
                    numberOfLines={3}
                    onPress={() => {
                      setDatePickerFor('to');
                      setShow(!show);
                    }}>
                    {getDateFormat(selectedDate)}
                  </Text>
                )}

              </View>
            </View>
          </View>
          <DateTimePickerView
          date={new Date()}
            visible={show}
            onDone={handleDonePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            minutesGap={30}
            minimumDate={fromDate || new Date()}
            mode={'datetime'}
          />
          <View style={{ flex: 1 }}></View>
        </SafeAreaView>
      </ScrollView>

      <TCGradientButton
        title={strings.applyTitle}
        onPress={() => {
          if (toDate > fromDate) {
            navigation.navigate('CreateChallengeForm1', { from: fromDate || selectedDate, to: toDate || selectedDate })
          } else {
            Alert.alert('Please choose correct date.')
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
