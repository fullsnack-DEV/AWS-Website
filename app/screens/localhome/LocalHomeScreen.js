/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
import React, {
  useCallback,
  Fragment,
  useState,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
} from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';
import Geolocation from '@react-native-community/geolocation';
import bodybuilder from 'bodybuilder';

import Modal from 'react-native-modal';

import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import { useIsFocused } from '@react-navigation/native';
import { getLocationNameWithLatLong } from '../../api/External';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import TCTitleWithArrow from '../../components/TCTitleWithArrow';
import strings from '../../Constants/String';
import { getShortsList, getSportsList } from '../../api/Games'; // getRecentGameDetails
import * as Utility from '../../utils';

import {
  getEntityIndex,
  getGameIndex,
  getGroupIndex,
  getUserIndex,
} from '../../api/elasticSearch';
import { gameData } from '../../utils/constant';
import ShortsCard from '../../components/ShortsCard';
import { getHitSlop, widthPercentageToDP } from '../../utils';
import TCChallengerCard from '../../components/TCChallengerCard';
import TCHiringPlayersCard from '../../components/TCHiringPlayersCard';
import TCEntityView from '../../components/TCEntityView';
import TCRecentMatchCard from '../../components/TCRecentMatchCard';
import TCThinDivider from '../../components/TCThinDivider';
import TCGameCardPlaceholder from '../../components/TCGameCardPlaceholder';
import TCTeamsCardPlaceholder from '../../components/TCTeamsCardPlaceholder';
import TCEntityListPlaceholder from '../../components/TCEntityListPlaceholder';
import Header from '../../components/Home/Header';
import LocalHomeScreenShimmer from '../../components/shimmer/localHome/LocalHomeScreenShimmer';
import { getAppSettings } from '../../api/Users';
import TCUpcomingMatchCard from '../../components/TCUpcomingMatchCard';

