import React, {useCallback, useEffect, useState} from 'react';
import {Text, View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import images from '../../../Constants/ImagePath';
import colorConstant from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import AvailabilityHeader from './AvailabilityHeader';
import {strings} from '../../../../Localization/translation';

const CalendarDaysIndex = {
  Sun: 1,
  Mon: 2,
  Tue: 3,
  Wed: 4,
  Thu: 5,
  Fri: 6,
  Sat: 7,
};

const CustomWeeklyCalender = ({
  colors = {},
  onDayPress = () => {},
  blockedDaySlots = [],
  selectedDate,
  setSelectedDate = () => {},
  onToggleView = () => {},
  isListView = true,
  customDatesStyles,
}) => {
  const [weeklyCalender, setWeeklyCalender] = useState(true);
  const [calenderData, setCalenderData] = useState({data: []});

  const getDaysArray = (start, end, steps = 1) => {
    const dateArray = [];
    const date = new Date(`${start}`);
    while (date <= new Date(end)) {
      const day = moment(date).utc().format('ddd');
      dateArray.push({
        day,
        date: moment(date).utc().format('D'),
        customDate: moment(date).utc().format('YYYY-MM-DD'),
        is_past: moment(date).endOf('day') < moment().endOf('day'),
        showDates:
          moment(date).utc().format('M') === moment().utc().format('M'),
      });

      // Use UTC date to prevent problems with time zones and DST
      date.setUTCDate(date.getUTCDate() + steps);
    }
    return dateArray;
  };

  const showCurrentWeekData = useCallback(() => {
    const todaysDay = moment(selectedDate).utc().format('ddd');
    const different = CalendarDaysIndex[todaysDay];
    const date = new Date(selectedDate);
    const sevenDays = new Date(selectedDate);
    date.setDate(date.getDate() - different);
    sevenDays.setDate(sevenDays.getDate() + 7);
    const range = getDaysArray(date, sevenDays);
    const weekOne = range.slice(1, 8);

    const obj = {
      startDate: date.setDate(date.getDate() + 1),
      endDate: weekOne[6].customDate,
      data: weekOne,
    };
    setCalenderData({...obj});
  }, [selectedDate]);

  useEffect(() => {
    showCurrentWeekData();
  }, [showCurrentWeekData]);

  const showNextWeekData = (referenceDate) => {
    const date = new Date(referenceDate);
    const sevenDays = new Date(referenceDate);
    date.setDate(date.getDate() + 1);
    sevenDays.setDate(sevenDays.getDate() + 7);
    const range = getDaysArray(date, sevenDays);
    const weekOne = range.slice(0, 7);
    const obj = {
      startDate: date,
      endDate: weekOne[6].customDate,
      data: weekOne,
    };
    setCalenderData({...obj});
  };

  const showPreviousWeekData = (referenceDate) => {
    const date = new Date(referenceDate);
    const sevenDays = new Date(referenceDate);
    date.setDate(date.getDate() - 1);
    sevenDays.setDate(sevenDays.getDate() - 7);
    const range = getDaysArray(sevenDays, date);
    const weekOne = range.slice(0, 7);

    const obj = {
      startDate: weekOne[0].customDate,
      endDate: weekOne[6].customDate,
      data: weekOne,
    };
    setCalenderData({...obj});
  };

  const backGroundColor = (item) => {
    let color;
    if (item.is_past) {
      color = colors.whiteColor;
    } else if (moment(selectedDate).format('YYYY-MM-DD') === item.customDate) {
      color = colors.themeColor;
    } else if (blockedDaySlots.includes(item.customDate)) {
      color = colors.lightGrey;
    } else if (moment(new Date()).format('YYYY-MM-DD') === item.customDate) {
      color = colors.whiteColor;
    } else {
      color = colors.whiteColor;
    }

    return color;
  };

  const textColor = (item) => {
    let color;
    if (item.is_past) {
      color = '#ccc';
    } else if (moment(selectedDate).format('YYYY-MM-DD') === item.customDate) {
      color = colors.whiteColor;
    } else if (blockedDaySlots.includes(item.customDate)) {
      color = colors.grayColor;
    } else if (moment(new Date()).format('YYYY-MM-DD') === item.customDate) {
      color = colors.themeColor;
    } else {
      color = colors.greenGradientStart;
    }

    return color;
  };

  const LeftArrow = () => (
    <View style={styles.arrowContainer}>
      <Image source={images.leftArrow} style={[styles.arrowIcon, {width: 6}]} />
    </View>
  );

  const RightArrow = () => (
    <View style={styles.arrowContainer}>
      <Image source={images.rightArrow} style={styles.arrowIcon} />
    </View>
  );

  const datesBlacklistFunc = () => {
    const date = new Date();
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = date.setDate(date.getDate() - 1);
    const dates = [];

    while (start <= end) {
      dates.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }

    return dates;
  };

  return (
    <View style={styles.calenderWrapper}>
      {weeklyCalender ? (
        <>
          <AvailabilityHeader
            isListView={isListView}
            selectedDate={selectedDate}
            onToggleView={onToggleView}
            containerStyle={{paddingHorizontal: 15}}
            onNext={showNextWeekData}
            onPrev={showPreviousWeekData}
            startDate={calenderData.startDate}
            endDate={calenderData.endDate}
          />
          <View style={styles.row}>
            {calenderData.data.map((item, key) => (
              <View
                key={key}
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <View style={{marginBottom: 9}}>
                  <Text
                    style={{
                      fontSize: 12,
                      lineHeight: 18,

                      fontFamily: fonts.RMedium,
                      color: colorConstant.lightBlackColor,
                    }}>
                    {item.day.toUpperCase()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDate(item.customDate);
                    onDayPress(item.customDate);
                  }}
                  style={[
                    styles.dateContainer,
                    {backgroundColor: backGroundColor(item)},
                  ]}>
                  <Text style={{color: textColor(item)}}>{item.date}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={onToggleView}>
            <Image source={images.arrows} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{strings.list}</Text>
          </TouchableOpacity>

          <CalendarPicker
            headerWrapperStyle={styles.headerWrapperStyle}
            monthYearHeaderWrapperStyle={{
              backgroundColor: colorConstant.whiteColor,
            }}
            monthTitleStyle={styles.yearLabel}
            yearTitleStyle={styles.yearLabel}
            previousComponent={<LeftArrow />}
            nextComponent={<RightArrow />}
            dayShape="square"
            dayLabelsWrapper={styles.dayLabelsWrapper}
            onDateChange={(date) => {
              setSelectedDate(date);
              onDayPress(date);
            }}
            disabledDates={datesBlacklistFunc()}
            selectedDayStyle={styles.selectedDayStyle}
            initialDate={new Date(selectedDate)}
            customDatesStyles={customDatesStyles}
            todayTextStyle={{
              color:
                moment(new Date()).format('YYYY-MM-DD') ===
                moment(new Date(selectedDate)).format('YYYY-MM-DD')
                  ? colors.whiteColor
                  : colors.themeColor,
            }}
            selectedDayTextColor="white"
          />
        </>
      )}
      <TouchableOpacity
        style={styles.toggleStyle}
        onPress={() => {
          setWeeklyCalender(!weeklyCalender);
        }}>
        <Image
          source={images.dropDownArrow2}
          style={[
            styles.arrow,
            {transform: [{rotateX: weeklyCalender ? '0deg' : '180deg'}]},
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  calenderWrapper: {
    paddingHorizontal: 15,
    paddingBottom: 25,
    backgroundColor: colorConstant.whiteColor,
    shadowColor: colorConstant.darkGrayColor,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 35,
    paddingTop: 22,
  },
  dateContainer: {
    borderRadius: 5,
    width: 35,
    height: 35,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  toggleStyle: {
    width: 75,
    height: 28,
    backgroundColor: colorConstant.whiteColor,
    shadowColor: colorConstant.darkGrayColor,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1,
    alignSelf: 'center',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -28,
  },
  arrowContainer: {
    width: 20,
    height: 25,
    padding: 7,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorConstant.textFieldBackground,
  },
  arrowIcon: {
    width: 5,
    height: 10,
    resizeMode: 'cover',
  },
  headerWrapperStyle: {
    // width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
  },
  dayLabelsWrapper: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    shadowOpacity: 0,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RMedium,
    color: colorConstant.lightBlackColor,
  },
  selectedDayStyle: {
    backgroundColor: colorConstant.themeColor,
    color: colorConstant.whiteColor,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBlack,
  },
  arrow: {
    width: 10,
    height: 20,
    resizeMode: 'contain',
  },
  yearLabel: {
    fontSize: 20,
    lineHeight: 30,
    color: colorConstant.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colorConstant.grayBackgroundColor,
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 15,
    top: 30,
    zIndex: 99999,
  },
  buttonIcon: {
    width: 9,
    height: 10,
    resizeMode: 'cover',
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RMedium,
    color: colorConstant.lightBlackColor,
    marginLeft: 5,
  },
});

export default CustomWeeklyCalender;
