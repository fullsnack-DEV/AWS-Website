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
import TCUpcomingMatchCard from '../../components/TCUpcomingMatchCard';
import {getGameHomeScreen} from '../../utils/gameUtils';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {locationType, filterType} from '../../utils/constant';
import SearchModal from '../../components/Filter/SearchModal';
import {getSportList} from '../../utils/sportsActivityUtils';
import Verbs from '../../Constants/Verbs';
import ScreenHeader from '../../components/ScreenHeader';

let stopFetchMore = true;

export default function UpcomingMatchScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [filters, setFilters] = useState(route?.params?.filters);
  const [settingPopup, setSettingPopup] = useState(false);
  const [sports, setSports] = useState([]);
  const [upcomingMatch, setUpcomingMatch] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [loadMore, setLoadMore] = useState(false);
  const [searchData, setSearchData] = useState();
  const [location, setLocation] = useState(route.params?.filters?.location);

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
      setSports([...defaultSport, ...authContext.entity.obj.sports]);
    }
  }, [authContext]);

  useEffect(() => {
    getUpcomingGames(filters);
  }, []);

  useEffect(() => {
    const tempFilter = {...filters};
    tempFilter.location = location;
    setFilters({
      ...tempFilter,
    });
    setPageFrom(0);
    setUpcomingMatch([]);
    applyFilter(tempFilter);
  }, [location]);

  const getUpcomingGames = useCallback(
    (filerGames) => {
      // Upcoming match query
      const upcomingMatchQuery = {
        size: pageSize,
        from: pageFrom,
        query: {
          bool: {
            must: [],
          },
        },
        sort: [{actual_enddatetime: 'desc'}],
      };

      if (filerGames.location !== strings.worldTitleText) {
        upcomingMatchQuery.query.bool.must.push({
          multi_match: {
            query: `${filerGames.location}`,
            fields: ['city', 'country', 'state', 'venue.address'],
          },
        });
      }

      if (
        authContext.entity.role === Verbs.entityTypeUser ||
        authContext.entity.role === Verbs.entityTypeClub
      ) {
        if (filerGames.sport !== strings.allSport) {
          upcomingMatchQuery.query.bool.must.push({
            term: {
              'sport.keyword': {
                value: filerGames.sport,
              },
            },
          });
          upcomingMatchQuery.query.bool.must.push({
            term: {
              'sport_type.keyword': {
                value: filerGames.sport_type,
              },
            },
          });
        }
      } else if (authContext.entity.role === Verbs.entityTypeTeam) {
        if (route.params.teamSportData?.sport) {
          upcomingMatchQuery.query.bool.must.push({
            term: {
              'sport.keyword': {
                value: `${route.params.teamSportData.sport.toLowerCase()}`,
              },
            },
          });
          upcomingMatchQuery.query.bool.must.push({
            term: {
              'sport_type.keyword': {
                value: `${route.params.teamSportData.sport_type.toLowerCase()}`,
              },
            },
          });
        }
      }

      // if (filerGames.sport !== strings.allSport) {
      //   upcomingMatchQuery.query.bool.must.push({
      //     term: {
      //       'sport.keyword': {
      //         value: filerGames.sport,
      //       },
      //     },
      //   });
      //   upcomingMatchQuery.query.bool.must.push({
      //     term: {
      //       'sport_type.keyword': {
      //         value: filerGames.sport_type,
      //       },
      //     },
      //   });
      // }
      if (filerGames.entityName) {
        upcomingMatchQuery.query.bool.must.push({
          multi_match: {
            query: filerGames.entityID,
            fields: ['home_team', 'away_team'],
          },
        });
      }

      if (filerGames.fromDateTime && filerGames.toDateTime) {
        upcomingMatchQuery.query.bool.must.push({
          range: {
            start_datetime: {
              gte: filerGames.fromDateTime,
              lte: filerGames.toDateTime,
            },
          },
        });
      } else if (!filerGames.fromDateTime && !filerGames?.toDateTime) {
        upcomingMatchQuery.query.bool.must.push({
          range: {
            start_datetime: {
              gte: Number(parseFloat(new Date().getTime() / 1000).toFixed(0)),
            },
          },
        });
      } else if (filerGames.fromDateTime && !filerGames?.toDateTime) {
        upcomingMatchQuery.query.bool.must.push({
          range: {
            start_datetime: {
              gte: filerGames.fromDateTime,
            },
          },
        });
      } else if (!filerGames?.fromDateTime && filerGames.toDateTime) {
        upcomingMatchQuery.query.bool.must.push({
          range: {
            start_datetime: {
              lte: filerGames.toDateTime,
              gte: Number(parseFloat(new Date().getTime() / 1000).toFixed(0)),
            },
          },
        });
      }
      // Upcoming match query
      console.log('upcomingMatchQuery ==>', JSON.stringify(upcomingMatchQuery));
      getGameIndex(upcomingMatchQuery)
        .then((games) => {
          if (games.length > 0) {
            Utility.getGamesList(games).then((gamedata) => {
              const fetchedData = [...upcomingMatch, ...gamedata];
              setUpcomingMatch(fetchedData);
              setSearchData(fetchedData);
              setPageFrom(pageFrom + pageSize);
              stopFetchMore = true;
            });
          }
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [
      authContext.entity.role,
      pageFrom,
      pageSize,
      route.params.teamSportData?.sport,
      route.params.teamSportData?.sport_type,
      upcomingMatch,
    ],
  );

  const renderUpcomingMatchItems = useCallback(({item}) => {
    console.log('Upcoming Item:=>', item);
    return (
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
    );
  }, []);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const onScrollHandler = () => {
    setLoadMore(true);
    if (!stopFetchMore) {
      getUpcomingGames(filters);
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
      setUpcomingMatch([]);
      applyFilter(tempFilter);
    }, 10);
  };

  const getLocation = () => {
    // setloading(true);
    getGeocoordinatesWithPlaceName(Platform.OS)
      .then((currentLocation) => {
        setloading(false);
        if (currentLocation.position) {
          setLocation(
            currentLocation.city?.charAt(0).toUpperCase() +
              currentLocation.city?.slice(1),
          );
          // setLocationFilterOpetion(2);
          setFilters({...filters, locationOption: 2});
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

  const applyFilter = useCallback((fil) => {
    getUpcomingGames(fil);
  }, []);

  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          fontFamily: fonts.RRegular,
          color: colors.grayColor,
          fontSize: 26,
        }}>
        {strings.noGames}
      </Text>
    </View>
  );

  const searchFilterFunction = (text) => {
    const result = upcomingMatch.filter(
      (x) =>
        x.away_team_name.toLowerCase().includes(text.toLowerCase()) ||
        x.home_team_name.toLowerCase().includes(text.toLowerCase()) ||
        x.city.toLowerCase().includes(text.toLowerCase()),
    );
    if (text.length > 0) {
      setUpcomingMatch(result);
    } else {
      setUpcomingMatch(searchData);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.upcomingMatchesTitle}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />
      <ActivityLoader visible={loading} />
      <View style={styles.searchView}>
        <View style={styles.searchViewContainer}>
          <TextInput
            placeholder={strings.searchText}
            style={styles.searchTxt}
            onChangeText={(text) => {
              searchFilterFunction(text);
            }}
          />
          <TouchableWithoutFeedback onPress={() => setSettingPopup(true)}>
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
        showsHorizontalScrollIndicator={false}
        data={upcomingMatch}
        keyExtractor={keyExtractor}
        renderItem={renderUpcomingMatchItems}
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
        fType={filterType.UPCOMINGMATCHES}
        showSportOption={
          (authContext.entity.role === Verbs.entityTypeUser && true) ||
          (authContext.entity.role === Verbs.entityTypeTeam && false) ||
          (authContext.entity.role === Verbs.entityTypeClub && true)
        }
        sports={sports}
        filterObject={filters}
        feeTitle={strings.refereeFee}
        isVisible={settingPopup}
        onPressApply={(filterData) => {
          setloading(false);
          let tempFilter = {};
          tempFilter = {...filterData};
          setSettingPopup(false);
          setPageFrom(0);
          setUpcomingMatch([]);
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
            getLocation();
            tempFilter.location = location;
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

  searchViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    width: widthPercentageToDP('92%'),
    borderRadius: 20,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    backgroundColor: colors.offwhite,
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
    width: widthPercentageToDP('75%'),
  },
});
