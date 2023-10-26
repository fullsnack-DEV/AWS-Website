import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
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
  Pressable,
  SectionList,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import TCThinDivider from '../TCThinDivider';
import {strings} from '../../../Localization/translation';

import {
  locationType,
  sortOptionType,
  filterType,
  groupsType,
} from '../../utils/constant';
import LocationModal from '../LocationModal/LocationModal';
import BottomSheet from '../modals/BottomSheet';
import DateTimePickerView from '../Schedule/DateTimePickerModal';
import CustomModalWrapper from '../CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import FilterTimeSelectItem from './FilterTimeSelectItem';
import fonts from '../../Constants/Fonts';
import {widthPercentageToDP, getJSDate} from '../../utils';

const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;
const SearchModal = ({
  favoriteSportsList,
  fType,
  sports,
  isVisible,
  filterObject,
  feeTitle,
  showSportOption,
  onPressCancel = () => {},
  onPressApply = () => {},
}) => {
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [filters, setFilters] = useState(filterObject);
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [showTimeActionSheet, setShowTimeActionSheet] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [tag, setTag] = useState();
  // const [groups, setGroups] = useState(groupsType);
  const [groups, setGroups] = useState(groupsType);
  const [showTimeComponent, setShowTimeComponent] = useState(false);
  const [showFeeComponent, setShowFeeComponent] = useState(false);
  const [showSportComponent, setShowSportComponent] = useState(false);

  useEffect(() => {
    if (fType === filterType.RECENTMATCHS) {
      setFilterOptions([
        strings.filterAntTime,
        strings.filterToday,
        strings.filterYesterday,
        strings.filterLast7Day,
        strings.filterThisMonth,
        strings.filterLastMonth,
        strings.filterPickaDate,
      ]);
    } else {
      setFilterOptions([
        strings.filterAntTime,
        strings.filterToday,
        strings.filterTomorrow,
        strings.filterNext7Day,
        strings.filterThisMonth,
        strings.filterNextMonth,
        strings.filterPickaDate,
      ]);
    }
  }, [fType]);
  useEffect(() => {
    if (isVisible) {
      if (fType === filterType.RECRUIITINGMEMBERS) {
        setFilters({
          ...filterObject,
          isSearchPlaceholder: filterObject.locationOption !== 3,
        });
      } else if (fType === filterType.LOOKINGFORTEAMCLUB) {
        setFilters({
          ...filterObject,
          isSearchPlaceholder: filterObject.locationOption !== 3,
        });
      } else {
        setFilters({
          ...filterObject,
          isSearchPlaceholder: filterObject.locationOption !== 3,
          sortOption: filterObject.sortOption ?? 0,
          availableTime: filterObject.availableTime ?? strings.filterAntTime,
        });
      }
      setShowTimeComponent(
        fType === filterType.REFEREES ||
          fType === filterType.SCOREKEEPERS ||
          fType === filterType.TEAMAVAILABLECHALLENGE ||
          fType === filterType.UPCOMINGMATCHES ||
          fType === filterType.PLAYERAVAILABLECHALLENGE ||
          fType === filterType.RECENTMATCHS,
      );
      setShowSportComponent(
        fType === filterType.REFEREES ||
          fType === filterType.SCOREKEEPERS ||
          fType === filterType.PLAYERAVAILABLECHALLENGE ||
          fType === filterType.UPCOMINGMATCHES ||
          fType === filterType.RECRUIITINGMEMBERS ||
          fType === filterType.LOOKINGFORTEAMCLUB,
      );

      setShowFeeComponent(
        fType === filterType.REFEREES ||
          fType === filterType.SCOREKEEPERS ||
          fType === filterType.PLAYERAVAILABLECHALLENGE,
      );
    }
  }, [fType, filterObject, isVisible, showSportComponent]);

  useEffect(() => {
    if (fType === filterType.RECRUIITINGMEMBERS && isVisible) {
      const temp = [...groups];
      temp.forEach((x, i) => {
        if (x.type === filterObject.groupTeam) {
          temp[i].isChecked = true;
        } else if (x.type === filterObject.groupClub) {
          temp[i].isChecked = true;
        } else if (x.type === filterObject.groupLeague) {
          temp[i].isChecked = true;
        } else {
          temp[i].isChecked = false;
        }
        setGroups([...temp]);
      });
    }
  }, [fType, filterObject, isVisible]);

  const isIconCheckedOrNot = useCallback(
    ({item, index}) => {
      const temp = [...groups];
      if (item.isChecked) {
        temp[index].isChecked = false;
      } else {
        temp[index].isChecked = true;
      }
      setGroups([...temp]);
    },
    [groups],
  );

  const handleSetLocationOptions = useCallback(
    (location1) => {
      // eslint-disable-next-line no-prototype-builtins
      if (location1.hasOwnProperty('address')) {
        setFilters({
          ...filters,
          location: location1.city ?? location1.address,
          isSearchPlaceholder: false,
          searchCityLoc: location1.city ?? location1.address,
        });
      } else {
        setFilters({
          ...filters,
          location: location1.city,
          isSearchPlaceholder: false,
          searchCityLoc: location1.city,
        });
      }
    },
    [filters],
  );
  const handleDatePress = (date) => {
    if (tag === 1) {
      const dateObject = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0,
      ); // Start of the day
      const fromDate = Number(parseFloat(dateObject / 1000).toFixed(0));
      const temp = {...filters};
      temp.fromDateTime = fromDate;
      setFilters({...temp});
    } else if (tag === 2) {
      const toDateObject = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
      ); // End of the day
      const toDate = Number(parseFloat(toDateObject / 1000).toFixed(0));
      const temp = {...filters};
      temp.toDateTime = toDate;
      setFilters({...temp});
    }
    setDatePickerShow(false);
  };
  const handleCancelPress = () => {
    setDatePickerShow(false);
  };
  const renderSports = ({item}) => (
    <Pressable
      style={styles.listItem}
      onPress={() => {
        if (item.sport === strings.allSport) {
          const tempObject = {
            ...filters,
            sport: strings.allSport,
            sport_name: strings.allSport,
            sport_type: strings.allSport,
          };
          setFilters({...tempObject});
          const temp = [...groupsType];
          setGroups([...temp]);
        } else {
          const tempObject = {
            ...filters,
            sport: item.sport,
            sport_name: item.sport_name,
            sport_type: item.sport_type,
          };
          setFilters({...tempObject});
          const temp = [
            {type: strings.clubstitle, isChecked: false},
            {type: strings.leaguesTitle, isChecked: false},
          ];
          setGroups([...temp]);
        }
        setVisibleSportsModal(false);
      }}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'center',
          textAlignVertical: 'center',
          flex: 1,
          marginLeft: 10,
          marginRight: 10,
        }}>
        <Text style={styles.languageList}>{item.sport_name}</Text>
        <View style={styles.checkbox}>
          {filters?.sport.toLowerCase() === item.sport.toLowerCase() ? (
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
  const onPressReset = useCallback(() => {
    setFilters({
      location: strings.worldTitleText,
      locationOption: 2,
      isSearchPlaceholder: true,
      sport: strings.allSport,
      sport_name: strings.allSport,
      sport_type: strings.allSport,
      minFee: 0,
      maxFee: 0,
      availableTime: strings.filterAntTime,
      fromDateTime: '',
      toDateTime: '',
      sortOption: sortOptionType.RANDOM,
    });
    setTag(0);
  }, []);
  // const applyValidation = useCallback(() => {
  //   if (Number(filters.minFee) > 0 && Number(filters.maxFee) <= 0) {
  //     Alert.alert(strings.refereeFeeMax);
  //     return false;
  //   }
  //   if (Number(filters.minFee) <= 0 && Number(filters.maxFee) > 0) {
  //     Alert.alert(strings.refereeFeeMin);
  //     return false;
  //   }
  //   if (Number(filters.minFee) > Number(filters.maxFee)) {
  //     Alert.alert(strings.refereeFeeCorrect);
  //     return false;
  //   }
  //   return true;
  // }, [filters]);
  const applyDateValidation = useCallback(() => {
    if (
      (filters.availableTime === strings.filterPickaDate &&
        filters?.fromDateTime === '') ||
      (filters?.fromDateTime === undefined && filters?.toDateTime === '') ||
      filters?.toDateTime === undefined
    ) {
      Alert.alert(strings.chooseCorrectDate);
      return false;
    }
    return true;
  }, [filters]);
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderGroupsTypeItem = ({item, index}) => (
    <TouchableOpacity
      // style={styles.listItem}
      onPress={() => isIconCheckedOrNot({item, index})}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignSelf: 'flex-end',
          marginBottom: 15,
        }}>
        <Text style={styles.sportList}>{item?.type}</Text>
        <View style={styles.groupCheckbox}>
          {item?.isChecked ? (
            <FastImage
              resizeMode={'contain'}
              source={images.orangeCheckBox}
              style={styles.checkboxImg}
            />
          ) : (
            <FastImage
              resizeMode={'contain'}
              source={images.uncheckWhite}
              style={styles.unCheckboxImg}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  const renderSeparator = () => <View style={styles.separatorLine} />;
  const Header = ({title}) => (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );

  const sections = useMemo(() => {
    if (favoriteSportsList?.length > 0)
      return [
        {
          title: strings.favoriteSports,
          data: favoriteSportsList ?? [],
        },
        {
          title: strings.otherSports,
          data: sports ?? [],
        },
      ];
    return [
      {
        title: strings.otherSports,
        data: sports ?? [],
      },
    ];
  }, [favoriteSportsList, sports]);

  return (
    <View>
      <CustomModalWrapper
        isVisible={isVisible}
        closeModal={() => {
          onPressCancel();
        }}
        modalType={ModalTypes.style1}
        title={strings.filter}
        headerRightButtonText={strings.apply}
        onRightButtonPress={() => {
          if (fType === filterType.RECRUIITINGMEMBERS) {
            const tempFilter = {
              ...filters,
            };
            // For fee
            if (Number(filters.minFee) >= 0 && Number(filters.maxFee) > 0) {
              tempFilter.fee = `${tempFilter.minFee}-${tempFilter.maxFee}`;
            }
            if (fType === filterType.RECRUIITINGMEMBERS) {
              if (
                groups.filter(
                  (obj) => obj.type === strings.teamstitle && obj.isChecked,
                ).length > 0
              ) {
                tempFilter.groupTeam = strings.teamstitle;
              } else {
                delete tempFilter.groupTeam;
              }
              if (
                groups.filter(
                  (obj) => obj.type === strings.clubstitle && obj.isChecked,
                ).length > 0
              ) {
                tempFilter.groupClub = strings.clubstitle;
              } else {
                delete tempFilter.groupClub;
              }
              if (
                groups.filter(
                  (obj) => obj.type === strings.leaguesTitle && obj.isChecked,
                ).length > 0
              ) {
                tempFilter.groupLeague = strings.leaguesTitle;
              } else {
                delete tempFilter.groupLeague;
              }
              if (groups.filter((obj) => obj.isChecked).length === 3) {
                delete tempFilter.groupTeam;
                delete tempFilter.groupClub;
                delete tempFilter.groupLeague;
              }
              if (groups.filter((obj) => obj.isChecked).length === 2) {
                delete tempFilter.groupClub;
                delete tempFilter.groupLeague;
              }
            }
            onPressApply(tempFilter);
          } else if (fType === filterType.LOOKINGFORTEAMCLUB) {
            const tempFilter = {
              ...filters,
            };
            onPressApply(tempFilter);
          } else if (fType === filterType.PLAYERAVAILABLECHALLENGE) {
            const tempFilter = {
              ...filters,
            };
            if (Number(filters.minFee) >= 0 && Number(filters.maxFee) > 0) {
              tempFilter.fee = `${tempFilter.minFee}-${tempFilter.maxFee}`;
            }
            if (filters.fromDateTime && filters.toDateTime) {
              tempFilter.availableTime = `${moment(
                getJSDate(filters.fromDateTime).getTime(),
              ).format('MMM DD')}-${moment(
                getJSDate(filters.toDateTime).getTime(),
              ).format('MMM DD')}`;
            }

            onPressApply(tempFilter);
          } else if (
            fType === filterType.RECENTMATCHS ||
            fType === filterType.UPCOMINGMATCHES
          ) {
            const tempFilter = {
              ...filters,
            };
            if (filters.availableTime === strings.filterPickaDate) {
              if (applyDateValidation()) {
                tempFilter.availableTime = `${moment(
                  getJSDate(filters.fromDateTime).getTime(),
                ).format('MMM DD')}-${moment(
                  getJSDate(filters.toDateTime).getTime(),
                ).format('MMM DD')}`;
                onPressApply(tempFilter);
              }
            } else {
              onPressApply(tempFilter);
            }
          } else {
            const tempFilter = {
              ...filters,
            };
            // For fee
            if (Number(filters.minFee) >= 0 && Number(filters.maxFee) > 0) {
              tempFilter.fee = `${tempFilter.minFee}-${tempFilter.maxFee}`;
            }
            // For date
            if (filters.availableTime === strings.filterPickaDate) {
              if (applyDateValidation()) {
                tempFilter.availableTime = `${moment(
                  getJSDate(filters.fromDateTime).getTime(),
                ).format('MMM DD')}-${moment(
                  getJSDate(filters.toDateTime).getTime(),
                ).format('MMM DD')}`;
                onPressApply(tempFilter);
              }
            } else {
              onPressApply(tempFilter);
            }
          }
        }}>
        <View
          style={{
            flex: 1,
            position: 'absolute',
            right: 0,
            left: 0,
            height: Dimensions.get('window').height - 50,
          }}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <ScrollView
              contentContainerStyle={{paddingBottom: 50}}
              contentInset={{bottom: 50}}
              scrollIndicatorInsets={{bottom: 50}}>
              <View style={{marginTop: 5}}>
                <View style={{flexDirection: 'column', margin: 15}}>
                  <View>
                    <Text style={styles.filterTitleBold}>
                      {strings.locationTitleText}
                    </Text>
                  </View>
                  <View style={{marginTop: 15}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 15,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.filterTitle}>
                        {strings.currrentCityTitle}
                      </Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setFilters({
                            ...filters,
                            locationOption: locationType.CURRENT_LOCATION,
                            isSearchPlaceholder: true,
                          });
                        }}>
                        <Image
                          source={
                            filters.locationOption === 0
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
                        marginBottom: 15,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.filterTitle}>
                        {strings.homeCityTitleText}
                      </Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setFilters({
                            ...filters,
                            locationOption: locationType.HOME_CITY,
                            isSearchPlaceholder: true,
                          });
                        }}>
                        <Image
                          source={
                            filters.locationOption === 1
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
                        marginBottom: 15,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.filterTitle}>{strings.world}</Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setFilters({
                            ...filters,
                            locationOption: locationType.WORLD,
                            isSearchPlaceholder: true,
                          });
                        }}>
                        <Image
                          source={
                            filters.locationOption === 2
                              ? images.checkRoundOrange
                              : images.radioUnselect
                          }
                          style={styles.radioButtonStyle}
                        />
                      </TouchableWithoutFeedback>
                    </View>

                    <TouchableWithoutFeedback
                      onPress={() => {
                        setVisibleLocationModal(true);
                        setFilters({
                          ...filters,
                          locationOption: locationType.SEARCH_CITY,
                          isSearchPlaceholder: true,
                        });
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={styles.searchCityContainer}>
                          <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={[
                              styles.searchCityText,
                              {
                                color:
                                  filters.isSearchPlaceholder === true
                                    ? colors.placeHolderColor
                                    : colors.lightBlackColor,
                              },
                            ]}>
                            {filters.isSearchPlaceholder === true
                              ? strings.searchTitle
                              : filters.searchCityLoc}
                          </Text>
                        </View>
                        <View
                          style={{
                            alignSelf: 'center',
                          }}>
                          <Image
                            source={
                              filters.locationOption ===
                              locationType.SEARCH_CITY
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
                {showSportOption && (
                  <View>
                    <View
                      style={{
                        flexDirection: 'column',
                        margin: 15,
                        marginTop: 20,
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
                                justifyContent: 'center',
                              }}>
                              <View>
                                <Text style={styles.searchCityText}>
                                  {filters?.sport_name ?? strings.allSport}
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
                )}

                {showTimeComponent && (
                  <View
                    style={{
                      flexDirection: 'column',
                      margin: 15,
                      marginTop: 20,
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text style={styles.filterTitleBold}>
                        {strings.availableTime}
                      </Text>
                    </View>
                    <View style={{marginTop: 10}}>
                      <View
                        style={[
                          {
                            justifyContent: 'flex-start',
                          },
                          styles.sportsContainer,
                        ]}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            setShowTimeActionSheet(true);
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                            }}>
                            <View>
                              <Text style={styles.searchCityText}>
                                {filters.availableTime}
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
                    {filters.availableTime === strings.filterPickaDate && (
                      <View style={{marginTop: 10}}>
                        <FilterTimeSelectItem
                          title={strings.from}
                          date={
                            // filters.fromDateTime
                            //   ? moment(filters.fromDateTime).format('ll')
                            //   : ''
                            filters.fromDateTime
                              ? moment(
                                  getJSDate(filters.fromDateTime).getTime(),
                                ).format('ll')
                              : ''
                          }
                          onDatePress={() => {
                            setTag(1);
                            setDatePickerShow(true);
                          }}
                          onXCirclePress={() =>
                            setFilters({...filters, fromDateTime: ''})
                          }
                        />
                        <FilterTimeSelectItem
                          title={strings.to}
                          date={
                            // filters.toDateTime
                            //   ? moment(filters.toDateTime).format('ll')
                            //   : ''
                            filters.toDateTime
                              ? moment(
                                  getJSDate(filters.toDateTime).getTime(),
                                ).format('ll')
                              : ''
                          }
                          onDatePress={() => {
                            setDatePickerShow(true);
                            setTag(2);
                          }}
                          onXCirclePress={() =>
                            setFilters({...filters, toDateTime: ''})
                          }
                        />
                      </View>
                    )}
                  </View>
                )}
                {filters?.sport !== strings.allSport && showFeeComponent && (
                  <View
                    style={{
                      flexDirection: 'column',
                      margin: 15,
                      marginTop: 5,
                      justifyContent: 'space-between',
                    }}>
                    <View style={{}}>
                      <Text style={styles.filterTitleBold}>{feeTitle}</Text>
                    </View>
                    <View style={{marginTop: 10}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <TextInput
                          onChangeText={(text) =>
                            setFilters({...filters, minFee: text})
                          }
                          value={filters.minFee}
                          style={styles.minFee}
                          placeholder={strings.minPlaceholder}
                          autoCorrect={false}
                          keyboardType={'numeric'}
                          placeholderTextColor={colors.userPostTimeColor}
                        />
                        <TextInput
                          onChangeText={(text) =>
                            setFilters({...filters, maxFee: text})
                          }
                          value={filters.maxFee}
                          style={styles.minFee}
                          placeholder={strings.maxPlaceholder}
                          autoCorrect={false}
                          keyboardType={'numeric'}
                          placeholderTextColor={colors.userPostTimeColor}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          alignContent: 'flex-end',
                          marginTop: 5,
                        }}>
                        <Text style={styles.timeZoneText}>
                          {strings.currencyText}{' '}
                          <Text
                            style={{
                              fontFamily: fonts.RRegular,
                              textDecorationLine: 'underline',
                              fontSize: 14,
                            }}>
                            {strings.defaultCurrency}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                {fType === filterType.RECRUIITINGMEMBERS && (
                  <View
                    style={{
                      flexDirection: 'column',
                      margin: 15,
                      marginTop: 34,
                    }}>
                    <View>
                      <Text style={styles.filterTitleBold}>
                        {strings.groupsTitleText}
                      </Text>
                    </View>
                    <View style={{marginTop: 10}}>
                      <View style={{flexDirection: 'row', marginBottom: 10}}>
                        <FlatList
                          data={groups}
                          keyExtractor={keyExtractor}
                          renderItem={renderGroupsTypeItem}
                        />
                      </View>
                    </View>
                  </View>
                )}
              </View>
              <View style={{flex: 1}} />
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
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <BottomSheet
          isVisible={showTimeActionSheet}
          closeModal={() => {
            setShowTimeActionSheet(false);
          }}
          optionList={filterOptions}
          onSelect={(option) => {
            if (option === strings.filterAntTime) {
              setTag(0);
              const temp = {...filters};
              temp.fromDateTime = Number(
                parseFloat(new Date().getTime() / 1000).toFixed(0),
              );
              temp.toDateTime = '';
              temp.availableTime = option;

              setFilters({...temp});
            } else if (option === strings.filterToday) {
              const today = new Date();
              const fromDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                0,
                0,
                0,
              ); // Start of the day
              const toDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                23,
                59,
                59,
              ); // End of the day
              setTag(0);
              const temp = {...filters};
              temp.fromDateTime =
                fType === filterType.RECENTMATCHS
                  ? Number(parseFloat(fromDate / 1000).toFixed(0))
                  : Number(parseFloat(today / 1000).toFixed(0));
              temp.toDateTime = Number(parseFloat(toDate / 1000).toFixed(0));
              temp.availableTime = option;
              setFilters({...temp});
            } else if (option === strings.filterTomorrow) {
              const now = new Date();
              const tomorrow = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
              );
              const startDate = new Date(
                tomorrow.getFullYear(),
                tomorrow.getMonth(),
                tomorrow.getDate(),
                0,
                0,
                0,
              );
              const endDate = new Date(
                tomorrow.getFullYear(),
                tomorrow.getMonth(),
                tomorrow.getDate(),
                23,
                59,
                59,
              );
              setTag(0);
              const temp = {...filters};
              temp.fromDateTime = Number(
                parseFloat(startDate / 1000).toFixed(0),
              );
              temp.toDateTime = Number(parseFloat(endDate / 1000).toFixed(0));
              temp.availableTime = option;
              setFilters({...temp});
            } else if (option === strings.filterYesterday) {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const fromDate = new Date(
                yesterday.getFullYear(),
                yesterday.getMonth(),
                yesterday.getDate(),
                0,
                0,
                0,
              ); // Start of the day
              const toDate = new Date(
                yesterday.getFullYear(),
                yesterday.getMonth(),
                yesterday.getDate(),
                23,
                59,
                59,
              ); // End of the day
              setTag(0);
              const temp = {...filters};
              temp.fromDateTime = Number(
                parseFloat(fromDate / 1000).toFixed(0),
              );
              temp.toDateTime = Number(parseFloat(toDate / 1000).toFixed(0));
              temp.availableTime = option;
              setFilters({...temp});
            } else if (option === strings.filterLast7Day) {
              const today = new Date();
              const fromDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - 6,
                0,
                0,
                0,
              ); // Start of the day for 7 days ago
              const toDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                23,
                59,
                59,
              ); // End of the day for today
              setTag(0);
              const temp = {...filters};
              temp.fromDateTime = Number(
                parseFloat(fromDate / 1000).toFixed(0),
              );
              temp.toDateTime = Number(parseFloat(toDate / 1000).toFixed(0));
              temp.availableTime = option;
              setFilters({...temp});
            } else if (option === strings.filterThisMonth) {
              const today = new Date();
              const fromDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                1,
                0,
                0,
                0,
              ); // Start of the month
              const toDate = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                0,
                23,
                59,
                59,
              ); // End of the month

              setTag(0);
              const temp = {...filters};
              // temp.fromDateTime = Number(
              //   parseFloat(fromDate / 1000).toFixed(0),
              // );
              temp.fromDateTime =
                fType === filterType.RECENTMATCHS
                  ? Number(parseFloat(fromDate / 1000).toFixed(0))
                  : Number(parseFloat(today / 1000).toFixed(0));
              temp.toDateTime = Number(parseFloat(toDate / 1000).toFixed(0));
              temp.availableTime = option;
              setFilters({...temp});
            } else if (option === strings.filterLastMonth) {
              const today = new Date();
              const fromDate = new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                1,
                0,
                0,
                0,
              ); // Start of the previous month
              const toDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                0,
                23,
                59,
                59,
              ); // End of the previous month

              setTag(0);
              const temp = {...filters};
              temp.fromDateTime = Number(
                parseFloat(fromDate / 1000).toFixed(0),
              );
              temp.toDateTime = Number(parseFloat(toDate / 1000).toFixed(0));
              temp.availableTime = option;
              setFilters({...temp});
            } else if (option === strings.filterNext7Day) {
              const now = new Date();
              const fromDate = now; // Set "from" date as the current time

              const toDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 7,
                23,
                59,
                59,
              ); // Set "to" date as the end of the next 7 days
              setTag(0);
              const temp = {...filters};
              temp.fromDateTime = Number(
                parseFloat(fromDate / 1000).toFixed(0),
              );
              temp.toDateTime = Number(parseFloat(toDate / 1000).toFixed(0));
              temp.availableTime = option;
              setFilters({...temp});
            } else if (option === strings.filterNextMonth) {
              const now = new Date();
              const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1);

              const startDate = new Date(
                nextMonth.getFullYear(),
                nextMonth.getMonth(),
                1,
              );
              const endDate = new Date(
                nextMonth.getFullYear(),
                nextMonth.getMonth() + 1,
                0,
              );
              setTag(0);
              const temp = {...filters};
              temp.fromDateTime = Number(
                parseFloat(startDate / 1000).toFixed(0),
              );
              temp.toDateTime = Number(parseFloat(endDate / 1000).toFixed(0));
              temp.availableTime = option;
              setFilters({...temp});
            } else {
              const temp = {...filters};
              temp.availableTime = option;
              setFilters({...temp});
            }
            setShowTimeActionSheet(false);
          }}
        />
        {fType === filterType.RECENTMATCHS ? (
          <DateTimePickerView
            visible={datePickerShow}
            onDone={handleDatePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            mode={'date'}
            maximumDate={new Date()}
          />
        ) : (
          <DateTimePickerView
            visible={datePickerShow}
            onDone={handleDatePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            mode={'date'}
            minimumDate={new Date()}
          />
        )}
      </CustomModalWrapper>
      <LocationModal
        visibleLocationModal={visibleLocationModal}
        title={strings.cityStateOrCountryTitle}
        setVisibleLocationModalhandler={() => setVisibleLocationModal(false)}
        onLocationSelect={handleSetLocationOptions}
        placeholder={strings.searchTitle}
        type={'country'}
      />

      {fType === filterType.PLAYERAVAILABLECHALLENGE ? (
        <CustomModalWrapper
          isVisible={visibleSportsModal}
          closeModal={() => {
            setVisibleSportsModal(false);
          }}
          modalType={ModalTypes.style7}>
          <SectionList
            sections={sections}
            renderItem={renderSports}
            renderSectionHeader={({section: {title}}) => {
              if (title === strings.otherSports) {
                return (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{...styles.separatorLine, marginBottom: 35}} />
                    <Header title={title} />
                  </View>
                );
              }
              return <Header title={title} />;
            }}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={renderSeparator}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </CustomModalWrapper>
      ) : (
        <CustomModalWrapper
          isVisible={visibleSportsModal}
          ratio={9}
          closeModal={() => {
            setVisibleSportsModal(false);
          }}
          modalType={ModalTypes.style7}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}></View>
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={sports}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSports}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </CustomModalWrapper>
      )}
    </View>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  radioButtonStyle: {
    height: 22,
    width: 22,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginLeft: 10,
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

  resetButton: {
    alignSelf: 'center',
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    height: 25,
    width: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  resetTitle: {
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },

  searchCityContainer: {
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    // width: 300,
    justifyContent: 'center',
    flex: 1,
    marginRight: 13,
  },
  sportsContainer: {
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
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

  listItem: {
    height: 64,
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  timeZoneText: {
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  sportList: {
    color: colors.lightBlackColor,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    textAlignVertical: 'center',
    fontSize: 16,
  },
  checkbox: {
    alignSelf: 'center',
    marginRight: 15,
  },
  unCheckboxImg: {
    width: 22,
    height: 22,
    tintColor: colors.lightBlackColor,
    alignSelf: 'center',
  },
  header: {},
  headerText: {
    fontFamily: fonts.RMedium,
    fontSize: 18,
    color: colors.lightBlackColor,
  },
  separatorLine: {
    backgroundColor: colors.grayBackgroundColor,
    width: '100%',
    alignSelf: 'center',
    height: 1,
  },
  groupCheckbox: {
    alignSelf: 'center',
  },
});
