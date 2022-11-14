/* eslint-disable no-return-assign */
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
  Dimensions,
} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {RRule} from 'rrule';

import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import CalendarStrip from 'react-native-calendar-strip';
import {format} from 'react-string-format';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import EventScheduleScreen from './EventScheduleScreen';
import fonts from '../../../Constants/Fonts';

import AuthContext from '../../../auth/context';
import * as RefereeUtils from '../../referee/RefereeUtility';
import * as ScorekeeperUtils from '../../scorekeeper/ScorekeeperUtility';
import * as Utils from '../../challenge/ChallengeUtility';
import {getEventById} from '../../../api/Schedule';
import {strings} from '../../../../Localization/translation';
import {
  getRefereeReservationDetails,
  getScorekeeperReservationDetails,
} from '../../../api/Reservations';
import Header from '../../../components/Home/Header';
import RefereeReservationItem from '../../../components/Schedule/RefereeReservationItem';
import {getGameHomeScreen} from '../../../utils/gameUtils';
import ScorekeeperReservationItem from '../../../components/Schedule/ScorekeeperReservationItem';
import {getHitSlop, getSportName} from '../../../utils';
import * as Utility from '../../../utils/index';
import BlockSlotView from '../../../components/Schedule/BlockSlotView';
import {getGameIndex} from '../../../api/elasticSearch';
import TCAccountDeactivate from '../../../components/TCAccountDeactivate';
import {getUserSettings, userActivate} from '../../../api/Users';
import {getGroups, groupUnpaused} from '../../../api/Groups';
import {getQBAccountType, QBupdateUser} from '../../../utils/QuickBlox';
import TCThinDivider from '../../../components/TCThinDivider';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {reservationOpetions} from '../../../utils/constant';
import Verbs from '../../../Constants/Verbs';

