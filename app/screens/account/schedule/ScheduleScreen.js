/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
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
  // Dimensions,
  ScrollView,
  StatusBar,
  BackHandler,
  Platform,
} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import EventScheduleScreen from './EventScheduleScreen';
import fonts from '../../../Constants/Fonts';
import AuthContext from '../../../auth/context';
import * as RefereeUtils from '../../referee/RefereeUtility';
import * as ScorekeeperUtils from '../../scorekeeper/ScorekeeperUtility';
import * as Utils from '../../challenge/ChallengeUtility';
import {strings} from '../../../../Localization/translation';
import {
  getRefereeReservationDetails,
  getScorekeeperReservationDetails,
} from '../../../api/Reservations';
import Header from '../../../components/Home/Header';
import RefereeReservationItem from '../../../components/Schedule/RefereeReservationItem';
import {getGameHomeScreen} from '../../../utils/gameUtils';
import ScorekeeperReservationItem from '../../../components/Schedule/ScorekeeperReservationItem';
import {getHitSlop /* getRoundedDate,  getSportName */} from '../../../utils';
import * as Utility from '../../../utils/index';
import {
  getGameIndex,
  getGroupIndex,
  getUserIndex,
} from '../../../api/elasticSearch';
import TCAccountDeactivate from '../../../components/TCAccountDeactivate';
import {getUserSettings} from '../../../api/Users';
import {getGroupDetails, getGroups, getTeamsOfClub} from '../../../api/Groups';
import TCThinDivider from '../../../components/TCThinDivider';
import {reservationOpetions} from '../../../utils/constant';
import Verbs from '../../../Constants/Verbs';
import AvailibilityScheduleScreen from './AvailibityScheduleScreen';
// import ChallengeAvailability from './ChallengeAvailability';
import BottomSheet from '../../../components/modals/BottomSheet';
import FilterTimeSelectItem from '../../../components/Filter/FilterTimeSelectItem';
import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';
import EventListShimmer from '../../../components/shimmer/schedule/EventListShimmer';
import ScreenHeader from '../../../components/ScreenHeader';
import AvailabilityShimmer from '../../../components/shimmer/schedule/AvailibilityShimmer';
import {useTabBar} from '../../../context/TabbarContext';
import ChallengeAvailability from './ChallengeAvailability';

