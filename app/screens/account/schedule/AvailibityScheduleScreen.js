import React, {useEffect, useState, useCallback} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import moment from 'moment';
import {getJSDate} from '../../../utils';
import BlockSlotView from '../../../components/Schedule/BlockSlotView';
import Verbs from '../../../Constants/Verbs';
import colors from '../../../Constants/Colors';
import * as Utility from '../../../utils/index';
import fonts from '../../../Constants/Fonts';
import {strings} from '../../../../Localization/translation';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import AvailabilityListView from './AvailabilityListView';
import SlotsBar from './SlotsBar';
import CustomWeeklyCalender from './CustomWeeklyCalender';
import AvailabilityHeader from './AvailabilityHeader';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AvailibilityScheduleScreen({
  allSlots,
  isAdmin = false,
  setEditableSlots = () => {},
  setVisibleAvailabilityModal = () => {},
  setIsFromSlots = () => {},
  setSlotLevel = () => {},
}) {
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState(allSlots);
  const [slots, setSlots] = useState([]);
  const [slotList, setSlotList] = useState([]);
  const [blockedDaySlots, setBlockedDaySlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [listView, setListView] = useState(true);
  const [listViewData, setListViewData] = useState([]);

  const [customDatesStyles, setCustomDatesStyles] = useState([]);

  useEffect(() => {
    setAllData(allSlots);
    setLoading(false);
  }, [allSlots]);

  useEffect(() => {
    setSlotList(slots);
    setEditableSlots(slots);
  }, [slots, setEditableSlots]);

  const generateTimestampRanges = (startTimestamp, endTimestamp) => {
    const startDate = startTimestamp * Verbs.THOUSAND_SECOND;
    const endDate = endTimestamp * Verbs.THOUSAND_SECOND;
    const ranges = [];
    let startOfCurrentRange = startDate;

    while (startOfCurrentRange < endDate) {
      const startDateFullDate = new Date(startOfCurrentRange);
      let endOfCurrentDay = new Date(
        startDateFullDate.getFullYear(),
        startDateFullDate.getMonth(),
        startDateFullDate.getDate() + 1,
      ).getTime();

      if (endOfCurrentDay > endDate) {
        endOfCurrentDay = endDate;
      }

      ranges.push({start: startOfCurrentRange, end: endOfCurrentDay});

      startOfCurrentRange = endOfCurrentDay;
    }

    return ranges;
  };

  const newBlockedSlots = useCallback((request) => {
    const newPlans = request.flatMap((plan) => {
      const {start_datetime, end_datetime} = plan;
      const timestampRange = generateTimestampRanges(
        start_datetime,
        end_datetime,
      );
      if (timestampRange.length > 1) {
        return timestampRange.map(({start, end}) => ({
          ...plan,
          start_datetime: start / Verbs.THOUSAND_SECOND,
          end_datetime: end / Verbs.THOUSAND_SECOND,
          actual_enddatetime: end / Verbs.THOUSAND_SECOND,
        }));
      }
      return plan;
    });

    return newPlans;
  }, []);

  const prepareSlotArray = useCallback(
    (dateObj = {}, newItem = {}) => {
      const start = new Date(dateObj);
      start.setHours(0, 0, 0, 0);

      const temp = [];
      let timeSlots = [];
      let allAvailableSlots = [];

      let tempSlot = allData.slice(); // Make a shallow copy

      if (Object.keys(newItem).length > 0) {
        tempSlot.push(newItem);
      }

      tempSlot = newBlockedSlots(tempSlot);

      const startTimestamp = start.getTime();
      const dateMap = new Map();

      for (const blockedSlot of tempSlot) {
        const eventDate = Utility.getJSDate(blockedSlot.start_datetime);
        eventDate.setHours(0, 0, 0, 0);

        const eventTimestamp = eventDate.getTime();

        if (eventTimestamp === startTimestamp && blockedSlot.blocked === true) {
          temp.push(blockedSlot);
        }

        // Store blocked slots in a map for faster lookups
        dateMap.set(eventTimestamp, blockedSlot);
      }

      if (temp[0]?.allDay === true && temp[0]?.blocked === true) {
        setSlots(temp);
      } else {
        timeSlots = createCalenderTimeSlots(Utility.getTCDate(start), 24, temp);
        setSlots(timeSlots);
        allAvailableSlots = getAvailableSlots(timeSlots, dateObj);
      }

      // Batch state updates
      setAvailableSlots(allAvailableSlots);
    },
    [allData, newBlockedSlots],
  );

  const prepareSlotListArray = useCallback(() => {
    const temp = [];
    let tempSlot = [...allData];
    const monthData = [];
    const today = moment();
    const day = today.clone();

    tempSlot = newBlockedSlots(tempSlot);

    while (day.quarter() === today.quarter()) {
      const startDate = new Date(day.clone());
      startDate.setHours(0, 0, 0, 0);
      const startSlotTime = Utility.getTCDate(startDate);
      const lastSlotTime = startSlotTime + 24 * 60 * 60;

      const slot = {};
      slot.start_datetime = startSlotTime;
      slot.end_datetime = lastSlotTime;
      slot.blocked = false;
      monthData.push(slot);

      day.add(1, 'day');
    }

    for (const blockedSlot of tempSlot) {
      if (blockedSlot.blocked === true) {
        temp.push(blockedSlot);
      }
    }

    const monthlyData = [];
    const blockedSlots = temp.sort(
      (a, b) => new Date(a.start_datetime) - new Date(b.start_datetime),
    );
    monthData.forEach((item, key) => {
      monthlyData[key] = [item];
      blockedSlots.forEach((tempItem) => {
        const data = {...tempItem};
        const blockedStart = getJSDate(tempItem?.start_datetime);
        blockedStart.setHours(0, 0, 0, 0);
        const blockedSlotStartTime = Utility.getTCDate(blockedStart);
        if (blockedSlotStartTime === item.start_datetime) {
          if (monthlyData[key][0]?.blocked) {
            monthlyData[key].push(data);
          } else {
            monthlyData[key] = [data];
          }
        }
      });
    });

    const filData = [];
    const nextDateTime = getJSDate(
      Utility.getTCDate(new Date()) + 24 * 60 * 60,
    );
    nextDateTime.setHours(0, 0, 0, 0);
    monthlyData.forEach((item) => {
      let tempVal = {};
      const start = getJSDate(item[0]?.start_datetime);
      start.setHours(0, 0, 0, 0);

      const currentDateTime = new Date();
      currentDateTime.setHours(0, 0, 0, 0);

      let title = `${
        days[getJSDate(item[0]?.start_datetime).getDay()]
      }, ${moment(getJSDate(item[0]?.start_datetime)).format('MMM DD')}`;
      if (start.getTime() === currentDateTime.getTime()) {
        title = strings.todayTitleText;
      }

      if (start.getTime() === nextDateTime.getTime()) {
        title = strings.tomorrowTitleText;
      }

      tempVal = {
        title,
        time: item[0]?.start_datetime,
        data:
          item.length === 1 && !item[0].blocked
            ? item
            : createCalenderTimeSlots(Utility.getTCDate(start), 24, item),
      };
      filData.push(tempVal);
    });
    setListViewData(filData);
  }, [allData, newBlockedSlots]);

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
      const gapPercent = Math.floor((gap / 1440) * 100);

      tempSlot.width = minutePercent;
      tempSlot.marginLeft = gapPercent;

      formattedAvailableSLots.push(tempSlot);
    });

    return formattedAvailableSLots;
  };

  const addToSlotData = (data) => {
    let tempData = [...allData];
    data.forEach((item1) => {
      allData.forEach((item2, key) => {
        if (
          item1.start_datetime <= item2.end_datetime &&
          item1.end_datetime > item2.end_datetime
        ) {
          tempData[key].end_datetime = item1.end_datetime;
        } else if (
          item1.end_datetime >= item2.start_datetime &&
          item1.start_datetime < item2.end_datetime
        ) {
          tempData[key].start_datetime = item1.start_datetime;
        }
      });
      tempData.push(item1);
    });
    tempData = newBlockedSlots(tempData);
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
    });
    setAllData([...allSlots]);
    return allSlots;
  };

  const deleteOrCreateSlotData = async (payload) => {
    let tempSlot = [...allData];

    tempSlot = tempSlot.filter(
      (item) => !payload.deleteSlotsIds.includes(item.cal_id),
    );

    const slotMap = new Map(allData.map((item) => [item.cal_id, item]));
    payload.deleteSlotsIds.forEach((cal_id) => slotMap.delete(cal_id));
    tempSlot = Array.from(slotMap.values());

    tempSlot = tempSlot.concat(payload.newSlots);

    setAllData(tempSlot);
  };

  const createCalenderViewData = useCallback(
    (blocked) => {
      const today = moment();
      const day = today.clone().startOf('month');
      const customStyles = [];
      while (day.isSame(today, 'year')) {
        let backgroundColorWrapper;
        let background_color;
        let text_color;
        let font = fonts.RMedium;

        if (
          moment(selectedDate).format(Verbs.AVAILABILITY_DATE_FORMATE) ===
          moment(new Date(day.clone())).format(Verbs.AVAILABILITY_DATE_FORMATE)
        ) {
          backgroundColorWrapper = colors.themeColor;
          background_color = colors.themeColor;
          text_color = colors.whiteColor;
          font = fonts.RBold;
        } else if (
          blocked.includes(
            moment(day.clone()).format(Verbs.AVAILABILITY_DATE_FORMATE),
          )
        ) {
          backgroundColorWrapper = colors.lightGrey;
          background_color = colors.lightGrey;
          text_color = colors.grayColor;
        } else if (
          moment(new Date()).format(Verbs.AVAILABILITY_DATE_FORMATE) ===
          moment(new Date(day.clone())).format(Verbs.AVAILABILITY_DATE_FORMATE)
        ) {
          if (
            moment(new Date()).format(Verbs.AVAILABILITY_DATE_FORMATE) !==
            moment(selectedDate).format(Verbs.AVAILABILITY_DATE_FORMATE)
          ) {
            backgroundColorWrapper = colors.whiteColor;
          } else {
            backgroundColorWrapper = colors.themeColor;
          }
          background_color = colors.whiteColor;
          text_color = colors.themeColor;
        } else {
          background_color = colors.whiteColor;
          text_color = colors.greenGradientStart;
        }

        customStyles.push({
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
            fontFamily: font,
          },
        });

        day.add(1, 'day');
      }
      setCustomDatesStyles(customStyles);
    },
    [selectedDate],
  );

  useEffect(() => {
    prepareSlotArray(selectedDate);
    prepareSlotListArray();
    const blocked = [];
    let tempSlot = [...allData];
    tempSlot = newBlockedSlots(tempSlot);
    tempSlot.forEach((obj) => {
      const start = Utility.getJSDate(obj.start_datetime);
      start.setHours(0, 0, 0, 0);
      if (obj.allDay) {
        blocked.push(moment.unix(obj.start_datetime).format('YYYY-MM-DD'));
      }
    });
    setBlockedDaySlots(blocked);
    createCalenderViewData(blocked);
  }, [
    allData,
    selectedDate,
    createCalenderViewData,
    newBlockedSlots,
    prepareSlotArray,
    prepareSlotListArray,
  ]);

  const renderItem = ({item, index}) => (
    <BlockSlotView
      key={index}
      item={item}
      startDate={item.start_datetime}
      endDate={item.end_datetime}
      allDay={item.allDay === true}
      index={index}
      slots={slotList}
      onPress={() => {
        if (isAdmin) {
          setEditableSlots([item]);
          setIsFromSlots(true);
          setSlotLevel(true);

          setVisibleAvailabilityModal(true);
        }
      }}
    />
  );

  const renderContent = () => {
    if (listView) {
      return (
        <View style={{paddingHorizontal: 15}}>
          <FlatList
            extraData={slots}
            data={listViewData}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <AvailabilityListView
                item={item}
                onEdit={() => {
                  prepareSlotArray(getJSDate(item.time));
                  setSlotLevel(false);
                  setIsFromSlots(false);
                  setVisibleAvailabilityModal(true);
                }}
                allData={allData}
                addToSlotData={addToSlotData}
                deleteFromSlotData={deleteFromSlotData}
                deleteOrCreateSlotData={deleteOrCreateSlotData}
                isAdmin={isAdmin}
                allSlots={allSlots}
                onPress={(slot) => {
                  setIsFromSlots(true);
                  setEditableSlots([slot]);
                  setSlotLevel(true);

                  setVisibleAvailabilityModal(true);
                }}
              />
            )}
          />
        </View>
      );
    }

    return (
      <View>
        <CustomWeeklyCalender
          blockedDaySlots={blockedDaySlots}
          colors={colors}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          customDatesStyles={customDatesStyles}
          onToggleView={() => {
            setListView(!listView);
          }}
          isListView={listView}
        />
        <View style={{paddingHorizontal: 38}}>
          <SlotsBar availableSlots={availableSlots} />

          <FlatList
            data={slotList}
            extraData={slots}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 12}}>
      <ActivityLoader visible={loading} />

      {listView ? (
        <AvailabilityHeader
          isListView={listView}
          selectedDate={selectedDate}
          onToggleView={() => setListView(!listView)}
          containerStyle={{
            paddingHorizontal: 15,
            paddingTop: 22,
          }}
        />
      ) : null}

      {renderContent()}

      {isAdmin && !listView ? (
        <TouchableOpacity
          onPress={() => {
            if (isAdmin) {
              // setIsFromSlots(true);
              setSlotLevel(false);
              setVisibleAvailabilityModal(true);
            }
          }}
          style={{
            alignSelf: 'center',
            marginTop: 20,
          }}>
          <Text style={styles.buttonText}>{strings.editAvailability}</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    textDecorationLine: 'underline',
  },
});
