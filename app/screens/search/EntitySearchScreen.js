/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  Alert,
  Platform,
  TextInput,
  ActivityIndicator,
  BackHandler,
  Dimensions,
} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import AuthContext from '../../auth/context';
import {getStorage} from '../../utils';

import colors from '../../Constants/Colors';
import Verbs from '../../Constants/Verbs';
import fonts from '../../Constants/Fonts';
import {
  getGroupIndex,
  getUserIndex,
  getGameIndex,
  getCalendarIndex,
} from '../../api/elasticSearch';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import * as Utility from '../../utils';
import TCUpcomingMatchCard from '../../components/TCUpcomingMatchCard';
import TCPlayerView from '../../components/TCPlayerView';
import TCThinDivider from '../../components/TCThinDivider';
import TCTeamSearchView from '../../components/TCTeamSearchView';
import TCRecentMatchCard from '../../components/TCRecentMatchCard';
import TCTagsFilter from '../../components/TCTagsFilter';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {
  getGroupDetails,
  getGroups,
  joinTeam,
  leaveTeam,
} from '../../api/Groups';
import {inviteUser} from '../../api/Users';
import {acceptRequest, declineRequest} from '../../api/Notificaitons';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import {ErrorCodes, filterType, locationType} from '../../utils/constant';
import {
  getButtonStateForPeople,
  getSportList,
} from '../../utils/sportsActivityUtils';
import SearchModal from '../../components/Filter/SearchModal';
import {ModalTypes} from '../../Constants/GeneralConstants';
import CustomModalWrapper from '../../components/CustomModalWrapper';

import CustomScrollTabs from '../../components/CustomScrollTabs';

import ScreenHeader from '../../components/ScreenHeader';
import JoinButtonModal from '../home/JoinButtomModal';
import SportView from '../localhome/SportView';
import EventList from './components/EventList';
import {getAvailableEntityIdList} from '../../utils/elasticApiCall';

const pageSize = 10;
let stopFetchMore = true;
let timeout;

// const TAB_ITEMS = [
//   strings.peopleTitleText,
//   strings.groupsTitleText,
//   strings.matchesTitleText,
//   strings.eventsTitle,
// ];
// const PEOPLE_SUB_TAB_ITEMS = [
//   strings.generalText,
//   strings.playerTitle,
//   strings.refereesTitle,
//   strings.scorekeeperTitle,
// ];
// const GROUP_SUB_TAB_ITEMS = [
//   strings.teamsTitleText,
//   strings.clubsTitleText,
//   strings.leaguesTitleText,
// ];
// const GAMES_SUB_TAB_ITEMS = [
//   strings.completedTitleText,
//   strings.upcomingTitleText,
// ];

// const EVENTS_SUB_TAB_ITEMS = [
//   strings.completedTitleText,
//   strings.upcomingTitleText,
// ];

