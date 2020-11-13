import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image,
} from 'react-native';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
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
  const [eventStartDateTime, setEventStartdateTime] = useState('');
  const [eventEndDateTime, setEventEnddateTime] = useState('');

  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);

  const handleStateDatePress = (date) => {
    const startDate = moment(date).format('YYYY-MM-DD hh:mm:ss');
    const obj = { ...data };
    obj.startDateTime = startDate;
    changeAvailablilityItem(obj);
    setEventStartdateTime(date);
    setStartDateVisible(!startDateVisible)
  }
  const handleCancelPress = () => {
    setStartDateVisible(false)
    setEndDateVisible(false)
  }

  const handleEndDatePress = (date) => {
    const endDate = moment(date).format('YYYY-MM-DD hh:mm:ss');
    const obj = { ...data };
    obj.endDateTime = endDate;
    changeAvailablilityItem(obj);
    setEventEnddateTime(date);
    setEndDateVisible(!endDateVisible)
  }

  return (
    <View style={{ marginTop: 10 }}>
      <View style={styles.containerStyle}>
        <BlockAvailableTabView
            blocked={is_Blocked}
            firstTabTitle={strings.block}
            secondTabTitle={strings.setAvailable}
            onFirstTabPress={() => {
              const obj = { ...data };
              obj.isBlock = true;
              changeAvailablilityItem(obj);
              setIsBlocked(true)
            }}
            onSecondTabPress={() => {
              const obj = { ...data };
              obj.isBlock = false;
              changeAvailablilityItem(obj);
              setIsBlocked(false)
            }}
            style={styles.blockStyle}
            activeEventPricacy={styles.activeEventPricacy}
            inactiveEventPricacy={styles.inactiveEventPricacy}
            activeEventPrivacyText={styles.activeEventPrivacyText}
            inactiveEventPrivacyText={styles.activeEventPrivacyText}
        />
        <View style={styles.toggleViewStyle}>
          <Text style={styles.allDayText}>{strings.allDay}</Text>
          <TouchableOpacity style={styles.checkbox} onPress={() => {
            const obj = { ...data };
            obj.allDay = !toggle;
            changeAvailablilityItem(obj);
            setToggle(!toggle)
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
        headerTextStyle={{ paddingLeft: 0 }}
        date={eventStartDateTime ? moment(eventStartDateTime).format('ll') : moment(data.startDateTime).format('ll')}
        time={eventStartDateTime ? moment(eventStartDateTime).format('h:mm a') : moment(data.startDateTime).format('h:mm a')}
        onDatePress={() => setStartDateVisible(!startDateVisible)}
      />
      <EventTimeSelectItem
        title={strings.ends}
        toggle={!toggle}
        headerTextStyle={{ paddingLeft: 0 }}
        date={eventEndDateTime ? moment(eventEndDateTime).format('ll') : moment(data.endDateTime).format('ll')}
        time={eventEndDateTime ? moment(eventEndDateTime).format('h:mm a') : moment(data.endDateTime).format('h:mm a')}
        containerStyle={{ marginBottom: 8 }}
        onDatePress={() => setEndDateVisible(!endDateVisible)}
      />
      <View>
        <Text style={styles.deleteTextStyle} onPress={onDeletePress}>Delete</Text>
      </View>
      <DateTimePickerView
            visible={startDateVisible}
            onDone={handleStateDatePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            mode={toggle ? 'date' : 'datetime'}
      />
      <DateTimePickerView
            visible={endDateVisible}
            onDone={handleEndDatePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
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
