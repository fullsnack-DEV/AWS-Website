import React, {
  useState, useLayoutEffect, useRef, useEffect,
} from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Text,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import {
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet';
import EventCalendar from '../../../components/Schedule/EventCalendar/EventCalendar';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'
import TCScrollableTabs from '../../../components/TCScrollableTabs';
import TouchableIcon from '../../../components/Home/TouchableIcon';
import ScheduleTabView from '../../../components/Home/ScheduleTabView';
import EventScheduleScreen from './EventScheduleScreen';
import fonts from '../../../Constants/Fonts';
import TwoTabView from '../../../components/Schedule/TowTabView';
import BackForwardView from '../../../components/Schedule/BackForwardView';
import EventInCalender from '../../../components/Schedule/EventInCalender';
import EventAgendaSection from '../../../components/Schedule/EventAgendaSection';
import CalendarTimeTableView from '../../../components/Schedule/CalendarTimeTableView';

const DATA = [
  {
    id: '1',
    date: '2020-11-04 01:30:00',
    title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
    description: 'Event description for special event.',
    eventTime: '12:00 PM - 11:00 AM',
    eventLocation: 'Vancouver, BC, Canada',
    eventColor: colors.orangeColor,
  },
  {
    id: '2',
    date: '2020-11-05 05:00:00',
    title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
    description: 'Event description for special event.',
    eventTime: '12:00 PM - 11:00 AM',
    eventLocation: 'Vancouver, BC, Canada',
    eventColor: colors.yellowColor,
  },
  {
    id: '7',
    date: '2020-11-06 02:45:00',
    title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
    description: 'Event description for special event.',
    eventTime: '12:00 PM - 11:00 AM',
    eventLocation: 'Vancouver, BC, Canada',
    eventColor: colors.blueColor,
  },
  {
    id: '8',
    date: '2020-11-07 13:12:00',
    title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
    description: 'Event description for special event.',
    eventTime: '12:00 PM - 11:00 AM',
    eventLocation: 'Vancouver, BC, Canada',
    eventColor: colors.greeColor,
  },
  {
    id: '3',
    date: '2020-11-04 19:38:00',
    title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
    description: 'Event description for special event.',
    eventTime: '12:00 PM - 11:00 AM',
    eventLocation: 'Vancouver, BC, Canada',
    eventColor: colors.orangeColor,
  },
  {
    id: '4',
    date: '2020-11-04 07:25:00',
    title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
    description: 'Event description for special event.',
    eventTime: '12:00 PM - 11:00 AM',
    eventLocation: 'Vancouver, BC, Canada',
    eventColor: colors.yellowColor,
  },
  {
    id: '9',
    date: '2020-11-05 16:16:00',
    title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
    description: 'Event description for special event.',
    eventTime: '12:00 PM - 11:00 AM',
    eventLocation: 'Vancouver, BC, Canada',
    eventColor: colors.blueColor,
  },
  {
    id: '10',
    date: '2020-11-06 17:26:00',
    title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
    description: 'Event description for special event.',
    eventTime: '12:00 PM - 11:00 AM',
    eventLocation: 'Vancouver, BC, Canada',
    eventColor: colors.greeColor,
  },
  {
    id: '11',
    date: '2020-11-07 08:08:00',
    title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
    description: 'Event description for special event.',
    eventTime: '12:00 PM - 11:00 AM',
    eventLocation: 'Vancouver, BC, Canada',
    eventColor: colors.lightBlueColor,
  },
  {
    id: '5',
    date: '2020-11-08 06:19:00',
    title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
    description: 'Event description for special event.',
    eventTime: '12:00 PM - 11:00 AM',
    eventLocation: 'Vancouver, BC, Canada',
    eventColor: colors.orangeColor,
  },
  {
    id: '6',
    date: '2020-11-04 04:44:00',
    title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
    description: 'Event description for special event.',
    eventTime: '12:00 PM - 11:00 AM',
    eventLocation: 'Vancouver, BC, Canada',
    eventColor: colors.yellowColor,
  },
  {
    id: '12',
    date: '2020-11-06 15:15:00',
    title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
    description: 'Event description for special event.',
    eventTime: '12:00 PM - 11:00 AM',
    eventLocation: 'Vancouver, BC, Canada',
    eventColor: colors.blueColor,
  },
];

const events = [
  {
    start: '2020-11-04 00:30:00',
    end: '2020-11-04 01:45:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
    eventColor: colors.orangeColor,
  },
  {
    start: '2020-11-05 01:55:00',
    end: '2020-11-05 02:45:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
    eventColor: colors.yellowColor,
  },
  {
    start: '2020-11-06 04:10:00',
    end: '2020-11-06 04:40:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
    eventColor: colors.blueColor,
  },
  {
    start: '2020-11-07 01:05:00',
    end: '2020-11-07 01:45:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
    eventColor: colors.greeColor,
  },
  {
    start: '2020-11-04 14:30:00',
    end: '2020-11-04 16:30:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
    eventColor: colors.radoffwhiteioButtonColor,
  },
  {
    start: '2020-11-05 01:20:00',
    end: '2020-11-05 02:20:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
    eventColor: colors.blueColor,
  },
  {
    start: '2020-11-07 04:10:00',
    end: '2020-11-07 04:40:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
    eventColor: colors.orangeColor,
  },
  {
    start: '2020-11-08 00:45:00',
    end: '2020-11-08 01:45:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
    eventColor: colors.greeColor,
  },
  {
    start: '2020-11-09 01:20:00',
    end: '2020-11-09 03:45:00',
    title: 'Dr. Kishan Makani',
    summary: '3412 Piedmont Rd NE, GA 3032',
    eventColor: colors.radoffwhiteioButtonColor,
  },
  {
    start: '2020-11-04 11:30:00',
    end: '2020-11-04 12:30:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
    eventColor: colors.yellowColor,
  },
  {
    start: '2020-11-09 01:30:00',
    end: '2020-11-09 02:00:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
    eventColor: colors.blueColor,
  },
  {
    start: '2020-11-08 03:10:00',
    end: '2020-11-08 03:40:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
    eventColor: colors.greeColor,
  },
  {
    start: '2020-11-06 00:10:00',
    end: '2020-11-06 01:45:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
    eventColor: colors.radoffwhiteioButtonColor,
  },
];

const { width } = Dimensions.get('window');

export default function ScheduleScreen({ navigation }) {
  const [scheduleIndexCounter, setScheduleIndexCounter] = useState(0);
  const [eventData] = useState(DATA);
  const [timeTable] = useState(events);
  const [eventSelectDate, setEventSelectDate] = useState(new Date());
  const [timetableSelectDate, setTimeTableSelectDate] = useState(new Date());
  const [filterEventData, setFilterEventData] = useState([]);
  const [filterTimeTable, setFilterTimeTable] = useState([]);
  const [calenderInnerIndexCounter, setCalenderInnerIdexCounter] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const date = moment(new Date()).format('YYYY-MM-DD');
      const eventdata = [];
      eventData.filter((event_item) => {
        const eventDate = moment(event_item.date).format('YYYY-MM-DD');
        if (eventDate === date) {
          eventdata.push(event_item);
        }
        return null;
      });
      setFilterEventData(eventdata);

      const timetabledata = [];
      timeTable.filter((timetable_item) => {
        const timetabledate = moment(timetable_item.start).format('YYYY-MM-DD');
        if (timetabledate === date) {
          timetabledata.push(timetable_item);
        }
        return null;
      })
      setFilterTimeTable(timetabledata);
      return null;
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={ () => { actionSheet.current.show(); } }>
          <Image source={ images.vertical3Dot } style={ styles.headerRightImg } />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  const actionSheet = useRef();
  const selectionDate = moment(eventSelectDate).format('YYYY-MM-DD');
  const timeTableSelectionDate = moment(timetableSelectDate).format('YYYY-MM-DD');

  return (
    <View style={ styles.mainContainer }>
      <TCScrollableTabs initialPage={2}>
        <View tabLabel='Info' style={{ flex: 1 }}></View>
        <View tabLabel='Scoreboard' style={{ flex: 1 }}></View>
        <View tabLabel='Schedule' style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <TouchableIcon
              source={images.searchLocation}
              onItemPress={() => {}}
            />
            <ScheduleTabView
              indexCounter={scheduleIndexCounter}
              onFirstTabPress={() => setScheduleIndexCounter(0)}
              onSecondTabPress={() => setScheduleIndexCounter(1)}
            />
            <TouchableIcon
              source={images.plus}
              imageStyle={{ tintColor: colors.orangeColor }}
              onItemPress={() => { navigation.navigate('CreateEventScreen') }}
            />
          </View>
          {scheduleIndexCounter === 0 && <EventScheduleScreen
            onItemPress={() => navigation.navigate('EventScreen')}
          />}
          {scheduleIndexCounter === 1 && <View style={{ flex: 1 }}>
            <View style={styles.shceduleCalenderView}>
              <BackForwardView
                textValue={moment(selectionDate).format('MMMM YYYY')}
              />
              <View>
                <TwoTabView
                  firstTabTitle={'Events'}
                  secondTabTitle={'Timetable'}
                  indexCounter={calenderInnerIndexCounter}
                  onFirstTabPress={() => setCalenderInnerIdexCounter(0)}
                  onSecondTabPress={() => setCalenderInnerIdexCounter(1)}
                />
              </View>
            </View>
            {calenderInnerIndexCounter === 0 && <EventAgendaSection
              items={{
                [selectionDate.toString()]: [filterEventData],
              }}
              onDayPress={(day) => {
                setEventSelectDate(day.dateString);
                const date = moment(day.dateString).format('YYYY-MM-DD');
                const data = [];
                eventData.filter((event_item) => {
                  const eventDateSelect = moment(event_item.date).format('YYYY-MM-DD');
                  if (eventDateSelect === date) {
                    data.push(event_item);
                  }
                  return null;
                });
                setFilterEventData(data);
                return null;
              }}
              renderItem={(item) => <FlatList
                data={item}
                renderItem={({ item: itemValue }) => <EventInCalender
                  data={itemValue}
                />}
                ListHeaderComponent={() => <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.filterHeaderText}>{moment(selectionDate).format('ddd, DD MMM')}</Text>
                  <Text style={styles.headerTodayText}>
                    {moment(selectionDate).calendar(null, {
                      lastWeek: '[Last] dddd',
                      lastDay: '[Yesterday]',
                      sameDay: '[Today]',
                      nextDay: '[Tomorrow]',
                      nextWeek: 'dddd',
                    })}
                  </Text>
                </View>}
                bounces={false}
                style={{ flex: 1 }}
                keyExtractor={(itemValueKey, index) => index.toString()}
              />}
            />}

            {calenderInnerIndexCounter === 1 && <EventAgendaSection
              items={{
                [timeTableSelectionDate.toString()]: [filterTimeTable],
              }}
              onDayPress={(day) => {
                setTimeTableSelectDate(day.dateString);
                const dateValue = moment(day.dateString).format('YYYY-MM-DD');
                const dataItem = [];
                timeTable.filter((time_table_item) => {
                  const dateInTimeTableSelect = moment(time_table_item.start).format('YYYY-MM-DD');
                  if (dateInTimeTableSelect === dateValue) {
                    dataItem.push(time_table_item);
                  }
                  return null;
                });
                setFilterTimeTable(dataItem);
                return null;
              }}
              renderItem={(item) => <EventCalendar
                eventTapped={(event) => { console.log('Event ::--', event) }}
                events={item}
                width={width}
                initDate={timetableSelectDate}
                scrollToFirst={true}
                renderEvent={(event) => <CalendarTimeTableView
                  title={event.title}
                  summary={event.summary}
                  containerStyle={{ borderLeftColor: event.eventColor }}
                  eventTitleStyle={{ color: event.eventColor }}
                />}
                styles={{
                  event: styles.eventViewStyle,
                  line: { backgroundColor: colors.lightgrayColor },
                }}
              />}
            />}
          </View>}
        </View>
        <View tabLabel='Gallery' style={{ flex: 1 }}></View>
      </TCScrollableTabs>
      <ActionSheet
        ref={actionSheet}
        options={['Default Color', 'Group Events', 'View Privacy', 'Cancel']}
        cancelButtonIndex={3}
        destructiveButtonIndex={3}
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate('DefaultColorScreen');
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRightImg: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
  mainContainer: {
    flex: 1,
  },
  shceduleCalenderView: {
    flexDirection: 'row',
    width: wp('94%'),
    alignSelf: 'center',
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  filterHeaderText: {
    marginLeft: 12,
    marginRight: 8,
    marginVertical: 5,
    fontSize: 25,
    color: colors.orangeColor,
    fontFamily: fonts.RMedium,
  },
  eventViewStyle: {
    opacity: 1,
    backgroundColor: colors.whiteColor,
    shadowOpacity: 0.8,
    borderWidth: 0.5,
    shadowColor: colors.lightgrayColor,
    shadowOffset: {
      height: 3,
      width: 1,
    },
    elevation: 5,
    overflow: 'visible',
    paddingLeft: 0,
    paddingTop: 0,
  },
  headerTodayText: {
    fontSize: 13,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
    alignSelf: 'flex-end',
    bottom: 6,
  },
});
