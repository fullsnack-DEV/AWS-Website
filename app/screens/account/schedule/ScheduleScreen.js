/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  SectionList,
} from 'react-native';

import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {RRule} from 'rrule';

import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import EventScheduleScreen from './EventScheduleScreen';
import fonts from '../../../Constants/Fonts';
import EventAgendaSection from '../../../components/Schedule/EventAgendaSection';
import AuthContext from '../../../auth/context';
import * as RefereeUtils from '../../referee/RefereeUtility';
import * as ScorekeeperUtils from '../../scorekeeper/ScorekeeperUtility';
import * as Utils from '../../challenge/ChallengeUtility';
import {getEventById} from '../../../api/Schedule';
import strings from '../../../Constants/String';
import {
  getRefereeReservationDetails,
  getScorekeeperReservationDetails,
} from '../../../api/Reservations';
import Header from '../../../components/Home/Header';
import RefereeReservationItem from '../../../components/Schedule/RefereeReservationItem';
import {getGameHomeScreen} from '../../../utils/gameUtils';
import TCInnerLoader from '../../../components/TCInnerLoader';
import ScorekeeperReservationItem from '../../../components/Schedule/ScorekeeperReservationItem';
import {getHitSlop} from '../../../utils';
import {getUnreadCount} from '../../../api/Notificaitons';
import * as Utility from '../../../utils/index';

import BlockSlotView from '../../../components/Schedule/BlockSlotView';
import MonthHeader from '../../../components/Schedule/Monthheader';
import {getGameIndex} from '../../../api/elasticSearch';
import TCAccountDeactivate from '../../../components/TCAccountDeactivate';
import {userActivate} from '../../../api/Users';
import {groupUnpaused} from '../../../api/Groups';
import {getQBAccountType, QBupdateUser} from '../../../utils/QuickBlox';

let selectedCalendarDate = moment(new Date());

