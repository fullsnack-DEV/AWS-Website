import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  Dimensions,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import moment from 'moment';
import {format} from 'react-string-format';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import AddTimeItem from '../../../components/Schedule/AddTimeItem';
import {editSlots} from '../../../api/Schedule';
import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';
import BlockAvailableTabView from '../../../components/Schedule/BlockAvailableTabView';
import AvailabilityTypeTabView from '../../../components/Schedule/AvailabilityTypeTabView';
import EventTimeSelectItem from '../../../components/Schedule/EventTimeSelectItem';
import EventMonthlySelection from '../../../components/Schedule/EventMonthlySelection';
import Verbs from '../../../Constants/Verbs';
import {
  getTCDate,
  getJSDate,
  ordinal_suffix_of,
  getDayFromDate,
  countNumberOfWeekFromDay,
  countNumberOfWeeks,
  getRoundedDate,
} from '../../../utils';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import ActivityLoader from '../../../components/loader/ActivityLoader';

export default function ChallengeAvailability({
  isVisible = false,
  closeModal = () => {},
  slots,
  addToSlotData,
  showAddMore = false,
  setHeightRange,
  deleteFromSlotData,
  deleteOrCreateSlotData,
  slotLevel = false,
  isFromSlot = false,
}) {
  const authContext = useContext(AuthContext);
  const [challengeAvailable, setChallengeAvailable] = useState([
    {
      id: 0,
      isBlock: true,
      allDay: false,
      start_datetime: getRoundedDate(5),
      end_datetime: moment(getRoundedDate(5)).add(5, 'm').toDate(),
      previous_start_datetime: getRoundedDate(5),
      previous_end_datetime: moment(getRoundedDate(5)).add(5, 'm').toDate(),
      is_recurring: false,
    },
  ]);
  const [oneTimeAvailability, setOneTimeAvailability] = useState([
    {
      id: 0,
      isBlock: true,
      allDay: false,
      start_datetime: getRoundedDate(5),
      end_datetime: moment(getRoundedDate(5)).add(5, 'm').toDate(),
      previous_start_datetime: getRoundedDate(5),
      previous_end_datetime: moment(getRoundedDate(5)).add(5, 'm').toDate(),
      is_recurring: false,
    },
  ]);
  const [recurringAvailability, setRecurringAvailability] = useState([
    {
      id: 0,
      isBlock: true,
      allDay: false,
      start_datetime: getRoundedDate(5),
      end_datetime: moment(getRoundedDate(5)).add(5, 'm').toDate(),
      previous_start_datetime: getRoundedDate(5),
      previous_end_datetime: moment(getRoundedDate(5)).add(5, 'm').toDate(),
      is_recurring: true,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [oneTime, setOneTime] = useState(true);
  const [overlappedItems, setOverlappedItems] = useState([]);
  const [showAddTimeButton, setShowAddTimeButton] = useState(true);
  const [snapPoints, setSnapPoints] = useState([]);

  useEffect(() => {
    if (isVisible) {
      if (slots.length > 0) {
        const editableSlots = [];
        const recurringSlots = [];
        const currentTime = getTCDate(new Date());
        slots.forEach((item, index) => {
          let startDateTime = item.start_datetime;
          const endDateTime = item.end_datetime;
          if (startDateTime < currentTime && endDateTime < currentTime) {
            return;
          }

          if (startDateTime < currentTime) {
            startDateTime = currentTime;
          }
          const temp = {
            id: index,
            isBlock: item.blocked,
            allDay: false,
            start_datetime: getJSDate(startDateTime),
            end_datetime: getJSDate(item.end_datetime),
            previous_start_datetime: getJSDate(startDateTime),
            previous_end_datetime: getJSDate(item.end_datetime),
            is_recurring: false,
          };
          editableSlots.push(temp);
        });
        let startDateTime = slots[0]?.start_datetime;
        if (startDateTime < currentTime) {
          startDateTime = currentTime;
        }
        const tempRecrr = {
          id: 0,
          isBlock: true,
          allDay: false,
          start_datetime: getJSDate(startDateTime),
          end_datetime: getJSDate(slots[0]?.end_datetime),
          previous_start_datetime: getJSDate(startDateTime),
          previous_end_datetime: getJSDate(slots[0]?.end_datetime),
          is_recurring: true,
        };
        recurringSlots.push(tempRecrr);
        setOneTimeAvailability(editableSlots);
        setChallengeAvailable(editableSlots);
        setRecurringAvailability(recurringSlots);
      }

      if (slotLevel) {
        setOneTime(false);
      }
    }
  }, [isVisible, slotLevel, slots]);

  const deleteItemById = (id) => {
    const filteredData = challengeAvailable.filter((item) => item.id !== id);
    setChallengeAvailable(filteredData);
  };

  const handleCancelPress = () => {
    setStartDateVisible(false);
    setEndDateVisible(false);
    setUntilDateVisible(false);
  };

  const onStartDateChange = (date, index) => {
    const tempChallenge = [...challengeAvailable];
    const startDateTime = tempChallenge[index].allDay
      ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
      : date;
    tempChallenge[index].start_datetime = startDateTime;
    let endDateTime = tempChallenge[index].end_datetime;
    const unitDate = challengeAvailable[index].untilDate;

    if (endDateTime.getTime() <= startDateTime.getTime()) {
      endDateTime = tempChallenge[index].allDay
        ? new Date(
            startDateTime.getFullYear(),
            startDateTime.getMonth(),
            startDateTime.getDate(),
            23,
            59,
            59,
          )
        : moment(startDateTime).add(5, 'm').toDate();
    }

    tempChallenge[index].end_datetime = endDateTime;

    if (!unitDate || endDateTime.getTime() > unitDate.getTime()) {
      tempChallenge[index].untilDate = moment(endDateTime).add(5, 'm').toDate();
    }

    setChallengeAvailable(tempChallenge);
    setStartDateVisible(!startDateVisible);
  };

  const onEndDateChange = (date, index) => {
    const tempChallenge = [...challengeAvailable];
    tempChallenge[index].end_datetime = tempChallenge[index].allDay
      ? new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          23,
          59,
          59,
        )
      : date;

    const endDateTime = challengeAvailable[index].end_datetime;
    const unitDate = challengeAvailable[index].untilDate;

    if (!unitDate || endDateTime.getTime() > unitDate.getTime()) {
      tempChallenge[index].untilDate = moment(endDateTime).add(5, 'm').toDate();
    }

    setChallengeAvailable(tempChallenge);
    setEndDateVisible(!endDateVisible);
  };

  const onUntilDateChange = (date, index) => {
    const tempChallenge = challengeAvailable;
    tempChallenge[index].untilDate = tempChallenge[index].allDay
      ? new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          23,
          59,
          59,
        )
      : date;
    setUntilDateVisible(!untilDateVisible);
    setChallengeAvailable([...tempChallenge]);
  };

  const checkSlotsOverlapping = () => {
    let overLappedValues = [];
    let is_overLapped = false;
    challengeAvailable.forEach((item, index) => {
      challengeAvailable.forEach((value, key) => {
        if (index !== key) {
          if (item.isBlock !== value.isBlock) {
            if (
              getTCDate(item.start_datetime) >
                getTCDate(value.start_datetime) &&
              getTCDate(item.start_datetime) < getTCDate(value.end_datetime)
            ) {
              overLappedValues.push(index);
              overLappedValues.push(key);
              is_overLapped = true;
            }
            if (
              getTCDate(item.end_datetime) > getTCDate(value.start_datetime) &&
              getTCDate(item.end_datetime) < getTCDate(value.end_datetime)
            ) {
              overLappedValues.push(index);
              overLappedValues.push(key);
              is_overLapped = true;
            }
          }
        }
      });
    });
    overLappedValues = overLappedValues.filter(
      (item, index) => overLappedValues.indexOf(item) === index,
    );
    setOverlappedItems(overLappedValues);
    return is_overLapped;
  };

  const handleSave = () => {
    if (oneTime) {
      const res = checkSlotsOverlapping();
      if (res) {
        Alert.alert(strings.overlappingAvailability);
        return false;
      }
    }
    setLoading(true);
    const entity = authContext.entity;
    const uid = entity.uid || entity.auth.user_id;
    const entityRole =
      entity.role === Verbs.entityTypeUser ? 'users' : 'groups';
    const filterData = [];
    let obj = {};
    challengeAvailable.forEach((challenge_item) => {
      const startDate = challenge_item.start_datetime;
      obj = {
        blocked: challenge_item.isBlock,
        allDay: challenge_item.allDay,
        start_datetime: getTCDate(startDate),
        end_datetime: getTCDate(challenge_item.end_datetime),
        is_recurring: challenge_item.is_recurring,
        repeat: challenge_item.repeat,
      };

      let rule;
      if (challenge_item.repeat === Verbs.eventRecurringEnum.Daily) {
        rule = 'FREQ=DAILY';
      } else if (challenge_item.repeat === Verbs.eventRecurringEnum.Weekly) {
        rule = 'FREQ=WEEKLY';
      } else if (
        challenge_item.repeat === Verbs.eventRecurringEnum.WeekOfMonth
      ) {
        rule = `FREQ=MONTHLY;BYDAY=${getDayFromDate(startDate)
          .substring(0, 2)
          .toUpperCase()};BYSETPOS=${countNumberOfWeeks(startDate)}`;
      } else if (
        challenge_item.repeat === Verbs.eventRecurringEnum.DayOfMonth
      ) {
        rule = `FREQ=MONTHLY;BYMONTHDAY=${startDate.getDate()}`;
      } else if (
        challenge_item.repeat === Verbs.eventRecurringEnum.WeekOfYear
      ) {
        rule = `FREQ=YEARLY;BYDAY=${getDayFromDate(startDate)
          .substring(0, 2)
          .toUpperCase()};BYSETPOS=${countNumberOfWeeks(startDate)}`;
      } else if (challenge_item.repeat === Verbs.eventRecurringEnum.DayOfYear) {
        rule = `FREQ=YEARLY;BYMONTHDAY=${startDate.getDate()};BYMONTH=${startDate.getMonth()}`;
      }

      if (challenge_item.is_recurring === true) {
        obj.untilDate = getTCDate(challenge_item.untilDate);
        obj.rrule = rule;
      }

      filterData.push(obj);
    });

    editSlots(entityRole, uid, filterData, authContext)
      .then((response) => {
        setTimeout(() => {
          if (addToSlotData && deleteFromSlotData) {
            deleteOrCreateSlotData(response.payload);
          }
          setLoading(false);
          closeModal();
        }, 5000);
      })
      .catch((error) => {
        setLoading(false);
        console.log('Error ::--', error);
      });
    return true;
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeModal}
      modalType={isFromSlot ? ModalTypes.style4 : ModalTypes.style1}
      title={strings.editChallengeAvailibility}
      headerRightButtonText={strings.save}
      onRightButtonPress={handleSave}
      containerStyle={{paddingHorizontal: 15}}
      externalSnapPoints={snapPoints}>
      <View
        onLayout={(event) => {
          const contentHeight = event.nativeEvent.layout.height + 80;

          setSnapPoints([
            '50%',
            contentHeight,
            Dimensions.get('window').height - 40,
          ]);
        }}>
        <ActivityLoader visible={loading} />
        <FlatList
          data={challengeAvailable}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <>
              {!slotLevel && !isFromSlot && (
                <>
                  <View>
                    <Text style={styles.headerTitle}>
                      {strings.editTimeSlots}
                    </Text>
                    <Text style={styles.headerTextStyle}>
                      {strings.editChallengeTitle}
                    </Text>
                  </View>

                  <AvailabilityTypeTabView
                    optionList={[strings.oneTime, strings.recurring]}
                    oneTime={oneTime}
                    onFirstTabPress={() => {
                      setOneTime(true);
                      setRecurringAvailability(challengeAvailable);
                      setChallengeAvailable(oneTimeAvailability);
                      if (setHeightRange) {
                        setHeightRange(0.6);
                      }
                    }}
                    onSecondTabPress={() => {
                      setOneTime(false);
                      setOneTimeAvailability(challengeAvailable);
                      setChallengeAvailable(recurringAvailability);
                      if (setHeightRange) {
                        setHeightRange(0.7);
                      }
                    }}
                    style={{marginTop: 23, marginBottom: 25}}
                  />
                </>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginBottom: 5,
                }}>
                <Text style={{fontSize: 14, fontFamily: fonts.RLight}}>
                  {strings.timezone} &nbsp;
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(strings.timezoneAvailability);
                  }}>
                  <Text
                    style={{
                      textDecorationLine: 'underline',
                      textDecorationStyle: 'solid',
                      textDecorationColor: colors.darkGrey,
                    }}>
                    {Intl.DateTimeFormat()
                      ?.resolvedOptions()
                      .timeZone.split('/')
                      .pop()}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          renderItem={({item: data, index}) => {
            const challengeItems = [...challengeAvailable];
            const background = challengeAvailable[index].isBlock
              ? colors.grayBackgroundColor
              : colors.availabilitySlotsBackground;
            const itemStartDateTime = new Date(
              challengeItems[index].start_datetime,
            );
            itemStartDateTime.setHours(0, 0, 0, 0);
            const itemStartBeginingTime = getTCDate(itemStartDateTime);
            const currentStartDateTime = getTCDate(new Date());
            let blockAllDay = false;
            if (currentStartDateTime > itemStartBeginingTime) {
              blockAllDay = true;
            }
            return (
              <View
                style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: background,
                  borderWidth: 1,
                  borderColor: overlappedItems.includes(index)
                    ? colors.redColor
                    : background,
                }}>
                <View style={styles.toggleViewStyle}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      style={styles.checkbox}
                      onPress={() => {
                        const tempChallenge = [...challengeAvailable];
                        tempChallenge[index].allDay =
                          !tempChallenge[index].allDay;
                        if (!tempChallenge[index].is_recurring) {
                          if (tempChallenge[index].allDay) {
                            const start = new Date(
                              tempChallenge[index].start_datetime,
                            );
                            const tempStart = new Date(
                              tempChallenge[index].start_datetime,
                            );
                            start.setHours(0, 0, 0, 0);
                            const startSlotTime = getTCDate(start);
                            const endSlotTime = startSlotTime + 24 * 60 * 60;
                            tempChallenge[index].start_datetime =
                              getJSDate(startSlotTime);
                            tempChallenge[index].end_datetime =
                              getJSDate(endSlotTime);
                            if (blockAllDay) {
                              tempChallenge[index].start_datetime = new Date(
                                tempStart,
                              );
                            }
                            setShowAddTimeButton(false);
                          } else {
                            tempChallenge[index].start_datetime =
                              tempChallenge[index].previous_start_datetime;
                            tempChallenge[index].end_datetime =
                              tempChallenge[index].previous_end_datetime;
                            setShowAddTimeButton(true);
                          }
                        }
                        setChallengeAvailable(tempChallenge);
                      }}>
                      <Image
                        source={
                          challengeAvailable[index].allDay
                            ? images.checkWhiteLanguage
                            : images.uncheckWhite
                        }
                        style={styles.checkboxImg}
                        resizeMode={'contain'}
                      />
                    </TouchableOpacity>
                    <Text style={styles.allDayText}>{strings.allDay}</Text>
                  </View>
                  <BlockAvailableTabView
                    blocked={challengeAvailable[index].isBlock}
                    firstTabTitle={strings.block}
                    secondTabTitle={strings.setAvailable}
                    onFirstTabPress={() => {
                      const tempChallenge = [...challengeAvailable];
                      tempChallenge[index].isBlock = true;
                      setChallengeAvailable(tempChallenge);
                    }}
                    onSecondTabPress={() => {
                      const tempChallenge = [...challengeAvailable];
                      tempChallenge[index].isBlock = false;
                      setChallengeAvailable(tempChallenge);
                    }}
                    style={styles.blockStyle}
                    activeEventPricacy={styles.activeEventPricacy}
                    inactiveEventPricacy={styles.inactiveEventPricacy}
                    activeEventPrivacyText={styles.activeEventPrivacyText}
                    inactiveEventPrivacyText={styles.activeEventPrivacyText}
                  />
                  {!slotLevel && index !== 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        deleteItemById(data.id);
                      }}>
                      <Image
                        source={images.crossSingle}
                        style={styles.crossImg}
                        resizeMode={'contain'}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <EventTimeSelectItem
                  title={strings.starts}
                  toggle={!challengeAvailable[index].allDay}
                  headerTextStyle={{paddingLeft: 0}}
                  style={{
                    backgroundColor: colors.whiteColor,
                    // width: wp('88%'),
                  }}
                  date={
                    challengeAvailable[index].start_datetime
                      ? moment(
                          new Date(challengeAvailable[index].start_datetime),
                        ).format('ll')
                      : moment(new Date()).format('ll')
                  }
                  time={
                    challengeAvailable[index].start_datetime
                      ? moment(
                          new Date(challengeAvailable[index].start_datetime),
                        ).format('h:mm a')
                      : moment(new Date()).format('h:mm a')
                  }
                  onDatePress={() => {
                    setCurrentIndex(index);
                    setStartDateVisible(!startDateVisible);
                  }}
                />
                <EventTimeSelectItem
                  style={{
                    backgroundColor: colors.whiteColor,
                  }}
                  title={strings.ends}
                  toggle={!challengeAvailable[index].allDay}
                  headerTextStyle={{paddingLeft: 0}}
                  date={
                    challengeAvailable[index].end_datetime
                      ? moment(
                          new Date(challengeAvailable[index].end_datetime),
                        ).format('ll')
                      : moment(new Date()).format('ll')
                  }
                  time={
                    challengeAvailable[index].end_datetime
                      ? moment(
                          new Date(challengeAvailable[index].end_datetime),
                        ).format('h:mm a')
                      : moment(new Date()).format('h:mm a')
                  }
                  containerStyle={{marginBottom: 8}}
                  onDatePress={() => {
                    setCurrentIndex(index);
                    setEndDateVisible(!endDateVisible);
                  }}
                />

                {!oneTime && (
                  <EventMonthlySelection
                    containerStyle={{
                      backgroundColor: colors.whiteColor,
                      // backgroundColor: 'red',
                    }}
                    title={strings.repeat}
                    dataSource={[
                      {
                        label: strings.daily,
                        value: Verbs.eventRecurringEnum.Daily,
                      },
                      {
                        label: strings.weeklyText,
                        value: Verbs.eventRecurringEnum.Weekly,
                      },
                      {
                        label: format(
                          strings.monthlyOnText,
                          `${countNumberOfWeekFromDay(
                            challengeAvailable[index].start_datetime,
                          )} ${getDayFromDate(
                            challengeAvailable[index].start_datetime,
                          )}`,
                        ),
                        value: Verbs.eventRecurringEnum.WeekOfMonth,
                      },
                      {
                        label: format(
                          strings.monthlyOnDayText,
                          ordinal_suffix_of(
                            challengeAvailable[index].start_datetime.getDate(),
                          ),
                        ),
                        value: Verbs.eventRecurringEnum.DayOfMonth,
                      },
                      {
                        label: format(
                          strings.yearlyOnText,
                          `${countNumberOfWeekFromDay(
                            challengeAvailable[index].start_datetime,
                          )} ${getDayFromDate(
                            challengeAvailable[index].start_datetime,
                          )}`,
                        ),
                        value: Verbs.eventRecurringEnum.WeekOfYear,
                      },
                      {
                        label: format(
                          strings.yearlyOnDayText,
                          ordinal_suffix_of(
                            challengeAvailable[index].start_datetime.getDate(),
                          ),
                        ),
                        value: Verbs.eventRecurringEnum.DayOfYear,
                      },
                    ]}
                    placeholder={strings.doesNotRepeat}
                    value={challengeAvailable[index].repeat}
                    onValueChange={(value) => {
                      const tempChallenge = [...challengeAvailable];
                      tempChallenge[index].is_recurring =
                        value !== Verbs.eventRecurringEnum.Never;
                      tempChallenge[index].repeat = value;
                      setChallengeAvailable(tempChallenge);
                    }}
                    fontColor={
                      challengeAvailable[index].isBlock
                        ? colors.darkGrayColor
                        : colors.availabilitySlotsBackground
                    }
                  />
                )}
                {challengeAvailable[index].is_recurring === true && (
                  <EventTimeSelectItem
                    style={{
                      backgroundColor: colors.whiteColor,
                    }}
                    title={strings.until}
                    toggle={!challengeAvailable[index].allDay}
                    date={
                      challengeAvailable[index].untilDate
                        ? moment(challengeAvailable[index].untilDate).format(
                            'll',
                          )
                        : moment(challengeAvailable[index].end_datetime)
                            .add(1, 'Y')
                            .format('ll')
                    }
                    time={
                      challengeAvailable[index].untilDate
                        ? moment(challengeAvailable[index].untilDate).format(
                            'h:mm a',
                          )
                        : moment(challengeAvailable[index].end_datetime).format(
                            'h:mm a',
                          )
                    }
                    containerStyle={{marginBottom: 12}}
                    onDatePress={() => {
                      setCurrentIndex(index);
                      setUntilDateVisible(!untilDateVisible);
                    }}
                  />
                )}
              </View>
            );
          }}
          ListFooterComponent={() =>
            oneTime && showAddMore && showAddTimeButton ? (
              <AddTimeItem
                addTimeText={strings.addTime}
                source={images.plus}
                onAddTimePress={() => {
                  const obj = {
                    id: challengeAvailable.length,
                    isBlock: true,
                    allDay: false,
                    is_recurring: false,
                    start_datetime: getRoundedDate(5),
                    end_datetime: moment(getRoundedDate(5))
                      .add(5, 'm')
                      .toDate(),
                    previous_start_datetime: getRoundedDate(5),
                    previous_end_datetime: moment(getRoundedDate(5))
                      .add(5, 'm')
                      .toDate(),
                  };
                  setChallengeAvailable([...challengeAvailable, obj]);
                }}
              />
            ) : (
              <></>
            )
          }
          ListFooterComponentStyle={{marginTop: 20}}
          ItemSeparatorComponent={() => <View style={{height: wp('3%')}} />}
          keyExtractor={(itemValue, index) => index.toString()}
        />

        <DateTimePickerView
          title={
            challengeAvailable[currentIndex]?.allDay
              ? strings.choosedateText
              : strings.chooseDateTimeText
          }
          visible={startDateVisible}
          onDone={(date) => {
            onStartDateChange(date, currentIndex);
          }}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          minimumDate={getRoundedDate(5)}
          mode={challengeAvailable[currentIndex]?.allDay ? 'date' : 'datetime'}
          date={challengeAvailable[currentIndex]?.start_datetime}
          minutesGap={5}
        />
        <DateTimePickerView
          title={
            challengeAvailable[currentIndex]?.allDay
              ? strings.choosedateText
              : strings.chooseDateTimeText
          }
          visible={endDateVisible}
          onDone={(date) => {
            onEndDateChange(date, currentIndex);
          }}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          minimumDate={moment(challengeAvailable[currentIndex]?.start_datetime)
            .add(5, 'm')
            .toDate()}
          mode={challengeAvailable[currentIndex]?.allDay ? 'date' : 'datetime'}
          date={challengeAvailable[currentIndex]?.end_datetime}
          minutesGap={5}
        />
        <DateTimePickerView
          visible={untilDateVisible}
          onDone={(date) => {
            onUntilDateChange(date, currentIndex);
          }}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          minimumDate={moment(challengeAvailable[currentIndex]?.end_datetime)
            .add(5, 'm')
            .toDate()}
          minutesGap={5}
          mode={challengeAvailable[currentIndex]?.allDay ? 'date' : 'datetime'}
          date={challengeAvailable[currentIndex]?.untilDate}
        />
      </View>
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  blockStyle: {
    width: wp('45%'),
    marginVertical: 0,
    borderRadius: 8,
  },
  activeEventPricacy: {
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.grayBackgroundColor,
  },

  activeEventPrivacyText: {
    fontSize: 12,
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
    marginLeft: wp('1.5%'),
  },
  checkboxImg: {
    width: wp('4.5%'),
    height: wp('4.5%'),
  },
  crossImg: {
    width: wp('3.5%'),
    height: wp('3.5%'),
  },
  checkbox: {
    alignSelf: 'center',
    right: wp(0),
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    marginBottom: 5,
  },
  headerTextStyle: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
