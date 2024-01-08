// @flow
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {strings} from '../../Localization/translation';
import images from '../Constants/ImagePath';
import FilterTimeSelectItem from './Filter/FilterTimeSelectItem';
import {getJSDate} from '../utils';
import DateTimePickerView from './Schedule/DateTimePickerModal';
import BottomSheet from './modals/BottomSheet';
import {filterType} from '../utils/constant';
import fonts from '../Constants/Fonts';
import colors from '../Constants/Colors';

const AvailableTimeComponent = ({
  filters = {},
  isEventFilter = false,
  fType = '',
  setFilters = () => {},
}) => {
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [startDates, setStartDate] = useState(new Date());
  const [showPastDates, setShowPastDates] = useState(false);
  const [tag, setTag] = useState(0);
  const [showTimeActionSheet, setShowTimeActionSheet] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);

  useEffect(() => {
    if (fType === filterType.RECENTMATCHS) {
      setShowPastDates(true);
    }
  }, [fType]);

  useEffect(() => {
    if (showPastDates) {
      setFilterOptions([
        strings.filterAntTime,
        strings.filterToday,
        strings.filterYesterday,
        strings.filterLast7Day,
        strings.filterThisMonth,
        strings.filterLastMonth,
        strings.filterPickaDate,
      ]);
    } else {
      setFilterOptions([
        strings.filterAntTime,
        strings.filterToday,
        strings.filterTomorrow,
        strings.filterNext7Day,
        strings.filterThisMonth,
        strings.filterNextMonth,
        strings.filterPickaDate,
      ]);
    }
  }, [showPastDates]);

  const handleDatePress = (date) => {
    if (tag === 1) {
      setStartDate(new Date(date));
      let dateObject = '';
      if (filters.availableTime === strings.filterPickaDate) {
        dateObject = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0,
          0,
          0,
        );
      } else {
        dateObject = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
        ); // Start of the day
      }
      const fromDate = Number(parseFloat(dateObject / 1000).toFixed(0));
      const temp = {...filters};
      temp.fromDateTime = fromDate;
      setFilters({...temp});
    } else if (tag === 2) {
      const toDateObject = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
      ); // End of the day
      const toDate = Number(parseFloat(toDateObject / 1000).toFixed(0));
      const temp = {...filters};
      temp.toDateTime = toDate;
      setFilters({...temp});
    }
    setDatePickerShow(false);
  };

  const handleOptionSelect = (option) => {
    const temp = {...filters};
    const today = new Date();
    if (option === strings.filterAntTime) {
      setTag(0);
      temp.fromDateTime = Number(
        parseFloat(new Date().getTime() / 1000).toFixed(0),
      );
      temp.toDateTime = '';
      temp.availableTime = option;
    } else if (option === strings.filterToday) {
      const fromDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
      ); // Start of the day
      const toDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
      ); // End of the day
      setTag(0);

      temp.fromDateTime =
        fType === filterType.RECENTMATCHS
          ? Number(parseFloat(fromDate / 1000).toFixed(0))
          : Number(parseFloat(today / 1000).toFixed(0));
      temp.toDateTime = Number(parseFloat(toDate / 1000).toFixed(0));
      temp.availableTime = option;
    } else if (option === strings.filterTomorrow) {
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      const startDate = new Date(
        tomorrow.getFullYear(),
        tomorrow.getMonth(),
        tomorrow.getDate(),
        0,
        0,
        0,
      );
      const endDate = new Date(
        tomorrow.getFullYear(),
        tomorrow.getMonth(),
        tomorrow.getDate(),
        23,
        59,
        59,
      );
      setTag(0);

      temp.fromDateTime = Number(parseFloat(startDate / 1000).toFixed(0));
      temp.toDateTime = Number(parseFloat(endDate / 1000).toFixed(0));
      temp.availableTime = option;
    } else if (option === strings.filterYesterday) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const fromDate = new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate(),
        0,
        0,
        0,
      ); // Start of the day
      const toDate = new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate(),
        23,
        59,
        59,
      ); // End of the day
      setTag(0);

      temp.fromDateTime = Number(parseFloat(fromDate / 1000).toFixed(0));
      temp.toDateTime = Number(parseFloat(toDate / 1000).toFixed(0));
      temp.availableTime = option;
    } else if (option === strings.filterLast7Day) {
      const fromDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6,
        0,
        0,
        0,
      ); // Start of the day for 7 days ago
      const toDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
      ); // End of the day for today
      setTag(0);

      temp.fromDateTime = Number(parseFloat(fromDate / 1000).toFixed(0));
      temp.toDateTime = Number(parseFloat(toDate / 1000).toFixed(0));
      temp.availableTime = option;
    } else if (option === strings.filterThisMonth) {
      const fromDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
        0,
        0,
        0,
      ); // Start of the month
      const toDate = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59,
      ); // End of the month

      setTag(0);

      temp.fromDateTime =
        fType === filterType.RECENTMATCHS
          ? Number(parseFloat(fromDate / 1000).toFixed(0))
          : Number(parseFloat(today / 1000).toFixed(0));
      temp.toDateTime = Number(parseFloat(toDate / 1000).toFixed(0));
      temp.availableTime = option;
    } else if (option === strings.filterLastMonth) {
      const fromDate = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1,
        0,
        0,
        0,
      ); // Start of the previous month
      const toDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        0,
        23,
        59,
        59,
      ); // End of the previous month

      setTag(0);

      temp.fromDateTime = Number(parseFloat(fromDate / 1000).toFixed(0));
      temp.toDateTime = Number(parseFloat(toDate / 1000).toFixed(0));
      temp.availableTime = option;
    } else if (option === strings.filterNext7Day) {
      const now = new Date();
      const fromDate = now; // Set "from" date as the current time

      const toDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 7,
        23,
        59,
        59,
      ); // Set "to" date as the end of the next 7 days
      setTag(0);

      temp.fromDateTime = Number(parseFloat(fromDate / 1000).toFixed(0));
      temp.toDateTime = Number(parseFloat(toDate / 1000).toFixed(0));
      temp.availableTime = option;
    } else if (option === strings.filterNextMonth) {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1);

      const startDate = new Date(
        nextMonth.getFullYear(),
        nextMonth.getMonth(),
        1,
      );
      const endDate = new Date(
        nextMonth.getFullYear(),
        nextMonth.getMonth() + 1,
        0,
      );
      setTag(0);

      temp.fromDateTime = Number(parseFloat(startDate / 1000).toFixed(0));
      temp.toDateTime = Number(parseFloat(endDate / 1000).toFixed(0));
      temp.availableTime = option;
    } else {
      temp.availableTime = option;
    }
    setFilters({...temp});
    setShowTimeActionSheet(false);
  };

  return (
    <>
      <View style={styles.parent}>
        <Text style={styles.title}>{strings.availableTime}</Text>

        {isEventFilter && (
          <View style={{marginTop: 15}}>
            <TouchableOpacity
              style={styles.radioButtonContainer}
              onPress={() => {
                setShowPastDates(false);
                setFilters({
                  ...filters,
                  eventType: strings.upcomingTitleText,
                });
              }}>
              <Text style={styles.filterTitle}>
                {strings.upcomingTitleText}
              </Text>

              <Image
                source={
                  filters.eventType === strings.upcomingTitleText
                    ? images.checkRoundOrange
                    : images.radioUnselect
                }
                style={styles.radioButtonStyle}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioButtonContainer}
              onPress={() => {
                setShowPastDates(true);
                setFilters({
                  ...filters,
                  eventType: strings.completedTitleText,
                });
              }}>
              <Text style={styles.filterTitle}>
                {strings.completedTitleText}
              </Text>

              <Image
                source={
                  filters.eventType === strings.completedTitleText
                    ? images.checkRoundOrange
                    : images.radioUnselect
                }
                style={styles.radioButtonStyle}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={{marginTop: 10}}>
          <Pressable
            onPress={() => {
              setShowTimeActionSheet(true);
            }}
            style={styles.buttonContainer}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={styles.selectedValue}>
                {filters.availableTime ?? strings.filterAntTime}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Icon size={24} color="black" name="chevron-down" />
            </View>
          </Pressable>
        </View>
        {filters.availableTime === strings.filterPickaDate && (
          <View style={{marginTop: 10}}>
            <FilterTimeSelectItem
              title={strings.from}
              date={
                filters.fromDateTime
                  ? moment(getJSDate(filters.fromDateTime).getTime()).format(
                      'll',
                    )
                  : ''
              }
              onDatePress={() => {
                setTag(1);
                setDatePickerShow(true);
              }}
              onXCirclePress={() => setFilters({...filters, fromDateTime: ''})}
            />
            <FilterTimeSelectItem
              title={strings.to}
              date={
                filters.toDateTime
                  ? moment(getJSDate(filters.toDateTime).getTime()).format('ll')
                  : ''
              }
              onDatePress={() => {
                setDatePickerShow(true);
                setTag(2);
              }}
              onXCirclePress={() => setFilters({...filters, toDateTime: ''})}
            />
          </View>
        )}
      </View>
      {showPastDates ? (
        <DateTimePickerView
          visible={datePickerShow}
          onDone={handleDatePress}
          onCancel={() => setDatePickerShow(false)}
          onHide={() => setDatePickerShow(false)}
          mode={'date'}
          maximumDate={new Date()}
        />
      ) : (
        <DateTimePickerView
          visible={datePickerShow}
          onDone={handleDatePress}
          onCancel={() => setDatePickerShow(false)}
          onHide={() => setDatePickerShow(false)}
          mode={'date'}
          minimumDate={startDates}
        />
      )}

      <BottomSheet
        isVisible={showTimeActionSheet}
        closeModal={() => {
          setShowTimeActionSheet(false);
        }}
        optionList={filterOptions}
        onSelect={(option) => {
          handleOptionSelect(option);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    margin: 15,
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  buttonContainer: {
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    height: 40,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedValue: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  radioButtonStyle: {
    height: 22,
    width: 22,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginLeft: 10,
  },
});
export default AvailableTimeComponent;
