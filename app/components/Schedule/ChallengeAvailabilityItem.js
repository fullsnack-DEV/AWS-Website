/* eslint-disable no-plusplus */
import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import moment from 'moment';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import BlockAvailableTabView from './BlockAvailableTabView';
import DateTimePickerView from './DateTimePickerModal';
import EventTimeSelectItem from './EventTimeSelectItem';
import EventMonthlySelection from './EventMonthlySelection';

function ChallengeAvailabilityItem({
  data,
  onDeletePress,
  changeAvailablilityItem,
}) {
  const [selectWeekMonth, setSelectWeekMonth] = useState('');
  const [untilDateVisible, setUntilDateVisible] = useState(false);

  const [toggle, setToggle] = useState(data.allDay);
  const [is_Blocked, setIsBlocked] = useState(data.isBlock);
  const [eventStartDateTime, setEventStartdateTime] = useState(new Date());
  const [eventEndDateTime, setEventEnddateTime] = useState(
    new Date().setMinutes(new Date().getMinutes() + 5),
  );

  const [eventUntilDateTime, setEventUntildateTime] =
    useState(eventEndDateTime);

  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);

  const handleStartDatePress = (date) => {
    console.log('Date::=>', new Date(new Date(date).getTime()));
    setEventStartdateTime(
      toggle ? new Date(date).setHours(0, 0, 0, 0) : new Date(date),
    );
    setEventEnddateTime(
      toggle
        ? new Date(date).setHours(23, 59, 59, 0)
        : new Date(moment(date).add(5, 'm').toDate()),
    );
    setEventUntildateTime(
      toggle
        ? new Date(date).setHours(23, 59, 59, 0)
        : new Date(moment(date).add(5, 'm').toDate()),
    );
    setStartDateVisible(!startDateVisible);
  };
  const handleCancelPress = () => {
    setStartDateVisible(false);
    setEndDateVisible(false);
  };

  const handleEndDatePress = (date) => {
    console.log('End date:=>', date);
    let dateValue = new Date();
    if (toggle) {
      dateValue = `${moment(date).format('ddd MMM DD YYYY')} 11:59:59 PM`;
      console.log('Date Value :-', dateValue);
      setEventEnddateTime(new Date(dateValue));
    } else {
      setEventEnddateTime(new Date(date));
    }
    const obj = {...data, endDateTime: new Date(date)};
    changeAvailablilityItem(obj);

    setEndDateVisible(!endDateVisible);
  };

  const ordinal_suffix_of = (i) => {
    const j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return `${i}st`;
    }
    if (j === 2 && k !== 12) {
      return `${i}nd`;
    }
    if (j === 3 && k !== 13) {
      return `${i}rd`;
    }
    return `${i}th`;
  };

  const countNumberOfWeekFromDay = () => {
    const date = new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = date;
    const givenDay = new Date().getDay();
    let numberOfDates = 0;
    while (startDate < endDate) {
      if (startDate.getDay() === givenDay) {
        numberOfDates++;
      }
      startDate.setDate(startDate.getDate() + 1);
    }
    return ordinal_suffix_of(numberOfDates);
  };

  const getTodayDay = () => {
    const dt = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
    return dt.format('dddd');
  };

  return (
    <View style={{marginTop: 10}}>
      <View style={styles.toggleViewStyle}>
        <Text style={styles.deleteTextStyle} onPress={onDeletePress}>
          Delete
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.allDayText}>{strings.allDay}</Text>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => {
              const obj = {...data};
              obj.allDay = !toggle;
              changeAvailablilityItem(obj);
              setToggle(!toggle);
            }}>
            <Image
              source={toggle ? images.checkWhiteLanguage : images.uncheckWhite}
              style={styles.checkboxImg}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <EventTimeSelectItem
        title={strings.starts}
        toggle={!toggle}
        headerTextStyle={{paddingLeft: 0}}
        date={
          eventStartDateTime
            ? moment(eventStartDateTime).format('ll')
            : moment(new Date()).format('ll')
        }
        time={
          eventStartDateTime
            ? moment(eventStartDateTime).format('h:mm a')
            : moment(new Date()).format('h:mm a')
        }
        onDatePress={() => setStartDateVisible(!startDateVisible)}
      />
      <EventTimeSelectItem
        title={strings.ends}
        toggle={!toggle}
        headerTextStyle={{paddingLeft: 0}}
        date={
          eventEndDateTime
            ? moment(eventEndDateTime).format('ll')
            : moment(new Date()).format('ll')
        }
        time={
          eventEndDateTime
            ? moment(eventEndDateTime).format('h:mm a')
            : moment(new Date()).format('h:mm a')
        }
        containerStyle={{marginBottom: 8}}
        onDatePress={() => setEndDateVisible(!endDateVisible)}
      />

      <EventMonthlySelection
        title={strings.repeat}
        dataSource={[
          {label: 'Daily', value: 'Daily'},
          {label: 'Weekly', value: 'Weekly'},
          {
            label: `Monthly on ${countNumberOfWeekFromDay()} ${getTodayDay()}`,
            value: `Monthly on ${countNumberOfWeekFromDay()} ${getTodayDay()}`,
          },
          {
            label: `Monthly on ${ordinal_suffix_of(new Date().getDate())} day`,
            value: `Monthly on ${ordinal_suffix_of(new Date().getDate())} day`,
          },
          {label: 'Yearly', value: 'Yearly'},
        ]}
        placeholder={'Does not repeat'}
        value={selectWeekMonth}
        onValueChange={(value) => {
          console.log('LLLLLLLL', value);
          setSelectWeekMonth(value);
        }}
      />
      {selectWeekMonth !== '' && (
        <EventTimeSelectItem
          title={strings.until}
          toggle={!toggle}
          date={
            eventUntilDateTime
              ? moment(eventUntilDateTime).format('ll')
              : moment(new Date()).format('ll')
          }
          time={
            eventUntilDateTime
              ? moment(eventUntilDateTime).format('h:mm a')
              : moment(new Date()).format('h:mm a')
          }
          containerStyle={{marginBottom: 12}}
          onDatePress={() => setUntilDateVisible(!untilDateVisible)}
        />
      )}

      <BlockAvailableTabView
        blocked={is_Blocked}
        firstTabTitle={strings.block}
        secondTabTitle={strings.setAvailable}
        onFirstTabPress={() => {
          const obj = {...data};
          obj.isBlock = true;
          changeAvailablilityItem(obj);
          setIsBlocked(true);
        }}
        onSecondTabPress={() => {
          const obj = {...data};
          obj.isBlock = false;
          changeAvailablilityItem(obj);
          setIsBlocked(false);
        }}
        style={styles.blockStyle}
        activeEventPricacy={styles.activeEventPricacy}
        inactiveEventPricacy={styles.inactiveEventPricacy}
        activeEventPrivacyText={styles.activeEventPrivacyText}
        inactiveEventPrivacyText={styles.activeEventPrivacyText}
      />

      <DateTimePickerView
        title={toggle ? 'Choose a date' : 'Choose a date & time'}
        // date={new Date(eventStartDateTime)}
        visible={startDateVisible}
        onDone={handleStartDatePress}
        onCancel={handleCancelPress}
        onHide={handleCancelPress}
        minimumDate={new Date()}
        mode={toggle ? 'date' : 'datetime'}
      />
      <DateTimePickerView
        title={toggle ? 'Choose a date' : 'Choose a date & time'}
        // date={new Date(eventEndDateTime)}
        visible={endDateVisible}
        onDone={handleEndDatePress}
        onCancel={handleCancelPress}
        onHide={handleCancelPress}
        minimumDate={new Date(eventStartDateTime).setMinutes(
          new Date(eventStartDateTime).getMinutes() + 5,
        )}
        mode={toggle ? 'date' : 'datetime'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blockStyle: {
    width: wp('92%'),
    marginVertical: 0,
    borderRadius: 8,
  },
  activeEventPricacy: {
    paddingVertical: 8,
    borderRadius: 6,
  },
  inactiveEventPricacy: {
    paddingVertical: 2,
  },
  activeEventPrivacyText: {
    fontSize: 12,
  },
  deleteTextStyle: {
    alignSelf: 'flex-end',
    marginRight: 5,
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.redDelColor,
  },
  toggleViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  allDayText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginRight: wp('1.5%'),
  },
  checkboxImg: {
    width: wp('5.5%'),
    height: wp('5.5%'),
  },
  checkbox: {
    alignSelf: 'center',
    right: wp(0),
  },
});

export default ChallengeAvailabilityItem;
