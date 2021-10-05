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
import { getSportsList, getShortsList } from '../../api/Games'; // getRecentGameDetails
import * as Utility from '../../utils';

import {
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
import SportsListView from '../../components/localHome/SportsListView';
import TCGameCardPlaceholder from '../../components/TCGameCardPlaceholder';
import TCTeamsCardPlaceholder from '../../components/TCTeamsCardPlaceholder';
import TCEntityListPlaceholder from '../../components/TCEntityListPlaceholder';
import Header from '../../components/Home/Header';
import LocalHomeScreenShimmer from '../../components/shimmer/localHome/LocalHomeScreenShimmer';
import TCUpcomingMatch from '../../components/TCUpcomingMatch';
import { getAppSettings } from '../../api/Users';

let selectedSports = [];
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
    route?.params?.locationText ? route?.params?.locationText : authContext?.entity?.obj?.city.charAt(0).toUpperCase()
      + authContext?.entity?.obj?.city.slice(1),
  );

  const [selectedSport, setSelectedSport] = useState('Soccer');
  const [settingPopup, setSettingPopup] = useState(false);

  const [sportsPopup, setSportsPopup] = useState(false);
  const [sportsListPopup, setSportsListPopup] = useState(false);

  const [shortsList, setShortsList] = useState([]);

  const [recentMatch, setRecentMatch] = useState([]);

  const [upcomingMatch, setUpcomingMatch] = useState([]);
  const [challengeeMatch, setChallengeeMatch] = useState([]);
  const [hiringPlayers, setHiringPlayers] = useState([]);
  const [lookingTeam, setLookingTeam] = useState([]);
  const [referees, setReferees] = useState([]);
  const [scorekeepers, setScorekeepers] = useState([]);

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
    if (isFocused) {
      setloading(true);
      getSportsList(authContext)
        .then((res) => {
          setloading(false);
          if (res.payload) {
            const arr = [];
            for (const tempData of res.payload) {
              tempData.isChecked = false;
              arr.push(tempData);
            }
            setSports(arr);
            setTimeout(() => setloading(false), 1000);
          }
        })
        .catch((e) => {
          console.log('catch -> sports list api');
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
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
      const locationFilter = bodybuilder()
        .filter('multi_match', {
          query: location,
          fields: ['city', 'country', 'state'],
        })
        .build();

      // Recent match query
      const recentMatchList = bodybuilder()
        // .query('match', 'sport', selectedSport.toLowerCase())
        .filter('term', 'sport.keyword', {
          value: selectedSport.toLowerCase(),
          case_insensitive: true,
        })
        .query('range', 'start_datetime', {
          lt: parseFloat(new Date().getTime() / 1000).toFixed(0),
        })
        .sort('actual_enddatetime', 'desc')
        .build();

      let recentFilter = {
        ...recentMatchList.query.bool,
      };
      // Recent match query

      // Upcoming match query
      const upcomingMatchList = bodybuilder()
        .query('match', 'sport', selectedSport.toLowerCase())
        .query('range', 'start_datetime', {
          gt: parseFloat(new Date().getTime() / 1000).toFixed(0),
        })
        .sort('actual_enddatetime', 'desc')
        .build();

      let upcomingFilter = {
        ...upcomingMatchList.query.bool,
      };
      // Upcoming match query

      // Looking Challengee query
      const lookingChallengeeList = bodybuilder()
        .filter('match', 'entity_type', 'team')
        .filter('term', 'sport.keyword', {
          value: selectedSport.toLowerCase(),
          case_insensitive: true,
        })
        .build();
      let lookingChallengeeFilter = {
        ...lookingChallengeeList.query.bool,
      };
      // Looking Challengee query

      // Hiring player query
      const hiringPlayersList = bodybuilder()
        .filter('match', 'entity_type', 'team')
        .filter('match', 'hiringPlayers', true)
        .filter('term', 'sport.keyword', {
          value: selectedSport.toLowerCase(),
          case_insensitive: true,
        })
        .build();
      let hiringPlayerFilter = {
        ...hiringPlayersList.query.bool,
      };
      // Hiring player query

      // Looking team query
      const lookingTeamList = bodybuilder()
        .filter('term', 'registered_sports.sport_name.keyword', {
          value: selectedSport.toLowerCase(),
          case_insensitive: true,
        })
        .filter('term', 'lookingForTeam', {
          value: true,
        })
        .build();

      let lookingFilter = {
        ...lookingTeamList.query.bool,
      };
      // Looking team query

      // Referee query
      const refefreeList = bodybuilder()
        .filter('term', 'referee_data.sport_name.keyword', {
          value: selectedSport.toLowerCase(),
          case_insensitive: true,
        })
        .filter('term', 'referee_data.is_published', {
          value: true,
        })
        .build();

      let refereeFilter = {
        ...refefreeList.query.bool,
      };
      // Referee query

      // Scorekeeper query
      const scorekeeperList = bodybuilder()
        .filter('term', 'scorekeeper_data.sport_name.keyword', {
          value: selectedSport.toLowerCase(),
          case_insensitive: true,
        })
        .filter('term', 'scorekeeper_data.is_published', {
          value: true,
        })
        // .query('term', 'referee_data.sport', {
        //   value: selectedSport,
        // })
        .build();
      let scorekeeperFilter = {
        ...scorekeeperList.query.bool,
      };
      // Scorekeeper Query

      if (location !== 'world') {
        recentFilter = {
          ...locationFilter.query.bool,
        };
        upcomingFilter = {
          ...locationFilter.query.bool,
        };
        refereeFilter = {
          ...locationFilter.query.bool,
        };
        scorekeeperFilter = {
          ...locationFilter.query.bool,
        };
        lookingChallengeeFilter = {
          ...locationFilter.query.bool,
        };
        hiringPlayerFilter = {
          ...locationFilter.query.bool,
        };
        lookingFilter = {
          ...locationFilter.query.bool,
        };
      }

      const recentQuery = bodybuilder()
        .size(defaultPageSize)
        .andFilter('bool', recentFilter)
        .build();
      const upcomingQuery = bodybuilder()
        .size(defaultPageSize)
        .andFilter('bool', upcomingFilter)
        .build();
      const lookingChallengeeQuery = bodybuilder()
        .size(defaultPageSize)
        .andFilter('bool', lookingChallengeeFilter)
        .build();
      const hiringPlayerQuery = bodybuilder()
        .size(defaultPageSize)
        .andFilter('bool', hiringPlayerFilter)
        .build();
      const lookingQuery = bodybuilder()
        .size(defaultPageSize)
        .andFilter('bool', lookingFilter)
        .build();
      const refereeQuery = bodybuilder()
        .size(defaultPageSize)
        .andFilter('bool', refereeFilter)
        .build();
      const scorekeeperQuery = bodybuilder()
        .size(defaultPageSize)
        .andFilter('bool', scorekeeperFilter)
        .build();

      getGameIndex(recentQuery).then((games) => {
        console.log('Recent match response :=>', games);

        Utility.getGamesList(games).then((gamedata) => {
          if (gamedata.length === 0) {
            setRecentMatch([]);
          } else {
            setRecentMatch(gamedata);
          }
        });
      });

      getGameIndex(upcomingQuery).then((games) => {
        Utility.getGamesList(games).then((gamedata) => {
          console.log('Upcoming match response :=>', gamedata);

          if (gamedata.length === 0) {
            setUpcomingMatch([]);
          } else {
            setUpcomingMatch(gamedata);
          }
        });
      });

      getGroupIndex(lookingChallengeeQuery).then((challengee) => {
        console.log('challengee:=>', challengee);

        setChallengeeMatch(challengee);
      })

      getGroupIndex(hiringPlayerQuery).then((teams) => {
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
  }, [authContext, isFocused, location, selectedSport]);

  const isIconCheckedOrNot = useCallback(
    ({ item, index }) => {
      sports[index].isChecked = !item.isChecked;
      setSports([...sports]);
      selectedSports = sports.filter((e) => e.isChecked);
    },
    [sports],
  );
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerLeft: () => (
  //       // <Image source={images.townsCupIcon} style={styles.townsCupIcon} />
  //       <TouchableOpacity onPress={() => setSettingPopup(true)}>
  //         <Image source={images.home_setting} style={styles.townsCupIcon} />
  //       </TouchableOpacity>
  //     ),
  //     headerTitle: () => (
  //       <TouchableOpacity
  //         style={styles.titleHeaderView}
  //         onPress={() => setLocationPopup(true)}
  //         hitSlop={getHitSlop(15)}>
  //         <Text style={styles.headerTitle}>Vancuver</Text>
  //         <Image source={images.home_gps} style={styles.gpsIconStyle} />
  //       </TouchableOpacity>
  //     ),
  //     headerRight: () => (
  //       <View style={styles.rightHeaderView}>
  //         <TouchableOpacity>
  //           <Image source={images.home_search} style={styles.townsCupIcon} />
  //         </TouchableOpacity>
  //       </View>
  //     ),
  //   });
  // }, [navigation]);

  // eslint-disable-next-line no-unused-vars
  const renderStatusView = useCallback(
    () => (
      <View
        style={{
          width: 50,
          marginRight: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <LinearGradient
          colors={[colors.yellowColor, colors.assistTextColor]}
          style={styles.backgroundStatusView}>
          <Image source={images.soccerBackground} style={styles.profileImage} />
        </LinearGradient>
        <Text
          style={{
            width: '100%',
            fontSize: 10,
            fontFamily: fonts.RRegular,
            color: colors.lightBlackColor,
            textAlign: 'center',
            marginTop: 5,
          }}
          numberOfLines={1}>
          Kishan Makani
        </Text>
      </View>
    ),
    [],
  );

  // eslint-disable-next-line no-unused-vars
  const renderStatusHeader = useCallback(
    () => (
      <View style={{ marginRight: 18.5, width: 45 }}>
        <View style={styles.backgroundStatusView}>
          <Image
            source={images.soccerBackground}
            style={styles.myShowCaseImage}
          />
        </View>
        <Text
          style={{
            fontSize: 10,
            fontFamily: fonts.RRegular,
            color: colors.lightBlackColor,
            textAlign: 'center',
            marginTop: 5,
          }}
          numberOfLines={1}>
          My Showcase
        </Text>
        <Image
          source={images.addStatus}
          style={{
            resizeMode: 'contain',
            height: 20,
            width: 20,
            position: 'absolute',
            bottom: 12,
            right: -5,
          }}
        />
      </View>
      //  <View style={{marginRight: 15}}>
      //   <LinearGradient
      //     colors={[colors.yellowColor, colors.assistTextColor]}
      //     style={styles.backgroundStatusView}>
      //     <Image source={images.soccerBackground} style={styles.profileImage} />
      //   </LinearGradient>
      //   <Text
      //     style={{
      //       fontSize: 10,
      //       fontFamily: fonts.RRegular,
      //       color: colors.lightBlackColor,
      //       textAlign: 'center',
      //       marginTop: 5,
      //     }}
      //     numberOfLines={1}>
      //     My Showcase
      //   </Text>
      //   <Image
      //     source={images.addStatus}
      //     style={{
      //       resizeMode: 'cover',
      //       height: 30,
      //       width: 30,
      //       position: 'absolute',
      //       bottom: 8,
      //       right: -10,
      //     }}
      //   />
      // </View>
    ),
    [],
  );

  const sportsListView = useCallback(
    ({ item, index }) => (
      <Text
        style={
          selectedSport === item.sport_name
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
          console.log('selected sport::=>', item.sport_name);
          setSelectedSport(item.sport_name);
        }}>
        {item.sport_name}
      </Text>
    ),
    [selectedSport],
  );

  const renderSportsView = useCallback(
    ({ item, drag }) => (
      <View style={styles.sportsBackgroundView}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={images.gameGoal} style={styles.sportsIcon} />
          <Text
            style={styles.sportNameTitle}
            onPress={() => {
              setSelectedSport(item)
            }}>
            {item}
          </Text>
        </View>
        <TouchableOpacity onLongPress={drag} style={{ alignSelf: 'center' }}>
          <Image source={images.moveIcon} style={styles.moveIconStyle} />
        </TouchableOpacity>
      </View>
    ),
    [],
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
        <TCUpcomingMatch data={item} cardWidth={'92%'} />
      </View>
    ),
    [],
  );
  const renderChallengerItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15, flex: 1 }}>
        <TCChallengerCard data={item} cardWidth={'92%'} />
      </View>
    ),
    [],
  );
  const renderHiringPlayersItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCHiringPlayersCard data={item} cardWidth={'92%'} />
      </View>
    ),
    [],
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
              data={sports}
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
                    location,
                    selectedSport,
                    sports,
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
                isDisabled={!(upcomingMatch.length > 0)}
                title={strings.upcomingMatchesTitle}
                showArrow={true}
                viewStyle={{ marginTop: 20, marginBottom: 15 }}
                onPress={() => {
                  navigation.navigate('UpcomingMatchScreen', {
                    location,
                    sport: selectedSport,
                    sports,
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
            <View>
              <TCTitleWithArrow
                isDisabled={!(challengeeMatch.length > 0)}
                title={strings.lookingForTitle}
                showArrow={true}
                viewStyle={{ marginTop: 20, marginBottom: 15 }}
                onPress={() => {
                  navigation.navigate('LookingForChallengeScreen', {
                    location,
                    sport: selectedSport,
                    sports,
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
                        .query(
                          'match',
                          'registered_sports.sport_name',
                          'Tennis',
                        )
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
            <View>
              <TCTitleWithArrow
                isDisabled={!(hiringPlayers.length > 0)}
                title={strings.hiringPlayerTitle}
                showArrow={true}
                viewStyle={{ marginTop: 20, marginBottom: 15 }}
                onPress={() => {
                  navigation.navigate('HiringPlayerScreen', {
                    location,
                    sport: selectedSport,
                    sports,
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
            <View>
              <TCTitleWithArrow
                isDisabled={!(lookingTeam.length > 0)}
                title={strings.lookingForTeamTitle}
                showArrow={true}
                viewStyle={{ marginTop: 20, marginBottom: 15 }}
                onPress={() => navigation.navigate('LookingTeamScreen', {
                    location,
                    sport: selectedSport,
                    sports,
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
            <View>
              <TCTitleWithArrow
                title={strings.refereesTitle}
                showArrow={true}
                viewStyle={{ marginTop: 20, marginBottom: 15 }}
                onPress={() => navigation.navigate('RefereesListScreen', {
                    location,
                    sport: selectedSport,
                  })
                }
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
            <View>
              <TCTitleWithArrow
                title={strings.scorekeeperTitle}
                showArrow={true}
                viewStyle={{ marginTop: 20, marginBottom: 15 }}
                onPress={() => navigation.navigate('ScorekeeperListScreen', {
                    location,
                    sport: selectedSport,
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
                  <Text
                    style={styles.doneText}
                    onPress={() => {
                      if (selectedSettingOption === 1) {
                        setSettingPopup(false);
                        setLocationPopup(true);
                      } else {
                        setSettingPopup(false);
                        setSportsPopup(true);
                      }
                    }}>
                    {'Done'}
                  </Text>
                </View>
                <TCThinDivider width={'100%'} marginBottom={15} />
                <TouchableWithoutFeedback
                  onPress={() => {
                    setSelectedSettingOption(0);
                    setLocationPopup(false);
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
                <TouchableWithoutFeedback
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
                </TouchableWithoutFeedback>
              </View>
            </Modal>
            <Modal
              onBackdropPress={() => setSportsPopup(false)}
              backdropOpacity={1}
              animationType="slide"
              hasBackdrop
              style={{
                margin: 0,
                backgroundColor: colors.blackOpacityColor,
              }}
              visible={sportsPopup}>
              <View style={[styles.bottomPopupContainer, { height: '80%' }]}>
                <View style={styles.viewsContainer}>
                  <Text
                    onPress={() => setSettingPopup(false)}
                    style={styles.cancelText}>
                    Cancel
                  </Text>
                  <Text style={styles.locationText}>Sports</Text>
                  <Text
                    style={styles.doneText}
                    onPress={() => {
                      console.log('DONE::');
                    }}>
                    {'Done'}
                  </Text>
                </View>
                <TCThinDivider width={'100%'} marginBottom={15} />
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  data={[
                    'Soccer',
                    'Baseball',
                    'Basketball',
                    'Tennis Single',
                    'Tennis Double',
                  ]}
                  keyExtractor={keyExtractor}
                  renderItem={renderSportsView}
                  style={{
                    width: '100%',
                    alignContent: 'center',
                    marginBottom: 15,
                    paddingVertical: 15,
                  }}
                  // dragHitSlop={{
                  //   top: 15,
                  //   bottom: 15,
                  //   left: 15,
                  //   right: 15,
                  // }}

                  // onDragEnd={({ data }) => setSportsSource(data)}
                />
                <TouchableOpacity
                  style={styles.addSportsView}
                  onPress={() => {
                    setSportsPopup(false);
                    setSportsListPopup(true);
                  }}>
                  <Text style={styles.addSportsTitle}>
                    Add or delete Sports
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
            <Modal
              onBackdropPress={() => setSportsListPopup(false)}
              backdropOpacity={1}
              animationType="slide"
              hasBackdrop
              style={{
                flex: 1,
                margin: 0,
                backgroundColor: colors.blackOpacityColor,
              }}
              visible={sportsListPopup}>
              <View style={[styles.bottomPopupContainer, { height: '80%' }]}>
                <View style={styles.viewsContainer}>
                  <Text
                    onPress={() => setSportsListPopup(false)}
                    style={styles.cancelText}>
                    Cancel
                  </Text>
                  <Text style={styles.locationText}>Add or delete Sports </Text>
                  <Text
                    style={styles.doneText}
                    onPress={() => {
                      console.log('DONE::', selectedSports);
                    }}>
                    {'Apply'}
                  </Text>
                </View>
                <TCThinDivider width={'100%'} marginBottom={15} />
                <SportsListView sports={sports} onSelect={isIconCheckedOrNot} />
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
  sportsIcon: {
    resizeMode: 'cover',
    height: 20,
    width: 20,
    alignSelf: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  moveIconStyle: {
    resizeMode: 'cover',
    height: 13,
    width: 15,
    alignSelf: 'center',
    marginRight: 15,
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
  sportNameTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    // margin: 15,
  },
  addSportsTitle: {
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.themeColor,
    alignSelf: 'center',
    // margin: 15,
    paddingHorizontal: 10,
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
  sportsBackgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 40,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
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
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    // width: widthPercentageToDP('86%'),
    // alignItems: 'center',
    // justifyContent: 'center',
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
  backgroundStatusView: {
    backgroundColor: colors.whiteColor,
    elevation: 5,
    height: 42,
    width: 42,
    borderRadius: 34,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    resizeMode: 'cover',
    height: 38,
    width: 38,
    borderRadius: 72,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',
  },
  myShowCaseImage: {
    resizeMode: 'cover',
    height: 38,
    width: 38,
    borderRadius: 34,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',
  },
  backImageStyle: {
    height: 35,
    width: 35,
  },
});
