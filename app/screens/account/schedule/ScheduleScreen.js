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
  ScrollView
} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {RRule} from 'rrule';

import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
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
// import BlockSlotView from '../../../components/Schedule/BlockSlotView';
import {getGameIndex} from '../../../api/elasticSearch';
import TCAccountDeactivate from '../../../components/TCAccountDeactivate';
import {getUserSettings, userActivate} from '../../../api/Users';
import {getGroups, groupUnpaused} from '../../../api/Groups';
import {getQBAccountType, QBupdateUser} from '../../../utils/QuickBlox';
import TCThinDivider from '../../../components/TCThinDivider';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {reservationOpetions} from '../../../utils/constant';
import Verbs from '../../../Constants/Verbs';
import AvailibilityScheduleScreen from './AvailibityScheduleScreen';
import ChallengeAvailability from './ChallengeAvailability';



export default function ScheduleScreen({navigation, route}) {
  let authContext = useContext(AuthContext);
  const refContainer = useRef();
  const sortFilterData = ['Organizer', 'Sport', 'None'];
  const sortFilterDataClub = ['Organizer', 'Sport', 'None'];
  const rsvpFilterOptions = ['All', 'Going', 'Maybe', 'Not Going'];
  const timeFilterData = ['Future', 'Past'];
  const timeSelectionList = [
    {text: 'Any Time', value: 0},
    {text: '1 Week', value: 7},
    {text: '1 Month', value: 30},
    {text: '3 Month', value: 90},
  ];
  const [timeSelectionOption, setTimeSelectionOption] = useState({text: 'Any Time', value: 0},);
  const [timeSelectionModal, setTimeSelectionModal] = useState(false);

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
  const [rsvpFilterOption, setRsvpFilterOption] = useState(0);
  const [filterPopup, setFilterPopup] = useState(false);
  const [editableSlotsType, setEditableSlotsType] = useState(false);

  const [allSlots, setAllSlots] = useState([]);
 

  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');


  const [visibleAvailabilityModal, setVisibleAvailabilityModal] = useState(false);

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
    indigator
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
    // setloading(true);
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
  }, [authContext, isFocused, indigator]);


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
          strings.refereeReservationDetail,
          // 'Change Events Color',
          strings.cancel,
        ];
      }
      if (scorekeeperFound(selectedEventItem)) {
        return [
          strings.scorekeeperReservationDetail,
          // 'Change Events Color',
          strings.cancel,
        ];
      }

      return [
        strings.gameReservationDetails,
        strings.refereeReservationDetail,
        strings.scorekeeperReservationDetail,
        // 'Change Events Color',
        strings.cancel,
      ];
    }
    return [strings.editTitleText, strings.deleteTitle, strings.cancel];
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
      if(route?.params?.event) {
        getEventsAndSlotsList(route?.params?.event);
      }else{
        getEventsAndSlotsList();
      }
    }
  }, [isFocused]);



  const onAddPlusPress = useCallback(() => {
    plusActionSheet.current.show();
  }, []);



  const onDayPress = async() => {
      await getEventsAndSlotsList();
  };



  const getEventsAndSlotsList = useCallback(async(data = {} , timeSlot = 0, timeSelection = 0) => {
    // setloading(true);
    const eventTimeTableData = [];
    let type = 'future';
    if(timeSlot === 1) {
      type = 'past';
    }

    let rangeTime = timeSelection;
    if(timeSelection > 0){
      const rangeDate = new Date()
      if(timeSlot === 1) {
        rangeDate.setDate(rangeDate.getDate() - timeSelection);
      }else{
        rangeDate.setDate(rangeDate.getDate() + timeSelection);
      }
      rangeTime = Utility.getTCDate(rangeDate);
    }
    
    Utility.getEventsSlots(authContext?.entity?.uid, Utility.getTCDate(new Date()), type, rangeTime)
      .then((response) => {
        let resCalenders = [];
        let eventsCal = [];
        if (response) {
          if(data) {
            response = [...response, data];
          }

          resCalenders = response.filter((obj) => {     
            if (obj.cal_type === 'blocked') {
              return obj;
            }
            return false;
          });

          eventsCal = response.filter((obj) => {     
            if (obj.cal_type === 'event') {
              if (obj?.expiry_datetime) {
                if (obj?.expiry_datetime >= Utility.getTCDate(new Date())) {
                  return obj;
                }
              } else {
                return obj;
              }
            }
            return false;
          });
        
        }

        setAllSlots(resCalenders);
        
        eventsCal.forEach((item) => {
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

            const gamelists = [
              ...games,
              ...pendingChallenge,
              ...response.filter((obj) => obj.owner_id),
            ]
            Utility.getGamesList(gamelists).then((gamedata) => {
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
  }, [authContext?.entity?.uid, configureEvents]);



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
          .catch(() => {
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
          .catch(() => {
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


  const renderRsvpFilterOpetions = ({index, item}) => (
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
          setRsvpFilterOption(index);
        }}>
        <Image
          source={
            rsvpFilterOption === index
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


  const renderTimeSelectionList = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setTimeSelectionOption(item);
        setTimeout(() => {
          setTimeSelectionModal(false);
        }, 300);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginRight: 15,
        }}>
        <Text style={styles.languageList}>{item.text}</Text>
        <View style={styles.checkbox}>
          {timeSelectionOption.value === item?.value ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );


  
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
                  onDayPress(new Date())
                  setScheduleIndexCounter(1);
                }}>
                {strings.availability}
              </Text>
            </View>
            {
            scheduleIndexCounter === 0 && (
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
            )}
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
          {eventData.length > 0 && scheduleIndexCounter === 0 && (
            <>
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
                 // setIndigator(true);
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
                    .catch(() => {
                      setIndigator(false);
                    });
                }
              }}
              entity={authContext.entity}
            />
            </>
          )}


          {scheduleIndexCounter === 1 && (
              <AvailibilityScheduleScreen
              allSlots={allSlots}
              onDayPress={onDayPress}
              />
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
          backdropOpacity={0}
        >
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

        {/* Filter Popup */}
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
                style={styles.closeFilterButton}
                onPress={() => {
                  setFilterPopup(false);
                }}>
                <Image source={images.crossImage} style={styles.closeFilterButton} />
              </TouchableOpacity>
              <Text style={styles.titleText}>{strings.filter}</Text>
              <Text
                style={styles.applyText}
                onPress={async() => {
                  setFilterPopup(false)
                  setIndigator(true)
                  await getEventsAndSlotsList({}, timeFilterOpetion, timeSelectionOption.value);
                  setFilterSetting({
                    ...filterSetting,
                    sort: sortFilterOption,
                    time: timeFilterOpetion,
                  });
                  setIndigator(false)
                  
                }}>
                {strings.apply}
              </Text>
            </View>
            <View style={{height : Dimensions.get('window').height - 100}}>
              <ScrollView>
                <>
                {[
                  Verbs.entityTypeUser,
                  Verbs.entityTypePlayer,
                  Verbs.entityTypeClub,
                ].includes(authContext.entity.role) && (
                  <View style={{flex: 1}}>
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

                    <TCThinDivider width={'92%'} marginBottom={15} />
                    <View>
                      <Text style={styles.titleText}>RSVP</Text>
                      <FlatList
                        data={
                          [Verbs.entityTypeClub].includes(authContext.entity.role)
                            ? rsvpFilterOptions
                            : rsvpFilterOptions
                        }
                        renderItem={renderRsvpFilterOpetions}
                        style={{marginTop: 15}}
                      />
                    </View>
                  </View>
                )}
                <TCThinDivider width={'92%'} marginBottom={15} />
                <View>
                  <Text style={styles.titleText}>{strings.timeText}</Text>
                  <FlatList
                    data={timeFilterData}
                    renderItem={renderTimeFilterOptions}
                    style={{marginTop: 15}}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setTimeSelectionModal(true);
                  }}>
                  <View style={styles.dropContainer}>
                    <Text style={styles.textInputDropStyle}>
                      {timeSelectionOption.text}
                    </Text>
                    <Image
                      source={images.dropDownArrow}
                      style={styles.downArrowWhoCan}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={() => {
                  setSortFilterOpetion(2);
                  setTimeFilterOpetion(0);
                  setRsvpFilterOption(0);
                }}
                >
                  <View 
                  style={{
                    backgroundColor: colors.lightGrey, 
                    paddingHorizontal: 50,
                    paddingVertical: 5,
                    alignSelf: 'center',
                    borderRadius: 5,
                    marginTop: 20
                  }}>
                    <Text>Reset</Text>
                  </View>
                </TouchableOpacity>
                </>
              </ScrollView>
            </View>
          </View>
          <Modal
          isVisible={timeSelectionModal}
          backdropColor="black"
          onBackdropPress={() => setTimeSelectionModal(false)}
          onRequestClose={() => setTimeSelectionModal(false)}
          animationInTiming={300}
          animationOutTiming={800}
          backdropTransitionInTiming={10}
          backdropTransitionOutTiming={10}
          style={{
            margin: 0,
          }}>
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').height / 1.3,
              backgroundColor: 'white',
              position: 'absolute',
              bottom: 0,
              left: 0,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 15,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                style={styles.closeButton}
                onPress={() => setTimeSelectionModal(false)}>
                <Image source={images.cancelImage} style={styles.closeButton} />
              </TouchableOpacity>

              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RBold,
                  color: colors.lightBlackColor,
                }}>
                {strings.privacySettingText}
              </Text>

              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  color: colors.themeColor,
                }}></Text>
            </View>
            <View style={styles.separatorLine} />
            <FlatList
              ItemSeparatorComponent={() => <TCThinDivider width="92%" />}
              showsVerticalScrollIndicator={false}
              data={
                timeSelectionList
              }
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderTimeSelectionList}
            />
          </View>
          </Modal>
        </Modal>

        
        {/* Event Edit Delete */}
        <ActionSheet
          ref={eventEditDeleteAction}
          options={actionSheetOpetions()}
          cancelButtonIndex={findCancelButtonIndex(selectedEventItem)}
          destructiveButtonIndex={
            selectedEventItem !== null && !selectedEventItem.game && 1
          }
          onPress={(index) => {
            if (
              actionSheetOpetions()?.[index] === strings.refereeReservationDetail
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
              strings.scorekeeperReservationDetail
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
            if (actionSheetOpetions()?.[index] === strings.gameReservationDetails) {
              goToChallengeDetail(selectedEventItem.game);
            }
            if (actionSheetOpetions()?.[index] === strings.changeEventColorText) {
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

      {/*  Availability edit modal */}
      <Modal
        onBackdropPress={() => setVisibleAvailabilityModal(false)}
        isVisible={visibleAvailabilityModal}
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
          ]}
        >
          <ChallengeAvailability 
            setVisibleAvailabilityModal={setVisibleAvailabilityModal}
            slots = {[]}
            slotType = {editableSlotsType}
            setEditableSlotsType = {setEditableSlotsType}
          />
        </View>
      </Modal>

      <ActionSheet
        ref={plusActionSheet}
        options={[
          strings.createEvent,
          strings.editChallengeAvailibilityText,
          strings.cancel,
        ]}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate('CreateEventScreen', {
              comeName: 'ScheduleScreen',
            });
          } else if (index === 1) {
            setVisibleAvailabilityModal(true);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  dropContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 5,
    width: wp('94%'),
    height: 40,
    alignSelf: 'center',
    backgroundColor: colors.textFieldBackground,
    marginTop: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginBottom: 15,
    alignItems: 'center',
  },
  textInputDropStyle: {
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  downArrowWhoCan: {
    height: 15,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    width: 15,
    right: 15,
  },
  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },
  checkboxImg: {
    width: wp('5.5%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  checkbox: {
    alignSelf: 'center',
    position: 'absolute',
    right: wp(0),
  },

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
    width: 125,
    textAlign: 'center',
    fontFamily: fonts.Roboto,
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 18,
    paddingTop: 5,
    color: colors.lightBlackColor,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginLeft: 15,
  },
  applyText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginRight: wp('3%'),
  },
  closeFilterButton: {
    width: 20,
    height: 20,
    marginLeft: 10,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
  closeButton: {
    alignSelf: 'center',
    width: 15,
    height: 15,
    marginLeft: 5,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
  topHeaderContainer: {
    // backgroundColor: '#333',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width:'100%'
    // marginRight: 25,
    // marginLeft: 15,
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