const defaultPageSize = 5;
export default function LocalHomeScreen({ navigation, route }) {
  const refContainer = useRef();
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [sports, setSports] = useState([]);

  const [locationPopup, setLocationPopup] = useState(false);
  const [selectedLocationOption, setSelectedLocationOption] = useState();
  const [selectedSettingOption, setSelectedSettingOption] = useState();

  const [location, setLocation] = useState(
    authContext?.entity?.obj?.city.charAt(0).toUpperCase()
      + authContext?.entity?.obj?.city.slice(1),
  );

  const [selectedSport, setSelectedSport] = useState('All');
  const [sportType, setSportType] = useState('');

  const [settingPopup, setSettingPopup] = useState(false);

  const [shortsList, setShortsList] = useState([]);

  const [recentMatch, setRecentMatch] = useState([]);

  const [upcomingMatch, setUpcomingMatch] = useState([]);
  const [challengeeMatch, setChallengeeMatch] = useState([]);
  const [hiringPlayers, setHiringPlayers] = useState([]);
  const [lookingTeam, setLookingTeam] = useState([]);
  const [referees, setReferees] = useState([]);
  const [scorekeepers, setScorekeepers] = useState([]);

  const [filters, setFilters] = useState({
    sport: selectedSport,
    sport_type: sportType,
    location,
  });

  console.log('authContext', authContext);

  useEffect(() => {
    if (isFocused) {
      getSportsList(authContext).then(async (res) => {
        await authContext.setSports([...res.payload]);
        await Utility.setStorage('sportsList', res.payload);
      });
    }
  }, []);

  useEffect(() => {
    if (route?.params?.locationText) {
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
    if (isFocused) {
      getAppSettings(authContext)
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
  }, [authContext]);

  useEffect(() => {
    Utility.getStorage('sportSetting')
      .then((setting) => {
        console.log('Setting::1::=>', setting);
        if (setting === null) {
          const arr = [];

          // const refereeSport = authContext?.entity?.auth?.user?.referee_data || [];
          // const scorekeeperSport = authContext?.entity?.auth?.user?.scorekeeper_data || [];
          const playerSport = authContext?.entity?.auth?.user?.registered_sports || [];

          const allSports = [
            ...arr,
            // ...refereeSport,
            // ...scorekeeperSport,
            ...playerSport,
          ];
          const uniqSports = {};
          const uniqueSports = allSports.filter(
            (obj) => !uniqSports[obj.sport] && (uniqSports[obj.sport] = true),
          );

          const result = uniqueSports.map((obj) => ({
            sport: obj.sport,
          }));
          setSports(result);
          console.log('Unique sport:=>', result);
        } else {
          setSports([...setting]);
        }
      })
      // eslint-disable-next-line no-unused-vars
      .catch((e) => {
        Alert.alert('Can not fetch local sport setting.');
      });
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
              { match: { status: 'accepted' } },
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
        sort: [{ actual_enddatetime: 'desc' }],
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
      console.log('Recent match Query:=>', recentMatchQuery);
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
        sort: [{ actual_enddatetime: 'desc' }],
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
                    { match: { 'setting.availibility': 'On' } },
                    { term: { entity_type: 'team' } },
                  ],
                },
              },
              {
                bool: {
                  must: [
                    { match: { entity_type: 'player' } },
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
        availableForchallengeQuery.query.bool.should[1].bool.must.push({
          multi_match: {
            query: location,
            fields: ['city', 'country', 'state', 'venue.address'],
          },
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
      console.log(
        'Available For challengeQuery  match Query:=>',
        JSON.stringify(availableForchallengeQuery),
      );
      // Looking Challengee query

      // Hiring player query

      const recruitingPlayersQuery = {
        size: defaultPageSize,
        query: {
          bool: {
            must: [{ match: { hiringPlayers: true } }],
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
        'Recruiting player  match Query:=>',
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
            must: [{ term: { 'referee_data.is_published': true } }],
          },
        },
      };
      if (location !== 'world') {
        refereeQuery.query.bool.must.push({
          multi_match: {
            query: `${location}`,
            fields: ['city', 'country', 'state'],
          },
        });
      }
      if (selectedSport !== 'All') {
        refereeQuery.query.bool.must.push({
          term: {
            'referee_data.sport.keyword': {
              value: selectedSport,
            },
          },
        });
      }
      // Referee query

      // Scorekeeper query
      const scorekeeperQuery = {
        size: defaultPageSize,
        query: {
          bool: {
            must: [{ term: { 'scorekeeper_data.is_published': true } }],
          },
        },
      };
      if (location !== 'world') {
        scorekeeperQuery.query.bool.must.push({
          multi_match: {
            query: `${location}`,
            fields: ['city', 'country', 'state'],
          },
        });
      }
      if (selectedSport !== 'All') {
        scorekeeperQuery.query.bool.must.push({
          term: {
            'scorekeeper_data.sport.keyword': {
              value: selectedSport,
            },
          },
        });
      }
      // Scorekeeper Query

      getGameIndex(recentMatchQuery).then((games) => {
        console.log('Recent match response :=>', games);

        Utility.getGamesList(games).then((gamedata) => {
          if (games.length === 0) {
            setRecentMatch([]);
          } else {
            setRecentMatch(gamedata);
          }
        });
      });

      getGameIndex(upcomingMatchQuery).then((games) => {
        console.log('Upcoming match response :=>', games);

        Utility.getGamesList(games).then((gamedata) => {
          if (games.length === 0) {
            setUpcomingMatch([]);
          } else {
            setUpcomingMatch(gamedata);
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

      getUserIndex(refereeQuery)
        .then((res) => {
          console.log('res referee list:=>', res);
          setReferees([...res]);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e);
          }, 10);
        });

      getUserIndex(scorekeeperQuery)
        .then((res) => {
          console.log('res scorekeeper list:=>', res);
          setScorekeepers([...res]);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e);
          }, 10);
        });

      // });
    }
  }, [authContext, isFocused, location, selectedSport, sportType]);

  const sportsListView = useCallback(
    ({ item, index }) => (
      <Text
        style={
          selectedSport === item.sport && sportType === item.sport_type
            ? [
                styles.sportName,
                { color: colors.themeColor, fontFamily: fonts.RBlack },
              ]
            : styles.sportName
        }
        onPress={() => {
          refContainer.current.scrollToIndex({
            animated: true,
            index,
            viewPosition: 0.5,
          });
          console.log('selected sport::=>', item.sport);
          setSelectedSport(item.sport);
          setSportType(item.sport_type);
          setFilters({
            ...filters,
            sport: item.sport,
            sport_type: item.sport_type,
          });
        }}>
        {item.sport === 'All' ? 'All' : Utility.getSportName(item, authContext)}
      </Text>
    ),
    [authContext, filters, selectedSport, sportType],
  );

  const onShortPress = useCallback(
    ({ index }) => {
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
    ({ item, index }) => (
      <ShortsCard
        cardItem={item}
        onPress={({ cardItem }) => onShortPress({ index, cardItem })}
      />
    ),
    [onShortPress],
  );
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderRecentMatchItems = useCallback(({ item }) => {
    console.log('Recent Item:=>', item);
    return (
      <View style={{ marginBottom: 15 }}>
        <TCRecentMatchCard data={item} cardWidth={'92%'} />
      </View>
    );
  }, []);

  const renderGameItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCUpcomingMatchCard data={item} cardWidth={'92%'} />
      </View>
    ),
    [],
  );
  const renderChallengerItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15, flex: 1 }}>
        <TCChallengerCard
          data={item}
          entityType={item.entity_type}
          selectedSport={selectedSport}
          sportType={sportType}
        />
      </View>
    ),
    [selectedSport, sportType],
  );
  const renderHiringPlayersItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCHiringPlayersCard
          data={item}
          entityType={item.entity_type}
          selectedSport={selectedSport}
          sportType={sportType}
        />
      </View>
    ),
    [selectedSport, sportType],
  );

  const renderEntityListView = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCEntityView data={item} />
      </View>
    ),
    [],
  );

  const renderRefereesScorekeeperListView = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCEntityView data={item} showStar={true} />
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

  const renderTopHeader = useMemo(
    () => (
      <>
        <Header
          showBackgroundColor={true}
          leftComponent={
            <View>
              <FastImage
                source={images.tc_message_top_icon}
                resizeMode={'contain'}
                style={styles.backImageStyle}
              />
            </View>
          }
          centerComponent={
            <TouchableOpacity
              style={styles.titleHeaderView}
              onPress={() => {
                setLocationPopup(true);
              }}
              hitSlop={getHitSlop(15)}>
              <Text style={styles.headerTitle}>
                {location.charAt(0).toUpperCase() + location.slice(1)}
              </Text>
              <Image source={images.home_gps} style={styles.gpsIconStyle} />
            </TouchableOpacity>
          }
          rightComponent={
            <View style={styles.rightHeaderView}>
              <TouchableOpacity>
                <Image
                  source={images.home_search}
                  style={styles.townsCupIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSettingPopup(true)}>
                <Image
                  source={images.home_setting}
                  style={styles.townsCupIcon}
                />
              </TouchableOpacity>
            </View>
          }
        />
        <View style={styles.separateLine} />
      </>
    ),
    [location],
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
            city.charAt(0).toUpperCase() + city.slice(1),
          );
          setLocation(city.charAt(0).toUpperCase() + city.slice(1));
          setFilters({
            ...filters,
            location: city.charAt(0).toUpperCase() + city.slice(1),
          });
        });
        console.log(position.coords.latitude);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderTopHeader}
      <TCThinDivider width={'100%'} />
      {/* <ActivityLoader visible={loading} /> */}
      {loading ? (
        <LocalHomeScreenShimmer />
      ) : (
        <Fragment>
          <View style={styles.sportsListView}>
            <FlatList
              ref={refContainer}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={[
                ...[
                  {
                    sport: 'All',
                  },
                ],
                ...sports,
              ]}
              keyExtractor={keyExtractor}
              renderItem={sportsListView}
              // initialScrollIndex={sports.indexOf(selectedSport)}
              initialNumToRender={sports.length}
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
                width: '100%',
                height: 50,
                alignContent: 'center',
              }}
            />
          </View>

          <ScrollView>
            {recentMatch.length > 0 && (
              <View>
                {/* <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={[
                  'Soccer',
                  'Baseball',
                  'Basketball',
                  'Tennis Single',
                  'Tennis Double',
                ]}
                keyExtractor={keyExtractor}
                renderItem={renderStatusView}
                ListHeaderComponent={renderStatusHeader}
                contentContainerStyle={{ paddingHorizontal: 17 }}
                style={{
                  marginTop: 15,
                  alignContent: 'center',
                }}
              />
              <TCThinDivider width={'100%'} marginTop={10} /> */}
                <TCTitleWithArrow
                  isDisabled={!(recentMatch.length > 0)}
                  title={strings.recentMatchesTitle}
                  showArrow={true}
                  viewStyle={{ marginTop: 20, marginBottom: 15 }}
                  onPress={() => navigation.navigate('RecentMatchScreen', {
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
            )}
            {upcomingMatch.length > 0 && (
              <View>
                <TCTitleWithArrow
                  isDisabled={!(upcomingMatch.length > 0)}
                  title={strings.upcomingMatchesTitle}
                  showArrow={true}
                  viewStyle={{ marginTop: 20, marginBottom: 15 }}
                  onPress={() => {
                    navigation.navigate('UpcomingMatchScreen', {
                      filters,

                    });

                    // navigation.navigate('AddLogScreen')
                  }}
                />
                <Carousel
                  data={upcomingMatch}
                  scrollEnabled={upcomingMatch.length > 0}
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
            )}
            {shortsList.length > 2 && (
              <View>
                <TCTitleWithArrow
                  isDisabled={!(shortsList?.length > 0)}
                  title={strings.shortsTitle}
                  showArrow={true}
                  viewStyle={{ marginTop: 20, marginBottom: 15 }}
                />
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={shortsList}
                  keyExtractor={keyExtractor}
                  renderItem={shortsListView}
                />
              </View>
            )}
            {challengeeMatch.length > 0 && (
              <View>
                <TCTitleWithArrow
                  isDisabled={!(challengeeMatch.length > 0)}
                  title={strings.lookingForTitle}
                  showArrow={true}
                  viewStyle={{ marginTop: 20, marginBottom: 15 }}
                  onPress={() => {
                    navigation.navigate('LookingForChallengeScreen', {
                      filters,
                    });
                  }}
                />
                <Carousel
                  data={challengeeMatch}
                  scrollEnabled={challengeeMatch.length > 0}
                  renderItem={renderChallengerItems}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={1}
                  sliderWidth={widthPercentageToDP(100)}
                  itemWidth={widthPercentageToDP(94)}
                  ListEmptyComponent={() => (
                    <TCTeamsCardPlaceholder
                      data={gameData}
                      cardWidth={'94%'}
                      placeholderText={strings.challengerPlaceholderText}
                      onStartPress={async () => {
                        // const body = {
                        //   query: {
                        //     bool: {
                        //       must: [
                        //         { match: { sport: 'soccer' } },
                        //         { match: { status: 'ended' } },
                        //         {
                        //           multi_match: {
                        //             query: 'vancouver',
                        //             fields: ['city', 'country', 'state'],
                        //           },
                        //         },
                        //       ],
                        //     },
                        //   },
                        // };

                        // const a = '{ }\n{"query" : {"match" : { "message": "this is a test"}}}\n{"index": "entityindex"}\n{"query" : {"match_all" : {}}}\n';

                        console.log('Registerd sports', authContext.entity);

                        const body = bodybuilder()
                          .query('match', 'entity_type', 'player')
                          .query('match', 'registered_sports.sport', 'Tennis')
                          .query('multi_match', {
                            query: 'india',
                            fields: ['city', 'country', 'state'],
                          })
                          .build();
                        console.log('Query:=>', JSON.stringify(body));

                        getUserIndex(body)
                          .then((res) => {
                            console.log('Then s response', res);
                          })
                          .catch((err) => {
                            console.log(err.message);
                          });
                      }}
                    />
                  )}
                />
              </View>
            )}
            {hiringPlayers.length > 0 && (
              <View>
                <TCTitleWithArrow
                  isDisabled={!(hiringPlayers.length > 0)}
                  title={strings.hiringPlayerTitle}
                  showArrow={true}
                  viewStyle={{ marginTop: 20, marginBottom: 15 }}
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
                <Carousel
                  data={hiringPlayers}
                  scrollEnabled={hiringPlayers.length > 0}
                  renderItem={renderHiringPlayersItems}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={1}
                  sliderWidth={widthPercentageToDP(100)}
                  itemWidth={widthPercentageToDP(94)}
                  ListEmptyComponent={() => (
                    <TCTeamsCardPlaceholder
                      data={gameData}
                      cardWidth={'94%'}
                      placeholderText={strings.hiringPlayersPlaceholderText}
                    />
                  )}
                />
              </View>
            )}
            {lookingTeam.length > 0 && (
              <View>
                <TCTitleWithArrow
                  isDisabled={!(lookingTeam.length > 0)}
                  title={strings.lookingForTeamTitle}
                  showArrow={true}
                  viewStyle={{ marginTop: 20, marginBottom: 15 }}
                  onPress={() => navigation.navigate('LookingTeamScreen', {
                      filters,
                      sportsList: sports,
                    })
                  }
                />
                <FlatList
                  horizontal={true}
                  scrollEnabled={lookingTeam.length > 0}
                  showsHorizontalScrollIndicator={false}
                  data={lookingTeam}
                  ItemSeparatorComponent={renderSeparator}
                  keyExtractor={keyExtractor}
                  renderItem={renderEntityListView}
                  style={{ marginLeft: 15 }}
                  ListEmptyComponent={() => (
                    <TCEntityListPlaceholder
                      cardWidth={'94%'}
                      placeholderText={strings.lookingTeamsPlaceholderText}
                    />
                  )}
                />
              </View>
            )}
            {referees.length > 0 && (
              <View>
                <TCTitleWithArrow
                  title={strings.refereesTitle}
                  showArrow={true}
                  viewStyle={{ marginTop: 20, marginBottom: 15 }}
                  onPress={() => {
                    console.log('Applicable filter::=>', filters);
                    navigation.navigate('RefereesListScreen', {
                      filters,
                    });
                  }}
                />
                <FlatList
                  horizontal={true}
                  scrollEnabled={referees.length > 0}
                  showsHorizontalScrollIndicator={false}
                  data={referees}
                  ItemSeparatorComponent={renderSeparator}
                  keyExtractor={keyExtractor}
                  renderItem={renderRefereesScorekeeperListView}
                  style={{ marginLeft: 15 }}
                  ListEmptyComponent={() => (
                    <TCEntityListPlaceholder
                      cardWidth={'94%'}
                      placeholderText={strings.refereesPlaceholderText}
                    />
                  )}
                />
              </View>
            )}
            {scorekeepers.length > 0 && (
              <View>
                <TCTitleWithArrow
                  title={strings.scorekeeperTitle}
                  showArrow={true}
                  viewStyle={{ marginTop: 20, marginBottom: 15 }}
                  onPress={() => navigation.navigate('ScorekeeperListScreen', {
                      filters,

                    })
                  }
                />
                <FlatList
                  horizontal={true}
                  scrollEnabled={scorekeepers.length > 0}
                  showsHorizontalScrollIndicator={false}
                  data={scorekeepers}
                  ItemSeparatorComponent={renderSeparator}
                  keyExtractor={keyExtractor}
                  renderItem={renderRefereesScorekeeperListView}
                  style={{ marginLeft: 15 }}
                  ListEmptyComponent={() => (
                    <TCEntityListPlaceholder
                      cardWidth={'94%'}
                      placeholderText={strings.scorekeepersPlaceholderText}
                    />
                  )}
                />
              </View>
            )}
            <Modal
              onBackdropPress={() => setLocationPopup(false)}
              backdropOpacity={1}
              animationType="slide"
              hasBackdrop
              style={{
                margin: 0,
                backgroundColor: colors.blackOpacityColor,
              }}
              visible={locationPopup}>
              <View style={styles.bottomPopupContainer}>
                <View style={styles.viewsContainer}>
                  <Text
                    onPress={() => setLocationPopup(false)}
                    style={styles.cancelText}>
                    Cancel
                  </Text>
                  <Text style={styles.locationText}>Location</Text>
                  <Text style={styles.doneText}>{'            '}</Text>
                </View>
                <TCThinDivider width={'100%'} marginBottom={15} />
                <TouchableWithoutFeedback
                  onPress={() => {
                    // Geolocation.getCurrentPosition((info) => console.log('Location info:=>', info));

                    setSelectedLocationOption(0);
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
                          { color: colors.whiteColor },
                        ]}>
                        Current city
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.backgroundView}>
                      <Text style={styles.curruentLocationText}>
                        Current city
                      </Text>
                    </View>
                  )}
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setSelectedLocationOption(1);
                    console.log(
                      'Location:=>',
                      authContext?.entity?.obj?.city.charAt(0).toUpperCase()
                        + authContext?.entity?.obj?.city.slice(1),
                    );
                    setLocation(
                      authContext?.entity?.obj?.city.charAt(0).toUpperCase()
                        + authContext?.entity?.obj?.city.slice(1),
                    );
                    setFilters({
                      ...filters,
                      location:
                        authContext?.entity?.obj?.city.charAt(0).toUpperCase()
                        + authContext?.entity?.obj?.city.slice(1),
                    });

                    setTimeout(() => {
                      setLocationPopup(false);
                    }, 300);
                  }}>
                  {selectedLocationOption === 1 ? (
                    <LinearGradient
                      colors={[colors.yellowColor, colors.orangeGradientColor]}
                      style={styles.backgroundView}>
                      <Text
                        style={[styles.myCityText, { color: colors.whiteColor }]}>
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
                      <Text
                        style={[styles.worldText, { color: colors.whiteColor }]}>
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
              backdropOpacity={1}
              animationType="slide"
              hasBackdrop
              style={{
                margin: 0,
                backgroundColor: colors.blackOpacityColor,
              }}
              visible={settingPopup}>
              <View style={styles.bottomPopupContainer}>
                <View style={styles.viewsContainer}>
                  <Text
                    onPress={() => setSettingPopup(false)}
                    style={styles.cancelText}>
                    Cancel
                  </Text>
                  <Text style={styles.locationText}>Setting</Text>
                  <Text style={styles.doneText}>{'    '}</Text>
                </View>
                <TCThinDivider width={'100%'} marginBottom={15} />
                <TouchableWithoutFeedback
                  onPress={() => {
                    setSelectedSettingOption(0);
                    setTimeout(() => {
                      setLocationPopup(false);
                      setSettingPopup(false);
                    }, 100);
                    if (selectedSettingOption === 1) {
                      setSettingPopup(false);
                      setLocationPopup(true);
                    } else {
                      setSettingPopup(false);

                      setTimeout(() => {
                        navigation.navigate('SportSettingScreen', {
                          sports,
                        });
                      }, 10);
                    }
                  }}>
                  {selectedSettingOption === 0 ? (
                    <LinearGradient
                      colors={[colors.yellowColor, colors.orangeGradientColor]}
                      style={styles.backgroundView}>
                      <Text
                        style={[
                          styles.curruentLocationText,
                          { color: colors.whiteColor },
                        ]}>
                        Sports
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.backgroundView}>
                      <Text style={styles.curruentLocationText}>Sports</Text>
                    </View>
                  )}
                </TouchableWithoutFeedback>
                {/* <TouchableWithoutFeedback
                  onPress={() => setSelectedSettingOption(1)}>
                  {selectedSettingOption === 1 ? (
                    <LinearGradient
                      colors={[colors.yellowColor, colors.orangeGradientColor]}
                      style={styles.backgroundView}>
                      <Text
                        style={[styles.myCityText, { color: colors.whiteColor }]}>
                        Location
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.backgroundView}>
                      <Text style={styles.myCityText}>Location</Text>
                    </View>
                  )}
                </TouchableWithoutFeedback> */}
              </View>
            </Modal>
          </ScrollView>
        </Fragment>
      )}
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
    marginRight: 5,
    marginLeft: 25,
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
    margin: 15,
  },

  sportsListView: {
    backgroundColor: colors.whiteColor,
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    marginBottom: 5,
    elevation: 5,
  },
  bottomPopupContainer: {
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
        shadowOffset: { width: 0, height: 3 },
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
    shadowOffset: { width: 0, height: 5 },
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
    shadowOffset: { width: 0, height: 3 },
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
});
