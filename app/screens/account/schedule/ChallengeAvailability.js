/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import moment from 'moment';
import {format} from 'react-string-format';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AuthContext from '../../../auth/context';
import Header from '../../../components/Home/Header';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import AddTimeItem from '../../../components/Schedule/AddTimeItem';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {editSlots} from '../../../api/Schedule';
import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';
import BlockAvailableTabView from '../../../components/Schedule/BlockAvailableTabView';
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
  getRoundedDate
} from '../../../utils';

export default function ChallengeAvailability({
  setVisibleAvailabilityModal, 
  slots, 
  slotType, 
  setEditableSlotsType, 
  addToSlotData,
  deleteFromSlotData}) {

  const authContext = useContext(AuthContext);
  const [challengeAvailable, setChallengeAvailable] = useState([
    {
      id: 0,
      isBlock: true,
      allDay: false,
      start_datetime: getRoundedDate(5),
      end_datetime: moment(getRoundedDate(5)).add(5, 'm').toDate(),
      is_recurring: false,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    if(slots.length > 0){
      const editableSlots = [];
      slots.forEach((item , index) => {
          const temp = {
            id : index,
            isBlock : !item.blocked,
            allDay: false,
            start_datetime : getJSDate(item.start_datetime),
            end_datetime : getJSDate(item.end_datetime),
            is_recurring : false
          }
          editableSlots.push(temp);
      });
      setChallengeAvailable(editableSlots)
    }
  },[]);

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
    const startDateTime = tempChallenge[index]
    .allDay
    ? new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0,
      )
    : date;
    tempChallenge[index].start_datetime = startDateTime
    let endDateTime = tempChallenge[index].end_datetime;
    const unitDate = challengeAvailable[index].untilDate;
    
    if (endDateTime.getTime() <= startDateTime.getTime()){
      endDateTime = tempChallenge[index]
      .allDay
      ? new Date(
        startDateTime.getFullYear(),
        startDateTime.getMonth(),
        startDateTime.getDate(),
          23,
          59,
          59,
        )
      :  moment(startDateTime).add(5, 'm').toDate();
    }

    tempChallenge[index].end_datetime = endDateTime

    if(!unitDate || endDateTime.getTime() > unitDate.getTime()){
      tempChallenge[index].untilDate = moment(endDateTime).add(5, 'm').toDate();
    }

    setChallengeAvailable(tempChallenge)
    setStartDateVisible(!startDateVisible);
  }

  const onEndDateChange = (date, index) => {
    const tempChallenge = [...challengeAvailable];
    tempChallenge[index].end_datetime = tempChallenge[index]
      .allDay
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

    if(!unitDate || endDateTime.getTime() > unitDate.getTime()){
      tempChallenge[index].untilDate = moment(endDateTime).add(5, 'm').toDate();
    }

    setChallengeAvailable(tempChallenge);
    setEndDateVisible(!endDateVisible);
  }

  const onUntilDateChange = (date, index) => {
    const tempChallenge = challengeAvailable;
    tempChallenge[index].untilDate = tempChallenge[index]
      .allDay
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
  }


  return (
    <View
      style={styles.mainContainerStyle}
    >
      <ActivityLoader visible={loading} />
      <Header
        safeAreaStyle={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20
        }}
        leftComponent={
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                strings.areYouSureQuitEditChallengeAvailibilityText,
                '',
                [
                  {
                    text: strings.cancel,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: strings.quit,
                    onPress: () => setVisibleAvailabilityModal(false),
                  },
                ],
                {cancelable: false},
              );
            }}>
            <Image source={images.crossImage} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>
            {strings.editChallengeAvailibility}
          </Text>
        }
        rightComponent={
          <TouchableOpacity
            style={{padding: 2}}
            onPress={() => {
              setLoading(true);
              const entity = authContext.entity;
              const uid = entity.uid || entity.auth.user_id;
              const entityRole =
                entity.role === Verbs.entityTypeUser ? 'users' : 'groups';
              const filterData = [];
              let obj = {};
              challengeAvailable.map((challenge_item) => {
                const startDate = challenge_item.start_datetime
                obj = {
                  blocked: challenge_item.isBlock,
                  allDay: challenge_item.allDay,
                  start_datetime: getTCDate(startDate),
                  end_datetime: getTCDate(challenge_item.end_datetime),
                  is_recurring: challenge_item.is_recurring,
                  repeat: challenge_item.repeat,
                };

                let rule
                if (challenge_item.repeat === Verbs.eventRecurringEnum.Daily) {
                  rule =  'FREQ=DAILY'
                } else if ( challenge_item.repeat === Verbs.eventRecurringEnum.Weekly) {
                  rule =  'FREQ=WEEKLY'
                } else if ( challenge_item.repeat === Verbs.eventRecurringEnum.WeekOfMonth) {
                  rule = `FREQ=MONTHLY;BYDAY=${getDayFromDate(startDate)
                    .substring(0, 2)
                    .toUpperCase()};BYSETPOS=${countNumberOfWeeks(startDate)}`;
                } else if ( challenge_item.repeat === Verbs.eventRecurringEnum.DayOfMonth) {
                    rule = `FREQ=MONTHLY;BYMONTHDAY=${startDate.getDate()}`;
                } else if ( challenge_item.repeat === Verbs.eventRecurringEnum.WeekOfYear) {
                  rule = `FREQ=YEARLY;BYDAY=${getDayFromDate(startDate)
                    .substring(0, 2)
                    .toUpperCase()};BYSETPOS=${countNumberOfWeeks(startDate)}`;
                } else if ( challenge_item.repeat === Verbs.eventRecurringEnum.DayOfYear) {
                  rule = `FREQ=YEARLY;BYMONTHDAY=${startDate.getDate()};BYMONTH=${startDate.getMonth()}`;
                }

                if (challenge_item.is_recurring === true) {
                  obj.untilDate = getTCDate(challenge_item.untilDate);
                  obj.rrule = rule;
                }

                filterData.push(obj);
              });

           
              editSlots(entityRole, uid, filterData, authContext)
              .then(() => {
                setTimeout(() => {
                  if(addToSlotData && deleteFromSlotData) {
                    if(slotType) {
                      addToSlotData(filterData)
                    }else{
                      deleteFromSlotData(filterData)
                    }
                  }
                  setLoading(false);
                  setVisibleAvailabilityModal(false);
                }, 5000);
              })
              .catch((error) => {
                setLoading(false);
                console.log('Error ::--', error);
              });
            }}>
            <Text>{strings.done}</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.sperateLine} />
      <View>
        <ScrollView bounces={false} style={{height : '75%'}}>
          <SafeAreaView>
            <EventItemRender title={strings.editChallengeTitle}>
              <FlatList
                data={challengeAvailable}
                showsHorizontalScrollIndicator={false}
                renderItem={({item: data, index}) => (
                  <View style={{marginTop: 10}}>
                    <View style={styles.toggleViewStyle}>
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          style={styles.checkbox}
                          onPress={() => {
                            const tempChallenge = [...challengeAvailable];
                            tempChallenge[index].allDay =
                              !tempChallenge[index].allDay;
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
                      <Text
                        style={styles.deleteTextStyle}
                        onPress={() => {
                          deleteItemById(data.id);
                        }}>
                        {strings.delete}
                      </Text>
                    </View>
                    <EventTimeSelectItem
                      title={strings.starts}
                      toggle={!challengeAvailable[index].allDay}
                      headerTextStyle={{paddingLeft: 0}}
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
                        }
                      }
                    />

                    <EventMonthlySelection
                      title={strings.repeat}
                      dataSource={[
                        {label: strings.daily, value: Verbs.eventRecurringEnum.Daily},
                        {label: strings.weeklyText, value: Verbs.eventRecurringEnum.Weekly},
                        {
                          label: format(
                            strings.monthlyOnText,
                            `${countNumberOfWeekFromDay(challengeAvailable[index].start_datetime)} ${getDayFromDate(challengeAvailable[index].start_datetime)}`,
                          ),
                          value: Verbs.eventRecurringEnum.WeekOfMonth
                        },
                        {
                          label: format(
                            strings.monthlyOnDayText,
                            ordinal_suffix_of(challengeAvailable[index].start_datetime.getDate()),
                          ),
                          value: Verbs.eventRecurringEnum.DayOfMonth,
                        },
                        {
                          label: format(
                            strings.yearlyOnText,
                            `${countNumberOfWeekFromDay(challengeAvailable[index].start_datetime)} ${getDayFromDate(challengeAvailable[index].start_datetime)}`,
                          ),
                          value: Verbs.eventRecurringEnum.WeekOfYear
                        },
                        {
                          label: format(
                            strings.yearlyOnDayText,
                            ordinal_suffix_of(challengeAvailable[index].start_datetime.getDate()),
                          ),
                          value: Verbs.eventRecurringEnum.DayOfYear,
                        }
                      ]}
                      placeholder={strings.doesNotRepeat}
                      value={challengeAvailable[index].repeat}
                      onValueChange={(value) => {
                        const tempChallenge = [...challengeAvailable];
                        tempChallenge[index].is_recurring = value !== Verbs.eventRecurringEnum.Never;
                        tempChallenge[index].repeat = value;
                        setChallengeAvailable(tempChallenge);
                      }}
                    />
                    {challengeAvailable[index].is_recurring === true && (
                      <EventTimeSelectItem
                        title={strings.until}
                        toggle={!challengeAvailable[index].allDay}
                        date={
                          challengeAvailable[index].untilDate
                            ? moment(challengeAvailable[index].untilDate).format(
                                'll',
                              )
                            : moment(challengeAvailable[index].end_datetime).add(1, 'Y').format('ll')
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
                        }
                      }
                      />
                    )}

                    <DateTimePickerView
                      title={
                        challengeAvailable[currentIndex].allDay
                          ? strings.choosedateText
                          : strings.chooseDateTimeText
                      }
                      visible={startDateVisible}
                      onDone={(date) => {
                        onStartDateChange(date, currentIndex)
                      }}
                      onCancel={handleCancelPress}
                      onHide={handleCancelPress}
                      minimumDate={getRoundedDate(5)}
                      mode={
                        challengeAvailable[currentIndex].allDay ? 'date' : 'datetime'
                      }
                      date={challengeAvailable[currentIndex].start_datetime}
                      minutesGap={5}
                    />
                    <DateTimePickerView
                      title={
                        challengeAvailable[currentIndex].allDay
                          ? strings.choosedateText
                          : strings.chooseDateTimeText
                      }
                      visible={endDateVisible}
                      onDone={(date) => {
                        onEndDateChange(date,currentIndex)
                      }}
                      onCancel={handleCancelPress}
                      onHide={handleCancelPress}
                      minimumDate={moment(challengeAvailable[currentIndex].start_datetime).add(5, 'm').toDate()}
                      mode={challengeAvailable[currentIndex].allDay ? 'date' : 'datetime'}
                      date={challengeAvailable[currentIndex].end_datetime}
                      minutesGap={5}
                    />
                    <DateTimePickerView
                      visible={untilDateVisible}
                      onDone={(date) => {
                        onUntilDateChange(date, currentIndex)
                      }}
                      onCancel={handleCancelPress}
                      onHide={handleCancelPress}
                      minimumDate={
                        moment(challengeAvailable[currentIndex].end_datetime)
                            .add(5, 'm')
                            .toDate()
                      }
                      minutesGap={5}
                      mode={
                        challengeAvailable[currentIndex].allDay ? 'date' : 'datetime'
                      }
                      date={challengeAvailable[currentIndex].untilDate}
                    />
                  </View>
                )}
                ListFooterComponent={() => (
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
                        end_datetime: moment(getRoundedDate(5)).add(5, 'm').toDate(),
                      };
                      setChallengeAvailable([...challengeAvailable, obj]);
                    }}
                  />
                )}
                ListFooterComponentStyle={{marginTop: 20}}
                ItemSeparatorComponent={() => <View style={{height: wp('3%')}} />}
                keyExtractor={(itemValue, index) => index.toString()}
              />
            </EventItemRender>
          </SafeAreaView>
        </ScrollView>
        <BlockAvailableTabView
          blocked={slotType}
          firstTabTitle={strings.block}
          secondTabTitle={strings.setAvailable}
          onFirstTabPress={() => {
            const tempChallenge = [...challengeAvailable]
            const result = tempChallenge.map((item) =>  ({ ...item, isBlock : true }));
            setChallengeAvailable(result);
            setEditableSlotsType(true)
          }}
          onSecondTabPress={() => {
            const tempChallenge = [...challengeAvailable];
            const result = tempChallenge.map((item) =>  ({ ...item, isBlock : false }));
            setChallengeAvailable(result);
            setEditableSlotsType(false)
          }}
          style={styles.blockStyle}
          activeEventPricacy={styles.activeEventPricacy}
          inactiveEventPricacy={styles.inactiveEventPricacy}
          activeEventPrivacyText={styles.activeEventPrivacyText}
          inactiveEventPrivacyText={styles.activeEventPrivacyText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
    paddingBottom: 50,
    borderTopLeftRadius: 20,
  },
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    marginVertical: hp('0.5%'),
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },

  blockStyle: {
    width: wp('92%'),
    marginVertical: 0,
    borderRadius: 8,
    marginTop: 30
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
    marginLeft: wp('1.5%'),
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
