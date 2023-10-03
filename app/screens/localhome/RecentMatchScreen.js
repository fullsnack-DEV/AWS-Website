/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
import React, {useCallback, useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AuthContext from '../../auth/context';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import {widthPercentageToDP} from '../../utils';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
import {getGameIndex} from '../../api/elasticSearch';
import TCTagsFilter from '../../components/TCTagsFilter';
import TCRecentMatchCard from '../../components/TCRecentMatchCard';
import {getGameHomeScreen} from '../../utils/gameUtils';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {locationType, filterType} from '../../utils/constant';
import SearchModal from '../../components/Filter/SearchModal';
import {getSportList} from '../../utils/sportsActivityUtils';
import Verbs from '../../Constants/Verbs';
import ScreenHeader from '../../components/ScreenHeader';

let stopFetchMore = true;

export default function RecentMatchScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [filters, setFilters] = useState(route?.params?.filters);
  const [settingPopup, setSettingPopup] = useState(false);
  const [sports, setSports] = useState([]);
  const [recentMatch, setRecentMatch] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [loadMore, setLoadMore] = useState(false);
  const [searchData, setSearchData] = useState();
  const [location, setLocation] = useState(route?.params?.filters?.location);
  const [smallLoader, setSmallLoader] = useState(false);

  useEffect(() => {
    const defaultSport = [
      {
        sport: strings.allSport,
        sport_name: strings.allSport,
        sport_type: strings.allSport,
      },
    ];
    if (authContext.entity.role === Verbs.entityTypeUser) {
      setSports([...defaultSport, ...getSportList(authContext.sports)]);
    } else if (authContext.entity.role === Verbs.entityTypeClub) {
      const clubsSports = Utility.getClubRegisterSportsList(authContext);
      setSports([...defaultSport, ...clubsSports]);
    }
  }, [authContext]);

  useEffect(() => {
    getRecentGames(filters);
  }, []);

  useEffect(() => {
    const tempFilter = {...filters};
    tempFilter.location = location;
    // tempFilter.fromDate = Number(
    //   parseFloat(new Date().getTime() / 1000).toFixed(0),
    // );
    // tempFilter.toDate = Number(
    //   parseFloat(
    //     new Date(
    //       new Date(new Date().setHours(0, 0, 0, 0)) + 24 * 60 * 60 * 1000,
    //     ) / 1000,
    //   ).toFixed(0),
    // );

    setFilters({
      ...tempFilter,
    });
    setPageFrom(0);
    setRecentMatch([]);
    applyFilter(tempFilter);
  }, [location]);

  const getRecentGames = useCallback(
    (filerGames) => {
      // Recent match query
      setSmallLoader(true);
      const recentMatchQuery = {
        size: pageSize,
        from: pageFrom,
        query: {
          bool: {
            must: [{match: {status: 'ended'}}],
          },
        },
        sort: [{actual_enddatetime: 'desc'}],
      };

      if (filerGames.location !== strings.worldTitleText) {
        recentMatchQuery.query.bool.must.push({
          multi_match: {
            query: filerGames.location.toLowerCase(),
            fields: ['city', 'country', 'state', 'venue.address'],
          },
        });
      }

      if (
        authContext.entity.role === Verbs.entityTypeUser ||
        authContext.entity.role === Verbs.entityTypeClub
      ) {
        if (filerGames.sport !== strings.allSport) {
          recentMatchQuery.query.bool.must.push({
            term: {
              'sport.keyword': {
                value: filerGames.sport,
              },
            },
          });
          recentMatchQuery.query.bool.must.push({
            term: {
              'sport_type.keyword': {
                value: filerGames.sport_type,
              },
            },
          });
        }
      } else if (authContext.entity.role === Verbs.entityTypeTeam) {
        if (route.params.teamSportData?.sport) {
          recentMatchQuery.query.bool.must.push({
            term: {
              'sport.keyword': {
                value: `${route.params.teamSportData.sport.toLowerCase()}`,
              },
            },
          });
          recentMatchQuery.query.bool.must.push({
            term: {
              'sport_type.keyword': {
                value: `${route.params.teamSportData.sport_type.toLowerCase()}`,
              },
            },
          });
        }
      }

      if (filerGames.entityName) {
        recentMatchQuery.query.bool.must.push({
          multi_match: {
            query: filerGames.entityID,
            fields: ['home_team', 'away_team'],
          },
        });
      }
      if (filerGames.fromDateTime && filerGames.toDateTime) {
        recentMatchQuery.query.bool.must.push({
          range: {
            start_datetime: {
              gt: filerGames.fromDateTime,
              lt: filerGames.toDateTime,
            },
          },
        });
      } else if (!filerGames.fromDate && !filerGames?.toDate) {
        recentMatchQuery.query.bool.must.push({
          range: {
            start_datetime: {
              lt: Number(parseFloat(new Date().getTime() / 1000).toFixed(0)),
            },
          },
        });
      } else if (filerGames.fromDate && !filerGames?.toDate) {
        recentMatchQuery.query.bool.must.push({
          range: {
            start_datetime: {
              gt: Number(
                parseFloat(
                  new Date(filerGames.fromDate).getTime() / 1000,
                ).toFixed(0),
              ),
              lt: Number(parseFloat(new Date().getTime() / 1000).toFixed(0)),
            },
          },
        });
      } else if (!filerGames?.fromDate && filerGames.toDate) {
        recentMatchQuery.query.bool.must.push({
          range: {
            start_datetime: {
              lt: Number(
                parseFloat(
                  new Date(filerGames.toDate).getTime() / 1000,
                ).toFixed(0),
              ),
            },
          },
        });
      }
      console.log('recentMatchQuery ==>', recentMatchQuery);
      // Recent match query
      getGameIndex(recentMatchQuery)
        .then((games) => {
          setSmallLoader(false);
          if (games.length > 0) {
            console.log('games==', games);
            Utility.getGamesList(games).then((gamedata) => {
              const fetchedData = [...recentMatch, ...gamedata];
              setRecentMatch(fetchedData);
              setSearchData(fetchedData);
              setPageFrom(pageFrom + pageSize);
              stopFetchMore = true;
            });
          }
        })
        .catch((e) => {
          setSmallLoader(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [pageFrom, pageSize, recentMatch],
  );

  const renderRecentMatchItems = useCallback(({item}) => {
    console.log('Recent Item:=>', item);
    return (
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
    );
  }, []);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const onScrollHandler = () => {
    setLoadMore(true);
    if (!stopFetchMore) {
      getRecentGames(filters);
      stopFetchMore = true;
    }
    setLoadMore(false);
  };
  const handleTagPress = ({item}) => {
    const tempFilter = filters;
    Object.keys(tempFilter).forEach((key) => {
      if (key === Object.keys(item)[0]) {
        if (Object.keys(item)[0] === 'sport') {
          tempFilter.sport = strings.allSport;
          tempFilter.sport_name = strings.allSport;
          tempFilter.sport_type = strings.allSport;
        }
        if (Object.keys(item)[0] === 'location') {
          tempFilter.location = strings.worldTitleText;
          tempFilter.locationOption = locationType.WORLD;
          tempFilter.isSearchPlaceholder = true;
        }
        if (Object.keys(item)[0] === 'availableTime') {
          delete tempFilter.availableTime;
          delete tempFilter.fromDateTime;
          delete tempFilter.toDateTime;
        }
      }
    });
    setFilters({...tempFilter});
    // applyFilter();
    setTimeout(() => {
      setPageFrom(0);
      setRecentMatch([]);
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
  const applyFilter = useCallback((fil) => {
    getRecentGames(fil);
  }, []);

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
            fontSize: 26,
          }}>
          {strings.noGames}
        </Text>
      )}
    </View>
  );
  const searchFilterFunction = (text) => {
    const result = recentMatch.filter(
      (x) =>
        x.away_team_name.toLowerCase().includes(text.toLowerCase()) ||
        x.home_team_name.toLowerCase().includes(text.toLowerCase()) ||
        x.city.toLowerCase().includes(text.toLowerCase()),
    );
    if (text.length > 0) {
      setRecentMatch(result);
    } else {
      setRecentMatch(searchData);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.completedMatches}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />
      <ActivityLoader visible={loading} />
      <View style={styles.searchView}>
        {/* <View style={styles.searchViewContainer}>
          <TextInput
            placeholder={strings.searchText}
            style={styles.searchTxt}
            onChangeText={(text) => {
              searchFilterFunction(text);
            }}
            // value={search}
          />
          <TouchableWithoutFeedback onPress={() => setSettingPopup(true)}>
            <Image source={images.homeSetting} style={styles.settingImage} />
          </TouchableWithoutFeedback>
        </View> */}
        <View style={styles.floatingInput}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={strings.searchText}
              style={styles.searchTxt}
              autoCorrect={false}
              onChangeText={(text) => {
                searchFilterFunction(text);
              }}
              value={filters.searchText}
            />
            {filters.searchText?.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  const tempFilter = {...filters};
                  tempFilter.searchText = '';
                  setFilters({
                    ...tempFilter,
                  });
                  setPageFrom(0);
                  setRecentMatch([]);
                  applyFilter(tempFilter);
                }}>
                <Image
                  source={images.closeRound}
                  style={{
                    height: 15,
                    width: 15,
                    resizeMode: 'cover',
                    alignSelf: 'center',
                    marginRight: 10,
                  }}
                />
              </TouchableOpacity>
            )}
            <TouchableWithoutFeedback
              onPress={() => {
                setSettingPopup(true);
              }}>
              <Image source={images.homeSetting} style={styles.settingImage} />
            </TouchableWithoutFeedback>
          </View>
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
        showsHorizontalScrollIndicator={false}
        data={recentMatch}
        keyExtractor={keyExtractor}
        renderItem={renderRecentMatchItems}
        style={styles.listStyle}
        contentContainerStyle={{paddingBottom: 1}}
        onEndReached={onScrollHandler}
        onEndReachedThreshold={0.01}
        onScrollBeginDrag={() => {
          stopFetchMore = false;
        }}
        ListEmptyComponent={listEmptyComponent}
      />
      <SearchModal
        fType={filterType.RECENTMATCHS}
        showSportOption={
          (authContext.entity.role === Verbs.entityTypeUser && true) ||
          (authContext.entity.role === Verbs.entityTypeTeam && false) ||
          (authContext.entity.role === Verbs.entityTypeClub && true)
        }
        sports={sports}
        filterObject={filters}
        isVisible={settingPopup}
        onPressApply={async (filterData) => {
          setloading(false);
          let tempFilter = {};
          tempFilter = {...filterData};
          setSettingPopup(false);
          setPageFrom(0);
          setRecentMatch([]);
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
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listStyle: {
    padding: 15,
  },

  settingImage: {
    height: 20,
    width: 20,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginRight: 15,
  },
  searchView: {
    backgroundColor: colors.grayBackgroundColor,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchTxt: {
    marginLeft: 15,
    fontSize: widthPercentageToDP('3.8%'),
    width: widthPercentageToDP('70%'),
  },
  loaderStyle: {
    height: 25,
    width: 25,
    marginBottom: 10,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 25,
    backgroundColor: colors.lightGrey,
    height: 45,
  },
  floatingInput: {
    alignSelf: 'center',
    zIndex: 1,
    width: '90%',
    marginTop: 20,
  },
});
