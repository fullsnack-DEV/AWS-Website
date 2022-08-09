/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */
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

import _, {set} from 'lodash';
import bodybuilder from 'bodybuilder';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {func} from 'prop-types';
import Geolocation from '@react-native-community/geolocation';
import {ColorSpace} from 'react-native-reanimated';
import AuthContext from '../auth/context';
// import UserListShimmer from '../components/shimmer/commonComponents/UserListShimmer';
import {widthPercentageToDP} from '../utils';
import TCSearchProfileView from '../components/TCSearchProfileView';
import TCScrollableProfileTabs from '../components/TCScrollableProfileTabs';
import ScorekeeperInfoSection from '../components/Home/User/ScorekeeperInfoSection';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import {getGroupIndex, getUserIndex, getGameIndex} from '../api/elasticSearch';
import TCProfileView from '../components/TCProfileView';
import images from '../Constants/ImagePath';
import strings from '../Constants/String';
import * as Utility from '../utils';
import TCUpcomingMatchCard from '../components/TCUpcomingMatchCard';
import TCPlayerView from '../components/TCPlayerView';
import TCThinDivider from '../components/TCThinDivider';
import TCRefereeView from '../components/TCRefereeView';
import TCTeamSearchView from '../components/TCTeamSearchView';
import TCRecentMatchCard from '../components/TCRecentMatchCard';
import TCTagsFilter from '../components/TCTagsFilter';
import TCSearchBox from '../components/TCSearchBox';

// import ActivityLoader from '../../components/loader/ActivityLoader';

import {getLocationNameWithLatLong} from '../api/External';
import DateTimePickerView from '../components/Schedule/DateTimePickerModal';

import TCPicker from '../components/TCPicker';

