/* eslint-disable no-confusing-arrow */
/* eslint-disable array-callback-return */
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
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import LinearGradient from 'react-native-linear-gradient';
import {format} from 'react-string-format';
import AuthContext from '../auth/context';
import {getStorage} from '../utils';

import colors from '../Constants/Colors';
import Verbs from '../Constants/Verbs';
import fonts from '../Constants/Fonts';
import {getGroupIndex, getUserIndex, getGameIndex} from '../api/elasticSearch';
import images from '../Constants/ImagePath';
import {strings} from '../../Localization/translation';
import * as Utility from '../utils';
import TCUpcomingMatchCard from '../components/TCUpcomingMatchCard';
import TCPlayerView from '../components/TCPlayerView';
import TCThinDivider from '../components/TCThinDivider';
import TCTeamSearchView from '../components/TCTeamSearchView';
import TCRecentMatchCard from '../components/TCRecentMatchCard';
import TCTagsFilter from '../components/TCTagsFilter';
import ActivityLoader from '../components/loader/ActivityLoader';
import {joinTeam} from '../api/Groups';
import {inviteUser} from '../api/Users';
import {acceptRequest, declineRequest} from '../api/Notificaitons';
import {getGeocoordinatesWithPlaceName} from '../utils/location';
import {ErrorCodes, filterType, locationType} from '../utils/constant';
import {getSportDetails, getSportList} from '../utils/sportsActivityUtils';
import SearchModal from '../components/Filter/SearchModal';
import {ModalTypes} from '../Constants/GeneralConstants';
import CustomModalWrapper from '../components/CustomModalWrapper';

import CustomScrollTabs from '../components/CustomScrollTabs';

import ScreenHeader from '../components/ScreenHeader';

let stopFetchMore = true;
let timeout;

const TAB_ITEMS = [
  strings.peopleTitleText,
  strings.groupsTitleText,
  strings.matchesTitleText,
];
const PEOPLE_SUB_TAB_ITEMS = [
  strings.generalText,
  strings.playerTitle,
  strings.refereesTitle,
  strings.scorekeeperTitle,
];
const GROUP_SUB_TAB_ITEMS = [
  strings.teamsTitleText,
  strings.clubsTitleText,
  strings.leaguesTitleText,
];
const GAMES_SUB_TAB_ITEMS = [
  strings.completedTitleText,
  strings.upcomingTitleText,
];