export default function ScheduleScreen({navigation, route}) {
  let authContext = useContext(AuthContext);
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

  const refContainer = useRef();
  const rsvpFilterOptions = [
    strings.eventFilterRsvpAll,
    strings.eventFilterRsvpGoing,
    strings.eventFilterRsvpMaybe,
    strings.eventFilterRsvpNotGoing,
  ];
  const timeFilterData = [
    strings.eventFilterTimeFuture,
    strings.eventFilterTimePast,
  ];
  const actionSheet = useRef();
  // const plusActionSheet = useRef();
  const isFocused = useIsFocused();

  const timeSelectionFutureList = [
    strings.filterAntTime,
    strings.filterToday,
    strings.filterTomorrow,
    strings.filterNext7Day,
    strings.filterThisMonth,
    strings.filterNextMonth,
    strings.filterPickaDate,
  ];

  const timeSelectionPastList = [
    strings.filterAntTime,
    strings.filterToday,
    strings.filterYesterday,
    strings.filterLast7Day,
    strings.filterThisMonth,
    strings.filterLastMonth,
    strings.filterPickaDate,
  ];

  const settingsOptions = [
    strings.likeEvent,
    strings.eventsViewSettings,
    strings.viewPrivacy,
  ];

  // let nextThreeMonth = new Date();
  // nextThreeMonth = nextThreeMonth.setMonth(nextThreeMonth.getMonth() + 3);

  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [timeSelectionOption, setTimeSelectionOption] = useState(
    strings.filterAntTime,
  );
  const [timeSelectionModal, setTimeSelectionModal] = useState(false);
  const [timeSelectionPicker, setTimeSelectionPicker] = useState(false);
  const [sports, setSports] = useState([]);
  const [organizerOptions, setOrganizerOptions] = useState([]);
  const [owners, setOwners] = useState([]);
  const [scheduleIndexCounter, setScheduleIndexCounter] = useState(0);
  const [eventData, setEventData] = useState([]);
  const [selectedEventItem, setSelectedEventItem] = useState(null);
  const [loading, setloading] = useState(false);
  const [isRefereeModal, setIsRefereeModal] = useState(false);
  const [isScorekeeperModal, setIsScorekeeperModal] = useState(false);
  const [refereeReservData, setRefereeReserveData] = useState([]);
  const [scorekeeperReservData, setScorekeeperReserveData] = useState([]);
  const [indigator, setIndigator] = useState(false);
  const [isRefeering, setIsRefeering] = useState(true);
  const [isScorekeeping, setIsScoreKeeping] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSortbyOthers, setIsSortByOthers] = useState(true);
  const [eventSettingsOption, setEventSettingsOption] =
    useState(settingsOptions);
  const [selectedOptions, setSelectedOptions] = useState({
    option: 0,
    title: strings.all,
  });

  const [timeFilterOpetion, setTimeFilterOpetion] = useState(0);
  const [rsvpFilterOption, setRsvpFilterOption] = useState(0);
  const [filterPopup, setFilterPopup] = useState(false);
  const [allSlots, setAllSlots] = useState([]);
  // const [visibleAvailabilityModal, setVisibleAvailabilityModal] =
  //   useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [allUserData, setAllUserData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [popupFilterHeight, setPopupFilterHeight] = useState(0);
  const [filterTags, setFilterTags] = useState([]);
  const [filterCancelled, setFilterCancelled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [isFromHomeScreen] = useState(route?.params?.isFromHomeScreen);
  const [isFromSlots, setIsFromSlots] = useState(false);
  const [visibleAvailabilityModal, setVisibleAvailabilityModal] =
    useState(false);
  const [editableSlots, setEditableSlots] = useState([]);
  const [showOtherOptionForClub, setShowOtherOptionForClub] = useState(false);

  const [showOtherOptionForTeam, setShowOtherOptionforTeam] = useState(false);
  const {toggleTabBar} = useTabBar();
  const [filterSetting, setFilterSetting] = useState({
    sort: 1,
    time: 0,
  });
  useEffect(() => {
    // Set TabBar visibility to true when this screen mounts
    toggleTabBar(true);

    return () => {
      // Set TabBar visibility to false when this screen unmounts
      toggleTabBar(false);
    };
  }, [isFocused, toggleTabBar]);

  useEffect(() => {
    if (route?.params?.isAdmin !== undefined) {
      setIsAdmin(route.params.isAdmin);
    }
  }, [route?.params?.isAdmin]);

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        display: isFromHomeScreen ? 'none' : 'flex',
      },
    });

    return () => {
      navigation.setParams({
        isFromHomeScreen: false,
      });
    };
  }, [navigation, isFocused]);

  // Get Future Date:
  const getDates = (type, optionsState) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);

    if (optionsState === strings.filterToday) {
      endDate.setDate(endDate.getDate() + 0);
      endDate.setMinutes(59);
      endDate.setHours(23);
    } else if (optionsState === strings.filterTomorrow) {
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() + 1);
      endDate.setDate(endDate.getDate() + 2);
    } else if (optionsState === strings.filterNext7Day) {
      endDate.setDate(endDate.getDate() + 7);
    } else if (optionsState === strings.filterThisMonth && type === 0) {
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(0, 0, 0, 0);
    } else if (optionsState === strings.filterNextMonth) {
      endDate.setMonth(endDate.getMonth() + 2);
      endDate.setDate(0);
      startDate.setMonth(endDate.getMonth());
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    } else if (optionsState === strings.filterAntTime && type === 0) {
      endDate.setMonth(endDate.getMonth() + 10);
      endDate.setHours(0, 0, 0, 0);
    } // Past dates conditions
    else if (optionsState === strings.filterYesterday) {
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - 1);
    } else if (optionsState === strings.filterLast7Day) {
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - 7);
    } else if (optionsState === strings.filterThisMonth) {
      startDate.setMonth(startDate.getMonth());
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
    } else if (optionsState === strings.filterLastMonth) {
      endDate.setMonth(endDate.getMonth());
      endDate.setDate(0);
      endDate.setHours(0, 0, 0, 0);
      startDate.setMonth(endDate.getMonth());
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    } else if (optionsState === strings.filterAntTime) {
      startDate.setMonth(startDate.getMonth() - 10);
      startDate.setHours(0, 0, 0, 0);
    }

    if (optionsState === strings.eventFilterTimePast) {
      endDate.setHours(0, 0, 0, 0);
      endDate.setDate(endDate.getDate());
      setEndDateTime(endDate);
      // setStartDateTime('');
    } else if (optionsState === strings.eventFilterTimeFuture) {
      startDate.setDate(endDate.getDate());
      // setEndDateTime('');
      setStartDateTime(startDate);
    } else {
      setStartDateTime(startDate);
      setEndDateTime(endDate);
    }
  };

  useEffect(() => {
    if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
      setPopupFilterHeight(500);
    }

    // Check if role contains referee
    if (!authContext?.entity?.obj?.referee_data) {
      setIsRefeering(false);
    }

    // Check if role contains scorekeeper
    if (!authContext.entity.obj?.scorekeeper_data) {
      setIsScoreKeeping(false);
    }

    // Check if user has any registered sport
    if (!authContext.entity.obj?.registered_sports) {
      setIsPlaying(false);
    }
  }, [authContext.entity, isFocused, indigator]);

  const handleCancelPress = () => {
    setStartDateVisible(false);
    setEndDateVisible(false);
  };

  // Check Validation to show the event settings for clubs
  useEffect(() => {
    if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
      getTeamsOfClub(authContext.entity.uid, authContext)
        .then((response) => {
          setShowOtherOptionForClub(response?.payload?.length);
        })
        .catch((e) => {
          setloading(false);

          Alert.alert(strings.townsCupTitle, e.message);
        });
    } else {
      setEventSettingsOption(settingsOptions);
    }

    if ([Verbs.entityTypeTeam].includes(authContext.entity.role)) {
      getGroupDetails(authContext.entity.uid, authContext)
        .then(async (res) => {
          const groupIDs = res.payload?.parent_groups ?? [];

          setShowOtherOptionforTeam(groupIDs.length);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
  }, [authContext, isFocused]);

  // Check any event assigned to others option.
  useEffect(() => {
    const events = eventData.filter((obj) => !obj.game);
    if (events.length === 0) {
      setIsSortByOthers(false);
    } else {
      setIsSortByOthers(true);
    }
    setFilterCancelled(false);
  }, [eventData]);

  useEffect(() => {
    getUserSettings(authContext)
      .then((setting) => {
        if (setting?.payload?.user !== {}) {
          let scheduleFilter = [];

          if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
            scheduleFilter =
              setting?.payload?.user?.club_schedule_group_filter ?? [];
          } else if ([Verbs.entityTypeTeam].includes(authContext.entity.role)) {
            scheduleFilter =
              setting?.payload?.user?.team_schedule_group_filter ?? [];
          } else {
            scheduleFilter =
              setting?.payload?.user?.schedule_group_filter ?? [];
          }

          if (scheduleFilter && scheduleFilter?.length > 0) {
            if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
              const checkOtherStatus =
                setting?.payload?.user?.club_schedule_group_filter.length ===
                showOtherOptionForClub;

              const updatedOrganizerOptions = [
                {group_name: strings.all, group_id: 0},
                ...scheduleFilter,
              ];

              if (!checkOtherStatus) {
                updatedOrganizerOptions.push({
                  group_name: strings.othersText,
                  group_id: 2,
                });
              }

              setOrganizerOptions(updatedOrganizerOptions);
            } else if (
              [Verbs.entityTypeTeam].includes(authContext.entity.role)
            ) {
              // render the others option

              const checkOtherStatus =
                setting?.payload?.user?.team_schedule_group_filter.length ===
                showOtherOptionForTeam;

              const updatedOrganizerOptions = [
                {group_name: strings.all, group_id: 0},
                ...scheduleFilter,
              ];

              if (!checkOtherStatus) {
                updatedOrganizerOptions.push({
                  group_name: strings.othersText,
                  group_id: 2,
                });
              }

              setOrganizerOptions(updatedOrganizerOptions);
            } else {
              setOrganizerOptions([
                {group_name: strings.all, group_id: 0},
                {group_name: Verbs.me, group_id: 1},
                ...scheduleFilter,
                {group_name: strings.othersText, group_id: 2},
              ]);
            }
          } else {
            getGroups(authContext)
              .then((response) => {
                const {teams, clubs} = response.payload ?? [];
                if (response.payload.length > 0) {
                  setOrganizerOptions([
                    {group_name: strings.all, group_id: 0},
                    {group_name: Verbs.me, group_id: 1},
                    ...teams,
                    ...clubs,
                    {group_name: strings.othersText, group_id: 2},
                  ]);
                } else {
                  setOrganizerOptions([
                    {group_name: strings.all, group_id: 0},
                    {group_name: Verbs.me, group_id: 1},
                    {group_name: strings.othersText, group_id: 2},
                  ]);
                }
                setloading(false);
              })
              .catch((e) => {
                setloading(false);

                Alert.alert(strings.townsCupTitle, e.message);
              });
          }

          let sportsFilter;

          if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
            sportsFilter = setting?.payload?.user?.club_schedule_sport_filter;
          } else if ([Verbs.entityTypeTeam].includes(authContext.entity.role)) {
            sportsFilter = setting?.payload?.user?.team_schedule_sport_filter;
          } else {
            sportsFilter = setting?.payload?.user?.schedule_sport_filter;
          }

          if (sportsFilter && sportsFilter?.length > 0) {
            setSports([
              {sport: strings.all},
              ...sportsFilter,
              {sport: strings.othersText},
            ]);
          } else {
            let sportsList = [];
            if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
              sportsList = [...(authContext.entity.obj.sports ?? [])];
            } else if (
              [Verbs.entityTypeTeam].includes(authContext.entity.role)
            ) {
              sportsList = [{sport: authContext.entity.obj.sport} ?? []];
            } else {
              sportsList = [
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
            }

            const res = sportsList.map((obj) => ({
              sport: obj.sport,
            }));
            const data = Utility.uniqueArray(res, Verbs.sportType);

            setSports([
              {sport: strings.all},
              ...data,
              {sport: strings.othersText},
            ]);
          }
        }
        setloading(false);
      })
      .catch((e) => {
        setloading(false);

        Alert.alert(e.message);
      });
  }, [isFocused]);

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
      if (route?.params?.event) {
        getEventsAndSlotsList(route?.params?.event);
        delete route?.params?.event;
      } else {
        getEventsAndSlotsList();
      }

      if (route?.params?.optionValue !== undefined) {
        setFilterSetting({...filterSetting, sort: route?.params?.optionValue});
      }
    }
  }, [isFocused, filterCancelled]);

  const onDayPress = async () => {
    await getEventsAndSlotsList();
  };

  const getQueryParticipants = async () => {
    let participants = [];

    if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
      await getTeamsOfClub(authContext.entity.uid, authContext)
        .then((response) => {
          const teams = [];
          const group_data = [
            {
              id: authContext.entity?.obj?.group_id,
              name: authContext.entity?.obj?.group_name,
            },
          ];
          if (response?.payload && response?.payload?.length > 0) {
            response?.payload.forEach((item) => {
              teams.push(item.group_id);
              const temp = {};
              temp.id = item.group_id;
              temp.name = item.group_name;
              group_data.push(temp);
            });
          }
          participants = [authContext?.entity?.uid, ...teams];
          setAllUserData(group_data);
        })
        .catch((e) => {
          Alert.alert(strings.townsCupTitle, e.message);
        });
    } else if ([Verbs.entityTypeTeam].includes(authContext.entity.role)) {
      await getGroupDetails(authContext.entity.uid, authContext)
        .then(async (res) => {
          const groupIDs = res.payload?.parent_groups ?? [];

          const groupQuery = {
            query: {
              terms: {
                _id: groupIDs,
              },
            },
          };

          await getGroupIndex(groupQuery)
            .then((response) => {
              //  setGroups(response);
              participants = [authContext?.entity?.uid];
              const clubs = [];

              const group_data = [
                {
                  id: authContext.entity?.obj?.group_id,
                  name: authContext.entity?.obj?.group_name,
                },
              ];

              if (response && response?.length > 0) {
                response?.forEach((item) => {
                  clubs.push(item.group_id);
                  const temp = {};
                  temp.id = item.group_id;
                  temp.name = item.group_name;
                  group_data.push(temp);
                });
              }

              participants = [authContext?.entity?.uid, ...clubs];

              setAllUserData(group_data);
            })
            .catch((e) => {
              Alert.alert('', e.messages);
            });
        })
        .catch((e) => {
          console.log(e.message);
        });
    } else {
      await getGroups(authContext)
        .then((response) => {
          const group_data = [
            {
              id: authContext?.user?.user_id,
              name: authContext?.user?.full_name,
            },
          ];
          if (response?.payload && response?.payload?.clubs?.length > 0) {
            response?.payload?.clubs.forEach((item) => {
              const temp = {};
              temp.id = item.group_id;
              temp.name = item.group_name;
              group_data.push(temp);
            });
          }
          if (response?.payload && response?.payload?.teams?.length > 0) {
            response?.payload?.teams.forEach((item) => {
              const temp = {};
              temp.id = item.group_id;
              temp.name = item.group_name;
              group_data.push(temp);
            });
          }
          setAllUserData(group_data);
        })
        .catch((e) => {
          Alert.alert(strings.townsCupTitle, e.message);
        });
      const clubs = authContext?.entity?.obj?.clubIds
        ? authContext?.entity?.obj?.clubIds
        : [];
      const teams = authContext?.entity?.obj?.teamIds
        ? authContext?.entity?.obj?.teamIds
        : [];
      participants = [authContext?.entity?.uid, ...clubs, ...teams];
    }

    return participants;
  };

  const getEventsAndSlotsList = async (data = {}) => {
    setIndigator(true);
    const eventTimeTableData = [];
    const participants = await getQueryParticipants();

    Utility.getEventsSlots(participants)
      .then((response) => {
        const allUserIds = [];
        const groupIds = [];
        response.forEach((item) => {
          if (item.cal_type === Verbs.eventVerb) {
            if (
              item.created_by.group_id &&
              !groupIds.includes(item.created_by.group_id)
            ) {
              groupIds.push(item.created_by.group_id);
            } else if (!allUserData.includes(item.created_by.uid)) {
              allUserIds.push(item.created_by.uid);
            }
          }
        });

        const getUserDetailQuery = {
          size: 1000,
          from: 0,
          query: {
            terms: {
              'user_id.keyword': [...allUserIds],
            },
          },
        };
        const getGroupDetailQuery = {
          size: 1000,
          from: 0,
          query: {
            terms: {
              'group_id.keyword': [...groupIds],
            },
          },
        };

        const promiseArr = [
          getUserIndex(getUserDetailQuery),
          getGroupIndex(getGroupDetailQuery),
        ];
        Promise.all(promiseArr)
          .then((res) => {
            const result = [...res[0], ...res[1]];
            setOwners(result);
          })
          .catch((e) => {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });

        let resCalenders = [];
        let eventsCal = [];
        if (response) {
          let hasRecord = false;
          response.forEach((item) => {
            if (item.cal_id === data.cal_id) {
              hasRecord = true;
            }
          });
          if (data && !hasRecord) {
            response = [...response, data];
          }
          resCalenders = response.filter(
            (obj) => obj.cal_type === Verbs.blockedVerb,
          );
          eventsCal = response.filter((obj) => {
            if (obj.cal_type === Verbs.eventVerb) {
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

        eventTimeTableData.push(...eventsCal);

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
            ];
            Utility.getGamesList(gamelists).then((gamedata) => {
              setloading(false);
              configureEvents(eventTimeTableData, gamedata);
            });
          });
        }
        setIndigator(false);

        configureEvents(eventTimeTableData);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(strings.alertmessagetitle, e.message);
      });
  };

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const makeOpetionsSelected = useCallback(
    (item) => {
      if (
        filterSetting.sort ===
        ([Verbs.entityTypeClub].includes(authContext.entity.role) ? 1 : 1)
      ) {
        if (
          selectedOptions.title.group_name === item.group_name ||
          selectedOptions.title === item.group_name
        ) {
          return styles.sportSelectedName;
        }
        return styles.sportName;
      }
      if (
        filterSetting.sort ===
        ([Verbs.entityTypeClub].includes(authContext.entity.role) ? 2 : 3)
      ) {
        if (
          selectedOptions.title.sport === item.sport ||
          selectedOptions.title === item.sport
        ) {
          return styles.sportSelectedName;
        }
        return styles.sportName;
      }
      if (
        filterSetting.sort ===
        ([Verbs.entityTypeClub].includes(authContext.entity.role) ? -1 : 2)
      ) {
        if (selectedOptions.title === item) {
          return styles.sportSelectedName;
        }
        return styles.sportName;
      }
    },
    [selectedOptions.title, filterSetting.sort],
  );

  const wrapperClassStyle = useCallback(
    (item) => {
      if (
        filterSetting.sort ===
        ([Verbs.entityTypeClub].includes(authContext.entity.role) ? 1 : 1)
      ) {
        if (
          selectedOptions.title.group_name === item.group_name ||
          selectedOptions.title === item.group_name
        ) {
          if (
            [Verbs.entityTypeClub].includes(authContext.entity.role) ||
            [Verbs.entityTypeTeam].includes(authContext.entity.role)
          ) {
            return styles.clubActiveWrapper;
          }
          return styles.clubInactiveWrapper;
        }
        return styles.clubInactiveWrapper;
      }
      if (
        filterSetting.sort ===
        ([Verbs.entityTypeTeam].includes(authContext.entity.role) ? 1 : 1)
      ) {
        if (
          selectedOptions.title.group_name === item.group_name ||
          selectedOptions.title === item.group_name
        ) {
          if (
            [Verbs.entityTypeClub].includes(authContext.entity.role) ||
            [Verbs.entityTypeTeam].includes(authContext.entity.role)
          ) {
            return styles.clubActiveWrapper;
          }
          return styles.clubInactiveWrapper;
        }
        return styles.clubInactiveWrapper;
      }
      if (
        filterSetting.sort ===
        ([Verbs.entityTypeClub].includes(authContext.entity.role) ? 2 : 3)
      ) {
        if (
          selectedOptions.title.sport === item.sport ||
          selectedOptions.title === item.sport
        ) {
          if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
            return styles.clubActiveWrapper;
          }
          return styles.clubInactiveWrapper;
        }
        return styles.clubInactiveWrapper;
      }

      if (
        filterSetting.sort ===
        ([Verbs.entityTypeTeam].includes(authContext.entity.role) ? 2 : 3)
      ) {
        if (
          selectedOptions.title.sport === item.sport ||
          selectedOptions.title === item.sport
        ) {
          if ([Verbs.entityTypeTeam].includes(authContext.entity.role)) {
            return styles.clubActiveWrapper;
          }
          return styles.clubInactiveWrapper;
        }
        return styles.clubInactiveWrapper;
      }

      if (
        filterSetting.sort ===
        ([Verbs.entityTypeClub].includes(authContext.entity.role) ? -1 : 2)
      ) {
        if (selectedOptions.title === item) {
          if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
            return styles.clubActiveWrapper;
          }
          return styles.clubInactiveWrapper;
        }
        return styles.clubInactiveWrapper;
      }
    },
    [selectedOptions.title, filterSetting.sort],
  );

  const optionsListView = useCallback(
    ({item, index}) => {
      if (item === strings.refeeringText && !isRefeering) {
        return null;
      }

      if (item === strings.scorekeeperingText && !isScorekeeping) {
        return null;
      }

      if (item === strings.playingTitleText && !isPlaying) {
        return null;
      }

      if (
        item === strings.othersText &&
        eventData.length > 0 &&
        !isSortbyOthers
      ) {
        return null;
      }

      return (
        <View style={wrapperClassStyle(item)}>
          <Text
            style={[
              makeOpetionsSelected(item),
              {
                marginLeft: 15,
                marginRight: [Verbs.entityTypeClub].includes(
                  authContext.entity.role,
                )
                  ? 15
                  : 5,
              },
            ]}
            onPress={() => {
              refContainer.current.scrollToIndex({
                animated: true,
                index,
                viewPosition: 0.8,
              });
              setSelectedOptions({
                option: index,
                title: item,
              });
            }}>
            {item?.sport
              ? item?.sport === strings.all
                ? strings.all
                : Utility.getSportName(item, authContext)
              : item}
          </Text>
        </View>
      );
    },
    [authContext, makeOpetionsSelected, isRefeering, isScorekeeping, isPlaying],
  );

  const sportOptionsListView = useCallback(
    ({item, index}) => (
      <View style={wrapperClassStyle(item)}>
        <Text
          style={[
            makeOpetionsSelected(item),
            {
              marginLeft: 15,
              marginRight: [Verbs.entityTypeClub].includes(
                authContext.entity.role,
              )
                ? 15
                : 5,
            },
          ]}
          onPress={() => {
            refContainer.current.scrollToIndex({
              animated: true,
              index,
              viewPosition: 0.5,
            });
            setSelectedOptions({
              option: index,
              title: item,
            });
          }}>
          {item.sport[0] + item.sport.slice(1)}
        </Text>
      </View>
    ),
    [makeOpetionsSelected, selectedOptions.title],
  );

  const organizerListView = useCallback(
    ({item, index}) => (
      <View style={wrapperClassStyle(item)}>
        <Text
          style={[
            makeOpetionsSelected(item),
            {
              marginLeft: 15,
              marginRight: [Verbs.entityTypeClub].includes(
                authContext.entity.role,
              )
                ? 15
                : 5,
            },
          ]}
          onPress={() => {
            refContainer.current.scrollToIndex({
              animated: true,
              index,
              viewPosition: 0.5,
            });
            setSelectedOptions({
              option: index,
              title: item,
            });
          }}>
          {item.group_name}
        </Text>
      </View>
    ),
    [makeOpetionsSelected, selectedOptions.title],
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
          setTimeSelectionOption(strings.filterAntTime);
          getDates(index, item);
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

  const setFilterTagOptions = () => {
    let timeFilter;

    if (timeFilterOpetion === 0) {
      if (timeSelectionOption === strings.filterToday) {
        timeFilter = `${strings.filterToday} . ${strings.eventFilterTimeFuture}`;
      } else if (timeSelectionOption === strings.filterTomorrow) {
        timeFilter = `${strings.filterTomorrow}`;
      } else if (timeSelectionOption === strings.filterThisMonth) {
        timeFilter = `${strings.filterThisMonth} . ${strings.eventFilterTimeFuture}`;
      } else if (timeSelectionOption === strings.filterNextMonth) {
        timeFilter = `${strings.filterNextMonth}`;
      } else if (timeSelectionOption === strings.filterPickaDate) {
        timeFilter = `${moment(startDateTime).format('MMM DD')} - ${moment(
          endDateTime,
        ).format('MMM DD')}`;
      }
    }

    if (timeFilterOpetion === 1) {
      if (timeSelectionOption === strings.filterAntTime) {
        timeFilter = `${strings.filterAntTime} . ${strings.eventFilterTimePast}`;
      } else if (timeSelectionOption === strings.filterToday) {
        timeFilter = `${strings.filterToday} . ${strings.eventFilterTimePast}`;
      } else if (timeSelectionOption === strings.filterYesterday) {
        timeFilter = `${strings.filterYesterday}`;
      } else if (timeSelectionOption === strings.filterThisMonth) {
        timeFilter = `${strings.filterThisMonth} . ${strings.eventFilterTimePast}`;
      } else if (timeSelectionOption === strings.filterLastMonth) {
        timeFilter = `${strings.filterLastMonth}`;
      } else if (timeSelectionOption === strings.filterPickaDate) {
        timeFilter = `${moment(startDateTime).format('MMM DD')} - ${moment(
          endDateTime,
        ).format('MMM DD')}`;
      }
    }
    let option = [timeFilter];
    if (rsvpFilterOptions[rsvpFilterOption] !== strings.eventFilterRsvpAll) {
      option = [timeFilter, rsvpFilterOptions[rsvpFilterOption]];
    }

    setFilterTags(option);
  };

  const onTagCancelPress = async (index) => {
    const filter = [...filterTags];
    filter.splice(index, 1);
    setFilterTags(filter);

    if (filter.length === 0) {
      setRsvpFilterOption(0);
      setTimeFilterOpetion(0);
      setFilterCancelled(true);
      setTimeSelectionPicker(false);
      getDates(0, strings.filterAntTime);
      setTimeSelectionOption(strings.filterAntTime);
      setFilterSetting({
        ...filterSetting,
        time: 0,
      });
    }
  };

  const renderTags = ({item, index}) => {
    if (!item) {
      return;
    }
    return (
      <>
        <View style={styles.textContainer}>
          <Text style={styles.tagTitleText}>{item}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => onTagCancelPress(index)}>
            <Image source={images.cancelImage} style={styles.closeButton} />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  useEffect(() => {
    const backAction = () => {
      if (isFromHomeScreen) {
        navigation.navigate('HomeStack', {
          screen: 'HomeScreen',
          params: {
            uid: route.params?.uid,
            role: route.params?.role,
            comeFrom: 'ScheduleScreen',
          },
        });
      } else {
        navigation.goBack();
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [isFromHomeScreen, navigation, route.params?.uid, route.params?.role]);

  const deleteFromSlotData = async (delArr) => {
    const tempSlot = [...allSlots];
    delArr.forEach((cal_id) => {
      const index = tempSlot.findIndex((item) => item.cal_id === cal_id);
      allSlots.splice(index, 1);
    });
    setAllSlots([...allSlots]);
    return allSlots;
  };

  const deleteOrCreateSlotData = async (payload) => {
    const tempSlot = [...allSlots];
    if (payload.deleteSlotsIds.length > 0) {
      payload.deleteSlotsIds.forEach((cal_id) => {
        const index = allSlots.findIndex((item) => item.cal_id === cal_id);
        tempSlot.splice(index, 1);
      });
    }

    if (payload.newSlots.length > 0) {
      payload.newSlots.forEach((item) => {
        tempSlot.push(item);
      });
    }

    setAllSlots([...tempSlot]);
  };

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

  const addToSlotData = (data) => {
    const tempData = [...allSlots];
    data.forEach((item1) => {
      allSlots.forEach((item2, key) => {
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
    // tempData = newBlockedSlots(tempData);
    const newPlans = tempData.flatMap((plan) => {
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
    setAllSlots(newPlans);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          opacity: authContext.isAccountDeactivated ? 0.5 : 1,
        }}
        pointerEvents={authContext.isAccountDeactivated ? 'none' : 'auto'}>
        {isFromHomeScreen ? (
          <ScreenHeader
            leftIcon={images.backArrow}
            leftIconPress={() => {
              navigation.navigate('HomeStack', {
                screen: 'HomeScreen',
                params: {
                  uid: route.params?.uid,
                  role: route.params?.role,
                  comeFrom: 'ScheduleScreen',
                },
              });
            }}
            title={
              authContext.entity.role === Verbs.entityTypeTeam
                ? strings.schedule
                : strings.events
            }
            rightIcon1={
              authContext.entity.role === Verbs.entityTypeTeam
                ? null
                : isAdmin
                ? images.addEvent
                : null
            }
            rightIcon2={
              authContext.entity.role === Verbs.entityTypeTeam
                ? null
                : images.vertical3Dot
            }
            rightIcon1Press={() =>
              navigation.navigate('ScheduleStack', {
                screen: 'CreateEventScreen',
                params: {
                  comeName: 'ScheduleScreen',
                  isAdmin,
                },
              })
            }
            rightIcon2Press={() => setFilterPopup(true)}
          />
        ) : (
          <Header
            leftComponent={
              <Text style={styles.eventTitleTextStyle}>
                {[Verbs.entityTypeClub].includes(authContext.entity.role)
                  ? strings.events
                  : strings.schedule}
              </Text>
            }
            showBackgroundColor={true}
            rightComponent={
              scheduleIndexCounter === 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  {[Verbs.entityTypeClub].includes(authContext.entity.role) && (
                    <TouchableOpacity
                      onPress={() => {
                        setFilterPopup(true);
                      }}>
                      <FastImage
                        source={images.localHomeFilter}
                        style={{height: 25, width: 25, marginRight: 15}}
                        resizeMode={'contain'}
                      />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ScheduleStack', {
                        screen: 'CreateEventScreen',
                        params: {
                          comeName: 'ScheduleScreen',
                        },
                      });
                    }}>
                    <Image
                      source={images.addEvent}
                      style={styles.headerRightImg}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setSettingsModal(true)}>
                    <Image
                      source={images.vertical3Dot}
                      style={styles.threeDotImageStyle}
                    />
                  </TouchableOpacity>
                </View>
              )
            }
          />
        )}

        <View style={styles.separateLine} />
      </View>
      {authContext.isAccountDeactivated && <TCAccountDeactivate />}
      <View
        style={[
          styles.mainContainer,
          {
            opacity: authContext.isAccountDeactivated ? 0.5 : 1,
          },
        ]}
        pointerEvents={authContext.isAccountDeactivated ? 'none' : 'auto'}
        needsOffscreenAlphaCompositing>
        <View style={{flex: 1, backgroundColor: colors.offwhite}}>
          {![Verbs.entityTypeClub].includes(authContext.entity.role) && (
            <View
              style={{
                flexDirection: 'row',
                height: 45,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={
                    scheduleIndexCounter === 0
                      ? styles.activeWrapper
                      : styles.inactiveWrapper
                  }>
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
                </View>
                <View
                  style={
                    scheduleIndexCounter === 1
                      ? styles.activeWrapper
                      : styles.inactiveWrapper
                  }>
                  <Text
                    style={
                      scheduleIndexCounter === 1
                        ? styles.activeButton
                        : styles.inActiveButton
                    }
                    onPress={() => {
                      onDayPress(new Date());
                      setScheduleIndexCounter(1);
                    }}>
                    {strings.availability}
                  </Text>
                </View>
              </View>

              {scheduleIndexCounter === 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setFilterPopup(true);
                  }}>
                  <FastImage
                    source={images.localHomeFilter}
                    style={{height: 25, width: 25, marginRight: 15}}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={styles.separateLine} />
          {!loading &&
            scheduleIndexCounter === 0 &&
            [
              Verbs.entityTypeUser,
              Verbs.entityTypePlayer,
              Verbs.entityTypeClub,
              Verbs.entityTypeTeam,
            ].includes(authContext.entity.role) &&
            filterSetting.sort > 0 &&
            eventData.length > 0 && (
              <View style={styles.sportsListView}>
                <FlatList
                  ref={refContainer}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={
                    (filterSetting.sort ===
                      ([Verbs.entityTypeClub, Verbs.entityTypeTeam].includes(
                        authContext.entity.role,
                      )
                        ? 1
                        : 1) &&
                      organizerOptions) ||
                    (filterSetting.sort ===
                      ([Verbs.entityTypeClub, Verbs.entityTypeTeam].includes(
                        authContext.entity.role,
                      )
                        ? 2
                        : 3) &&
                      sports) ||
                    (filterSetting.sort ===
                      ([Verbs.entityTypeClub].includes(authContext.entity.role)
                        ? -1
                        : 2) &&
                      reservationOpetions)
                  }
                  keyExtractor={keyExtractor}
                  renderItem={
                    (filterSetting.sort ===
                      ([Verbs.entityTypeClub, Verbs.entityTypeTeam].includes(
                        authContext.entity.role,
                      )
                        ? 1
                        : 1) &&
                      organizerListView) ||
                    (filterSetting.sort ===
                      ([Verbs.entityTypeClub, Verbs.entityTypeTeam].includes(
                        authContext.entity.role,
                      )
                        ? 2
                        : 3) &&
                      sportOptionsListView) ||
                    (filterSetting.sort ===
                      ([Verbs.entityTypeClub].includes(authContext.entity.role)
                        ? -1
                        : 2) &&
                      ![Verbs.entityTypeClub].includes(
                        authContext.entity.role,
                      ) &&
                      optionsListView)
                  }
                />
              </View>
            )}

          {filterTags.length > 0 && scheduleIndexCounter === 0 ? (
            <View style={{backgroundColor: colors.whiteColor}}>
              <FlatList
                data={filterTags}
                renderItem={renderTags}
                keyExtractor={(item, index) => index.toString()}
                style={styles.tagListStyle}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          ) : null}
          {indigator ? (
            <>
              {scheduleIndexCounter === 0 ? (
                <EventListShimmer />
              ) : (
                <AvailabilityShimmer />
              )}
            </>
          ) : (
            <>
              {scheduleIndexCounter === 0 && (
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
                      setIndigator(false);
                      navigation.navigate('ScheduleStack', {
                        screen: 'EventScreen',
                        params: {
                          data: item,
                          gameData: item,
                        },
                      });
                    }
                  }}
                  entity={authContext.entity}
                  owners={owners}
                  allUserData={allUserData}
                  timeSelectionOption={timeSelectionOption}
                  startDateTime={startDateTime}
                  endDateTime={endDateTime}
                  refreshData={() => {
                    getEventsAndSlotsList();
                  }}
                  loading={indigator}
                />
              )}

              {scheduleIndexCounter === 1 && (
                <AvailibilityScheduleScreen
                  allSlots={allSlots}
                  isAdmin={isAdmin}
                  setIsFromSlots={setIsFromSlots}
                  setVisibleAvailabilityModal={setVisibleAvailabilityModal}
                  setEditableSlots={setEditableSlots}
                />
              )}
            </>
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
                navigation.navigate('ScheduleStack', {
                  screen: 'DefaultColorScreen',
                });
              } else if (index === 1) {
                navigation.navigate('ScheduleStack', {
                  screen: 'GroupEventScreen',
                });
              } else if (index === 2) {
                navigation.navigate('ScheduleStack', {
                  screen: 'ViewPrivacyScreen',
                });
              }
            } else if (index === 0) {
              navigation.navigate('ScheduleStack', {
                screen: 'DefaultColorScreen',
              });
            } else if (index === 1) {
              navigation.navigate('ScheduleStack', {
                screen: 'ViewPrivacyScreen',
              });
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
          <View style={styles.bottomPopupContainer}>
            <View style={styles.topHeaderContainer}>
              {Platform.OS === 'android' && (
                <StatusBar
                  backgroundColor={colors.modalBackgroundColor}
                  barStyle="light-content"
                />
              )}
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                style={styles.closeFilterButton}
                onPress={() => {
                  setFilterPopup(false);
                }}>
                <Image
                  source={images.crossImage}
                  style={styles.closeFilterButton}
                />
              </TouchableOpacity>
              <Text style={styles.titleText}>{strings.filter}</Text>
              <TouchableOpacity
                onPress={async () => {
                  setFilterPopup(false);
                  setIndigator(true);
                  setFilterSetting({
                    ...filterSetting,
                    time: timeFilterOpetion,
                  });
                  setIndigator(false);
                  setFilterTagOptions();
                  // await getEventsAndSlotsList();
                }}>
                <Text style={styles.applyText}>{strings.apply}</Text>
              </TouchableOpacity>
            </View>
            <View>
              <ScrollView>
                <>
                  {[
                    Verbs.entityTypeUser,
                    Verbs.entityTypePlayer,
                    Verbs.entityTypeClub,
                  ].includes(authContext.entity.role) && (
                    <View style={{flex: 1}}>
                      {![Verbs.entityTypeClub].includes(
                        authContext.entity.role,
                      ) && (
                        <>
                          <TCThinDivider width={'92%'} marginBottom={15} />
                          <View>
                            <Text style={styles.titleText}>
                              {strings.eventFilterRsvpText}
                            </Text>
                            <FlatList
                              data={rsvpFilterOptions}
                              renderItem={renderRsvpFilterOpetions}
                              style={{marginTop: 15}}
                            />
                          </View>
                        </>
                      )}
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
                        {timeSelectionOption}
                      </Text>
                      <Image
                        source={images.dropDownArrow}
                        style={styles.downArrowWhoCan}
                      />
                    </View>
                  </TouchableOpacity>

                  {timeSelectionPicker && (
                    <>
                      <View style={styles.filterContainer}>
                        <FilterTimeSelectItem
                          title={strings.from}
                          date={moment(startDateTime).format('ll')}
                          time={moment(startDateTime).format('h:mm a')}
                          onDatePress={() => {
                            setStartDateVisible(true);
                          }}
                          onXCirclePress={() => setStartDateTime(new Date())}
                        />
                      </View>
                      <View style={styles.filterContainer}>
                        <FilterTimeSelectItem
                          title={strings.to}
                          date={moment(endDateTime).format('ll')}
                          time={moment(endDateTime).format('h:mm a')}
                          onDatePress={() => {
                            setEndDateVisible(true);
                          }}
                          onXCirclePress={() => setEndDateTime(new Date())}
                        />
                      </View>
                    </>
                  )}

                  {timeFilterData[timeFilterOpetion] ===
                  strings.eventFilterTimeFuture ? (
                    <>
                      <DateTimePickerView
                        title={strings.chooseDateTimeText}
                        visible={startDateVisible}
                        onDone={(date) => {
                          setStartDateTime(date);
                          setEndDateTime(moment(date).add(5, 'm').toDate());
                          setStartDateVisible(false);
                        }}
                        onCancel={handleCancelPress}
                        onHide={handleCancelPress}
                        mode={'datetime'}
                        date={startDateTime ?? new Date()}
                        minutesGap={5}
                        minimumDate={new Date()}
                      />

                      <DateTimePickerView
                        title={strings.chooseDateTimeText}
                        visible={endDateVisible}
                        onDone={(date) => {
                          setEndDateTime(date);
                          setEndDateVisible(false);
                        }}
                        onCancel={handleCancelPress}
                        onHide={handleCancelPress}
                        mode={'datetime'}
                        date={endDateTime ?? new Date()}
                        minutesGap={5}
                        minimumDate={endDateTime ?? new Date()}
                      />
                    </>
                  ) : (
                    <>
                      <DateTimePickerView
                        title={strings.chooseDateTimeText}
                        visible={startDateVisible}
                        onDone={(date) => {
                          setStartDateTime(date);
                          setEndDateTime(moment(date).add(5, 'm').toDate());
                          setStartDateVisible(false);
                        }}
                        onCancel={handleCancelPress}
                        onHide={handleCancelPress}
                        mode={'datetime'}
                        date={startDateTime ?? new Date()}
                        minutesGap={5}
                        maximumDate={new Date()}
                      />

                      <DateTimePickerView
                        title={strings.chooseDateTimeText}
                        visible={endDateVisible}
                        onDone={(date) => {
                          setEndDateTime(date);
                          setEndDateVisible(false);
                        }}
                        onCancel={handleCancelPress}
                        onHide={handleCancelPress}
                        mode={'datetime'}
                        date={endDateTime ?? new Date()}
                        minutesGap={5}
                        minimumDate={endDateTime ?? new Date()}
                      />
                    </>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      setTimeFilterOpetion(0);
                      setRsvpFilterOption(0);
                      setTimeSelectionOption(strings.filterAntTime);
                      setTimeSelectionPicker(false);
                    }}>
                    <View
                      style={{
                        backgroundColor: colors.lightGrey,
                        paddingHorizontal: 50,
                        paddingVertical: 5,
                        alignSelf: 'center',
                        borderRadius: 5,
                        marginTop: 20,
                      }}>
                      <Text>{strings.eventFilterResetText}</Text>
                    </View>
                  </TouchableOpacity>
                </>
              </ScrollView>
            </View>
          </View>

          <BottomSheet
            optionList={
              timeFilterOpetion === 0
                ? timeSelectionFutureList
                : timeSelectionPastList
            }
            isVisible={timeSelectionModal}
            closeModal={() => setTimeSelectionModal(false)}
            onSelect={(option) => {
              if (option === strings.filterPickaDate) {
                setTimeSelectionPicker(true);
                setPopupFilterHeight(100);
              } else {
                getDates(timeFilterOpetion, option);
                setTimeSelectionPicker(false);
                setPopupFilterHeight(375);
              }
              setTimeSelectionModal(false);
              setTimeSelectionOption(option);
            }}
          />
        </Modal>

        {/* Schedule settings modal */}
        <BottomSheet
          optionList={eventSettingsOption}
          isVisible={settingsModal}
          closeModal={() => setSettingsModal(false)}
          onSelect={(option) => {
            if (option === strings.eventsViewSettings) {
              navigation.navigate('ScheduleStack', {
                screen: 'ViewEventSettingsScreen',
              });
            } else if (option === strings.likeEvent) {
              navigation.navigate('ScheduleStack', {
                screen: 'LikedEventScreen',
              });
            } else {
              navigation.navigate('ScheduleStack', {
                screen: 'ViewPrivacyScreen',
              });
            }
            setSettingsModal(false);
          }}
        />

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
              actionSheetOpetions()?.[index] ===
              strings.refereeReservationDetail
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
            if (
              actionSheetOpetions()?.[index] === strings.gameReservationDetails
            ) {
              goToChallengeDetail(selectedEventItem.game);
            }
            if (
              actionSheetOpetions()?.[index] === strings.changeEventColorText
            ) {
              navigation.navigate('ScheduleStack', {
                screen: 'EditEventScreen',
                params: {
                  data: selectedEventItem,
                  gameData: selectedEventItem,
                },
              });
            }
            if (actionSheetOpetions()?.[index] === 'Edit') {
              navigation.navigate('ScheduleStack', {
                screen: 'EditEventScreen',
                params: {
                  data: selectedEventItem,
                  gameData: selectedEventItem,
                },
              });
            }

            setSelectedEventItem(null);
          }}
        />
      </View>

      <ChallengeAvailability
        isVisible={visibleAvailabilityModal}
        closeModal={() => {
          setIsFromSlots(false);
          setVisibleAvailabilityModal(false);
        }}
        slots={editableSlots}
        addToSlotData={addToSlotData}
        showAddMore={true}
        deleteFromSlotData={deleteFromSlotData}
        deleteOrCreateSlotData={deleteOrCreateSlotData}
        isFromSlot={isFromSlots}
      />

      {/*  Availability edit modal */}
      {/* <Modal
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
          ]}>
          <ChallengeAvailability
            setVisibleAvailabilityModal={setVisibleAvailabilityModal}
            slots={[]}
            slotType={editableSlotsType}
            setEditableSlotsType={setEditableSlotsType}
          />
        </View>
      </Modal> */}

      {/* <ActionSheet
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
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    height: 25,
    marginRight: 10,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    flex: 1,
  },
  closeButton: {
    alignSelf: 'center',
    width: 8,
    height: 8,
    resizeMode: 'contain',
    marginLeft: 5,
    marginRight: 5,
  },
  tagListStyle: {
    marginLeft: 15,
    marginTop: 15,
  },
  tagTitleText: {
    alignSelf: 'center',
    marginLeft: 10,
    marginRight: 5,
    fontFamily: fonts.RRegular,
    fontSize: 12,
  },

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
  filterContainer: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    borderRadius: 5,
    width: wp('94%'),
    height: 40,
    alignSelf: 'center',
    backgroundColor: colors.textFieldBackground,
    marginTop: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginBottom: 15,
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
    fontSize: 16,
    fontFamily: fonts.RBlack,
    color: colors.darkYellowColor,
  },
  activeWrapper: {
    borderBottomColor: colors.darkYellowColor,
    borderBottomWidth: 3,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  inActiveButton: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  inactiveWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  clubActiveWrapper: {
    borderBottomColor: colors.darkYellowColor,
    borderBottomWidth: 2,
  },
  clubInactiveWrapper: {
    borderBottomWidth: 0,
  },
  headerRightImg: {
    height: 25,
    resizeMode: 'contain',
    width: 25,
    tintColor: colors.lightBlackColor,
  },

  eventTitleTextStyle: {
    width: 130,
    textAlign: 'left',
    fontFamily: fonts.Roboto,
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 18,
    paddingTop: 5,
    color: colors.lightBlackColor,
    marginLeft: 0,
  },

  separateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
  },
  sportsListView: {
    flexDirection: 'row',
    backgroundColor: colors.offwhite,
    borderBottomColor: colors.writePostSepratorColor,
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
    paddingBottom: Platform.OS === 'ios' ? 80 : 50,
    backgroundColor: colors.whiteColor,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
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
        elevation: 5,
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
  // closeButton: {
  //   alignSelf: 'center',
  //   width: 15,
  //   height: 15,
  //   marginLeft: 5,
  //   resizeMode: 'contain',
  //   tintColor: colors.blackColor,
  // },
  topHeaderContainer: {
    // backgroundColor: '#333',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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
  // changeOrderStyle: {
  //   fontSize: 14,
  //   fontFamily: fonts.RRegular,
  //   color: colors.themeColor,
  //   textDecorationLine: 'underline',
  //   marginLeft: 20,
  // },
  threeDotImageStyle: {
    height: 25,
    width: 25,
    // tintColor: colors.blackColor,
    resizeMode: 'contain',
    marginLeft: 10,
    marginRight: -7,
  },
});
