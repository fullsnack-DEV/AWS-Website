/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
import React, {
  useState, useLayoutEffect, useRef, useEffect, useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Text,
  Dimensions,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import { useIsFocused } from '@react-navigation/native';
import EventCalendar from '../../../components/Schedule/EventCalendar/EventCalendar';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'
import ScheduleTabView from '../../../components/Home/ScheduleTabView';
import EventScheduleScreen from './EventScheduleScreen';
import fonts from '../../../Constants/Fonts';
import TwoTabView from '../../../components/Schedule/TowTabView';
import BackForwardView from '../../../components/Schedule/BackForwardView';
import EventInCalender from '../../../components/Schedule/EventInCalender';
import EventAgendaSection from '../../../components/Schedule/EventAgendaSection';
import CalendarTimeTableView from '../../../components/Schedule/CalendarTimeTableView';
import AuthContext from '../../../auth/context'
import * as RefereeUtils from '../../referee/RefereeUtility';
import * as ScorekeeperUtils from '../../scorekeeper/ScorekeeperUtility';

import * as Utils from '../../challenge/ChallengeUtility';

import {
  getEventById, getEvents, getSlots,
  // deleteEvent
} from '../../../api/Schedule';
import CreateEventButton from '../../../components/Schedule/CreateEventButton';
import CreateEventBtnModal from '../../../components/Schedule/CreateEventBtnModal';
import EventBlockTimeTableView from '../../../components/Schedule/EventBlockTimeTableView';
import strings from '../../../Constants/String';
import { getRefereeReservationDetails, getScorekeeperReservationDetails } from '../../../api/Reservations';
import Header from '../../../components/Home/Header';
import RefereeReservationItem from '../../../components/Schedule/RefereeReservationItem';
import { getGameHomeScreen } from '../../../utils/gameUtils';
import TCSearchBox from '../../../components/TCSearchBox';
import TCInnerLoader from '../../../components/TCInnerLoader';
import ScorekeeperReservationItem from '../../../components/Schedule/ScorekeeperReservationItem';
import { getHitSlop } from '../../../utils';

const { width } = Dimensions.get('window');

export default function ScheduleScreen({ navigation }) {
  const authContext = useContext(AuthContext)
  const isFocused = useIsFocused();
  const [scheduleIndexCounter, setScheduleIndexCounter] = useState(0);
  const [eventData, setEventData] = useState([]);
  const [timeTable, setTimeTable] = useState([]);
  const [selectedEventItem, setSelectedEventItem] = useState(null);
  const [eventSelectDate, setEventSelectDate] = useState(new Date());
  const [searchText, setSearchText] = useState('');
  const [timetableSelectDate, setTimeTableSelectDate] = useState(new Date());
  const [filterEventData, setFilterEventData] = useState([]);
  const [filterTimeTable, setFilterTimeTable] = useState([]);
  const [calenderInnerIndexCounter, setCalenderInnerIdexCounter] = useState(0);
  const [loading, setloading] = useState(false);
  const [createEventModal, setCreateEventModal] = useState(false);
  const [isRefereeModal, setIsRefereeModal] = useState(false);
  const [isScorekeeperModal, setIsScorekeeperModal] = useState(false);
  const [refereeReservData, setRefereeReserveData] = useState([]);
  const [scorekeeperReservData, setScorekeeperReserveData] = useState([]);
  const [searchEvents, setSearchEvents] = useState();
  useEffect(() => {
    if (isFocused) {
      setloading(true);
      const unsubscribe = navigation.addListener('focus', async () => {
        const date = moment(new Date()).format('YYYY-MM-DD');
        const entity = authContext.entity
        const entityRole = entity.role === 'user' ? 'users' : 'groups';
        const uid = entity.uid || entity.auth.user_id;
        const eventdata = [];
        const timetabledata = [];
        let eventTimeTableData = [];
        getEvents(entityRole, uid, authContext).then((response) => {
          getSlots(entityRole, uid, authContext).then((res) => {
            eventTimeTableData = [...response.payload, ...res.payload];
            console.log('Event data::', eventTimeTableData);

            setEventData((eventTimeTableData || []).sort((a, b) => new Date(a.start_datetime * 1000) - new Date(b.start_datetime * 1000)));
            setSearchEvents(eventTimeTableData)
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
            setloading(false);
          }).catch(() => setloading(false));
        }).catch((e) => {
          setloading(false);
          Alert.alert('', e.messages)
        })
        return null;
      });
      return () => {
        unsubscribe();
      };
    }
  }, [authContext, isFocused, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
        hitSlop={getHitSlop(15)}
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

  const refereeFound = (data) => (data?.game?.referees || []).some((e) => authContext.entity.uid === e.referee_id)
  const scorekeeperFound = (data) => (data?.game?.scorekeepers || []).some((e) => authContext.entity.uid === e.scorekeeper_id)

  const actionSheet = useRef();
  const eventEditDeleteAction = useRef();
  const selectionDate = moment(eventSelectDate).format('YYYY-MM-DD');
  const timeTableSelectionDate = moment(timetableSelectDate).format('YYYY-MM-DD');

  const refereeReservModal = () => {
    setIsRefereeModal(!isRefereeModal);
  };
  const scorekeeperReservModal = () => {
    setIsScorekeeperModal(!isScorekeeperModal);
  };
  const findCancelButtonIndex = (data) => {
    if (data?.game && refereeFound(data)) {
      return 2
    }
    if (data?.game && scorekeeperFound(data)) {
      return 2
    }
    if (data?.game) {
      return 4
    }
    return 2
  }
  const goToChallengeDetail = (data) => {
    if (data?.responsible_to_secure_venue) {
      setloading(true);
      Utils.getChallengeDetail(data?.challenge_id, authContext).then((obj) => {
        setloading(false);
        console.log('Challenge Object:', JSON.stringify(obj.challengeObj));
        console.log('Screen name of challenge:', obj.screenName);
        navigation.navigate(obj.screenName, {
          challengeObj: obj.challengeObj || obj.challengeObj[0],
        });
        setloading(false);
      });
    }
  }
  const actionSheetOpetions = () => {
    if (selectedEventItem !== null && selectedEventItem.game) {
      if (refereeFound(selectedEventItem)) {
        return ['Referee Reservation Details', 'Change Events Color', 'Cancel']
      }
      if (scorekeeperFound(selectedEventItem)) {
        return ['Scorekeeper Reservation Details', 'Change Events Color', 'Cancel']
      }
      return ['Game Reservation Details', 'Referee Reservation Details', 'Scorekeeper Reservation Details', 'Change Events Color', 'Cancel']
    }
    return ['Edit', 'Delete', 'Cancel']
  }
  const goToRefereReservationDetail = (data) => {
    setloading(true);
    RefereeUtils.getRefereeReservationDetail(data?.reservation_id, authContext.entity.uid, authContext).then((obj) => {
      setloading(false);
      console.log('Reservation Object:', JSON.stringify(obj.reservationObj));
      console.log('Screen name of Reservation:', obj.screenName);
      navigation.navigate(obj.screenName, {
        reservationObj: obj.reservationObj || obj.reservationObj[0],
      });
      setloading(false);
    });
  }
  const goToScorekeeperReservationDetail = (data) => {
    console.log('Reservation data:', JSON.stringify(data));
    setloading(true);
    ScorekeeperUtils.getScorekeeperReservationDetail(data?.reservation_id, authContext.entity.uid, authContext).then((obj) => {
      setloading(false);
      console.log('Reservation Object:', JSON.stringify(obj.reservationObj));
      console.log('Screen name of Reservation:', obj.screenName);
      navigation.navigate(obj.screenName, {
        reservationObj: obj.reservationObj || obj.reservationObj[0],
      });
      setloading(false);
    }).catch(() => setloading(false));
  }
  const searchFilterFunction = (text) => {
    const result = searchEvents.filter(
      (x) => (x.game?.venue?.address.toLowerCase().includes(text.toLowerCase())),
    );
    setEventData(result);
  };
  return (
    <View style={ styles.mainContainer }>

      {/* <SearchView
        placeholder={strings.searchText}
        onChangeText={(text) => {
          setSearchText(text);
        }}
        value={searchText}
        sectionStyle={{ width: searchText.trim().length > 0 ? wp('84%') : wp('92%') }}
        cancelViewShow={searchText.trim().length > 0}
        onCancelPress={() => {
          setSearchText('');
        }}
      /> */}
      <TCSearchBox
      onChangeText={(text) => {
        setSearchText(text);
        searchFilterFunction(text)
      }}
      placeholderText={strings.serchByLocation}
      value={searchText}
      style = {{ alignSelf: 'center', marginTop: 15 }}/>
      {/* <View style={styles.seapratorViewStyle} /> */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          {/* <View style={{ padding: 5, height: 16, width: 16 }} /> */}
          <ScheduleTabView
            firstTabTitle={'Events'}
            secondTabTitle={'Calender'}
            indexCounter={scheduleIndexCounter}
            onFirstTabPress={() => setScheduleIndexCounter(0)}
            onSecondTabPress={() => setScheduleIndexCounter(1)}
          />
          {/* <TouchableIcon
            source={images.searchLocation}
            onItemPress={() => {}}
          /> */}
        </View>
        <TCInnerLoader visible={loading} />
        {!loading && scheduleIndexCounter === 0 && <View style={{ flex: 1 }}>
          <EventScheduleScreen
            eventData={eventData}
            navigation={navigation}
            profileID={authContext.entity.uid}
            onThreeDotPress={(item) => {
              setSelectedEventItem(item);
            }}
            onItemPress={async (item) => {
              const entity = authContext.entity
              if (item?.game_id) {
                if (item?.game?.sport) {
                  const gameHome = getGameHomeScreen(item.game.sport);
                  navigation.navigate(gameHome, {
                    gameId: item?.game_id,
                  })
                }
              } else {
                getEventById(entity.role === 'user' ? 'users' : 'groups', entity.uid || entity.auth.user_id, item.cal_id, authContext).then((response) => {
                  navigation.navigate('EventScreen', { data: response.payload, gameData: item });
                }).catch((e) => {
                  console.log('Error :-', e);
                })
              }
            }}
            entity={authContext.entity}
          />
          {!createEventModal && <CreateEventButton
            source={images.plus}
            onPress={() => setCreateEventModal(true) }
          />}
        </View>}
        {!loading && scheduleIndexCounter === 1 && <View style={{ flex: 1 }}>
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
            renderItem={(item) => {
              if (item.length > 0) {
                return (
                  <FlatList
                    data={item}
                    renderItem={({ item: itemValue }) => (itemValue.cal_type === 'event' && <EventInCalender
                      onPress={async () => {
                        const entity = authContext.entity
                        if (itemValue?.game_id) {
                          if (itemValue?.game?.sport) {
                            const gameHome = getGameHomeScreen(itemValue.game.sport);
                            navigation.navigate(gameHome, {
                              gameId: itemValue?.game_id,
                            })
                          }
                        } else {
                          getEventById(entity.role === 'user' ? 'users' : 'groups', entity.uid || entity.auth.user_id, itemValue.cal_id, authContext).then((response) => {
                            navigation.navigate('EventScreen', { data: response.payload, gameData: itemValue });
                          }).catch((e) => {
                            console.log('Error :-', e);
                          })
                        }
                      }}
                      eventBetweenSection={itemValue.game}
                      eventOfSection={itemValue.game && itemValue.game.referees && itemValue.game.referees.length > 0}
                      onThreeDotPress={() => {
                        setSelectedEventItem(itemValue);
                      }}
                      data={itemValue}
                      entity={authContext.entity}
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
                  />
                );
              }
              return <Text style={styles.dataNotFoundText}>Data Not Found!</Text>;
            }}
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
        options={['Default Color', 'Group Events Display', 'View Privacy', 'Cancel']}
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

      <Modal
        isVisible={isRefereeModal}
        backdropColor="black"
        style={{ margin: 0, justifyContent: 'flex-end' }}
        hasBackdrop
        onBackdropPress={() => {
          setIsRefereeModal(false);
        }}
        backdropOpacity={0}
      >
        <SafeAreaView style={styles.modalMainViewStyle}>
          <Header
            mainContainerStyle={styles.headerMainContainerStyle}
            leftComponent={
              <TouchableOpacity onPress={() => {
                setIsRefereeModal(false);
              }}>
                <Image source={images.cancelImage} style={styles.cancelImageStyle} resizeMode={'contain'} />
              </TouchableOpacity>
            }
            centerComponent={
              <Text style={styles.headerCenterStyle}>{'Choose a referee'}</Text>
            }
          />
          <View style={styles.sepratorStyle} />
          <FlatList
            data={refereeReservData}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={[styles.sepratorStyle, { marginHorizontal: 15 }]} />}
            renderItem={({ item }) => <RefereeReservationItem
              data={item}
              onPressButton = {() => {
                setIsRefereeModal(false);
                console.log('choose Referee:', item);
                goToRefereReservationDetail(item)
              }}
            />}
            keyExtractor={(item, index) => index.toString()}
          />
        </SafeAreaView>
      </Modal>
      {/* Scorekeeper modal */}
      <Modal
        isVisible={isScorekeeperModal}
        backdropColor="black"
        style={{ margin: 0, justifyContent: 'flex-end' }}
        hasBackdrop
        onBackdropPress={() => {
          setIsScorekeeperModal(false);
        }}
        backdropOpacity={0}
      >
        <SafeAreaView style={styles.modalMainViewStyle}>
          <Header
            mainContainerStyle={styles.headerMainContainerStyle}
            leftComponent={
              <TouchableOpacity onPress={() => {
                setIsScorekeeperModal(false);
              }}>
                <Image source={images.cancelImage} style={styles.cancelImageStyle} resizeMode={'contain'} />
              </TouchableOpacity>
            }
            centerComponent={
              <Text style={styles.headerCenterStyle}>{strings.chooseScorekeeperText}</Text>
            }
          />
          <View style={styles.sepratorStyle} />
          <FlatList
            data={scorekeeperReservData}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={[styles.sepratorStyle, { marginHorizontal: 15 }]} />}
            renderItem={({ item }) => <ScorekeeperReservationItem
              data={item}
              onPressButton = {() => {
                setIsScorekeeperModal(false);
                console.log('choose Scorekeeper:', item);
                goToScorekeeperReservationDetail(item)
              }}
            />}
            keyExtractor={(item, index) => index.toString()}
          />
        </SafeAreaView>
      </Modal>
      {/* Scorekeeper modal */}
      <ActionSheet
        ref={eventEditDeleteAction}
        options={actionSheetOpetions()}
        cancelButtonIndex={findCancelButtonIndex(selectedEventItem)}
        destructiveButtonIndex={selectedEventItem !== null && !selectedEventItem.game && 1}
        onPress={(index) => {
          if (actionSheetOpetions()?.[index] === 'Referee Reservation Details') {
            if (refereeFound(selectedEventItem)) {
              goToRefereReservationDetail(selectedEventItem)
            } else {
              setloading(true);
              const params = {
                caller_id: authContext.entity.uid,
              };
              getRefereeReservationDetails(selectedEventItem.game_id, params, authContext).then((res) => {
                console.log('Res :-', res);
                const myReferee = (res?.payload || []).filter((e) => e.initiated_by === authContext.entity.uid)
                setRefereeReserveData(myReferee);
                if (myReferee.length > 0) {
                  refereeReservModal();
                  setloading(false);
                } else {
                  setloading(false);
                  setTimeout(() => {
                    Alert.alert(
                      'Towns Cup',
                      'No referees invited or booked by you for this game',
                      [{
                        text: 'OK',
                        onPress: async () => {},
                      },
                      ],
                      { cancelable: false },
                    );
                  }, 0);
                }
              }).catch((error) => {
                setloading(false);
                console.log('Error :-', error);
              });
            }
            console.log('Referee:::', index);
          }
          if (actionSheetOpetions()?.[index] === 'Scorekeeper Reservation Details') {
            if (scorekeeperFound(selectedEventItem)) {
              goToScorekeeperReservationDetail(selectedEventItem)
            } else {
              setloading(true);
              const params = {
                caller_id: authContext.entity.uid,
              };
              getScorekeeperReservationDetails(selectedEventItem.game_id, params, authContext).then((res) => {
                console.log('Res :-', res);
                const myScorekeeper = (res?.payload || []).filter((e) => e.initiated_by === authContext.entity.uid)
                setScorekeeperReserveData(myScorekeeper);
                if (myScorekeeper.length > 0) {
                  scorekeeperReservModal();
                  setloading(false);
                } else {
                  setloading(false);
                  setTimeout(() => {
                    Alert.alert(
                      'Towns Cup',
                      'No scorekeepers invited or booked by you for this game',
                      [{
                        text: 'OK',
                        onPress: async () => {},
                      },
                      ],
                      { cancelable: false },
                    );
                  }, 0);
                }
              }).catch((error) => {
                setloading(false);
                console.log('Error :-', error);
              });
            }
            console.log('Scorekeeper:::', index);
          }
          if (actionSheetOpetions()?.[index] === 'Game Reservation Details') {
            goToChallengeDetail(selectedEventItem.game)
            console.log('Game:::', index);
          }
          if (actionSheetOpetions()?.[index] === 'Change Events Color') {
            navigation.navigate('EditEventScreen', { data: selectedEventItem, gameData: selectedEventItem });
            console.log('Event:::', index);
          }
          setSelectedEventItem(null);
        }
        }
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
  dataNotFoundText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    marginTop: 10,
  },

  modalMainViewStyle: {
    shadowOpacity: 0.15,
    shadowOffset: {
      height: -10,
      width: 0,
    },
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: hp('32%'),
  },
  headerMainContainerStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 15,
  },
  cancelImageStyle: {
    height: 15,
    width: 15,
    tintColor: colors.lightBlackColor,
  },
  headerCenterStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
  sepratorStyle: {
    height: 1,
    backgroundColor: colors.writePostSepratorColor,
  },
});
