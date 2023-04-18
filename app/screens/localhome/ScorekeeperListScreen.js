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
import TCThinDivider from '../../components/TCThinDivider';
import {strings} from '../../../Localization/translation';
import {getUserIndex} from '../../api/elasticSearch';
import TCTagsFilter from '../../components/TCTagsFilter';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {locationType} from '../../utils/constant';
import TCPlayerView from '../../components/TCPlayerView';
import {getSportList} from '../../utils/sportsActivityUtils';
import Verbs from '../../Constants/Verbs';
import SearchModal from '../../components/Filter/SearchModal';

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

  useEffect(() => {
    const defaultSport = [
      {
        sport: strings.allSport,
        sport_name: strings.allSport,
        sport_type: strings.allSport,
      },
    ];

    setSports([
      ...defaultSport,
      ...getSportList(authContext.sports, Verbs.entityTypeReferee),
    ]);
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
      if (filerScorekeeper?.sport !== strings.allSport) {
        scorekeeperQuery.query.bool.must[0].nested.query.bool.must.push({
          term: {
            'scorekeeper_data.sport.keyword': {
              value: filerScorekeeper?.sport,
            },
          },
        });
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
      // Scorekeeper query
      getUserIndex(scorekeeperQuery)
        .then((res) => {
          if (res.length > 0) {
            const modifiedResult = modifiedScoreKeeperElasticSearchResult(res);
            setScorekeepers([...scorekeepers, ...modifiedResult]);
            setPageFrom(pageFrom + pageSize);
            stopFetchMore = true;
          }
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [pageFrom, pageSize, scorekeepers],
  );

  const renderRefereesScorekeeperListView = useCallback(
    ({item}) => (
      <View style={[styles.separator, {flex: 1}]}>
        <TCPlayerView
          data={item}
          authContext={authContext}
          subTab={strings.scorekeeperTitle}
          showStar={filters.sport !== strings.allSport && true}
          showSport={true}
          sportFilter={filters}
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
          onPressBookButton={(scoreKeeperObj, sportObject) => {
            if (
              sportObject.setting?.scorekeeper_availibility &&
              sportObject.setting?.game_fee &&
              sportObject.setting?.refund_policy &&
              sportObject.setting?.available_area
            ) {
              navigation.navigate('ScorekeeperBookingDateAndTime', {
                settingObj: sportObject.setting,
                userData: scoreKeeperObj,
                showMatches: true,
                sportName: sportObject.sport,
              });
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

        // delete tempFilter[key];
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
  const getLocation = () => {
    // setloading(true);
    console.log('start location task');
    getGeocoordinatesWithPlaceName(Platform.OS)
      .then((currentLocation) => {
        console.log('result location task', currentLocation);
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
    getScorekeepers(fil);
  }, []);

  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          fontFamily: fonts.RRegular,
          color: colors.grayColor,
          fontSize: 26,
        }}>
        {strings.noScorekeeper}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
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
        sports={sports}
        filterObject={filters}
        isVisible={settingPopup}
        onPressApply={(filterData) => {
          setloading(false);
          console.log('filterData==>', filterData);
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
            getLocation();
            tempFilter.location = location;
          } else if (filterData.locationOption === locationType.SEARCH_CITY) {
            setLocation(filterData.searchCityLoc);
            tempFilter.location = filterData.searchCityLoc;
          }
          setFilters({...tempFilter});
          console.log('tempFilter-2===>', tempFilter);
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
    flex: 1,
    margin: 15,
  },
  separator: {
    borderRightWidth: 20,
    borderColor: colors.whiteColor,
  },
  searchViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    width: widthPercentageToDP('92%'),
    borderRadius: 25,
    elevation: 2,
    backgroundColor: '#F5F5F5',
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
});
