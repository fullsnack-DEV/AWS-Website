/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
import React, {
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useContext,
  useCallback,
  useMemo,
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
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  Animated,
  Platform,
  SectionList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RRule } from 'rrule';

import { SpringScrollView } from 'react-native-spring-scrollview';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import EventCalendar from '../../../components/Schedule/EventCalendar/EventCalendar';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import EventScheduleScreen from './EventScheduleScreen';
import fonts from '../../../Constants/Fonts';

import EventAgendaSection from '../../../components/Schedule/EventAgendaSection';
import CalendarTimeTableView from '../../../components/Schedule/CalendarTimeTableView';
import AuthContext from '../../../auth/context';
import * as RefereeUtils from '../../referee/RefereeUtility';
import * as ScorekeeperUtils from '../../scorekeeper/ScorekeeperUtility';
import * as Utils from '../../challenge/ChallengeUtility';
import { getEventById } from '../../../api/Schedule';
import CreateEventButton from '../../../components/Schedule/CreateEventButton';
import CreateEventBtnModal from '../../../components/Schedule/CreateEventBtnModal';
import strings from '../../../Constants/String';
import {
  getRefereeReservationDetails,
  getScorekeeperReservationDetails,
} from '../../../api/Reservations';
import Header from '../../../components/Home/Header';
import RefereeReservationItem from '../../../components/Schedule/RefereeReservationItem';
import { getGameHomeScreen } from '../../../utils/gameUtils';
import TCInnerLoader from '../../../components/TCInnerLoader';
import ScorekeeperReservationItem from '../../../components/Schedule/ScorekeeperReservationItem';
import { getHitSlop } from '../../../utils';
import NotificationProfileItem from '../../../components/notificationComponent/NotificationProfileItem';
import { getUnreadCount } from '../../../api/Notificaitons';
import * as Utility from '../../../utils/index';
import {
  QB_ACCOUNT_TYPE,
  QBconnectAndSubscribe,
  QBlogin,
  QBLogout,
} from '../../../utils/QuickBlox';
import NotificationListTopHeaderShimmer from '../../../components/shimmer/account/NotificationListTopHeaderShimmer';
import TCThinDivider from '../../../components/TCThinDivider';
import BlockSlotView from '../../../components/Schedule/BlockSlotView';
import MonthHeader from '../../../components/Schedule/Monthheader';
import { getGameIndex } from '../../../api/elasticSearch';

let selectedCalendarDate = moment(new Date());
const { width } = Dimensions.get('window');

