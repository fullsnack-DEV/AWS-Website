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

import Modal from 'react-native-modal';
import AuthContext from '../../auth/context';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import {widthPercentageToDP} from '../../utils';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../../components/TCThinDivider';

import {strings} from '../../../Localization/translation';
import {getUserIndex} from '../../api/elasticSearch';
import TCRefereeView from '../../components/TCRefereeView';
import TCTagsFilter from '../../components/TCTagsFilter';
import TCPicker from '../../components/TCPicker';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import ActivityLoader from '../../components/loader/ActivityLoader';
import LocationContext from '../../context/LocationContext';

let stopFetchMore = true;
const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;

export default function RefereesListScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const locationContext = useContext(LocationContext);
  const [filters, setFilters] = useState(route?.params?.filters);
  const [settingPopup, setSettingPopup] = useState(false);
  /* eslint-disable */ 
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(locationContext?.selectedLocation.toUpperCase() ===
  /* eslint-disable */ 
authContext.entity.obj?.city?.toUpperCase() ? 1 : locationContext?.selectedLocation === strings.worldTitleText ? 0 : 2);
  const [sports, setSports] = useState([]);
  const [minFee, setMinFee] = useState(0);
  const [maxFee, setMaxFee] = useState(0);
  const [referees, setReferees] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [loadMore, setLoadMore] = useState(false);
  const [selectedSport, setSelectedSport] = useState({
    sport: route.params?.filters?.sport,
    sport_type: route.params?.filters?.sport_type,
  });
  const [location, setLocation] = useState(route.params?.filters?.location);
  const [lastSelection, setLastSelection] = useState(0);
  useEffect(() => {
    if(settingPopup){
      setLastSelection(locationFilterOpetion)
    }
  },[settingPopup])

  useEffect(() => {
    if (route.params?.locationText) {
      setSettingPopup(true);
      setTimeout(() => {
        setLocation(route.params?.locationText);
      }, 10);
    }
  }, [route.params?.locationText]);

  useEffect(() => {
    const list = [
      {
        label: strings.all,
        value: strings.allType,
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

  const getReferees = useCallback(
    (filerReferee) => {
      // Referee query
      const refereeQuery = {
        size: pageSize,
        from: pageFrom,
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

      if (filerReferee.location !== strings.worldTitleText) {
        refereeQuery.query.bool.must.push({
          multi_match: {
            query: `${filerReferee.location.toLowerCase()}`,
            fields: ['city', 'country', 'state'],
          },
        });
      }

      if (filerReferee.sport !== strings.allType) {
        refereeQuery.query.bool.must[0].nested.query.bool.must.push({
          term: {
            'referee_data.sport.keyword': {
              value: filerReferee?.sport,
            },
          },
        });
      }

      if (filerReferee.refereeFee) {
        refereeQuery.query.bool.must[0].nested.query.bool.must.push({
          range: {
            'referee_data.setting.game_fee.fee': {
              gte: Number(filerReferee.refereeFee.split('-')[0]),
              lte: Number(filerReferee.refereeFee.split('-')[1]),
            },
          },
        });
      }
      if (filerReferee?.searchText?.length > 0) {
        refereeQuery.query.bool.must[0].nested.query.bool.must.push({
          query_string: {
            query: `*${filerReferee?.searchText}*`,
            fields: ['full_name'],
          },
        });
      }

      console.log('refereeQuery:=>', JSON.stringify(refereeQuery));

      // Referee query

      getUserIndex(refereeQuery)
        .then((res) => {
          if (res.length > 0) {
            setReferees([...referees, ...res]);
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
    [filters?.searchText, pageFrom, pageSize, referees],
  );

  useEffect(() => {
    getReferees(filters);
  }, []);

  const renderRefereesScorekeeperListView = useCallback(
    ({item}) => (
      <View style={[styles.separator, {flex: 1}]}>
        <TCRefereeView
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
      getReferees(filters);
      stopFetchMore = true;
    }
    setLoadMore(false);
  };
  const handleTagPress = ({item}) => {
    const tempFilter = filters;
    Object.keys(tempFilter).forEach((key) => {
      if (key === Object.keys(item)[0]) {
        if (Object.keys(item)[0] === 'sport') {
          tempFilter.sport = strings.allType;
          delete tempFilter.refereeFee;
          setSelectedSport({
            sport: strings.allType,
            sport_type: strings.allType,
          });
          setMinFee(0);
          setMaxFee(0);
        }
        if (Object.keys(item)[0] === 'location') {
          tempFilter.location = strings.worldTitleText;
        }
        if (Object.keys(item)[0] === 'refereeFee') {
          delete tempFilter.refereeFee;
        }

        // delete tempFilter[key];
      }
    });
    console.log('Temp filter', tempFilter);
    setFilters({...tempFilter});
    // applyFilter();
    setTimeout(() => {
      setPageFrom(0);
      setReferees([]);
      applyFilter(tempFilter);
    }, 10);
  };

  const getLocation = () => {

    console.log('we are here')

    setloading(true);
    console.log('start location task')
    getGeocoordinatesWithPlaceName(Platform.OS)
      .then((currentLocation) => {
        console.log('result location task', currentLocation)
        setloading(false);
        if(currentLocation.position){
          setLocation(currentLocation.city?.charAt(0).toUpperCase() + currentLocation.city?.slice(1));
          setLocationFilterOpetion(2);
        }
      })
      .catch((e) => {
        setloading(false);
        if(e.message !== strings.userdeniedgps){
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        }
      });
  };

  const applyFilter = useCallback((fil) => {
    console.log('apply filter', fil);
    getReferees(fil);
  }, []);

  const applyValidation = useCallback(() => {
    if (Number(minFee) > 0 && Number(maxFee) <= 0) {
      Alert.alert(strings.refereeFeeMax);
      return false;
    }
    if (Number(minFee) <= 0 && Number(maxFee) > 0) {
      Alert.alert(strings.refereeFeeMin);
      return false;
    }
    if (Number(minFee) > Number(maxFee)) {
      Alert.alert(strings.refereeFeeCorrect);
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
        {strings.noReferees}
      </Text>
    </View>
  );

  const onPressReset = () => {
    setFilters({
      location: strings.worldTitleText,
      sport: strings.allType,
      sport_type: strings.allType,
    });
    setSelectedSport({
      sport: strings.allType,
      sport_type: strings.allType,
    });
    setLocationFilterOpetion(locationContext?.selectedLocation.toUpperCase() ===
    /* eslint-disable */ 
    authContext.entity.obj?.city?.toUpperCase() ? 1 : locationContext?.selectedLocation === strings.worldTitleText ? 0 : 2
      );
    setMinFee(0);
    setMaxFee(0);
  };

  useEffect(() =>{
    const tempFilter = {...filters};
    tempFilter.sport = selectedSport?.sport;
    tempFilter.location = location;
    setFilters({
      ...tempFilter,
    });
    setPageFrom(0);
    setReferees([]);
    applyFilter(tempFilter);

  },[location])

  return (
    <SafeAreaView style={{flex: 1}}>
      <ActivityLoader visible={loading} />
      <View style={styles.searchView}>
        <View style={styles.searchViewContainer}>
          <TextInput
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
              setReferees([]);
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
        extraData={location}
        showsVerticalScrollIndicator={false}
        data={referees}
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
        onBackdropPress={() => {{setLocationFilterOpetion(lastSelection) ; setSettingPopup(false)}}}
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
                  onPress={() => {{setLocationFilterOpetion(lastSelection) ; setSettingPopup(false)}}}
                  style={styles.cancelText}>
                  {strings.cancel}
                </Text>
                <Text style={styles.locationText}>{strings.filter}</Text>
                <Text
                  style={styles.doneText}
                  onPress={() => {
                    if (applyValidation()) {
                      setSettingPopup(false);
                        const tempFilter = {...filters};
                        tempFilter.sport = selectedSport.sport;
                        tempFilter.sport_type = selectedSport.sport_type;

                        if(locationFilterOpetion === 0){
                          setLocation(strings.worldTitleText);
                          tempFilter.location = location;
     
                         } else if (locationFilterOpetion === 1) {
                           setLocation(
                             authContext?.entity?.obj?.city
                               .charAt(0)
                               .toUpperCase() +
                               authContext?.entity?.obj?.city.slice(1),
                           );
                           tempFilter.location = location;
     
                         } else if (locationFilterOpetion === 2) {
                             getLocation();
                           tempFilter.location = location;
                         }
                        if (minFee && maxFee) {
                          tempFilter.refereeFee = `${minFee}-${maxFee}`;
                        }
                        setFilters({
                          ...tempFilter,
                        });
                        setPageFrom(0);
                        setReferees([]);
                        applyFilter(tempFilter);
                    }
                  }}>
                  {strings.apply}
                </Text>
              </View>
              <TCThinDivider width={'100%'} marginBottom={15} />
              <View>
                <View style={{flexDirection: 'column', margin: 15}}>
                  <View>
                    <Text style={styles.filterTitle}>
                      {strings.locationTitleText}
                    </Text>
                  </View>
                  <View style={{marginTop: 10, marginLeft: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.filterTitle}>{strings.world}</Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(0);
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
                      <Text style={styles.filterTitle}>
                        {strings.currentCity}
                      </Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(1);
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
                      <Text style={styles.filterTitle}>
                        {strings.currrentCityTitle}
                      </Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(2)
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
                          comeFrom: 'RefereesListScreen',
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
                            {route?.params?.locationText ||
                              strings.searchCityText}
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
                    <View>
                      <Text style={styles.filterTitle}>{strings.sport}</Text>
                    </View>
                    <View style={{marginTop: 10}}>
                      <TCPicker
                        dataSource={sports}
                        placeholder={strings.selectSportTitleText}
                        // placeholderValue={strings.allType}
                        onValueChange={(value) => {
                          console.log('Sport value:=>', value);
                          if (value === strings.allType) {
                            setSelectedSport({
                              sport: strings.allType,
                              sport_type: strings.allType,
                            });
                            setMinFee(0);
                            setMaxFee(0);
                          } else {
                            setSelectedSport(
                              Utility.getSportObjectByName(value, authContext),
                            );
                          }
                        }}
                        value={
                          selectedSport?.sport !== strings.allType
                            ? Utility.getSportName(selectedSport, authContext)
                            : strings.all
                        }
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

              {selectedSport?.sport !== strings.allType && (
                <View
                  style={{
                    flexDirection: 'column',
                    margin: 15,
                    justifyContent: 'space-between',
                  }}>
                  <View style={{}}>
                    <Text style={styles.filterTitle}>{strings.refereeFee}</Text>
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
                        placeholder={strings.minPlaceholder}
                        autoCorrect={false}
                        // clearButtonMode={'always'}
                        keyboardType={'numeric'}
                        placeholderTextColor={colors.userPostTimeColor}
                      />
                      <TextInput
                        onChangeText={(text) => setMaxFee(text)}
                        value={maxFee}
                        style={styles.minFee}
                        placeholder={strings.maxPlaceholder}
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
                strings.areYouSureRemoveFilterText,
                '',
                [
                  {
                    text: strings.cancel,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: strings.okTitleText,
                    onPress: () => onPressReset(),
                  },
                ],
                {cancelable: false},
              );
            }}>
            <Text style={styles.resetTitle}>{strings.resetTitleText}</Text>
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
