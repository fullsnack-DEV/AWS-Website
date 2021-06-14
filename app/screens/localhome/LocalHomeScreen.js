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
  InteractionManager,
} from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';

import bodybuilder from 'bodybuilder';

import Modal from 'react-native-modal';
import { useIsFocused } from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import TCTitleWithArrow from '../../components/TCTitleWithArrow';
import strings from '../../Constants/String';
import { getSportsList, getShortsList } from '../../api/Games'; // getRecentGameDetails
import * as Utility from '../../utils';

import {
  postElasticSearch,
  postMultiElasticSearch,
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
export default function LocalHomeScreen({ navigation }) {
  const refContainer = useRef();

  const isFocused = useIsFocused();

  const [loading, setloading] = useState(false);
  const [sports, setSports] = useState([]);

  const [locationPopup, setLocationPopup] = useState(false);
  const [selectedLocationOption, setSelectedLocationOption] = useState();
  const [selectedSettingOption, setSelectedSettingOption] = useState();

  const [location] = useState('india');

  const [selectedSport, setSelectedSport] = useState('Soccer');
  const [settingPopup, setSettingPopup] = useState(false);

  const [sportsPopup, setSportsPopup] = useState(false);
  const [sportsListPopup, setSportsListPopup] = useState(false);

  const [shortsList, setShortsList] = useState([]);

  const [recentMatch, setRecentMatch] = useState([]);

  const [upcomingMatch, setUpcomingMatch] = useState([]); // { ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }
  const [challengeeMatch, setChallengeeMatch] = useState([]); // [{ ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }]
  const [hiringPlayers] = useState([]);
  const [lookingTeam] = useState([]); // ['', '', '', '', '']
  const [referees] = useState([]); // ['', '', '', '', '']
  const [scorekeepers] = useState([]); // ['', '', '', '', '']

  const authContext = useContext(AuthContext);

useEffect(() => {
  getAppSettings(authContext).then((response) => {
    console.log('Settings:=>', response);
    setSettings(response.payload.app)
  }).catch((e) => {
    setTimeout(() => {
      Alert.alert(strings.alertmessagetitle, e.message);
    }, 10);
  });
}, [authContext])

const setSettings = useCallback(async (appSettingObj) => {
  await Utility.setStorage('appSetting', appSettingObj);
}, []);
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (isFocused) {
        // const recentMatchbody = bodybuilder()
        //   .query('match', 'sport', selectedSport)
        //   .query('match', 'status', 'ended')
        //   .query('multi_match', {
        //     query: location,
        //     fields: ['city', 'country', 'state'],
        //   })
        //   .query('range', 'start_datetime', {
        //     lt: parseFloat(new Date().getTime() / 1000).toFixed(0),
        //   })
        //   .sort('actual_enddatetime', 'desc')
        //   .build();

        // const upcomingMatchbody = bodybuilder()
        //   .query('match', 'sport', selectedSport)
        //   .query('multi_match', {
        //     query: location,
        //     fields: ['city', 'country', 'state'],
        //   })
        //   .query('range', 'start_datetime', {
        //     gt: parseFloat(new Date().getTime() / 1000).toFixed(0),
        //   })
        //   .sort('actual_enddatetime', 'desc')
        //   .build();

        // const challengeeBody = bodybuilder()
        //   .query('match', 'sport', selectedSport)
        //   .query('multi_match', {
        //     query: location,
        //     fields: ['city', 'country', 'state'],
        //   })
        //   .build();

        //   console.log('challengee body', JSON.stringify(challengeeBody));

        const challengeeBody = `{"query":{"bool":{"must":[{"match":{"sport":"${selectedSport}"}},{"multi_match":{"query":"${location}","fields":["city","country","state"]}}]}}}`
        const recentMatchbody = `{"size": 5,"query":{"bool":{"must":[{"match":{"sport":"${selectedSport}"}},{"match":{"status":"ended"}},{"multi_match":{"query":"${location}","fields":["city","country","state"]}},{"range":{"start_datetime":{"lt":${parseFloat(new Date().getTime() / 1000).toFixed(0)}}}}]}},"sort":[{"actual_enddatetime":"desc"}]}`
        const upcomingMatchbody = `{"size": 5,"query":{"bool":{"must":[{"match":{"sport":"${selectedSport}"}},{"multi_match":{"query":"${location}","fields":["city","country","state"]}},{"range":{"start_datetime":{"gt":${parseFloat(new Date().getTime() / 1000).toFixed(0)}}}}]}},"sort":[{"actual_enddatetime":"desc"}]}`
        console.log('upcomingMatchbody', JSON.stringify(upcomingMatchbody));

        const a = `{ }\n${recentMatchbody}\n{ }\n${upcomingMatchbody}\n{"index":"entityindex"}\n${challengeeBody}\n`;

        console.log('Full object :=>', a);
        // const a = '{ }\n{"query" : {"match" : { "message": "this is a test"}}}\n{"index": "entityindex"}\n{"query" : {"match_all" : {}}}\n'
        setloading(true);
        const promises = [
          // postElasticSearch(recentMatchbody, 'gameindex'),
          // // getRecentGameDetails('Soccer', 'ended', location, authContext),
          // getSportsList(authContext),
          // getShortsList(location, authContext),
          // postElasticSearch(upcomingMatchbody, 'gameindex'),

          postMultiElasticSearch(a),
          // getRecentGameDetails('Soccer', 'ended', location, authContext),
          getSportsList(authContext),
          getShortsList(location, authContext),
        ];
        Promise.all(promises)
          .then(([res1, res2, res3, res4]) => {
            // console.log('Recent API Response:=>', res1);
            console.log('recent  API Response:=>', res1);
            console.log('Sport API Response:=>', res2);
            console.log('Shorts API Response:=>', res3);
            console.log('upcoming  API Response:=>', res4);

            let entityArr = [];
            let recentArr = [];
            let upcomingArr = [];

            setloading(false);
            if (res1.responses) {
              const arr = [];
              res1.responses[0].hits.hits.map((e) => {
                arr.push(e._source.away_team);
                arr.push(e._source.home_team);
              });
              const uniqueArray = [...new Set(arr)];
              entityArr = uniqueArray;
              recentArr = res1.responses[0].hits.hits;

              const arr1 = [];
              res1.responses[1].hits.hits.map((e) => {
                arr1.push(e._source.away_team);
                arr1.push(e._source.home_team);
              });
              const uniqueArray1 = [...new Set(arr1)];
              entityArr.concat(uniqueArray1);
              upcomingArr = res1.responses[1].hits.hits;

              setChallengeeMatch(res1.responses[2].hits.hits)
            }
            if (res2.payload) {
              const arr = [];
              for (const tempData of res2.payload) {
                tempData.isChecked = false;
                arr.push(tempData);
              }
              setSports(arr);
              setTimeout(() => setloading(false), 1000);
            }
            if (res3.payload) {
              setShortsList(res3.payload.results);
            }
            // if (res4.hits) {
            //   const arr = [];
            //   res1.hits.hits.map((e) => {
            //     arr.push(e._source.away_team);
            //     arr.push(e._source.home_team);
            //   });
            //   const uniqueArray = [...new Set(arr)];
            //   entityArr.concat(uniqueArray)
            //   upcomingArr = res4.hits.hits;
            //   // setUpcomingMatch(res4.hits.hits);
            // }

            const ids = {
              query: {
                ids: {
                  values: entityArr,
                },
              },
            };
            setloading(true);
            postElasticSearch(ids, 'entityindex/entity')
              .then((response) => {
                const arr = [];
                recentArr.map((e) => {
                  const obj = {
                    ...e._source,
                    home_team: response.hits.hits.find(
                      (x) => x._source.group_id === e._source.home_team,
                    ),
                    away_team: response.hits.hits.find(
                      (x) => x._source.group_id === e._source.away_team,
                    ),
                  };

                  arr.push(obj);
                });

                setRecentMatch(arr);

                const arr1 = [];
                upcomingArr.map((e) => {
                  const obj = {
                    ...e._source,
                    home_team: response.hits.hits.find(
                      (x) => x._source.group_id === e._source.home_team,
                    ),
                    away_team: response.hits.hits.find(
                      (x) => x._source.group_id === e._source.away_team,
                    ),
                  };

                  arr1.push(obj);
                });

                setUpcomingMatch(arr1);

                console.log(' USER response.hits.hits:=>', response.hits.hits);
              })
              .catch((e) => {
                setloading(false);
                setTimeout(() => {
                  Alert.alert(strings.alertmessagetitle, e.message);
                }, 10);
              });
          })
          .catch((e) => {
            setloading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      }
    });
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
  const onSportSelect = ({ item }) => setSelectedSport(item);

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
            onPress={() => onSportSelect({ item })}>
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
        <TCRecentMatchCard
          // data={{
          //   ...item._source,
          //   home_team: entityObj.find(
          //     (x) => x._source.group_id === item._source.home_team,
          //   ),
          //   away_team: entityObj.find(
          //     (x) => x._source.group_id === item._source.away_team,
          //   ),
          // }}
          data={item}
          cardWidth={'92%'}
        />
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
      <View style={{ marginBottom: 15 }}>
        <TCChallengerCard data={item._source} cardWidth={'92%'} />
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
    () => (
      <View style={{ marginBottom: 15 }}>
        <TCEntityView />
      </View>
    ),
    [],
  );

  const renderRefereesScorekeeperListView = useCallback(
    () => (
      <View style={{ marginBottom: 15 }}>
        <TCEntityView showStar={true} />
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
              onPress={() => setLocationPopup(true)}
              hitSlop={getHitSlop(15)}>
              <Text style={styles.headerTitle}>Vancuver</Text>
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
    [],
  );

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
              <FlatList
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
              <TCThinDivider width={'100%'} marginTop={10} />
              <TCTitleWithArrow
                title={strings.recentMatchesTitle}
                showArrow={true}
                viewStyle={{ marginTop: 20, marginBottom: 15 }}
                onPress={() => navigation.navigate('RecentMatchScreen', {
                    location,
                    selectedSport,
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
                      const body = bodybuilder()
                        .query('match', 'sport', 'soccer')
                        .query('match', 'status', 'ended')
                        .query('multi_match', {
                          query: 'vancouver',
                          fields: ['city', 'country', 'state'],
                        })
                        // .query('nested', 'path', 'groups', (q) => q.query('match', 'groups.group_id', 'ef08a9c9-d412-440e-834b-3e1c4306bc93'))
                        .sort('actual_enddatetime', 'desc')
                        .build();

                      //  .query('ids', 'values', ['ef08a9c9-d412-440e-834b-3e1c4306bc93', 'a2f13e03-5911-4625-8573-23bfc206148a'])
                      //   .build();

                      // const body = {
                      //   size: 5,
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

                      //   sort: [{ actual_enddatetime: 'desc' }],
                      // };

                      // const body = bodybuilder()
                      //   .query('nested', 'path', 'obj1', (q) => q.query('match', 'obj1.color', 'blue'))
                      //   .build();

                      console.log('Query:=>', body);

                      // postElasticSearch(body)
                      //   .then((res) => {
                      //     console.log('Then response', res);
                      //   })
                      //   .catch((err) => {
                      //     console.log(err);
                      //   });
                    }}
                  />
                )}
              />
              {/* <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={[{ ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }]}
          keyExtractor={keyExtractor}
          renderItem={renderRecentMatchItems}
          ItemSeparatorComponent={() => (<View
            style={{
              height: 50,
              width: 10,
            }}
          />)}
          style={{ marginLeft: 15 }}
        /> */}
            </View>
            <View>
              <TCTitleWithArrow
                title={strings.upcomingMatchesTitle}
                showArrow={true}
                viewStyle={{ marginTop: 20, marginBottom: 15 }}
                onPress={() => {
                  navigation.navigate('UpcomingMatchScreen', {
                    location,
                    selectedSport,
                  });
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
                title={strings.lookingForTitle}
                showArrow={true}
                viewStyle={{ marginTop: 20, marginBottom: 15 }}
                onPress={() => navigation.navigate('LookingForChallengeScreen')}
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

                      const a = '{ }\n{"query" : {"match" : { "message": "this is a test"}}}\n{"index": "entityindex"}\n{"query" : {"match_all" : {}}}\n';
                      console.log('Query:=>', a);

                      postMultiElasticSearch(a)
                        .then((res) => {
                          console.log(
                            'Then s response',
                            res.responses[0].hits.hits,
                          );
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
                title={strings.hiringPlayerTitle}
                showArrow={true}
                viewStyle={{ marginTop: 20, marginBottom: 15 }}
                onPress={() => navigation.navigate('HiringPlayerScreen')}
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
                title={strings.lookingForTeamTitle}
                showArrow={true}
                viewStyle={{ marginTop: 20, marginBottom: 15 }}
                onPress={() => navigation.navigate('LookingTeamScreen')}
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
                onPress={() => navigation.navigate('RefereesListScreen')}
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
                onPress={() => navigation.navigate('ScorekeeperListScreen')}
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
                  <Text style={styles.doneText}>{'    '}</Text>
                </View>
                <TCThinDivider width={'100%'} marginBottom={15} />
                <TouchableWithoutFeedback
                  onPress={() => setSelectedLocationOption(0)}>
                  {selectedLocationOption === 0 ? (
                    <LinearGradient
                      colors={[colors.yellowColor, colors.orangeGradientColor]}
                      style={styles.backgroundView}>
                      <Text
                        style={[
                          styles.curruentLocationText,
                          { color: colors.whiteColor },
                        ]}>
                        Current location
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.backgroundView}>
                      <Text style={styles.curruentLocationText}>
                        Current location
                      </Text>
                    </View>
                  )}
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => setSelectedLocationOption(1)}>
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
                  onPress={() => setSelectedLocationOption(2)}>
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
                    navigation.navigate('SearchCityScreen');
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
                  onPress={() => setSelectedSettingOption(0)}>
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
