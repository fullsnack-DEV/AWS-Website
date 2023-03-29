import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import moment from 'moment';
import _ from 'lodash';
import CalendarPicker from 'react-native-calendar-picker';
import { getJSDate } from '../../../utils';
// eslint-disable-next-line import/no-unresolved
import BlockSlotView from '../../../components/Schedule/BlockSlotView';
import images from '../../../Constants/ImagePath';
import WeeklyCalender from './CustomWeeklyCalender';
import AuthContext from '../../../auth/context';
// import {editSlots} from '../../../api/Schedule';
// import Verbs from '../../../Constants/Verbs';
import colors from '../../../Constants/Colors';
import ChallengeAvailability from './ChallengeAvailability';
import * as Utility from '../../../utils/index';
import fonts from '../../../Constants/Fonts';
import {strings} from '../../../../Localization/translation';
import ActivityLoader from '../../../components/loader/ActivityLoader';

export default function AvailibilityScheduleScreen({
  allSlots,
  onDayPress,
  userData = {},
}) {

  const [weeklyCalender, setWeeklyCalender] = useState(false);
   const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState(allSlots);
  const [slots, setSlots] = useState([]);
  const [slotList, setSlotList] = useState([]);
  const [blockedDaySlots, setBlockedDaySlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editableSlots, setEditableSlots] = useState([]);
  const [listView, setListView] = useState(true);
  const [listViewData, setListViewData] = useState([]);
  const [visibleAvailabilityModal, setVisibleAvailabilityModal] =
    useState(false);

  const authContext = useContext(AuthContext);
  const entity = authContext.entity;
  const uid = entity.uid || entity.auth.user_id;
  // const entityRole = entity.role === Verbs.entityTypeUser ? 'users' : 'groups';

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    setAllData(allSlots);
    setWeeklyCalender(false)
    setLoading(false)
  }, []);

  useEffect(() => {
    prepareSlotArray(selectedDate);
    prepareSlotListArray();
    const blocked = [];
    allSlots.forEach((obj) => {
      if (obj.allDay) {
        blocked.push(moment.unix(obj.start_datetime).format('YYYY-MM-DD'));
      }
    });
    setBlockedDaySlots(blocked);
  }, [allData, selectedDate]);



  useEffect(() => {
    setSlotList(slots);
    setEditableSlots(slots);
  }, [slots]);


  const prepareSlotArray = (dateObj = {}, newItem = {}) => {
    const start = new Date(dateObj);
    start.setHours(0, 0, 0, 0);
    const temp = [];
    const tempSlot = [...allData];

    if (Object.entries(newItem).length > 0) {
      tempSlot.push(newItem);
    }

    for (const blockedSlot of tempSlot) {
      const eventDate = Utility.getJSDate(blockedSlot.start_datetime);
      eventDate.setHours(0, 0, 0, 0);
      if (
        eventDate.getTime() === start.getTime() &&
        blockedSlot.blocked === true
      ) {
        temp.push(blockedSlot);
      }
    }

    let timeSlots = [];
    let allAvailableSlots = [];

    if (temp?.[0]?.allDay === true && temp?.[0]?.blocked === true) {
      setSlots(temp);
    } else {
      timeSlots = createCalenderTimeSlots(Utility.getTCDate(start), 24, temp);
      setSlots(timeSlots);
      allAvailableSlots = getAvailableSlots(timeSlots, dateObj);
    }

    setAvailableSlots(allAvailableSlots);
  };


  const prepareSlotListArray = () => {
    const temp = [];
    const tempSlot = [...allData];
  
    for (const blockedSlot of tempSlot) {
      if (blockedSlot.blocked === true) {
        temp.push(blockedSlot);
      }
    }
    
    if(temp.length > 0) {
      const result = _(temp).groupBy((value) => 
      moment(getJSDate(value.start_datetime)).format('MMM DD, YYYY')).value();
      const filData = [];
      for (const property in result) {
        if(result[property]) {
          let tempVal = {};
          const value = result[property];
          const start = getJSDate(result[property][0]?.start_datetime);
          start.setHours(0, 0, 0, 0);
          tempVal = {
            title: property,
            time: result[property].length > 0 ? result[property][0]?.start_datetime : '',
            data: result[property].length > 0 ? createCalenderTimeSlots(Utility.getTCDate(start), 24, value) : [],
          };
          filData.push(tempVal);
        }
      }
      setListViewData(filData);
    }
  }


  const getAvailableSlots = (timeSlots, dateObj) => {
    const availableTempSlots = [];
    timeSlots.forEach((item) => {
      if (!item.blocked) {
        availableTempSlots.push(item);
      }
    });

    const formattedAvailableSLots = [];
    const start = new Date(dateObj);
    start.setHours(0, 0, 0, 0);
    availableTempSlots.forEach((item) => {
      const tempSlot = {};
      const minutes = Math.ceil((item.end_datetime - item.start_datetime) / 60);
      const minutePercent = Math.ceil((minutes / 1440) * 100);

      const gap = Math.ceil(
        (item.start_datetime - Utility.getTCDate(start)) / 60,
      );
      const gapPercent = Math.ceil((gap / 1440) * 100);

      tempSlot.width = minutePercent;
      tempSlot.marginLeft = gapPercent;

      formattedAvailableSLots.push(tempSlot);
    });
    
    return formattedAvailableSLots;
  };


  const addToSlotData = (data) => {
    const tempData = [...allData];
    data.forEach((item1) => {
      let matched = false;
      allData.forEach((item2, key) => {
        if (
          item1.start_datetime <= item2.end_datetime &&
          item1.end_datetime > item2.end_datetime
        ) {
          tempData[key].end_datetime = item1.end_datetime;
          matched = true;
        } else if (
          item1.end_datetime >= item2.start_datetime &&
          item1.start_datetime < item2.end_datetime
        ) {
          tempData[key].start_datetime = item1.start_datetime;
          matched = true;
        }
      });
      if (!matched) {
        tempData.push(item1);
      }
    });
    setAllData(tempData);
  };


  const createCalenderTimeSlots = (startTime, hours, mslots) => {
    const tSlots = [];
    let startSlotTime = startTime;
    const lastSlotTime = startTime + hours * 60 * 60;
    let last_blocked_index = 0;
    const blockedSlots = mslots.sort(
      (a, b) => new Date(a.start_datetime) - new Date(b.start_datetime),
    );

    blockedSlots.forEach((blockedSlot) => {
      if (lastSlotTime > blockedSlot?.start_datetime) {
        if (startTime === blockedSlot?.start_datetime) {
          tSlots.push({
            start_datetime: blockedSlot.start_datetime,
            end_datetime: blockedSlot.end_datetime,
            blocked: true,
            cal_id: blockedSlot?.cal_id,
            owner_id: blockedSlot?.owner_id,
          });
          startSlotTime = blockedSlot.end_datetime;
          return;
        }

        if (startSlotTime !== blockedSlot?.start_datetime) {
          tSlots.push({
            start_datetime: startSlotTime,
            end_datetime: blockedSlot?.start_datetime,
            blocked: false,
            cal_id: blockedSlot?.cal_id,
            owner_id: blockedSlot?.owner_id,
          });

          tSlots.push({
            start_datetime: blockedSlot.start_datetime,
            end_datetime: blockedSlot.end_datetime,
            blocked: true,
            cal_id: blockedSlot?.cal_id,
            owner_id: blockedSlot?.owner_id,
          });

          startSlotTime = blockedSlot.end_datetime;
          return;
        }

        last_blocked_index = tSlots.length - 1;
        tSlots[last_blocked_index].end_datetime = blockedSlot.end_datetime;
        startSlotTime = blockedSlot.end_datetime;
      }
    });

    if (startSlotTime !== lastSlotTime) {
      tSlots.push({
        start_datetime: startSlotTime,
        end_datetime: lastSlotTime,
        blocked: false,
      });
    }

    if (tSlots.length === 0) {
      tSlots[0].allDay = true;
    }

    return tSlots;
  };


  const deleteFromSlotData = async (delArr) => {
    const tempSlot = [...allSlots];
    delArr.forEach((cal_id) => {
      const index = tempSlot.findIndex((item) => item.cal_id === cal_id);
      allSlots.splice(index, 1);
    })
    
    setAllData([...allSlots]);
  };



  const datesBlacklistFunc = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];

    while (start <= end) {
      dates.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }

    return dates;
  };


  const LeftArrow = () => (
    <>
      <View
        style={{
          width: 25,
          height: 25,
          backgroundColor: '#f5f5f5',
          borderRadius: 5,
        }}>
        <Image
          source={images.leftArrow}
          style={{width: 8, height: 15, marginLeft: 7, marginTop: 5}}
        />
      </View>
    </>
  );


  const RightArrow = () => (
    <>
      <View
        style={{
          width: 25,
          height: 25,
          backgroundColor: '#f5f5f5',
          borderRadius: 5,
        }}>
        <Image
          source={images.rightArrow}
          style={{width: 8, height: 15, marginLeft: 10, marginTop: 5}}
        />
      </View>
    </>
  );

  const today = moment();
  const day = today.clone().startOf('month');
  const customDatesStyles = [];
  while (day.isSame(today, 'year')) {
    let backgroundColorWrapper;
    let background_color;
    let text_color;

    if (
      moment(selectedDate).format('YYYY-MM-DD') ===
      moment(new Date(day.clone())).format('YYYY-MM-DD')
    ) {
      backgroundColorWrapper = colors.themeColor;
      background_color = colors.themeColor;
      text_color = colors.whiteColor;
    } else if (
      blockedDaySlots.includes(moment(day.clone()).format('YYYY-MM-DD'))
    ) {
      backgroundColorWrapper = colors.lightGrey;
      background_color = colors.lightGrey;
      text_color = colors.whiteColor;
    } else if (
      moment(new Date()).format('YYYY-MM-DD') ===
      moment(new Date(day.clone())).format('YYYY-MM-DD')
    ) {
      if (
        moment(new Date()).format('YYYY-MM-DD') !==
        moment(selectedDate).format('YYYY-MM-DD')
      ) {
        backgroundColorWrapper = colors.whiteColor;
      } else {
        backgroundColorWrapper = colors.themeColor;
      }
      background_color = colors.whiteColor;
      text_color = colors.themeColor;
    } else {
      background_color = colors.whiteColor;
      text_color = colors.availabilityBarColor;
    }

    customDatesStyles.push({
      date: day.clone(),
      containerStyle: {
        borderRadius: 5,
        padding: 0,
        width: 35,
        height: 35,
        backgroundColor: backgroundColorWrapper,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 8,
        marginRight: 8,
      },
      style: {
        backgroundColor: background_color,
        borderRadius: 5,
      },
      textStyle: {
        color: text_color,
      },
    });

    day.add(1, 'day');
  }

  return (
    <>
      {
      listView && (
      <View style={{padding: 20}}> 
        <View
          style={{
            width: 100,
            height: 30,
            backgroundColor: '#f5f5f5',
            borderRadius: 5,
            marginTop: 7,
            justifyContent: 'flex-end',
            alignSelf: 'flex-end'
          }}>
          <TouchableOpacity
            onPress={() => setListView(!listView)}>
            <Image
              source={images.toggleCal}
              style={{width: 80, height: 30, alignSelf: 'center'}}
            />
          </TouchableOpacity>
        </View>
      </View>
      )}
      <ScrollView style={{backgroundColor: colors.whiteColor}}>
        <ActivityLoader visible={loading} />
        {
        listView  ? (
          <View>
            <View>
              {
              listViewData.map((list, listKey) => (
                <View key={listKey} style={{marginBottom: 10}}>
                  <View 
                  style={{
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    paddingHorizontal: 20,
                     paddingVertical: 10
                  }}>
                    <Text style={{fontSize: 20}}>
                      {days[getJSDate(list.time).getDay()]},  {list.title}
                    </Text>
                    <TouchableOpacity
                      onPress={async() =>  { 
                        await prepareSlotArray(getJSDate(list.time))
                        await setVisibleAvailabilityModal(true)
                      }}>
                      <Image
                        source={images.editProfilePencil}
                        style={{width: 15, height: 18, marginLeft: 5}}
                      />
                    </TouchableOpacity>
                  </View>
                  {
                  list.data.map((item, key) => (
                    <BlockSlotView
                      key={key}
                      item={item}
                      startDate={item.start_datetime}
                      endDate={item.end_datetime}
                      allDay={item.allDay === true}
                      index={key}
                      slots={slotList}
                      strings={strings}
                      userData={userData}
                      uid={uid}
                      addToSlotData={addToSlotData}
                      deleteFromSlotData={deleteFromSlotData}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>
        ):(
          <View>
              <View
                style={{
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    marginTop: 10,
                    paddingTop: 10,
                    position: 'relative',
                  }}>
                  <View
                    style={{
                      width: 75,
                      height: 30,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 5,
                      position: 'absolute',
                      right: 25,
                      top: 12,
                      zIndex: 9999,
                    }}>
                    <TouchableOpacity
                      onPress={() => setListView(!listView)}>
                      <Image
                        source={images.toggleList}
                        style={{width: 65, height: 30, marginLeft: 5}}
                      />
                    </TouchableOpacity>
                  </View>
                  {weeklyCalender ? (
                    <WeeklyCalender
                      blockedDaySlots={blockedDaySlots}
                      colors={colors}
                      onDayPress={onDayPress}
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                    />
                  ) : (
                    <CalendarPicker
                      headerWrapperStyle={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignContent: 'center',
                        alignItems: 'center',
                        paddingLeft: 15,
                      }}
                      monthYearHeaderWrapperStyle={{
                        backgroundColor: '#fff',
                      }}
                      previousComponent={<LeftArrow />}
                      nextComponent={<RightArrow />}
                      dayShape="square"
                      dayLabelsWrapper={{
                        borderTopColor: colors.whiteColor,
                        borderBottomColor: colors.whiteColor,
                        shadowOpacity: 0,
                        color: colors.whiteColor,
                      }}
                      onDateChange={(date) => {
                        setSelectedDate(date);
                        onDayPress(date);
                      }}
                      disabledDates={datesBlacklistFunc(
                        new Date().setFullYear(new Date().getFullYear() - 25),
                        new Date().setDate(new Date().getDate() - 1),
                      )}
                      selectedDayStyle={{
                        backgroundColor: colors.themeColor,
                        color: '#fff',
                      }}
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
                  )}
                </View>
              </View>

              <View
                style={{
                  borderBottomColor: '#eee',
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />

              {/* Availibility bottom view */}
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontFamily: fonts.RRegular,
                    color: colors.lightBlackColor,
                    margin: 15,
                  }}>
                  {strings.availableTimeForChallenge}
                </Text>
                <View
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingHorizontal: 20,
                  }}>
                  <View
                    style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                    <Text style={{color: colors.darkGrey}}>0</Text>
                    <Text style={{marginLeft: 5, color: colors.darkGrey}}>6</Text>
                    <Text style={{marginLeft: 5, color: colors.darkGrey}}>12</Text>
                    <Text style={{marginLeft: 5, color: colors.darkGrey}}>18</Text>
                    <Text style={{color: colors.darkGrey}}>24</Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      height: 20,
                      marginVertical: 10,
                      borderRadius: 2,
                      borderColor: colors.lightGrey,
                      borderWidth: 1,
                      backgroundColor: colors.lightGrey,
                    }}
                  />
                  {availableSlots.map((item) => (
                    <>
                      <View
                        style={{
                          width: `${item.width}%`,
                          height: 20,
                          marginVertical: 10,
                          borderRadius: 2,
                          backgroundColor: colors.availabilityBarColor,
                          position: 'absolute',
                          left: `${item.marginLeft + 6}%`,
                          top: 17,
                        }}
                      />
                    </>
                  ))}
                </View>
                <ScrollView>
                  {slotList.map((item, key) => (
                    <BlockSlotView
                      key={key}
                      item={item}
                      startDate={item.start_datetime}
                      endDate={item.end_datetime}
                      allDay={item.allDay === true}
                      index={key}
                      slots={slotList}
                      strings={strings}
                      userData={userData}
                      uid={uid}
                      addToSlotData={addToSlotData}
                      deleteFromSlotData={deleteFromSlotData}
                    />
                  ))}
                </ScrollView>
              </View>

              {(Object.entries(userData).length > 0 && userData.user_id === uid) ||
              Object.entries(userData).length === 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 10,
                    marginBottom: 40,
                }}>
                  <TouchableOpacity onPress={() => setVisibleAvailabilityModal(true)}>
                    <Text
                      style={{
                        textDecorationLine: 'underline',
                        textDecorationStyle: 'solid',
                        textDecorationColor: '#000',
                      }}>
                      {strings.editAvailability}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
          </View>
        )}
      </ScrollView>

      {/*  Availability modal */}
      <Modal
        isVisible={visibleAvailabilityModal}
        backdropColor="black"
        style={{margin: 0, justifyContent: 'flex-end'}}
        hasBackdrop
        onBackdropPress={() => {
          setVisibleAvailabilityModal(false);
        }}
        backdropOpacity={0}>
        <SafeAreaView style={styles.modalMainViewStyle}>
          <ChallengeAvailability
            setVisibleAvailabilityModal={setVisibleAvailabilityModal}
            slots={editableSlots}
            addToSlotData={addToSlotData}
            showAddMore={true}
            deleteFromSlotData={deleteFromSlotData}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalMainViewStyle: {
    shadowOpacity: 0.15,
    shadowOffset: {
      height: -10,
      width: 0,
    },
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: Dimensions.get('window').height - 50,
  },
});