export default function ScheduleScreen({ navigation }) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [scheduleIndexCounter, setScheduleIndexCounter] = useState(0);
  const [eventData, setEventData] = useState([]);
  const [timeTable, setTimeTable] = useState([]);
  const [selectedEventItem, setSelectedEventItem] = useState(null);
  const [eventSelectDate, setEventSelectDate] = useState(new Date());
  const [filterTimeTable, setFilterTimeTable] = useState([]);
  const [loading, setloading] = useState(false);
  const [createEventModal, setCreateEventModal] = useState(false);
  const [isRefereeModal, setIsRefereeModal] = useState(false);
  const [isScorekeeperModal, setIsScorekeeperModal] = useState(false);
  const [refereeReservData, setRefereeReserveData] = useState([]);
  const [scorekeeperReservData, setScorekeeperReserveData] = useState([]);
  const [showTimeTable, setShowTimeTable] = useState(false);
  const [isMenu, setIsMenu] = useState(false);

  const [listView, setListView] = useState(true);

  const [selectedCalendarDateString] = useState(
    selectedCalendarDate.format('YYYY-MM-DD'),
  );

  const [markingDays, setMarkingDays] = useState({});

  const actionSheet = useRef();
  const [currentTab, setCurrentTab] = useState();
  const [groupList, setGroupList] = useState([]);
  const [notifAPI, setNotifAPI] = useState();
  const refContainer = useRef();
  const [selectedEntity, setSelectedEntity] = useState();
  const [activeScreen, setActiveScreen] = useState(false);
  const [animatedOpacityValue] = useState(new Animated.Value(0));
  const [slots, setSlots] = useState();

  const [blockedGroups, setBlockedGroups] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          hitSlop={getHitSlop(15)}
          onPress={() => {
            actionSheet.current.show();
          }}>
          <Image source={images.vertical3Dot} style={styles.headerRightImg} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    getBlockedSlots();
  }, [isFocused]);

  const getSimpleDateFormat = (dateValue) => {
    moment.locale('en');
    return moment(new Date(dateValue)).format('yy/MM/DD');
  };

  const getEventOccuranceFromRule = (event) => {
    console.log('OFFSET:=>', Intl.DateTimeFormat().resolvedOptions().timeZone);
    const ruleObj = RRule.parseString(event.rrule);

    ruleObj.dtstart = new Date(
      new Date((event.start_datetime + 6 * 3600) * 1000).toLocaleString(
        'en-US',
        {
          timeZone: 'Asia/Calcutta',
        },
      ),
    );

    ruleObj.until = new Date(
      new Date(event.untilDate * 1000).toLocaleString('en-US', {
        timeZone: 'Asia/Calcutta',
      }),
    );

    ruleObj.tzid = 'Asia/Calcutta';

    console.log('ruleObj::=>', ruleObj);
    const rule = new RRule(ruleObj);
    const duration = event.end_datetime - event.start_datetime;
    let occr = rule.all();
    console.log('occr::=>', occr);
    occr = occr.map((item) => {
      // console.log(
      //   'item::=>',
      //   item.toLocaleDateString(),
      //   item.toLocaleTimeString(),
      // );
      const newEvent = { ...event };
      const date = new Date(item);
      newEvent.start_datetime = Math.round(date.getTime() / 1000);
      newEvent.end_datetime = newEvent.start_datetime + duration;
      item = newEvent;
      return item;
    });
    return occr;
  };

  const getBlockedSlots = () => {
    setloading(true);
    console.log('Other team Object:', authContext?.entity?.obj);
    // blockedSlots(
    //   authContext?.entity?.obj?.entity_type === 'player' ? 'users' : 'groups',
    //   authContext?.entity?.obj?.group_id || authContext?.entity?.obj?.user_id,
    //   authContext,
    // )

    Utility.getCalendar(
      authContext?.entity?.obj?.group_id || authContext?.entity?.obj?.user_id,
      new Date().getTime() / 1000,
    )
      .then((response) => {
        setloading(false);
        console.log('Events List:=>', response);
        const bookSlots = [];
        response.forEach((item) => {
          if (item.rrule) {
            const rEvents = getEventOccuranceFromRule(item);
            bookSlots.push(...rEvents);
          } else {
            bookSlots.push(item);
          }
        });
        console.log('Book slot', bookSlots);
        // const bookSlots = response.payload;
        setSlots(bookSlots);

        const markedDates = {};

        // const start = new Date();
        // start.setHours(0, 0, 0, 0);

        // const end = new Date();
        // end.setHours(23, 59, 59, 999);

        // const timespan = 30 * 60; // 30 minutes

        // const newArrayOfObj = bookSlots.map((e) => ({
        //   ...e,
        //   start: e.start_datetime,
        //   end: e.end_datetime,
        // }));

        // const bookable = availability(start, end, timespan, newArrayOfObj);
        // console.log('bookable:=>', bookable);

        const group = bookSlots.reduce((groups, data) => {
          const title = moment(new Date(data.start_datetime * 1000)).format(
            'yyyy-MM-DD',
          );
          if (!groups[title]) {
            groups[title] = [];
          }
          groups[title].push(data);
          return groups;
        }, {});
        const groupArrays = Object.keys(group).map((date) => ({
          title: date,
          data: group[date],
        }));

        setBlockedGroups(
          groupArrays.sort((b, a) => new Date(b.title) - new Date(a.title)),
        );
        console.log('Groups:=>', group);
        // eslint-disable-next-line array-callback-return
        (bookSlots || []).map((e) => {
          const original_date = moment(
            new Date(e.start_datetime * 1000),
          ).format('yyyy-MM-DD');
          if (e.allDay === true) {
            markedDates[original_date] = {
              disabled: true,
              startingDay: true,
              endingDay: true,
              disableTouchEvent: true,
              customStyles: {
                container: {
                  backgroundColor: colors.lightgrayColor,
                },
                text: {
                  color: colors.grayColor,
                },
              },
            };
          } else {
            markedDates[original_date] = {
              marked: true,
              dotColor: colors.themeColor,
              activeOpacity: 1,
            };
          }

          console.log('BLOCKED::', markedDates);
        });

        console.log('Marked dates::', JSON.stringify(markedDates));
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const configureEvents = useCallback(
    (eventsData, games) => {
      const eventTimeTableData = eventsData.map((item) => {
        if (item?.game_id) {
          const gameObj = (games || []).filter((game) => game.game_id === item.game_id) ?? [];

          if (gameObj.length > 0) {
            item.game = gameObj[0];
          }
        } else {
          return item;
        }

        return item;
      });

      setEventData(
        (eventTimeTableData || []).sort(
          (a, b) => new Date(a.start_datetime * 1000)
            - new Date(b.start_datetime * 1000),
        ),
      );

      setTimeTable(eventTimeTableData);

      (eventTimeTableData || []).filter((event_item) => {
        const startDate = new Date(event_item.start_datetime * 1000);
        const eventDate = moment(startDate).format('YYYY-MM-DD');

        if (eventDate === selectedDate) {
          eventData.push(event_item);
        }
        return null;
      });
      drawMarkDay(eventsData);
      // setFilterEventData(eventData);
      // (eventTimeTableData || []).filter((timetable_item) => {
      //   const timetable_date = new Date(timetable_item.start_datetime * 1000);
      //   const endDate = new Date(timetable_item.end_datetime * 1000);
      //   const timetabledate = moment(timetable_date).format('YYYY-MM-DD');
      //   if (timetabledate === selectedDate) {
      //     const obj = {
      //       ...timetable_item,
      //       start: moment(timetable_date).format('YYYY-MM-DD hh:mm:ss'),
      //       end: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
      //     };
      //     timetabledate.push(obj);
      //   }
      //   return null;
      // });
      // console.log('timetabledate', timetabledate);
      // setFilterTimeTable(timetabledate);
    },
    [eventData, selectedDate],
  );

  const getEventsList = useCallback(
    (selectedObj) => {
      setloading(true);
      console.log('selectedObj:=>', selectedObj);

      let eventTimeTableData = [];
      Utility.getCalendar(
        authContext?.entity?.obj?.group_id || authContext?.entity?.obj?.user_id,
        new Date().getTime() / 1000,
      )
        // blockedSlots(entityRole, uid, authContext)
        .then((response) => {
          console.log('calender list:=>', response);

          response = (response || []).filter((obj) => {
            if (obj.cal_type === 'blocked') {
              return obj;
            }
            if (obj.cal_type === 'event') {
              if (obj?.expiry_datetime) {
                if (obj?.expiry_datetime >= parseFloat(new Date().getTime() / 1000).toFixed(0)
                ) {
                  return obj;
                }
              } else {
                return obj
              }
            }
          });
          console.log('filter list:=>', response);

          eventTimeTableData = [...response];
          let gameIDs = [...new Set(response.map((item) => item.game_id))];

          gameIDs = (gameIDs || []).filter((item) => item !== undefined);
          console.log('gameIds  list:=>', gameIDs);

          if (gameIDs.length > 0) {
            const gameList = {
              query: {
                terms: {
                  _id: gameIDs,
                },
              },
            };

            getGameIndex(gameList).then((games) => {
              Utility.getGamesList(games).then((gamedata) => {
                configureEvents(eventTimeTableData, gamedata);
              })
            });
          }
          configureEvents(eventTimeTableData);
          setloading(false);
        })
        .catch((e) => {
          setloading(false);
          console.log('Error::=>', e);
          Alert.alert(strings.alertmessagetitle, e.messages);
        });
      return null;
    },
    [
      authContext?.entity?.obj?.group_id,
      authContext?.entity?.obj?.user_id,
      configureEvents,
    ],
  );

  // useEffect(() => {
  //     getEventsList(selectedEntity)
  // }, [getEventsList]);

  useEffect(() => {
    if (selectedEventItem) {
      eventEditDeleteAction.current.show();
    }
  }, [selectedEventItem]);

  const refereeFound = (data) => (data?.game?.referees || []).some(
      (e) => authContext.entity.uid === e.referee_id,
    );
  const scorekeeperFound = (data) => (data?.game?.scorekeepers || []).some(
      (e) => authContext.entity.uid === e.scorekeeper_id,
    );

  const eventEditDeleteAction = useRef();
  const selectionDate = moment(eventSelectDate).format('YYYY-MM-DD');

  const refereeReservModal = () => {
    setIsRefereeModal(!isRefereeModal);
  };
  const scorekeeperReservModal = () => {
    setIsScorekeeperModal(!isScorekeeperModal);
  };
  const findCancelButtonIndex = (data) => {
    if (data?.game && refereeFound(data)) {
      return 2;
    }
    if (data?.game && scorekeeperFound(data)) {
      return 2;
    }
    if (data?.game) {
      return 4;
    }
    return 2;
  };
  const goToChallengeDetail = (data) => {
    console.log('Go To Challenge', data);
    // if (data?.responsible_to_secure_venue) { //Write condition for soccer
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
    // }
  };
  const actionSheetOpetions = () => {
    if (selectedEventItem !== null && selectedEventItem.game) {
      if (refereeFound(selectedEventItem)) {
        return [
          'Referee Reservation Details',
          // 'Change Events Color',
          'Cancel',
        ];
      }
      if (scorekeeperFound(selectedEventItem)) {
        return [
          'Scorekeeper Reservation Details',
          // 'Change Events Color',
          'Cancel',
        ];
      }
      return [
        'Game Reservation Details',
        'Referee Reservation Details',
        'Scorekeeper Reservation Details',
        // 'Change Events Color',
        'Cancel',
      ];
    }
    return ['Edit', 'Delete', 'Cancel'];
  };
  const goToRefereReservationDetail = (data) => {
    setloading(true);
    RefereeUtils.getRefereeReservationDetail(
      data?.reservation_id,
      authContext.entity.uid,
      authContext,
    ).then((obj) => {
      setloading(false);
      console.log('Reservation Object:', JSON.stringify(obj.reservationObj));
      console.log('Screen name of Reservation:', obj.screenName);
      navigation.navigate(obj.screenName, {
        reservationObj: obj.reservationObj || obj.reservationObj[0],
      });
      setloading(false);
    });
  };
  const goToScorekeeperReservationDetail = (data) => {
    console.log('Reservation data:', JSON.stringify(data));
    setloading(true);
    ScorekeeperUtils.getScorekeeperReservationDetail(
      data?.reservation_id,
      authContext.entity.uid,
      authContext,
    )
      .then((obj) => {
        setloading(false);
        console.log('Reservation Object:', JSON.stringify(obj.reservationObj));
        console.log('Screen name of Reservation:', obj.screenName);
        navigation.navigate(obj.screenName, {
          reservationObj: obj.reservationObj || obj.reservationObj[0],
        });
        setloading(false);
      })
      .catch(() => setloading(false));
  };

  const switchProfile = async (item) => {
    let currentEntity = authContext.entity;

    if (item.entity_type === 'player') {
      currentEntity = {
        ...currentEntity,
        uid: item.user_id,
        role: 'user',
        obj: item,
      };
    } else if (item.entity_type === 'team') {
      currentEntity = {
        ...currentEntity,
        uid: item.group_id,
        role: 'team',
        obj: item,
      };
    } else if (item.entity_type === 'club') {
      currentEntity = {
        ...currentEntity,
        uid: item.group_id,
        role: 'club',
        obj: item,
      };
    }
    authContext.setEntity({ ...currentEntity });
    await Utility.setStorage('authContextEntity', { ...currentEntity });
    return currentEntity;
  };

  const switchQBAccount = async (accountData, entity) => {
    let currentEntity = entity;
    const entityType = accountData?.entity_type;
    const uid = entityType === 'player' ? 'user_id' : 'group_id';
    QBLogout()
      .then(() => {
        const {
 USER, CLUB, LEAGUE, TEAM,
 } = QB_ACCOUNT_TYPE;
        let accountType = USER;
        if (entityType === 'club') accountType = CLUB;
        else if (entityType === 'team') accountType = TEAM;
        else if (entityType === 'league') accountType = LEAGUE;
        QBlogin(
          accountData[uid],
          {
            ...accountData,
            full_name: accountData.group_name,
          },
          accountType,
        )
          .then(async (res) => {
            currentEntity = {
              ...currentEntity,
              QB: { ...res.user, connected: true, token: res?.session?.token },
            };
            authContext.setEntity({ ...currentEntity });
            await Utility.setStorage('authContextEntity', { ...currentEntity });
            QBconnectAndSubscribe(currentEntity)
              .then((qbRes) => {
                setloading(false);
                if (qbRes?.error) {
                  console.log('Towns Cup', qbRes?.error);
                }
              })
              .catch(() => {
                setloading(false);
              });
          })
          .catch(() => {
            setloading(false);
          });
      })
      .catch(() => {
        setloading(false);
      });
  };

  const onSwitchProfile = async (item) => {
    setloading(true);
    switchProfile(item)
      .then((currentEntity) => {
        setActiveScreen(true);
        switchQBAccount(item, currentEntity);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const showSwitchProfilePopup = () => {
    const name = selectedEntity.entity_type === 'player'
        ? `${selectedEntity.first_name} ${selectedEntity.last_name}`
        : selectedEntity.group_name;
    Alert.alert(
      `Do you want to switch account to ${name}?`,
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => onSwitchProfile(selectedEntity) },
      ],
      { cancelable: true },
    );
  };

  const activeTab = async (index) => {
    const gList = JSON.parse(JSON.stringify(groupList));
    console.log('ActiveTab called..=>', gList[index]);
    setSelectedEntity(gList[index]);
    setGroupList(gList);
    setScheduleIndexCounter(0);
    checkActiveScreen(gList[index]);
    setCurrentTab(index);
    refContainer.current.scrollToIndex({
      animated: true,
      index,
      viewPosition: 1,
    });
    getEventsList(gList[index]);
  };

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  useEffect(() => {
    if (isFocused) {
      if (notifAPI !== 1) {
        getUnreadCount(authContext).then((response) => {
          if (response.status === true) {
            const { teams } = response.payload;
            const { clubs } = response.payload;
            const groups = [authContext.entity.auth.user, ...clubs, ...teams];
            const entityId = authContext?.entity?.role === 'user'
                ? authContext?.entity?.obj?.user_id
                : authContext?.entity?.obj?.group_id;
            const tabIndex = groups.findIndex(
              (item) => item?.group_id === entityId,
            );
            setGroupList(groups);
            setNotifAPI(1);
            setCurrentTab(tabIndex !== -1 ? tabIndex : 0);
            checkActiveScreen(groups[0]);
            getEventsList(groups[tabIndex]);
          }
        });
      }
      if (notifAPI === 1) {
        checkActiveScreen(groupList[currentTab]);
        getEventsList(groupList[currentTab]);
      }
    }
  }, [currentTab, isFocused]);

  const renderGroupItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        if (groupList.length === 2) {
          if (index !== 2) {
            activeTab(index);
          }
        } else {
          activeTab(index);
        }
      }}
      key={index}>
      <NotificationProfileItem
        data={item}
        indexNumber={index}
        selectedIndex={currentTab}
      />
      {index !== currentTab && (
        <View
          style={{
            backgroundColor: colors.grayColor,
            opacity: 0.2,
            height: 2,
            shadowColor: colors.grayColor,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.8,
            shadowRadius: 5,
            elevation: 3,
          }}></View>
      )}
    </TouchableOpacity>
  );

  const checkActiveScreen = async (entity) => {
    const loggedInEntity = authContext.entity;
    const currentID = entity.entity_type === 'player' ? entity.user_id : entity.group_id;
    if (loggedInEntity.uid === currentID) {
      setActiveScreen(true);
    } else {
      setActiveScreen(false);
    }
  };

  const renderCalenderEvent = (event) => {
    console.log('renderCalenderEvent Event:', event);

    return (
      <View style={{ flex: 1 }}>
        {event?.cal_type === 'event' && event?.game && (
          <CalendarTimeTableView
            type="game"
            eventObj={event}
            containerStyle={{
              borderLeftColor: event_color,
              width: event.width,
            }}
            eventTitleStyle={{ color: event_color }}
            onPress={() => {
              const gameHome = getGameHomeScreen(event?.game?.sport);
              console.log('gameHome', gameHome);

              navigation.navigate(gameHome, {
                gameId: challengeData?.game_id,
              });
            }}
          />
        )}
        {event?.cal_type === 'event' && !event?.game && (
          <CalendarTimeTableView
            type="event"
            eventObj={event}
            containerStyle={{
              borderLeftColor: event_color,
              width: event.width,
            }}
            eventTitleStyle={{ color: event_color }}
            onPress={() => {
              Alert.alert('This is normal event');
            }}
          />
        )}
        {event?.cal_type === 'blocked' && (
          <View
            style={[
              styles.blockedViewStyle,
              {
                width: event.width + 68,
                height: event.height,
              },
            ]}
          />
        )}
      </View>
    );
  };

  const onThreeDotPress = useCallback(() => {
    actionSheet.current.show();
  }, []);

  const topRightButton = useMemo(
    () => (
      <TouchableOpacity onPress={onThreeDotPress}>
        <Image source={images.scheduleThreeDot} style={styles.headerRightImg} />
      </TouchableOpacity>
    ),
    [onThreeDotPress],
  );

  const renderTopHeader = useMemo(
    () => (
      <>
        <Header
          leftComponent={
            <View>
              <FastImage
                source={images.tc_message_top_icon}
                resizeMode={'contain'}
                style={styles.backImageStyle}
              />
            </View>
          }
          showBackgroundColor={true}
          centerComponent={
            <Text style={styles.eventTitleTextStyle}>Schedule</Text>
          }
          rightComponent={topRightButton}
        />
        <View style={styles.separateLine} />
      </>
    ),
    [topRightButton],
  );

  const onPressListView = useCallback((value, buttonIndex) => {
    console.log('List view Pressed:=>', value, buttonIndex);
    if (buttonIndex === 2) {
      setListView(value);
    } else if (buttonIndex === 1) {
      setShowTimeTable(value);
      // setMonthView(true)
    } else if (buttonIndex === 0) {
      setIsMenu(value);
      console.log('menu:=>', buttonIndex);
    }
  }, []);

  const onPressGridView = useCallback((value, buttonIndex) => {
    console.log('Grid view Pressed:=>', value, buttonIndex);
    if (buttonIndex === 2) {
      setListView(value);
    } else if (buttonIndex === 1) {
      setShowTimeTable(value);
      // setMonthView(false)
    } else if (buttonIndex === 0) {
      setIsMenu(value);
      console.log('menu:=>', buttonIndex);
    }
  }, []);

  const drawMarkDay = (eData) => {
    const eventTimeTableData = eData;
    const tempMarkDate = {};
    (eventTimeTableData || []).filter((event_item) => {
      const startDate = new Date(event_item.start_datetime * 1000);
      const eventDate = moment(startDate).format('YYYY-MM-DD');
      tempMarkDate[eventDate] = {
        event: true,
        selected: false,
      };
    });
    setMarkingDays(tempMarkDate);
  };

  const getSelectedDayEvents = useCallback(
    (date) => {
      const markedDates = { ...markingDays };
      console.log('MARKED::', Object.keys(markedDates));

      Object.keys(markedDates).forEach((e) => {
        if (markedDates[e].selected) {
          markedDates[e].selected = false;
        } else if (markedDates[e].selected) {
          if (!markedDates[e].event) {
            markedDates[e].selected = false;
            delete markedDates[e];
          }
        }
      });
      if (markedDates[date]) {
        markedDates[date].selected = true;
      } else {
        markedDates[date] = { selected: true };
      }
      setMarkingDays(markedDates);

      console.log('MARKED DATES::', JSON.stringify(markedDates));
    },
    [markingDays],
  );

  const onDayPress = (dateObj) => {
    selectedCalendarDate = moment(dateObj.dateString);
    getSelectedDayEvents(dateObj.dateString);
    // setselectedCalendarMonthString(selectedCalendarDateStr);
    // drawMarkDay(eventData)
    setEventSelectDate(dateObj.dateString);
    const date = moment(dateObj.dateString).format('YYYY-MM-DD');
    setSelectedDate(moment(dateObj.dateString).format('YYYY-MM-DD'));
    const dataItem = [];
    (timeTable || []).filter((time_table_item) => {
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

    const temp = [];
    (slots || []).map((e) => {
      if (
        getSimpleDateFormat(new Date(e.start_datetime))
        === getSimpleDateFormat(new Date(dateObj.dateString))
      ) {
        temp.push(e);
      }
    });
    // setBlockedSlot(temp);
    setFilterTimeTable(dataItem);
    return null;
  };

  const onReachedCalenderTop = ({ nativeEvent: e }) => {
    const offset = e?.contentOffset?.y;
    console.log('Offset calender:=>', offset);

    if (offset >= 20) {
      Animated.timing(animatedOpacityValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start(() => setListView(true));
    }
    if (offset <= -50) {
      // Platform.OS === 'ios' ? -80 : 1
      Animated.timing(animatedOpacityValue, {
        toValue: 0,
        useNativeDriver: true,
      }).start(() => setListView(false));
    }
  };

  const onScrollCalender = (event) => {
    onReachedCalenderTop(event);
  };

  return (
    <View
      style={[styles.mainContainer, { opacity: activeScreen ? 1.0 : 0.5 }]}
      needsOffscreenAlphaCompositing>
      {renderTopHeader}
      <View>
        {groupList?.length <= 0 ? (
          <NotificationListTopHeaderShimmer />
        ) : (
          groupList?.length > 1 && (
            <FlatList
              ref={refContainer}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={groupList.length === 2 ? [...groupList, {}] : groupList}
              renderItem={renderGroupItem}
              keyExtractor={keyExtractor}
              initialScrollIndex={currentTab}
              initialNumToRender={30}
              style={{
                paddingTop: 8,
                backgroundColor: colors.grayBackgroundColor,
              }}
              onScrollToIndexFailed={(info) => {
                const wait = new Promise((resolve) => setTimeout(resolve, 500));
                wait.then(() => {
                  refContainer.current.scrollToIndex({
                    animated: true,
                    index: info.index,
                  });
                });
              }}
            />
          )
        )}
      </View>

      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            margin: 15,
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={
                scheduleIndexCounter === 0
                  ? styles.activeButton
                  : styles.inActiveButton
              }
              onPress={() => {
                if (activeScreen) {
                  setScheduleIndexCounter(0);
                } else {
                  showSwitchProfilePopup();
                }
              }}>
              Events
            </Text>
            <Text
              style={
                scheduleIndexCounter === 1
                  ? styles.activeButton
                  : styles.inActiveButton
              }
              onPress={() => {
                if (activeScreen) {
                  setScheduleIndexCounter(1);
                } else {
                  showSwitchProfilePopup();
                }
              }}>
              Availability
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {!isMenu && scheduleIndexCounter !== 1 && (
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                style={{ marginRight: 15 }}
                onPress={() => {
                  setShowTimeTable(!showTimeTable);
                }}>
                <Image
                  source={
                    showTimeTable ? images.scheduleOrange : images.scheduleGray
                  }
                  style={{
                    resizeMode: 'contain',
                    height: 25,
                    width: 25,
                  }}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              onPress={() => {
                setIsMenu(!isMenu);
                setShowTimeTable(false);
              }}>
              <Image
                source={isMenu ? images.menuOrange : images.menuGray}
                style={{
                  resizeMode: 'contain',
                  height: 25,
                  width: 25,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TCThinDivider width={'100%'} marginBottom={12} />
        <TCInnerLoader visible={loading} />
        {!loading && scheduleIndexCounter === 0 && (
          <View style={{ flex: 1 }}>
            {Platform.OS === 'android' ? (
              <SpringScrollView
                style={{ flex: 1 }}
                onScroll={onScrollCalender}
                nestedScrollEnabled
                stickyHeaderIndices={[0]}>
                {isMenu && <MonthHeader />}
                {!isMenu && (
                  <EventAgendaSection
                    showTimeTable={showTimeTable}
                    isMenu={isMenu}
                    horizontal={listView}
                    onPressListView={onPressListView}
                    onPressGridView={onPressGridView}
                    onDayPress={onDayPress}
                    selectedCalendarDate={selectedCalendarDateString}
                    calendarMarkedDates={markingDays}
                  />
                )}

                {showTimeTable ? (
                  <View style={{ marginBottom: 100 }}>
                    <EventCalendar
                      eventTapped={(event) => {
                        console.log('Event ::--', event);
                      }}
                      events={filterTimeTable}
                      width={width}
                      initDate={selectionDate}
                      // scrollToFirst={false}
                      renderEvent={(event) => renderCalenderEvent(event)}
                      styles={{
                        event: styles.eventViewStyle,
                        line: { backgroundColor: colors.lightgrayColor },
                      }}
                    />
                  </View>
                ) : (
                  <EventScheduleScreen
                    eventData={
                      eventSelectDate
                        ? (eventData || []).filter(
                            (e) => moment(eventSelectDate).format('YYYY-MM-DD')
                              === moment(e.start_datetime * 1000).format(
                                'YYYY-MM-DD',
                              ),
                          )
                        : eventData
                    }
                    navigation={navigation}
                    profileID={authContext.entity.uid}
                    onThreeDotPress={(item) => {
                      if (activeScreen) {
                        setSelectedEventItem(item);
                      } else {
                        showSwitchProfilePopup();
                      }
                    }}
                    onItemPress={async (item) => {
                      if (activeScreen) {
                        const entity = authContext.entity;
                        if (item?.game_id) {
                          if (item?.game?.sport) {
                            const gameHome = getGameHomeScreen(item.game.sport);
                            navigation.navigate(gameHome, {
                              gameId: item?.game_id,
                            });
                          }
                        } else {
                          getEventById(
                            entity.role === 'user' ? 'users' : 'groups',
                            entity.uid || entity.auth.user_id,
                            item.cal_id,
                            authContext,
                          )
                            .then((response) => {
                              navigation.navigate('EventScreen', {
                                data: response.payload,
                                gameData: item,
                              });
                            })
                            .catch((e) => {
                              console.log('Error :-', e);
                            });
                        }
                      } else {
                        showSwitchProfilePopup();
                      }
                    }}
                    entity={authContext.entity}
                  />
                )}
              </SpringScrollView>
            ) : (
              <ScrollView
                style={{ flex: 1 }}
                onScroll={onScrollCalender}
                nestedScrollEnabled
                stickyHeaderIndices={[0]}>
                {isMenu && <MonthHeader />}
                {!isMenu && (
                  <EventAgendaSection
                    showTimeTable={showTimeTable}
                    isMenu={isMenu}
                    horizontal={listView}
                    onPressListView={onPressListView}
                    onPressGridView={onPressGridView}
                    onDayPress={onDayPress}
                    selectedCalendarDate={selectedCalendarDateString}
                    calendarMarkedDates={markingDays}
                  />
                )}

                {showTimeTable ? (
                  <View style={{ marginBottom: 100 }}>
                    <EventCalendar
                      eventTapped={(event) => {
                        console.log('Event ::--', event);
                      }}
                      events={filterTimeTable}
                      width={width}
                      initDate={selectionDate}
                      // scrollToFirst={false}
                      renderEvent={(event) => renderCalenderEvent(event)}
                      styles={{
                        event: styles.eventViewStyle,
                        line: { backgroundColor: colors.lightgrayColor },
                      }}
                    />
                  </View>
                ) : (
                  <EventScheduleScreen
                    eventData={
                      eventSelectDate
                        ? (eventData || []).filter(
                            (e) => moment(eventSelectDate).format('YYYY-MM-DD')
                              === moment(e.start_datetime * 1000).format(
                                'YYYY-MM-DD',
                              ),
                          )
                        : eventData
                    }
                    navigation={navigation}
                    profileID={authContext.entity.uid}
                    onThreeDotPress={(item) => {
                      if (activeScreen) {
                        setSelectedEventItem(item);
                      } else {
                        showSwitchProfilePopup();
                      }
                    }}
                    onItemPress={async (item) => {
                      console.log('Clicked ITEM:=>', item);
                      if (activeScreen) {
                        const entity = authContext.entity;
                        if (item?.game_id) {
                          if (item?.game?.sport) {
                            const gameHome = getGameHomeScreen(
                              item.game.sport.replace(' ', '_'),
                            );
                            navigation.navigate(gameHome, {
                              gameId: item?.game_id,
                            });
                          }
                        } else {
                          getEventById(
                            entity.role === 'user' ? 'users' : 'groups',
                            entity.uid || entity.auth.user_id,
                            item.cal_id,
                            authContext,
                          )
                            .then((response) => {
                              navigation.navigate('EventScreen', {
                                data: response.payload,
                                gameData: item,
                              });
                            })
                            .catch((e) => {
                              console.log('Error :-', e);
                            });
                        }
                      } else {
                        showSwitchProfilePopup();
                      }
                    }}
                    entity={authContext.entity}
                  />
                )}
              </ScrollView>
            )}
            {!createEventModal && (
              <CreateEventButton
                source={images.plus}
                onPress={() => {
                  if (activeScreen) {
                    setCreateEventModal(true);
                  } else {
                    showSwitchProfilePopup();
                  }
                }}
              />
            )}
          </View>
        )}
        {!loading && scheduleIndexCounter === 1 && (
          <View style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1 }}
              onScroll={onScrollCalender}
              nestedScrollEnabled
              stickyHeaderIndices={[0]}>
              {/* <EventAgendaSection
              showTimeTable={showTimeTable}
              isMenu={isMenu}
              horizontal={listView}
              onPressListView={onPressListView}
              onPressGridView={onPressGridView}
              onDayPress={onDayPress}
              selectedCalendarDate={selectedCalendarDateString}
              calendarMarkedDates={markingDays}
            /> */}
              {isMenu && <MonthHeader />}
              {!isMenu && (
                <EventAgendaSection
                  showTimeTable={showTimeTable}
                  isMenu={isMenu}
                  horizontal={listView}
                  onPressListView={onPressListView}
                  onPressGridView={onPressGridView}
                  onDayPress={onDayPress}
                  selectedCalendarDate={selectedCalendarDateString}
                  calendarMarkedDates={markingDays}
                />
              )}
              {/* Availibility bottom view */}

              <View>
                {/* <Text style={styles.slotHeader}>
                Available time For challenge
              </Text> */}
                <SectionList
                  sections={blockedGroups}
                  renderItem={({ item }) => (
                    <BlockSlotView
                      startDate={item.start_datetime}
                      endDate={item.end_datetime}
                      allDay={item.allDay}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>
                      {moment(new Date(title)).format('dddd, MMM DD, YYYY')}
                    </Text>
                  )}
                />
              </View>
            </ScrollView>
            {!createEventModal && (
              <CreateEventButton
                source={images.plus}
                onPress={() => setCreateEventModal(true)}
              />
            )}
          </View>
        )}
      </View>
      <CreateEventBtnModal
        visible={createEventModal}
        onCancelPress={() => setCreateEventModal(false)}
        onCreateEventPress={() => {
          setCreateEventModal(false);
          navigation.navigate('CreateEventScreen', {
            comeName: 'ScheduleScreen',
          });
        }}
        onChallengePress={() => {
          setCreateEventModal(false);
          navigation.navigate('EditChallengeAvailability');
        }}
      />
      <ActionSheet
        ref={actionSheet}
        options={[
          'Default Color',
          'Group Events Display',
          'View Privacy',
          'Cancel',
        ]}
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
        backdropOpacity={0}>
        <SafeAreaView style={styles.modalMainViewStyle}>
          <Header
            mainContainerStyle={styles.headerMainContainerStyle}
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  setIsRefereeModal(false);
                }}>
                <Image
                  source={images.cancelImage}
                  style={styles.cancelImageStyle}
                  resizeMode={'contain'}
                />
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
            ItemSeparatorComponent={() => (
              <View style={[styles.sepratorStyle, { marginHorizontal: 15 }]} />
            )}
            renderItem={({ item }) => (
              <RefereeReservationItem
                data={item}
                onPressButton={() => {
                  setIsRefereeModal(false);
                  console.log('choose Referee:', item);
                  goToRefereReservationDetail(item);
                }}
              />
            )}
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
        backdropOpacity={0}>
        <SafeAreaView style={styles.modalMainViewStyle}>
          <Header
            mainContainerStyle={styles.headerMainContainerStyle}
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  setIsScorekeeperModal(false);
                }}>
                <Image
                 hitSlop={getHitSlop(15)}
                  source={images.cancelImage}
                  style={styles.cancelImageStyle}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            }
            centerComponent={
              <Text style={styles.headerCenterStyle}>
                {strings.chooseScorekeeperText}
              </Text>
            }
          />
          <View style={styles.sepratorStyle} />
          <FlatList
            data={scorekeeperReservData}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={[styles.sepratorStyle, { marginHorizontal: 15 }]} />
            )}
            renderItem={({ item }) => (
              <ScorekeeperReservationItem
                data={item}
                onPressButton={() => {
                  setIsScorekeeperModal(false);
                  console.log('choose Scorekeeper:', item);
                  goToScorekeeperReservationDetail(item);
                }}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </SafeAreaView>
      </Modal>
      {/* Scorekeeper modal */}
      <ActionSheet
        ref={eventEditDeleteAction}
        options={actionSheetOpetions()}
        cancelButtonIndex={findCancelButtonIndex(selectedEventItem)}
        destructiveButtonIndex={
          selectedEventItem !== null && !selectedEventItem.game && 1
        }
        onPress={(index) => {
          if (
            actionSheetOpetions()?.[index] === 'Referee Reservation Details'
          ) {
            if (refereeFound(selectedEventItem)) {
              goToRefereReservationDetail(selectedEventItem);
            } else {
              setloading(true);
              const params = {
                caller_id: authContext.entity.uid,
              };
              getRefereeReservationDetails(
                selectedEventItem.game_id,
                params,
                authContext,
              )
                .then((res) => {
                  console.log('Res :-', res);
                  const myReferee = (res?.payload || []).filter(
                    (e) => e.initiated_by === authContext.entity.uid,
                  );
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
                        [
                          {
                            text: 'OK',
                            onPress: async () => {},
                          },
                        ],
                        { cancelable: false },
                      );
                    }, 0);
                  }
                })
                .catch((error) => {
                  setloading(false);
                  console.log('Error :-', error);
                });
            }
            console.log('Referee:::', index);
          }
          if (
            actionSheetOpetions()?.[index] === 'Scorekeeper Reservation Details'
          ) {
            if (scorekeeperFound(selectedEventItem)) {
              goToScorekeeperReservationDetail(selectedEventItem);
            } else {
              setloading(true);
              const params = {
                caller_id: authContext.entity.uid,
              };
              getScorekeeperReservationDetails(
                selectedEventItem.game_id,
                params,
                authContext,
              )
                .then((res) => {
                  console.log('Res :-', res);
                  const myScorekeeper = (res?.payload || []).filter(
                    (e) => e.initiated_by === authContext.entity.uid,
                  );
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
                        [
                          {
                            text: 'OK',
                            onPress: async () => {},
                          },
                        ],
                        { cancelable: false },
                      );
                    }, 0);
                  }
                })
                .catch((error) => {
                  setloading(false);
                  console.log('Error :-', error);
                });
            }
            console.log('Scorekeeper:::', index);
          }
          if (actionSheetOpetions()?.[index] === 'Game Reservation Details') {
            goToChallengeDetail(selectedEventItem.game);
            console.log('Game:::', index);
          }
          if (actionSheetOpetions()?.[index] === 'Change Events Color') {
            navigation.navigate('EditEventScreen', {
              data: selectedEventItem,
              gameData: selectedEventItem,
            });
            console.log('Event:::', index);
          }
          if (actionSheetOpetions()?.[index] === 'Edit') {
            navigation.navigate('EditEventScreen', {
              data: selectedEventItem,
              gameData: selectedEventItem,
            });
            console.log('Event:::', index);
          }
          if (actionSheetOpetions()?.[index] === 'Delete') {
            console.log('Event Delete');
          }
          setSelectedEventItem(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  // shceduleCalenderView: {
  //   flexDirection: 'row',
  //   width: wp('94%'),
  //   alignSelf: 'center',
  //   paddingBottom: 10,
  //   justifyContent: 'space-between',
  // },
  // filterHeaderText: {
  //   marginLeft: 12,
  //   marginRight: 8,
  //   marginVertical: 5,
  //   fontSize: 25,
  //   color: colors.orangeColor,
  //   fontFamily: fonts.RMedium,
  // },
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

  blockedViewStyle: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    marginLeft: -59,
    borderRadius: 10,
  },
  // dataNotFoundText: {
  //   fontSize: 16,
  //   fontFamily: fonts.RRegular,
  //   color: colors.lightBlackColor,
  //   alignSelf: 'center',
  //   marginTop: 10,
  // },

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
  activeButton: {
    marginRight: 20,
    fontSize: 16,
    fontFamily: fonts.RBlack,
    color: colors.themeColor,
  },
  inActiveButton: {
    marginRight: 20,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  headerRightImg: {
    height: 25,
    resizeMode: 'contain',
    width: 25,
  },
  eventTitleTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
  separateLine: {
    borderColor: colors.grayColor,
    borderWidth: 0.5,
    width: wp(100),
  },

  sectionHeader: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 8,
    marginTop: 8,
  },
  backImageStyle: {
    height: 35,
    width: 35,
  },
});