let stopFetchMore = true;

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
  const [loading, setloading] = useState(true);
  const [searchMember, setSearchMember] = useState();
  const [groups, setGroups] = useState();
  const [currentTab, setCurrentTab] = useState(0);
  const [currentSubTab, setCurrentSubTab] = useState('General');

  const [playerList, setplayerList] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [referees, setReferees] = useState([]);
  const [scorekeepers, setScorekeepers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [completedGame, setCompletedGame] = useState([]);
  const [upcomingGame, setUpcomingGame] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [settingPopup, setSettingPopup] = useState(false);
  const [data, setData] = useState({
    peopleMainData: [],
    peopleFilterData: [],
  });

  // Pagination

  const [loadMore, setLoadMore] = useState(false);

  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  const [from, setFrom] = useState(0);

  const [refereesPageFrom, setRefereesPageFrom] = useState(0);
  const [scorekeeperPageFrom, setScorekeeperPageFrom] = useState(0);
  const [teamsPageFrom, setTeamsPageFrom] = useState(0);
  const [clubsPageFrom, setClubsPageFrom] = useState(0);
  const [completedGamePageFrom, setCompletedGamePageFrom] = useState(0);
  const [upcomingGamePageFrom, setUpcomingGamePageFrom] = useState(0);
  const [location, setLocation] = useState('world');
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedSportType, setSelectedSportType] = useState('All');

  const [minFee, setMinFee] = useState(0);
  const [maxFee, setMaxFee] = useState(0);
  const [playerFilter, setPlayerFilter] = useState({
    location: 'world',
    sport: 'All',
    sportType: 'All',
  });
  const [refereeFilters, setrRefereeFilters] = useState({
    location: 'world',
    sport: 'All',
  });
  const [scoreKeeperFilters, setScoreKeeperFilters] = useState({
    location: 'world',
    sport: 'All',
  });
  const [teamFilters, setTeamFilters] = useState({
    location: 'world',
    sport: 'All',
  });
  const [clubFilters, setClubFilters] = useState({
    location: 'world',
    sport: 'All',
  });
  const [completedGameFilters, setCompletedGameFilters] = useState({
    location: 'world',
    sport: 'All',
  });
  const [upcomingGameFilters, setUpcomingGameFilters] = useState({
    location: 'world',
    sport: 'All',
  });

  const TAB_ITEMS = ['People', 'Groups', 'Games', 'Posts'];
  const PEOPLE_SUB_TAB_ITEMS = [
    'General',
    'Players',
    'Referees',
    'Scorekeepers',
  ];
  const GROUP_SUB_TAB_ITEMS = ['Teams', 'Clubs', 'Leagues'];
  const GAMES_SUB_TAB_ITEMS = ['Completed', 'Upcoming'];
  const POST_SUB_TAB_ITEMS = ['ALL', 'Videos', 'Photos'];
  const body = bodybuilder().query('match', 'entity_type', 'player').build();
  const defaultPageSize = 0;
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(0);
  const [sports, setSports] = useState([]);
  const [datePickerFor, setDatePickerFor] = useState();
  const [show, setShow] = useState(false);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [sportsList] = useState(route?.params?.sportsList);
  const [sportsArray] = useState(route?.params?.sportsArray);
  console.log('route?.params?.sportsList', route?.params?.sportsList);

  const [search, setSearch] = useState('');
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
    console.log('call getPlayersList from useeffect ');

    getPlayersList();
    // getRefereesList();
    // getScoreKeepersList(filters);
    // getTeamList(filters);
    // getClubList(filters);
    // getUpcomingGameList(filters);
    // getCompletedGamesList(filters);
  }, [playerFilter]);

  useEffect(() => {
    console.log('call getRefereesList from useEffect');
    getRefereesList();
  }, [refereeFilters]);

  useEffect(() => {
    console.log('call scoreKeeperFilters from useEffect');
    getScoreKeepersList();
  }, [scoreKeeperFilters]);

  useEffect(() => {
    console.log('call getTeamList from useEffect');
    getTeamList();
  }, [teamFilters]);

  useEffect(() => {
    console.log('call getClubList from useEffect');
    getClubList();
  }, [clubFilters]);

  useEffect(() => {
    console.log('call completed game from useEffect');
    getCompletedGamesList();
  }, [completedGameFilters]);

  useEffect(() => {
    console.log('call upcomingGameFilters from useEffect');
    getUpcomingGameList();
  }, [upcomingGameFilters]);

  useEffect(() => {
    const list = [
      {
        label: 'All',
        value: 'All',
      },
    ];
    sportsList.map((obj) => {
      const dataSource = {
        label: obj.label,
        value: obj.value,
      };
      list.push(dataSource);
    });
    console.log('List --->', list);
    setSports(list);
  }, [sportsList]);

  const getPlayersList = useCallback(() => {
    console.log('call getPlayersList');
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
                    must: [{term: {'registered_sports.is_active': true}}],
                  },
                },
              },
            },
            {match: {entity_type: 'player'}},
          ],
        },
      },
    };

    // Sport filter
    if (playerFilter.sport !== 'All') {
      playersQuery.query.bool.must[0].nested.query.bool.must.push(
        {term: {'registered_sports.is_active': true}},
        {
          term: {
            'registered_sports.sport.keyword': `${playerFilter.sport.toLowerCase()}`,
          },
        },
      );
    }

    // World filter
    if (playerFilter.location !== 'world') {
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
          //   if (currentSubTab === 'Players' || currentSubTab === 'General') {
          //     setFilterData(fetchedData);
          //   }
          // } else if (isFiltering) {
          //   // Filtering case
          //   setplayerList(fetchedFilterData);
          //   setFilterData(fetchedFilterData);
          //   setPageFrom(pageFrom + pageSize);
          //   stopFetchMore = true;
          //   if (currentSubTab === 'Players' || currentSubTab === 'General') {
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
    if (refereeFilters.location !== 'world') {
      refereeQuery.query.bool.must.push({
        multi_match: {
          query: `${refereeFilters.location}`,
          fields: ['city', 'country', 'state'],
        },
      });
    }
    // Sport Filter
    if (refereeFilters.sport !== 'All') {
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
    if (scoreKeeperFilters.location !== 'world') {
      scoreKeeperQuery.query.bool.must.push({
        multi_match: {
          query: `${scoreKeeperFilters.location.toLowerCase()}`,
          fields: ['city', 'country', 'state'],
        },
      });
    }

    if (scoreKeeperFilters.sport !== 'All') {
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

    if (teamFilters.location !== 'world') {
      teamsQuery.query.bool.must.push({
        multi_match: {
          query: `${teamFilters.location.toLowerCase()}`,
          fields: ['city', 'country', 'state'],
        },
      });
    }

    if (teamFilters.sport !== 'All') {
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

    if (clubFilters.location !== 'world') {
      clubsQuery.query.bool.must.push({
        multi_match: {
          query: `${clubFilters.location.toLowerCase()}`,
          fields: ['city', 'country', 'state'],
        },
      });
    }

    if (clubFilters.sport !== 'All') {
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
    if (completedGameFilters.location !== 'world') {
      completedGameQuery.query.bool.must.push({
        multi_match: {
          query: completedGameFilters.location,
          fields: ['city', 'country', 'state', 'venue.address'],
        },
      });
    }
    // Sport filter
    if (completedGameFilters.sport !== 'All') {
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
    if (upcomingGameFilters.location !== 'world') {
      upcomingMatchQuery.query.bool.must.push({
        multi_match: {
          query: upcomingGameFilters.location,
          fields: ['city', 'country', 'state', 'venue.address'],
        },
      });
    }
    if (upcomingGameFilters.sport !== 'All') {
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
    //       tempFilter.sport = 'All';
    //       delete tempFilter.fee;
    //       setSelectedSport('All');
    //       setMinFee(0);
    //       setMaxFee(0);
    //     }
    //     if (Object.keys(item)[0] === 'location') {
    //       tempFilter.location = 'world';
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
      case 'General':
      case 'Players': {
        const tempFilter = playerFilter;
        Object.keys(tempFilter).forEach((key) => {
          if (key === Object.keys(item)[0]) {
            if (Object.keys(item)[0] === 'sport') {
              tempFilter.sport = 'All';
              delete tempFilter.fee;
              setSelectedSport('All');
              setSelectedSportType('All');
              setMinFee(0);
              setMaxFee(0);
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = 'world';
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
      case 'Referees': {
        const tempFilter = refereeFilters;
        Object.keys(tempFilter).forEach((key) => {
          if (key === Object.keys(item)[0]) {
            if (Object.keys(item)[0] === 'sport') {
              tempFilter.sport = 'All';
              delete tempFilter.fee;
              setSelectedSport('All');
              setSelectedSportType('All');
              setMinFee(0);
              setMaxFee(0);
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = 'world';
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
      case 'Scorekeepers': {
        const tempFilter = scoreKeeperFilters;
        Object.keys(tempFilter).forEach((key) => {
          if (key === Object.keys(item)[0]) {
            if (Object.keys(item)[0] === 'sport') {
              tempFilter.sport = 'All';
              delete tempFilter.fee;
              setSelectedSport('All');
              setSelectedSportType('All');
              setMinFee(0);
              setMaxFee(0);
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = 'world';
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
      case 'Teams': {
        const tempFilter = teamFilters;
        Object.keys(tempFilter).forEach((key) => {
          if (key === Object.keys(item)[0]) {
            if (Object.keys(item)[0] === 'sport') {
              tempFilter.sport = 'All';
              delete tempFilter.fee;
              setSelectedSport('All');
              setSelectedSportType('All');
              setMinFee(0);
              setMaxFee(0);
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = 'world';
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
      case 'Clubs': {
        const tempFilter = clubFilters;
        Object.keys(tempFilter).forEach((key) => {
          if (key === Object.keys(item)[0]) {
            if (Object.keys(item)[0] === 'sport') {
              tempFilter.sport = 'All';
              delete tempFilter.fee;
              setSelectedSport('All');
              setSelectedSportType('All');
              setMinFee(0);
              setMaxFee(0);
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = 'world';
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
      case 'Completed': {
        const tempFilter = completedGameFilters;
        Object.keys(tempFilter).forEach((key) => {
          if (key === Object.keys(item)[0]) {
            if (Object.keys(item)[0] === 'sport') {
              tempFilter.sport = 'All';
              delete tempFilter.fee;
              setSelectedSport('All');
              setSelectedSportType('All');
              setMinFee(0);
              setMaxFee(0);
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = 'world';
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
      case 'Upcoming': {
        const tempFilter = upcomingGameFilters;
        Object.keys(tempFilter).forEach((key) => {
          if (key === Object.keys(item)[0]) {
            if (Object.keys(item)[0] === 'sport') {
              tempFilter.sport = 'All';
              delete tempFilter.fee;
              setSelectedSport('All');
              setSelectedSportType('All');
              setMinFee(0);
              setMaxFee(0);
            }
            if (Object.keys(item)[0] === 'location') {
              tempFilter.location = 'world';
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
  const applyFilter = useCallback((fil) => {
    // getPlayersList(fil);
  }, []);

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
    setLoadMore(true);
    switch (currentTab) {
      case 0:
        if (currentSubTab === 'General' || currentSubTab === 'Players') {
          if (!stopFetchMore) {
            getPlayersList();
            stopFetchMore = true;
          }
        } else if (currentSubTab === 'Referees') {
          if (!stopFetchMore) {
            console.log('called get referee');
            getRefereesList();
            stopFetchMore = true;
          }
        } else if (currentSubTab === 'Scorekeepers') {
          if (!stopFetchMore) {
            getScoreKeepersList();
            stopFetchMore = true;
          }
        }
        break;
      case 1:
        if (currentSubTab === 'Teams') {
          if (!stopFetchMore) {
            getTeamList();
            stopFetchMore = true;
          }
        } else if (currentSubTab === 'Clubs') {
          if (!stopFetchMore) {
            getClubList();
            stopFetchMore = true;
          }
        }
        break;
      case 2:
        if (currentSubTab === 'Completed') {
          if (!stopFetchMore) {
            getCompletedGamesList();
            stopFetchMore = true;
          }
        } else if (currentSubTab === 'Upcoming') {
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
    setLoadMore(false);
  };

  const onProfilePress = (item) => {
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
  };
  const searchFilterFunction = (text) => {
    setSearch(text);
    console.log('search text value', text);
    console.log('currentSubTab==>3333', currentSubTab);

    switch (currentSubTab) {
      case 'General':
        setplayerList([]);
        setPageFrom(0);
        setPlayerFilter({
          ...playerFilter,
          searchText: text,
        });
        console.log('General filters ========>', playerFilter);
        break;
      case 'Players':
        setplayerList([]);
        setPageFrom(0);
        setPlayerFilter({
          ...playerFilter,
          searchText: text,
        });
        console.log('players filters ========>', playerFilter);
        break;
      case 'Referees':
        console.log('Referees filters ========>', refereeFilters);
        setReferees([]);
        setRefereesPageFrom(0);
        setrRefereeFilters({
          ...refereeFilters,
          searchText: text,
        });
        break;
      case 'Scorekeepers':
        setScorekeepers([]);
        setScorekeeperPageFrom(0);
        setScoreKeeperFilters({
          ...scoreKeeperFilters,
          searchText: text,
        });
        break;
      case 'Teams':
        setTeams([]);
        setTeamsPageFrom(0);
        setTeamFilters({
          ...teamFilters,
          searchText: text,
        });
        console.log('teamFilters', teamFilters);

        break;
      case 'Clubs':
        setClubs([]);
        setClubsPageFrom(0);
        setClubFilters({
          ...clubFilters,
          searchText: text,
        });
        break;
      case 'Completed':
        setCompletedGame([]);
        setCompletedGamePageFrom(0);
        setCompletedGameFilters({
          ...completedGameFilters,
          searchText: text,
        });
        break;
      case 'Upcoming':
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
      case 'General':
      case 'Players':
        setplayerList({
          location: 'world',
          sport: 'All',
        });
        setSelectedSport('All');
        setSelectedSportType('All');
        setMinFee(0);
        setMaxFee(0);
        break;
      case 'Referees':
        setReferees({
          location: 'world',
          sport: 'All',
        });
        setSelectedSport('All');
        setSelectedSportType('All');
        setMinFee(0);
        setMaxFee(0);
        break;
      case 'Scorekeepers':
        setScorekeepers({
          location: 'world',
          sport: 'All',
        });
        setSelectedSport('All');
        setSelectedSportType('All');
        setMinFee(0);
        setMaxFee(0);
        break;
      case 'Teams':
        setTeams({
          location: 'world',
          sport: 'All',
        });
        setSelectedSport('All');
        setSelectedSportType('All');
        setMinFee(0);
        setMaxFee(0);

        break;
      case 'Clubs':
        setClubs({
          location: 'world',
          sport: 'All',
        });
        setSelectedSport('All');
        setSelectedSportType('All');
        setMinFee(0);
        setMaxFee(0);
        break;
      case 'Completed':
        setCompletedGame({
          location: 'world',
          sport: 'All',
        });
        setSelectedSport('All');
        setSelectedSportType('All');
        setMinFee(0);
        setMaxFee(0);
        break;
      case 'Upcoming':
        setUpcomingGame({
          location: 'world',
          sport: 'All',
        });
        setSelectedSport('All');
        setSelectedSportType('All');
        setMinFee(0);
        setMaxFee(0);
        break;
      default:
        console.log('ddddd');
        break;
    }
  };
  const renderSearchBox = () => (
    <View style={styles.searchBarView}>
      <TCSearchBox
        editable={true}
        onChangeText={(text) => {
          searchFilterFunction(text);
        }}
      />
    </View>
  );

  const tabChangePress = useCallback((changeTab) => {
    console.log('change tab value ', changeTab);
    searchFilterFunction('');
    searchBoxRef.current.clear();
    switch (changeTab.i) {
      case 0:
        setCurrentSubTab('General');
        break;
      case 1:
        setCurrentSubTab('Teams');
        break;
      case 2:
        setCurrentSubTab('Completed');
        break;
      case 3:
        setCurrentSubTab('All');
        break;
      default:
        break;
    }
    setCurrentTab(changeTab.i);
  }, []);
  const onPressSubTabs = useCallback((item, index) => {
    setSearch('');
    setCurrentSubTab(item);
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
          GROUP_SUB_TAB_ITEMS.map((item, index) => (
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
          GAMES_SUB_TAB_ITEMS.map((item, index) => (
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
          POST_SUB_TAB_ITEMS.map((item, index) => (
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
        {currentSubTab !== 'General' && (
          <TouchableWithoutFeedback
            onPress={() => {
              setTimeout(() => {
                switch (currentSubTab) {
                  case 'General':
                  case 'Players': {
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
                  case 'Referees': {
                    console.log('LLLLLLLL', refereeFilters.location);
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
                  case 'Scorekeepers': {
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
                  case 'Teams': {
                    console.log('TTTTTTTTTTT', teamFilters);
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
                  case 'Clubs': {
                    console.log('CCCCCCCC', clubFilters);

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
                  case 'Completed': {
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
                  case 'Upcoming': {
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

  const renderUpcomingMatchItems = useCallback(({item}) => {
    console.log('Upcoming Item 123:=>', item);
    return (
      <View style={{marginBottom: 15}}>
        <TCUpcomingMatchCard data={item} cardWidth={'92%'} />
      </View>
    );
  }, []);
  const renderRecentMatchItems = useCallback(({item}) => {
    console.log('Recent Item:=>', item);
    return (
      <View style={{marginBottom: 15}}>
        <TCRecentMatchCard data={item} cardWidth={'92%'} />
      </View>
    );
  }, []);

  const renderItem = useCallback(
    ({item}) => {
      return (
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
          {currentTab === 2 && currentSubTab === 'Upcoming' && (
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
                    Alert.alert('Game ID does not exist.');
                  }
                }}
              />
            </View>
          )}
          {currentTab === 2 && currentSubTab === 'Completed' && (
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
                    Alert.alert('Game ID does not exist.');
                  }
                }}
              />
            </View>
          )}
        </View>
      );
    },
    [currentSubTab, currentTab, navigation],
  );
  const renderEntityListView = useCallback(
    ({item}) => (
      <View style={[styles.separator, {flex: 1}]}>
        <TCPlayerView data={item} showStar={false} />
      </View>
    ),
    [],
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
            (currentSubTab === 'General' &&
              Utility.getFiltersOpetions(playerFilter)) ||
            (currentSubTab === 'Players' &&
              Utility.getFiltersOpetions(playerFilter)) ||
            (currentSubTab === 'Referees' &&
              Utility.getFiltersOpetions(refereeFilters)) ||
            (currentSubTab === 'Scorekeepers' &&
              Utility.getFiltersOpetions(scoreKeeperFilters)) ||
            (currentSubTab === 'Teams' &&
              Utility.getFiltersOpetions(teamFilters)) ||
            (currentSubTab === 'Clubs' &&
              Utility.getFiltersOpetions(clubFilters)) ||
            (currentSubTab === 'Completed' &&
              Utility.getFiltersOpetions(completedGameFilters)) ||
            (currentSubTab === 'Upcoming' &&
              Utility.getFiltersOpetions(upcomingGameFilters))
          }
          onTagCancelPress={handleTagPress}
        />
      </View>
      <FlatList
        extraData={
          (currentSubTab === 'General' && playerList) ||
          (currentSubTab === 'Players' && playerList) ||
          (currentSubTab === 'Referees' && referees) ||
          (currentSubTab === 'Scorekeepers' && scorekeepers) ||
          (currentSubTab === 'Teams' && teams) ||
          (currentSubTab === 'Clubs' && clubs) ||
          (currentSubTab === 'Completed' && completedGame) ||
          (currentSubTab === 'Upcoming' && upcomingGame)
        }
        showsHorizontalScrollIndicator={false}
        data={
          (currentSubTab === 'General' && playerList) ||
          (currentSubTab === 'Players' && playerList) ||
          (currentSubTab === 'Referees' && referees) ||
          (currentSubTab === 'Scorekeepers' && scorekeepers) ||
          (currentSubTab === 'Teams' && teams) ||
          (currentSubTab === 'Clubs' && clubs) ||
          (currentSubTab === 'Completed' && completedGame) ||
          (currentSubTab === 'Upcoming' && upcomingGame)
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
          console.log('called on scroll begin');

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
                          case 'General':
                          case 'Players': {
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
                          case 'Referees': {
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
                          case 'Scorekeepers': {
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
                          case 'Teams': {
                            console.log('teamFiltersteamFilters', teamFilters);
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
                          case 'Clubs': {
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
                          case 'Completed': {
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
                          case 'Upcoming': {
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
                      console.log('DONE::');
                    }
                  }}>
                  {'Apply'}
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
                      <Text style={styles.filterTitle}>World</Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(0);
                          setLocation('world');
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
                      <Text style={styles.filterTitle}>Home City</Text>
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
                      <Text style={styles.filterTitle}>Current City</Text>
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
                        placeholder={'Select Sport'}
                        onValueChange={(value) => {
                          console.log('vaaaa', value);
                          setSelectedSport(value);
                          if (value === 'All') {
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
                            From
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
                            To
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
                      Time zone{' '}
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: fonts.RRegular,
                          color: colors.lightBlackColor,
                          textDecorationLine: 'underline',
                        }}>
                        Vancouver
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
              {selectedSport !== 'All' && (
                <View
                  style={{
                    flexDirection: 'column',
                    margin: 15,
                    justifyContent: 'space-between',
                  }}>
                  <View style={{}}>
                    <Text style={styles.filterTitle}>Referee fee</Text>
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
                        placeholder={'Min'}
                        autoCorrect={false}
                        // clearButtonMode={'always'}
                        keyboardType={'numeric'}
                        placeholderTextColor={colors.userPostTimeColor}
                      />
                      <TextInput
                        onChangeText={(text) => setMaxFee(text)}
                        value={maxFee}
                        style={styles.minFee}
                        placeholder={'Max'}
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
                'Are you sure want to reset filters?',
                '',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => onPressReset(),
                  },
                ],
                {cancelable: false},
              );
            }}>
            <Text style={styles.resetTitle}>Reset</Text>
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