export default function EntitySearchScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const GAME_HOME = {
    soccer: 'SoccerHome',
    tennis: 'TennisHome',
    tennis_double: 'TennisHome',
  };
  const getGameHomeScreen = (sportName) =>
    GAME_HOME[sportName?.split(' ').join('_').toLowerCase()];

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
  const [settingPopup, setSettingPopup] = useState(false);
  // Pagination
  const [pageSize] = useState(10);
  const [generalPageFrom, setGeneralPageFrom] = useState(0);
  const [pageFrom, setPageFrom] = useState(0);
  const [refereesPageFrom, setRefereesPageFrom] = useState(0);
  const [scorekeeperPageFrom, setScorekeeperPageFrom] = useState(0);
  const [teamsPageFrom, setTeamsPageFrom] = useState(0);
  const [clubsPageFrom, setClubsPageFrom] = useState(0);
  const [completedGamePageFrom, setCompletedGamePageFrom] = useState(0);
  const [upcomingGamePageFrom, setUpcomingGamePageFrom] = useState(0);
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

  useEffect(() => {
    const backAction = () => {
      navigation.popToTop();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    getStorage('appSetting').then((setting) => {
      setImageBaseUrl(setting.base_url_sporticon);
    });
    if (route.params?.locationText) {
      setSettingPopup(true);
    }
  }, [route.params?.locationText]);

  useEffect(() => {
    if (route.params?.activeTab) {
      setCurrentTab(route.params.activeTab);
      let subTab = '';
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

        default:
          break;
      }
      setCurrentSubTab(subTab);
    }
  }, [route.params?.activeTab]);
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
    const modifiedData = [];
    for (const item of response) {
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
    const modifiedData = [];
    for (const item of response) {
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
    const modifiedData = [];
    for (const item of response) {
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
    const modifiedData = response.map((obj) => ({
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
  }, [generalFilter, pageSize, generalPageFrom, generalList]);

  const getPlayersList = useCallback(() => {
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
    getUserIndex(playersQuery)
      .then((res) => {
        setSmallLoader(false);
        if (res.length > 0) {
          const result = modifiedPlayerElasticSearchResult(res);
          const fetchedData = [...playerList, ...result];
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
  }, [playerFilter, pageSize, pageFrom, playerList]);

  const getRefereesList = useCallback(() => {
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
    getUserIndex(refereeQuery)
      .then((res) => {
        setSmallLoader(false);
        if (res.length > 0) {
          const modifiedResult = modifiedRefereeElasticSearchResult(res);
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
  }, [pageSize, refereesPageFrom, referees, refereeFilters]);

  const getScoreKeepersList = useCallback(() => {
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
                    must: [{term: {'scorekeeper_data.is_published': true}}],
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
    getUserIndex(scoreKeeperQuery)
      .then((res) => {
        setSmallLoader(false);
        if (res.length > 0) {
          const modifiedResult = modifiedScoreKeeperElasticSearchResult(res);
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
  }, [pageSize, scorekeeperPageFrom, scorekeepers, scoreKeeperFilters]);

  const getTeamList = useCallback(() => {
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
    getGroupIndex(teamsQuery)
      .then((res) => {
        setSmallLoader(false);
        if (res.length > 0) {
          const modifiedResult = modifiedTeamElasticSearchResult(res);
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
  }, [pageSize, teamsPageFrom, teams, teamFilters]);

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
  }, [pageSize, clubsPageFrom, clubs, clubFilters]);

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
  }, [pageSize, completedGamePageFrom, completedGame, completedGameFilters]);
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
  }, [pageSize, upcomingGamePageFrom, upcomingGame, upcomingGameFilters]);

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
    switch (currentSubTab) {
      case strings.generalText:
        break;
      case strings.playerTitle: {
        const tempFilter = playerFilter;
        Object.keys(tempFilter).forEach((key) => {
          if (key === Object.keys(item)[0]) {
            if (Object.keys(item)[0] === 'sport') {
              tempFilter.sport = strings.allSport;
              tempFilter.sport_type = strings.allSport;
              tempFilter.sport_name = strings.allSport;
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = strings.worldTitleText;
              tempFilter.locationOption = locationType.WORLD;
              tempFilter.isSearchPlaceholder = true;
            }
          }
        });

        // applyFilter();
        setTimeout(() => {
          setPageFrom(0);
          setplayerList([]);
          setPlayerFilter({...tempFilter});
        }, 10);

        break;
      }
      case strings.refereesTitle: {
        const tempFilter = refereeFilters;
        Object.keys(tempFilter).forEach((key) => {
          if (key === Object.keys(item)[0]) {
            if (Object.keys(item)[0] === 'sport') {
              tempFilter.sport = strings.allSport;
              tempFilter.sport_type = strings.allSport;
              tempFilter.sport_name = strings.allSport;
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = strings.worldTitleText;
              tempFilter.locationOption = locationType.WORLD;
              tempFilter.isSearchPlaceholder = true;
            }
          }
        });
        setTimeout(() => {
          setRefereesPageFrom(0);
          setReferees([]);
          setrRefereeFilters({...tempFilter});
        }, 10);
        break;
      }
      case strings.scorekeeperTitle: {
        const tempFilter = scoreKeeperFilters;
        Object.keys(tempFilter).forEach((key) => {
          if (key === Object.keys(item)[0]) {
            if (Object.keys(item)[0] === 'sport') {
              tempFilter.sport = strings.allSport;
              tempFilter.sport_type = strings.allSport;
              tempFilter.sport_name = strings.allSport;
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = strings.worldTitleText;
              tempFilter.locationOption = locationType.WORLD;
              tempFilter.isSearchPlaceholder = true;
            }
          }
        });

        setTimeout(() => {
          setScorekeeperPageFrom(0);
          setScorekeepers([]);
          setScoreKeeperFilters({...tempFilter});
        }, 10);

        break;
      }
      case strings.teamsTitleText: {
        const tempFilter = teamFilters;
        Object.keys(tempFilter).forEach((key) => {
          if (key === Object.keys(item)[0]) {
            if (Object.keys(item)[0] === 'sport') {
              tempFilter.sport = strings.allSport;
              tempFilter.sport_type = strings.allSport;
              tempFilter.sport_name = strings.allSport;
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = strings.worldTitleText;
              tempFilter.locationOption = locationType.WORLD;
              tempFilter.isSearchPlaceholder = true;
            }
          }
        });

        // applyFilter();
        setTimeout(() => {
          setTeamsPageFrom(0);
          setTeams([]);
          setTeamFilters({...tempFilter});
        }, 10);

        break;
      }
      case strings.clubsTitleText: {
        const tempFilter = clubFilters;
        Object.keys(tempFilter).forEach((key) => {
          if (key === Object.keys(item)[0]) {
            if (Object.keys(item)[0] === 'sport') {
              tempFilter.sport = strings.allSport;
              tempFilter.sport_type = strings.allSport;
              tempFilter.sport_name = strings.allSport;
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = strings.worldTitleText;
              tempFilter.locationOption = locationType.WORLD;
              tempFilter.isSearchPlaceholder = true;
            }
          }
        });

        // applyFilter();
        setTimeout(() => {
          setClubsPageFrom(0);
          setClubs([]);
          setClubFilters({...tempFilter});
        }, 10);

        break;
      }
      case strings.completedTitleText: {
        const tempFilter = completedGameFilters;
        Object.keys(tempFilter).forEach((key) => {
          if (key === Object.keys(item)[0]) {
            if (Object.keys(item)[0] === 'sport') {
              tempFilter.sport = strings.allSport;
              tempFilter.sport_type = strings.allSport;
              tempFilter.sport_name = strings.allSport;
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = strings.worldTitleText;
              tempFilter.locationOption = locationType.WORLD;
              tempFilter.isSearchPlaceholder = true;
            }
          }
        });
        // applyFilter();
        setTimeout(() => {
          setCompletedGamePageFrom(0);
          setCompletedGame([]);
          setCompletedGameFilters({...tempFilter});
        }, 10);
        break;
      }
      case strings.upcomingTitleText: {
        const tempFilter = upcomingGameFilters;
        Object.keys(tempFilter).forEach((key) => {
          if (key === Object.keys(item)[0]) {
            if (Object.keys(item)[0] === 'sport') {
              tempFilter.sport = strings.allSport;
              tempFilter.sport_type = strings.allSport;
              tempFilter.sport_name = strings.allSport;
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = strings.worldTitleText;
              tempFilter.locationOption = locationType.WORLD;
              tempFilter.isSearchPlaceholder = true;
            }
          }
        });
        setTimeout(() => {
          setUpcomingGamePageFrom(0);
          setUpcomingGame([]);
          setUpcomingGameFilters({...tempFilter});
        }, 10);
        break;
      }
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
          setCompletedGame([]);
          setCompletedGamePageFrom(0);
          setCompletedGameFilters({
            ...completedGameFilters,
            searchText: text,
          });
          break;
        case strings.upcomingTitleText:
          setUpcomingGame([]);
          setUpcomingGamePageFrom(0);
          setUpcomingGameFilters({
            ...upcomingGameFilters,
            searchText: text,
          });
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
        default:
          break;
      }

      setCurrentTab(changeTab);
    },
    [completedGameFilters, generalFilter, searchText, teamFilters],
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
          setCompletedGame([]);
          setCompletedGamePageFrom(0);
          setCompletedGameFilters({
            ...completedGameFilters,
            searchText,
          });
          break;
        case strings.upcomingTitleText:
          setUpcomingGame([]);
          setUpcomingGamePageFrom(0);
          setUpcomingGameFilters({
            ...upcomingGameFilters,
            searchText,
          });
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
    ],
  );

  const userJoinGroup = (groupId) => {
    setloading(true);
    const params = {};
    joinTeam(params, groupId, authContext)
      .then((response) => {
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
                    .then(() => {})
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
        } else if (response.payload.action === Verbs.joinVerb) {
          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage, [
            {text: strings.okTitleText},
          ]);
        } else if (response.payload.action === Verbs.requestVerb) {
          Alert.alert(strings.alertmessagetitle, strings.sendRequest, [
            {text: strings.okTitleText},
          ]);
        } else {
          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage, [
            {text: strings.okTitleText},
          ]);
        }
      })
      .catch((error) => {
        setloading(false);
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
        </ScrollView>
        {currentSubTab !== strings.generalText && (
          <TouchableWithoutFeedback
            onPress={() => {
              setTimeout(() => {
                setSettingPopup(true);
              }, 100);
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
                  if (currentSubTab === strings.generalText) {
                    navigation.navigate('HomeScreen', {
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
                    });
                  } else if (sportsObj.length > 1) {
                    const data = {
                      sports: sportsObj,
                      uid: item?.user_id,
                      entityType: item?.entity_type,
                    };
                    setPlayerDetail(data);
                    setPlayerDetailPopup(true);
                  } else {
                    navigation.navigate('SportActivityHome', {
                      sport: sportsObj[0]?.sport,
                      sportType:
                        sportsObj[0]?.sport_type ?? Verbs.sportTypeSingle,
                      uid: item?.user_id,
                      entityType: sportsObj[0]?.type,
                      showPreview: true,
                      backScreen: 'EntitySearchScreen',
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
                  navigation.navigate('HomeScreen', {
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
                  });
                }}
                onPressChallengeButton={(dataObj) => {
                  setChallengePopup(true);
                  setSettingObject(dataObj.setting);
                  setCurrentUserData(dataObj);
                }}
                onPressJoinButton={(groupId) => {
                  userJoinGroup(groupId);
                }}
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

  const sportsView = (item) => (
    <Pressable
      style={[
        styles.sportView,
        styles.row,
        {borderLeftColor: colors.redColorCard},
      ]}
      onPress={() => {
        setPlayerDetailPopup(false);
        navigation.navigate('SportActivityHome', {
          sport: item.sport,
          sportType: item?.sport_type,
          uid: playerDetail.uid,
          entityType: playerDetail.entity_type,
          showPreview: true,
          backScreen: 'EntitySearchScreen',
        });
      }}
      disabled={item.is_hide}>
      <View style={styles.innerViewContainer}>
        <View style={styles.row}>
          <View style={styles.imageContainer}>
            <Image
              // source={{uri: `${imageBaseUrl}${item.player_image}`}}
              source={{
                uri: `${imageBaseUrl}${
                  getSportDetails(
                    item.sport,
                    item.sport_type,
                    authContext.sports,
                  ).sport_image
                }`,
              }}
              style={styles.sportIcon}
            />
          </View>
          <View>
            <Text style={styles.sportName}>{item.sport_name}</Text>
            <Text style={styles.matchCount}>0 match</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.searchText}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
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
          // dataSource={Utility.getFiltersOpetions(playerFilter)}
          dataSource={
            (currentSubTab === strings.generalText &&
              Utility.getFiltersOpetions(generalFilter)) ||
            (currentSubTab === strings.playerTitle &&
              Utility.getFiltersOpetions(playerFilter)) ||
            (currentSubTab === strings.refereesTitle &&
              Utility.getFiltersOpetions(refereeFilters)) ||
            (currentSubTab === strings.scorekeeperTitle &&
              Utility.getFiltersOpetions(scoreKeeperFilters)) ||
            (currentSubTab === strings.teamsTitleText &&
              Utility.getFiltersOpetions(teamFilters)) ||
            (currentSubTab === strings.clubsTitleText &&
              Utility.getFiltersOpetions(clubFilters)) ||
            (currentSubTab === strings.completedTitleText &&
              Utility.getFiltersOpetions(completedGameFilters)) ||
            (currentSubTab === strings.upcomingTitleText &&
              Utility.getFiltersOpetions(upcomingGameFilters))
          }
          filter={
            (currentSubTab === strings.generalText && generalFilter) ||
            (currentSubTab === strings.playerTitle && playerFilter) ||
            (currentSubTab === strings.refereesTitle && refereeFilters) ||
            (currentSubTab === strings.scorekeeperTitle &&
              scoreKeeperFilters) ||
            (currentSubTab === strings.teamsTitleText && teamFilters) ||
            (currentSubTab === strings.clubsTitleText && clubFilters) ||
            (currentSubTab === strings.completedTitleText &&
              completedGameFilters) ||
            (currentSubTab === strings.upcomingTitleText && upcomingGameFilters)
          }
          onTagCancelPress={handleTagPress}
          authContext={authContext}
        />
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={
          (currentSubTab === strings.generalText && generalList) ||
          (currentSubTab === strings.playerTitle && playerList) ||
          (currentSubTab === strings.refereesTitle && referees) ||
          (currentSubTab === strings.scorekeeperTitle && scorekeepers) ||
          (currentSubTab === strings.teamsTitleText && teams) ||
          (currentSubTab === strings.clubsTitleText && clubs) ||
          (currentSubTab === strings.completedTitleText && completedGame) ||
          (currentSubTab === strings.upcomingTitleText && upcomingGame)
        }
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
        sports={
          (currentSubTab === strings.playerTitle && [
            ...defaultSport,
            ...getSportList(authContext.sports, Verbs.entityTypePlayer),
          ]) ||
          (currentSubTab === strings.refereesTitle && [
            ...defaultSport,
            ...getSportList(authContext.sports, Verbs.entityTypeReferee),
          ]) ||
          (currentSubTab === strings.scorekeeperTitle && [
            ...defaultSport,
            ...getSportList(authContext.sports, Verbs.entityTypeScorekeeper),
          ]) ||
          (currentSubTab === strings.teamsTitleText && [
            ...defaultSport,
            ...getSportList(authContext.sports, Verbs.entityTypeTeam),
          ]) ||
          (currentSubTab === strings.clubsTitleText && [
            ...defaultSport,
            ...getSportList(authContext.sports, Verbs.entityTypeClub),
          ]) ||
          (currentSubTab === strings.completedTitleText && [
            ...defaultSport,
            ...getSportList(authContext.sports, Verbs.entityTypePlayer),
          ]) ||
          (currentSubTab === strings.upcomingTitleText && [
            ...defaultSport,
            ...getSportList(authContext.sports, Verbs.entityTypePlayer),
          ])
        }
        fType={filterType.LOOKINGFORTEAMCLUB}
        filterObject={
          (currentSubTab === strings.playerTitle && playerFilter) ||
          (currentSubTab === strings.refereesTitle && refereeFilters) ||
          (currentSubTab === strings.scorekeeperTitle && scoreKeeperFilters) ||
          (currentSubTab === strings.teamsTitleText && teamFilters) ||
          (currentSubTab === strings.clubsTitleText && clubFilters) ||
          (currentSubTab === strings.completedTitleText &&
            completedGameFilters) ||
          (currentSubTab === strings.upcomingTitleText && upcomingGameFilters)
        }
        isVisible={settingPopup}
        showSportOption={true}
        onPressApply={async (filterData) => {
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
          } else if (
            filterData.locationOption === locationType.CURRENT_LOCATION
          ) {
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
              setCompletedGame([]);
              setCompletedGamePageFrom(0);
              setCompletedGameFilters({
                ...tempFilter,
              });
              break;
            }
            case strings.upcomingTitleText: {
              setUpcomingGame([]);
              setUpcomingGamePageFrom(0);
              setUpcomingGameFilters({
                ...tempFilter,
              });
              break;
            }
            default:
              break;
          }
        }}
        onPressCancel={() => {
          setSettingPopup(false);
        }}></SearchModal>
      <Modal
        onBackdropPress={() => setChallengePopup(false)}
        backdropOpacity={1}
        animationType="slide"
        hasBackdrop
        style={{
          margin: 0,
          backgroundColor: colors.blackOpacityColor,
        }}
        visible={challengePopup}>
        <View style={styles.bottomPopupContainer}>
          <View style={styles.viewsContainer}>
            <Text
              onPress={() => setChallengePopup(false)}
              style={styles.cancelText}>
              {strings.cancel}
            </Text>
            <Text style={styles.challengeText}>{strings.challenge}</Text>
            <Text style={styles.challengeText}> </Text>
          </View>
          <TCThinDivider width={'100%'} />
          <TouchableWithoutFeedback
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

                    navigation.navigate('ChallengeScreen', {
                      setting: obj,
                      sportName: currentUserData?.sport,
                      sportType: currentUserData?.sport_type,
                      groupObj: currentUserData,
                    });
                  } else {
                    Alert.alert(strings.teamHaveNoCompletedSetting);
                  }
                } else {
                  console.log('in else continue :', currentUserData);
                  if (currentUserData.sport_type === Verbs.doubleSport) {
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

                    navigation.navigate('ChallengeScreen', {
                      setting: obj,
                      sportName: obj?.sport,
                      sportType: obj?.sport_type,
                      groupObj: currentUserData,
                    });
                  }
                }
              } else {
                Alert.alert(strings.oppTeamNotForChallenge);
              }
            }}>
            {selectedChallengeOption === 0 ? (
              <LinearGradient
                colors={[colors.yellowColor, colors.orangeGradientColor]}
                style={styles.backgroundView}>
                <Text
                  style={[
                    styles.curruentLocationText,
                    {color: colors.whiteColor},
                  ]}>
                  {strings.continueToChallenge}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.curruentLocationText}>
                  {strings.continueToChallenge}
                </Text>
              </View>
            )}
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
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
                      navigation.navigate('InviteChallengeScreen', {
                        setting: obj,
                        sportName: currentUserData?.sport,
                        sportType: currentUserData?.sport_type,
                        groupObj: currentUserData,
                      });
                    }
                  } else {
                    setTimeout(() => {
                      Alert.alert(
                        strings.completeSettingBeforeInvite,
                        '',
                        [
                          {
                            text: strings.cancel,
                            onPress: () => console.log('Cancel Pressed!'),
                          },
                          {
                            text: strings.okTitleText,
                            onPress: () => {
                              if (currentUserData?.is_pause === true) {
                                Alert.alert(strings.yourTeamPaused);
                              } else {
                                navigation.navigate('ManageChallengeScreen', {
                                  groupObj: currentUserData,
                                  sportName: currentUserData.sport,
                                  sportType: currentUserData?.sport_type,
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
                    navigation.navigate('InviteChallengeScreen', {
                      setting: obj,
                      sportName: currentUserData?.sport,
                      sportType: currentUserData?.sport_type,
                      groupObj: currentUserData,
                    });
                  }
                }
              } else {
                Alert.alert(strings.availibilityOff);
              }
            }}>
            {selectedChallengeOption === 1 ? (
              <LinearGradient
                colors={[colors.yellowColor, colors.orangeGradientColor]}
                style={styles.backgroundView}>
                <Text style={[styles.myCityText, {color: colors.whiteColor}]}>
                  {strings.inviteToChallenge}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.myCityText}>
                  {strings.inviteToChallenge}
                </Text>
              </View>
            )}
          </TouchableWithoutFeedback>
        </View>
      </Modal>
      <CustomModalWrapper
        isVisible={playerDetailPopup}
        closeModal={() => {
          setPlayerDetailPopup(false);
        }}
        modalType={ModalTypes.style2}
        ratio={Utility.calculateRatio(playerDetail?.sports.length)}>
        <View style={{paddingTop: 0, paddingHorizontal: 0}}>
          <FlatList
            data={playerDetail?.sports}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => sportsView(item, item.type, index)}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </CustomModalWrapper>
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
  bottomPopupContainer: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
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

  viewsContainer: {
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },

  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 50,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: '86%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  cancelText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.veryLightGray,
  },
  curruentLocationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  myCityText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  challengeText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  sportView: {
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: colors.lightGrayBackground,
    shadowColor: colors.googleColor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 5,
    marginBottom: 20,
    borderLeftWidth: 8,
    paddingVertical: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerViewContainer: {
    flex: 1,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sportName: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  matchCount: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  sportIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imageContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
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
    zIndex: 1,
    width: '90%',
    marginTop: 20,
  },
});