export default function EntitySearchScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const GAME_HOME = {
    soccer: 'SoccerHome',
    tennis: 'TennisHome',
    tennis_double: 'TennisHome',
  };
  const getGameHomeScreen = (sportName) =>
    GAME_HOME[sportName?.split(' ').join('_').toLowerCase()];
  const [showJoinModal, setShowJoinModal] = useState(false);

  // For activity indigator

  const [loading, setloading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentSubTab, setCurrentSubTab] = useState(strings.generalText);
  const [generalList, setGeneralList] = useState([]);
  const [playerList, setplayerList] = useState([]);
  const [referees, setReferees] = useState([]);
  const [scorekeepers, setScorekeepers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [completedGame, setCompletedGame] = useState([]);
  const [upcomingGame, setUpcomingGame] = useState([]);
  const [TAB_ITEMS] = useState([
    strings.peopleTitleText,
    strings.groupsTitleText,
    strings.matchesTitleText,
    strings.eventsTitle,
  ]);
  const [PEOPLE_SUB_TAB_ITEMS] = useState([
    strings.generalText,
    strings.playerTitle,
    strings.refereesTitle,
    strings.scorekeeperTitle,
  ]);

  const [GROUP_SUB_TAB_ITEMS] = useState([
    strings.teamsTitleText,
    strings.clubsTitleText,
    strings.leaguesTitleText,
  ]);
  const [GAMES_SUB_TAB_ITEMS] = useState([
    strings.completedTitleText,
    strings.upcomingTitleText,
  ]);

  const EVENTS_SUB_TAB_ITEMS = useState([
    strings.completedTitleText,
    strings.upcomingTitleText,
  ]);

  const [settingPopup, setSettingPopup] = useState(false);
  // Pagination
  const [generalPageFrom, setGeneralPageFrom] = useState(0);
  const [pageFrom, setPageFrom] = useState(0);
  const [refereesPageFrom, setRefereesPageFrom] = useState(0);
  const [scorekeeperPageFrom, setScorekeeperPageFrom] = useState(0);
  const [teamsPageFrom, setTeamsPageFrom] = useState(0);
  const [clubsPageFrom, setClubsPageFrom] = useState(0);
  const [completedGamePageFrom, setCompletedGamePageFrom] = useState(0);
  const [upcomingGamePageFrom, setUpcomingGamePageFrom] = useState(0);
  const [completedEventPageFrom, setCompletedEventPageFrom] = useState(0);
  const [upcomingEventPageFrom, setUpcomingEventPageFrom] = useState(0);
  const [groupData, setGroupData] = useState({});
  const [isInvited] = useState(false);
  // const [location, setLocation] = useState(strings.worldTitleText);
  const [generalFilter, setGeneralFilter] = useState({
    location: strings.worldTitleText,
    locationOption: locationType.WORLD,
    sport: strings.allSport,
    sport_type: strings.allSport,
    sport_name: strings.allSport,
  });
  const [playerFilter, setPlayerFilter] = useState({
    location: strings.worldTitleText,
    locationOption: locationType.WORLD,
    sport: strings.allSport,
    sport_type: strings.allSport,
    sport_name: strings.allSport,
  });
  const [refereeFilters, setrRefereeFilters] = useState({
    location: strings.worldTitleText,
    locationOption: locationType.WORLD,
    sport: strings.allSport,
    sport_type: strings.allSport,
    sport_name: strings.allSport,
  });
  const [scoreKeeperFilters, setScoreKeeperFilters] = useState({
    location: strings.worldTitleText,
    locationOption: locationType.WORLD,
    sport: strings.allSport,
    sport_type: strings.allSport,
    sport_name: strings.allSport,
  });
  const [teamFilters, setTeamFilters] = useState({
    location: strings.worldTitleText,
    locationOption: locationType.WORLD,
    sport: strings.allSport,
    sport_type: strings.allSport,
    sport_name: strings.allSport,
  });
  const [clubFilters, setClubFilters] = useState({
    location: strings.worldTitleText,
    locationOption: locationType.WORLD,
    sport: strings.allSport,
    sport_type: strings.allSport,
    sport_name: strings.allSport,
  });
  const [completedGameFilters, setCompletedGameFilters] = useState({
    location: strings.worldTitleText,
    locationOption: locationType.WORLD,
    sport: strings.allSport,
    sport_type: strings.allSport,
    sport_name: strings.allSport,
  });
  const [upcomingGameFilters, setUpcomingGameFilters] = useState({
    location: strings.worldTitleText,
    locationOption: locationType.WORLD,
    sport: strings.allSport,
    sport_type: strings.allSport,
    sport_name: strings.allSport,
  });
  const [completedEventFilters, setCompletedEventFilters] = useState({
    location: strings.worldTitleText,
    locationOption: locationType.WORLD,
    sport: strings.allSport,
    sport_type: strings.allSport,
    sport_name: strings.allSport,
    // eventType: strings.upcomingTitleText,
  });
  const [upcomingEventFilters, setUpcomingEventFilters] = useState({
    location: strings.worldTitleText,
    locationOption: locationType.WORLD,
    sport: strings.allSport,
    sport_type: strings.allSport,
    sport_name: strings.allSport,
    // eventType: strings.upcomingTitleText,
  });
  const searchBoxRef = useRef();
  const [challengePopup, setChallengePopup] = useState(false);
  const [selectedChallengeOption, setSelectedChallengeOption] = useState();
  const [mySettingObject] = useState(authContext.entity.obj.setting);
  const [myGroupDetail] = useState(
    authContext.entity.role === Verbs.entityTypeTeam && authContext.entity.obj,
  );
  const [currentUserData, setCurrentUserData] = useState({});
  const [settingObject, setSettingObject] = useState();
  const actionSheet = useRef();
  const [message, setMessage] = useState('');
  const [activityId, setActibityId] = useState();
  const cancelReqActionSheet = useRef();
  const defaultSport = [
    {
      sport: strings.allSport,
      sport_name: strings.allSport,
      sport_type: strings.allSport,
    },
  ];
  const [imageBaseUrl, setImageBaseUrl] = useState('');
  const [playerDetailPopup, setPlayerDetailPopup] = useState();
  const [playerDetail, setPlayerDetail] = useState();
  const [searchText, setSearchText] = useState('');
  const [smallLoader, setSmallLoader] = useState(false);
  const [snapPoints, setSnapPoints] = useState([]);
  const isFocused = useIsFocused();
  const [joinedGroups, setJoinedGroups] = useState({teams: [], clubs: []});
  const [completedEvents, setCompletedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    if (isFocused && authContext.entity.role === Verbs.entityTypeTeam) {
      getGroupDetails(authContext.entity.uid, authContext).then((response) => {
        const list = response.payload.parent_groups ?? [];
        setJoinedGroups({teams: [], clubs: [...list]});
      });
    }
  }, [isFocused, authContext]);

  useEffect(() => {
    if (
      isFocused &&
      (authContext.entity.role !== Verbs.entityTypeTeam ||
        authContext.entity.role !== Verbs.entityTypeClub)
    ) {
      getGroups(authContext)
        .then((res) => {
          const response = res.payload ?? {};
          const joinedTeams = response.teams.map((item) => item.group_id);
          const joinedClubs = response.clubs.map((item) => item.group_id);
          setJoinedGroups({teams: joinedTeams, clubs: joinedClubs});
        })
        .catch((err) => {
          console.log('err ==>', err);
        });
    }
  }, [isFocused, authContext]);

  const handleBackPress = useCallback(() => {
    if (route.params?.parentStack) {
      navigation.navigate(route.params.parentStack, {
        screen: route.params.screen,
      });
    } else {
      navigation.navigate('App', {
        screen: 'LocalHome',
      });
    }
  }, [navigation, route.params?.parentStack, route.params?.screen]);

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  useEffect(() => {
    getStorage('appSetting').then((setting) => {
      setImageBaseUrl(setting.base_url_sporticon);
    });
    if (route.params?.locationText) {
      setSettingPopup(true);
    }
  }, [route.params?.locationText]);

  useEffect(() => {
    if (route.params?.activeTab === 0 || route.params?.activeTab) {
      setCurrentTab(route.params.activeTab);
      let subTab = '';
      if (route.params?.activeSubTab) {
        subTab = route.params.activeSubTab;
      } else {
        switch (route.params?.activeTab) {
          case 0:
            subTab = PEOPLE_SUB_TAB_ITEMS[0];
            break;

          case 1:
            subTab = GROUP_SUB_TAB_ITEMS[0];
            break;

          case 2:
            subTab = GAMES_SUB_TAB_ITEMS[0];
            break;

          case 3:
            subTab = EVENTS_SUB_TAB_ITEMS[0];
            break;

          default:
            break;
        }
      }

      setCurrentSubTab(subTab);
    }
  }, [route.params?.activeTab, route.params?.activeSubTab]);

  useEffect(() => {
    if (route.params?.localItems) {
      handleTagPress(route.params?.localItems);
    }
  }, [route.params?.localItems]);

  const getUpcomingEventList = useCallback(() => {
    setSmallLoader(true);
    const upcomingEventsQuery = {
      size: pageSize,
      from: upcomingEventPageFrom,
      query: {
        bool: {
          must: [
            {
              range: {
                actual_enddatetime: {
                  gt: Number(
                    parseFloat(new Date().getTime() / 1000).toFixed(0),
                  ),
                },
              },
            },
          ],
        },
      },
      sort: [{actual_enddatetime: 'desc'}],
    };

    if (upcomingEventFilters.location !== strings.worldTitleText) {
      upcomingEventsQuery.query.bool.must.push({
        match_phrase_prefix: {
          'location.location_name.keyword': `*${upcomingEventFilters.location.toLowerCase()}*`,
        },
      });
    }

    if (upcomingEventFilters.sport !== strings.allSport) {
      upcomingEventsQuery.query.bool.must.push({
        term: {
          'selected_sport.sport.keyword': `${upcomingEventFilters.sport.toLowerCase()}`,
        },
      });
      upcomingEventsQuery.query.bool.must.push({
        term: {
          'selected_sport.sport_type.keyword': `${upcomingEventFilters.sport_type.toLowerCase()}`,
        },
      });
    }

    if (upcomingEventFilters?.searchText) {
      upcomingEventsQuery.query.bool.must.push({
        match_phrase_prefix: {
          title: `*${upcomingEventFilters.searchText.toLowerCase()}*`,
        },
      });
    }

    getCalendarIndex(upcomingEventsQuery)
      .then((events) => {
        if (events.length > 0) {
          setUpcomingEvents((prevProps) => [...prevProps, ...events]);
          setUpcomingEventPageFrom((prevPros) => prevPros + pageSize);
          stopFetchMore = true;
        } else if (upcomingEventPageFrom === 0) {
          setUpcomingEvents([]);
        }
        setSmallLoader(false);
      })
      .catch((err) => {
        console.log({err});
        setSmallLoader(false);
      });
  }, [upcomingEventPageFrom, upcomingEventFilters]);

  const getCompletedEventList = useCallback(() => {
    setSmallLoader(true);
    const completedEventsQuery = {
      size: pageSize,
      from: completedEventPageFrom,
      query: {
        bool: {
          must: [
            {
              range: {
                actual_enddatetime: {
                  lt: Number(
                    parseFloat(new Date().getTime() / 1000).toFixed(0),
                  ),
                },
              },
            },
          ],
        },
      },
      sort: [{actual_enddatetime: 'desc'}],
    };

    if (completedEventFilters.location !== strings.worldTitleText) {
      completedEventsQuery.query.bool.must.push({
        match_phrase_prefix: {
          'location.location_name.keyword': `*${completedEventFilters.location.toLowerCase()}*`,
        },
      });
    }

    if (completedEventFilters.sport !== strings.allSport) {
      completedEventsQuery.query.bool.must.push({
        term: {
          'selected_sport.sport.keyword': `${completedEventFilters.sport.toLowerCase()}`,
        },
      });
      completedEventsQuery.query.bool.must.push({
        term: {
          'selected_sport.sport_type.keyword': `${completedEventFilters.sport_type.toLowerCase()}`,
        },
      });
    }

    if (completedEventFilters?.searchText) {
      completedEventsQuery.query.bool.must.push({
        match_phrase_prefix: {
          title: `*${completedEventFilters.searchText.toLowerCase()}*`,
        },
      });
    }

    getCalendarIndex(completedEventsQuery)
      .then((events) => {
        setSmallLoader(false);

        if (events.length > 0) {
          setCompletedEvents((prevProps) => [...prevProps, ...events]);
          setCompletedEventPageFrom((prevProps) => prevProps + pageSize);
          stopFetchMore = true;
        } else if (completedEventPageFrom === 0) {
          setCompletedEvents([]);
        }
      })
      .catch((err) => {
        console.log({err});
        setSmallLoader(false);
      });
  }, [completedEventPageFrom, completedEventFilters]);

  useEffect(() => {
    getUpcomingEventList();
  }, [getUpcomingEventList]);

  useEffect(() => {
    getCompletedEventList();
  }, [getCompletedEventList]);

  useEffect(() => {
    getGeneralList();
  }, [generalFilter]);

  useEffect(() => {
    getPlayersList();
  }, [playerFilter]);

  useEffect(() => {
    getRefereesList();
  }, [refereeFilters]);

  useEffect(() => {
    getScoreKeepersList();
  }, [scoreKeeperFilters]);

  useEffect(() => {
    getTeamList();
  }, [teamFilters]);

  useEffect(() => {
    getClubList();
  }, [clubFilters]);

  useEffect(() => {
    getCompletedGamesList();
  }, [completedGameFilters]);

  useEffect(() => {
    getUpcomingGameList();
  }, [upcomingGameFilters]);

  const modifiedPlayerElasticSearchResult = (response) => {
    let list = [...response];
    if (playerFilter?.minFee || playerFilter?.maxFee) {
      const minFee = playerFilter.minFee ? Number(playerFilter.minFee) : 0;
      const maxFee = playerFilter.maxFee ? Number(playerFilter.maxFee) : 0;

      const sortedList = [];
      response.forEach((item) => {
        const sport = (item.registered_sports ?? []).find(
          (ele) =>
            ele.sport === playerFilter.sport &&
            playerFilter.sport_type === ele.sport_type,
        );

        if (sport && minFee <= sport?.setting?.game_fee?.fee) {
          if (maxFee) {
            if (maxFee >= sport?.setting?.game_fee?.fee) {
              sortedList.push(item);
            }
          } else {
            sortedList.push(item);
          }
        }
        list = [...sortedList];
      });
    }
    const modifiedData = [];
    for (const item of list) {
      const registerSports = item.registered_sports.map((obj) => ({
        ...obj,
        sport_name: Utility.getSportName(obj, authContext),
      }));
      item.registered_sports = registerSports;
      modifiedData.push(item);
    }
    return modifiedData;
  };
  const modifiedRefereeElasticSearchResult = (response) => {
    let list = [...response];
    if (refereeFilters?.minFee || refereeFilters?.maxFee) {
      const minFee = refereeFilters.minFee ? Number(refereeFilters.minFee) : 0;
      const maxFee = refereeFilters.maxFee ? Number(refereeFilters.maxFee) : 0;

      const sortedList = [];
      response.forEach((item) => {
        const sport = (item.referee_data ?? []).find(
          (ele) => ele.sport === refereeFilters.sport,
        );

        if (sport && minFee <= sport?.setting?.game_fee?.fee) {
          if (maxFee) {
            if (maxFee >= sport?.setting?.game_fee?.fee) {
              sortedList.push(item);
            }
          } else {
            sortedList.push(item);
          }
        }
        list = [...sortedList];
      });
    }

    const modifiedData = [];
    for (const item of list) {
      const refereeSports = item.referee_data.map((obj) => ({
        ...obj,
        sport_name: Utility.getSportName(obj, authContext),
      }));
      item.referee_data = refereeSports;
      modifiedData.push(item);
    }
    return modifiedData;
  };
  const modifiedScoreKeeperElasticSearchResult = (response) => {
    let list = [...response];
    if (scoreKeeperFilters?.minFee || scoreKeeperFilters?.maxFee) {
      const minFee = scoreKeeperFilters.minFee
        ? Number(scoreKeeperFilters.minFee)
        : 0;
      const maxFee = scoreKeeperFilters.maxFee
        ? Number(scoreKeeperFilters.maxFee)
        : 0;

      const sortedList = [];
      response.forEach((item) => {
        const sport = (item.scorekeeper_data ?? []).find(
          (ele) => ele.sport === scoreKeeperFilters.sport,
        );

        if (sport && minFee <= sport?.setting?.game_fee?.fee) {
          if (maxFee) {
            if (maxFee >= sport?.setting?.game_fee?.fee) {
              sortedList.push(item);
            }
          } else {
            sortedList.push(item);
          }
        }
        list = [...sortedList];
      });
    }
    const modifiedData = [];
    for (const item of list) {
      const scoreKeeperSports = item.scorekeeper_data.map((obj) => ({
        ...obj,
        sport_name: Utility.getSportName(obj, authContext),
      }));
      item.scorekeeper_data = scoreKeeperSports;
      modifiedData.push(item);
    }
    return modifiedData;
  };
  const modifiedTeamElasticSearchResult = (response) => {
    let list = [...response];
    if (teamFilters?.minFee || teamFilters?.maxFee) {
      const minFee = teamFilters.minFee ? Number(teamFilters.minFee) : 0;
      const maxFee = teamFilters.maxFee ? Number(teamFilters.maxFee) : 0;

      const sortedList = [];
      response.forEach((item) => {
        if (minFee <= item?.setting?.game_fee?.fee) {
          if (maxFee) {
            if (maxFee >= item?.setting?.game_fee?.fee) {
              sortedList.push(item);
            }
          } else {
            sortedList.push(item);
          }
        }
      });
      list = [...sortedList];
    }

    const modifiedData = list.map((obj) => ({
      ...obj,
      sport_name: Utility.getSportName(obj, authContext),
    }));
    return modifiedData;
  };
  const modifiedClubElasticSearchResult = (response) => {
    const modifiedData = [];
    for (const item of response) {
      const clubSports = item.sports.map((obj) => ({
        ...obj,
        sport_name: Utility.getSportName(obj, authContext),
      }));
      item.sports = clubSports;
      modifiedData.push(item);
    }
    return modifiedData;
  };
  const getGeneralList = useCallback(() => {
    setSmallLoader(true);
    const generalsQuery = {
      size: pageSize,
      from: generalPageFrom,
      query: {
        bool: {
          must: [{match: {entity_type: 'player'}}],
        },
      },
    };
    // Search filter
    if (generalFilter.searchText) {
      generalsQuery.query.bool.must.push({
        match_phrase_prefix: {
          full_name: `*${generalFilter.searchText.toLowerCase()}*`,
        },
      });
    }
    getUserIndex(generalsQuery)
      .then((res) => {
        setSmallLoader(false);
        if (res.length > 0) {
          const fetchedData = [...generalList, ...res];
          setGeneralList(fetchedData);
          setGeneralPageFrom(generalPageFrom + pageSize);
          stopFetchMore = true;
        }
      })
      .catch((e) => {
        setSmallLoader(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [generalFilter, generalPageFrom, generalList]);

  const getPlayersList = useCallback(async () => {
    setSmallLoader(true);
    const playersQuery = {
      size: pageSize,
      from: pageFrom,
      query: {
        bool: {
          must: [
            {match: {entity_type: 'player'}},
            // {term: {is_deactivate: false}},
            {
              nested: {
                path: 'registered_sports',
                query: {
                  bool: {
                    must: [{term: {'registered_sports.is_active': true}}],
                  },
                },
              },
            },
          ],
        },
      },
    };

    // Sport filter
    if (playerFilter.sport !== strings.allSport) {
      playersQuery.query.bool.must[1].nested.query.bool.must.push({
        term: {
          'registered_sports.sport.keyword': `${playerFilter.sport.toLowerCase()}`,
        },
      });
      playersQuery.query.bool.must[1].nested.query.bool.must.push({
        term: {
          'registered_sports.sport_type.keyword': `${playerFilter.sport_type.toLowerCase()}`,
        },
      });
    }

    // World filter
    if (playerFilter.location !== strings.worldTitleText) {
      playersQuery.query.bool.must.push({
        multi_match: {
          query: `${playerFilter.location.toLowerCase()}`,
          fields: ['city', 'country', 'state', 'state_abbr'],
        },
      });
    }

    // Search filter with cover all filter

    if (playerFilter.searchText) {
      // simple search
      if (playerFilter.searchText) {
        playersQuery.query.bool.must.push({
          match_phrase_prefix: {
            full_name: `*${playerFilter.searchText.toLowerCase()}*`,
          },
        });
      }
    }

    if (
      playerFilter.availableTime &&
      playerFilter.availableTime !== strings.filterAntTime &&
      playerFilter?.fromDateTime &&
      playerFilter?.toDateTime
    ) {
      const obj = {
        fromDate: playerFilter.fromDateTime ?? '',
        toDate: playerFilter.toDateTime ?? '',
      };
      const response = await getAvailableEntityIdList(obj);

      if (response.length > 0) {
        playersQuery.query.bool.must_not = [
          {
            terms: {
              'user_id.keyword': [...response],
            },
          },
        ];
      }
    }

    getUserIndex(playersQuery)
      .then((res) => {
        setSmallLoader(false);
        if (res.length > 0) {
          let result = [...res];
          if (
            playerFilter?.availableTime &&
            playerFilter?.fromDateTime &&
            playerFilter?.toDateTime &&
            playerFilter.sport
          ) {
            const filterArr = [];
            res.forEach((item) => {
              const sport = (item.registered_sports ?? []).find(
                (ele) =>
                  ele.sport === playerFilter.sport &&
                  playerFilter.sport_type === ele.sport_type &&
                  (ele.setting?.availibility ?? Verbs.on) === Verbs.on,
              );
              if (sport) {
                filterArr.push(item);
              }
            });
            result = filterArr;
          }
          const modifiedResult = modifiedPlayerElasticSearchResult(result);
          const fetchedData = [...playerList, ...modifiedResult];
          setplayerList(fetchedData);
          setPageFrom(pageFrom + pageSize);
          stopFetchMore = true;
        }
      })
      .catch((e) => {
        setSmallLoader(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [playerFilter, pageFrom, playerList]);

  const getRefereesList = useCallback(async () => {
    setSmallLoader(true);
    const refereeQuery = {
      size: pageSize,
      from: refereesPageFrom,
      query: {
        bool: {
          must: [
            {
              nested: {
                path: 'referee_data',
                query: {
                  bool: {
                    must: [
                      {
                        term: {
                          'referee_data.is_published': true,
                        },
                      },
                    ],
                  },
                },
              },
            },
            {match: {entity_type: 'player'}},
            // {term: {is_deactivate: false}},
          ],
        },
      },
    };

    // Location filter
    if (refereeFilters.location !== strings.worldTitleText) {
      refereeQuery.query.bool.must.push({
        multi_match: {
          query: `${refereeFilters.location}`,
          fields: ['city', 'country', 'state', 'state_abbr'],
        },
      });
    }
    // Sport Filter
    if (refereeFilters.sport !== strings.allSport) {
      refereeQuery.query.bool.must[0].nested.query.bool.must.push({
        term: {
          'referee_data.sport.keyword': `${refereeFilters.sport.toLowerCase()}`,
        },
      });
    }

    // Search filter
    if (refereeFilters.searchText) {
      // Simple search with full name
      refereeQuery.query.bool.must.push({
        match_phrase_prefix: {
          full_name: `*${refereeFilters.searchText.toLowerCase()}*`,
        },
      });
    }

    if (
      refereeFilters.availableTime &&
      refereeFilters.availableTime !== strings.filterAntTime &&
      refereeFilters?.fromDateTime &&
      refereeFilters?.toDateTime
    ) {
      const obj = {
        fromDate: refereeFilters.fromDateTime ?? '',
        toDate: refereeFilters.toDateTime ?? '',
      };
      const response = await getAvailableEntityIdList(obj);

      if (response.length > 0) {
        refereeQuery.query.bool.must_not = [
          {
            terms: {
              'user_id.keyword': [...response],
            },
          },
        ];
      }
    }

    getUserIndex(refereeQuery)
      .then((res) => {
        setSmallLoader(false);
        if (res.length > 0) {
          let result = [...res];
          if (
            refereeFilters?.availableTime &&
            refereeFilters?.fromDateTime &&
            refereeFilters?.toDateTime &&
            refereeFilters.sport
          ) {
            const filterArr = [];
            res.forEach((item) => {
              const sport = (item.referee_data ?? []).find(
                (ele) =>
                  ele.sport === refereeFilters.sport &&
                  (ele.setting?.availibility ?? Verbs.on) === Verbs.on,
              );
              if (sport) {
                filterArr.push(item);
              }
            });
            result = filterArr;
          }
          const modifiedResult = modifiedRefereeElasticSearchResult(result);
          const fetchedData = [...referees, ...modifiedResult];
          setReferees(fetchedData);
          setRefereesPageFrom(refereesPageFrom + pageSize);
          stopFetchMore = true;
        }
      })
      .catch((e) => {
        setSmallLoader(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [refereesPageFrom, referees, refereeFilters]);

  const getScoreKeepersList = useCallback(async () => {
    setSmallLoader(true);
    // Score keeper query
    const scoreKeeperQuery = {
      size: pageSize,
      from: scorekeeperPageFrom,
      query: {
        bool: {
          must: [
            {
              nested: {
                path: 'scorekeeper_data',
                query: {
                  bool: {
                    must: [
                      {
                        term: {
                          'scorekeeper_data.is_published': true,
                        },
                      },
                      {
                        term: {
                          'scorekeeper_data.is_active': true,
                        },
                      },
                    ],
                  },
                },
              },
            },
            {match: {entity_type: 'player'}},
            // {term: {is_deactivate: false}},
          ],
        },
      },
    };

    // Location filter
    if (scoreKeeperFilters.location !== strings.worldTitleText) {
      scoreKeeperQuery.query.bool.must.push({
        multi_match: {
          query: `${scoreKeeperFilters.location.toLowerCase()}`,
          fields: ['city', 'country', 'state', 'state_abbr'],
        },
      });
    }

    if (scoreKeeperFilters.sport !== strings.allSport) {
      scoreKeeperQuery.query.bool.must[0].nested.query.bool.must.push({
        term: {
          'scorekeeper_data.sport.keyword': `${scoreKeeperFilters.sport.toLowerCase()}`,
        },
      });
    }
    // Search filter
    if (scoreKeeperFilters.searchText) {
      // simple search with full name
      scoreKeeperQuery.query.bool.must.push({
        match_phrase_prefix: {
          full_name: `*${scoreKeeperFilters.searchText.toLowerCase()}*`,
        },
      });
    }

    if (
      scoreKeeperFilters.availableTime &&
      scoreKeeperFilters.availableTime !== strings.filterAntTime &&
      scoreKeeperFilters?.fromDateTime &&
      scoreKeeperFilters?.toDateTime
    ) {
      const obj = {
        fromDate: scoreKeeperFilters.fromDateTime ?? '',
        toDate: scoreKeeperFilters.toDateTime ?? '',
      };
      const response = await getAvailableEntityIdList(obj);

      if (response.length > 0) {
        scoreKeeperQuery.query.bool.must_not = [
          {
            terms: {
              'user_id.keyword': [...response],
            },
          },
        ];
      }
    }

    getUserIndex(scoreKeeperQuery)
      .then((res) => {
        setSmallLoader(false);
        if (res.length > 0) {
          let result = [...res];
          if (
            scoreKeeperFilters?.availableTime &&
            scoreKeeperFilters?.fromDateTime &&
            scoreKeeperFilters?.toDateTime &&
            scoreKeeperFilters.sport
          ) {
            const filterArr = [];
            res.forEach((item) => {
              const sport = (item.scorekeeper_data ?? []).find(
                (ele) =>
                  ele.sport === scoreKeeperFilters.sport &&
                  (ele.setting?.availibility ?? Verbs.on) === Verbs.on,
              );
              if (sport) {
                filterArr.push(item);
              }
            });
            result = filterArr;
          }
          const modifiedResult = modifiedScoreKeeperElasticSearchResult(result);
          const fetchedData = [...scorekeepers, ...modifiedResult];

          setScorekeepers(fetchedData);
          setScorekeeperPageFrom(scorekeeperPageFrom + pageSize);
          stopFetchMore = true;
        }
      })
      .catch((e) => {
        setSmallLoader(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.messagee);
        }, 10);
      });
  }, [scorekeeperPageFrom, scorekeepers, scoreKeeperFilters]);

  const getTeamList = useCallback(async () => {
    setSmallLoader(true);
    const teamsQuery = {
      size: pageSize,
      from: teamsPageFrom,
      query: {
        bool: {
          must: [{match: {entity_type: 'team'}}],
        },
      },
    };

    if (teamFilters.location !== strings.worldTitleText) {
      teamsQuery.query.bool.must.push({
        multi_match: {
          query: `${teamFilters.location.toLowerCase()}`,
          fields: ['city', 'country', 'state', 'state_abbr'],
        },
      });
    }

    if (teamFilters.sport !== strings.allSport) {
      teamsQuery.query.bool.must.push({
        term: {
          'sport.keyword': {
            value: `${teamFilters?.sport?.toLowerCase()}`,
            case_insensitive: true,
          },
        },
      });
    }
    // team search filter
    if (teamFilters.searchText) {
      // Simple search with group name
      teamsQuery.query.bool.must.push({
        match_phrase_prefix: {
          group_name: `*${teamFilters.searchText.toLowerCase()}*`,
        },
      });
    }

    if (
      teamFilters.availableTime &&
      teamFilters.availableTime !== strings.filterAntTime &&
      teamFilters?.fromDateTime &&
      teamFilters?.toDateTime
    ) {
      const obj = {
        fromDate: teamFilters.fromDateTime ?? '',
        toDate: teamFilters.toDateTime ?? '',
      };
      const response = await getAvailableEntityIdList(obj);

      if (response.length > 0) {
        teamsQuery.query.bool.must_not = [
          {
            terms: {
              'group_id.keyword': [...response],
            },
          },
        ];
      }
    }

    getGroupIndex(teamsQuery)
      .then((res) => {
        setSmallLoader(false);
        if (res.length > 0) {
          let result = [...res];
          if (
            teamFilters?.availableTime &&
            teamFilters?.fromDateTime &&
            teamFilters?.toDateTime
          ) {
            const filterArr = res.filter(
              (item) => item.setting?.availibility === Verbs.on,
            );
            result = filterArr;
          }
          const modifiedResult = modifiedTeamElasticSearchResult(result);
          const fetchedData = [...teams, ...modifiedResult];

          setTeams(fetchedData);
          setTeamsPageFrom(teamsPageFrom + pageSize);
          stopFetchMore = true;
        }
      })
      .catch((e) => {
        setSmallLoader(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [teamsPageFrom, teams, teamFilters]);

  const getClubList = useCallback(() => {
    setSmallLoader(true);
    const clubsQuery = {
      size: pageSize,
      from: clubsPageFrom,
      query: {
        bool: {
          must: [{match: {entity_type: 'club'}}],
        },
      },
    };

    if (clubFilters.location !== strings.worldTitleText) {
      clubsQuery.query.bool.must.push({
        multi_match: {
          query: `${clubFilters.location.toLowerCase()}`,
          fields: ['city', 'country', 'state', 'state_abbr'],
        },
      });
    }

    if (clubFilters.sport !== strings.allSport) {
      clubsQuery.query.bool.must.push({
        term: {
          'sports.sport.keyword': {
            value: `${clubFilters?.sport?.toLowerCase()}`,
            case_insensitive: true,
          },
        },
      });
      clubsQuery.query.bool.must.push({
        term: {
          'sports.sport_type.keyword': {
            value: `${clubFilters?.sport_type?.toLowerCase()}`,
            case_insensitive: true,
          },
        },
      });
    }
    // club search filter
    if (clubFilters.searchText) {
      // simple search with group name
      clubsQuery.query.bool.must.push({
        match_phrase_prefix: {
          group_name: `*${clubFilters.searchText.toLowerCase()}*`,
        },
      });
    }
    getGroupIndex(clubsQuery)
      .then((res) => {
        setSmallLoader(false);
        if (res.length > 0) {
          const modifiedResult = modifiedClubElasticSearchResult(res);
          const fetchedData = [...clubs, ...modifiedResult];
          setClubs(fetchedData);
          setClubsPageFrom(clubsPageFrom + pageSize);
          stopFetchMore = true;
        }
      })
      .catch((e) => {
        setSmallLoader(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [clubsPageFrom, clubs, clubFilters]);

  const getCompletedGamesList = useCallback(() => {
    setSmallLoader(true);
    // Recent match query
    const completedGameQuery = {
      size: pageSize,
      from: completedGamePageFrom,
      query: {
        bool: {
          must: [
            {match: {status: 'accepted'}},
            {
              range: {
                start_datetime: {
                  lt: parseFloat(new Date().getTime() / 1000).toFixed(0),
                },
              },
            },
          ],
        },
      },
      sort: [{actual_enddatetime: 'desc'}],
    };
    // Location filter
    if (completedGameFilters.location !== strings.worldTitleText) {
      completedGameQuery.query.bool.must.push({
        multi_match: {
          query: completedGameFilters.location,
          fields: ['city', 'country', 'state', 'venue.address', 'state_abbr'],
        },
      });
    }
    // Sport filter
    if (completedGameFilters.sport !== strings.allSport) {
      completedGameQuery.query.bool.must.push({
        term: {
          'sport.keyword': {
            value: completedGameFilters.sport.toLowerCase(),
            case_insensitive: true,
          },
        },
      });
      completedGameQuery.query.bool.must.push({
        term: {
          'sport_type.keyword': {
            value: completedGameFilters.sport_type.toLowerCase(),
            case_insensitive: true,
          },
        },
      });
    }
    if (completedGameFilters.searchText) {
      completedGameQuery.query.bool.must.push({
        multi_match: {
          query: `*${completedGameFilters.searchText.toLowerCase()}*`,
          fields: ['home_team_name', 'away_team_name'],
          type: 'phrase_prefix',
        },
      });
    }
    getGameIndex(completedGameQuery).then((games) => {
      Utility.getGamesList(games).then((gamedata) => {
        setSmallLoader(false);
        if (games.length > 0) {
          const fetchedData = [...completedGame, ...gamedata];
          setCompletedGame(fetchedData);
          setCompletedGamePageFrom(completedGamePageFrom + pageSize);
          stopFetchMore = true;
        }
      });
    });
  }, [completedGamePageFrom, completedGame, completedGameFilters]);
  const getUpcomingGameList = useCallback(() => {
    setSmallLoader(true);
    // Upcoming match query
    const upcomingMatchQuery = {
      size: pageSize,
      from: upcomingGamePageFrom,
      query: {
        bool: {
          must: [
            {
              range: {
                start_datetime: {
                  gt: parseFloat(new Date().getTime() / 1000).toFixed(0),
                },
              },
            },
          ],
        },
      },
      sort: [{actual_enddatetime: 'desc'}],
    };
    if (upcomingGameFilters.location !== strings.worldTitleText) {
      upcomingMatchQuery.query.bool.must.push({
        multi_match: {
          query: upcomingGameFilters.location,
          fields: ['city', 'country', 'state', 'venue.address'],
        },
      });
    }
    if (upcomingGameFilters.sport !== strings.allSport) {
      upcomingMatchQuery.query.bool.must.push({
        term: {
          'sport.keyword': {
            value: upcomingGameFilters.sport.toLowerCase(),
            case_insensitive: true,
          },
        },
      });
      upcomingMatchQuery.query.bool.must.push({
        term: {
          'sport_type.keyword': {
            value: upcomingGameFilters.sport_type.toLowerCase(),
            case_insensitive: true,
          },
        },
      });
    }

    getGameIndex(upcomingMatchQuery).then((games) => {
      Utility.getGamesList(games).then((gamedata) => {
        setSmallLoader(false);
        if (games.length > 0) {
          const fetchedData = [...upcomingGame, ...gamedata];
          setUpcomingGame(fetchedData);
          setUpcomingGamePageFrom(upcomingGamePageFrom + pageSize);
          stopFetchMore = true;
        }
      });
    });
  }, [upcomingGamePageFrom, upcomingGame, upcomingGameFilters]);

  const getGamesForBookARefereeOrScoreKeeper = useCallback(
    (refereeObj, sportObject, isReferee) => {
      const gameListWithFilter = {
        query: {
          bool: {
            must: [
              {
                bool: {
                  should: [
                    {term: {'home_team.keyword': authContext.entity.uid}},
                    {term: {'away_team.keyword': authContext.entity.uid}},
                  ],
                },
              },
              {
                range: {
                  end_datetime: {
                    gt: parseFloat(new Date().getTime() / 1000).toFixed(0),
                  },
                },
              },
              {term: {'status.keyword': 'accepted'}},
            ],
          },
        },
        sort: [{start_datetime: 'asc'}],
      };

      if (isReferee) {
        gameListWithFilter.query.bool.must.push({
          term: {
            'challenge_referee.who_secure.responsible_team_id.keyword':
              authContext.entity.uid,
          },
        });
      } else {
        gameListWithFilter.query.bool.must.push({
          term: {
            'challenge_scorekeepers.who_secure.responsible_team_id.keyword':
              authContext.entity.uid,
          },
        });
      }
      getGameIndex(gameListWithFilter)
        .then((res) => {
          if (res.length > 0) {
            if (isReferee) {
              navigation.navigate('RefereeBookingDateAndTime', {
                settingObj: sportObject.setting,
                userData: refereeObj,
                showMatches: true,
                sportName: sportObject.sport,
              });
            } else {
              navigation.navigate('ScorekeeperBookingDateAndTime', {
                settingObj: sportObject.setting,
                userData: refereeObj,
                showMatches: true,
                sportName: sportObject.sport,
              });
            }
          } else {
            const msg = isReferee
              ? strings.bookRefereeMessage
              : strings.bookScorekeeperMessage;
            Alert.alert(strings.alertmessagetitle, msg);
          }
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [authContext.entity.uid, navigation],
  );

  const renderSeparator = () =>
    currentTab !== 2 && (
      <TCThinDivider
        marginTop={0}
        marginBottom={0}
        marginLeft={65}
        marginRight={15}
        backgroundColor={colors.grayBackgroundColor}
      />
    );
  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {smallLoader ? (
        <ActivityIndicator
          style={styles.loaderStyle}
          size="small"
          color={colors.blackColor}
        />
      ) : (
        <Text
          style={{
            fontFamily: fonts.RRegular,
            color: colors.grayColor,
            fontSize: 15,
          }}>
          {strings.noRecordFoundText}
        </Text>
      )}
    </View>
  );

  const handleTagPress = ({item}) => {
    const tempFilter = {...getFilterObject(currentSubTab)};
    Object.keys(tempFilter).forEach((key) => {
      if (key === Object.keys(item)[0]) {
        if (Object.keys(item)[0] === 'sport') {
          tempFilter.sport = strings.allSport;
          tempFilter.sport_name = strings.allSport;
          tempFilter.sport_type = strings.allSport;
          tempFilter.minFee = 0;
          tempFilter.maxFee = 0;
          delete tempFilter.fee;
        }
        if (Object.keys(item)[0] === 'location') {
          tempFilter.location = strings.worldTitleText;
          tempFilter.locationOption = locationType.WORLD;
          tempFilter.isSearchPlaceholder = true;
        }
        if (Object.keys(item)[0] === 'fee') {
          tempFilter.minFee = 0;
          tempFilter.maxFee = 0;
          delete tempFilter.fee;
        }
        if (Object.keys(item)[0] === 'availableTime') {
          delete tempFilter.availableTime;
          delete tempFilter.fromDateTime;
          delete tempFilter.toDateTime;
        }
      }
    });

    switch (currentSubTab) {
      case strings.playerTitle:
        setTimeout(() => {
          setPageFrom(0);
          setplayerList([]);
          setPlayerFilter({...tempFilter});
        }, 10);

        break;

      case strings.refereesTitle:
        setTimeout(() => {
          setRefereesPageFrom(0);
          setReferees([]);
          setrRefereeFilters({...tempFilter});
        }, 10);
        break;

      case strings.scorekeeperTitle:
        setTimeout(() => {
          setScorekeeperPageFrom(0);
          setScorekeepers([]);
          setScoreKeeperFilters({...tempFilter});
        }, 10);

        break;

      case strings.teamsTitleText:
        setTimeout(() => {
          setTeamsPageFrom(0);
          setTeams([]);
          setTeamFilters({...tempFilter});
        }, 10);

        break;

      case strings.clubsTitleText:
        setTimeout(() => {
          setClubsPageFrom(0);
          setClubs([]);
          setClubFilters({...tempFilter});
        }, 10);

        break;

      case strings.completedTitleText:
        if (currentTab === 2) {
          setTimeout(() => {
            setCompletedGamePageFrom(0);
            setCompletedGame([]);
            setCompletedGameFilters({...tempFilter});
          }, 10);
        } else if (currentTab === 3) {
          setTimeout(() => {
            setCompletedEventPageFrom(0);
            setCompletedEvents([]);
            setCompletedEventFilters({...tempFilter});
          }, 10);
        }
        break;

      case strings.upcomingTitleText:
        if (currentTab === 2) {
          setTimeout(() => {
            setUpcomingGamePageFrom(0);
            setUpcomingGame([]);
            setUpcomingGameFilters({...tempFilter});
          }, 10);
        } else if (currentTab === 3) {
          setTimeout(() => {
            setUpcomingEventPageFrom(0);
            setUpcomingEvents([]);
            setUpcomingEventFilters({...tempFilter});
          }, 10);
        }
        break;

      default:
        break;
    }
  };

  const getLocation = async () => {
    try {
      setloading(true);
      const currentLocation = await getGeocoordinatesWithPlaceName(Platform.OS);
      let loc = '';
      if (currentLocation.position) {
        loc =
          currentLocation.city?.charAt(0).toUpperCase() +
          currentLocation.city?.slice(1);
        setloading(false);
        setSettingPopup(false);
      }
      return loc;
    } catch (error) {
      setloading(false);
      setSettingPopup(false);
      if (error.message !== strings.userdeniedgps) {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      }
      return null;
    }
  };

  const onScrollHandler = () => {
    switch (currentTab) {
      case 0:
        if (currentSubTab === strings.generalText) {
          if (!stopFetchMore) {
            getGeneralList();
            stopFetchMore = true;
          }
        } else if (currentSubTab === strings.playerTitle) {
          if (!stopFetchMore) {
            getPlayersList();
            stopFetchMore = true;
          }
        } else if (currentSubTab === strings.refereesTitle) {
          if (!stopFetchMore) {
            getRefereesList();
            stopFetchMore = true;
          }
        } else if (currentSubTab === strings.scorekeeperTitle) {
          if (!stopFetchMore) {
            getScoreKeepersList();
            stopFetchMore = true;
          }
        }
        break;
      case 1:
        if (currentSubTab === strings.teamsTitleText) {
          if (!stopFetchMore) {
            getTeamList();
            stopFetchMore = true;
          }
        } else if (currentSubTab === strings.clubsTitleText) {
          if (!stopFetchMore) {
            getClubList();
            stopFetchMore = true;
          }
        }
        break;
      case 2:
        if (currentSubTab === strings.completedTitleText) {
          if (!stopFetchMore) {
            getCompletedGamesList();
            stopFetchMore = true;
          }
        } else if (currentSubTab === strings.upcomingTitleText) {
          if (!stopFetchMore) {
            getUpcomingGameList();
            stopFetchMore = true;
          }
        }
        break;

      case 3:
        if (currentSubTab === strings.completedTitleText) {
          if (!stopFetchMore && completedEvents.length >= pageSize) {
            getCompletedEventList();
            stopFetchMore = true;
          }
        } else if (
          currentSubTab === strings.upcomingTitleText &&
          upcomingEvents.length >= pageSize
        ) {
          if (!stopFetchMore) {
            getUpcomingEventList();
            stopFetchMore = true;
          }
        }
        break;

      default:
        break;
    }
  };

  const searchFilterFunction = useCallback(
    (text) => {
      switch (currentSubTab) {
        case strings.generalText:
          setGeneralList([]);
          setGeneralPageFrom(0);
          setGeneralFilter({
            ...generalFilter,
            searchText: text,
          });
          break;
        case strings.playerTitle:
          setplayerList([]);
          setPageFrom(0);
          setPlayerFilter({
            ...playerFilter,
            searchText: text,
          });
          break;
        case strings.refereesTitle:
          setReferees([]);
          setRefereesPageFrom(0);
          setrRefereeFilters({
            ...refereeFilters,
            searchText: text,
          });
          break;
        case strings.scorekeeperTitle:
          setScorekeepers([]);
          setScorekeeperPageFrom(0);
          setScoreKeeperFilters({
            ...scoreKeeperFilters,
            searchText: text,
          });
          break;
        case strings.teamsTitleText:
          setTeams([]);
          setTeamsPageFrom(0);
          setTeamFilters({
            ...teamFilters,
            searchText: text,
          });
          break;
        case strings.clubsTitleText:
          setClubs([]);
          setClubsPageFrom(0);
          setClubFilters({
            ...clubFilters,
            searchText: text,
          });
          break;
        case strings.completedTitleText:
          if (currentTab === 2) {
            setCompletedGame([]);
            setCompletedGamePageFrom(0);
            setCompletedGameFilters({
              ...completedGameFilters,
              searchText: text,
            });
          } else if (currentTab === 3) {
            setCompletedEvents([]);
            setCompletedEventPageFrom(0);
            setCompletedEventFilters({
              ...completedEventFilters,
              searchText: text,
            });
          }
          break;
        case strings.upcomingTitleText:
          if (currentTab === 2) {
            setUpcomingGame([]);
            setUpcomingGamePageFrom(0);
            setUpcomingGameFilters({
              ...upcomingGameFilters,
              searchText: text,
            });
          } else if (currentTab === 3) {
            setUpcomingEvents([]);
            setUpcomingEventPageFrom(0);
            setUpcomingEventFilters({
              ...upcomingEventFilters,
              searchText: text,
            });
          }
          break;
        default:
          break;
      }
    },
    [
      clubFilters,
      completedGameFilters,
      currentSubTab,
      generalFilter,
      playerFilter,
      refereeFilters,
      scoreKeeperFilters,
      teamFilters,
      upcomingGameFilters,
      completedEventFilters,
      upcomingEventFilters,
      currentTab,
    ],
  );

  const tabChangePress = useCallback(
    (changeTab) => {
      switch (changeTab) {
        case 0:
          setCurrentSubTab(strings.generalText);
          setGeneralList([]);
          setGeneralPageFrom(0);
          setGeneralFilter({
            ...generalFilter,
            searchText,
          });
          break;
        case 1:
          setCurrentSubTab(strings.teamsTitleText);
          setTeams([]);
          setTeamsPageFrom(0);
          setTeamFilters({
            ...teamFilters,
            searchText,
          });
          break;
        case 2:
          setCurrentSubTab(strings.completedTitleText);
          setCompletedGame([]);
          setCompletedGamePageFrom(0);
          setCompletedGameFilters({
            ...completedGameFilters,
            searchText,
          });
          break;
        case 3:
          setCurrentSubTab(strings.completedTitleText);
          setCompletedEventPageFrom(0);
          setUpcomingEventPageFrom(0);
          setUpcomingEvents([]);
          setCompletedEvents([]);
          setCompletedEventFilters({
            ...completedEventFilters,
            searchText,
          });
          setUpcomingEventFilters({
            ...upcomingEventFilters,
            searchText,
          });
          break;

        default:
          break;
      }

      setCurrentTab(changeTab);
    },
    [
      completedGameFilters,
      generalFilter,
      searchText,
      teamFilters,
      completedEventFilters,
      upcomingEventFilters,
    ],
  );
  const onPressSubTabs = useCallback(
    (item) => {
      setCurrentSubTab(item);
      switch (item) {
        case strings.generalText:
          setGeneralList([]);
          setGeneralPageFrom(0);
          setGeneralFilter({
            ...generalFilter,
            searchText,
          });
          break;
        case strings.playerTitle:
          setplayerList([]);
          setPageFrom(0);
          setPlayerFilter({
            ...playerFilter,
            searchText,
          });
          break;
        case strings.refereesTitle:
          setReferees([]);
          setRefereesPageFrom(0);
          setrRefereeFilters({
            ...refereeFilters,
            searchText,
          });
          break;
        case strings.scorekeeperTitle:
          setScorekeepers([]);
          setScorekeeperPageFrom(0);
          setScoreKeeperFilters({
            ...scoreKeeperFilters,
            searchText,
          });
          break;
        case strings.teamsTitleText:
          setTeams([]);
          setTeamsPageFrom(0);
          setTeamFilters({
            ...teamFilters,
            searchText,
          });
          break;
        case strings.clubsTitleText:
          setClubs([]);
          setClubsPageFrom(0);
          setClubFilters({
            ...clubFilters,
            searchText,
          });
          break;
        case strings.completedTitleText:
          if (currentTab === 2) {
            setCompletedGame([]);
            setCompletedGamePageFrom(0);
            setCompletedGameFilters({
              ...completedGameFilters,
              searchText,
            });
          } else if (currentTab === 3) {
            setCompletedEventPageFrom(0);
            setCompletedEvents([]);
            setCompletedEventFilters({
              ...completedEventFilters,
              searchText,
            });
          }
          break;
        case strings.upcomingTitleText:
          if (currentTab === 2) {
            setUpcomingGame([]);
            setUpcomingGamePageFrom(0);
            setUpcomingGameFilters({
              ...upcomingGameFilters,
              searchText,
            });
          } else if (currentTab === 3) {
            setUpcomingEventPageFrom(0);
            setUpcomingEvents([]);
            setUpcomingEventFilters({
              ...upcomingEventFilters,
              searchText,
            });
          }
          break;
        default:
          break;
      }
    },
    [
      clubFilters,
      completedGameFilters,
      generalFilter,
      playerFilter,
      refereeFilters,
      scoreKeeperFilters,
      searchText,
      teamFilters,
      upcomingGameFilters,
      completedEventFilters,
      upcomingEventFilters,
      currentTab,
    ],
  );

  const updateJoinedGroupDetails = (groupId) => {
    if (
      authContext.entity.role === Verbs.entityTypeTeam &&
      currentSubTab === strings.clubsTitleText
    ) {
      setJoinedGroups({
        teams: [],
        clubs: [...joinedGroups.clubs, groupId],
      });
    } else if (currentSubTab === strings.teamsTitleText) {
      setJoinedGroups({teams: [...joinedGroups.teams, groupId]});
    } else if (currentSubTab === strings.clubsTitleText) {
      setJoinedGroups({clubs: [...joinedGroups.clubs, groupId]});
    }
  };

  const userJoinGroup = (groupId) => {
    setloading(true);
    const params = {};
    joinTeam(params, groupId, authContext)
      .then((response) => {
        setShowJoinModal(false);

        setloading(false);

        if (response.payload.error_code === ErrorCodes.MEMBEREXISTERRORCODE) {
          Alert.alert(
            '',
            response.payload.user_message,
            [
              {
                text: strings.join,
                onPress: () => {
                  joinTeam({...params, is_confirm: true}, groupId, authContext)
                    .then(() => {
                      updateJoinedGroupDetails(groupId);
                    })
                    .catch((error) => {
                      setTimeout(() => {
                        Alert.alert(strings.alertmessagetitle, error.message);
                      }, 10);
                    });
                },
                style: 'destructive',
              },
              {
                text: strings.cancel,
                onPress: () => {},
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
        } else if (
          response.payload.error_code === ErrorCodes.MEMBERALREADYERRORCODE
        ) {
          Alert.alert(
            strings.alertmessagetitle,
            response.payload.user_message,
            [{text: strings.okTitleText}],
          );
        } else if (
          response.payload.error_code ===
          ErrorCodes.MEMBERALREADYINVITEERRORCODE
        ) {
          setloading(false);

          const messageStr = response.payload.user_message;
          setMessage(messageStr);
          setTimeout(() => {
            setActibityId(response.payload.data.activity_id);
            setloading(false);
            actionSheet.current.show();
          }, 50);
        } else if (
          response.payload.error_code ===
          ErrorCodes.MEMBERALREADYREQUESTERRORCODE
        ) {
          const messageStr = response.payload.user_message;
          setActibityId(response.payload.data.activity_id);
          setMessage(messageStr);
          setTimeout(() => {
            cancelReqActionSheet.current.show();
          }, 50);
        } else if (
          response.payload.error_code === ErrorCodes.MEMBERINVITEONLYERRORCODE
        ) {
          Alert.alert(strings.alertmessagetitle, response.payload.user_message);
          setShowJoinModal(false);
        } else if (response.payload.action === Verbs.joinVerb) {
          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage, [
            {text: strings.okTitleText},
          ]);
        } else if (response.payload.action === Verbs.requestVerb) {
          Alert.alert(strings.alertmessagetitle, strings.sendRequest, [
            {text: strings.okTitleText},
          ]);
        } else {
          updateJoinedGroupDetails(groupId);

          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage, [
            {text: strings.okTitleText},
          ]);
        }
      })
      .catch((error) => {
        setloading(false);
        setShowJoinModal(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message, [
            {text: strings.okTitleText},
          ]);
        }, 10);
      });
  };
  const groupInviteUser = async (dataObj) => {
    setloading(true);
    const params = {
      entity_type: authContext.entity.role,
      uid: authContext.entity.uid,
    };
    inviteUser(params, dataObj.user_id, authContext)
      .then(() => {
        setloading(false);

        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            format(strings.entityInvitedSuccessfully, `${dataObj.full_name}`),
          );
        }, 10);
      })
      .catch((error) => {
        setloading(false);

        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };
  const onAccept = (requestId) => {
    setloading(true);
    acceptRequest({}, requestId, authContext)
      .then(() => {
        setloading(false);
        setShowJoinModal(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage);
        }, 10);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onDecline = (requestId) => {
    setloading(true);

    declineRequest(requestId, authContext)
      .then(() => {
        setloading(false);
        setShowJoinModal(false);
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            strings.declinedRequestMessage,
          );
        }, 10);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const userLeaveGroup = (groupId) => {
    setloading(true);

    leaveTeam({}, groupId, authContext)
      .then(() => {
        const newList = joinedGroups.teams.filter((item) => item !== groupId);

        setloading(false);
        setJoinedGroups({...joinedGroups, teams: [...newList]});
        Alert.alert(
          '',
          format(strings.youHaveLeftTheteam, groupData.entity_type),
          [{text: strings.okTitleText}],
          {cancelable: false},
        );
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const renderTabContain = useMemo(
    () => (
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: colors.grayBackgroundColor,
          borderBottomWidth: 1,
          backgroundColor: '#FCFCFC',
        }}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            marginRight: currentSubTab !== PEOPLE_SUB_TAB_ITEMS[0] ? 40 : 0,
          }}>
          {currentTab === 0 &&
            PEOPLE_SUB_TAB_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item}
                style={{padding: 10}}
                onPress={() => onPressSubTabs(item, index)}>
                {/* onPress={() => setCurrentSubTab(item)}> */}
                <Text
                  style={{
                    color:
                      item === currentSubTab
                        ? colors.themeColor
                        : colors.lightBlackColor,
                    fontFamily:
                      item === currentSubTab ? fonts.RBold : fonts.RRegular,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          {currentTab === 1 &&
            GROUP_SUB_TAB_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item}
                style={{padding: 10}}
                // onPress={() => setCurrentSubTab(item)}>
                onPress={() => onPressSubTabs(item, index)}>
                <Text
                  style={{
                    color:
                      item === currentSubTab
                        ? colors.themeColor
                        : colors.lightBlackColor,
                    fontFamily:
                      item === currentSubTab ? fonts.RBold : fonts.RRegular,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          {currentTab === 2 &&
            GAMES_SUB_TAB_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item}
                style={{padding: 10}}
                onPress={() => onPressSubTabs(item, index)}>
                <Text
                  style={{
                    color:
                      item === currentSubTab
                        ? colors.themeColor
                        : colors.lightBlackColor,
                    fontFamily:
                      item === currentSubTab ? fonts.RBold : fonts.RRegular,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          {currentTab === 3 &&
            GAMES_SUB_TAB_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item}
                style={{padding: 10}}
                onPress={() => onPressSubTabs(item, index)}>
                <Text
                  style={{
                    color:
                      item === currentSubTab
                        ? colors.themeColor
                        : colors.lightBlackColor,
                    fontFamily:
                      item === currentSubTab ? fonts.RBold : fonts.RRegular,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
        {currentSubTab !== strings.generalText && (
          <TouchableWithoutFeedback
            onPress={() => {
              setSettingPopup(true);
            }}>
            <Image source={images.filterIcon} style={styles.settingImage} />
          </TouchableWithoutFeedback>
        )}
      </View>
    ),
    [currentSubTab, currentTab, onPressSubTabs],
  );

  const renderItem = useCallback(
    ({item}) => (
      <View>
        {currentTab === 0 && (
          <View
            style={[
              styles.topViewContainer,
              {
                height:
                  (currentSubTab === strings.refereesTitle &&
                    refereeFilters.sport !== strings.allSport) ||
                  (currentSubTab === strings.scorekeeperTitle &&
                    scoreKeeperFilters.sport !== strings.allSport) ||
                  (currentSubTab === strings.playerTitle &&
                    playerFilter.sport !== strings.allSport)
                    ? 96
                    : 75,
              },
            ]}>
            <View style={[styles.separator, {flex: 1}]}>
              <TCPlayerView
                data={item}
                authContext={authContext}
                showStar={
                  (currentSubTab === strings.refereesTitle &&
                    refereeFilters.sport !== strings.allSport &&
                    true) ||
                  (currentSubTab === strings.scorekeeperTitle &&
                    scoreKeeperFilters.sport !== strings.allSport &&
                    true)
                }
                currentsubTabEntity={getEntityType()}
                showLevel={
                  currentSubTab === strings.playerTitle &&
                  playerFilter.sport !== strings.allSport &&
                  true
                }
                showSport={currentSubTab !== strings.generalText}
                subTab={currentSubTab}
                isUniversalSearch={true}
                sportFilter={
                  (currentSubTab === strings.playerTitle && playerFilter) ||
                  (currentSubTab === strings.refereesTitle && refereeFilters) ||
                  (currentSubTab === strings.scorekeeperTitle &&
                    scoreKeeperFilters)
                }
                onPress={(sportsObj) => {
                  handleEntityPress(item);
                  if (currentSubTab === strings.generalText) {
                    navigation.navigate('HomeStack', {
                      screen: 'HomeScreen',
                      params: {
                        uid: [
                          Verbs.entityTypeUser,
                          Verbs.entityTypePlayer,
                        ]?.includes(item?.entity_type)
                          ? item?.user_id
                          : item?.group_id,
                        role: [
                          Verbs.entityTypeUser,
                          Verbs.entityTypePlayer,
                        ]?.includes(item?.entity_type)
                          ? Verbs.entityTypeUser
                          : item.entity_type,
                        backButtonVisible: true,
                        menuBtnVisible: false,
                        comeFrom: 'EntitySearchScreen',
                        backScreen: 'EntitySearchScreen',
                        parentStack: route.params?.parentStack,
                        screen: route.params?.screen ?? '',
                      },
                    });
                  } else if (sportsObj.length > 1) {
                    const data = {
                      sports: sportsObj,
                      uid: item?.user_id,
                      entityType: item?.entity_type,
                      userObj: {...item},
                    };
                    setPlayerDetail(data);
                    setPlayerDetailPopup(true);
                  } else {
                    navigation.navigate('HomeStack', {
                      screen: 'SportActivityHome',
                      params: {
                        sport: sportsObj[0]?.sport,
                        sportType:
                          sportsObj[0]?.sport_type ?? Verbs.sportTypeSingle,
                        uid: item?.user_id,
                        entityType: sportsObj[0]?.type,
                        showPreview: true,
                        backScreen: 'UniversalSearchStack',
                        backScreenParams: {
                          screen: 'EntitySearchScreen',
                        },
                      },
                    });
                  }
                }}
                onPressChallengButton={(dataObj, sportsObj) => {
                  setChallengePopup(true);
                  setSettingObject(sportsObj.setting);
                  setCurrentUserData(dataObj);
                }}
                onPressBookButton={(refereeObj, sportObject) => {
                  if (currentSubTab === strings.refereesTitle) {
                    if (
                      sportObject.setting?.referee_availibility &&
                      sportObject.setting?.game_fee &&
                      sportObject.setting?.refund_policy &&
                      sportObject.setting?.available_area
                    ) {
                      const isReferee = true;
                      getGamesForBookARefereeOrScoreKeeper(
                        refereeObj,
                        sportObject,
                        isReferee,
                      );
                    } else {
                      Alert.alert(strings.refereeSettingNotConfigureValidation);
                    }
                  } else if (currentSubTab === strings.scorekeeperTitle) {
                    if (
                      sportObject.setting?.scorekeeper_availibility &&
                      sportObject.setting?.game_fee &&
                      sportObject.setting?.refund_policy &&
                      sportObject.setting?.available_area
                    ) {
                      const isReferee = false;
                      getGamesForBookARefereeOrScoreKeeper(
                        refereeObj,
                        sportObject,
                        isReferee,
                      );
                    } else {
                      Alert.alert(strings.scorekeeperSetiingNotValidation);
                    }
                  }
                }}
                onPressInviteButton={(dataObj) => {
                  groupInviteUser(dataObj);
                }}
              />
            </View>
          </View>
        )}

        {currentTab === 1 && (
          <View
            style={[
              styles.topViewContainer,

              {height: currentSubTab === strings.teamsTitleText ? 96 : 75},
            ]}>
            <View style={[styles.separator, {flex: 1}]}>
              <TCTeamSearchView
                data={item}
                authContext={authContext}
                isClub={currentSubTab !== strings.teamsTitleText}
                showStar={currentSubTab === strings.teamsTitleText}
                // showLevelOnly={currentSubTab === strings.teamsTitleText}
                sportFilter={
                  (currentSubTab === strings.teamsTitleText && teamFilters) ||
                  (currentSubTab === strings.clubsTitleText && clubFilters)
                }
                onPress={() => {
                  handleEntityPress(item);
                  navigation.navigate('HomeStack', {
                    screen: 'HomeScreen',
                    params: {
                      uid: [
                        Verbs.entityTypeUser,
                        Verbs.entityTypePlayer,
                      ]?.includes(item?.entity_type)
                        ? item?.user_id
                        : item?.group_id,
                      role: [
                        Verbs.entityTypeUser,
                        Verbs.entityTypePlayer,
                      ]?.includes(item?.entity_type)
                        ? Verbs.entityTypeUser
                        : item.entity_type,
                      backButtonVisible: true,
                      menuBtnVisible: false,
                      comeFrom: 'EntitySearchScreen',
                      backScreen: 'EntitySearchScreen',
                      parentStack: route.params?.parentStack,
                      screen: route.params?.screen,
                    },
                  });
                }}
                onPressChallengeButton={(dataObj) => {
                  setChallengePopup(true);
                  setSettingObject(dataObj.setting);
                  setCurrentUserData(dataObj);
                }}
                onPressJoinButton={() => {
                  setShowJoinModal(true);

                  setGroupData(item);
                }}
                joinedGroups={joinedGroups}
                onPressMemberButton={userLeaveGroup}
              />
            </View>
          </View>
        )}
        {currentTab === 2 && currentSubTab === strings.upcomingTitleText && (
          <View style={{marginBottom: 15}}>
            <TCUpcomingMatchCard
              data={item}
              cardWidth={'92%'}
              onPress={() => {
                const gameHome = getGameHomeScreen(item?.sport);
                if (item?.game_id) {
                  navigation.navigate(gameHome, {
                    gameId: item?.game_id,
                  });
                } else {
                  Alert.alert(strings.gameIDNotExitsTitle);
                }
              }}
            />
          </View>
        )}
        {currentTab === 2 && currentSubTab === strings.completedTitleText && (
          <View style={{marginBottom: 15}}>
            <TCRecentMatchCard
              data={item}
              cardWidth={'92%'}
              onPress={() => {
                const gameHome = getGameHomeScreen(item?.sport);
                if (item?.game_id) {
                  navigation.navigate(gameHome, {
                    gameId: item?.game_id,
                  });
                } else {
                  Alert.alert(strings.gameIDNotExitsTitle);
                }
              }}
            />
          </View>
        )}
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      currentSubTab,
      currentTab,
      getGameHomeScreen,
      navigation,
      playerFilter,
      refereeFilters,
      scoreKeeperFilters,
    ],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  useEffect(() => {
    if (route.params?.searchData) {
      setSearchText(route.params.searchData);
      searchFilterFunction(route.params.searchData);
    }
  }, [route.params?.searchData]);

  const handleEntityPress = async (obj = {}) => {
    const localSearchData = await Utility.getLocalSearchData();
    const isEntityAlreadyRegistered = Object.keys(localSearchData).includes(
      authContext.entity.uid,
    );
    const recentSearchData = {...localSearchData};

    if (!isEntityAlreadyRegistered) {
      recentSearchData[authContext.entity.uid] = [];
    }

    if (recentSearchData[authContext.entity.uid].length > 0) {
      const entityId = obj.user_id ?? obj.group_id ?? obj.owner_id;
      const data = recentSearchData[authContext.entity.uid].find(
        (item) =>
          entityId === item.user_id ||
          entityId === item.group_id ||
          entityId === item.owner_id,
      );
      if (!data) {
        recentSearchData[authContext.entity.uid] = [
          ...recentSearchData[authContext.entity.uid],
          obj,
        ];
      }
    } else {
      recentSearchData[authContext.entity.uid] = [obj];
    }
    Utility.setSearchDataToLocal(recentSearchData);
  };

  const getEntityType = () => {
    if (currentSubTab === strings.playerTitle) {
      return Verbs.entityTypePlayer;
    }

    if (currentSubTab === strings.refereesTitle) {
      return Verbs.entityTypeReferee;
    }

    if (currentSubTab === strings.scorekeeperTitle) {
      return Verbs.entityTypeScorekeeper;
    }
    return Verbs.entityTypePlayer;
  };

  const getEventList = () => {
    if (currentSubTab === strings.completedTitleText) {
      return completedEvents;
    }
    if (currentSubTab === strings.upcomingTitleText) {
      return upcomingEvents;
    }
    return [];
  };

  const getFilterObject = (item) => {
    switch (item) {
      case strings.generalText:
        return generalFilter;

      case strings.playerTitle:
        return playerFilter;

      case strings.refereesTitle:
        return refereeFilters;

      case strings.scorekeeperTitle:
        return scoreKeeperFilters;

      case strings.teamsTitleText:
        return teamFilters;

      case strings.clubsTitleText:
        return clubFilters;

      case strings.completedTitleText:
        if (currentTab === 2) {
          return completedGameFilters;
        }
        if (currentTab === 3) {
          return completedEventFilters;
        }
        return {};

      case strings.upcomingTitleText:
        if (currentTab === 2) {
          return upcomingGameFilters;
        }
        if (currentTab === 3) {
          return upcomingEventFilters;
        }
        return {};

      default:
        return {};
    }
  };

  const handleApplySearch = async (filterData) => {
    setloading(false);
    let tempFilter = {};
    tempFilter = {...filterData};

    // setSettingPopup(false);
    setPageFrom(0);
    if (filterData.locationOption === locationType.WORLD) {
      // setLocation(strings.worldTitleText);
      tempFilter.location = strings.worldTitleText;
      setSettingPopup(false);
    } else if (filterData.locationOption === locationType.HOME_CITY) {
      tempFilter.location =
        authContext?.entity?.obj?.city.charAt(0).toUpperCase() +
        authContext?.entity?.obj?.city.slice(1);
      setSettingPopup(false);
    } else if (filterData.locationOption === locationType.CURRENT_LOCATION) {
      const loc = await getLocation();
      tempFilter.location = loc;
    } else if (filterData.locationOption === locationType.SEARCH_CITY) {
      // setLocation(filterData.searchCityLoc);
      tempFilter.location = filterData.searchCityLoc;
      setSettingPopup(false);
    }
    switch (currentSubTab) {
      case strings.generalText: {
        setGeneralList([]);
        setGeneralPageFrom(0);
        setGeneralFilter({
          ...tempFilter,
        });
        break;
      }
      case strings.playerTitle: {
        setplayerList([]);
        setPageFrom(0);
        setPlayerFilter({
          ...tempFilter,
        });
        break;
      }
      case strings.refereesTitle: {
        setReferees([]);
        setRefereesPageFrom(0);
        setrRefereeFilters({
          ...tempFilter,
        });
        break;
      }
      case strings.scorekeeperTitle: {
        setScorekeepers([]);
        setScorekeeperPageFrom(0);
        setScoreKeeperFilters({
          ...tempFilter,
        });
        break;
      }
      case strings.teamsTitleText: {
        setTeams([]);
        setTeamsPageFrom(0);
        setTeamFilters({
          ...tempFilter,
        });

        break;
      }
      case strings.clubsTitleText: {
        setClubs([]);
        setClubsPageFrom(0);
        setClubFilters({
          ...tempFilter,
        });
        break;
      }
      case strings.completedTitleText: {
        if (currentTab === 2) {
          setCompletedGame([]);
          setCompletedGamePageFrom(0);
          setCompletedGameFilters({
            ...tempFilter,
          });
        } else if (currentTab === 3) {
          setCompletedEvents([]);
          setCompletedEventPageFrom(0);
          setCompletedEventFilters({
            ...tempFilter,
          });
          getCompletedEventList();
        }
        break;
      }
      case strings.upcomingTitleText: {
        if (currentTab === 2) {
          setUpcomingGame([]);
          setUpcomingGamePageFrom(0);
          setUpcomingGameFilters({
            ...tempFilter,
          });
        } else if (currentTab === 3) {
          setUpcomingEvents([]);
          setUpcomingEventPageFrom(0);
          setUpcomingEventFilters({
            ...tempFilter,
          });
        }
        break;
      }
      default:
        break;
    }
  };

  const getList = () => {
    if (currentTab === 3) return [];

    switch (currentSubTab) {
      case strings.generalText:
        return generalList;

      case strings.playerTitle:
        return playerList;

      case strings.refereesTitle:
        return referees;

      case strings.scorekeeperTitle:
        return scorekeepers;

      case strings.teamsTitleText:
        return teams;

      case strings.clubsTitleText:
        return clubs;

      case strings.completedTitleText:
        return completedGame;

      case strings.upcomingTitleText:
        return upcomingGame;

      default:
        return [];
    }
  };

  const getSports = () => {
    let entityType = '';
    switch (currentSubTab) {
      case strings.playerTitle:
      case strings.completedTitleText:
      case strings.upcomingTitleText:
        entityType = Verbs.entityTypePlayer;
        break;

      case strings.refereesTitle:
        entityType = Verbs.entityTypeReferee;
        break;

      case strings.scorekeeperTitle:
        entityType = Verbs.entityTypeScorekeeper;
        break;

      case strings.teamsTitleText:
        entityType = Verbs.entityTypeTeam;
        break;

      case strings.clubsTitleText:
        entityType = Verbs.entityTypeClub;
        break;

      default:
        break;
    }
    return [...defaultSport, ...getSportList(authContext.sports, entityType)];
  };

  const getFeeTitle = () => {
    if (currentSubTab === strings.refereesTitle) {
      return strings.refereeFee;
    }

    if (currentSubTab === strings.scorekeeperTitle) {
      return strings.scorekeeperFee;
    }

    if (
      currentTab === 3 &&
      (currentSubTab === strings.upcomingTitleText ||
        currentSubTab === strings.completedTitleText)
    ) {
      return strings.eventFeeTitle;
    }

    return strings.matchFee;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.searchText}
        leftIcon={images.backArrow}
        leftIconPress={() => handleBackPress()}
      />
      <ActivityLoader visible={loading} />
      <View style={styles.floatingInput}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={colors.userPostTimeColor}
            style={styles.textInputStyle}
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              clearTimeout(timeout);
              timeout = setTimeout(() => {
                searchFilterFunction(text);
              }, 300);
            }}
            placeholder={strings.searchHereText}
            ref={searchBoxRef}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
                searchFilterFunction('');
              }}>
              <Image
                source={images.closeRound}
                style={{height: 15, width: 15}}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={{backgroundColor: '#FFFFFF'}}>
        <CustomScrollTabs
          tabsItem={TAB_ITEMS}
          setCurrentTab={tabChangePress}
          currentTab={currentTab}
        />
      </View>
      {renderTabContain}
      <View style={{backgroundColor: '#FCFCFC'}}>
        <TCTagsFilter
          dataSource={Utility.getFiltersOpetions(
            getFilterObject(currentSubTab),
          )}
          filter={getFilterObject(currentSubTab)}
          onTagCancelPress={handleTagPress}
          authContext={authContext}
        />
      </View>

      {currentTab === 3 ? (
        <View style={{flex: 1}}>
          <EventList
            list={getEventList()}
            isUpcoming={currentSubTab === strings.upcomingTitleText}
            eventType={currentSubTab}
            onItemPress={(item) => {
              navigation.navigate('ScheduleStack', {
                screen: 'EventScreen',
                params: {
                  data: item,
                  gameData: item,
                  comeFrom: 'UniversalSearchStack',
                  screen: 'EntitySearchScreen',
                },
              });
            }}
            onScrollHandler={onScrollHandler}
            onScrollBeginDrag={() => {
              stopFetchMore = false;
            }}
            filters={
              currentSubTab === strings.upcomingTitleText
                ? upcomingEventFilters
                : completedEventFilters
            }
            loading={smallLoader}
          />
        </View>
      ) : (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={getList()}
          ItemSeparatorComponent={renderSeparator}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={{
            backgroundColor: colors.whiteColor,
            flex: 1,
            paddingHorizontal: 15,
            paddingBottom: 15,
            marginTop: 0,
          }}
          onEndReachedThreshold={0.01}
          onScrollEndDrag={onScrollHandler}
          onScrollBeginDrag={() => {
            stopFetchMore = false;
          }}
          ListEmptyComponent={listEmptyComponent}
          // ListFooterComponent={() => <View style={{height: 15}} />}
          ListFooterComponent={() => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {!stopFetchMore && (
                <ActivityIndicator
                  style={styles.loaderStyle}
                  size="small"
                  color={colors.blackColor}
                />
              )}
            </View>
          )}
        />
      )}

      <ActionSheet
        ref={actionSheet}
        title={message}
        options={[strings.acceptInvite, strings.declineInvite, strings.cancel]}
        cancelButtonIndex={3}
        onPress={(index) => {
          if (index === 0) {
            onAccept(activityId);
          } else if (index === 1) {
            onDecline(activityId);
          }
        }}
      />
      <ActionSheet
        ref={cancelReqActionSheet}
        title={message}
        options={[strings.cancelRequestTitle, strings.cancel]}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            onDecline(activityId);
          }
        }}
      />
      <SearchModal
        sports={getSports()}
        fType={
          currentTab === 3
            ? filterType.UPCOMINGMATCHES
            : filterType.LOOKINGFORTEAMCLUB
        }
        showSportOption
        showFeeOption
        filterObject={getFilterObject(currentSubTab)}
        isVisible={settingPopup}
        onPressApply={handleApplySearch}
        onPressCancel={() => {
          setSettingPopup(false);
        }}
        isEventFilter={currentTab === 3}
        showTimeComponent
        selectedTab={currentSubTab}
        feeTitle={getFeeTitle()}
      />

      <CustomModalWrapper
        isVisible={challengePopup}
        closeModal={() => setChallengePopup(false)}
        containerStyle={{paddingHorizontal: 15}}
        externalSnapPoints={snapPoints}
        modalType={ModalTypes.style2}>
        <View
          onLayout={(event) => {
            const contentHeight = event.nativeEvent.layout.height + 80;

            setSnapPoints([contentHeight, contentHeight]);
          }}>
          <TouchableOpacity
            style={[
              styles.backgroundView,
              {marginBottom: 15},
              selectedChallengeOption === 0
                ? {backgroundColor: colors.themeColor}
                : {},
            ]}
            onPress={() => {
              setSelectedChallengeOption(0);
              const obj = settingObject;
              if (obj?.availibility === Verbs.on) {
                if (
                  currentUserData.sport_type === Verbs.doubleSport &&
                  (!('player_deactivated' in currentUserData) ||
                    !currentUserData?.player_deactivated) &&
                  (!('player_leaved' in currentUserData) ||
                    !currentUserData?.player_leaved) &&
                  (!('player_leaved' in myGroupDetail) ||
                    !myGroupDetail?.player_leaved)
                ) {
                  if (
                    (obj?.game_duration || obj?.score_rules) &&
                    obj?.availibility &&
                    obj?.special_rules !== undefined &&
                    obj?.general_rules !== undefined &&
                    obj?.responsible_for_referee &&
                    obj?.responsible_for_scorekeeper &&
                    obj?.game_fee &&
                    obj?.venue &&
                    obj?.refund_policy &&
                    obj?.home_away &&
                    obj?.game_type
                  ) {
                    setChallengePopup(false);

                    navigation.navigate('HomeStack', {
                      screen: 'ChallengeScreen',
                      params: {
                        setting: obj,
                        sportName: currentUserData?.sport,
                        sportType: currentUserData?.sport_type,
                        groupObj: currentUserData,
                      },
                    });
                  } else {
                    Alert.alert(strings.teamHaveNoCompletedSetting);
                  }
                } else if (currentUserData.sport_type === Verbs.doubleSport) {
                  if (
                    'player_deactivated' in currentUserData &&
                    currentUserData?.player_deactivated
                  ) {
                    Alert.alert(strings.playerDeactivatedSport);
                  } else if (
                    'player_leaved' in currentUserData &&
                    currentUserData?.player_leaved
                  ) {
                    Alert.alert(
                      format(
                        strings.groupHaveNo2Player,
                        currentUserData?.group_name,
                      ),
                    );
                  } else if (
                    'player_leaved' in myGroupDetail &&
                    myGroupDetail?.player_leaved
                  ) {
                    Alert.alert(strings.youHaveNo2Player);
                  }
                } else {
                  setChallengePopup(false);

                  navigation.navigate('HomeStack', {
                    screen: 'ChallengeScreen',
                    params: {
                      setting: obj,
                      sportName: obj?.sport,
                      sportType: obj?.sport_type,
                      groupObj: currentUserData,
                    },
                  });
                }
              } else {
                Alert.alert(strings.oppTeamNotForChallenge);
              }
            }}>
            <Text
              style={[
                styles.curruentLocationText,
                selectedChallengeOption === 0 ? {color: colors.whiteColor} : {},
              ]}>
              {strings.continueToChallenge.toUpperCase()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.backgroundView,
              selectedChallengeOption === 0
                ? {backgroundColor: colors.themeColor}
                : {},
            ]}
            onPress={() => {
              setSelectedChallengeOption(1);

              const obj = mySettingObject;
              if (obj?.availibility === Verbs.on) {
                if (
                  myGroupDetail.sport_type === Verbs.doubleSport &&
                  (!('player_deactivated' in myGroupDetail) ||
                    !myGroupDetail?.player_deactivated) &&
                  (!('player_leaved' in currentUserData) ||
                    !currentUserData?.player_leaved) &&
                  (!('player_leaved' in myGroupDetail) ||
                    !myGroupDetail?.player_leaved)
                ) {
                  if (
                    (obj?.game_duration || obj?.score_rules) &&
                    obj?.availibility &&
                    obj?.special_rules !== undefined &&
                    obj?.general_rules !== undefined &&
                    obj?.responsible_for_referee &&
                    obj?.responsible_for_scorekeeper &&
                    obj?.game_fee &&
                    obj?.venue &&
                    obj?.refund_policy &&
                    obj?.home_away &&
                    obj?.game_type
                  ) {
                    setChallengePopup(false);
                    if (myGroupDetail.is_pause === true) {
                      Alert.alert(
                        format(strings.groupPaused, myGroupDetail.group_name),
                      );
                    } else {
                      navigation.navigate('HomeStack', {
                        screen: 'InviteChallengeScreen',
                        params: {
                          setting: obj,
                          sportName: currentUserData?.sport,
                          sportType: currentUserData?.sport_type,
                          groupObj: currentUserData,
                        },
                      });
                    }
                  } else {
                    setTimeout(() => {
                      Alert.alert(
                        strings.completeSettingBeforeInvite,
                        '',
                        [
                          {text: strings.cancel},
                          {
                            text: strings.okTitleText,
                            onPress: () => {
                              if (currentUserData?.is_pause === true) {
                                Alert.alert(strings.yourTeamPaused);
                              } else {
                                navigation.navigate('AccountStack', {
                                  screen: 'ManageChallengeScreen',
                                  params: {
                                    groupObj: currentUserData,
                                    sportName: currentUserData.sport,
                                    sportType: currentUserData?.sport_type,
                                  },
                                });
                              }
                            },
                          },
                        ],
                        {cancelable: false},
                      );
                    }, 1000);
                  }
                } else if (myGroupDetail.sport_type === Verbs.doubleSport) {
                  if (
                    'player_deactivated' in myGroupDetail &&
                    myGroupDetail?.player_deactivated
                  ) {
                    Alert.alert(strings.playerDeactivatedSport);
                  } else if (
                    'player_leaved' in currentUserData ||
                    currentUserData?.player_leaved
                  ) {
                    Alert.alert(
                      format(
                        strings.groupHaveNo2Player,
                        currentUserData?.group_name,
                      ),
                    );
                  } else if (
                    'player_leaved' in myGroupDetail ||
                    myGroupDetail?.player_leaved
                  ) {
                    Alert.alert(strings.youHaveNo2Player);
                  }
                } else {
                  setChallengePopup(false);
                  if (myGroupDetail.is_pause === true) {
                    Alert.alert(strings.yourTeamPaused);
                  } else {
                    setChallengePopup(false);
                    navigation.navigate('HomeStack', {
                      screen: 'InviteChallengeScreen',
                      params: {
                        setting: obj,
                        sportName: currentUserData?.sport,
                        sportType: currentUserData?.sport_type,
                        groupObj: currentUserData,
                      },
                    });
                  }
                }
              } else {
                Alert.alert(strings.availibilityOff);
              }
            }}>
            <Text
              style={[
                styles.curruentLocationText,
                selectedChallengeOption === 0 ? {color: colors.whiteColor} : {},
              ]}>
              {strings.inviteToChallenge.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </CustomModalWrapper>

      <CustomModalWrapper
        isVisible={playerDetailPopup}
        closeModal={() => {
          setPlayerDetailPopup(false);
        }}
        modalType={ModalTypes.style2}
        containerStyle={{paddingBottom: 0, paddingHorizontal: 15}}
        externalSnapPoints={snapPoints}>
        <View
          onLayout={(event) => {
            let contentHeight = event.nativeEvent.layout.height + 80;
            if (contentHeight > Dimensions.get('window').height) {
              contentHeight = Dimensions.get('window').height - 50;
            }
            setSnapPoints([
              // '50%',
              contentHeight,
              contentHeight,
              Dimensions.get('window').height - 80,
            ]);
          }}>
          <FlatList
            data={playerDetail?.sports}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <SportView
                item={item}
                imageBaseUrl={imageBaseUrl}
                onPress={() => {
                  setPlayerDetailPopup(false);
                  navigation.navigate('HomeStack', {
                    screen: 'SportActivityHome',
                    params: {
                      sport: item.sport,
                      sportType: item?.sport_type,
                      uid: playerDetail.uid,
                      entityType: item.entity_type,
                      showPreview: true,
                      backScreen: 'UniversalSearchStack',
                      backScreenParams: {
                        screen: 'EntitySearchScreen',
                      },
                    },
                  });
                }}
                // showChallengeButton={checkChallengeBtnVisibility(item)}
                onPressChallenge={() => {
                  setPlayerDetailPopup(false);
                  setSettingObject(item.setting);
                  setCurrentUserData(playerDetail?.userObj);
                  setChallengePopup(true);
                }}
                // showBookButton={checkBookBtnVisibility(item)}
                onPressBook={() => {
                  if (currentSubTab === strings.refereesTitle) {
                    if (
                      item.setting?.referee_availibility &&
                      item.setting?.game_fee &&
                      item.setting?.refund_policy &&
                      item.setting?.available_area
                    ) {
                      const isReferee = true;
                      getGamesForBookARefereeOrScoreKeeper(
                        playerDetail?.userObj,
                        item,
                        isReferee,
                      );
                    } else {
                      Alert.alert(strings.refereeSettingNotConfigureValidation);
                    }
                  } else if (currentSubTab === strings.scorekeeperTitle) {
                    if (
                      item.setting?.scorekeeper_availibility &&
                      item.setting?.game_fee &&
                      item.setting?.refund_policy &&
                      item.setting?.available_area
                    ) {
                      const isReferee = false;
                      getGamesForBookARefereeOrScoreKeeper(
                        playerDetail?.userObj,
                        item,
                        isReferee,
                      );
                    } else {
                      Alert.alert(strings.scorekeeperSetiingNotValidation);
                    }
                  }
                }}
                showUnavailable={
                  currentSubTab === strings.playerTitle &&
                  item.sport_type === Verbs.singleSport &&
                  item.setting?.availibility === Verbs.off
                }
                buttonState={getButtonStateForPeople({
                  entityId: playerDetail.uid,
                  entityType: getEntityType(),
                  sportObj: item,
                  authContext,
                })}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </CustomModalWrapper>

      <JoinButtonModal
        isVisible={showJoinModal}
        closeModal={() => setShowJoinModal(false)}
        currentUserData={groupData}
        onJoinPress={() => userJoinGroup(groupData.group_id)}
        onAcceptPress={() => userJoinGroup(groupData.group_id)}
        isInvited={isInvited}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  topViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 75,
  },
  settingImage: {
    height: 25,
    width: 25,
    resizeMode: 'cover',
    alignSelf: 'center',
    position: 'absolute',
    right: 10,
  },

  separator: {
    borderRightWidth: 0,
    borderColor: colors.whiteColor,
  },
  backgroundView: {
    borderRadius: 5,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.textFieldBackground,
  },
  curruentLocationText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  loaderStyle: {
    height: 25,
    width: 25,
    marginBottom: 10,
    marginTop: 5,
  },
  // ========//
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: colors.inputBgOpacityColor,
    height: 45,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    padding: 0,
  },
  floatingInput: {
    alignSelf: 'center',

    width: '90%',
    marginTop: 20,
  },
});
