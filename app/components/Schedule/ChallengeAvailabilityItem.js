import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import moment from 'moment';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import BlockAvailableTabView from './BlockAvailableTabView';
import DateTimePickerView from './DateTimePickerModal';
import EventTimeSelectItem from './EventTimeSelectItem';

function ChallengeAvailabilityItem({
  data,
  onDeletePress,
  changeAvailablilityItem,
}) {
  const [toggle, setToggle] = useState(data.allDay);
  const [is_Blocked, setIsBlocked] = useState(data.isBlock);
  const [eventStartDateTime, setEventStartdateTime] = useState(new Date());
  const [eventEndDateTime, setEventEnddateTime] = useState(new Date());

  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);

  const handleStartDatePress = (date) => {
    console.log('Start date:=>', date);
    const startDate = moment(date).format('YYYY-MM-DD hh:mm:ss');
    const obj = {...data};
    obj.startDateTime = startDate;
    changeAvailablilityItem(obj);
    setEventStartdateTime(date);
    if (new Date(date).getTime() > new Date(eventEndDateTime).getTime()) {
      const d1 = new Date(date);
      const d2 = d1;
      d2.setMinutes(d1.getMinutes() + 5);
      setEventEnddateTime(d2);
    }
    setStartDateVisible(!startDateVisible);
  };
  const handleCancelPress = () => {
    setStartDateVisible(false);
    setEndDateVisible(false);
  };

  const handleEndDatePress = (date) => {
    console.log('End date:=>', date);

    const endDate = moment(date).format('YYYY-MM-DD hh:mm:ss');
    const obj = {...data};
    obj.endDateTime = endDate;
    changeAvailablilityItem(obj);
    setEventEnddateTime(date);
    if (new Date(date).getTime() < new Date(eventStartDateTime).getTime()) {
      const d1 = new Date(date);
      const d2 = new Date(d1);
      d2.setMinutes(d1.getMinutes() + 5);
      setEventStartdateTime(d2);
    }
    setEndDateVisible(!endDateVisible);
  };

  return (
    <View style={{marginTop: 10}}>
      <View style={styles.containerStyle}>
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
        <View style={styles.toggleViewStyle}>
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
      <View>
        <Text style={styles.deleteTextStyle} onPress={onDeletePress}>
          Delete
        </Text>
      </View>
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
        minimumDate={new Date(eventStartDateTime.getTime() + 5 * 60000)}
        mode={toggle ? 'date' : 'datetime'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  blockStyle: {
    width: wp('50%'),
    marginVertical: 0,
    borderRadius: 8,
  },
  activeEventPricacy: {
    paddingVertical: 2,
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
    justifyContent: 'center',
    padding: 3,
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
