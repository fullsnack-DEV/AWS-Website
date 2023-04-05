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
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import AddTimeItem from '../../../components/Schedule/AddTimeItem';
import ActivityLoader from '../../../components/loader/ActivityLoader';
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
  getRoundedDate
} from '../../../utils';

export default function ChallengeAvailability({
  setVisibleAvailabilityModal, 
  slots, 
  addToSlotData,
  showAddMore = false,
  setHeightRange,
  deleteFromSlotData,
  deleteOrCreateSlotData,
  slotLevel=false
}) {

  const authContext = useContext(AuthContext);
  const [challengeAvailable, setChallengeAvailable] = useState([]);
  const [oneTimeAvailability, setOneTimeAvailability] = useState([
    {
      id: 0,
      isBlock: true,
      allDay: false,
      start_datetime: getRoundedDate(5),
      end_datetime: moment(getRoundedDate(5)).add(5, 'm').toDate(),
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


  useEffect(() => {
    if(slots.length > 0){
      const editableSlots = [];
      slots.forEach((item , index) => {
          const temp = {
            id : index,
            isBlock : item.blocked,
            allDay: false,
            start_datetime : getJSDate(item.start_datetime),
            end_datetime : getJSDate(item.end_datetime),
            is_recurring : false
          }
          editableSlots.push(temp);
      });
      setOneTimeAvailability(editableSlots);
      setChallengeAvailable(editableSlots);
    }

    if(slotLevel) {
      setOneTime(false)
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


  const checkSlotsOverlapping = () => {
    let overLappedValues = [];
    let is_overLapped = false;
    challengeAvailable.forEach((item , index) => {
      challengeAvailable.forEach((value , key) => {
        if(index !== key) {
          if(item.isBlock !== value.isBlock) {
            if(getTCDate(item.start_datetime) > getTCDate(value.start_datetime) && 
            getTCDate(item.start_datetime) < getTCDate(value.end_datetime)) {
              overLappedValues.push(index);
              overLappedValues.push(key);
              is_overLapped = true;
            }
            if(getTCDate(item.end_datetime) > getTCDate(value.start_datetime) && 
            getTCDate(item.end_datetime) < getTCDate(value.end_datetime)) {
              overLappedValues.push(index);
              overLappedValues.push(key);
              is_overLapped = true;
            }
          }
        }
      });
    });
    overLappedValues = overLappedValues.filter((item,index) => overLappedValues.indexOf(item) === index);
    setOverlappedItems(overLappedValues);
    return is_overLapped;
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
              if(oneTime) {
                const res = checkSlotsOverlapping();
                if(res) {
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
              .then((response) => {
                setTimeout(() => {
                  if(addToSlotData && deleteFromSlotData) {
                    deleteOrCreateSlotData(response.payload)
                  }
                  setLoading(false);
                  setVisibleAvailabilityModal(false);
                }, 5000);
              })
              .catch((error) => {
                setLoading(false);
                console.log('Error ::--', error);
              });
              return true;
            }}>

            <Text>{strings.save}</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.sperateLine} />
      <View>
        <ScrollView bounces={false} >
          <SafeAreaView>
            <View style={[styles.containerStyle ,  {paddingTop: 20}]}>
              {
              !slotLevel && (
              <>
              <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Text style={styles.headerTextStyle}>
                  {strings.editChallengeTitle}{' '}
                </Text>
              </View>

              <AvailabilityTypeTabView
                oneTime={oneTime}
                firstTabTitle='One-time'
                secondTabTitle='Recurring'
                onFirstTabPress={() => {
                  setOneTime(true);
                  setRecurringAvailability(challengeAvailable);
                  setChallengeAvailable(oneTimeAvailability);
                  if(setHeightRange) {
                    setHeightRange(0.6)
                  }
                }}
                onSecondTabPress={() => {
                  setOneTime(false); 
                  setOneTimeAvailability(challengeAvailable);
                  setChallengeAvailable(recurringAvailability);
                  if(setHeightRange) {
                    setHeightRange(0.7)
                  }
                }}
                style={styles.availabilityTabViewStyle}
                activeEventPricacy={styles.activeEventPricacy}
                inactiveEventPricacy={styles.inactiveEventPricacy}
                activeEventPrivacyText={styles.activeEventPrivacyText}
                inactiveEventPrivacyText={styles.activeEventPrivacyText}
              />
              </>
              )}
              <View style={{flexDirection: 'row', justifyContent: 'flex-end' , marginBottom: 5}}>
                <Text>
                  {strings.timezone} &nbsp;
                </Text>
                <TouchableOpacity 
                  onPress={() => {Alert.alert(strings.timezoneAvailability)}}>
                    <Text
                    style={{
                      textDecorationLine: 'underline',
                      textDecorationStyle: 'solid',
                      textDecorationColor: '#000'
                    }} 
                    >{strings.vancouver}</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={challengeAvailable}
                showsHorizontalScrollIndicator={false}
                renderItem={({item: data, index}) => {
                  const background = challengeAvailable[index].isBlock ? colors.grayBackgroundColor : colors.availabilitySlotsBackground;
                  return (
                  <View style={{
                    marginTop: 10, 
                    padding: 10, 
                    backgroundColor: background,
                    borderWidth: 1,
                    borderColor: overlappedItems.includes(index) ? colors.redColor : background
                  }}>
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
                      <TouchableOpacity
                        onPress={() => {
                          deleteItemById(data.id);
                        }}>
                          <Image
                            source={
                              images.crossSingle
                            }
                            style={styles.crossImg}
                            resizeMode={'contain'}
                          />
                      </TouchableOpacity>
                    </View>
                    <EventTimeSelectItem
                      title={strings.starts}
                      toggle={!challengeAvailable[index].allDay}
                      headerTextStyle={{paddingLeft: 0}}
                      style={{backgroundColor: colors.whiteColor, width: wp('88%')}}
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
                      style={{backgroundColor: colors.whiteColor, width: wp('88%')}}
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

                    {
                    !oneTime && (
                    <EventMonthlySelection
                      containerStyle={{backgroundColor: colors.whiteColor, width: wp('88%')}}
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
                      fontColor = {challengeAvailable[index].isBlock ? colors.darkGrayColor : colors.availabilitySlotsBackground}
                    />
                    )} 
                    {challengeAvailable[index].is_recurring === true  && (
                      <EventTimeSelectItem
                        style={{backgroundColor: colors.whiteColor, width: wp('88%')}}
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
                )}}
                ListFooterComponent={() => (
                  oneTime && showAddMore ?  (                 
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
                  ): (<></>)
                )}
                ListFooterComponentStyle={{marginTop: 20}}
                ItemSeparatorComponent={() => <View style={{height: wp('3%')}} />}
                keyExtractor={(itemValue, index) => index.toString()}
              />
            </View>
          </SafeAreaView>
        </ScrollView>
        {/* <BlockAvailableTabView
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
        /> */}
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
    width: wp('45%'),
    marginVertical: 0,
    borderRadius: 8
  },
  availabilityTabViewStyle:{
    width: wp('94%'),
    marginVertical: 0,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 20
  },
  activeEventPricacy: {
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.grayBackgroundColor
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
  containerStyle: {
    width: wp('96%'),
    alignSelf: 'center',
    padding: wp('1.5%'),
    marginHorizontal: 20
  },
  headerTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    marginVertical: 3,
    color: colors.lightBlackColor,
  },
});
