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
  SafeAreaView,
} from 'react-native';

// import ActivityLoader from '../../components/loader/ActivityLoader';

import Modal from 'react-native-modal';
// import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import AuthContext from '../../auth/context';

import {getLocationNameWithLatLong} from '../../api/External';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import {widthPercentageToDP} from '../../utils';
// import DateTimePickerView from '../../components/Schedule/DateTimePickerModal';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../../components/TCThinDivider';

import {strings} from '../../../Localization/translation';
import {getUserIndex} from '../../api/elasticSearch';
import TCScorekeeperView from '../../components/TCScorekeeperView';
import TCTagsFilter from '../../components/TCTagsFilter';
import TCPicker from '../../components/TCPicker';

let stopFetchMore = true;
const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;

export default function ScorekeeperListScreen({navigation, route}) {
  // const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [filters, setFilters] = useState(route?.params?.filters);

  const [settingPopup, setSettingPopup] = useState(false);
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(0);

  const [sports, setSports] = useState([]);

  // const [datePickerFor, setDatePickerFor] = useState();
  // const [show, setShow] = useState(false);
  // const [fromDate, setFromDate] = useState();
  // const [toDate, setToDate] = useState();
  const [minFee, setMinFee] = useState(0);
  const [maxFee, setMaxFee] = useState(0);
  const [scorekeepers, setScorekeepers] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [loadMore, setLoadMore] = useState(false);
  const [selectedSport, setSelectedSport] = useState({
    sport: route?.params?.filters.sport,
    sport_type: route?.params?.filters.sport_type,
  });
  const [location, setLocation] = useState(route?.params?.filters.location);

  // console.log('Scorekeeper Filter:=>', filters);

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
    authContext.sports.map((obj) => {
      const dataSource = {
        label: Utility.getSportName(obj, authContext),
        value: Utility.getSportName(obj, authContext),
      };
      list.push(dataSource);
    });

    setSports(list);
  }, [authContext]);

  const getScorekeepers = useCallback(
    (filerScorekeeper) => {
      const scorekeeperQuery = {
        size: pageSize,
        from: pageFrom,
        query: {
          bool: {
            must: [{term: {'scorekeeper_data.is_published': true}}],
          },
        },
      };
      if (filerScorekeeper.location !== 'world') {
        scorekeeperQuery.query.bool.must.push({
          multi_match: {
            query: `${filerScorekeeper.location.toLowerCase()}`,
            fields: ['city', 'country', 'state_abbr'],
          },
        });
      }
      if (filerScorekeeper.sport !== 'All') {
        scorekeeperQuery.query.bool.must.push({
          term: {
            'scorekeeper_data.sport.keyword': {
              value: filerScorekeeper.sport,
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
      console.log('ScorekeeperQuery:=>', JSON.stringify(scorekeeperQuery));

      // Scorekeeper query

      getUserIndex(scorekeeperQuery)
        .then((res) => {
          if (res.length > 0) {
            setScorekeepers([...scorekeepers, ...res]);
            setPageFrom(pageFrom + pageSize);
            stopFetchMore = true;
          }
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e);
          }, 10);
        });
    },
    [pageFrom, pageSize, scorekeepers],
  );

  useEffect(() => {
    getScorekeepers(filters);
  }, []);

  const renderRefereesScorekeeperListView = useCallback(
    ({item}) => (
      <View style={[styles.separator, {flex: 1}]}>
        <TCScorekeeperView
          data={item}
          showStar={true}
          sport={selectedSport}
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
    [navigation, selectedSport],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderSeparator = () => (
    <TCThinDivider marginTop={10} marginBottom={10} width={'100%'} />
  );

  // const handleDonePress = (date) => {
  //   if (datePickerFor === 'from') {
  //     setFromDate(new Date(date));
  //   } else {
  //     setToDate(new Date(date));
  //   }
  //   setShow(!show);
  // };
  // const handleCancelPress = () => {
  //   setShow(false);
  // };

  const onScrollHandler = () => {
    setLoadMore(true);
    if (!stopFetchMore) {
      getScorekeepers(filters);
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
          delete tempFilter.refereeFee;
          setSelectedSport({
            sort: 'All',
            sport_type: 'All',
          });
          setMinFee(0);
          setMaxFee(0);
        }
        if (Object.keys(item)[0] === 'location') {
          tempFilter.location = 'world';
        }
        if (Object.keys(item)[0] === 'scorekeeperFee') {
          delete tempFilter[key];
        }

        // delete tempFilter[key];
      }
    });
    console.log('Temp filter', tempFilter);
    setFilters({...tempFilter});
    // applyFilter();
    setTimeout(() => {
      setPageFrom(0);
      setScorekeepers([]);
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
    getScorekeepers(fil);
  }, []);

  const applyValidation = useCallback(() => {
    if (Number(minFee) > 0 && Number(maxFee) <= 0) {
      Alert.alert('Please enter correct scorekeeper max fee.');
      return false;
    }
    if (Number(minFee) <= 0 && Number(maxFee) > 0) {
      Alert.alert('Please enter correct scorekeeper min fee.');
      return false;
    }
    if (Number(minFee) > Number(maxFee)) {
      Alert.alert('Please enter correct scorekeeper fee.');
      return false;
    }
    return true;
  }, [maxFee, minFee]);
  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          fontFamily: fonts.RRegular,
          color: colors.grayColor,
          fontSize: 26,
        }}>
        No Scorekeepers
      </Text>
    </View>
  );

  const onPressReset = () => {
    setFilters({
      location: 'world',
      sport: 'All',
      sport_type: 'All',
    });
    setSelectedSport({
      sort: 'All',
      sport_type: 'All',
    });
    setMinFee(0);
    setMaxFee(0);
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.searchView}>
        <View style={styles.searchViewContainer}>
          <TextInput
            placeholder={strings.searchText}
            style={styles.searchTxt}
            autoCorrect={false}
            onChangeText={(text) => {
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
        extraData={scorekeepers}
        showsHorizontalScrollIndicator={false}
        data={scorekeepers}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={keyExtractor}
        renderItem={renderRefereesScorekeeperListView}
        style={styles.listStyle}
        // contentContainerStyle={{ paddingBottom: 1 }}
        onScroll={onScrollHandler}
        onEndReachedThreshold={0.01}
        onScrollBeginDrag={() => {
          stopFetchMore = false;
        }}
        ListEmptyComponent={listEmptyComponent}
      />
      <Modal
        onBackdropPress={() => setSettingPopup(false)}
        style={{
          margin: 0,
        }}
        isVisible={settingPopup}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}>
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
                    if (applyValidation()) {
                      setSettingPopup(false);
                      setTimeout(() => {
                        const tempFilter = {...filters};
                        tempFilter.sport = selectedSport.sport;
                        tempFilter.sport_type = selectedSport.sport_type;

                        tempFilter.location = location;

                        if (minFee && maxFee) {
                          tempFilter.scorekeeperFee = `${minFee}-${maxFee}`;
                        }
                        setFilters({
                          ...tempFilter,
                        });
                        setPageFrom(0);
                        setScorekeepers([]);
                        applyFilter(tempFilter);
                      }, 100);
                      console.log('DONE::');
                    }
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
                          setLocation('world');
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
                          comeFrom: 'ScorekeeperListScreen',
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
                            setMinFee(0);
                            setMaxFee(0);
                          } else {
                            setSelectedSport(
                              Utility.getSportObjectByName(value, authContext),
                            );
                          }
                        }}
                        value={Utility.getSportName(selectedSport, authContext)}
                      />
                    </View>
                  </View>
                </View>
                {/* <View style={{ flexDirection: 'column', margin: 15 }}>
                  <View>
                    <Text style={styles.filterTitle}>Available Time</Text>
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                      <TouchableOpacity
                        style={styles.fieldView}
                        onPress={() => {
                          setDatePickerFor('from');
                          setShow(!show);
                        }}>
                        <View
                          style={{
                            height: 35,
                            justifyContent: 'center',
                          }}>
                          <Text style={styles.fieldTitle} numberOfLines={1}>
                            From
                          </Text>
                        </View>
                        <View style={{ marginRight: 15, flexDirection: 'row' }}>
                          <Text style={styles.fieldValue} numberOfLines={1}>
                            {moment(fromDate).format('MMM DD, YYYY')} {'   '}
                          </Text>
                          <Text style={styles.fieldValue} numberOfLines={1}>
                            {moment(fromDate).format('h:mm a')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        style={styles.fieldView}
                        onPress={() => {
                          setDatePickerFor('to');
                          setShow(!show);
                        }}>
                        <View
                          style={{
                            height: 35,
                            justifyContent: 'center',
                          }}>
                          <Text style={styles.fieldTitle} numberOfLines={1}>
                            To
                          </Text>
                        </View>
                        <View style={{ marginRight: 15, flexDirection: 'row' }}>
                          <Text style={styles.fieldValue} numberOfLines={1}>
                            {moment(toDate).format('MMM DD, YYYY')} {'   '}
                          </Text>
                          <Text style={styles.fieldValue} numberOfLines={1}>
                            {moment(toDate).format('h:mm a')}
                          </Text>
                        </View>
                      </TouchableOpacity>
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
                </View> */}
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
                    <Text style={styles.filterTitle}>Scorekeeper fee</Text>
                  </View>
                  <View style={{marginTop: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TextInput
                        onChangeText={(text) => setMinFee(text)}
                        value={minFee}
                        style={styles.minFee}
                        placeholder={'Min'}
                        autoCorrect={false}
                        // clearButtonMode={'always'}
                        keyboardType={'numeric'}
                        placeholderTextColor={colors.userPostTimeColor}
                      />
                      <TextInput
                        onChangeText={(text) => setMaxFee(text)}
                        value={maxFee}
                        style={styles.minFee}
                        placeholder={'Max'}
                        autoCorrect={false}
                        // clearButtonMode={'always'}
                        keyboardType={'numeric'}
                        placeholderTextColor={colors.userPostTimeColor}
                      />
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
        {/* <DateTimePickerView
          date={new Date()}
          visible={show}
          onDone={handleDonePress}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          // minutesGap={30}
          mode={'datetime'}
        /> */}
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listStyle: {
    flex: 1,
    padding: 15,
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
  // fieldView: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   flex: 1,
  //   height: 40,
  //   alignItems: 'center',
  //   backgroundColor: colors.offwhite,
  //   borderRadius: 5,
  //   shadowColor: colors.grayColor,
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 1,
  //   elevation: 1,
  // },
  // fieldTitle: {
  //   fontSize: 16,
  //   color: colors.lightBlackColor,
  //   fontFamily: fonts.RLight,
  //   marginLeft: 10,
  // },
  // fieldValue: {
  //   fontSize: 16,
  //   color: colors.lightBlackColor,
  //   fontFamily: fonts.RRegular,
  //   textAlign: 'center',
  // },
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
  minFee: {
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    width: widthPercentageToDP('45%'),
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
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
});
