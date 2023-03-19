/* eslint-disable consistent-return */
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
  Pressable,
} from 'react-native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Carousel from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import AuthContext from '../../auth/context';
import LocationContext from '../../context/LocationContext';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import TCTitleWithArrow from '../../components/TCTitleWithArrow';
import {strings} from '../../../Localization/translation';
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
import Verbs from '../../Constants/Verbs';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import LocationModal from '../../components/LocationModal/LocationModal';

const defaultPageSize = 10;
export default function LocalHomeScreen({navigation, route}) {
  const refContainer = useRef();

  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const locationContext = useContext(LocationContext);
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
      authContext?.entity?.obj?.city?.slice(1),
  );
  const [selectedSport, setSelectedSport] = useState(strings.allType);
  const [sportType, setSportType] = useState(strings.allType);
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
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');
  const [locationSelectedViaModal, setLocationSelectedViaModal] =
    useState(false);

  const [filters, setFilters] = useState({
    sport: selectedSport,
    sport_type: sportType,
    location,
  });
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
    pointEvent,
  ]);

  useEffect(() => {
    if (isFocused) {
      getUserSettings(authContext)
        .then(async (response) => {
          await Utility.setStorage('appSetting', response.payload.app);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [authContext, isFocused]);

  useEffect(() => {
    getSportsList(authContext).then(async (res) => {
      await authContext.setSports([...res.payload]);
      const sport = [];
      res.payload.map((item) =>
        sport.push({
          label: item.sport_name,
          value: item.sport_name.toLowerCase(),
        }),
      );
      setCustomSports([...sport]);
    });
  }, []);

  useEffect(() => {
    if (route.params?.locationText) {
      setLocation(route.params.locationText);
      setFilters({
        ...filters,
        location: route.params.locationText,
      });
    }
  }, [route.params?.locationText]);

  useEffect(() => {
    if (isFocused) {
      Utility.getStorage('appSetting').then((setting) => {
        setImageBaseUrl(setting.base_url_sporticon);
      });

      Utility.getStorage('sportSetting')
        .then((setting) => {
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
                    obj.sport === o.sport && obj.sport_type === o.sport_type,
                )
              ) {
                unique.push(o);
              }
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
            return unique;
          }, []);

          setSports(result);
        });
    }
  }, [authContext, isFocused]);

  useEffect(() => {
    locationContext.setSelectedLoaction(location);
    getShortsList(
      location === strings.worldTitleText ? '_world_' : location,
      authContext,
    )
      .then((res) => {
        setloading(false);
        if (res.payload) {
          setShortsList(res.payload.results);
        }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
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

      if (location !== strings.worldTitleText) {
        recentMatchQuery.query.bool.must.push({
          multi_match: {
            query: location,
            fields: ['city', 'country', 'state', 'venue.address'],
          },
        });
      }
      if (selectedSport !== strings.allType) {
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

      if (location !== strings.worldTitleText) {
        upcomingMatchQuery.query.bool.must.push({
          multi_match: {
            query: location,
            fields: ['city', 'country', 'state', 'venue.address'],
          },
        });
      }
      if (selectedSport !== strings.allType) {
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
      // Looking Challengee query
      const availableForchallengeQuery = {
        size: defaultPageSize,
        query: {
          bool: {
            should: [
              {
                bool: {
                  must: [
                    {match: {'setting.availibility': Verbs.on}},
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
                                    Verbs.on,
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

      if (location !== strings.worldTitleText) {
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

      if (selectedSport !== strings.allType) {
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
            must: [{match: {hiringPlayers: 1}}],
          },
        },
      };

      if (location !== strings.worldTitleText) {
        recruitingPlayersQuery.query.bool.must.push({
          multi_match: {
            query: location,
            fields: ['city', 'country', 'state', 'venue.address'],
          },
        });
      }
      if (selectedSport !== strings.allType) {
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

      if (location !== strings.worldTitleText) {
        lookingQuery.query.bool.must.push({
          multi_match: {
            query: `${location}`,
            fields: ['city', 'country', 'state'],
          },
        });
      }
      if (selectedSport !== strings.allType) {
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

      if (location !== strings.worldTitleText) {
        refereeQuery.query.bool.must.push({
          multi_match: {
            query: `${location}`,
            fields: ['city', 'country', 'state'],
          },
        });
      }
      if (selectedSport !== strings.allType) {
        refereeQuery.query.bool.must[0].nested.query.bool.must.push({
          term: {
            'referee_data.sport.keyword': {
              value: selectedSport,
            },
          },
        });
      }
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
      if (location !== strings.worldTitleText) {
        scorekeeperQuery.query.bool.must.push({
          multi_match: {
            query: `${location.toLowerCase()}`,
            fields: ['city', 'country', 'state'],
          },
        });
      }
      if (selectedSport !== strings.allType) {
        scorekeeperQuery.query.bool.must[0].nested.query.bool.must.push({
          term: {
            'scorekeeper_data.sport.keyword': {
              value: selectedSport,
            },
          },
        });
      }

      getGameIndex(recentMatchQuery).then((games) => {
        Utility.getGamesList(games).then((gamedata) => {
          if (games?.length > 0) {
            setRecentMatch(gamedata);
          } else {
            setRecentMatch([]);
          }
        });
      });

      getGameIndex(upcomingMatchQuery).then((games) => {
        Utility.getGamesList(games).then((gamedata) => {
          if (games?.length > 0) {
            setUpcomingMatch(gamedata);
          } else {
            setUpcomingMatch([]);
          }
        });
      });

      getEntityIndex(availableForchallengeQuery).then((entity) => {
        setChallengeeMatch(entity);
      });

      getGroupIndex(recruitingPlayersQuery).then((teams) => {
        setHiringPlayers(teams);
      });

      getUserIndex(lookingQuery).then((players) => {
        setLookingTeam(players);
      });
      getUserIndex(refereeQuery).then((res) => {
        setReferees([...res]);
      });
      getUserIndex(scorekeeperQuery).then((res) => {
        setScorekeepers([...res]);
      });

      // });
    }
  }, [authContext, isFocused, location, selectedSport, sportType]);

  const sportsListView = useCallback(
    ({item, index}) => (
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
          if (item.sport === strings.moreText) {
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
        {item.sport === strings.allType
          ? strings.allType
          : item.sport === strings.moreText
          ? strings.moreText
          : Utility.getSportName(item, authContext)}
      </Text>
    ),
    [authContext, filters, selectedSport, sportType],
  );

  const onShortPress = useCallback(
    ({index}) => {
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
  const renderRecentMatchItems = useCallback(
    ({item}) => (
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
    ),
    [],
  );

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
    ({item}) => (
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
    ),
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
          sportIcon={getSportIcon(Verbs.entityTypePlayer, item)}
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

  const renderRefereeListView = useCallback(
    ({item}) => (
      <View style={{marginBottom: 15}}>
        <TCEntityView
          sportIcon={getSportIcon(Verbs.entityTypeReferee, item)}
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

  const renderScorekeeperListView = useCallback(
    ({item}) => (
      <View style={{marginBottom: 15}}>
        <TCEntityView
          sportIcon={getSportIcon(Verbs.entityTypeScorekeeper, item)}
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

  const getSportIcon = useCallback(
    (type, data) => {
      if (type === Verbs.entityTypePlayer) {
        if (selectedSport !== strings.all) {
          const pSport = data.registered_sports.filter(
            (obj) =>
              obj.sport === selectedSport && obj.sport_type === sportType,
          );
          if (pSport.length > 0) {
            return {uri: global.sport_icon_baseurl + pSport?.[0]?.sport_image};
          }

          return images.soccerImage;
        }
      }
      if (type === Verbs.entityTypeReferee) {
        if (selectedSport !== strings.all) {
          const pSport = data.referee_data.filter(
            (obj) =>
              obj.sport === selectedSport && obj.sport_type === sportType,
          );
          if (pSport.length > 0) {
            return {uri: global.sport_icon_baseurl + pSport?.[0]?.sport_image};
          }

          return images.soccerImage;
        }
      }
      if (type === Verbs.entityTypeScorekeeper) {
        if (selectedSport !== strings.all) {
          const pSport = data.scorekeeper_data.filter(
            (obj) =>
              obj.sport === selectedSport && obj.sport_type === sportType,
          );

          if (pSport.length > 0) {
            return {uri: global.sport_icon_baseurl + pSport?.[0]?.sport_image};
          }

          return images.soccerImage;
        }
      }
    },
    [selectedSport, sportType],
  );

  const renderSeparator = () => (
    <View
      style={{
        height: 50,
        width: 15,
      }}
    />
  );

  const getLocation = () => {
    setloading(true);
    getGeocoordinatesWithPlaceName(Platform.OS)
      .then((currentLocation) => {
        setloading(false);
        if (currentLocation.position) {
          setLocation(
            currentLocation.city?.charAt(0).toUpperCase() +
              currentLocation.city?.slice(1),
          );
          setFilters({
            ...filters,
            location:
              currentLocation.city?.charAt(0).toUpperCase() +
              currentLocation.city?.slice(1),
          });
          setSelectedLocationOption(0);
        }
      })
      .catch((e) => {
        setloading(false);
        if (e.message !== strings.userdeniedgps) {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        }
      });
  };

  const renderImageProgress = useMemo(() => <ImageProgress />, []);

  const createPostAfterUpload = useCallback(
    (dataParams) => {
      let body = dataParams;

      if (
        authContext.entity.role === Verbs.entityTypeClub ||
        authContext.entity.role === Verbs.entityTypeTeam
      ) {
        body = {
          ...dataParams,
          group_id: authContext.entity.uid,
        };
      }
      createPost(body, authContext)
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

  const renderSportsView = useCallback(
    ({item}) =>
      item.sport !== strings.allType && (
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
              <FastImage
                resizeMode={'contain'}
                source={{uri: `${image_base_url}${item.player_image}`}}
                style={styles.sportsIcon}
              />
              <Text style={styles.sportNameTitle}>
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

  const handleSetLocationOptions = (locations) => {
    if ('address' in locations) {
      setLocation(locations?.address);
    } else {
      setLocation(locations?.city);
    }
    setLocationSelectedViaModal(true);
    setLocationPopup(false);
  };
  const getLocationOption = () => {
    if (selectedLocationOption === 0) {
      return 2;
    }
    if (selectedLocationOption === 1) {
      return 1;
    }
    if (selectedLocationOption === 2) {
      return 0;
    }
    if (selectedLocationOption === 3) {
      return 3;
    }
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
                    sportsArray: customSports,
                  });
                }}>
                <Image
                  source={images.home_search}
                  style={styles.townsCupIcon}
                />
              </TouchableOpacity>
            </View>
          }
        />
        <View style={styles.separateLine} testID="local-home-screen" />
        <View style={styles.sportsListView}>
          <FlatList
            ref={refContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={[
              ...[
                {
                  sport: strings.allType,
                  sport_type: strings.allType,
                },
              ],
              ...sports.slice(0, 12),
            ]}
            keyExtractor={keyExtractor}
            renderItem={sportsListView}
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
          {sports.length > 12 && (
            <Text
              style={
                selectedSport === strings.moreText
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
              {strings.moreText}
            </Text>
          )}
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
              format(
                strings.pauseUnpauseAccountText,
                authContext?.entity?.obj?.is_pause === true
                  ? strings.unpausesmall
                  : strings.reactivatesmall,
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
                    onStartPress={() => Alert.alert(strings.okTitleText)}
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
                    placeholderText={strings.noPlayerTeamText}
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
                  const data = {
                    sport: filters.sport,
                    sport_type: filters.sport_type,
                    location,
                  };
                  const option = getLocationOption();
                  navigation.navigate('RefereesListScreen', {
                    filters: data,
                    locationOption: option,
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
                renderItem={renderRefereeListView}
                style={{marginLeft: 15}}
                ListEmptyComponent={() => (
                  <TCEntityListPlaceholder
                    cardWidth={'94%'}
                    placeholderText={strings.refereesPlaceholderText}
                  />
                )}
              />
            </View>

            <View>
              <TCTitleWithArrow
                title={strings.scorekeeperTitle}
                showArrow={true}
                viewStyle={{marginTop: 20, marginBottom: 15}}
                onPress={() => {
                  const data = {
                    sport: filters.sport,
                    sport_type: filters.sport_type,
                    location,
                  };
                  const option = getLocationOption();
                  navigation.navigate('ScorekeeperListScreen', {
                    filters: data,
                    locationOption: option,
                  });
                }}
              />
              <FlatList
                horizontal={true}
                scrollEnabled={scorekeepers?.length > 0}
                showsHorizontalScrollIndicator={false}
                data={scorekeepers}
                ItemSeparatorComponent={renderSeparator}
                keyExtractor={keyExtractor}
                renderItem={renderScorekeeperListView}
                style={{marginLeft: 15}}
                ListEmptyComponent={() => (
                  <TCEntityListPlaceholder
                    cardWidth={'94%'}
                    placeholderText={strings.scorekeepersPlaceholderText}
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
                      groupTeam: strings.teamstitle,
                      groupClub: strings.clubstitle,
                      groupLeague: strings.leaguesTitle,
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
                  />
                )}
              />
            </View>
          </ScrollView>
        </View>
      )}
      <Modal
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
              {strings.cancel}
            </Text>
            <Text style={styles.locationText}>Location</Text>
          </View>
          <TCThinDivider width={'100%'} marginBottom={15} />
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.setParams({locationText: null});
              getLocation();
              setTimeout(() => {
                setLocationPopup(false);
              }, 300);
            }}>
            {selectedLocationOption === 0 ? (
              <View style={styles.backgroundViewSelected}>
                <Text
                  style={[
                    styles.curruentLocationText,
                    {color: colors.orangeGradientColor},
                  ]}>
                  {strings.locationTitle}
                </Text>
              </View>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.curruentLocationText}>
                  {strings.locationTitle}
                </Text>
              </View>
            )}
          </TouchableWithoutFeedback>

          <LocationModal
            visibleLocationModal={visibleLocationModal}
            title={strings.cityStateOrCountryTitle}
            setVisibleLocationModalhandler={() =>
              setVisibleLocationModal(false)
            }
            onLocationSelect={handleSetLocationOptions}
            placeholder={strings.searchTitle}
            type={'country'}
          />

          <TouchableWithoutFeedback
            onPress={() => {
              setSelectedLocationOption(1);
              setLocation(
                authContext.entity.obj.city?.charAt(0).toUpperCase() +
                  authContext.entity.obj.city?.slice(1),
              );
              setFilters({
                ...filters,
                location:
                  authContext.entity.obj.city?.charAt(0).toUpperCase() +
                  authContext.entity.obj.city?.slice(1),
              });
              navigation.setParams({locationText: null});
              setTimeout(() => {
                setLocationPopup(false);
              }, 300);
            }}>
            {selectedLocationOption === 1 ? (
              <View style={styles.backgroundViewSelected}>
                <Text
                  style={[
                    styles.myCityText,
                    {color: colors.orangeGradientColor},
                  ]}>
                  {strings.homeCityText}
                </Text>
              </View>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.myCityText}>{strings.homeCityText}</Text>
              </View>
            )}
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setSelectedLocationOption(2);
              navigation.setParams({locationText: null});
              setLocation(strings.worldTitleText);
              setFilters({
                ...filters,
                location: strings.worldTitleText,
              });

              setTimeout(() => {
                setLocationPopup(false);
              }, 300);
            }}>
            {selectedLocationOption === 2 ? (
              <View style={styles.backgroundViewSelected}>
                <Text
                  style={[
                    styles.worldText,
                    {color: colors.orangeGradientColor},
                  ]}>
                  {strings.world}
                </Text>
              </View>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.worldText}>{strings.world}</Text>
              </View>
            )}
          </TouchableWithoutFeedback>
          <Text style={styles.orText}>{strings.OrCaps}</Text>

          {locationSelectedViaModal ? (
            <>
              {selectedLocationOption === 3 ? (
                <Pressable
                  onPress={() => {
                    setSelectedLocationOption(3);
                    setVisibleLocationModal(true);
                  }}
                  style={[
                    styles.backgroundViewSelected,
                    {alignItems: 'center'},
                  ]}>
                  <Text
                    style={[
                      styles.worldText,
                      {color: colors.orangeGradientColor},
                    ]}>
                    {location}
                  </Text>

                  <Text style={styles.chnageWordText}>
                    {strings.changecapital}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.backgroundView}
                  onPress={() => {
                    setSelectedLocationOption(3);
                    setVisibleLocationModal(true);
                  }}>
                  <Text style={styles.worldText}>{location}</Text>
                  <Text style={styles.chnageWordText}>
                    {strings.changecapital}
                  </Text>
                </Pressable>
              )}
            </>
          ) : (
            <>
              <Pressable
                style={styles.sectionStyle}
                onPress={() => {
                  setSelectedLocationOption(3);
                  setVisibleLocationModal(true);
                }}>
                <Text style={styles.searchText}>{strings.searchTitle}</Text>
              </Pressable>
            </>
          )}

          {/* <Pressable
            style={styles.sectionStyle}
            onPress={() => {
              setVisibleLocationModal(true);
            }}>
            <Text style={styles.searchText}>{strings.searchTitle}</Text>
          </Pressable> */}
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
            <Pressable
              hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => {
                setSettingPopup(false);
              }}>
              <Image source={images.crossImage} style={styles.closeButton} />
            </Pressable>
            <Text style={styles.moreText}>{strings.more}</Text>
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
                <Text style={styles.addSportsTitle}>
                  {strings.addDeleteSports}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

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
  backgroundViewSelected: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: colors.orangeGradientColor,
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

  chnageWordText: {
    fontSize: 12,
    position: 'absolute',
    right: 18,

    color: colors.userPostTimeColor,
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
