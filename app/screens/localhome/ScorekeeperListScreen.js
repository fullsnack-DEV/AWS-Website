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
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
import TCScorekeeperView from '../../components/TCScorekeeperView';
import TCTagsFilter from '../../components/TCTagsFilter';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import ActivityLoader from '../../components/loader/ActivityLoader';
import LocationContext from '../../context/LocationContext';
import {locationType} from '../../utils/constant';
import LocationModal from '../../components/LocationModal/LocationModal';

let stopFetchMore = true;
const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;

export default function ScorekeeperListScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [filters, setFilters] = useState(route?.params?.filters);
  const locationContext = useContext(LocationContext);
  const [settingPopup, setSettingPopup] = useState(false);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  /* eslint-disable */
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(
    locationContext?.selectedLocation.toUpperCase() ===
      /* eslint-disable */
      authContext.entity.obj?.city?.toUpperCase()
      ? 1
      : locationContext?.selectedLocation === strings.worldTitleText
      ? 0
      : 2,
  );

  const [sports, setSports] = useState([]);

  const [minFee, setMinFee] = useState(0);
  const [maxFee, setMaxFee] = useState(0);
  const [scorekeepers, setScorekeepers] = useState([]);
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
    if (settingPopup) {
      setLastSelection(locationFilterOpetion);
    }
  }, [settingPopup]);

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
      if (filerScorekeeper?.sport !== strings.allType) {
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
            setScorekeepers([...scorekeepers, ...res]);
            setPageFrom(pageFrom + pageSize);
            stopFetchMore = true;
          }
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);;
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
        if (Object.keys(item)[0] === 'scorekeeperFee') {
          delete tempFilter[key];
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

  const getLocation = () => {
    setloading(true);
    getGeocoordinatesWithPlaceName(Platform.OS)
      .then((currentLocation) => {
        setloading(false);
        if (currentLocation.position) {
          setLocation(
            currentLocation.city?.charAt(0).toUpperCase() +
              currentLocation.city?.slice(1),
          );
          setLocationFilterOpetion(2);
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

  const applyValidation = useCallback(() => {
    if (Number(minFee) > 0 && Number(maxFee) <= 0) {
      Alert.alert(strings.scorekeeperMaxFeeValidation);
      return false;
    }
    if (Number(minFee) <= 0 && Number(maxFee) > 0) {
      Alert.alert(strings.scorekeeperMinFeeValidation);
      return false;
    }
    if (Number(minFee) > Number(maxFee)) {
      Alert.alert(strings.correctScorekeeperFeeValidation);
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
        {strings.noScorekeeper}
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
    setMinFee(0);
    setMaxFee(0);
    setLocationFilterOpetion(
      locationContext?.selectedLocation.toUpperCase() ===
        /* eslint-disable */
        authContext.entity.obj?.city?.toUpperCase()
        ? 1
        : locationContext?.selectedLocation === strings.worldTitleText
        ? 0
        : 2,
    );
  };

  useEffect(() => {
    const tempFilter = {...filters};
    tempFilter.sport = selectedSport?.sport;
    tempFilter.location = location;
    setFilters({
      ...tempFilter,
    });
    setPageFrom(0);
    setScorekeepers([]);
    applyFilter(tempFilter);
  }, [location]);

  const renderSports = ({item}) => (
    <Pressable
      style={styles.listItem}
      onPress={() => {
        if (item.value === strings.allType) {
          setSelectedSport({
            sport: strings.allType,
            sport_type: strings.allType,
          });
        } else {
          setSelectedSport(
            Utility.getSportObjectByName(item.value, authContext),
          );
        }
        setVisibleSportsModal(false);
      }}>
      <View
        style={{
          width: '100%',
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.value}</Text>
        <View style={styles.checkbox}>
          {selectedSport?.sport.toLowerCase() === item.value.toLowerCase() ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </Pressable>
  );

  const ModalHeader = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={styles.handleStyle} />
    </View>
  );

  const handleSetLocationOptions = (location) => {
    if (location.hasOwnProperty('address')) {
      setLocation(location?.formattedAddress);
    } else {
      setLocation(location?.city);
    }
  };
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
        extraData={location}
        showsVerticalScrollIndicator={false}
        data={scorekeepers}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={keyExtractor}
        renderItem={renderRefereesScorekeeperListView}
        style={styles.listStyle}
        onScroll={onScrollHandler}
        onEndReachedThreshold={0.01}
        onScrollBeginDrag={() => {
          stopFetchMore = false;
        }}
        ListEmptyComponent={listEmptyComponent}
      />
      <Modal
        onBackdropPress={() => {
          {
            setLocationFilterOpetion(lastSelection);
            setSettingPopup(false);
          }
        }}
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
            {height: Dimensions.get('window').height - 50},
          ]}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <ScrollView style={{flex: 1}}>
              <View style={styles.viewsContainer}>
                <Text
                  onPress={() => {
                    setLocationFilterOpetion(lastSelection);
                    setSettingPopup(false);
                  }}
                  style={styles.cancelText}>
                  {strings.cancel}
                </Text>
                <Text style={styles.locationText}>{strings.filter}</Text>
                <Text
                  style={styles.doneText}
                  onPress={() => {
                    if (applyValidation()) {
                      const tempFilter = {...filters};
                      tempFilter.sport = selectedSport?.sport;
                      tempFilter.sport_type = selectedSport?.sport_type;

                      if (locationFilterOpetion === 0) {
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
                        tempFilter.scorekeeperFee = `${minFee}-${maxFee}`;
                      }
                      setFilters({
                        ...tempFilter,
                      });
                      setPageFrom(0);
                      setScorekeepers([]);
                      applyFilter(tempFilter);
                      setSettingPopup(false);
                    }
                  }}>
                  {strings.apply}
                </Text>
              </View>
              <TCThinDivider width={'100%'} marginBottom={15} />
              <View>
                <View style={{flexDirection: 'column', margin: 15}}>
                  <View>
                    <Text style={styles.filterTitleBold}>
                      {strings.locationTitleText}
                    </Text>
                  </View>
                  <View style={{marginTop: 10}}>
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
                          setLocationFilterOpetion(
                            locationType.CURRENT_LOCATION,
                          );
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
                          setLocationFilterOpetion(locationType.HOME_CITY);
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
                      <Text style={styles.filterTitle}>{strings.world}</Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(locationType.WORLD);
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

                    <TouchableWithoutFeedback
                      onPress={() => {
                        setLocationFilterOpetion(locationType.SEARCH_CITY);

                        setVisibleLocationModal(true);
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={styles.searchCityContainer}>
                          <Text style={styles.searchCityText}>
                            {route?.params?.locationText ||
                              location ||
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
                      <Text style={styles.filterTitleBold}>
                        {strings.sport}
                      </Text>
                    </View>
                    <View style={{marginTop: 10}}>
                      <View
                        style={[
                          {
                            marginBottom: 10,
                            justifyContent: 'flex-start',
                          },
                          styles.sportsContainer,
                        ]}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            setVisibleSportsModal(true);
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                            }}>
                            <View>
                              <Text style={styles.searchCityText}>
                                {selectedSport?.sport_name ?? strings.allType}
                              </Text>
                            </View>
                            <View
                              style={{
                                position: 'absolute',
                                right: 0,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Icon
                                size={24}
                                color="black"
                                name="chevron-down"
                              />
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              {selectedSport?.sport !== strings.allType && (
                <View
                  style={{
                    flexDirection: 'column',
                    margin: 15,
                    justifyContent: 'space-between',
                  }}>
                  <View style={{}}>
                    <Text style={styles.filterTitle}>
                      {strings.scorekeeperFee}
                    </Text>
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

          <LocationModal
            visibleLocationModal={visibleLocationModal}
            title={strings.cityStateOrCountryTitle}
            setVisibleLocationModalhandler={() =>
              setVisibleLocationModal(false)
            }
            onLocationSelect={handleSetLocationOptions}
            placeholder={strings.searchTitle}
            type={'country'}
          />

          <Modal
            isVisible={visibleSportsModal}
            onBackdropPress={() => setVisibleSportsModal(false)}
            onRequestClose={() => setVisibleSportsModal(false)}
            animationInTiming={300}
            animationOutTiming={800}
            backdropTransitionInTiming={300}
            backdropTransitionOutTiming={800}
            style={{
              margin: 0,
            }}>
            <View
              behavior="position"
              style={{
                width: '100%',
                height: Dimensions.get('window').height - 75,
                maxHeight: Dimensions.get('window').height - 75,
                backgroundColor: 'white',
                position: 'absolute',
                bottom: 0,
                left: 0,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.5,
                shadowRadius: 5,
                elevation: 15,
              }}>
              {ModalHeader()}
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 15,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}></View>
              <View style={styles.separatorLine} />
              <FlatList
                ItemSeparatorComponent={() => <TCThinDivider />}
                data={sports}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderSports}
              />
            </View>
          </Modal>
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
  filterTitleBold: {
    fontSize: 16,
    fontFamily: fonts.RBold,
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
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    width: widthPercentageToDP('75%'),
    justifyContent: 'center',
  },
  sportsContainer: {
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    width: widthPercentageToDP('93%'),
    justifyContent: 'center',
  },
  minFee: {
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    width: widthPercentageToDP('45%'),
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
  listItem: {
    // flexDirection: 'row',
    // marginLeft: widthPercentageToDP('10%'),
    // width: widthPercentageToDP('80%'),
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: widthPercentageToDP('4%'),
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  closeButton: {
    alignSelf: 'center',
    width: 15,
    height: 15,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  handleStyle: {
    marginVertical: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 5,
    width: 40,
    borderRadius: 15,
    backgroundColor: '#DADBDA',
  },
});
