import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
} from 'react';
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
import {getCountry} from 'country-currency-map';
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
import CustomModalWrapper from '../CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import fonts from '../../Constants/Fonts';
import {widthPercentageToDP, getJSDate} from '../../utils';
import AvailableTimeComponent from '../AvailableTimeComponent';
import Verbs from '../../Constants/Verbs';
import AuthContext from '../../auth/context';
import CurrencyModal from '../CurrencyModal/CurrencyModal';

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
  isEventFilter = false,
  showTimeComponent = false,
  showFeeOption = false,
  selectedTab = '',
}) => {
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [filters, setFilters] = useState(filterObject);
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);

  const [groups, setGroups] = useState(groupsType);
  const [showFeeComponent, setShowFeeComponent] = useState(false);
  const [showSportComponent, setShowSportComponent] = useState(false);
  const [isTimeComponentVisible, setIsTimeComponentVisible] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const authContext = useContext(AuthContext);

  const calculateVisibilityForTimeComponent = useCallback(() => {
    if (!selectedTab) {
      return true;
    }
    if (
      selectedTab === strings.playerTitle &&
      filters?.sport_type === Verbs.singleSport
    ) {
      return true;
    }
    if (
      selectedTab !== strings.clubsTitleText ||
      selectedTab !== strings.leaguesTitleText
    ) {
      return true;
    }
    return false;
  }, [filters?.sport_type, selectedTab]);

  useEffect(() => {
    if (showTimeComponent && filters?.sport !== strings.allSport) {
      setIsTimeComponentVisible(calculateVisibilityForTimeComponent());
    } else {
      setIsTimeComponentVisible(false);
    }
  }, [showTimeComponent, filters?.sport, calculateVisibilityForTimeComponent]);

  useEffect(() => {
    if (isVisible && (filters?.minFee || filters?.maxFee)) {
      setFilters((prevProps) => ({...prevProps, fee: true}));
    }
  }, [isVisible, filters?.minFee, filters?.maxFee]);

  useEffect(() => {
    if (showFeeOption && filters?.sport !== strings.allSport) {
      const feeComponentVisibilityStatus =
        calculateVisibilityForTimeComponent();
      if (feeComponentVisibilityStatus) {
        const Usercurrency = getCountry(authContext.entity.obj.country);
        setFilters((prevPros) => ({
          ...prevPros,
          currency: Usercurrency?.currency,
        }));
      }
      setShowFeeComponent(feeComponentVisibilityStatus);
    } else {
      setShowFeeComponent(false);
    }
  }, [
    filters?.sport,
    calculateVisibilityForTimeComponent,
    showFeeOption,
    authContext.entity.obj.country,
  ]);

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

      setShowSportComponent(
        fType === filterType.REFEREES ||
          fType === filterType.SCOREKEEPERS ||
          fType === filterType.PLAYERAVAILABLECHALLENGE ||
          fType === filterType.UPCOMINGMATCHES ||
          fType === filterType.RECRUIITINGMEMBERS ||
          fType === filterType.LOOKINGFORTEAMCLUB,
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
      eventType: strings.upcomingTitleText,
    });
    // setTag(0);
  }, []);

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
    <>
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

                {/* Available time component */}
                {isTimeComponentVisible && (
                  <AvailableTimeComponent
                    filters={filters}
                    isEventFilter={isEventFilter}
                    fType={fType}
                    setFilters={setFilters}
                  />
                )}

                {/* Fees component */}
                {showFeeComponent && (
                  <View style={styles.feeContainer}>
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
                          onChangeText={(text) => {
                            setFilters({...filters, minFee: text});
                          }}
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
                      <TouchableOpacity
                        style={{
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          alignContent: 'flex-end',
                          marginTop: 5,
                        }}
                        onPress={() => setShowCurrencyModal(true)}>
                        <Text style={styles.timeZoneText}>
                          {strings.currencyText}{' '}
                          <Text
                            style={{
                              fontFamily: fonts.RRegular,
                              textDecorationLine: 'underline',
                              fontSize: 14,
                            }}>
                            {filters.currency ?? strings.defaultCurrency}
                          </Text>
                        </Text>
                      </TouchableOpacity>
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
      <CurrencyModal
        isVisible={showCurrencyModal}
        closeList={() => setShowCurrencyModal(false)}
        onNext={(item) => {
          setFilters({...filters, currency: item});
          setShowCurrencyModal(false);
        }}
        modalType={ModalTypes.style6}
      />
    </>
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
  feeContainer: {
    flexDirection: 'column',
    margin: 15,
    marginTop: 5,
    justifyContent: 'space-between',
  },
});
