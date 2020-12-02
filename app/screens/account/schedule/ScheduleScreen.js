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
  Alert,
} from 'react-native';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet';
import * as Utility from '../../../utils/index';
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
import {
  deleteEvent, getEventById, getEvents, getSlots,
} from '../../../api/Schedule';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import CreateEventButton from '../../../components/Schedule/CreateEventButton';
import CreateEventBtnModal from '../../../components/Schedule/CreateEventBtnModal';
import EventBlockTimeTableView from '../../../components/Schedule/EventBlockTimeTableView';

const { width } = Dimensions.get('window');

export default function ScheduleScreen({ navigation }) {
  const [scheduleIndexCounter, setScheduleIndexCounter] = useState(0);
  const [eventData, setEventData] = useState([]);
  const [timeTable, setTimeTable] = useState([]);
  const [selectedEventItem, setSelectedEventItem] = useState(null);
  const [eventSelectDate, setEventSelectDate] = useState(new Date());
  const [timetableSelectDate, setTimeTableSelectDate] = useState(new Date());
  const [filterEventData, setFilterEventData] = useState([]);
  const [filterTimeTable, setFilterTimeTable] = useState([]);
  const [calenderInnerIndexCounter, setCalenderInnerIdexCounter] = useState(0);
  const [loading, setloading] = useState(false);
  const [createEventModal, setCreateEventModal] = useState(false);
  const [entity, setEntity] = useState({});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const date = moment(new Date()).format('YYYY-MM-DD');
      const loggedInEntity = await Utility.getStorage('loggedInEntity');
      setEntity(loggedInEntity)
      const entityRole = loggedInEntity.role === 'user' ? 'users' : 'groups';
      const uid = loggedInEntity.uid || loggedInEntity.auth.user_id;
      const eventdata = [];
      const timetabledata = [];
      let eventTimeTableData = [];
      getEvents(entityRole, uid).then((response) => {
        getSlots(entityRole, uid).then((res) => {
          eventTimeTableData = [...response.payload, ...res.payload];
          setEventData(eventTimeTableData);
          setTimeTable(eventTimeTableData);
          eventTimeTableData.filter((event_item) => {
            const startDate = new Date(event_item.start_datetime * 1000);
            const eventDate = moment(startDate).format('YYYY-MM-DD');
            if (eventDate === date) {
              eventdata.push(event_item);
            }
            return null;
          });
          setFilterEventData(eventdata);
          eventTimeTableData.filter((timetable_item) => {
            const timetable_date = new Date(timetable_item.start_datetime * 1000);
            const endDate = new Date(timetable_item.end_datetime * 1000);
            const timetabledate = moment(timetable_date).format('YYYY-MM-DD');
            if (timetabledate === date) {
              const obj = {
                ...timetable_item,
                start: moment(timetable_date).format('YYYY-MM-DD hh:mm:ss'),
                end: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
              };
              timetabledata.push(obj);
            }
            return null;
          })
          setFilterTimeTable(timetabledata);
        })
      }).catch((e) => {
        Alert.alert('', e.messages)
      })
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

  useEffect(() => {
    if (selectedEventItem) {
      eventEditDeleteAction.current.show();
    }
  }, [selectedEventItem]);

  const actionSheet = useRef();
  const eventEditDeleteAction = useRef();
  const selectionDate = moment(eventSelectDate).format('YYYY-MM-DD');
  const timeTableSelectionDate = moment(timetableSelectDate).format('YYYY-MM-DD');

  return (
    <View style={ styles.mainContainer }>
      <ActivityLoader visible={loading} />
      <TCScrollableTabs initialPage={2}>
        <View tabLabel='Info' style={{ flex: 1 }}></View>
        <View tabLabel='Scoreboard' style={{ flex: 1 }}></View>
        <View tabLabel='Schedule' style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <View style={{ padding: 5, height: 16, width: 16 }} />
            <ScheduleTabView
              firstTabTitle={'Events'}
              secondTabTitle={'Calender'}
              indexCounter={scheduleIndexCounter}
              onFirstTabPress={() => setScheduleIndexCounter(0)}
              onSecondTabPress={() => setScheduleIndexCounter(1)}
            />
            <TouchableIcon
              source={images.searchLocation}
              onItemPress={() => {}}
            />
          </View>
          {scheduleIndexCounter === 0 && <View style={{ flex: 1 }}>
            <EventScheduleScreen
              eventData={eventData}
              navigation={navigation}
              onThreeDotPress={(item) => {
                setSelectedEventItem(item);
              }}
              onItemPress={async (item) => {
                if (item.game_id) {
                  navigation.navigate('SoccerHome', {
                    gameId: item.game_id,
                  })
                } else {
                  getEventById(entity.role === 'user' ? 'users' : 'groups', entity.uid || entity.auth.user_id, item.cal_id).then((response) => {
                    navigation.navigate('EventScreen', { data: response.payload, gameData: item });
                  }).catch((e) => {
                    console.log('Error :-', e);
                  })
                }
              }}
            />
            {!createEventModal && <CreateEventButton
              source={images.plus}
              onPress={() => setCreateEventModal(true) }
            />}
          </View>}
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
              selected={selectionDate}
              onDayPress={(day) => {
                setEventSelectDate(day.dateString);
                const date = moment(day.dateString).format('YYYY-MM-DD');
                const data = [];
                eventData.filter((event_item) => {
                  const startDate = new Date(event_item.start_datetime * 1000);
                  const eventDateSelect = moment(startDate).format('YYYY-MM-DD');
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
                renderItem={({ item: itemValue }) => (itemValue.cal_type === 'event' && <EventInCalender
                  onPress={async () => {
                    if (itemValue.game_id) {
                      navigation.navigate('SoccerHome', {
                        gameId: itemValue.game_id,
                      })
                    } else {
                      getEventById(entity.role === 'user' ? 'users' : 'groups', entity.uid || entity.auth.user_id, itemValue.cal_id).then((response) => {
                        navigation.navigate('EventScreen', { data: response.payload, gameData: itemValue });
                      }).catch((e) => {
                        console.log('Error :-', e);
                      })
                    }
                  }}
                  eventBetweenSection={itemValue.game}
                  eventOfSection={true}
                  onThreeDotPress={() => {
                    setSelectedEventItem(itemValue);
                  }}
                  data={itemValue}
                />)}
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
                const date = moment(day.dateString).format('YYYY-MM-DD');
                const dataItem = [];
                timeTable.filter((time_table_item) => {
                  const startDate = new Date(time_table_item.start_datetime * 1000);
                  const endDate = new Date(time_table_item.end_datetime * 1000);
                  const eventDateSelect = moment(startDate).format('YYYY-MM-DD');
                  if (eventDateSelect === date) {
                    const obj = {
                      ...time_table_item,
                      start: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
                      end: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
                    };
                    dataItem.push(obj);
                  }
                  return null;
                });
                setFilterTimeTable(dataItem);
                return null;
              }}
              renderItem={(item) => <View>
                <EventCalendar
                  eventTapped={(event) => { console.log('Event ::--', event) }}
                  events={item}
                  width={width}
                  initDate={timeTableSelectionDate}
                  scrollToFirst={true}
                  renderEvent={(event) => {
                    let event_color = colors.themeColor;
                    let eventTitle = 'Game';
                    let eventDesc = 'Game With';
                    let eventDesc2 = '';
                    if (event.color && event.color.length > 0) {
                      if (event.color[0] !== '#') {
                        event_color = `#${event.color}`;
                      } else {
                        event_color = event.color;
                      }
                    }
                    if (event && event.title) {
                      eventTitle = event.title;
                    }
                    if (event && event.descriptions) {
                      eventDesc = event.descriptions;
                    }
                    if (event.game && event.game.away_team) {
                      eventDesc2 = event.game.away_team.group_name;
                    }
                    return (
                      <View style={{ flex: 1 }}>
                        {event.cal_type === 'event' && <CalendarTimeTableView
                          title={eventTitle}
                          summary={`${eventDesc} ${eventDesc2}`}
                          containerStyle={{ borderLeftColor: event_color, width: event.width }}
                          eventTitleStyle={{ color: event_color }}
                        />}
                        {event.cal_type === 'blocked' && <View style={[styles.blockedViewStyle, {
                          width: event.width + 68, height: event.height,
                        }]} />}
                      </View>
                    );
                  }}
                  styles={{
                    event: styles.eventViewStyle,
                    line: { backgroundColor: colors.lightgrayColor },
                  }}
                />
                {item.length > 0 && <FlatList
                  data={item}
                  scrollEnabled={false}
                  showsHorizontalScrollIndicator={false}
                  renderItem={ ({ item: blockItem }) => {
                    if (blockItem.cal_type === 'blocked') {
                      return (
                        <EventBlockTimeTableView
                          blockText={'Blocked Zone'}
                          blockZoneTime={`${moment(blockItem.start).format('hh:mma')} - ${moment(blockItem.end).format('hh:mma')}`}
                        />
                      );
                    }
                    return <View />;
                  }}
                  ItemSeparatorComponent={ () => (
                    <View style={ { height: wp('3%') } } />
                  ) }
                  style={ { marginVertical: wp('4%') } }
                  keyExtractor={(itemValue, index) => index.toString() }
                />}
              </View>}
            />}
            {!createEventModal && <CreateEventButton
              source={images.plus}
              onPress={() => setCreateEventModal(true)}
            />}
          </View>}
        </View>
        <View tabLabel='Gallery' style={{ flex: 1 }}></View>
      </TCScrollableTabs>
      <CreateEventBtnModal
        visible={createEventModal}
        onCancelPress={() => setCreateEventModal(false)}
        onCreateEventPress={() => {
          setCreateEventModal(false)
          navigation.navigate('CreateEventScreen', { comeName: 'ScheduleScreen' })
        }}
        onChallengePress={() => {
          setCreateEventModal(false)
          navigation.navigate('EditChallengeAvailability')
        }}
      />
      <ActionSheet
        ref={actionSheet}
        options={['Default Color', 'Group Events', 'View Privacy', 'Cancel']}
        cancelButtonIndex={3}
        destructiveButtonIndex={3}
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate('DefaultColorScreen');
          } else if (index === 1) {
            navigation.navigate('GroupEventScreen');
          } else if (index === 2) {
            navigation.navigate('ViewPrivacyScreen');
          }
        }}
      />
      <ActionSheet
        ref={eventEditDeleteAction}
        options={['Edit', 'Delete', 'Cancel']}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={(index) => {
          setSelectedEventItem(null);
          if (index === 0) {
            navigation.navigate('EditEventScreen', { data: selectedEventItem, gameData: selectedEventItem });
          }
          if (index === 1) {
            Alert.alert(
              'Do you want to delete this event ?',
              '',
              [{
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                  setloading(true);
                  deleteEvent(entity.role === 'user' ? 'users' : 'groups', entity.uid || entity.auth.user_id, selectedEventItem.cal_id)
                    .then(() => getEvents(entity.role === 'user' ? 'users' : 'groups', entity.uid || entity.auth.user_id))
                    .then((response) => {
                      setloading(false);
                      setEventData(response.payload);
                      setTimeTable(response.payload);
                    })
                    .catch((e) => {
                      setloading(false);
                      Alert.alert('', e.messages)
                    });
                },
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },

              ],
              { cancelable: false },
            );
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
  blockedViewStyle: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    marginLeft: -59,
    borderRadius: 10,
  },
});
