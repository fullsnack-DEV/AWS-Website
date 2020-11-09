import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import TimePicker from 'react-native-24h-timepicker';

import { blockedSlots } from '../../../api/Schedule'
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import UnavailableTimeView from '../../../components/challenge/UnavailableTimeView';

export default function ChooseDateTimeScreen({ navigation }) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
    'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const [selectedDate, setSelectedDate] = useState()
  const [fromTime, setfromTime] = useState('24:00:00')
  const [toTime, setToTime] = useState('23:55:00')
  const [timePickerFor, setTimePickerFor] = useState()
  const isFocused = useIsFocused();
  const timePicker = useRef();

  useEffect(() => {
    getSlots()
  }, [isFocused]);
  const onConfirm = (hour, minute) => {
    console.log('HHMM', hour, minute)
    if (timePickerFor === 'from') {
      const str = `${hour}:${minute}:00`
      setfromTime(str)
    } else {
      const str = `${hour}:${minute}:00`
      setToTime(str)
    }
    console.log('DONE TIME::', fromTime, toTime);
    timePicker.current.close();
  }

  const tConvert = (timeString = '24:00:00') => {
    const timeString12hr = new Date(`1970-01-01T${timeString}Z`)
      .toLocaleTimeString({},
        {
          timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric',
        });
    return timeString12hr
  }

  const getSlots = () => {
    blockedSlots('3d17d3d3-30b0-4b1b-a7e8-48d360dc9eea').then((response) => {
      console.log('BOOKED SLOT::', response.payload);
      console.log('END DATE/TIME ::', new Date(response.payload.end_datetime));
      console.log('START DATE/TIME ::', new Date(response.payload.start_datetime));
    }).catch((error) => {
      Alert.alert(error.messages)
    })
  }
  return (
    <ScrollView>
      <SafeAreaView>
        <Calendar
      theme={{

        textSectionTitleDisabledColor: '#d9e1e8',
        selectedDayTextColor: 'white',
        selectedDayBackgroundColor: '#165c96',
        todayTextColor: colors.themeColor,

        textDisabledColor: 'red',

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
        setSelectedDate(day.dateString)
        console.log('selected day', day)
      }}
      markedDates={{
        day: { selected: true, color: colors.yellowColor, textColor: 'blue' },
        '2020-11-10': { startingDay: true, color: colors.lightgrayColor, textColor: 'gray' },
        '2020-11-12': {
          selected: true, endingDay: true, color: colors.lightgrayColor, textColor: 'gray',
        },
        '2020-11-22': { startingDay: true, color: colors.themeColor, textColor: 'white' },
        '2020-11-23': {
          selected: true, endingDay: true, color: colors.themeColor, textColor: 'white',
        },

      }}
      markingType={'period'}
      style={{
        shadowColor: colors.grayColor,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 1,
      }}

      />

        <Text style={{
          marginTop: 15, marginLeft: 15, fontFamily: fonts.RMedium, fontSize: 25, color: colors.themeColor,
        }}>Tue, 17 Feb</Text>
        <UnavailableTimeView/>
        <UnavailableTimeView/>
        <UnavailableTimeView/>

        <Text style={{
          marginTop: 15, marginLeft: 15, fontFamily: fonts.RMedium, fontSize: 25, color: colors.themeColor,
        }}>Tue, 19 Feb</Text>
        <UnavailableTimeView/>

        <View style={{ marginLeft: 15, marginRight: 15, marginTop: 20 }}>
          <View style={styles.fieldView}>
            <View style={{
              flex: 0.4, height: 35, justifyContent: 'center',
            }}>
              <Text style={styles.fieldTitle} numberOfLines={1}>From</Text>
            </View>
            <View style={{ flex: 0.6 }}>
              <Text style={styles.fieldValue}
               numberOfLines={3}
               onPress={() => {
                 setTimePickerFor('from')
                 timePicker.current.open()
               }}
               >{selectedDate || `${monthNames[new Date().getMonth()]} ${new Date().getDate()} ,${new Date().getFullYear()}`}    {tConvert(fromTime)}</Text>
            </View>
          </View>
        </View>
        <View style={{ marginLeft: 15, marginRight: 15 }}>
          <View style={styles.fieldView}>
            <View style={{
              flex: 0.4, height: 35, justifyContent: 'center',
            }}>
              <Text style={styles.fieldTitle} numberOfLines={1}>To</Text>
            </View>
            <View style={{ flex: 0.6 }}>
              <Text
              style={styles.fieldValue}
               numberOfLines={3}
               onPress={() => {
                 setTimePickerFor('to')
                 timePicker.current.open()
               }}
               >{selectedDate || `${monthNames[new Date().getMonth()]} ${new Date().getDate()} ,${new Date().getFullYear()}`}   {tConvert(toTime)}</Text>
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
        <View style={{ marginBottom: 10 }}>
          <TCGradientButton title={strings.applyTitle} onPress={() => navigation.navigate('CreateChallengeForm3')}/>
        </View>
      </SafeAreaView>
    </ScrollView>
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
});
