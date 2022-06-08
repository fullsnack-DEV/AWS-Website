/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
import React, {useCallback, useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

// import ActivityLoader from '../../components/loader/ActivityLoader';

import Modal from 'react-native-modal';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import AuthContext from '../../auth/context';

import {getLocationNameWithLatLong} from '../../api/External';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import {widthPercentageToDP} from '../../utils';
import DateTimePickerView from '../../components/Schedule/DateTimePickerModal';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../../components/TCThinDivider';

import strings from '../../Constants/String';
import {
  getGameIndex,
  getGroupIndex,
  getUserIndex,
} from '../../api/elasticSearch';
import TCTagsFilter from '../../components/TCTagsFilter';
import TCPicker from '../../components/TCPicker';
import TCUpcomingMatchCard from '../../components/TCUpcomingMatchCard';
import {getGameHomeScreen} from '../../utils/gameUtils';

let stopFetchMore = true;
const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;

export default function UpcomingMatchScreen({navigation, route}) {
  // const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [filters, setFilters] = useState(route?.params?.filters);

  const [settingPopup, setSettingPopup] = useState(false);
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(0);

  const [sports, setSports] = useState([]);

  const [datePickerFor, setDatePickerFor] = useState();
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const [fromDate, setFromDate] = useState(
    filters?.fromDate && new Date(filters?.fromDate),
  );
  const [toDate, setToDate] = useState(
    filters?.toDate && new Date(filters?.toDate),
  );

  const [searchName, setSearchName] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState();

  const [upcomingMatch, setUpcomingMatch] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [loadMore, setLoadMore] = useState(false);
  const [searchData, setSearchData] = useState();
  const [selectedSport, setSelectedSport] = useState({
    sport: route?.params?.filters.sport,
    sport_type: route?.params?.filters.sport_type,
  });
  const [location, setLocation] = useState(route?.params?.filters.location);

  console.log('Upcoming Match Filter:=>', filters);

  useEffect(() => {
    if (route?.params?.locationText) {
      setSettingPopup(true);
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
    const list = [
      {
        label: 'All',
        value: 'All',
      },
    ];
    let sportArr = [];

    authContext.sports.map((item) => {
      sportArr = [...sportArr, ...item.format];
      return null;
    });
    sportArr.map((obj) => {
      const dataSource = {
        label: Utility.getSportName(obj, authContext),
        value: Utility.getSportName(obj, authContext),
      };
      list.push(dataSource);
    });

    setSports(list);
  }, [authContext]);

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

      if (filerGames.location !== 'world') {
        upcomingMatchQuery.query.bool.must.push({
          multi_match: {
            query: filerGames.location.toLowerCase(),
            fields: ['city', 'country', 'state', 'venue.address'],
          },
        });
      }
      if (filerGames.sport !== 'All') {
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
      if (filerGames.entityName) {
        upcomingMatchQuery.query.bool.must.push({
          multi_match: {
            query: filerGames.entityID,
            fields: ['home_team', 'away_team'],
          },
        });
      }

      if (filerGames.fromDate && filerGames.toDate) {
        upcomingMatchQuery.query.bool.must.push({
          range: {
            start_datetime: {
              gt: Number(
                parseFloat(
                  new Date(filerGames.fromDate).getTime() / 1000,
                ).toFixed(0),
              ),
              lt: Number(
                parseFloat(
                  new Date(filerGames.toDate).getTime() / 1000,
                ).toFixed(0),
              ),
            },
          },
        });
      } else if (!filerGames.fromDate && !filerGames?.toDate) {
        console.log('from:::', filerGames.fromDate);

        console.log(
          'from:::',
          parseFloat(new Date(filerGames.fromDate).getTime() / 1000).toFixed(0),
        );
        upcomingMatchQuery.query.bool.must.push({
          range: {
            start_datetime: {
              gt: Number(parseFloat(new Date().getTime() / 1000).toFixed(0)),
            },
          },
        });
      } else if (filerGames.fromDate && !filerGames?.toDate) {
        console.log('from:::', filerGames.fromDate);

        console.log(
          'from:::',
          parseFloat(new Date(filerGames.fromDate).getTime() / 1000).toFixed(0),
        );
        upcomingMatchQuery.query.bool.must.push({
          range: {
            start_datetime: {
              gt: Number(
                parseFloat(
                  new Date(filerGames.fromDate).getTime() / 1000,
                ).toFixed(0),
              ),
            },
          },
        });
      } else if (!filerGames?.fromDate && filerGames.toDate) {
        upcomingMatchQuery.query.bool.must.push({
          range: {
            start_datetime: {
              lt: Number(
                parseFloat(
                  new Date(filerGames.toDate).getTime() / 1000,
                ).toFixed(0),
              ),
              gt: Number(parseFloat(new Date().getTime() / 1000).toFixed(0)),
            },
          },
        });
      }
      console.log(
        'Upcoming match Query:=>',
        JSON.stringify(upcomingMatchQuery),
      );
      // Upcoming match query

      getGameIndex(upcomingMatchQuery)
        .then((games) => {
          console.log('Upcoming match response :=>', games);

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
            Alert.alert(strings.alertmessagetitle, e);
          }, 10);
        });
    },
    [pageFrom, pageSize, upcomingMatch],
  );

  useEffect(() => {
    getUpcomingGames(filters);
  }, []);

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
              Alert.alert('Game ID does not exist.');
            }
          }}
        />
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const handleDonePress = (date) => {
    if (datePickerFor === 'from') {
      console.log('From date:', new Date(date));
      setFromDate(new Date(date));
      setShowFrom(false);
    } else {
      setToDate(new Date(date));
      setShowTo(false);
    }
  };
  const handleCancelPress = () => {
    if (datePickerFor === 'from') {
      setShowFrom(false);
    } else {
      setShowTo(false);
    }
  };

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
          tempFilter.sport = 'All';
        }
        if (Object.keys(item)[0] === 'location') {
          tempFilter.location = 'world';
        }
        if (Object.keys(item)[0] === 'fromDate') {
          setFromDate();
          delete tempFilter.fromDate;
        }
        if (Object.keys(item)[0] === 'toDate') {
          setToDate();
          delete tempFilter.toDate;
        }
        if (Object.keys(item)[0] === 'entityName') {
          setSelectedEntity();
          setIsSelected(false);
          delete tempFilter.entityName;
          delete tempFilter.entityID;
        }
        // delete tempFilter[key];
      }
    });
    console.log('Temp filter', tempFilter);
    setFilters({...tempFilter});
    // applyFilter();
    setTimeout(() => {
      setPageFrom(0);
      setUpcomingMatch([]);
      applyFilter(tempFilter);
    }, 10);
  };

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
          // setFilters({
          //   ...filters,
          //   location: city.charAt(0).toUpperCase() + city.slice(1),
          // });
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
        No Games
      </Text>
    </View>
  );
  const searchFilterFunction = (text) => {
    const result = upcomingMatch.filter(
      (x) =>
        x.full_name.toLowerCase().includes(text.toLowerCase()) ||
        x.city.toLowerCase().includes(text.toLowerCase()),
    );
    if (text.length > 0) {
      setUpcomingMatch(result);
    } else {
      setUpcomingMatch(searchData);
    }
  };

  const renderEntity = ({item}) => {
    console.log('ITEM:=>', item);
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('selected ITEM:=>', item);
          setIsSelected(true);
          setSelectedEntity(item);
        }}
        style={{flexDirection: 'row', alignItems: 'center', margin: 5}}>
        <Image
          source={
            item?.thumbnail ? {uri: item?.thumbnail} : images.profilePlaceHolder
          }
          style={{
            height: 25,
            width: 25,
            resizeMode: 'contain',
            borderRadius: 50,
          }}
        />

        <Text style={styles.searchItem}>
          {item?.group_name || item?.full_name}
        </Text>

        <Text style={styles.locationItem}>
          {`${item?.city}, ${item.state_abbr}`}
        </Text>
      </TouchableOpacity>
    );
  };

  const searchEntityList = (text) => {
    const groupQuery = {
      size: 100,
      query: {
        query_string: {default_field: 'group_name', query: `*${text}*`},
      },
    };

    const userQuery = {
      size: 100,
      query: {
        query_string: {default_field: 'full_name', query: `*${text}*`},
      },
    };

    console.log('Group query:=>', JSON.stringify(groupQuery));
    console.log('User query:=>', JSON.stringify(userQuery));

    if (
      selectedSport.sport === 'tennis' &&
      selectedSport.sport_type === 'single'
    ) {
      getUserIndex(userQuery).then((res) => {
        console.log('res entity list:=>', res);
        setEntityData([...res]);
      });
    } else {
      getGroupIndex(groupQuery).then((res) => {
        console.log('res entity list:=>', res);
        setEntityData([...res]);
      });
    }
  };

  const onPressReset = () => {
    setFilters({
      location: 'world',
      sport: 'All',
      sport_type: 'All',
    });
    setLocation('world');
    setSelectedSport({
      sort: 'All',
      sport_type: 'All',
    });
    setFromDate();
    setToDate();
  };
  return (
    <View>
      <View style={styles.searchView}>
        <View style={styles.searchViewContainer}>
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
        </View>
      </View>
      <TCTagsFilter
        filter={filters}
        authContext={authContext}
        dataSource={Utility.getFiltersOpetions(filters)}
        onTagCancelPress={handleTagPress}
      />
      <FlatList
        extraData={upcomingMatch}
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
      <Modal
        isVisible={settingPopup}
        onBackdropPress={() => setSettingPopup(false)}
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
            {height: Dimensions.get('window').height - 100},
          ]}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <ScrollView style={{flex: 1}}>
              <View style={styles.viewsContainer}>
                <Text
                  onPress={() => setSettingPopup(false)}
                  style={styles.cancelText}>
                  Cancel
                </Text>
                <Text style={styles.locationText}>Filter</Text>
                <Text
                  style={styles.doneText}
                  onPress={() => {
                    setSettingPopup(false);
                    setTimeout(() => {
                      const tempFilter = {...filters};
                      tempFilter.sport = selectedSport.sport;
                      tempFilter.sport_type = selectedSport.sport_type;
                      tempFilter.location = location;

                      if (fromDate) {
                        tempFilter.fromDate = moment(fromDate).format(
                          'MM/DD/YYYY hh:mm a',
                        );
                      } else {
                        delete tempFilter.fromDate;
                      }
                      if (toDate) {
                        tempFilter.toDate = moment(toDate).format(
                          'MM/DD/YYYY hh:mm a',
                        );
                      } else {
                        delete tempFilter.toDate;
                      }
                      if (selectedEntity && isSelected) {
                        tempFilter.entityName =
                          selectedEntity?.group_name ??
                          selectedEntity?.full_name;
                        tempFilter.entityID =
                          selectedEntity?.group_id ?? selectedEntity?.full_id;
                      } else {
                        delete tempFilter.entityName;
                        delete tempFilter.entityID;
                      }

                      setFilters({
                        ...tempFilter,
                      });

                      setPageFrom(0);
                      setUpcomingMatch([]);
                      applyFilter(tempFilter);
                    }, 100);
                    console.log('DONE::');
                  }}>
                  {'Apply'}
                </Text>
              </View>
              <TCThinDivider width={'100%'} marginBottom={15} />
              <View>
                <View style={{flexDirection: 'column', margin: 15}}>
                  <View>
                    <Text style={styles.filterTitle}>Location</Text>
                  </View>
                  <View style={{marginTop: 10, marginLeft: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.filterTitle}>World</Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(0);
                          // setFilters({
                          //   ...filters,
                          //   location: 'world',
                          // });
                        }}>
                        <Image
                          source={
                            locationFilterOpetion === 0
                              ? images.checkRoundOrange
                              : images.radioUnselect
                          }
                          style={styles.radioButtonStyle}
                        />
                      </TouchableWithoutFeedback>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.filterTitle}>Home City</Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(1);
                          setLocation(
                            authContext?.entity?.obj?.city
                              .charAt(0)
                              .toUpperCase() +
                              authContext?.entity?.obj?.city.slice(1),
                          );
                          // setFilters({
                          //   ...filters,
                          //   location:
                          //     authContext?.entity?.obj?.city
                          //       .charAt(0)
                          //       .toUpperCase()
                          //     + authContext?.entity?.obj?.city.slice(1),
                          // });
                        }}>
                        <Image
                          source={
                            locationFilterOpetion === 1
                              ? images.checkRoundOrange
                              : images.radioUnselect
                          }
                          style={styles.radioButtonStyle}
                        />
                      </TouchableWithoutFeedback>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.filterTitle}>Current City</Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(2);
                          getLocation();
                        }}>
                        <Image
                          source={
                            locationFilterOpetion === 2
                              ? images.checkRoundOrange
                              : images.radioUnselect
                          }
                          style={styles.radioButtonStyle}
                        />
                      </TouchableWithoutFeedback>
                    </View>

                    <TouchableWithoutFeedback
                      onPress={() => {
                        setLocationFilterOpetion(3);
                        setSettingPopup(false);
                        navigation.navigate('SearchCityScreen', {
                          comeFrom: 'UpcomingMatchScreen',
                        });
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        {/* <TCSearchCityView
                      getCity={(value) => {
                        console.log('Value:=>', value);
                        setSelectedCity(value);
                      }}
                      // value={selectedCity}
                    /> */}

                        <View style={styles.searchCityContainer}>
                          <Text style={styles.searchCityText}>
                            {route?.params?.locationText || 'Search City'}
                          </Text>
                        </View>
                        <View
                          style={{
                            alignSelf: 'center',
                          }}>
                          <Image
                            source={
                              locationFilterOpetion === 3
                                ? images.checkRoundOrange
                                : images.radioUnselect
                            }
                            style={styles.radioButtonStyle}
                          />
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'column',
                      margin: 15,
                      justifyContent: 'space-between',
                    }}>
                    <View style={{}}>
                      <Text style={styles.filterTitle}>Sport</Text>
                    </View>
                    <View style={{marginTop: 10}}>
                      <TCPicker
                        dataSource={sports}
                        placeholder={'Select Sport'}
                        onValueChange={(value) => {
                          if (value === 'All') {
                            setSelectedSport({
                              sport: 'All',
                              sport_type: 'All',
                            });
                            setSelectedEntity();
                            setEntityData([]);
                          } else {
                            setSelectedSport(
                              Utility.getSportObjectByName(value, authContext),
                            );
                            setSelectedEntity();
                            setEntityData([]);
                          }
                        }}
                        value={Utility.getSportName(selectedSport, authContext)}
                      />
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'column', margin: 15}}>
                  <View>
                    <Text style={styles.filterTitle}>Time</Text>
                  </View>
                  <View style={{marginTop: 10}}>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                      <View style={styles.fieldView}>
                        <View
                          style={{
                            height: 35,
                            justifyContent: 'center',
                          }}>
                          <Text style={styles.fieldTitle} numberOfLines={1}>
                            From
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            setDatePickerFor('from');
                            setShowFrom(!showFrom);
                          }}
                          style={{marginRight: 15, flexDirection: 'row'}}>
                          <Text style={styles.fieldValue} numberOfLines={1}>
                            {fromDate
                              ? `${moment(fromDate).format(
                                  'MMM DD, YYYY',
                                )}      ${moment(fromDate).format('h:mm a')}`
                              : 'Select Date'}
                          </Text>
                        </TouchableOpacity>
                        {fromDate && (
                          <TouchableOpacity
                            onPress={() => {
                              setFromDate();
                            }}>
                            <Image
                              source={images.menuClose}
                              style={{height: 10, width: 10, marginRight: 15}}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <View style={styles.fieldView}>
                        <View
                          style={{
                            height: 35,
                            justifyContent: 'center',
                          }}>
                          <Text style={styles.fieldTitle} numberOfLines={1}>
                            To
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            setDatePickerFor('to');
                            setShowTo(!showTo);
                          }}
                          style={{marginRight: 15, flexDirection: 'row'}}>
                          <Text style={styles.fieldValue} numberOfLines={1}>
                            {toDate
                              ? `${moment(toDate).format(
                                  'MMM DD, YYYY',
                                )}      ${moment(toDate).format('h:mm a')}`
                              : 'Select Date'}
                          </Text>
                        </TouchableOpacity>
                        {toDate && (
                          <TouchableOpacity
                            onPress={() => {
                              setToDate();
                            }}>
                            <Image
                              source={images.menuClose}
                              style={{height: 10, width: 10, marginRight: 15}}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: fonts.RLight,
                        color: colors.lightBlackColor,
                        textAlign: 'right',
                        marginTop: 10,
                      }}>
                      Time zone{' '}
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: fonts.RRegular,
                          color: colors.lightBlackColor,
                          textDecorationLine: 'underline',
                        }}>
                        Vancouver
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
              {/* Rate View */}
              {/* <View>
              <View
                style={{
                  flexDirection: 'row',
                  margin: 15,
                  marginTop: 0,
                  justifyContent: 'space-between',
                }}>
                <View style={{ flex: 0.2 }}>
                  <Text style={styles.filterTitle}>Rating</Text>
                </View>
                <View
                  style={{
                    marginLeft: 15,
                    flex: 0.6,
                    alignSelf: 'flex-end',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 10,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.minMaxTitle}>Min</Text>
                    <AirbnbRating
                      count={5}
                      fractions={1}
                      showRating={false}
                      defaultRating={0}
                      size={20}
                      isDisabled={false}
                      selectedColor={'#f49c20'}
                    />
                    <Text style={styles.starCount}>2.0</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.minMaxTitle}>Max</Text>
                    <AirbnbRating
                      count={5}
                      fractions={1}
                      showRating={false}
                      defaultRating={0}
                      size={20}
                      isDisabled={false}
                      selectedColor={'#f49c20'}
                    />
                    <Text style={styles.starCount}>2.0</Text>
                  </View>
                </View>
              </View>

            </View> */}
              {/* Rate View */}

              {selectedSport.sport !== 'All' && (
                <View
                  style={{
                    flexDirection: 'column',
                    margin: 15,
                    justifyContent: 'space-between',
                  }}>
                  <View style={{}}>
                    <Text style={styles.filterTitle}>Team Or Player</Text>
                  </View>
                  <View style={{marginTop: 10}}>
                    <View
                      style={{
                        flexDirection: 'column',
                        // justifyContent: 'space-between',
                      }}>
                      <TextInput
                        onChangeText={(text) => {
                          setIsSelected(false);
                          setSearchName(text);
                          searchEntityList(text);
                        }}
                        value={
                          isSelected
                            ? selectedEntity?.group_name ??
                              selectedEntity?.full_name
                            : searchName
                        }
                        style={styles.teamNameTextView}
                        placeholder={'Team or player name'}
                        autoCorrect={false}
                        clearButtonMode={'always'}
                        placeholderTextColor={colors.userPostTimeColor}
                      />
                      {!isSelected && (
                        <View
                          style={{
                            marginTop: 15,
                            height: 200,
                            backgroundColor: colors.whiteColor,
                            borderRadius: 5,
                            shadowColor: colors.googleColor,
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.3,
                            shadowRadius: 5,
                            elevation: 3,
                          }}>
                          <FlatList
                            data={entityData}
                            renderItem={renderEntity}
                            keyExtractor={keyExtractor}
                            // ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              )}

              <View style={{flex: 1}} />
            </ScrollView>
          </KeyboardAvoidingView>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              Alert.alert(
                'Are you sure want to reset filters?',
                '',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => onPressReset(),
                  },
                ],
                {cancelable: false},
              );
            }}>
            <Text style={styles.resetTitle}>Reset</Text>
          </TouchableOpacity>
        </View>
        <DateTimePickerView
          date={fromDate}
          visible={showFrom}
          onDone={handleDonePress}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          minimumDate={new Date()}
          // minutesGap={30}
          mode={'datetime'}
        />
        <DateTimePickerView
          date={toDate}
          visible={showTo}
          onDone={handleDonePress}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          minimumDate={fromDate || new Date()}
          // maximumDate={new Date()}
          // minutesGap={30}
          mode={'datetime'}
        />
      </Modal>
    </View>
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

  radioButtonStyle: {
    height: 22,
    width: 22,
    resizeMode: 'cover',
    alignSelf: 'center',
  },

  filterTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  // minMaxTitle: {
  //   fontSize: 16,
  //   fontFamily: fonts.RRegular,
  //   color: colors.userPostTimeColor,
  //   marginRight: 15,
  // },
  // starCount: {
  //   fontSize: 16,
  //   fontFamily: fonts.RMedium,
  //   color: colors.themeColor,
  //   marginLeft: 15,
  // },
  bottomPopupContainer: {
    flex: 1,
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
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
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
  fieldView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    height: 40,
    alignItems: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
  },
  fieldTitle: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    marginLeft: 10,
    width: 100,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    textAlign: 'right',
  },
  resetButton: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    elevation: 5,
    height: 30,
    width: 113,
    shadowOpacity: 0.16,
    flexDirection: 'row',
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  resetTitle: {
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    // margin: 15,
  },

  searchCityContainer: {
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    width: widthPercentageToDP('75%'),
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    justifyContent: 'center',
  },

  searchCityText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  searchTxt: {
    marginLeft: 15,
    fontSize: widthPercentageToDP('3.8%'),
    width: widthPercentageToDP('75%'),
  },
  teamNameTextView: {
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    width: widthPercentageToDP('92%'),
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    justifyContent: 'center',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  searchItem: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginLeft: 10,
  },
  locationItem: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
    marginLeft: 10,
  },
});
