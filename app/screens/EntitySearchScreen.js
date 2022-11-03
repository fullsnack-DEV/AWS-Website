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
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import moment from 'moment';

import Geolocation from '@react-native-community/geolocation';
import _ from 'lodash';
import AuthContext from '../auth/context';
// import UserListShimmer from '../components/shimmer/commonComponents/UserListShimmer';
import {widthPercentageToDP} from '../utils';
import TCScrollableProfileTabs from '../components/TCScrollableProfileTabs';
import colors from '../Constants/Colors';
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
import TCSearchBox from '../components/TCSearchBox';

// import ActivityLoader from '../../components/loader/ActivityLoader';

import {getLocationNameWithLatLong} from '../api/External';
import DateTimePickerView from '../components/Schedule/DateTimePickerModal';

import TCPicker from '../components/TCPicker';

let stopFetchMore = true;

const TAB_ITEMS = [
  strings.peopleTitleText,
  strings.groupsTitleText,
  strings.gamesTitleText,
  strings.postsTitleText,
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
const POST_SUB_TAB_ITEMS = [
  strings.all,
  strings.videosTitleText,
  strings.photosTitleText,
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

  const [currentTab, setCurrentTab] = useState(0);
  const [currentSubTab, setCurrentSubTab] = useState(strings.generalText);

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
  const [pageFrom, setPageFrom] = useState(0);

  const [refereesPageFrom, setRefereesPageFrom] = useState(0);
  const [scorekeeperPageFrom, setScorekeeperPageFrom] = useState(0);
  const [teamsPageFrom, setTeamsPageFrom] = useState(0);
  const [clubsPageFrom, setClubsPageFrom] = useState(0);
  const [completedGamePageFrom, setCompletedGamePageFrom] = useState(0);
  const [upcomingGamePageFrom, setUpcomingGamePageFrom] = useState(0);
  const [location, setLocation] = useState(strings.worldTitleText);
  const [selectedSport, setSelectedSport] = useState(strings.all);
  const [selectedSportType, setSelectedSportType] = useState(strings.all);

  const [minFee, setMinFee] = useState(0);
  const [maxFee, setMaxFee] = useState(0);
  const [playerFilter, setPlayerFilter] = useState({
    location: strings.worldTitleText,
    sport: strings.all,
    sportType: strings.all,
  });
  const [refereeFilters, setrRefereeFilters] = useState({
    location: strings.worldTitleText,
    sport: strings.all,
  });
  const [scoreKeeperFilters, setScoreKeeperFilters] = useState({
    location: strings.worldTitleText,
    sport: strings.all,
  });
  const [teamFilters, setTeamFilters] = useState({
    location: strings.worldTitleText,
    sport: strings.all,
  });
  const [clubFilters, setClubFilters] = useState({
    location: strings.worldTitleText,
    sport: strings.all,
  });
  const [completedGameFilters, setCompletedGameFilters] = useState({
    location: strings.worldTitleText,
    sport: strings.all,
  });
  const [upcomingGameFilters, setUpcomingGameFilters] = useState({
    location: strings.worldTitleText,
    sport: strings.all,
  });

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(0);
  const [sports, setSports] = useState([]);
  const [datePickerFor, setDatePickerFor] = useState();
  const [show, setShow] = useState(false);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [sportsList] = useState(route?.params?.sportsList);

  const searchBoxRef = useRef();
  useEffect(() => {
    if (route?.params?.locationText) {
      setSettingPopup(true);
      setTimeout(() => {
        setLocation(route?.params?.locationText);
        // setFilters({
        //   ...filters,
        //   location: route?.params?.locationText,
        // });
      }, 10);
      // navigation.setParams({ locationText: null });
    }
  }, [route?.params?.locationText]);
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

  useEffect(() => {
    const list = [
      {
        label: strings.all,
        value: strings.all,
      },
    ];
    sportsList.map((obj) => {
      const dataSource = {
        label: obj.label,
        value: obj.value,
      };
      list.push(dataSource);
    });
    setSports(list);
  }, [sportsList]);

  const getPlayersList = useCallback(() => {
    const playersQuery = {
      size: pageSize,
      from: pageFrom,
      query: {
        bool: {
          must: [
            {
              nested: {
                path: 'registered_sports',
                query: {
                  bool: {
                    must: [],
                  },
                },
              },
            },
            {match: {entity_type: 'player'}},
          ],
        },
      },
    };
    if (
      currentSubTab === strings.playerTitle ||
      playerFilter.sport !== strings.all
    ) {
      playersQuery.query.bool.must[0].nested.query.bool.must.push({
        term: {'registered_sports.is_active': true},
      });
    }

    // Sport filter
    if (playerFilter.sport !== strings.all) {
      playersQuery.query.bool.must[0].nested.query.bool.must.push({
        term: {
          'registered_sports.sport.keyword': `${playerFilter.sport.toLowerCase()}`,
        },
      });
    }

    // World filter
    if (playerFilter.location !== strings.worldTitleText) {
      playersQuery.query.bool.must.push({
        multi_match: {
          query: `${playerFilter.location.toLowerCase()}`,
          fields: ['city', 'country', 'state'],
        },
      });
    }

    // Match Fee filter
    if (playerFilter.fee) {
      playersQuery.query.bool.must.push({
        bool: {
          should: [
            {
              range: {
                'referee_data.setting.game_fee.fee': {
                  gte: Number(playerFilter.fee.split('-')[0]),
                  lte: Number(playerFilter.fee.split('-')[1]),
                },
              },
            },
            {
              range: {
                'scorekeeper_data.setting.game_fee.fee': {
                  gte: Number(playerFilter.fee.split('-')[0]),
                  lte: Number(playerFilter.fee.split('-')[1]),
                },
              },
            },
          ],
        },
      });
    }
    // Search filter
    if (playerFilter.searchText) {
      playersQuery.query.bool.must.push({
        query_string: {
          query: `*${playerFilter.searchText.toLowerCase()}*`,
          fields: ['first_name', 'last_name'],
        },
      });
    }
    console.log('playerQuery:=>', JSON.stringify(playersQuery));
    getUserIndex(playersQuery)
      .then((res) => {
        if (res.length > 0) {
          console.log('Player response ', res);
          const fetchedData = [...playerList, ...res];
          setplayerList(fetchedData);
          setPageFrom(pageFrom + pageSize);
          stopFetchMore = true;

          // // pagination case
          // if (isPagination) {
          //   isPagination = false;
          //   setplayerList(fetchedData);
          //   setFilterData(fetchedData);
          //   setPageFrom(pageFrom + pageSize);
          //   stopFetchMore = true;
          //   if (currentSubTab === strings.playerTitle || currentSubTab === strings.generalText) {
          //     setFilterData(fetchedData);
          //   }
          // } else if (isFiltering) {
          //   // Filtering case
          //   setplayerList(fetchedFilterData);
          //   setFilterData(fetchedFilterData);
          //   setPageFrom(pageFrom + pageSize);
          //   stopFetchMore = true;
          //   if (currentSubTab === strings.playerTitle || currentSubTab === strings.generalText) {
          //     setFilterData(fetchedFilterData);
          //   }
          // }
        }
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e);
        }, 10);
      });
  }, [playerFilter, pageSize, pageFrom, playerList]);

  const getRefereesList = useCallback(() => {
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
                  bool: {must: [{term: {'referee_data.is_published': true}}]},
                },
              },
            },
          ],
        },
      },
    };

    // Location filter
    if (refereeFilters.location !== strings.worldTitleText) {
      refereeQuery.query.bool.must.push({
        multi_match: {
          query: `${refereeFilters.location}`,
          fields: ['city', 'country', 'state'],
        },
      });
    }
    // Sport Filter
    if (refereeFilters.sport !== strings.all) {
      refereeQuery.query.bool.must[0].nested.query.bool.must.push({
        term: {
          'referee_data.sport_name.keyword': {
            value: `${refereeFilters.sport.toLowerCase()}`,
            case_insensitive: true,
          },
        },
      });
    }
    // Referee match fee filter
    if (refereeFilters.fee) {
      refereeQuery.query.bool.must[0].nested.query.bool.must.push({
        term: {
          'referee_data.setting.game_fee.fee': {
            gte: Number(refereeFilters.fee.split('-')[0]),
            lte: Number(refereeFilters.fee.split('-')[1]),
          },
        },
      });
    }
    // Search filter
    if (refereeFilters.searchText) {
      refereeQuery.query.bool.must.push({
        query_string: {
          query: `*${refereeFilters.searchText.toLowerCase()}*`,
          fields: ['first_name', 'last_name'],
        },
      });
    }
    console.log('Referee query:=>', JSON.stringify(refereeQuery));
    getUserIndex(refereeQuery)
      .then((res) => {
        if (res.length > 0) {
          const fetchedData = [...referees, ...res];
          setReferees(fetchedData);
          setRefereesPageFrom(refereesPageFrom + pageSize);
          stopFetchMore = true;
        }
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e);
        }, 10);
      });
  }, [pageSize, refereesPageFrom, referees, refereeFilters]);

  const getScoreKeepersList = useCallback(() => {
    console.log('Location -->', scoreKeeperFilters.location);
    console.log('Location -->', scoreKeeperFilters.sport);

    // Score keeper query
    const scoreKeeperQuery = {
      size: pageSize,
      from: scorekeeperPageFrom,
      query: {
        bool: {
          must: [{term: {'scorekeeper_data.is_published': true}}],
        },
      },
    };
    // Location filter
    if (scoreKeeperFilters.location !== strings.worldTitleText) {
      scoreKeeperQuery.query.bool.must.push({
        multi_match: {
          query: `${scoreKeeperFilters.location.toLowerCase()}`,
          fields: ['city', 'country', 'state'],
        },
      });
    }

    if (scoreKeeperFilters.sport !== strings.all) {
      scoreKeeperQuery.query.bool.must.push({
        term: {
          'scorekeeper_data.sport_name.keyword': {
            value: `${scoreKeeperFilters.sport.toLowerCase()}`,
            case_insensitive: true,
          },
        },
      });
    }
    // Referee Match fee filter
    if (scoreKeeperFilters.fee) {
      scoreKeeperQuery.query.bool.must.push({
        range: {
          'scorekeeper_data.setting.game_fee.fee': {
            gte: Number(scoreKeeperFilters.fee.split('-')[0]),
            lte: Number(scoreKeeperFilters.fee.split('-')[1]),
          },
        },
      });
    }
    // Search filter
    if (scoreKeeperFilters.searchText) {
      scoreKeeperQuery.query.bool.must.push({
        query_string: {
          query: `*${scoreKeeperFilters.searchText.toLowerCase()}*`,
          fields: ['first_name', 'last_name'],
        },
      });
    }
    console.log('scoreKeeperQuery query ->', JSON.stringify(scoreKeeperQuery));
    getUserIndex(scoreKeeperQuery)
      .then((res) => {
        if (res.length > 0) {
          const fetchedData = [...scorekeepers, ...res];
          setScorekeepers(fetchedData);
          setScorekeeperPageFrom(scorekeeperPageFrom + pageSize);
          stopFetchMore = true;
        }
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e);
        }, 10);
      });
  }, [pageSize, scorekeeperPageFrom, scorekeepers, scoreKeeperFilters]);

  const getTeamList = useCallback(() => {
    console.log('Team search ==>', teamFilters.searchText);
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
          fields: ['city', 'country', 'state'],
        },
      });
    }

    if (teamFilters.sport !== strings.all) {
      teamsQuery.query.bool.must.push({
        term: {
          'registered_sports.sport_name.keyword': {
            value: `${teamFilters?.sport?.toLowerCase()}`,
            case_insensitive: true,
          },
        },
      });
    }
    // team match fee filter
    if (teamFilters.fee) {
      teamsQuery.query.bool.must.push({
        range: {
          'setting.game_fee.fee': {
            gte: Number(teamFilters.fee.split('-')[0]),
            lte: Number(teamFilters.fee.split('-')[1]),
          },
        },
      });
    }
    // team search filter
    if (teamFilters.searchText) {
      teamsQuery.query.bool.must.push({
        query_string: {
          query: `*${teamFilters.searchText.toLowerCase()}*`,
          fields: ['group_name'],
        },
      });
    }

    console.log('teams query ===>', JSON.stringify(teamsQuery));
    getGroupIndex(teamsQuery)
      .then((res) => {
        if (res.length > 0) {
          console.log('teams response :=>', res);
          const fetchedData = [...teams, ...res];
          setTeams(fetchedData);
          setTeamsPageFrom(teamsPageFrom + pageSize);
          stopFetchMore = true;
        }
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e);
        }, 10);
      });
  }, [pageSize, teamsPageFrom, teams, teamFilters]);

  const getClubList = useCallback(() => {
    // const clubsQuery = bodybuilder()
    //   .query('match', 'entity_type', 'club')
    //   .build();
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
          fields: ['city', 'country', 'state'],
        },
      });
    }

    if (clubFilters.sport !== strings.all) {
      clubsQuery.query.bool.must.push({
        term: {
          'registered_sports.sport_name.keyword': {
            value: `${clubFilters?.sport?.toLowerCase()}`,
            case_insensitive: true,
          },
        },
      });
    }
    // club match fee filter
    if (clubFilters.fee) {
      clubsQuery.query.bool.must.push({
        range: {
          'setting.game_fee.fee': {
            gte: Number(clubFilters.fee.split('-')[0]),
            lte: Number(clubFilters.fee.split('-')[1]),
          },
        },
      });
    }
    // club search filter
    if (clubFilters.searchText) {
      clubsQuery.query.bool.must.push({
        query_string: {
          query: `*${clubFilters.searchText.toLowerCase()}*`,
          fields: ['group_name'],
        },
      });
    }
    console.log('clubs query ===>', JSON.stringify(clubsQuery));

    getGroupIndex(clubsQuery)
      .then((res) => {
        if (res.length > 0) {
          console.log('clubs response :=>', res);
          const fetchedData = [...clubs, ...res];
          setClubs(fetchedData);
          setClubsPageFrom(clubsPageFrom + pageSize);
          stopFetchMore = true;
        }
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e);
        }, 10);
      });
  }, [pageSize, clubsPageFrom, clubs, clubFilters]);

  const getCompletedGamesList = useCallback(() => {
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
          fields: ['city', 'country', 'state', 'venue.address'],
        },
      });
    }
    // Sport filter
    if (completedGameFilters.sport !== strings.all) {
      completedGameQuery.query.bool.must.push({
        term: {
          'sport.keyword': {
            value: completedGameFilters.sport.toLowerCase(),
            case_insensitive: true,
          },
        },
      });
    }
    getGameIndex(completedGameQuery).then((games) => {
      console.log('completed game response :=>', games);
      Utility.getGamesList(games).then((gamedata) => {
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
    if (upcomingGameFilters.sport !== strings.all) {
      upcomingMatchQuery.query.bool.must.push({
        term: {
          'sport.keyword': {
            value: upcomingGameFilters.sport.toLowerCase(),
            case_insensitive: true,
          },
        },
      });
    }
    console.log('Upcoming game Query:=>', JSON.stringify(upcomingMatchQuery));

    getGameIndex(upcomingMatchQuery).then((games) => {
      console.log('Upcoming game response :=>', games);

      Utility.getGamesList(games).then((gamedata) => {
        if (games.length > 0) {
          const fetchedData = [...upcomingGame, ...gamedata];
          setUpcomingGame(fetchedData);
          setUpcomingGamePageFrom(upcomingGamePageFrom + pageSize);
          stopFetchMore = true;
        }
      });
    });
  }, [pageSize, upcomingGamePageFrom, upcomingGame, upcomingGameFilters]);

  const renderSeparator = () =>
    currentTab !== 2 && (
      <TCThinDivider marginTop={10} marginBottom={10} width={'100%'} />
    );
  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          fontFamily: fonts.RRegular,
          color: colors.grayColor,
          fontSize: 15,
        }}>
        No Records Found
      </Text>
    </View>
  );

  const handleDonePress = (date) => {
    if (datePickerFor === 'from') {
      setFromDate(new Date(date));
    } else {
      setToDate(new Date(date));
    }
    setShow(!show);
  };
  const handleCancelPress = () => {
    setShow(false);
  };

  const handleTagPress = ({item}) => {
    // const tempFilter = playerFilter;
    // Object.keys(tempFilter).forEach((key) => {
    //   if (key === Object.keys(item)[0]) {
    //     if (Object.keys(item)[0] === 'sport') {
    //       tempFilter.sport = strings.all;
    //       delete tempFilter.fee;
    //       setSelectedSport(strings.all);
    //       setMinFee(0);
    //       setMaxFee(0);
    //     }
    //     if (Object.keys(item)[0] === 'location') {
    //       tempFilter.location = strings.worldTitleText;
    //     }
    //     if (Object.keys(item)[0] === 'fee') {
    //       delete tempFilter.fee;
    //     }
    //   }
    // });
    // console.log('Temp filter', tempFilter);
    // setPlayerFilter({...tempFilter});
    // // applyFilter();
    // setTimeout(() => {
    //   setPageFrom(0);
    //   setplayerList([]);
    //   applyFilter(tempFilter);
    // }, 10);

    switch (currentSubTab) {
      case strings.generalText:
      case strings.playerTitle: {
        const tempFilter = playerFilter;
        Object.keys(tempFilter).forEach((key) => {
          if (key === Object.keys(item)[0]) {
            if (Object.keys(item)[0] === 'sport') {
              tempFilter.sport = strings.all;
              delete tempFilter.fee;
              setSelectedSport(strings.all);
              setSelectedSportType(strings.all);
              setMinFee(0);
              setMaxFee(0);
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = strings.worldTitleText;
            }
            if (Object.keys(item)[0] === 'fee') {
              delete tempFilter.fee;
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
              tempFilter.sport = strings.all;
              delete tempFilter.fee;
              setSelectedSport(strings.all);
              setSelectedSportType(strings.all);
              setMinFee(0);
              setMaxFee(0);
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = strings.worldTitleText;
            }
            if (Object.keys(item)[0] === 'fee') {
              delete tempFilter.fee;
            }
          }
        });
        // setPlayerFilter({...tempFilter});
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
              tempFilter.sport = strings.all;
              delete tempFilter.fee;
              setSelectedSport(strings.all);
              setSelectedSportType(strings.all);
              setMinFee(0);
              setMaxFee(0);
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = strings.worldTitleText;
            }
            if (Object.keys(item)[0] === 'fee') {
              delete tempFilter.fee;
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
              tempFilter.sport = strings.all;
              delete tempFilter.fee;
              setSelectedSport(strings.all);
              setSelectedSportType(strings.all);
              setMinFee(0);
              setMaxFee(0);
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = strings.worldTitleText;
            }
            if (Object.keys(item)[0] === 'fee') {
              delete tempFilter.fee;
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
              tempFilter.sport = strings.all;
              delete tempFilter.fee;
              setSelectedSport(strings.all);
              setSelectedSportType(strings.all);
              setMinFee(0);
              setMaxFee(0);
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = strings.worldTitleText;
            }
            if (Object.keys(item)[0] === 'fee') {
              delete tempFilter.fee;
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
              tempFilter.sport = strings.all;
              delete tempFilter.fee;
              setSelectedSport(strings.all);
              setSelectedSportType(strings.all);
              setMinFee(0);
              setMaxFee(0);
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = strings.worldTitleText;
            }
            if (Object.keys(item)[0] === 'fee') {
              delete tempFilter.fee;
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
              tempFilter.sport = strings.all;
              delete tempFilter.fee;
              setSelectedSport(strings.all);
              setSelectedSportType(strings.all);
              setMinFee(0);
              setMaxFee(0);
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = strings.worldTitleText;
            }
            if (Object.keys(item)[0] === 'fee') {
              delete tempFilter.fee;
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
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Lat/long to position::=>', position);
        // const position = { coords: { latitude: 49.11637199697782, longitude: -122.7776695216056 } }
        getLocationNameWithLatLong(
          position.coords.latitude,
          position.coords.longitude,
          authContext,
        ).then((res) => {
          console.log(
            'Lat/long to address::=>',
            res.results[0].address_components,
          );
          let city;
          res.results[0].address_components.map((e) => {
            if (e.types.includes('administrative_area_level_2')) {
              city = e.short_name;
            }
          });
          console.log(
            'Location:=>',
            city.charAt(0).toUpperCase() + city.slice(1),
          );
          setLocation(city.charAt(0).toUpperCase() + city.slice(1));
          // setFilters({
          //   ...filters,
          //   location: city.charAt(0).toUpperCase() + city.slice(1),
          // });
        });
        console.log(position.coords.latitude);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const applyValidation = useCallback(() => {
    if (Number(minFee) > 0 && Number(maxFee) <= 0) {
      Alert.alert('Please enter correct referee max fee.');
      return false;
    }
    if (Number(minFee) <= 0 && Number(maxFee) > 0) {
      Alert.alert('Please enter correct referee min fee.');
      return false;
    }
    if (Number(minFee) > Number(maxFee)) {
      Alert.alert('Please enter correct referee fee.');
      return false;
    }
    return true;
  }, [maxFee, minFee]);

  const onScrollHandler = () => {
    switch (currentTab) {
      case 0:
        if (
          currentSubTab === strings.generalText ||
          currentSubTab === strings.playerTitle
        ) {
          if (!stopFetchMore) {
            getPlayersList();
            stopFetchMore = true;
          }
        } else if (currentSubTab === strings.refereesTitle) {
          if (!stopFetchMore) {
            console.log('called get referee');
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
    console.log('called on scroll end');
  };

  const searchFilterFunction = (text) => {
    console.log('search text value', text);
    console.log('currentSubTab==>3333', currentSubTab);

    switch (currentSubTab) {
      case strings.generalText:
        setplayerList([]);
        setPageFrom(0);
        setPlayerFilter({
          ...playerFilter,
          searchText: text,
        });
        console.log('General filters ========>', playerFilter);
        break;
      case strings.playerTitle:
        setplayerList([]);
        setPageFrom(0);
        setPlayerFilter({
          ...playerFilter,
          searchText: text,
        });
        console.log('players filters ========>', playerFilter);
        break;
      case strings.refereesTitle:
        console.log('Referees filters ========>', refereeFilters);
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
        console.log('teamFilters', teamFilters);

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
  };
  const onPressReset = () => {
    console.log('dhdshjshs');
    switch (currentSubTab) {
      case strings.generalText:
      case strings.playerTitle:
        setplayerList({
          location: strings.worldTitleText,
          sport: strings.all,
        });
        setSelectedSport(strings.all);
        setSelectedSportType(strings.all);
        setMinFee(0);
        setMaxFee(0);
        break;
      case strings.refereesTitle:
        setReferees({
          location: strings.worldTitleText,
          sport: strings.all,
        });
        setSelectedSport(strings.all);
        setSelectedSportType(strings.all);
        setMinFee(0);
        setMaxFee(0);
        break;
      case strings.scorekeeperTitle:
        setScorekeepers({
          location: strings.worldTitleText,
          sport: strings.all,
        });
        setSelectedSport(strings.all);
        setSelectedSportType(strings.all);
        setMinFee(0);
        setMaxFee(0);
        break;
      case strings.teamsTitleText:
        setTeams({
          location: strings.worldTitleText,
          sport: strings.all,
        });
        setSelectedSport(strings.all);
        setSelectedSportType(strings.all);
        setMinFee(0);
        setMaxFee(0);

        break;
      case strings.clubsTitleText:
        setClubs({
          location: strings.worldTitleText,
          sport: strings.all,
        });
        setSelectedSport(strings.all);
        setSelectedSportType(strings.all);
        setMinFee(0);
        setMaxFee(0);
        break;
      case strings.completedTitleText:
        setCompletedGame({
          location: strings.worldTitleText,
          sport: strings.all,
        });
        setSelectedSport(strings.all);
        setSelectedSportType(strings.all);
        setMinFee(0);
        setMaxFee(0);
        break;
      case strings.upcomingTitleText:
        setUpcomingGame({
          location: strings.worldTitleText,
          sport: strings.all,
        });
        setSelectedSport(strings.all);
        setSelectedSportType(strings.all);
        setMinFee(0);
        setMaxFee(0);
        break;
      default:
        console.log('ddddd');
        break;
    }
  };

  const tabChangePress = useCallback((changeTab) => {
    console.log('change tab value ', changeTab);
    searchFilterFunction('');
    searchBoxRef.current.clear();
    switch (changeTab.i) {
      case 0:
        setCurrentSubTab(strings.generalText);
        break;
      case 1:
        setCurrentSubTab(strings.teamsTitleText);
        break;
      case 2:
        setCurrentSubTab(strings.completedTitleText);
        break;
      case 3:
        setCurrentSubTab(strings.all);
        break;
      default:
        break;
    }
    setCurrentTab(changeTab.i);
  }, []);
  const onPressSubTabs = useCallback((item) => {
    setCurrentSubTab(item);
    searchFilterFunction('');
    searchBoxRef.current.clear();
  }, []);
  const renderTabContain = useMemo(
    () => (
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: colors.lightgrayColor,
          borderBottomWidth: 1,
          backgroundColor: '#FCFCFC',
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
                {_.startCase(item)}
              </Text>
            </TouchableOpacity>
          ))}
        {currentTab === 1 &&
          GROUP_SUB_TAB_ITEMS.map((item) => (
            <TouchableOpacity
              key={item}
              style={{padding: 10}}
              onPress={() => setCurrentSubTab(item)}>
              <Text
                style={{
                  color:
                    item === currentSubTab
                      ? colors.themeColor
                      : colors.lightBlackColor,
                  fontFamily:
                    item === currentSubTab ? fonts.RBold : fonts.RRegular,
                }}>
                {_.startCase(item)}
              </Text>
            </TouchableOpacity>
          ))}
        {currentTab === 2 &&
          GAMES_SUB_TAB_ITEMS.map((item) => (
            <TouchableOpacity
              key={item}
              style={{padding: 10}}
              onPress={() => setCurrentSubTab(item)}>
              <Text
                style={{
                  color:
                    item === currentSubTab
                      ? colors.themeColor
                      : colors.lightBlackColor,
                  fontFamily:
                    item === currentSubTab ? fonts.RBold : fonts.RRegular,
                }}>
                {_.startCase(item)}
              </Text>
            </TouchableOpacity>
          ))}
        {currentTab === 3 &&
          POST_SUB_TAB_ITEMS.map((item) => (
            <TouchableOpacity
              key={item}
              style={{padding: 10}}
              onPress={() => setCurrentSubTab(item)}>
              <Text
                style={{
                  color:
                    item === currentSubTab
                      ? colors.themeColor
                      : colors.lightBlackColor,
                  fontFamily:
                    item === currentSubTab ? fonts.RBold : fonts.RRegular,
                }}>
                {_.startCase(item)}
              </Text>
            </TouchableOpacity>
          ))}
        {currentSubTab !== strings.generalText && (
          <TouchableWithoutFeedback
            onPress={() => {
              setTimeout(() => {
                switch (currentSubTab) {
                  case strings.generalText:
                  case strings.playerTitle: {
                    setLocation(playerFilter.location);
                    setSelectedSport(playerFilter.sport);
                    setLocationFilterOpetion(
                      playerFilter.locationType ? playerFilter.locationType : 0,
                    );
                    if (playerFilter.fee) {
                      setMinFee(playerFilter.fee.split('-')[0]);
                      setMaxFee(playerFilter.fee.split('-')[1]);
                    } else {
                      setMaxFee(0);
                      setMinFee(0);
                    }
                    break;
                  }
                  case strings.refereesTitle: {
                    setLocation(refereeFilters.location);
                    setSelectedSport(refereeFilters.sport);
                    setLocationFilterOpetion(
                      refereeFilters.locationType
                        ? refereeFilters.locationType
                        : 0,
                    );
                    if (refereeFilters.fee) {
                      setMinFee(refereeFilters.fee.split('-')[0]);
                      setMaxFee(refereeFilters.fee.split('-')[1]);
                    } else {
                      setMaxFee(0);
                      setMinFee(0);
                    }
                    break;
                  }
                  case strings.scorekeeperTitle: {
                    setLocation(scoreKeeperFilters.location);
                    setSelectedSport(scoreKeeperFilters.sport);
                    setLocationFilterOpetion(
                      scoreKeeperFilters.locationType
                        ? scoreKeeperFilters.locationType
                        : 0,
                    );

                    if (scoreKeeperFilters.fee) {
                      setMinFee(scoreKeeperFilters.fee.split('-')[0]);
                      setMaxFee(scoreKeeperFilters.fee.split('-')[1]);
                    } else {
                      setMaxFee(0);
                      setMinFee(0);
                    }
                    break;
                  }
                  case strings.teamsTitleText: {
                    setLocation(teamFilters.location);
                    setSelectedSport(teamFilters.sport);
                    setLocationFilterOpetion(
                      teamFilters.locationType ? teamFilters.locationType : 0,
                    );
                    if (teamFilters.fee) {
                      setMinFee(teamFilters.fee.split('-')[0]);
                      setMaxFee(teamFilters.fee.split('-')[1]);
                    } else {
                      setMaxFee(0);
                      setMinFee(0);
                    }
                    break;
                  }
                  case strings.clubsTitleText: {
                    setLocation(clubFilters.location);
                    setSelectedSport(clubFilters.sport);
                    setLocationFilterOpetion(
                      clubFilters.locationType ? clubFilters.locationType : 0,
                    );
                    if (clubFilters.fee) {
                      setMinFee(clubFilters.fee.split('-')[0]);
                      setMaxFee(clubFilters.fee.split('-')[1]);
                    } else {
                      setMaxFee(0);
                      setMinFee(0);
                    }
                    break;
                  }
                  case strings.completedTitleText: {
                    setLocation(completedGameFilters.location);
                    setSelectedSport(completedGameFilters.sport);
                    setLocationFilterOpetion(
                      completedGameFilters.locationType
                        ? completedGameFilters.locationType
                        : 0,
                    );
                    if (completedGameFilters.fee) {
                      setMinFee(completedGameFilters.fee.split('-')[0]);
                      setMaxFee(completedGameFilters.fee.split('-')[1]);
                    } else {
                      setMaxFee(0);
                      setMinFee(0);
                    }
                    break;
                  }
                  case strings.upcomingTitleText: {
                    setLocation(upcomingGameFilters.location);
                    setSelectedSport(upcomingGameFilters.sport);
                    setLocationFilterOpetion(
                      upcomingGameFilters.locationType
                        ? upcomingGameFilters.locationType
                        : 0,
                    );
                    if (upcomingGameFilters.fee) {
                      setMinFee(upcomingGameFilters.fee.split('-')[0]);
                      setMaxFee(upcomingGameFilters.fee.split('-')[1]);
                    } else {
                      setMaxFee(0);
                      setMinFee(0);
                    }
                    break;
                  }
                  default:
                    break;
                }

                setSettingPopup(true);
              }, 100);
            }}>
            <Image source={images.homeSetting} style={styles.settingImage} />
          </TouchableWithoutFeedback>
        )}
      </View>

      // <View style={{flex: 1}}>{renderSingleTab}</View>
    ),
    [
      currentTab,
      PEOPLE_SUB_TAB_ITEMS,
      GROUP_SUB_TAB_ITEMS,
      GAMES_SUB_TAB_ITEMS,
      POST_SUB_TAB_ITEMS,
      currentSubTab,
      onPressSubTabs,
      playerFilter.location,
      playerFilter.sport,
      playerFilter.locationType,
      playerFilter.fee,
      refereeFilters.location,
      refereeFilters.sport,
      refereeFilters.locationType,
      refereeFilters.fee,
      scoreKeeperFilters.location,
      scoreKeeperFilters.sport,
      scoreKeeperFilters.locationType,
      scoreKeeperFilters.fee,
      teamFilters,
      clubFilters,
      completedGameFilters.location,
      completedGameFilters.sport,
      completedGameFilters.locationType,
      completedGameFilters.fee,
      upcomingGameFilters.location,
      upcomingGameFilters.sport,
      upcomingGameFilters.locationType,
      upcomingGameFilters.fee,
    ],
  );

  const renderItem = useCallback(
    ({item}) => (
      <View>
        {currentTab === 0 && (
          <View style={styles.topViewContainer}>
            <View style={[styles.separator, {flex: 1}]}>
              <TCPlayerView
                data={item}
                showStar={false}
                onPress={() => {
                  navigation.navigate('HomeScreen', {
                    uid: ['user', 'player']?.includes(item?.entity_type)
                      ? item?.user_id
                      : item?.group_id,
                    role: ['user', 'player']?.includes(item?.entity_type)
                      ? 'user'
                      : item.entity_type,
                    backButtonVisible: true,
                    menuBtnVisible: false,
                  });
                }}
              />
            </View>
          </View>
        )}
        {currentTab === 1 && (
          <View style={styles.topViewContainer}>
            <View style={[styles.separator, {flex: 1}]}>
              <TCTeamSearchView
                data={item}
                showStar={true}
                onPress={() => {
                  navigation.navigate('HomeScreen', {
                    uid: ['user', 'player']?.includes(item?.entity_type)
                      ? item?.user_id
                      : item?.group_id,
                    role: ['user', 'player']?.includes(item?.entity_type)
                      ? 'user'
                      : item.entity_type,
                    backButtonVisible: true,
                    menuBtnVisible: false,
                  });
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
    [currentSubTab, currentTab, navigation],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.searchBarView}>
        <TCSearchBox
          testID={'entity-search-input'}
          textInputRef={searchBoxRef}
          editable={true}
          onChangeText={(text) => {
            searchFilterFunction(text);
          }}
        />
      </View>
      <View style={{backgroundColor: '#FFFFFF'}}>
        <TCScrollableProfileTabs
          tabItem={TAB_ITEMS}
          tabVerticalScroll={false}
          onChangeTab={tabChangePress}
          currentTab={currentTab}
        />
      </View>
      {renderTabContain}
      <View style={{backgroundColor: colors.whiteColor}}>
        <TCTagsFilter
          // dataSource={Utility.getFiltersOpetions(playerFilter)}
          dataSource={
            (currentSubTab === strings.generalText &&
              Utility.getFiltersOpetions(playerFilter)) ||
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
          onTagCancelPress={handleTagPress}
        />
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={
          (currentSubTab === strings.generalText && playerList) ||
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
          backgroundColor: '#FCFCFC',
          flex: 1,
          paddingBottom: 25,
        }}
        // contentContainerStyle={{paddingBottom: 1, flex: 1}}
        // onEndReached={onScrollHandler}
        onEndReachedThreshold={0.01}
        onScrollEndDrag={onScrollHandler}
        onScrollBeginDrag={() => {
          stopFetchMore = false;
        }}
        ListEmptyComponent={listEmptyComponent}
      />
      <Modal
        // onBackdropPress={() => setSettingPopup(false)}
        // backdropOpacity={1}
        // animationType="slide"
        // hasBackdrop
        // style={{
        //   flex: 1,
        //   margin: 0,
        //   backgroundColor: colors.blackOpacityColor,
        // }}
        // visible={settingPopup}
        onBackdropPress={() => setSettingPopup(false)}
        isVisible={settingPopup}
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
            {height: Dimensions.get('window').height - 100},
          ]}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <ScrollView style={{flex: 1}}>
              <View style={styles.viewsContainer}>
                <Text
                  onPress={() => setSettingPopup(false)}
                  style={styles.cancelText}>
                  Cancel
                </Text>
                <Text style={styles.locationText}>Filter</Text>
                <Text
                  style={styles.doneText}
                  onPress={() => {
                    if (applyValidation()) {
                      setSettingPopup(false);
                      setTimeout(() => {
                        // const tempFilter = {...playerFilter};
                        // tempFilter.sport = selectedSport;
                        // tempFilter.location = location;

                        // if (minFee && maxFee) {
                        //   tempFilter.refereeFee = `${minFee}-${maxFee}`;
                        // }
                        // setPageFrom(0);
                        // setplayerList([]);
                        // setPlayerFilter({
                        //   ...tempFilter,
                        // });
                        // applyFilter(tempFilter);
                        // Referee case

                        switch (currentSubTab) {
                          case strings.generalText:
                          case strings.playerTitle: {
                            const tempFilter = {...playerFilter};
                            tempFilter.sport = selectedSport;
                            tempFilter.sportType = selectedSportType;
                            tempFilter.location = location;
                            tempFilter.locationType = locationFilterOpetion;
                            if (minFee && maxFee) {
                              tempFilter.fee = `${minFee}-${maxFee}`;
                            }
                            setplayerList([]);
                            setPageFrom(0);
                            setPlayerFilter({
                              ...tempFilter,
                            });

                            break;
                          }
                          case strings.refereesTitle: {
                            const tempFilter = {...refereeFilters};
                            tempFilter.sport = selectedSport;
                            tempFilter.sportType = selectedSportType;

                            tempFilter.location = location;
                            tempFilter.locationType = locationFilterOpetion;
                            if (minFee && maxFee) {
                              tempFilter.fee = `${minFee}-${maxFee}`;
                            }
                            setReferees([]);
                            setRefereesPageFrom(0);
                            setrRefereeFilters({
                              ...tempFilter,
                            });
                            break;
                          }
                          case strings.scorekeeperTitle: {
                            const tempFilter = {...scoreKeeperFilters};
                            tempFilter.sport = selectedSport;
                            tempFilter.sportType = selectedSportType;
                            tempFilter.location = location;
                            tempFilter.locationType = locationFilterOpetion;
                            if (minFee && maxFee) {
                              tempFilter.fee = `${minFee}-${maxFee}`;
                            }
                            setScorekeepers([]);
                            setScorekeeperPageFrom(0);
                            setScoreKeeperFilters({
                              ...tempFilter,
                            });
                            break;
                          }
                          case strings.teamsTitleText: {
                            const tempFilter = {...teamFilters};
                            tempFilter.sport = selectedSport;
                            tempFilter.sportType = selectedSportType;

                            tempFilter.location = location;
                            tempFilter.locationType = locationFilterOpetion;
                            if (minFee && maxFee) {
                              tempFilter.fee = `${minFee}-${maxFee}`;
                            }
                            setTeams([]);
                            setTeamsPageFrom(0);
                            setTeamFilters({
                              ...tempFilter,
                            });

                            break;
                          }
                          case strings.clubsTitleText: {
                            const tempFilter = {...clubFilters};
                            tempFilter.sport = selectedSport;
                            tempFilter.sportType = selectedSportType;

                            tempFilter.location = location;
                            tempFilter.locationType = locationFilterOpetion;
                            if (minFee && maxFee) {
                              tempFilter.fee = `${minFee}-${maxFee}`;
                            }
                            setClubs([]);
                            setClubsPageFrom(0);
                            setClubFilters({
                              ...tempFilter,
                            });
                            break;
                          }
                          case strings.completedTitleText: {
                            const tempFilter = {...completedGameFilters};
                            tempFilter.sport = selectedSport;
                            tempFilter.sportType = selectedSportType;

                            tempFilter.location = location;
                            tempFilter.locationType = locationFilterOpetion;
                            if (minFee && maxFee) {
                              tempFilter.fee = `${minFee}-${maxFee}`;
                            }
                            setCompletedGame([]);
                            setCompletedGamePageFrom(0);
                            setCompletedGameFilters({
                              ...tempFilter,
                            });
                            break;
                          }
                          case strings.upcomingTitleText: {
                            const tempFilter = {...upcomingGameFilters};
                            tempFilter.sport = selectedSport;
                            tempFilter.sportType = selectedSportType;

                            tempFilter.location = location;
                            tempFilter.locationType = locationFilterOpetion;
                            if (minFee && maxFee) {
                              tempFilter.fee = `${minFee}-${maxFee}`;
                            }
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
                      }, 100);
                    }
                  }}>
                  {strings.apply}
                </Text>
              </View>
              <TCThinDivider width={'100%'} marginBottom={15} />
              <View>
                <View style={{flexDirection: 'column', margin: 15}}>
                  <View>
                    <Text style={styles.filterTitle}>Location</Text>
                  </View>
                  <View style={{marginTop: 10, marginLeft: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.filterTitle}>
                        {Utility.capitalize(strings.worldTitleText)}
                      </Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(0);
                          setLocation(strings.worldTitleText);
                        }}>
                        <Image
                          source={
                            locationFilterOpetion === 0
                              ? images.checkRoundOrange
                              : images.radioUnselect
                          }
                          style={styles.radioButtonStyle}
                        />
                      </TouchableWithoutFeedback>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.filterTitle}>
                        {strings.homeCityTitleText}
                      </Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(1);
                          setLocation(
                            authContext?.entity?.obj?.city
                              .charAt(0)
                              .toUpperCase() +
                              authContext?.entity?.obj?.city.slice(1),
                          );
                        }}>
                        <Image
                          source={
                            locationFilterOpetion === 1
                              ? images.checkRoundOrange
                              : images.radioUnselect
                          }
                          style={styles.radioButtonStyle}
                        />
                      </TouchableWithoutFeedback>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.filterTitle}>
                        {strings.currrentCityTitle}
                      </Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(2);
                          getLocation();
                        }}>
                        <Image
                          source={
                            locationFilterOpetion === 2
                              ? images.checkRoundOrange
                              : images.radioUnselect
                          }
                          style={styles.radioButtonStyle}
                        />
                      </TouchableWithoutFeedback>
                    </View>

                    <TouchableWithoutFeedback
                      onPress={() => {
                        setLocationFilterOpetion(3);
                        setSettingPopup(false);
                        navigation.navigate('SearchCityScreen', {
                          comeFrom: 'EntitySearchScreen',
                        });
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={styles.searchCityContainer}>
                          <Text style={styles.searchCityText}>
                            {route?.params?.locationText || 'Search City'}
                          </Text>
                        </View>
                        <View
                          style={{
                            alignSelf: 'center',
                          }}>
                          <Image
                            source={
                              locationFilterOpetion === 3
                                ? images.checkRoundOrange
                                : images.radioUnselect
                            }
                            style={styles.radioButtonStyle}
                          />
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'column',
                      margin: 15,
                      justifyContent: 'space-between',
                    }}>
                    <View style={{}}>
                      <Text style={styles.filterTitle}>Sport</Text>
                    </View>
                    <View style={{marginTop: 10}}>
                      <TCPicker
                        dataSource={sports}
                        placeholder={strings.selectSportTitleText}
                        onValueChange={(value) => {
                          setSelectedSport(value);
                          if (value === strings.all) {
                            setMinFee(0);
                            setMaxFee(0);
                          }
                          // setFilters({
                          //   ...filters,
                          //   sport: value,
                          // });
                        }}
                        value={selectedSport}
                      />
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'column', margin: 15}}>
                  <View>
                    <Text style={styles.filterTitle}>Available Time</Text>
                  </View>
                  <View style={{marginTop: 10}}>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                      <TouchableOpacity
                        style={styles.fieldView}
                        onPress={() => {
                          setDatePickerFor('from');
                          setShow(!show);
                        }}>
                        <View
                          style={{
                            height: 35,
                            justifyContent: 'center',
                          }}>
                          <Text style={styles.fieldTitle} numberOfLines={1}>
                            {strings.fromText}
                          </Text>
                        </View>
                        <View style={{marginRight: 15, flexDirection: 'row'}}>
                          <Text style={styles.fieldValue} numberOfLines={1}>
                            {moment(fromDate).format('MMM DD, YYYY')} {'   '}
                          </Text>
                          <Text style={styles.fieldValue} numberOfLines={1}>
                            {moment(fromDate).format('h:mm a')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        style={styles.fieldView}
                        onPress={() => {
                          setDatePickerFor('to');
                          setShow(!show);
                        }}>
                        <View
                          style={{
                            height: 35,
                            justifyContent: 'center',
                          }}>
                          <Text style={styles.fieldTitle} numberOfLines={1}>
                            {strings.toText}
                          </Text>
                        </View>
                        <View style={{marginRight: 15, flexDirection: 'row'}}>
                          <Text style={styles.fieldValue} numberOfLines={1}>
                            {moment(toDate).format('MMM DD, YYYY')} {'   '}
                          </Text>
                          <Text style={styles.fieldValue} numberOfLines={1}>
                            {moment(toDate).format('h:mm a')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: fonts.RLight,
                        color: colors.lightBlackColor,
                        textAlign: 'right',
                        marginTop: 10,
                      }}>
                      {strings.timezoneTitleText}
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: fonts.RRegular,
                          color: colors.lightBlackColor,
                          textDecorationLine: 'underline',
                        }}>
                        {'Vancouver'}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
              {selectedSport !== strings.all && (
                <View
                  style={{
                    flexDirection: 'column',
                    margin: 15,
                    justifyContent: 'space-between',
                  }}>
                  <View style={{}}>
                    <Text style={styles.filterTitle}>{strings.refereeFee}</Text>
                  </View>
                  <View style={{marginTop: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TextInput
                        onChangeText={(text) => setMinFee(text)}
                        value={minFee}
                        style={styles.minFee}
                        placeholder={strings.minPlaceholder}
                        autoCorrect={false}
                        // clearButtonMode={'always'}
                        keyboardType={'numeric'}
                        placeholderTextColor={colors.userPostTimeColor}
                      />
                      <TextInput
                        onChangeText={(text) => setMaxFee(text)}
                        value={maxFee}
                        style={styles.minFee}
                        placeholder={strings.maxPlaceholder}
                        autoCorrect={false}
                        // clearButtonMode={'always'}
                        keyboardType={'numeric'}
                        placeholderTextColor={colors.userPostTimeColor}
                      />
                    </View>
                  </View>
                </View>
              )}
              <View style={{flex: 1}} />
            </ScrollView>
          </KeyboardAvoidingView>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              Alert.alert(
                strings.areYouSureRemoveFilterText,
                '',
                [
                  {
                    text: strings.cancel,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: strings.okTitleText,
                    onPress: () => onPressReset(),
                  },
                ],
                {cancelable: false},
              );
            }}>
            <Text style={styles.resetTitle}>{strings.resetTitleText}</Text>
          </TouchableOpacity>
        </View>
        <DateTimePickerView
          date={new Date()}
          visible={show}
          onDone={handleDonePress}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          // minutesGap={30}
          mode={'datetime'}
        />
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  searchBarView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  topViewContainer: {
    // backgroundColor: '#f9c2ff',
    // padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    height: 70,
  },
  settingImage: {
    height: 20,
    width: 20,
    resizeMode: 'cover',
    alignSelf: 'center',
    position: 'absolute',
    right: 10,
  },

  separator: {
    borderRightWidth: 20,
    borderColor: colors.whiteColor,
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

  doneText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.themeColor,
  },
  locationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.veryLightGray,
  },
  viewsContainer: {
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  fieldView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    height: 40,
    alignItems: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
  },
  fieldTitle: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    marginLeft: 10,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    textAlign: 'center',
  },
  resetButton: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    elevation: 5,
    height: 30,
    width: 113,
    shadowOpacity: 0.16,
    flexDirection: 'row',
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  resetTitle: {
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    // margin: 15,
  },

  searchCityContainer: {
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    width: widthPercentageToDP('75%'),
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    justifyContent: 'center',
  },
  minFee: {
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    width: widthPercentageToDP('45%'),
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  searchCityText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
});
