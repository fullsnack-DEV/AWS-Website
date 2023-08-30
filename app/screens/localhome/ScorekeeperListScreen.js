/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
import React, {useCallback, useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  TextInput,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import AuthContext from '../../auth/context';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import {widthPercentageToDP, getStorage} from '../../utils';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../../components/TCThinDivider';
import {strings} from '../../../Localization/translation';
import {getGameIndex, getUserIndex} from '../../api/elasticSearch';
import TCTagsFilter from '../../components/TCTagsFilter';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {locationType, filterType} from '../../utils/constant';
import TCPlayerView from '../../components/TCPlayerView';
import {getSportList} from '../../utils/sportsActivityUtils';
import Verbs from '../../Constants/Verbs';
import SearchModal from '../../components/Filter/SearchModal';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import ScreenHeader from '../../components/ScreenHeader';

let stopFetchMore = true;

export default function ScorekeeperListScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [filters, setFilters] = useState(route?.params?.filters);
  const [settingPopup, setSettingPopup] = useState(false);
  const [sports, setSports] = useState([]);
  const [scorekeepers, setScorekeepers] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [loadMore, setLoadMore] = useState(false);
  const [location, setLocation] = useState(route.params?.filters?.location);
  const [imageBaseUrl, setImageBaseUrl] = useState('');
  const [playerDetailPopup, setPlayerDetailPopup] = useState();
  const [playerDetail, setPlayerDetail] = useState();
  const [smallLoader, setSmallLoader] = useState(false);

  useEffect(() => {
    getStorage('appSetting').then((setting) => {
      setImageBaseUrl(setting.base_url_sporticon);
    });

    const defaultSport = [
      {
        sport: strings.allSport,
        sport_name: strings.allSport,
        sport_type: strings.allSport,
      },
    ];
    if (authContext.entity.role === Verbs.entityTypeUser) {
      setSports([
        ...defaultSport,
        ...getSportList(authContext.sports, Verbs.entityTypeReferee),
      ]);
    } else if (authContext.entity.role === Verbs.entityTypeClub) {
      const clubSports = Utility.getClubRegisterSportsList(authContext);
      setSports([...defaultSport, ...clubSports]);
    }
  }, [authContext]);

  useEffect(() => {
    getScorekeepers(filters);
  }, []);

  useEffect(() => {
    const tempFilter = {...filters};
    tempFilter.location = location;
    setFilters({
      ...tempFilter,
    });
    setPageFrom(0);
    setScorekeepers([]);
    applyFilter(tempFilter);
  }, [location]);

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
  const getScorekeepers = useCallback(
    (filerScorekeeper) => {
      setSmallLoader(true);
      const scorekeeperQuery = {
        size: pageSize,
        from: pageFrom,
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

      if (filerScorekeeper?.location !== strings.worldTitleText) {
        scorekeeperQuery.query.bool.must.push({
          multi_match: {
            query: `${filerScorekeeper.location.toLowerCase()}`,
            fields: ['city', 'country', 'state_abbr'],
          },
        });
      }

      if (
        authContext.entity.role === Verbs.entityTypeUser ||
        authContext.entity.role === Verbs.entityTypeClub
      ) {
        if (filerScorekeeper?.sport !== strings.allSport) {
          scorekeeperQuery.query.bool.must[0].nested.query.bool.must.push({
            term: {
              'scorekeeper_data.sport.keyword': {
                value: filerScorekeeper?.sport,
              },
            },
          });
        }
      } else if (authContext.entity.role === Verbs.entityTypeTeam) {
        if (route.params.teamSportData?.sport) {
          scorekeeperQuery.query.bool.must[0].nested.query.bool.must.push({
            term: {
              'scorekeeper_data.sport.keyword': `${route.params.teamSportData.sport.toLowerCase()}`,
            },
          });
        }
      }

      if (filerScorekeeper.scorekeeperFee) {
        scorekeeperQuery.query.bool.must.push({
          range: {
            'scorekeeper_data.setting.game_fee.fee': {
              gte: Number(filerScorekeeper.scorekeeperFee.split('-')[0]),
              lte: Number(filerScorekeeper.scorekeeperFee.split('-')[1]),
            },
          },
        });
      }

      if (filerScorekeeper?.searchText?.length > 0) {
        scorekeeperQuery.query.bool.must.push({
          query_string: {
            query: `*${filerScorekeeper?.searchText}*`,
            fields: ['full_name'],
          },
        });
      }
      console.log('scorekeeperQuery==>', JSON.stringify(scorekeeperQuery));
      // Scorekeeper query
      getUserIndex(scorekeeperQuery)
        .then((res) => {
          setSmallLoader(false);
          if (res.length > 0) {
            const modifiedResult = modifiedScoreKeeperElasticSearchResult(res);
            const fetchedData = [...scorekeepers, ...modifiedResult];
            const filterData = fetchedData.filter(
              (obj) => obj.user_id !== authContext.entity.uid,
            );
            setScorekeepers(filterData);
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
    },
    [pageFrom, pageSize, scorekeepers],
  );

  const renderRefereesScorekeeperListView = useCallback(
    ({item}) => (
      <View style={{flex: 1}}>
        <TCPlayerView
          data={item}
          authContext={authContext}
          subTab={strings.scorekeeperTitle}
          showStar={
            (authContext.entity.role === Verbs.entityTypeUser &&
              filters.sport !== strings.allSport) ||
            (authContext.entity.role === Verbs.entityTypeTeam && true) ||
            (authContext.entity.role === Verbs.entityTypeClub &&
              filters.sport !== strings.allSport)
          }
          showSport={true}
          sportFilter={
            (authContext.entity.role === Verbs.entityTypeTeam && {
              // ...filters,
              sport: route.params.teamSportData?.sport,
              sport_name: route.params.teamSportData?.sport_name,
              sport_type: route.params.teamSportData?.sport_type,
            }) ||
            filters
          }
          // sportFilter={filters}
          onPress={(sportsObj) => {
            if (sportsObj.length > 1) {
              const data = {
                sports: sportsObj,
                uid: item?.user_id,
                entityType: item?.entity_type,
              };
              setPlayerDetail(data);
              setPlayerDetailPopup(true);
            } else {
              navigation.navigate('SportActivityHome', {
                sport: sportsObj[0].sport,
                sportType: sportsObj[0]?.sport_type,
                uid: item?.user_id,
                entityType: item?.entity_type,
                showPreview: true,
                backScreen: 'ScorekeeperListScreen',
              });
            }
          }}
          onPressBookButton={(scoreKeeperObj, sportObject) => {
            if (
              sportObject.setting?.scorekeeper_availibility &&
              sportObject.setting?.game_fee &&
              sportObject.setting?.refund_policy &&
              sportObject.setting?.available_area
            ) {
              getGamesForBookAScoreKeeper(scoreKeeperObj, sportObject);
            } else {
              Alert.alert(strings.scorekeeperSetiingNotValidation);
            }
          }}
        />
      </View>
    ),
    [authContext, filters, navigation],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderSeparator = () => (
    <TCThinDivider marginTop={10} marginBottom={10} width={'100%'} />
  );

  const onScrollHandler = () => {
    setLoadMore(true);
    if (!stopFetchMore) {
      getScorekeepers(filters);
      stopFetchMore = true;
    }
    setLoadMore(false);
  };

  const handleTagPress = ({item}) => {
    const tempFilter = {...filters};
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
        }
      }
    });
    setFilters({...tempFilter});
    // applyFilter();
    setTimeout(() => {
      setPageFrom(0);
      setScorekeepers([]);
      applyFilter(tempFilter);
    }, 10);
  };

  const getLocation = async () => {
    try {
      // setloading(true);
      const currentLocation = await getGeocoordinatesWithPlaceName(Platform.OS);
      let loc = '';
      if (currentLocation.position) {
        loc =
          currentLocation.city?.charAt(0).toUpperCase() +
          currentLocation.city?.slice(1);
      }
      setloading(false);
      setSettingPopup(false);
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
  const getGamesForBookAScoreKeeper = useCallback(
    (scoreKeeperObj, sportObject) => {
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
              {
                term: {
                  'challenge_scorekeepers.who_secure.responsible_team_id.keyword':
                    authContext.entity.uid,
                },
              },
            ],
          },
        },
        sort: [{start_datetime: 'asc'}],
      };

      console.log('gameListWithFilter==>', JSON.stringify(gameListWithFilter));
      getGameIndex(gameListWithFilter)
        .then((res) => {
          if (res.length > 0) {
            navigation.navigate('ScorekeeperBookingDateAndTime', {
              settingObj: sportObject.setting,
              userData: scoreKeeperObj,
              showMatches: true,
              sportName: sportObject.sport,
            });
          } else {
            Alert.alert(
              strings.alertmessagetitle,
              strings.bookScorekeeperMessage,
            );
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
  const applyFilter = useCallback((fil) => {
    getScorekeepers(fil);
  }, []);

  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {smallLoader ? (
        <ActivityIndicator
          style={styles.loaderStyle}
          size="small"
          color="#000000"
        />
      ) : (
        <Text
          style={{
            fontFamily: fonts.RRegular,
            color: colors.grayColor,
            fontSize: 26,
          }}>
          {strings.noScorekeeper}
        </Text>
      )}
    </View>
  );
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
          backScreen: 'ScorekeeperListScreen',
        });
      }}
      disabled={item.is_hide}>
      <View style={styles.innerViewContainer}>
        <View style={styles.row}>
          <View style={styles.imageContainer}>
            <Image
              source={{uri: `${imageBaseUrl}${item.player_image}`}}
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
        title={strings.scoreKeeperAvailable}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />
      <ActivityLoader visible={loading} />
      <View style={styles.searchView}>
        <View style={styles.searchViewContainer}>
          <TextInput
            clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
            clearButtonVisible={Platform.OS === 'android'}
            placeholder={strings.searchText}
            style={styles.searchTxt}
            autoCorrect={false}
            onChangeText={(text) => {
              // setSearchText(text);
              const tempFilter = {...filters};

              if (text?.length > 0) {
                tempFilter.searchText = text;
              } else {
                delete tempFilter.searchText;
              }
              setFilters({
                ...tempFilter,
              });
              setPageFrom(0);
              setScorekeepers([]);
              applyFilter(tempFilter);
            }}
            // value={search}
          />

          <TouchableWithoutFeedback
            onPress={() => {
              setSettingPopup(true);
            }}>
            <Image source={images.homeSetting} style={styles.settingImage} />
          </TouchableWithoutFeedback>
        </View>
      </View>
      <TCTagsFilter
        filter={filters}
        authContext={authContext}
        dataSource={Utility.getFiltersOpetions(filters)}
        onTagCancelPress={handleTagPress}
      />
      <FlatList
        extraData={location}
        showsVerticalScrollIndicator={false}
        data={scorekeepers}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={keyExtractor}
        renderItem={renderRefereesScorekeeperListView}
        style={[
          styles.listStyle,
          {height: filters.sport !== strings.allSport ? 91 : 70},
        ]}
        // contentContainerStyle={{ paddingBottom: 1 }}
        onScroll={onScrollHandler}
        onEndReachedThreshold={0.01}
        onScrollBeginDrag={() => {
          stopFetchMore = false;
        }}
        ListEmptyComponent={listEmptyComponent}
      />
      {/* note */}

      <SearchModal
        // enityType={Verbs.entityTypeReferee}
        fType={filterType.SCOREKEEPERS}
        sports={sports}
        showSportOption={
          (authContext.entity.role === Verbs.entityTypeUser && true) ||
          (authContext.entity.role === Verbs.entityTypeTeam && false) ||
          (authContext.entity.role === Verbs.entityTypeClub && true)
        }
        filterObject={filters}
        isVisible={settingPopup}
        feeTitle={strings.scorekeeperFeeText}
        onPressApply={async (filterData) => {
          setloading(false);
          let tempFilter = {};
          tempFilter = {...filterData};
          setSettingPopup(false);
          setPageFrom(0);
          setScorekeepers([]);
          if (filterData.locationOption === locationType.WORLD) {
            setLocation(strings.worldTitleText);
            tempFilter.location = strings.worldTitleText;
          } else if (filterData.locationOption === locationType.HOME_CITY) {
            setLocation(
              authContext?.entity?.obj?.city.charAt(0).toUpperCase() +
                authContext?.entity?.obj?.city.slice(1),
            );
            tempFilter.location =
              authContext?.entity?.obj?.city.charAt(0).toUpperCase() +
              authContext?.entity?.obj?.city.slice(1);
          } else if (
            filterData.locationOption === locationType.CURRENT_LOCATION
          ) {
            const loc = await getLocation();
            tempFilter.location = loc;
          } else if (filterData.locationOption === locationType.SEARCH_CITY) {
            setLocation(filterData.searchCityLoc);
            tempFilter.location = filterData.searchCityLoc;
          }
          setFilters({...tempFilter});
          applyFilter(tempFilter);
        }}
        onPressCancel={() => {
          setSettingPopup(false);
        }}></SearchModal>
      <CustomModalWrapper
        isVisible={playerDetailPopup}
        closeModal={() => {
          setPlayerDetailPopup(false);
        }}
        modalType={ModalTypes.style2}>
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
  listStyle: {
    flex: 1,
    margin: 15,
  },

  searchViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    width: widthPercentageToDP('92%'),
    borderRadius: 25,
    elevation: 2,
    backgroundColor: colors.lightGrey,
    marginTop: 10,
  },
  settingImage: {
    height: 20,
    width: 20,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginRight: 15,
  },
  searchView: {
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchTxt: {
    marginLeft: 15,
    fontSize: widthPercentageToDP('3.8%'),
    width: widthPercentageToDP('75%'),
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
});
