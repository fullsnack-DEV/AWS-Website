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
import TCTagsFilter from '../../components/TCTagsFilter';
import TCPicker from '../../components/TCPicker';
import TCLookingForEntityView from '../../components/TCLookingForEntityView';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import ActivityLoader from '../../components/loader/ActivityLoader';

let stopFetchMore = true;
const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;

export default function LookingTeamScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [filters, setFilters] = useState(route?.params?.filters);

  const [settingPopup, setSettingPopup] = useState(false);
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(0);

  const [sports, setSports] = useState([]);

  const [lookingEntity, setLookingEntity] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [loadMore, setLoadMore] = useState(false);
  const [selectedSport, setSelectedSport] = useState({
    sport: route?.params?.filters?.sport,
    sport_type: route?.params?.filters?.sport_type,
  });
  const [location, setLocation] = useState(route?.params?.filters.location);

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
        label: strings.allType,
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

  const getLookingEntity = useCallback(
    (filerLookingEntity) => {
      // Looking team query
      const lookingQuery = {
        size: pageSize,
        from: pageFrom,
        query: {
          bool: {
            must: [
              {
                nested: {
                  path: 'registered_sports',
                  query: {
                    bool: {
                      must: [
                        {
                          match: {
                            'registered_sports.lookingForTeamClub': true,
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

      if (filerLookingEntity.location !== strings.worldTitleText) {
        lookingQuery.query.bool.must.push({
          multi_match: {
            query: `${filerLookingEntity.location}`,
            fields: ['city', 'country', 'state_abbr'],
          },
        });
      }
      if (filerLookingEntity.sport !== strings.allType) {
        lookingQuery.query.bool.must[0].nested.query.bool.must.push({
          term: {
            'registered_sports.sport_name.keyword': {
              value: filerLookingEntity.sport.toLowerCase(),
              case_insensitive: true,
            },
          },
        });
      }
      if (filerLookingEntity?.searchText?.length > 0) {
        lookingQuery.query.bool.must.push({
          query_string: {
            query: `*${filerLookingEntity?.searchText}*`,
            fields: ['full_name'],
          },
        });
      }
      console.log('Looking for team/club query:', JSON.stringify(lookingQuery));

      // Looking team query

      getUserIndex(lookingQuery)
        .then((res) => {
          if (res.length > 0) {
            setLookingEntity([...lookingEntity, ...res]);
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
    [pageFrom, pageSize, lookingEntity],
  );

  useEffect(() => {
    getLookingEntity(filters);
  }, []);

  const renderLookingEntityListView = useCallback(
    ({item}) => (
      <View style={[styles.separator, {flex: 1}]}>
        <TCLookingForEntityView
          data={item}
          showStar={false}
          sport={selectedSport?.sport}
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

  const onScrollHandler = () => {
    setLoadMore(true);
    if (!stopFetchMore) {
      getLookingEntity(filters);
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
          delete tempFilter.lookingEntityFee;
          setSelectedSport({
            sort: strings.allType,
            sport_type: strings.allType,
          });
        }
        if (Object.keys(item)[0] === 'location') {
          tempFilter.location = strings.worldTitleText;
        }

        // delete tempFilter[key];
      }
    });
    console.log('Temp filter', tempFilter);
    setFilters({...tempFilter});
    // applyFilter();
    setTimeout(() => {
      setPageFrom(0);
      setLookingEntity([]);
      applyFilter(tempFilter);
    }, 10);
  };

  const getLocation = () => {
    setloading(true);
    getGeocoordinatesWithPlaceName(Platform.OS)
      .then((currentLocation) => {
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
    getLookingEntity(fil);
  }, []);

  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          fontFamily: fonts.RRegular,
          color: colors.grayColor,
          fontSize: 26,
        }}>
        {strings.noGroups}
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
      sort: strings.allType,
      sport_type: strings.allType,
    });
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
              setLookingEntity([]);
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
        extraData={lookingEntity}
        showsHorizontalScrollIndicator={false}
        data={lookingEntity}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={keyExtractor}
        renderItem={renderLookingEntityListView}
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
                  {strings.cancel}
                </Text>
                <Text style={styles.locationText}>{strings.filter}</Text>
                <Text
                  style={styles.doneText}
                  onPress={() => {
                    setSettingPopup(false);
                    setTimeout(() => {
                      const tempFilter = {...filters};
                      tempFilter.sport = selectedSport;
                      tempFilter.location = location;

                      setFilters({
                        ...tempFilter,
                      });
                      setPageFrom(0);
                      setLookingEntity([]);
                      applyFilter(tempFilter);
                    }, 100);
                    console.log('DONE::');
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
                          setLocation(strings.worldTitleText);
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
                        {strings.currrentCityTitle}
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
                          comeFrom: 'LookingTeamScreen',
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
                    <View style={{}}>
                      <Text style={styles.filterTitle}>
                        {strings.sportsEventsTitle}
                      </Text>
                    </View>
                    <View style={{marginTop: 10}}>
                      <TCPicker
                        dataSource={sports}
                        placeholder={strings.selectSportTitleText}
                        onDonePress={() => {
                          console.log('done oresssss');
                          setFilters({
                            ...filters,
                            sport: selectedSport?.sport,
                            sport_type: selectedSport?.sport_type,
                          });
                        }}
                        onValueChange={(value) => {
                          console.log('dsffsdafsadf', value);
                          //   setSelectedSport(value);

                          //   setFilters({
                          //     ...filters,
                          //     sport: value,
                          //   });
                          if (value === strings.allType) {
                            setSelectedSport({
                              sport: strings.allType,
                              sport_type: strings.allType,
                            });
                          } else {
                            setSelectedSport(
                              Utility.getSportObjectByName(value, authContext),
                            );
                          }
                        }}
                        value={selectedSport}
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