export default function ScheduleScreen({navigation, route}) {
  let authContext = useContext(AuthContext);
  const refContainer = useRef();
  const sortFilterData = ['Organizer', 'Sport', 'Activity Type'];
  const sortFilterDataClub = ['Organizer', 'Sport'];

  const timeFilterData = ['Future', 'Past'];

  const [sports, setSports] = useState([]);
  const [organizerOptions, setOrganizerOptions] = useState([]);

  if (route?.params?.isBackVisible) {
    authContext = {
      entity: {
        role: route?.params?.role,
        uid: route?.params?.uid,
      },
    };
    if (
      route?.params?.role === Verbs.entityTypeTeam ||
      route?.params?.role === Verbs.entityTypeClub
    ) {
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
  const [selectedEventItem, setSelectedEventItem] = useState(null);
  const [loading, setloading] = useState(false);
  const [isRefereeModal, setIsRefereeModal] = useState(false);
  const [isScorekeeperModal, setIsScorekeeperModal] = useState(false);
  const [refereeReservData, setRefereeReserveData] = useState([]);
  const [scorekeeperReservData, setScorekeeperReserveData] = useState([]);

  const [indigator, setIndigator] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState({
    option: 0,
    title: 'All',
  });
  const [filterSetting, setFilterSetting] = useState({
    sort: 0,
    time: 0,
  });

  const [sortFilterOption, setSortFilterOpetion] = useState(0);
  const [timeFilterOpetion, setTimeFilterOpetion] = useState(0);
  const [filterPopup, setFilterPopup] = useState(false);

  const [slots, setSlots] = useState();
  const [allSlots, setAllSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );

  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');

  useEffect(() => {
    setIsAccountDeactivated(false);
    setPointEvent('auto');
    if (isFocused) {
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

  const fromGoBack = (flag) => {
    if (flag) {
      setFilterPopup(true);
    }
  };

  const getEventOccuranceFromRule = (event) => {
    const ruleObj = RRule.parseString(event.rrule);
    ruleObj.dtstart = Utility.getJSDate(event.start_datetime);
    ruleObj.until = Utility.getJSDate(event.untilDate);
    const rule = new RRule(ruleObj);
    const duration = event.end_datetime - event.start_datetime;
    let occr = rule.all();
    occr = occr.map((RRItem) => {
      const newEvent = {...event};
      newEvent.start_datetime = Utility.getTCDate(RRItem);
      newEvent.end_datetime = newEvent.start_datetime + duration;
      RRItem = newEvent;
      return RRItem;
    });
    return occr;
  };

  useEffect(() => {
    setloading(true);
    getUserSettings(authContext)
      .then((setting) => {
        if (setting?.payload?.user !== {}) {
          if (
            setting?.payload?.user?.schedule_group_filter &&
            setting?.payload?.user?.schedule_group_filter?.length > 0
          ) {
            setOrganizerOptions([
              {group_name: 'All', group_id: 0},
              {group_name: 'Me', group_id: 1},
              ...setting?.payload?.user?.schedule_group_filter,
              {group_name: 'Others', group_id: 2},
            ]);
          } else {
            getGroups(authContext)
              .then((response) => {
                const {teams, clubs} = response.payload ?? [];
                if (response.payload.length > 0) {
                  setOrganizerOptions([
                    {group_name: 'All', group_id: 0},
                    {group_name: 'Me', group_id: 1},
                    ...teams,
                    ...clubs,
                    {group_name: 'Others', group_id: 2},
                  ]);
                } else {
                  setOrganizerOptions([
                    {group_name: 'All', group_id: 0},
                    {group_name: 'Me', group_id: 1},
                    {group_name: 'Others', group_id: 2},
                  ]);
                }

                setloading(false);
              })
              .catch((e) => {
                setloading(false);
                console.log('Error==>', e.message);
                Alert.alert(strings.townsCupTitle, e.message);
              });
          }
          if (
            setting?.payload?.user?.schedule_sport_filter &&
            setting?.payload?.user?.schedule_sport_filter?.length > 0
          ) {
            setSports([
              {sport: 'All'},
              ...setting?.payload?.user?.schedule_sport_filter,
              {sport: 'Others'},
            ]);
          } else {
            const sportsList = [
              ...(authContext?.entity?.obj?.registered_sports?.filter(
                (obj) => obj.is_active,
              ) || []),
              ...(authContext?.entity?.obj?.referee_data?.filter(
                (obj) => obj.is_active,
              ) || []),
              ...(authContext?.entity?.obj?.scorekeeper_data?.filter(
                (obj) => obj.is_active,
              ) || []),
            ];

            const res = sportsList.map((obj) => ({
              sport: obj.sport,
            }));
            const data = Utility.uniqueArray(res, 'sport');

            setSports([{sport: 'All'}, ...data, {sport: 'Others'}]);
          }
        }
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        console.log('Error==>', e.message);
        Alert.alert(e.message);
      });
  }, [authContext, isFocused]);

  const configureEvents = useCallback((eventsData, games) => {
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
          Utility.getJSDate(a.start_datetime) -
          Utility.getJSDate(b.start_datetime),
      ),
    );
  }, []);

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
    // if (data?.responsible_to_secure_venue) { //Write condition for soccer
    if (data?.challenge_id) {
      setloading(true);
      Utils.getChallengeDetail(data?.challenge_id, authContext).then((obj) => {
        setloading(false);
        navigation.navigate(obj.screenName, {
          challengeObj: obj.challengeObj || obj.challengeObj[0],
        });
        setloading(false);
      });
    } else {
      Alert.alert(strings.challengeNotConfirmedYet);
    }
    // }
  };
  const actionSheetOpetions = () => {
    if (selectedEventItem !== null && selectedEventItem.game) {
      if (refereeFound(selectedEventItem)) {
        return [
          'Referee Reservation Details',
          // 'Change Events Color',
          strings.cancel,
        ];
      }
      if (scorekeeperFound(selectedEventItem)) {
        return [
          'Scorekeeper Reservation Details',
          // 'Change Events Color',
          strings.cancel,
        ];
      }

      return [
        'Game Reservation Details',
        'Referee Reservation Details',
        'Scorekeeper Reservation Details',
        // 'Change Events Color',
        strings.cancel,
      ];
    }
    return ['Edit', 'Delete', strings.cancel];
  };
  const goToRefereReservationDetail = (data) => {
    setloading(true);
    RefereeUtils.getRefereeReservationDetail(
      data?.reservation_id,
      authContext.entity.uid,
      authContext,
    ).then((obj) => {
      setloading(false);
      navigation.navigate(obj.screenName, {
        reservationObj: obj.reservationObj || obj.reservationObj[0],
      });
      setloading(false);
    });
  };
  const goToScorekeeperReservationDetail = (data) => {
    setloading(true);
    ScorekeeperUtils.getScorekeeperReservationDetail(
      data?.reservation_id,
      authContext.entity.uid,
      authContext,
    )
      .then((obj) => {
        setloading(false);
        navigation.navigate(obj.screenName, {
          reservationObj: obj.reservationObj || obj.reservationObj[0],
        });
        setloading(false);
      })
      .catch(() => setloading(false));
  };

  useEffect(() => {
    if (isFocused) {
      getEventsAndSlotsList();
    }
  }, [isFocused]);

  const onAddPlusPress = useCallback(() => {
    plusActionSheet.current.show();
  }, []);

  const onDayPress = useCallback(
    (dateObj) => {
      const start = new Date(dateObj);
      start.setHours(0, 0, 0, 0);
      setSelectedDate(start);

      console.log('allSlots', allSlots);

      const temp = [];
      for (const blockedSlot of allSlots) {
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
      if (temp?.[0]?.allDay === true && temp?.[0]?.blocked === true) {
        setSlots(temp);
      } else {
        timeSlots = createCalenderTimeSlots(Utility.getTCDate(start), 24, temp);
        setSlots(timeSlots);
      }
    },
    [allSlots],
  );

  const createCalenderTimeSlots = (startTime, hours, blockedSlots) => {
    const tSlots = [];
    let startSlotTime = startTime;
    const lastSlotTime = startTime + hours * 60 * 60;
    for (const blockedSlot of blockedSlots) {
      if (lastSlotTime > blockedSlot?.start_datetime) {
        tSlots.push({
          start_datetime: startSlotTime,
          end_datetime: blockedSlot?.start_datetime,
          blocked: false,
        });

        tSlots.push({
          start_datetime: blockedSlot.start_datetime,
          end_datetime: blockedSlot.end_datetime,
          blocked: true,
        });

        startSlotTime = blockedSlot.end_datetime;
      }
    }

    tSlots.push({
      start_datetime: startSlotTime,
      end_datetime: lastSlotTime,
      blocked: false,
    });

    return tSlots;
  };

  const getEventsAndSlotsList = useCallback(() => {
    setloading(true);
    const eventTimeTableData = [];
    Utility.getCalendar(authContext?.entity?.uid, Utility.getTCDate(new Date()))
      .then((response) => {
        let resCalenders = [];
        if (response) {
          // eslint-disable-next-line no-unused-vars
          resCalenders = response.filter((obj) => {
            if (obj.cal_type === 'blocked') {
              return obj;
            }
            if (obj.cal_type === 'event') {
              if (obj?.expiry_datetime) {
                if (obj?.expiry_datetime >= Utility.getTCDate(new Date())) {
                  return obj;
                }
              } else {
                return obj;
              }
            }
          });
        }

        resCalenders.forEach((item) => {
          if (item?.rrule) {
            let rEvents = getEventOccuranceFromRule(item);
            rEvents = rEvents.filter(
              (x) => x.end_datetime > Utility.getTCDate(new Date()),
            );
            eventTimeTableData.push(...rEvents);
          } else {
            eventTimeTableData.push(item);
          }
        });
        onDayPress(new Date());
        setAllSlots(eventTimeTableData);
        let gameIDs = [...new Set(response.map((item) => item.game_id))];
        gameIDs = (gameIDs || []).filter((item) => item !== undefined);
        if (gameIDs.length > 0) {
          const gameList = {
            query: {
              terms: {
                _id: gameIDs,
              },
            },
          };

          getGameIndex(gameList).then((games) => {
            const listObj = response.map((obj) => {
              if (obj.game_id === obj.challenge_id) {
                return obj.game;
              }
            });

            const pendingChallenge = listObj.filter((obj) => obj !== undefined);

            Utility.getGamesList([
              ...games,
              ...pendingChallenge,
              ...response.filter((obj) => obj.owner_id),
            ]).then((gamedata) => {
              setloading(false);
              configureEvents(eventTimeTableData, gamedata);
            });
          });
        }

        configureEvents(eventTimeTableData);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(strings.alertmessagetitle, e.message);
      });
  }, [authContext?.entity?.uid, configureEvents, onDayPress]);

  const unPauseGroup = () => {
    setloading(true);
    groupUnpaused(authContext)
      .then((response) => {
        setIsAccountDeactivated(false);

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
          console.log('Error==>', e.message);
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const reActivateUser = () => {
    setloading(true);
    userActivate(authContext)
      .then((response) => {
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
          console.log('Error==>', e.message);
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const makeOpetionsSelected = useCallback(
    (item) => {
      if (sortFilterOption === 0) {
        if (
          selectedOptions.title.group_name === item.group_name ||
          selectedOptions.title === item.group_name
        ) {
          return styles.sportSelectedName;
        }
        return styles.sportName;
      }
      if (sortFilterOption === 1) {
        if (selectedOptions.title.sport === item.sport) {
          return styles.sportSelectedName;
        }
        return styles.sportName;
      }
      if (sortFilterOption === 2) {
        if (selectedOptions.title === item) {
          return styles.sportSelectedName;
        }
        return styles.sportName;
      }
    },
    [selectedOptions.title, sortFilterOption],
  );

  const optionsListView = useCallback(
    ({item, index}) => (
      <Text
        style={makeOpetionsSelected(item)}
        onPress={() => {
          refContainer.current.scrollToIndex({
            animated: true,
            index,
            viewPosition: 0.8,
          });
          console.log('selected sport::=>', item);
          setSelectedOptions({
            option: sortFilterOption,
            title: item,
          });
        }}>
        {item?.sport
          ? item?.sport === 'All'
            ? 'All'
            : getSportName(item, authContext)
          : item}
      </Text>
    ),
    [authContext, makeOpetionsSelected, sortFilterOption],
  );

  const sportOptionsListView = useCallback(
    ({item, index}) => (
      <Text
        style={makeOpetionsSelected(item)}
        onPress={() => {
          refContainer.current.scrollToIndex({
            animated: true,
            index,
            viewPosition: 0.5,
          });
          console.log('selected sport::=>', item);
          setSelectedOptions({
            option: sortFilterOption,
            title: item,
          });
        }}>
        {item.sport[0].toUpperCase() + item.sport.slice(1)}
      </Text>
    ),
    [makeOpetionsSelected, selectedOptions.title, sortFilterOption],
  );

  const organizerListView = useCallback(
    ({item, index}) => (
      <Text
        style={makeOpetionsSelected(item)}
        onPress={() => {
          refContainer.current.scrollToIndex({
            animated: true,
            index,
            viewPosition: 0.5,
          });
          console.log('selected sport::=>', item);
          setSelectedOptions({
            option: sortFilterOption,
            title: item,
          });
        }}>
        {item.group_name}
      </Text>
    ),
    [makeOpetionsSelected, selectedOptions.title, sortFilterOption],
  );

  const renderSortFilterOpetions = ({index, item}) => (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'space-between',
        marginLeft: 15,
        marginRight: 15,
      }}>
      <View>
        <Text style={styles.filterTitle}>{item}</Text>
        {index === 1 &&
          sortFilterOption === index &&
          [Verbs.entityTypeUser, Verbs.entityTypePlayer].includes(
            authContext.entity.role,
          ) && (
            <Text
              style={styles.changeOrderStyle}
              onPress={() => {
                setFilterPopup(false);
                navigation.navigate('ChangeSportsOrderScreen', {
                  onBackClick: fromGoBack,
                });
              }}>
              Change order of sports
            </Text>
          )}
        {index === 0 &&
          sortFilterOption === index &&
          [Verbs.entityTypeUser, Verbs.entityTypePlayer].includes(
            authContext.entity.role,
          ) && (
            <Text
              style={styles.changeOrderStyle}
              onPress={() => {
                setFilterPopup(false);
                navigation.navigate('ChangeOtherListScreen', {
                  onBackClick: fromGoBack,
                });
              }}>
              Change list of Organizers
            </Text>
          )}
      </View>
      <TouchableOpacity
        onPress={() => {
          setSortFilterOpetion(index);
          setSelectedOptions({
            option: 0,
            title: index === 1 ? {sport: 'All'} : 'All',
          });
        }}>
        <Image
          source={
            sortFilterOption === index
              ? images.radioRoundOrange
              : images.radioUnselect
          }
          style={styles.radioButtonStyle}
        />
      </TouchableOpacity>
    </View>
  );

  const renderTimeFilterOptions = ({index, item}) => (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'space-between',
        marginLeft: 15,
        marginRight: 15,
      }}>
      <Text style={styles.filterTitle}>{item}</Text>
      <TouchableOpacity
        onPress={() => {
          setTimeFilterOpetion(index);
        }}>
        <Image
          source={
            timeFilterOpetion === index
              ? images.radioRoundOrange
              : images.radioUnselect
          }
          style={styles.radioButtonStyle}
        />
      </TouchableOpacity>
    </View>
  );

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

  const customDatesStyles = [];

  for (const all of allSlots) {
    if (all?.allDay === true && all?.blocked === true) {
      customDatesStyles.push({
        startDate: moment(Utility.getJSDate(all.start_datetime)),
        dateNumberStyle: {
          color: colors.userPostTimeColor,
          fontSize: 18,
          fontFamily: fonts.RRegular,
          fontWeight: '400',
        },
        dateContainerStyle: {
          backgroundColor: colors.offGrayColor,
          borderRadius: 8,
          width: 40,
        },
      });
    }
  }

  return (
    <View style={{flex: 1}}>
      <ActivityLoader visible={indigator} />
      <View
        style={{opacity: isAccountDeactivated ? 0.5 : 1}}
        pointerEvents={pointEvent}>
        <Header
          leftComponent={
            <Text style={styles.eventTitleTextStyle}>{strings.schedule}</Text>
          }
          showBackgroundColor={true}
          rightComponent={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity onPress={onAddPlusPress}>
                <Image source={images.addEvent} style={styles.headerRightImg} />
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={onThreeDotPress}>
                <Image
                  source={images.threeDotIcon}
                  style={styles.headerRight3DotImg}
                />
              </TouchableOpacity> */}
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
              format(
                strings.pauseUnpauseAccountText,
                authContext?.entity?.obj?.is_pause === true
                  ? strings.unpause
                  : strings.reactivate,
              ),
              '',
              [
                {
                  text: strings.cancel,
                  style: 'cancel',
                },
                {
                  text:
                    authContext?.entity?.obj?.is_pause === true
                      ? strings.unpause
                      : strings.reactivate,
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
        <View style={{flex: 1, backgroundColor: colors.offwhite}}>
          <View
            style={{
              flexDirection: 'row',
              // margin: 15,
              height: 45,
              justifyContent: 'space-between',
              alignItems: 'center',
              marginRight: 15,
              marginLeft: 15,
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
                {strings.events}
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
                {strings.availability}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setFilterPopup(true);
              }}>
              <FastImage
                source={images.localHomeFilter}
                style={{height: 25, width: 25}}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.separateLine} />
          {!loading &&
            scheduleIndexCounter === 0 &&
            [
              Verbs.entityTypeUser,
              Verbs.entityTypePlayer,
              Verbs.entityTypeClub,
            ].includes(authContext.entity.role) && (
              <View style={styles.sportsListView}>
                <FlatList
                  ref={refContainer}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={
                    (filterSetting.sort === 0 && organizerOptions) ||
                    (filterSetting.sort === 1 && sports) ||
                    (filterSetting.sort === 2 && reservationOpetions)
                  }
                  keyExtractor={keyExtractor}
                  renderItem={
                    (filterSetting.sort === 0 && organizerListView) ||
                    (filterSetting.sort === 1 && sportOptionsListView) ||
                    (filterSetting.sort === 2 && optionsListView)
                  }
                />
              </View>
            )}
          {!loading && scheduleIndexCounter === 0 && (
            <EventScheduleScreen
              filterOptions={filterSetting}
              selectedFilter={selectedOptions}
              eventData={eventData}
              navigation={navigation}
              profileID={authContext.entity.uid}
              onThreeDotPress={(item) => {
                setSelectedEventItem(item);
              }}
              onItemPress={async (item) => {
                setIndigator(true);
                const entity = authContext.entity;
                if (item?.game_id) {
                  if (item?.game?.sport) {
                    const gameHome = getGameHomeScreen(
                      item.game.sport.replace(' ', '_'),
                    );
                    setIndigator(false);

                    navigation.navigate(gameHome, {
                      gameId: item?.game_id,
                    });
                  }
                } else {
                  getEventById(
                    entity.role === Verbs.entityTypeUser ? 'users' : 'groups',
                    entity.uid || entity.auth.user_id,
                    item.cal_id,
                    authContext,
                  )
                    .then((response) => {
                      setIndigator(false);
                      navigation.navigate('EventScreen', {
                        data: response.payload,
                        gameData: item,
                      });
                    })
                    .catch((e) => {
                      setIndigator(false);
                      console.log('Error :-', e);
                    });
                }
              }}
              entity={authContext.entity}
            />
          )}
          {!loading && scheduleIndexCounter === 1 && (
            <View>
              <View
                style={{
                  shadowColor: colors.googleColor,
                  shadowOffset: {width: 0, height: 3},
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  marginBottom: 10,
                }}>
                <CalendarStrip
                  selectedDate={selectedDate}
                  scrollable={true}
                  customDatesStyles={customDatesStyles}
                  // calendarAnimation={{type: 'sequence', duration: 30}}
                  daySelectionAnimation={{
                    type: 'border',
                    duration: 200,
                    borderWidth: 1,
                    borderHighlightColor: 'white',
                  }}
                  dayContainerStyle={{
                    justifyContent: 'space-between',
                    paddingTop: 3,
                    paddingBottom: 3,
                  }}
                  style={{
                    height: 120,
                    paddingTop: 15,
                  }}
                  calendarHeaderStyle={{
                    color: colors.lightBlackColor,
                    fontSize: 15,
                    fontFamily: fonts.RMedium,
                  }}
                  calendarColor={colors.offwhite}
                  dateNumberStyle={{
                    color: colors.lightBlackColor,
                    fontSize: 18,
                    fontFamily: fonts.RRegular,
                    fontWeight: '400',
                  }}
                  dateNameStyle={{
                    color: colors.lightBlackColor,
                    fontSize: 12,
                    fontFamily: fonts.RMedium,
                    fontWeight: '400',
                  }}
                  onDateSelected={onDayPress}
                  highlightDateNumberStyle={{
                    color: colors.whiteColor,
                    fontSize: 18,
                    fontFamily: fonts.RBlack,
                    fontWeight: '800',
                  }}
                  highlightDateNameStyle={{
                    color: colors.whiteColor,
                    fontSize: 12,
                    fontFamily: fonts.RMedium,
                    fontWeight: '400',
                  }}
                  highlightDateContainerStyle={{
                    backgroundColor: colors.themeColor,
                    borderRadius: 8,
                    width: 40,
                  }}
                  datesBlacklist={datesBlacklistFunc(
                    new Date().setFullYear(new Date().getFullYear() - 25),
                    new Date().setDate(new Date().getDate() - 1),
                  )}
                  disabledDateNameStyle={{
                    fontSize: 12,
                    fontFamily: fonts.RMedium,
                    fontWeight: '400',
                  }}
                  disabledDateNumberStyle={{
                    color: colors.userPostTimeColor,
                    fontSize: 18,
                    fontFamily: fonts.RLight,
                    fontWeight: '400',
                  }}
                  disabledDateOpacity={1}
                  iconLeft={images.calPrevArrow}
                  iconRight={images.calNextArrow}
                  iconContainer={{flex: 0.1}}
                  iconStyle={{height: 15, width: 15}}
                />
              </View>
              {/* Availibility bottom view */}

              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontFamily: fonts.RRegular,
                    color: colors.lightBlackColor,
                    marginBottom: 10,
                  }}>
                  {strings.availableTimeForChallenge}
                </Text>
                <FlatList
                  data={slots}
                  renderItem={({item}) => (
                    <BlockSlotView
                      item={item}
                      startDate={item.start_datetime}
                      endDate={item.end_datetime}
                      allDay={item.allDay === true}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          )}
        </View>
        <ActionSheet
          ref={actionSheet}
          options={
            authContext.entity.role === Verbs.entityTypePlayer ||
            authContext.entity.role === Verbs.entityTypeUser
              ? [
                  strings.defaultColor,
                  strings.groupEventDisplay,
                  strings.viewPrivacyText,
                  strings.cancel,
                ]
              : [strings.defaultColor, strings.viewPrivacyText, strings.cancel]
          }
          cancelButtonIndex={
            authContext.entity.role === Verbs.entityTypePlayer ||
            authContext.entity.role === Verbs.entityTypeUser
              ? 3
              : 2
          }
          // destructiveButtonIndex={3}
          onPress={(index) => {
            if (
              authContext.entity.role === Verbs.entityTypePlayer ||
              authContext.entity.role === Verbs.entityTypeUser
            ) {
              if (index === 0) {
                navigation.navigate('DefaultColorScreen');
              } else if (index === 1) {
                navigation.navigate('GroupEventScreen');
              } else if (index === 2) {
                navigation.navigate('ViewPrivacyScreen');
              }
            } else if (index === 0) {
              navigation.navigate('DefaultColorScreen');
            } else if (index === 1) {
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
                  {strings.chooseRefereeText}
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
                    goToScorekeeperReservationDetail(item);
                  }}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </SafeAreaView>
        </Modal>
        <Modal
          onBackdropPress={() => setFilterPopup(false)}
          isVisible={filterPopup}
          animationInTiming={300}
          animationOutTiming={800}
          backdropTransitionInTiming={300}
          backdropTransitionOutTiming={800}
          style={{
            margin: 0,
          }}>
          <View
            style={[
              styles.bottomPopupContainer,
              {height: Dimensions.get('window').height - 50},
            ]}>
            <View style={styles.topHeaderContainer}>
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                style={styles.closeButton}
                onPress={() => {
                  setFilterPopup(false);
                }}>
                <Image source={images.crossImage} style={styles.closeButton} />
              </TouchableOpacity>
              <Text style={styles.applyText}>{strings.filter}</Text>
              <Text
                style={styles.applyText}
                onPress={() => {
                  setFilterPopup(false);
                  setFilterSetting({
                    ...filterSetting,
                    sort: sortFilterOption,
                    time: timeFilterOpetion,
                  });
                }}>
                {strings.apply}
              </Text>
            </View>

            {[
              Verbs.entityTypeUser,
              Verbs.entityTypePlayer,
              Verbs.entityTypeClub,
            ].includes(authContext.entity.role) && (
              <>
                <TCThinDivider width={'100%'} marginBottom={15} />
                <View>
                  <Text style={styles.titleText}>{strings.sortBy}</Text>
                  <FlatList
                    data={
                      [Verbs.entityTypeClub].includes(authContext.entity.role)
                        ? sortFilterDataClub
                        : sortFilterData
                    }
                    renderItem={renderSortFilterOpetions}
                    style={{marginTop: 15}}
                  />
                </View>
              </>
            )}
            <TCThinDivider width={'90%'} marginBottom={15} />
            <View>
              <Text style={styles.titleText}>{strings.timeText}</Text>
              <FlatList
                data={timeFilterData}
                renderItem={renderTimeFilterOptions}
                style={{marginTop: 15}}
              />
            </View>
          </View>
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
                          strings.noRefereeInvitedText,
                          [
                            {
                              text: strings.okTitleText,
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
                          strings.noScorekeeperInvitedText,
                          [
                            {
                              text: strings.okTitleText,
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
            }
            if (actionSheetOpetions()?.[index] === 'Game Reservation Details') {
              goToChallengeDetail(selectedEventItem.game);
            }
            if (actionSheetOpetions()?.[index] === 'Change Events Color') {
              navigation.navigate('EditEventScreen', {
                data: selectedEventItem,
                gameData: selectedEventItem,
              });
            }
            if (actionSheetOpetions()?.[index] === 'Edit') {
              navigation.navigate('EditEventScreen', {
                data: selectedEventItem,
                gameData: selectedEventItem,
              });
            }

            setSelectedEventItem(null);
          }}
        />
      </View>
      <ActionSheet
        ref={plusActionSheet}
        options={[
          strings.createEvent,
          strings.editChallengeAvailibilityText,
          strings.cancel,
        ]}
        cancelButtonIndex={2}
        // destructiveButtonIndex={3}
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate('CreateEventScreen', {
              comeName: 'ScheduleScreen',
            });
          } else if (index === 1) {
            navigation.navigate('EditChallengeAvailability');
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

  eventTitleTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    width: 125,
  },

  separateLine: {
    borderColor: colors.veryLightGray,
    borderWidth: 0.5,
  },
  sportsListView: {
    flexDirection: 'row',
    backgroundColor: colors.offwhite,
    borderBottomColor: colors.veryLightGray,
    borderBottomWidth: 0.5,
    alignItems: 'center',
  },
  sportName: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    margin: 10,
  },
  sportSelectedName: {
    fontSize: 14,
    fontFamily: fonts.RBold,
    color: colors.themeColor,
    alignSelf: 'center',
    margin: 10,
  },
  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },

  titleText: {
    fontSize: 18,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginLeft: 15,
  },
  applyText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: widthPercentageToDP('40%'),
  },
  closeButton: {
    alignSelf: 'center',
    width: 25,
    height: 25,
    resizeMode: 'contain',
    left: 5,
  },

  topHeaderContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginRight: 25,
    marginLeft: 15,
  },

  radioButtonStyle: {
    height: 22,
    width: 22,
    resizeMode: 'cover',
    alignSelf: 'center',
  },

  filterTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  changeOrderStyle: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.themeColor,
    textDecorationLine: 'underline',
    marginLeft: 20,
  },
});
