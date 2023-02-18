/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
import React, {
  useCallback,
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
} from 'react';
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

import Modal from 'react-native-modal';
import moment from 'moment';
import {format} from 'react-string-format';
import * as Utils from '../../../challenge/manageChallenge/settingUtility';
import AuthContext from '../../../../auth/context';

import * as Utility from '../../../../utils';
import colors from '../../../../Constants/Colors';
import images from '../../../../Constants/ImagePath';
import {widthPercentageToDP} from '../../../../utils';
import DateTimePickerView from '../../../../components/Schedule/DateTimePickerModal';
import fonts from '../../../../Constants/Fonts';
import TCThinDivider from '../../../../components/TCThinDivider';

import {strings} from '../../../../../Localization/translation';
import {getUserIndex} from '../../../../api/elasticSearch';
import RenderReferee from './RenderReferee';
import TCTagsFilter from '../../../../components/TCTagsFilter';
import Verbs from '../../../../Constants/Verbs';
import {getGeocoordinatesWithPlaceName} from '../../../../utils/location';
import ActivityLoader from '../../../../components/loader/ActivityLoader';

let stopFetchMore = true;
const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;

export default function BookReferee({navigation, route}) {
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const [filters, setFilters] = useState(route?.params?.filters);

  const [settingPopup, setSettingPopup] = useState(false);
  const [locationFilterOpetion, setLocationFilterOpetion] = useState();

  const [datePickerFor, setDatePickerFor] = useState();
  const [show, setShow] = useState(false);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [minFee, setMinFee] = useState(0);
  const [maxFee, setMaxFee] = useState(0);
  const [referees, setReferees] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  const [gameData] = useState(route?.params?.gameData);
  // eslint-disable-next-line no-unused-vars
  const [loadMore, setLoadMore] = useState(false);
  const [searchData, setSearchData] = useState();

  const [location, setLocation] = useState(route?.params?.filters.location);
  const [selectedReferee, setSelectedReferee] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => onPressNext()}>
          {selectedReferee !== null ? strings.next : ''}
        </Text>
      ),
    });
  }, [navigation, selectedReferee]);

  useEffect(() => {
    if (route.params?.filters.location !== 'world') {
      setLocationFilterOpetion(3);
    } else {
      setLocationFilterOpetion(0);
    }
    if (route?.params?.locationText) {
      setSettingPopup(true);
      setTimeout(() => {
        setLocation(route?.params?.locationText);
      }, 10);
    }
  }, [route.params?.locationText]);

  const getReferees = useCallback(
    (filerReferee) => {
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
                    bool: {
                      must: [
                        {term: {'referee_data.is_published': true}},
                        {
                          term: {
                            'referee_data.setting.referee_availibility.keyword':
                              {
                                value: Verbs.on,
                              },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      };

      if (filerReferee.location !== 'world') {
        refereeQuery.query.bool.must[0].nested.query.bool.must.push({
          multi_match: {
            query: `${filerReferee.location.toLowerCase()}`,
            fields: ['city', 'country', 'state'],
          },
        });
      }
      if (route?.params?.sport) {
        refereeQuery.query.bool.must[0].nested.query.bool.must.push({
          term: {
            'referee_data.sport.keyword': {
              value: route?.params?.sport,
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

      // Referee query

      getUserIndex(refereeQuery)
        .then((res) => {
          if (res.length > 0) {
            const fetchedData = [...referees, ...res];
            setReferees(fetchedData);
            setSearchData(fetchedData);
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
    [pageFrom, pageSize, referees],
  );

  useEffect(() => {
    getReferees(filters);
  }, []);

  const onPressNext = () => {
    setLoading(true);
    Utils.getSetting(
      authContext?.entity?.uid,
      authContext?.entity?.role,
      gameData.sport,
      authContext,
      gameData.sport_type,
    )
      .then((response) => {
        setLoading(false);
        if (
          response?.responsible_for_referee?.who_secure?.length >
          (gameData?.referees?.length ?? 0)
        ) {
          setLoading(true);
          Utils.getSetting(
            selectedReferee?.user_id,
            'referee',
            gameData.sport,
            authContext,
          )
            .then((res) => {
              setLoading(false);
              if (
                res?.referee_availibility &&
                res?.game_fee &&
                res?.refund_policy &&
                res?.available_area
              ) {
                navigation.navigate('RefereeBookingDateAndTime', {
                  settingObj: res,
                  userData: selectedReferee,
                  isHirer: false,
                  gameData,
                  sportName: gameData?.sport,
                });
              } else {
                setTimeout(() => {
                  Alert.alert(strings.refereeSettingNotConfigureValidation);
                }, 10);
              }
            })
            .catch(() => {
              setLoading(false);
              setTimeout(() => {
                Alert.alert(strings.alertmessagetitle, strings.defaultError);
              }, 10);
              // navigation.goBack();
            });
        } else {
          Alert.alert(
            strings.appName,
            format(
              strings.canNotBookMoreThanreferee,
              response?.responsible_for_referee?.who_secure?.length,
            ),
          );
        }
      })
      .catch(() => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, strings.defaultError);
        }, 10);
        // navigation.goBack();
      });
  };

  const renderRefereeData = ({item}) => {
    const referee = item;
    return (
      <RenderReferee
        data={item}
        showStar={true}
        sport={route?.params?.sport}
        isSelected={referee?.user_id === selectedReferee?.user_id}
        onRadioClick={() => {
          if (
            gameData?.referees?.length > 0 &&
            gameData.referees.some(
              (refe) => refe.referee_id === referee.user_id,
            )
          ) {
            Alert.alert(strings.townsCupTitle, strings.canNotChoosegameReferee);
          } else if (
            gameData?.scorekeepers?.length > 0 &&
            gameData.scorekeepers.some(
              (scorer) => scorer.scorekeeper_id === referee.user_id,
            )
          ) {
            Alert.alert(
              strings.townsCupTitle,
              strings.canNotChoosegameScorekeeper,
            );
          } else {
            setSelectedReferee(referee);
          }
        }}
      />
    );
  };

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const handleDonePress = (date) => {
    if (datePickerFor === 'from') {
      setFromDate(new Date(date));
    } else {
      setToDate(new Date(date));
    }
    setShow(!show);
  };
  const handleCancelPress = () => {
    setShow(false);
  };

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
        if (Object.keys(item)[0] === 'location') {
          tempFilter.location = 'world';
        }
        if (Object.keys(item)[0] === 'refereeFee') {
          delete tempFilter.refereeFee;
        }

        // delete tempFilter[key];
      }
    });
    setFilters({...tempFilter});
    // applyFilter();
    setTimeout(() => {
      setPageFrom(0);
      setReferees([]);
      applyFilter(tempFilter);
    }, 10);
  };

  const getLocation = () => {
    setLoading(true);
    getGeocoordinatesWithPlaceName(Platform.OS)
      .then((currentLocation) => {
        setLoading(false);
        if(currentLocation.position){
          setLocation(currentLocation.city?.charAt(0).toUpperCase() + currentLocation.city?.slice(1));
          setLocationFilterOpetion(2);
        }
      })
      .catch((e) => {
        setLoading(false);
        if(e.message !== strings.userdeniedgps){
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        }
      });
  };

  const applyFilter = useCallback((fil) => {
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
  const searchFilterFunction = (text) => {
    const result = referees.filter(
      (x) =>
        x.full_name.toLowerCase().includes(text.toLowerCase()) ||
        x.city.toLowerCase().includes(text.toLowerCase()),
    );
    if (text.length > 0) {
      setReferees(result);
    } else {
      setReferees(searchData);
    }
  };

  const onPressReset = () => {
    setFilters({
      location: 'world',
      sport: 'All',
      sport_type: 'All',
    });

    setMinFee(0);
    setMaxFee(0);
  };

  return (
    <View>
      <ActivityLoader visible={loading} />
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
        extraData={referees}
        showsHorizontalScrollIndicator={false}
        data={referees}
        keyExtractor={keyExtractor}
        renderItem={renderRefereeData}
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
        // onBackdropPress={() => setSettingPopup(false)}
        // backdropOpacity={1}
        // animationType="slide"
        // hasBackdrop
        // style={{
        //   flex: 1,
        //   margin: 0,
        //   backgroundColor: colors.blackOpacityColor,
        // }}
        // visible={settingPopup}
        onBackdropPress={() => setSettingPopup(false)}
        isVisible={settingPopup}
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
                  {strings.cancel}
                </Text>
                <Text style={styles.locationText}>{strings.filter}</Text>
                <Text
                  style={styles.doneText}
                  onPress={() => {
                    if (applyValidation()) {
                      setSettingPopup(false);
                      setTimeout(() => {
                        const tempFilter = {...filters};
                        // tempFilter.sport = selectedSport;
                        tempFilter.location = location;

                        if (minFee && maxFee) {
                          tempFilter.refereeFee = `${minFee}-${maxFee}`;
                        }
                        setFilters({
                          ...tempFilter,
                        });
                        setPageFrom(0);
                        setReferees([]);
                        applyFilter(tempFilter);
                      }, 100);
                    }
                  }}>
                  {strings.apply}
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
                      <Text style={styles.filterTitle}>{strings.world}</Text>
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
                      <Text style={styles.filterTitle}>
                        {strings.homeCityTitleText}
                      </Text>
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
                      <Text style={styles.filterTitle}>
                        {strings.locationTitle}
                      </Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
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
                          comeFrom: 'BookReferee',
                        });
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={styles.searchCityContainer}>
                          <Text style={styles.searchCityText}>
                            {route?.params?.locationText ||
                              (location !== 'world' && location) ||
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

                <View style={{flexDirection: 'column', margin: 15}}>
                  <View>
                    <Text style={styles.filterTitle}>Available Time</Text>
                  </View>
                  <View style={{marginTop: 10}}>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
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
                            {strings.from}
                          </Text>
                        </View>
                        <View style={{marginRight: 15, flexDirection: 'row'}}>
                          <Text style={styles.fieldValue} numberOfLines={1}>
                            {moment(fromDate).format('MMM DD, YYYY')} {'   '}
                          </Text>
                          <Text style={styles.fieldValue} numberOfLines={1}>
                            {moment(fromDate).format('h:mm a')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
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
                            {strings.to}
                          </Text>
                        </View>
                        <View style={{marginRight: 15, flexDirection: 'row'}}>
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
                      {strings.timezone}{' '}
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: fonts.RRegular,
                          color: colors.lightBlackColor,
                          textDecorationLine: 'underline',
                        }}>
                        {strings.vancouver}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  margin: 15,
                  justifyContent: 'space-between',
                }}>
                <View style={{}}>
                  <Text style={styles.filterTitle}>
                    {strings.refereeFeecardText}
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
        <DateTimePickerView
          date={new Date()}
          visible={show}
          onDone={handleDonePress}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
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
  },
  fieldValue: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    textAlign: 'center',
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
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 15,
  },
});
