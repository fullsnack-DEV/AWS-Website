/* eslint-disable no-promise-executor-return */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
import React, {
  useCallback,
  useState,
  useContext,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import Geolocation from '@react-native-community/geolocation';

import Modal from 'react-native-modal';

import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import {useIsFocused} from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import {getLocationNameWithLatLong} from '../../api/External';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import TCTitleWithArrow from '../../components/TCTitleWithArrow';
import strings from '../../Constants/String';
import {getShortsList, getSportsList} from '../../api/Games'; // getRecentGameDetails
import * as Utility from '../../utils';

import {
  getEntityIndex,
  getGameIndex,
  getGroupIndex,
  getUserIndex,
} from '../../api/elasticSearch';
import {gameData} from '../../utils/constant';
import ShortsCard from '../../components/ShortsCard';
import {getHitSlop, widthPercentageToDP} from '../../utils';
import TCChallengerCard from '../../components/TCChallengerCard';
import TCHiringPlayersCard from '../../components/TCHiringPlayersCard';
import TCEntityView from '../../components/TCEntityView';
import TCRecentMatchCard from '../../components/TCRecentMatchCard';
import TCThinDivider from '../../components/TCThinDivider';
import TCGameCardPlaceholder from '../../components/TCGameCardPlaceholder';
import TCTeamsCardPlaceholder from '../../components/TCTeamsCardPlaceholder';
import TCEntityListPlaceholder from '../../components/TCEntityListPlaceholder';
import LocalHomeScreenShimmer from '../../components/shimmer/localHome/LocalHomeScreenShimmer';
import {getUserSettings, userActivate} from '../../api/Users';
import TCUpcomingMatchCard from '../../components/TCUpcomingMatchCard';
import {getGameHomeScreen} from '../../utils/gameUtils';
import TCShortsPlaceholder from '../../components/TCShortsPlaceholder';
import TCAccountDeactivate from '../../components/TCAccountDeactivate';
import {ImageUploadContext} from '../../context/ImageUploadContext';
import {createPost} from '../../api/NewsFeeds';
import ImageProgress from '../../components/newsFeed/ImageProgress';
import Header from '../../components/Home/Header';
import {groupUnpaused} from '../../api/Groups';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {getQBAccountType, QBupdateUser} from '../../utils/QuickBlox';

const defaultPageSize = 5;
export default function LocalHomeScreen({navigation, route}) {
  const refContainer = useRef();
  const actionSheet = useRef();
  const actionSheetTeamClub = useRef();

  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const imageUploadContext = useContext(ImageUploadContext);

  const [loading, setloading] = useState(false);
  const [sports, setSports] = useState([]);

  const [customSports, setCustomSports] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);

  const [locationPopup, setLocationPopup] = useState(false);
  const [selectedLocationOption, setSelectedLocationOption] = useState();
  const [location, setLocation] = useState(
    authContext?.entity?.obj?.city?.charAt(0).toUpperCase() +
      authContext?.entity?.obj?.city.slice(1),
  );
  const [selectedSport, setSelectedSport] = useState('All');
  const [sportType, setSportType] = useState('All');
  const [settingPopup, setSettingPopup] = useState(false);
  const [shortsList, setShortsList] = useState([]);
  const [recentMatch, setRecentMatch] = useState([]);
  const [upcomingMatch, setUpcomingMatch] = useState([]);
  const [challengeeMatch, setChallengeeMatch] = useState([]);
  const [hiringPlayers, setHiringPlayers] = useState([]);
  const [lookingTeam, setLookingTeam] = useState([]);
  const [referees, setReferees] = useState([]);
  const [scorekeepers, setScorekeepers] = useState([]);
  const [image_base_url, setImageBaseUrl] = useState();

  const [pointEvent, setPointEvent] = useState('auto');

  const [filters, setFilters] = useState({
    sport: selectedSport,
    sport_type: sportType,
    location,
  });

  console.log('Auth Object', authContext.entity.obj);

  console.log('authContextttt::=>', authContext.entity.role);
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
    pointEvent,
  ]);

  useEffect(() => {
    if (isFocused) {
      getUserSettings(authContext)
        .then(async (response) => {
          console.log('Settings:=>', response);

          await Utility.setStorage('appSetting', response.payload.app);
        })
        .catch((e) => {
          setTimeout(() => {
            console.log('catch -> local home Screen setting api');
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [authContext, isFocused]);

  useEffect(() => {
    getSportsList(authContext).then(async (res) => {
      console.log('sports list', res.payload);
      await authContext.setSports([...res.payload]);
      const sport = [];
      res.payload.map((item) =>
        sport.push({
          label: item?.sport_name,
          value: item?.sport_name.toLowerCase(),
        }),
      );
      setCustomSports([...sport]);
    });
  }, []);

  useEffect(() => {
    if (route?.params?.locationText) {
      setLocation(route?.params?.locationText);
      setFilters({
        ...filters,
        location: route?.params?.locationText,
      });
    }
  }, [route?.params?.locationText]);

  useEffect(() => {
    if (isFocused) {
      console.log(
        'authContext?.entity?.obj?.sports',
        authContext?.entity?.obj?.sports,
      );
      Utility.getStorage('appSetting').then((setting) => {
        console.log('appSetting', setting);
        setImageBaseUrl(setting.base_url_sporticon);
        console.log('IMAGE_BASE_URL', setting.base_url_sporticon);
      });

      Utility.getStorage('sportSetting')
        .then((setting) => {
          console.log('Setting::1::=>', setting);
          console.log('Favourite sport==>', authContext?.entity?.obj?.sports);
          console.log(
            'registered sport==>',
            authContext?.entity?.auth?.user?.registered_sports,
          );

          if (setting === null) {
            const playerSport =
              authContext?.entity?.auth?.user?.registered_sports || [];
            const followedSport = authContext?.entity?.obj?.sports;
            const res = ([...playerSport, ...followedSport] || []).map(
              (obj) => ({
                sport: obj.sport,
                sport_type: obj.sport_type,
                sport_name: obj.sport_name,
                player_image: obj.player_image,
              }),
            );
            const result = res.reduce((unique, o) => {
              if (
                !unique.some(
                  (obj) =>
                    obj.sport === o.sport &&
                    obj.sport_type === o.sport_type &&
                    obj.sport_name === o.sport_name &&
                    obj.player_image === o.player_image,
                )
              ) {
                unique.push(o);
              }
              // if (!unique.some((obj) => obj.sport === o.sport)) {
              //   unique.push(o);
              // }
              return unique;
            }, []);
            setSports(result);
          } else {
            const arr = [];
            for (const sport of sports) {
              const isFound = setting.filter(
                (obj) => obj.sport === sport.sport,
              );
              if (isFound.length > 0) {
                arr.push(sport);
              }
            }

            const allSport = [
              ...arr,
              ...setting,
              ...authContext?.entity?.auth?.user?.registered_sports,
            ];
            const uniqSports = {};
            const uniqueSports = allSport.filter(
              (obj) => !uniqSports[obj.sport] && (uniqSports[obj.sport] = true),
            );
            console.log('unique ==>', uniqueSports);
            setSports([...uniqueSports]);
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch((e) => {
          const playerSport =
            authContext?.entity?.auth?.user?.registered_sports || [];
          const followedSport = authContext?.entity?.obj?.sports;
          const res = ([...playerSport, ...followedSport] || []).map((obj) => ({
            sport: obj.sport,
            sport_type: obj.sport_type,
            sport_name: obj.sport_name,
            player_image: obj.player_image,
          }));
          const result = res.reduce((unique, o) => {
            if (
              !unique.some(
                (obj) =>
                  obj.sport === o.sport &&
                  obj.sport_type === o.sport_type &&
                  obj.sport_name === o.sport_name &&
                  obj.player_image === o.player_image,
              )
            ) {
              unique.push(o);
            }
            // if (!unique.some((obj) => obj.sport === o.sport)) {
            //   unique.push(o);
            // }
            return unique;
          }, []);

          setSports(result);
        });
    }
  }, [authContext, isFocused]);

  useEffect(() => {
    if (isFocused) {
      getShortsList(location === 'world' ? '_world_' : location, authContext)
        .then((res) => {
          console.log('Shorts list response:=>', res);
          setloading(false);
          if (res.payload) {
            setShortsList(res.payload.results);
          }
        })
        .catch((e) => {
          console.log('catch -> shorts list api');
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [authContext, isFocused, location]);

  useEffect(() => {
    if (isFocused) {
      // Recent match query

      const recentMatchQuery = {
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

      if (location !== 'world') {
        recentMatchQuery.query.bool.must.push({
          multi_match: {
            query: location,
            fields: ['city', 'country', 'state', 'venue.address'],
          },
        });
      }
      if (selectedSport !== 'All') {
        recentMatchQuery.query.bool.must.push({
          term: {
            'sport.keyword': {
              value: selectedSport,
            },
          },
        });
        recentMatchQuery.query.bool.must.push({
          term: {
            'sport_type.keyword': {
              value: sportType,
            },
          },
        });
      }
      // Recent match query

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
              value: selectedSport,
            },
          },
        });
        upcomingMatchQuery.query.bool.must.push({
          term: {
            'sport_type.keyword': {
              value: sportType,
            },
          },
        });
      }
      console.log(
        'Upcoming match Query:=>',
        JSON.stringify(upcomingMatchQuery),
      );

      // Upcoming match query

      // Looking Challengee query
      const availableForchallengeQuery = {
        size: defaultPageSize,
        query: {
          bool: {
            should: [
              {
                bool: {
                  must: [
                    {match: {'setting.availibility': 'On'}},
                    {term: {entity_type: 'team'}},
                    {term: {is_pause: false}},
                    {term: {player_deactivated: false}},
                  ],
                },
              },
              {
                bool: {
                  must: [
                    {match: {entity_type: 'player'}},
                    {
                      nested: {
                        path: 'registered_sports',
                        query: {
                          bool: {
                            must: [
                              {
                                match: {
                                  'registered_sports.setting.availibility':
                                    'On',
                                },
                              },
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      };

      if (location !== 'world') {
        console.log('locationlocation', location);
        availableForchallengeQuery.query.bool.should[0].bool.must.push({
          multi_match: {
            query: location,
            fields: ['city', 'country', 'state', 'venue.address'],
          },
        });

        availableForchallengeQuery.query.bool.should[1].bool.must.push({
          multi_match: {
            query: location,
            fields: ['city', 'country', 'state', 'venue.address'],
          },
        });
      }

      if (sportType === 'double') {
        availableForchallengeQuery.query.bool.should[0].bool.must.push({
          term: {player_deactivated: false},
        });
      }

      if (selectedSport !== 'All') {
        availableForchallengeQuery.query.bool.should[0].bool.must.push({
          term: {
            'sport.keyword': {
              value: selectedSport,
            },
          },
        });
        availableForchallengeQuery.query.bool.should[0].bool.must.push({
          term: {
            'sport_type.keyword': {
              value: sportType,
            },
          },
        });
        availableForchallengeQuery.query.bool.should[1].bool.must[1].nested.query.bool.must.push(
          {
            term: {
              'registered_sports.sport.keyword': {
                value: selectedSport,
              },
            },
          },
        );
        availableForchallengeQuery.query.bool.should[1].bool.must[1].nested.query.bool.must.push(
          {
            term: {
              'registered_sports.sport_type.keyword': {
                value: sportType,
              },
            },
          },
        );
      }

      // Looking Challengee query

      // Hiring player query

      const recruitingPlayersQuery = {
        size: defaultPageSize,
        query: {
          bool: {
            must: [{match: {hiringPlayers: true}}],
          },
        },
      };

      if (location !== 'world') {
        recruitingPlayersQuery.query.bool.must.push({
          multi_match: {
            query: location,
            fields: ['city', 'country', 'state', 'venue.address'],
          },
        });
      }
      if (selectedSport !== 'All') {
        recruitingPlayersQuery.query.bool.must.push({
          term: {
            'sport.keyword': {
              value: selectedSport,
            },
          },
        });
        recruitingPlayersQuery.query.bool.must.push({
          term: {
            'sport_type.keyword': {
              value: sportType,
            },
          },
        });
      }

      console.log(
        'availableForchallengeQuery:=>',
        JSON.stringify(availableForchallengeQuery),
      );

      // Hiring player query

      // Looking team query
      const lookingQuery = {
        size: defaultPageSize,
        query: {
          bool: {
            must: [
              {
                nested: {
                  path: 'registered_sports',
                  query: {
                    bool: {
                      must: [
                        {
                          match: {
                            'registered_sports.lookingForTeamClub': true,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      };

      if (location !== 'world') {
        lookingQuery.query.bool.must.push({
          multi_match: {
            query: `${location}`,
            fields: ['city', 'country', 'state'],
          },
        });
      }
      if (selectedSport !== 'All') {
        lookingQuery.query.bool.must[0].nested.query.bool.must.push({
          term: {
            'registered_sports.sport.keyword': {
              value: selectedSport,
            },
          },
        });
        lookingQuery.query.bool.must[0].nested.query.bool.must.push({
          term: {
            'registered_sports.sport_type.keyword': {
              value: sportType,
            },
          },
        });
      }

      console.log('Looking for team/club query:', JSON.stringify(lookingQuery));

      // Looking team query

      // Referee query
      const refereeQuery = {
        size: defaultPageSize,
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

      if (location !== 'world') {
        // refereeQuery.query.bool.must[0].nested.query.bool.must.push({
        //   multi_match: {
        //     query: `${location}`,
        //     fields: ['city', 'country', 'state'],
        //   },
        // });
        refereeQuery.query.bool.must.push({
          multi_match: {
            query: `${location}`,
            fields: ['city', 'country', 'state'],
          },
        });
      }
      if (selectedSport !== 'All') {
        refereeQuery.query.bool.must[0].nested.query.bool.must.push({
          term: {
            'referee_data.sport.keyword': {
              value: selectedSport,
            },
          },
        });
      }
      // Referee query
      console.log('refereeQuery:=>', JSON.stringify(refereeQuery));
      // Scorekeeper query
      const scorekeeperQuery = {
        size: defaultPageSize,
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
            ],
          },
        },
      };
      if (location !== 'world') {
        scorekeeperQuery.query.bool.must[0].nested.query.bool.must.push({
          multi_match: {
            query: `${location}`,
            fields: ['city', 'country', 'state'],
          },
        });
      }
      if (selectedSport !== 'All') {
        scorekeeperQuery.query.bool.must[0].nested.query.bool.must.push({
          term: {
            'scorekeeper_data.sport.keyword': {
              value: selectedSport,
            },
          },
        });
      }
      // Scorekeeper Query
      console.log('Recent match query :=>', recentMatchQuery);

      getGameIndex(recentMatchQuery).then((games) => {
        console.log('Recent match response :=>', games);

        Utility.getGamesList(games).then((gamedata) => {
          if (games?.length > 0) {
            setRecentMatch(gamedata);
          } else {
            setRecentMatch([]);
          }
        });
      });

      getGameIndex(upcomingMatchQuery).then((games) => {
        console.log('Upcoming match response :=>', games);

        Utility.getGamesList(games).then((gamedata) => {
          if (games?.length > 0) {
            setUpcomingMatch(gamedata);
          } else {
            setUpcomingMatch([]);
          }
        });
      });

      getEntityIndex(availableForchallengeQuery).then((entity) => {
        console.log('challengee:=>', entity);
        setChallengeeMatch(entity);
      });

      getGroupIndex(recruitingPlayersQuery).then((teams) => {
        console.log('hiringPlayers::=>', teams);
        setHiringPlayers(teams);
      });

      getUserIndex(lookingQuery).then((players) => {
        console.log('lookingTeams', players);
        setLookingTeam(players);
      });

      getUserIndex(refereeQuery).then((res) => {
        console.log('res referee list:=>', res);
        setReferees([...res]);
      });

      getUserIndex(scorekeeperQuery).then((res) => {
        console.log('res scorekeeper list:=>', res);
        setScorekeepers([...res]);
      });

      // });
    }
  }, [authContext, isFocused, location, selectedSport, sportType]);

  const sportsListView = useCallback(
    ({item, index}) => {
      console.log('Localhome item:=>', item);
      console.log('item.sport', item.sport);
      console.log('sportType');

      console.log('selectedSport', selectedSport);

      return (
        <Text
          style={
            selectedSport === item.sport && sportType === item.sport_type
              ? [
                  styles.sportName,
                  {color: colors.themeColor, fontFamily: fonts.RBlack},
                ]
              : styles.sportName
          }
          onPress={() => {
            refContainer.current.scrollToIndex({
              animated: true,
              index,
              viewPosition: 0.8,
            });
            console.log('selected sport::=>', item);
            if (item.sport === 'more') {
              setTimeout(() => {
                setSettingPopup(true);
              }, 100);
              // navigation.navigate('SportSettingScreen', {
              //   sports,
              // });
            } else {
              setSelectedSport(item.sport);
              setSportType(item.sport_type);
              setFilters({
                ...filters,
                sport: item.sport,
                sport_type: item.sport_type,
              });
            }
          }}>
          {/* {item.sport === 'All'
            ? 'All'
            : item.sport === 'more'
            ? 'more'
            : Utility.getSportName(item, authContext)} */}

          {item.sport === 'All'
            ? 'All'
            : item.sport === 'more'
            ? 'more'
            : Utility.convertFirstCharacterAllWordsToUppercase(item.sport)}
        </Text>
      );
    },
    [filters, selectedSport, sportType],
  );

  const onShortPress = useCallback(
    ({index}) => {
      // setShortsModalVisible(!shortsModalVisible);
      // setSelectedShortsIndex(index + 1);
      // setSelectedShortItem(cardItem);

      navigation.navigate('ShortsPlayScreen', {
        currentPage: index + 1,
        shorts: shortsList,
        caller_id: authContext?.entity?.uid,
      });
    },
    [authContext?.entity?.uid, navigation, shortsList],
  );

  const shortsListView = useCallback(
    ({item, index}) => (
      <ShortsCard
        cardItem={item}
        onPress={({cardItem}) => onShortPress({index, cardItem})}
      />
    ),
    [onShortPress],
  );
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderRecentMatchItems = useCallback(({item}) => {
    console.log('Recent Item:=>', item);
    return (
      <View style={{marginBottom: 15}}>
        <TCRecentMatchCard
          data={item}
          cardWidth={'92%'}
          onPress={() => {
            console.log('Data sport obj:=>', item);
            const sportName = Utility.getSportName(item, authContext);
            const routeName = getGameHomeScreen(sportName);
            if (routeName) navigation.push(routeName, {gameId: item?.game_id});
          }}
        />
      </View>
    );
  }, []);

  const renderGameItems = useCallback(
    ({item}) => (
      <View style={{marginBottom: 15}}>
        <TCUpcomingMatchCard
          data={item}
          cardWidth={'92%'}
          onPress={() => {
            console.log('Data sport obj:=>', item);
            const sportName = Utility.getSportName(item, authContext);
            const routeName = getGameHomeScreen(sportName);
            if (routeName) navigation.push(routeName, {gameId: item?.game_id});
          }}
        />
      </View>
    ),
    [],
  );
  const renderChallengerItems = useCallback(
    ({item}) => {
      console.log('ttttt', item);
      return (
        <View
          style={{
            marginBottom: 15,
            flex: 1,
            backgroundColor: colors.whiteColor,
          }}>
          <TCChallengerCard
            data={item}
            entityType={item.entity_type}
            selectedSport={selectedSport}
            sportType={sportType}
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
      );
    },
    [navigation, selectedSport, sportType],
  );
  const renderHiringPlayersItems = useCallback(
    ({item}) => (
      <View style={{marginBottom: 15, backgroundColor: colors.whiteColor}}>
        <TCHiringPlayersCard
          data={item}
          entityType={item.entity_type}
          selectedSport={selectedSport}
          sportType={sportType}
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
    ),
    [navigation, selectedSport, sportType],
  );

  const renderEntityListView = useCallback(
    ({item}) => (
      <View style={{marginBottom: 15}}>
        <TCEntityView
          data={item}
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
    ),
    [],
  );

  const renderRefereesScorekeeperListView = useCallback(
    ({item}) => (
      <View style={{marginBottom: 15}}>
        <TCEntityView
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
    ),
    [],
  );
  const renderSeparator = () => (
    <View
      style={{
        height: 50,
        width: 10,
      }}
    />
  );

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
            city?.charAt(0).toUpperCase() + city?.slice(1),
          );
          setLocation(city?.charAt(0).toUpperCase() + city?.slice(1));
          setFilters({
            ...filters,
            location: city?.charAt(0).toUpperCase() + city?.slice(1),
          });
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

  const renderImageProgress = useMemo(() => <ImageProgress />, []);

  const createPostAfterUpload = useCallback(
    (dataParams) => {
      console.log('create post -> feedsScreen');
      createPost(dataParams, authContext)
        .then((response) => {
          console.log(response.payload);
        })
        .catch((e) => {
          Alert.alert('', e.messages);
        });
    },
    [authContext],
  );

  const onPressDone = useCallback(
    (data, postDesc, tagsOfEntity, format_tagged_data = []) => {
      const currentUserDetail = authContext.entity.obj;
      let dataParams = {};
      const entityID = authContext.entity.uid;
      if (entityID !== authContext.entity.uid) {
        if (
          currentUserDetail?.entity_type === 'team' ||
          currentUserDetail?.entity_type === 'club'
        ) {
          dataParams.group_id = currentUserDetail?.group_id;
          dataParams.feed_type = currentUserDetail?.entity_type;
        }
        if (
          currentUserDetail?.entity_type === 'user' ||
          currentUserDetail?.entity_type === 'player'
        ) {
          dataParams.user_id = currentUserDetail?.user_id;
        }
      }
      if (postDesc.trim().length > 0 && data?.length === 0) {
        dataParams = {
          ...dataParams,
          text: postDesc,
          tagged: tagsOfEntity ?? [],
          format_tagged_data,
        };

        createPostAfterUpload(dataParams);
      } else if (data) {
        const imageArray = data.map((dataItem) => dataItem);
        dataParams = {
          ...dataParams,
          text: postDesc && postDesc,
          attachments: [],
          tagged: tagsOfEntity ?? [],
          format_tagged_data,
        };
        imageUploadContext.uploadData(
          authContext,
          dataParams,
          imageArray,
          createPostAfterUpload,
        );
      }
    },
    [authContext, createPostAfterUpload, imageUploadContext],
  );

  const onCreateTeamActionSheetItemPress = (index) => {
    if (index === 0) {
      navigation.navigate('CreateTeamForm1');
    } else if (index === 1) {
      navigation.navigate('RegisterPlayer');
    }
  };
  const renderSportsView = useCallback(
    ({item}) =>
      item.sport !== 'All' && (
        <TouchableOpacity
          onPress={() => {
            const array = sports.filter((obj) => {
              if (obj.sport === item.sport) {
                return false;
              }
              return true;
            });
            const newArray = [item, ...array];
            setSports([...newArray]);
            Utility.setStorage('sportSetting', sports).then(() => {
              console.log('data save');
              setSettingPopup(false);
              setSelectedSport(item.sport);
              setSportType(item.sport_type);
              refContainer.current.scrollToIndex({
                animated: true,
                index: 1,
                viewPosition: 0.8,
              });
            });
          }}>
          <View style={styles.sportsBackgroundView}>
            <View style={{flexDirection: 'row'}}>
              {/* <Image
              source={{uri: `${image_base_url}${item.player_image}`}}
              style={styles.sportsIcon}
            /> */}
              <FastImage
                resizeMode={'contain'}
                source={{uri: `${image_base_url}${item.player_image}`}}
                style={styles.sportsIcon}
              />
              <Text style={styles.sportNameTitle}>
                {/* {Utility.getSportName(item, authContext)} */}
                {Utility.convertFirstCharacterAllWordsToUppercase(item.sport)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ),
    [authContext, image_base_url, sports],
  );
  const getBack = () => {
    console.log('called getback');
    setSettingPopup(true);
  };
  const onCreateGroupActionSheetItemPress = (index) => {
    if (index === 0) {
      navigation.navigate('CreateTeamForm1');
    } else if (index === 1) {
      navigation.navigate('CreateClubForm1');
    } else if (index === 2) {
      Alert.alert('This is under development');
    }
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
      <ActivityLoader visible={loading} />
      <View
        pointerEvents={pointEvent}
        style={{opacity: isAccountDeactivated ? 0.5 : 1}}>
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
            <TouchableOpacity
              style={styles.titleHeaderView}
              onPress={() => {
                setLocationPopup(true);
              }}
              hitSlop={getHitSlop(15)}>
              <Text style={styles.headerTitle}>
                {location?.charAt?.(0)?.toUpperCase() + location?.slice(1)}
              </Text>
              <Image source={images.home_gps} style={styles.gpsIconStyle} />
            </TouchableOpacity>
          }
          rightComponent={
            <View style={styles.rightHeaderView}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EntitySearchScreen', {
                    sportsList: customSports,
                  });
                }}>
                <Image
                  source={images.home_search}
                  style={styles.townsCupIcon}
                />
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => setSettingPopup(true)}>
            <Image source={images.home_setting} style={styles.townsCupIcon} />
          </TouchableOpacity> */}
            </View>
          }
        />
        <View style={styles.separateLine} />
        <View style={styles.sportsListView}>
          <FlatList
            ref={refContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={[
              ...[
                {
                  sport: 'All',
                  sport_type: 'All',
                },
              ],
              ...sports.slice(0, 12),
            ]}
            keyExtractor={keyExtractor}
            renderItem={sportsListView}
            // initialScrollIndex={sports.indexOf(selectedSport)}
            initialNumToRender={sports?.length}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise((resolve) => setTimeout(resolve, 500));
              wait.then(() => {
                refContainer.current.scrollToIndex({
                  animated: true,
                  index: info.index,
                });
              });
            }}
            style={{
              width: '90%',
            }}
          />
          <Text
            style={
              selectedSport === 'more'
                ? [
                    styles.sportName,
                    {
                      color: colors.themeColor,
                      fontFamily: fonts.RBlack,
                      marginLeft: 0,
                    },
                  ]
                : [styles.sportName, {marginLeft: 0}]
            }
            onPress={() => {
              setTimeout(() => {
                setSettingPopup(true);
              }, 100);
            }}>
            more
          </Text>
        </View>
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
      {loading ? (
        <LocalHomeScreenShimmer />
      ) : (
        <View
          pointerEvents={pointEvent}
          style={{flex: 1, opacity: isAccountDeactivated ? 0.8 : 1}}>
          <ScrollView>
            <View>
              <TCTitleWithArrow
                isDisabled={!(shortsList?.length > 0)}
                title={strings.shortsTitle}
                showArrow={true}
                viewStyle={{marginTop: 20, marginBottom: 15}}
                onPress={() => onShortPress(0, shortsList[0])}
              />
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={shortsList}
                scrollEnabled={shortsList.length > 0}
                keyExtractor={keyExtractor}
                renderItem={shortsListView}
                ListEmptyComponent={() => (
                  <TCShortsPlaceholder
                    onPress={() => {
                      navigation.navigate('WritePostScreen', {
                        comeFrom: 'LocalHomeScreen',
                        postData: authContext.entity.obj,
                        onPressDone,
                        selectedImageList: [],
                      });
                    }}
                  />
                )}
              />
            </View>

            <View>
              <TCTitleWithArrow
                isDisabled={!(recentMatch?.length > 0)}
                title={strings.recentMatchesTitle}
                showArrow={true}
                viewStyle={{marginTop: 20, marginBottom: 15}}
                onPress={() =>
                  navigation.navigate('RecentMatchScreen', {
                    filters,
                  })
                }
              />
              <Carousel
                data={recentMatch} // recentMatch
                scrollEnabled={recentMatch?.length > 0}
                renderItem={renderRecentMatchItems}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                sliderWidth={widthPercentageToDP(100)}
                itemWidth={widthPercentageToDP(94)}
                ListEmptyComponent={() => (
                  <TCGameCardPlaceholder
                    data={gameData}
                    cardWidth={'94%'}
                    placeholderText={strings.recentMatchPlaceholderText}
                    onStartPress={async () => {
                      console.log('Query');
                    }}
                  />
                )}
              />
            </View>

            <View>
              <TCTitleWithArrow
                isDisabled={!(upcomingMatch?.length > 0)}
                title={strings.upcomingMatchesTitle}
                showArrow={true}
                viewStyle={{marginTop: 20, marginBottom: 15}}
                onPress={() => {
                  navigation.navigate('UpcomingMatchScreen', {
                    filters,
                  });

                  // navigation.navigate('AddLogScreen')
                }}
              />
              <Carousel
                data={upcomingMatch}
                scrollEnabled={upcomingMatch?.length > 0}
                renderItem={renderGameItems}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                sliderWidth={widthPercentageToDP(100)}
                itemWidth={widthPercentageToDP(94)}
                ListEmptyComponent={() => (
                  <TCGameCardPlaceholder
                    data={gameData}
                    cardWidth={'94%'}
                    placeholderText={strings.upcomingMatchPlaceholderText}
                    onStartPress={() => Alert.alert('ok')}
                  />
                )}
              />
            </View>

            <View>
              <TCTitleWithArrow
                isDisabled={!(challengeeMatch?.length > 0)}
                title={strings.lookingForTitle}
                showArrow={true}
                viewStyle={{marginTop: 20, marginBottom: 15}}
                onPress={() => {
                  navigation.navigate('LookingForChallengeScreen', {
                    filters,
                  });
                }}
              />

              <FlatList
                horizontal={true}
                scrollEnabled={challengeeMatch?.length > 0}
                showsHorizontalScrollIndicator={false}
                data={challengeeMatch}
                ItemSeparatorComponent={renderSeparator}
                keyExtractor={keyExtractor}
                renderItem={renderChallengerItems}
                style={{paddingLeft: 15}}
                ListEmptyComponent={() => (
                  <TCTeamsCardPlaceholder
                    data={gameData}
                    cardWidth={'94%'}
                    placeholderText={'NO AVAILABLE TEAMS OR PLAYERS'}
                    buttonTitle={'Create a team or register as a player >'}
                    onPress={() => {
                      actionSheet.current.show();
                    }}
                  />
                )}
              />
            </View>
            <View>
              <TCTitleWithArrow
                title={strings.refereesTitle}
                showArrow={true}
                viewStyle={{marginTop: 20, marginBottom: 15}}
                onPress={() => {
                  console.log('Applicable filter::=>', filters);
                  navigation.navigate('RefereesListScreen', {
                    filters,
                  });
                }}
              />
              <FlatList
                horizontal={true}
                scrollEnabled={referees?.length > 0}
                showsHorizontalScrollIndicator={false}
                data={referees}
                ItemSeparatorComponent={renderSeparator}
                keyExtractor={keyExtractor}
                renderItem={renderRefereesScorekeeperListView}
                style={{marginLeft: 15}}
                ListEmptyComponent={() => (
                  <TCEntityListPlaceholder
                    cardWidth={'94%'}
                    placeholderText={strings.refereesPlaceholderText}
                    buttonText={'Register as Referee >'}
                    onPress={() => {
                      navigation.navigate('RegisterReferee');
                    }}
                  />
                )}
              />
            </View>

            <View>
              <TCTitleWithArrow
                title={strings.scorekeeperTitle}
                showArrow={true}
                viewStyle={{marginTop: 20, marginBottom: 15}}
                onPress={() =>
                  navigation.navigate('ScorekeeperListScreen', {
                    filters,
                  })
                }
              />
              <FlatList
                horizontal={true}
                scrollEnabled={scorekeepers?.length > 0}
                showsHorizontalScrollIndicator={false}
                data={scorekeepers}
                ItemSeparatorComponent={renderSeparator}
                keyExtractor={keyExtractor}
                renderItem={renderRefereesScorekeeperListView}
                style={{marginLeft: 15}}
                ListEmptyComponent={() => (
                  <TCEntityListPlaceholder
                    cardWidth={'94%'}
                    placeholderText={strings.scorekeepersPlaceholderText}
                    buttonText={'Register as Scorekeeper >'}
                    onPress={() => {
                      navigation.navigate('RegisterScorekeeper');
                    }}
                  />
                )}
              />
            </View>
            <View>
              <TCTitleWithArrow
                isDisabled={!(hiringPlayers?.length > 0)}
                title={strings.hiringPlayerTitle}
                showArrow={true}
                viewStyle={{marginTop: 20, marginBottom: 15}}
                onPress={() => {
                  navigation.navigate('RecruitingPlayerScreen', {
                    filters: {
                      ...filters,
                      groupTeam: 'Teams',
                      groupClub: 'Clubs',
                      groupLeague: 'Leagues',
                    },
                  });
                }}
              />

              <FlatList
                horizontal={true}
                scrollEnabled={hiringPlayers?.length > 0}
                showsHorizontalScrollIndicator={false}
                data={hiringPlayers}
                ItemSeparatorComponent={renderSeparator}
                keyExtractor={keyExtractor}
                renderItem={renderHiringPlayersItems}
                style={{paddingLeft: 15}}
                ListEmptyComponent={() => (
                  <TCTeamsCardPlaceholder
                    data={gameData}
                    cardWidth={'94%'}
                    placeholderText={strings.hiringPlayersPlaceholderText}
                    buttonTitle={'Create your group >'}
                    onPress={() => {
                      actionSheetTeamClub.current.show();
                    }}
                  />
                )}
              />
            </View>

            <View>
              <TCTitleWithArrow
                isDisabled={!(lookingTeam?.length > 0)}
                title={strings.lookingForTeamTitle}
                showArrow={true}
                viewStyle={{marginTop: 20, marginBottom: 15}}
                onPress={() =>
                  navigation.navigate('LookingTeamScreen', {
                    filters,
                    sportsList: sports,
                  })
                }
              />
              <FlatList
                horizontal={true}
                scrollEnabled={lookingTeam?.length > 0}
                showsHorizontalScrollIndicator={false}
                data={lookingTeam}
                ItemSeparatorComponent={renderSeparator}
                keyExtractor={keyExtractor}
                renderItem={renderEntityListView}
                style={{marginLeft: 15}}
                ListEmptyComponent={() => (
                  <TCEntityListPlaceholder
                    cardWidth={'94%'}
                    placeholderText={strings.lookingTeamsPlaceholderText}
                    buttonText={'Register as a player >'}
                    onPress={() => {
                      navigation.navigate('RegisterPlayer');
                    }}
                  />
                )}
              />
            </View>
          </ScrollView>
        </View>
      )}
      <Modal
        // onBackdropPress={() => setLocationPopup(false)}
        // backdropOpacity={1}
        // animationType="slide"
        // hasBackdrop
        // style={{
        //   margin: 0,
        //   backgroundColor: colors.blackOpacityColor,
        // }}
        // visible={locationPopup}

        onBackdropPress={() => setLocationPopup(false)}
        style={{
          margin: 0,
        }}
        isVisible={locationPopup}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}>
        <View style={styles.bottomPopupContainer}>
          <View style={styles.viewsContainer}>
            <Text
              onPress={() => setLocationPopup(false)}
              style={styles.cancelText}>
              Cancel
            </Text>
            <Text style={styles.locationText}>Location</Text>
          </View>
          <TCThinDivider width={'100%'} marginBottom={15} />
          <TouchableWithoutFeedback
            onPress={() => {
              // Geolocation.getCurrentPosition((info) => console.log('Location info:=>', info));

              setSelectedLocationOption(0);
              navigation.setParams({locationText: null});
              getLocation();
              // setLocation('India');

              setTimeout(() => {
                setLocationPopup(false);
              }, 300);
            }}>
            {selectedLocationOption === 0 ? (
              <LinearGradient
                colors={[colors.yellowColor, colors.orangeGradientColor]}
                style={styles.backgroundView}>
                <Text
                  style={[
                    styles.curruentLocationText,
                    {color: colors.whiteColor},
                  ]}>
                  Current city
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.curruentLocationText}>Current city</Text>
              </View>
            )}
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setSelectedLocationOption(1);
              console.log(
                'Location:=>',
                authContext?.entity?.obj?.city.charAt(0).toUpperCase() +
                  authContext?.entity?.obj?.city?.slice(1),
              );
              setLocation(
                authContext?.entity?.obj?.city?.charAt(0).toUpperCase() +
                  authContext?.entity?.obj?.city?.slice(1),
              );
              setFilters({
                ...filters,
                location:
                  authContext?.entity?.obj?.city?.charAt(0).toUpperCase() +
                  authContext?.entity?.obj?.city?.slice(1),
              });
              navigation.setParams({locationText: null});
              setTimeout(() => {
                setLocationPopup(false);
              }, 300);
            }}>
            {selectedLocationOption === 1 ? (
              <LinearGradient
                colors={[colors.yellowColor, colors.orangeGradientColor]}
                style={styles.backgroundView}>
                <Text style={[styles.myCityText, {color: colors.whiteColor}]}>
                  Home city
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.myCityText}>Home city</Text>
              </View>
            )}
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setSelectedLocationOption(2);
              navigation.setParams({locationText: null});
              setLocation('world');
              setFilters({
                ...filters,
                location: 'world',
              });

              setTimeout(() => {
                setLocationPopup(false);
              }, 300);
            }}>
            {selectedLocationOption === 2 ? (
              <LinearGradient
                colors={[colors.yellowColor, colors.orangeGradientColor]}
                style={styles.backgroundView}>
                <Text style={[styles.worldText, {color: colors.whiteColor}]}>
                  World
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.worldText}>World</Text>
              </View>
            )}
          </TouchableWithoutFeedback>
          <Text style={styles.orText}>Or</Text>

          <TouchableOpacity
            style={styles.sectionStyle}
            onPress={() => {
              setLocationPopup(false);

              navigation.navigate('SearchCityScreen', {
                comeFrom: 'LocalHomeScreen',
              });
            }}>
            <Text style={styles.searchText}>{strings.searchTitle}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
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
            {height: Dimensions.get('window').height - 50},
          ]}>
          <View style={styles.topHeaderContainer}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => {
                setSettingPopup(false);
              }}>
              <Image source={images.crossImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text style={styles.moreText}>More</Text>
          </View>
          <TCThinDivider width={'100%'} marginBottom={15} />
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={sports}
            keyExtractor={keyExtractor}
            renderItem={renderSportsView}
            style={{
              width: '100%',
              alignContent: 'center',
              marginBottom: 0,
              paddingVertical: 0,
            }}
            ListFooterComponent={() => (
              <TouchableOpacity
                style={styles.addSportsView}
                onPress={() => {
                  // setSportsListPopup(true);
                  setSettingPopup(false);
                  navigation.navigate('AddOrDeleteSport', {
                    sports: [...sports],
                    pressBack: getBack,
                  });
                }}>
                <Text style={styles.addSportsTitle}>Add or delete Sports</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
      <ActionSheet
        ref={actionSheet}
        title={'Create a team or register as a player'}
        options={['Create Team', ' Register as Player', 'Cancel']}
        cancelButtonIndex={2}
        onPress={onCreateTeamActionSheetItemPress}
      />
      <ActionSheet
        ref={actionSheetTeamClub}
        title={'Create a team or club or league'}
        options={['Create Team', ' Create Club', 'Create League', 'Cancel']}
        cancelButtonIndex={3}
        onPress={onCreateGroupActionSheetItemPress}
      />
      {renderImageProgress}
    </View>
  );
}
const styles = StyleSheet.create({
  townsCupIcon: {
    resizeMode: 'cover',
    height: 25,
    width: 25,
    marginLeft: 10,
  },
  gpsIconStyle: {
    resizeMode: 'cover',
    height: 15,
    width: 15,
  },
  titleHeaderView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  rightHeaderView: {
    flexDirection: 'row',
  },
  headerTitle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  sportName: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  sportsListView: {
    flexDirection: 'row',
    backgroundColor: colors.whiteColor,
    borderBottomColor: colors.veryLightGray,
    borderBottomWidth: 0.5,
    alignItems: 'center',
    height: 45,
  },
  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    width: widthPercentageToDP('86%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  orText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    margin: 15,
  },
  worldText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  myCityText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  curruentLocationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },

  moreText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
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
  viewsContainer: {
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  sectionStyle: {
    alignItems: 'center',
    fontSize: 15,
    fontFamily: fonts.RRegular,
    backgroundColor: colors.offwhite,
    borderRadius: 25,
    flexDirection: 'row',
    height: 45,
    paddingLeft: 17,
    paddingRight: 5,
    width: widthPercentageToDP('86%'),
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignSelf: 'center',
    elevation: 2,
    marginBottom: 15,
  },
  searchText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
  },
  backImageStyle: {
    height: 35,
    width: 35,
  },
  separateLine: {
    borderColor: colors.veryLightGray,
    borderWidth: 0.5,
  },
  // setting pop styles
  sportsIcon: {
    resizeMode: 'cover',
    height: 40,
    width: 40,
    alignSelf: 'center',
    marginLeft: 5,
    marginRight: 15,
  },

  sportNameTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    // margin: 15,
  },
  addSportsTitle: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    // margin: 15,
    paddingHorizontal: 10,
  },
  sportsBackgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 40,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    width: widthPercentageToDP('86%'),
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  addSportsView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    elevation: 5,
    flexDirection: 'row',
    height: 25,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: 10,
    marginBottom: 10,
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
  topHeaderContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