export default function ScheduleScreen({navigation, route}) {
  let authContext = useContext(AuthContext);

  if (route?.params?.isBackVisible) {
    authContext = {
      entity: {
        role: route?.params?.role,
        uid: route?.params?.uid,
      },
    };
    if (route?.params?.role === 'team' || route?.params?.role === 'club') {
      authContext.entity.obj = {
        group_id: route?.params?.uid,
        entity_type: route?.params?.role,
      };
      authContext.entity.auth = {
        group_id: route?.params?.uid,
        entity_type: route?.params?.role,
      };
    } else {
      authContext.entity.obj = {
        user_id: route?.params?.uid,
        entity_type: route?.params?.role,
      };
      authContext.entity.auth = {
        user_id: route?.params?.uid,
        entity_type: route?.params?.role,
      };
    }
  }

  const actionSheet = useRef();
  const plusActionSheet = useRef();
  const isFocused = useIsFocused();

  const [scheduleIndexCounter, setScheduleIndexCounter] = useState(0);
  const [eventData, setEventData] = useState([]);
  const [timeTable, setTimeTable] = useState([]);
  const [selectedEventItem, setSelectedEventItem] = useState(null);
  const [eventSelectDate, setEventSelectDate] = useState(new Date());
  const [loading, setloading] = useState(false);
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
  const [currentTab, setCurrentTab] = useState();
  const [groupList, setGroupList] = useState([]);
  const [notifAPI, setNotifAPI] = useState();

  const [animatedOpacityValue] = useState(new Animated.Value(0));
  const [slots, setSlots] = useState();
  const [blockedGroups, setBlockedGroups] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');

  useEffect(() => {
    setIsAccountDeactivated(false);
    setPointEvent('auto');
    if (isFocused) {
      console.log('its called....', authContext.entity.role);
      if (authContext?.entity?.obj?.is_pause === true) {
        setIsAccountDeactivated(true);
        setPointEvent('none');
      }
      if (authContext?.entity?.obj?.is_deactivate === true) {
        setIsAccountDeactivated(true);
        setPointEvent('none');
      }
    }
  }, [
    authContext.entity?.obj.entity_type,
    authContext.entity?.obj?.is_deactivate,
    authContext.entity?.obj?.is_pause,
    authContext.entity.role,
    isFocused,
  ]);

  useEffect(() => {
    getBlockedSlots();
    if (route?.params?.isBackVisible) {
      getEventsList(authContext.entity.obj);
    }
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
      const newEvent = {...event};
      const date = new Date(item);
      newEvent.start_datetime = Math.round(date.getTime() / 1000);
      newEvent.end_datetime = newEvent.start_datetime + duration;
      item = newEvent;
      return item;
    });
    return occr;
  };

  const getBlockedSlots = () => {
    console.log('Other team Object:', authContext?.entity?.obj);
    // blockedSlots(
    //   authContext?.entity?.obj?.entity_type === 'player' ? 'users' : 'groups',
    //   authContext?.entity?.obj?.group_id || authContext?.entity?.obj?.user_id,
    //   authContext,
    // )

    Utility.getCalendar(
      authContext?.entity?.uid,
      Number(parseFloat(new Date().getTime() / 1000).toFixed(0)),
    )
      .then((response) => {
        setloading(false);
        console.log('Events List get Calender:=>', response);
        const bookSlots = [];
        response.forEach((item) => {
          if (item?.rrule) {
            const rEvents = getEventOccuranceFromRule(item);
            console.log('Recurring Events List:=>', rEvents);
            bookSlots.push(...rEvents);
          } else {
            bookSlots.push(item);
          }
        });
        console.log('Book slot', bookSlots);
        // const bookSlots = response.payload;
        setSlots(bookSlots);

        const markedDates = {};

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
        bookSlots?.map((e) => {
          console.log('start date list :=>', e);
          const original_date = moment(
            new Date(e.start_datetime * 1000),
          ).format('yyyy-MM-DD');
          console.log('original_date', original_date);
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
        });
        setMarkingDays(markedDates);
        console.log('Marked dates::', markedDates);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const configureEvents = useCallback(
    (eventsData, games) => {
      console.log('gamesgames::::::->', games);
      console.log('gaeventsDatamesgames', games);
      const eventTimeTableData = eventsData.map((item) => {
        if (item?.game_id) {
          const gameObj =
            (games || []).filter((game) => game.game_id === item.game_id) ?? [];

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
          (a, b) =>
            new Date(a.start_datetime * 1000) -
            new Date(b.start_datetime * 1000),
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

      const tempMarkDate = {};
      (eventsData || []).filter((event_item) => {
        const startDate = new Date(event_item.start_datetime * 1000);
        const eventDate = moment(startDate).format('YYYY-MM-DD');
        tempMarkDate[eventDate] = {
          event: true,
          selected: false,
        };
      });
      setMarkingDays(tempMarkDate);
    },
    [eventData, selectedDate],
  );

  const getEventsList = useCallback(
    (selectedObj) => {
      setloading(true);
      console.log('selectedObj:=>', selectedObj);

      let eventTimeTableData = [];
      Utility.getCalendar(
        authContext?.entity?.uid,
        Number(parseFloat(new Date().getTime() / 1000).toFixed(0)),
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
                if (
                  obj?.expiry_datetime >=
                  parseFloat(new Date().getTime() / 1000).toFixed(0)
                ) {
                  return obj;
                }
              } else {
                return obj;
              }
            }
          });

          const bookSlots = [];
          response.forEach((item) => {
            if (item?.rrule) {
              const rEvents = getEventOccuranceFromRule(item);
              console.log('Recurring Events List:=>', rEvents);
              bookSlots.push(...rEvents);
            } else {
              bookSlots.push(item);
            }
          });

          console.log('filter list:=>', response);

          eventTimeTableData = bookSlots;
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
              console.log('game index', games);

              const listObj = response.map((obj) => {
                if (obj.game_id === obj.challenge_id) {
                  return obj.game;
                }
              });

              const pendingChallenge = listObj.filter((obj) => {
                return obj !== undefined;
              });
              console.log('listObj', pendingChallenge);

              Utility.getGamesList([...games, ...pendingChallenge]).then(
                (gamedata) => {
                  console.log('gamedata', gamedata);
                  configureEvents(eventTimeTableData, gamedata);
                },
              );
            });
          }
          console.log('eventTimeTableData::=>', eventTimeTableData);
          configureEvents(eventTimeTableData);
          setloading(false);
        })
        .catch((e) => {
          setloading(false);
          console.log('Error::=>', e);
          Alert.alert(strings.alertmessagetitle, e.messages);
        });
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

  const refereeFound = (data) =>
    (data?.game?.referees || []).some(
      (e) => authContext.entity.uid === e.referee_id,
    );
  const scorekeeperFound = (data) =>
    (data?.game?.scorekeepers || []).some(
      (e) => authContext.entity.uid === e.scorekeeper_id,
    );

  const eventEditDeleteAction = useRef();

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
    if (data?.challenge_id) {
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
    } else {
      Alert.alert('This challenge is not confirmed yet.');
    }
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

  useEffect(() => {
    if (isFocused) {
      if (notifAPI !== 1) {
        getUnreadCount(authContext).then((response) => {
          if (response?.status === true) {
            const {teams} = response.payload;
            const {clubs} = response.payload;
            const groups = [authContext.entity.auth.user, ...clubs, ...teams];
            const entityId =
              authContext?.entity?.role === 'user'
                ? authContext?.entity?.obj?.user_id
                : authContext?.entity?.obj?.group_id;
            const tabIndex = groups.findIndex(
              (item) => item?.group_id === entityId,
            );
            setGroupList(groups);
            setNotifAPI(1);
            setCurrentTab(tabIndex !== -1 ? tabIndex : 0);
            getEventsList(groups[tabIndex]);
          }
        });
      }
      if (notifAPI === 1) {
        getEventsList(groupList[currentTab]);
      }
    }
  }, [currentTab, isFocused]);

  const onThreeDotPress = useCallback(() => {
    actionSheet.current.show();
  }, []);

  const onAddPlusPress = useCallback(() => {
    plusActionSheet.current.show();
  }, []);

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

  const getSelectedDayEvents = useCallback(
    (date) => {
      const markedDates = {...markingDays};
      console.log('MARKED::', Object.keys(markedDates));

      Object.keys(markedDates).forEach((e) => {
        if (markedDates[e].selected) {
          markedDates[e].selected = false;
        }
        if (markedDates[e].selected) {
          if (!markedDates[e].event) {
            markedDates[e].selected = false;
            delete markedDates[e];
          }
        }
      });
      if (markedDates[date]) {
        markedDates[date].selected = true;
      } else {
        markedDates[date] = {selected: true};
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
        getSimpleDateFormat(new Date(e.start_datetime)) ===
        getSimpleDateFormat(new Date(dateObj.dateString))
      ) {
        temp.push(e);
      }
    });
    // setBlockedSlot(temp);
    return null;
  };

  const onReachedCalenderTop = ({nativeEvent: e}) => {
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

  const unPauseGroup = () => {
    setloading(true);
    groupUnpaused(authContext)
      .then((response) => {
        setIsAccountDeactivated(false);
        console.log('deactivate account ', response);

        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(
          response?.payload?.user_id,
          response?.payload,
          accountType,
          response.payload,
          authContext,
        )
          .then(() => {
            setloading(false);
          })
          .catch((error) => {
            console.log('QB error : ', error);
            setloading(false);
          });
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const reActivateUser = () => {
    setloading(true);
    userActivate(authContext)
      .then((response) => {
        console.log('deactivate account ', response);

        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(
          response?.payload?.user_id,
          response?.payload,
          accountType,
          response.payload,
          authContext,
        )
          .then(() => {
            setloading(false);
          })
          .catch((error) => {
            console.log('QB error : ', error);
            setloading(false);
          });
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{opacity: isAccountDeactivated ? 0.5 : 1}}
        pointerEvents={pointEvent}>
        <Header
          leftComponent={
            <TouchableOpacity
              onPress={() => {
                if (route?.params?.isBackVisible) {
                  navigation.navigate('HomeScreen', {
                    uid: route?.params?.uid,
                    role: route?.params?.role,
                    backButtonVisible: true,
                    menuBtnVisible: false,
                  });
                }
              }}>
              <FastImage
                source={
                  route?.params?.isBackVisible
                    ? images.backArrow
                    : images.tc_message_top_icon
                }
                resizeMode={'contain'}
                style={
                  route?.params?.isBackVisible
                    ? styles.backStyle
                    : styles.backImageStyle
                }
              />
            </TouchableOpacity>
          }
          showBackgroundColor={true}
          centerComponent={
            <Text style={styles.eventTitleTextStyle}>Schedule</Text>
          }
          rightComponent={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity onPress={onAddPlusPress}>
                <Image
                  source={images.addEvent}
                  style={[styles.headerRightImg, {marginRight: 10}]}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onThreeDotPress}>
                <Image
                  source={images.threeDotIcon}
                  style={styles.headerRight3DotImg}
                />
              </TouchableOpacity>
            </View>
          }
        />
        <View style={styles.separateLine} />
      </View>
      {isAccountDeactivated && (
        <TCAccountDeactivate
          type={
            authContext?.entity?.obj?.is_pause === true
              ? 'pause'
              : authContext?.entity?.obj?.under_terminate === true
              ? 'terminate'
              : 'deactivate'
          }
          onPress={() => {
            Alert.alert(
              `Are you sure you want to ${
                authContext?.entity?.obj?.is_pause === true
                  ? 'unpause'
                  : 'reactivate'
              } this account?`,
              '',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text:
                    authContext?.entity?.obj?.is_pause === true
                      ? 'Unpause'
                      : 'Reactivate',
                  style: 'destructive',
                  onPress: () => {
                    if (authContext?.entity?.obj?.is_pause === true) {
                      unPauseGroup();
                    } else {
                      reActivateUser();
                    }
                  },
                },
              ],
              {cancelable: false},
            );
          }}
        />
      )}
      <View
        style={[
          styles.mainContainer,
          {opacity: isAccountDeactivated ? 0.5 : 1},
        ]}
        pointerEvents={pointEvent}
        needsOffscreenAlphaCompositing>
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              margin: 15,
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={
                  scheduleIndexCounter === 0
                    ? styles.activeButton
                    : styles.inActiveButton
                }
                onPress={() => {
                  setScheduleIndexCounter(0);
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
                  setScheduleIndexCounter(1);
                }}>
                Availability
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              {/* {!isMenu && scheduleIndexCounter !== 1 && (
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                style={{marginRight: 15}}
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
            )} */}
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                onPress={() => {
                  setIsMenu(!isMenu);
                  setShowTimeTable(false);
                  setEventSelectDate(null);
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
          <View style={[styles.separateLine, {marginBottom: 12}]} />
          <TCInnerLoader visible={loading} />
          {!loading && scheduleIndexCounter === 0 && (
            <View style={{flex: 1}}>
              <ScrollView
                style={{flex: 1, backgroundColor: colors.lightGrayBackground}}
                onScroll={onScrollCalender}
                nestedScrollEnabled
                stickyHeaderIndices={[0]}>
                {isMenu && <MonthHeader />}
                {!isMenu && (
                  <EventAgendaSection
                    onScrollCalender={onScrollCalender}
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
                <EventScheduleScreen
                isMenu={isMenu}
                  eventData={
                    eventSelectDate
                      ? (eventData || []).filter(
                          (e) =>
                            moment(eventSelectDate).format('YYYY-MM-DD') ===
                            moment(e.start_datetime * 1000).format(
                              'YYYY-MM-DD',
                            ),
                        )
                      : eventData
                  }
                  navigation={navigation}
                  profileID={authContext.entity.uid}
                  onThreeDotPress={(item) => {
                    setSelectedEventItem(item);
                  }}
                  onItemPress={async (item) => {
                    console.log('Clicked ITEM:=>', item);
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
                  }}
                  entity={authContext.entity}
                />
              </ScrollView>

            
            </View>
          )}
          {!loading && scheduleIndexCounter === 1 && (
            <View style={{flex: 1}}>
              <ScrollView
                style={{flex: 1}}
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
                    renderItem={({item}) => (
                      <BlockSlotView
                        startDate={item.start_datetime}
                        endDate={item.end_datetime}
                        allDay={item.allDay}
                      />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    renderSectionHeader={({section: {title}}) => (
                      <Text style={styles.sectionHeader}>
                        {moment(new Date(title)).format('dddd, MMM DD, YYYY')}
                      </Text>
                    )}
                  />
                </View>
              </ScrollView>
             
            </View>
          )}
        </View>
        <ActionSheet
          ref={actionSheet}
          options={
            authContext.entity.role === 'player' ||
            authContext.entity.role === 'user'
              ? [
                  'Default Color',
                  'Group Events Display',
                  'View Privacy',
                  'Cancel',
                ]
              : ['Default Color', 'View Privacy', 'Cancel']
          }
          cancelButtonIndex={
            authContext.entity.role === 'player' ||
            authContext.entity.role === 'user'
              ? 3
              : 2
          }
          // destructiveButtonIndex={3}
          onPress={(index) => {
            if (index === 0) {
              navigation.navigate('DefaultColorScreen');
            } else if (index === 1) {
              if (
                authContext.entity.role === 'player' ||
                authContext.entity.role === 'user'
              ) {
                navigation.navigate('GroupEventScreen');
              } else {
                navigation.navigate('ViewPrivacyScreen');
              }
            } else if (index === 2) {
              navigation.navigate('ViewPrivacyScreen');
            }
          }}
        />

        <Modal
          isVisible={isRefereeModal}
          backdropColor="black"
          style={{margin: 0, justifyContent: 'flex-end'}}
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
                <Text style={styles.headerCenterStyle}>
                  {'Choose a referee'}
                </Text>
              }
            />
            <View style={styles.sepratorStyle} />
            <FlatList
              data={refereeReservData}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View style={[styles.sepratorStyle, {marginHorizontal: 15}]} />
              )}
              renderItem={({item}) => (
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
          style={{margin: 0, justifyContent: 'flex-end'}}
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
                <View style={[styles.sepratorStyle, {marginHorizontal: 15}]} />
              )}
              renderItem={({item}) => (
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
                          strings.appName,
                          'No referees invited or booked by you for this game',
                          [
                            {
                              text: 'OK',
                              onPress: async () => {},
                            },
                          ],
                          {cancelable: false},
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
              actionSheetOpetions()?.[index] ===
              'Scorekeeper Reservation Details'
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
                          strings.appName,
                          'No scorekeepers invited or booked by you for this game',
                          [
                            {
                              text: 'OK',
                              onPress: async () => {},
                            },
                          ],
                          {cancelable: false},
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
      <ActionSheet
        ref={plusActionSheet}
        options={['Set challenge availibility', 'Create an event', 'Cancel']}
        cancelButtonIndex={2}
        // destructiveButtonIndex={3}
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate('EditChallengeAvailability');
          } else if (index === 1) {
            navigation.navigate('CreateEventScreen', {
              comeName: 'ScheduleScreen',
            });
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
  activeButton: {
    marginRight: 20,
    fontSize: 16,
    fontFamily: fonts.RBlack,
    color: colors.darkYellowColor,
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
    tintColor: colors.lightBlackColor,
  },
  headerRight3DotImg: {
    height: 18,
    resizeMode: 'contain',
    width: 20,
    tintColor: colors.lightBlackColor,
  },
  eventTitleTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
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
  backStyle: {
    height: 20,
    width: 35,
  },
  separateLine: {
    borderColor: colors.veryLightGray,
    borderWidth: 0.5,
  },
});
