/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
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
} from 'react-native';
import _, {set} from 'lodash';
import bodybuilder from 'bodybuilder';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import TCSearchBox from '../components/TCSearchBox';
import {getMyGroups} from '../api/Groups';
import {getUserList} from '../api/Users';
import AuthContext from '../auth/context';
// import UserListShimmer from '../components/shimmer/commonComponents/UserListShimmer';
import {getSearchEntityData} from '../utils';
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

export default function EntitySearchScreen({navigation}) {
  const authContext = useContext(AuthContext);
  // For activity indigator
  const [loading, setloading] = useState(true);
  const [searchMember, setSearchMember] = useState();
  const [groups, setGroups] = useState();
  const [currentTab, setCurrentTab] = useState(0);
  const [currentSubTab, setCurrentSubTab] = useState('Teams');

  const [searchText, setSearchText] = useState('');
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
  // const [location, setLocation] = useState(
  //   authContext?.entity?.obj?.city.charAt(0).toUpperCase() +
  //     authContext?.entity?.obj?.city.slice(1),
  // );
  const [location, setLocation] = useState('world');
  const [selectedSport, setSelectedSport] = useState('All');
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
  const defaultPageSize = 10;
  const renderSeparator = () => (
    <TCThinDivider marginTop={10} marginBottom={10} width={'100%'} />
  );
  useEffect(() => {
    console.log('Query:=>', JSON.stringify(body));
    console.log('selected tab value', currentTab);
    setLocation('world');
    getPlayersList();
    getRefereesList();
    getScoreKeepersList();
    getTeamList();
    getClubList();
    getUpcomingGameList();
    getCompletedGamesList();
  }, []);

  const getPlayersList = () => {
    getUserIndex(body)
      .then((res) => {
        console.log('player respone', res);
        setplayerList(res);
        setFilterData(res);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const getRefereesList = () => {
    console.log('location1 -->', location);
    console.log('sport1 -->', selectedSport);

    const refereeQuery = {
      size: defaultPageSize,
      query: {
        bool: {
          must: [{term: {'referee_data.is_published': true}}],
        },
      },
    };
    // Location filter
    if (location !== 'world') {
      refereeQuery.query.bool.must.push({
        multi_match: {
          query: `${location}`,
          fields: ['city', 'country', 'state'],
        },
      });
    }
    // Sport Filter
    if (selectedSport !== 'All') {
      refereeQuery.query.bool.must.push({
        term: {
          'referee_data.sport_name.keyword': {
            value: `${selectedSport.toLowerCase()}`,
            case_insensitive: true,
          },
        },
      });
    }
    console.log('Referee query:=>', JSON.stringify(refereeQuery));

    getUserIndex(refereeQuery)
      .then((res) => {
        console.log('res referee list 33:=>', res);
        setReferees([...res]);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e);
        }, 10);
      });
  };
  const getScoreKeepersList = () => {
    // Score keeper query
    const scoreKeeperQuery = {
      size: defaultPageSize,
      query: {
        bool: {
          must: [{term: {'scorekeeper_data.is_published': true}}],
        },
      },
    };
    // Location filter
    if (location !== 'world') {
      scoreKeeperQuery.query.bool.must.push({
        multi_match: {
          query: `${location}`,
          fields: ['city', 'country', 'state'],
        },
      });
    }
    // Sport Filter
    if (selectedSport !== 'All') {
      scoreKeeperQuery.query.bool.must.push({
        term: {
          'referee_data.sport_name.keyword': {
            value: `${selectedSport.toLowerCase()}`,
            case_insensitive: true,
          },
        },
      });
    }
    console.log('scoreKeeperQuery query ->', scoreKeeperQuery);
    getUserIndex(scoreKeeperQuery)
      .then((res) => {
        console.log('scorekeeper serach screen :=>', res);
        setScorekeepers([...res]);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e);
        }, 10);
      });
  };
  const getTeamList = () => {
    const teamsQuery = bodybuilder()
      .query('match', 'entity_type', 'team')
      .build();

    getGroupIndex(teamsQuery)
      .then((res) => {
        console.log('teams response :=>', res);
        setTeams([...res]);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e);
        }, 10);
      });
  };
  const getClubList = () => {
    const clubsQuery = bodybuilder()
      .query('match', 'entity_type', 'club')
      .build();
    getGroupIndex(clubsQuery)
      .then((res) => {
        console.log('clubs response :=>', res);
        setClubs([...res]);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e);
        }, 10);
      });
  };
  const getCompletedGamesList = () => {
    // Recent match query
    const completedGameQuery = {
      size: defaultPageSize,
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
    if (location !== 'world') {
      completedGameQuery.query.bool.must.push({
        multi_match: {
          query: location,
          fields: ['city', 'country', 'state', 'venue.address'],
        },
      });
    }
    // Sport filter
    if (selectedSport !== 'All') {
      completedGameQuery.query.bool.must.push({
        term: {
          'sport.keyword': {
            value: selectedSport.toLowerCase(),
            case_insensitive: true,
          },
        },
      });
    }
    getGameIndex(completedGameQuery).then((games) => {
      console.log('completed game response :=>', games);
      Utility.getGamesList(games).then((gamedata) => {
        if (games.length === 0) {
          setCompletedGame([]);
        } else {
          setCompletedGame(gamedata);
        }
      });
    });
  };
  const getUpcomingGameList = () => {
    // Upcoming match query
    const upcomingMatchQuery = {
      size: defaultPageSize,
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
    if (location !== 'world') {
      upcomingMatchQuery.query.bool.must.push({
        multi_match: {
          query: location,
          fields: ['city', 'country', 'state', 'venue.address'],
        },
      });
    }
    if (selectedSport !== 'All') {
      upcomingMatchQuery.query.bool.must.push({
        term: {
          'sport.keyword': {
            value: selectedSport.toLowerCase(),
            case_insensitive: true,
          },
        },
      });
    }
    console.log('Upcoming game Query:=>', JSON.stringify(upcomingMatchQuery));

    getGameIndex(upcomingMatchQuery).then((games) => {
      console.log('Upcoming game response :=>', games);

      Utility.getGamesList(games).then((gamedata) => {
        if (games.length === 0) {
          setUpcomingGame([]);
        } else {
          setUpcomingGame(games);
        }
      });
    });
  };

  const renderSearchBox = useMemo(
    () => (
      <View style={styles.searchBarView}>
        <TCSearchBox
          editable={true}
          onChangeText={(text) => searchFilterFunction(text)}
        />
      </View>
    ),
    [],
  );

  const searchFilterFunction = (text) => {
    setSearchText(text);
    const result = filterData.filter(
      (x) =>
        x.full_name.toLowerCase().includes(text.toLowerCase()) ||
        x.city.toLowerCase().includes(text.toLowerCase()),
    );
    if (text.length > 0) {
      setFilterData(result);
    } else {
      setFilterData(playerList);
    }
    console.log('Search item', text);
  };

  const tabChangePress = useCallback(
    (changeTab) => {
      switch (currentTab) {
        case 0:
          setFilterData(
            (currentTab.i === 0 && playerList) ||
              (currentTab.i === 1 && playerList) ||
              (currentTab.i === 2 && referees) ||
              (currentTab.i === 3 && scorekeepers),
          );
          setCurrentSubTab('General');
          break;
        case 1:
          setFilterData(
            (currentTab.i === 0 && teams) || (currentTab.i === 1 && clubs),
          );
          // setCurrentSubTab('Teams');
          setCurrentSubTab((prestate) => {
            return [...prestate];
          });
          break;
        case 2:
          setFilterData(
            (currentTab.i === 0 && completedGame) ||
              (currentTab.i === 1 && upcomingGame),
          );
          setCurrentSubTab('Completed');
          break;
        default:
          break;
      }
      setCurrentTab(changeTab.i);
    },
    [
      playerList,
      referees,
      scorekeepers,
      teams,
      clubs,
      completedGame,
      upcomingGame,
      currentTab,
    ],
  );
  const onPressSubTabs = useCallback(
    (item, index) => {
      setCurrentSubTab(item);
      switch (currentTab) {
        case 0:
          setFilterData(
            (index === 0 && playerList) ||
              (index === 1 && playerList) ||
              (index === 2 && referees) ||
              (index === 3 && scorekeepers),
          );
          break;
        case 1:
          setFilterData((index === 0 && teams) || (index === 1 && clubs));
          break;
        case 2:
          setFilterData(
            (index === 0 && completedGame) || (index === 1 && upcomingGame),
          );
          break;
        default:
          break;
      }
    },
    [
      playerList,
      referees,
      scorekeepers,
      teams,
      clubs,
      completedGame,
      upcomingGame,

      currentTab,
    ],
  );
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
                {_.startCase(item)}
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
                {_.startCase(item)}
              </Text>
            </TouchableOpacity>
          ))}
        {currentTab === 3 &&
          POST_SUB_TAB_ITEMS.map((item, index) => (
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
                {_.startCase(item)}
              </Text>
            </TouchableOpacity>
          ))}
        {currentSubTab !== 'General' && (
          <TouchableWithoutFeedback onPress={() => setSettingPopup(true)}>
            <Image source={images.homeSetting} style={styles.settingImage} />
          </TouchableWithoutFeedback>
        )}
      </View>

      // <View style={{flex: 1}}>{renderSingleTab}</View>
    ),
    [
      PEOPLE_SUB_TAB_ITEMS,
      GROUP_SUB_TAB_ITEMS,
      POST_SUB_TAB_ITEMS,
      GAMES_SUB_TAB_ITEMS,
      currentTab,
      currentSubTab,
      onPressSubTabs,
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

  const renderItem = ({item}) => {
    return (
      <View>
        {currentTab === 0 && (
          <View style={styles.topViewContainer}>
            <View style={[styles.separator, {flex: 1}]}>
              <TCPlayerView data={item} showStar={false} />
            </View>
          </View>
        )}
        {currentTab === 1 && (
          <View style={styles.topViewContainer}>
            <View style={[styles.separator, {flex: 1}]}>
              <TCTeamSearchView data={item} showStar={true} />
            </View>
          </View>
        )}
        {currentTab === 2 && currentSubTab === 'Upcoming' && (
          <View style={{marginBottom: 15}}>
            <TCUpcomingMatchCard data={item} cardWidth={'92%'} />
          </View>
        )}
        {currentTab === 2 && currentSubTab === 'Completed' && (
          <View style={{marginBottom: 15}}>
            <TCRecentMatchCard data={item} cardWidth={'92%'} />
          </View>
        )}
      </View>
    );
  };
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
    <View style={{flex: 1, backgroundColor: '#F2F2F2'}}>
      {renderSearchBox}
      <View style={{backgroundColor: '#FFFFFF'}}>
        <TCScrollableProfileTabs
          tabItem={TAB_ITEMS}
          tabVerticalScroll={false}
          onChangeTab={tabChangePress}
          currentTab={currentTab}
        />
      </View>
      {renderTabContain}
      <FlatList
        style={{backgroundColor: '#FCFCFC', padding: 15}}
        data={filterData}
        // extraData={currentSubTab}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={() => <View style={styles.sperateLine} />}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  searchBarView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    marginVertical: hp('0.5%'),
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
});

// const onProfilePress = (item) => {
//   navigation.navigate('HomeScreen', {
//     uid: ['user', 'player']?.includes(item?.entity_type)
//       ? item?.user_id
//       : item?.group_id,
//     role: ['user', 'player']?.includes(item?.entity_type)
//       ? 'user'
//       : item.entity_type,
//     backButtonVisible: true,
//     menuBtnVisible: false,
//   });
// };
