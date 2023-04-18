import React, {useState, useCallback, useEffect} from 'react';
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
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import moment from 'moment';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import TCThinDivider from '../TCThinDivider';
import {strings} from '../../../Localization/translation';
// import TCRefereeView from '../../components/TCRefereeView';
import {locationType, sortOptionType} from '../../utils/constant';
import LocationModal from '../LocationModal/LocationModal';
import BottomSheet from '../modals/BottomSheet';
import DateTimePickerView from '../Schedule/DateTimePickerModal';
import CustomModalWrapper from '../CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import FilterTimeSelectItem from './FilterTimeSelectItem';
import fonts from '../../Constants/Fonts';
import {widthPercentageToDP} from '../../utils';

const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;

const SearchModal = ({
  sports,
  isVisible,
  filterObject,
  onPressCancel = () => {},
  onPressApply = () => {},
}) => {
  console.log('filterObject object  ', filterObject);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [filters, setFilters] = useState(filterObject);
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [showTimeActionSheet, setShowTimeActionSheet] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [tag, setTag] = useState();
  useEffect(() => {
    setFilterOptions([
      strings.filterAntTime,
      strings.filterToday,
      strings.filterYesterday,
      strings.filterLast7Day,
      strings.filterThisMonth,
      strings.filterLastMonth,
      strings.filterPickaDate,
    ]);
  }, []);
  useEffect(() => {
    if (isVisible) {
      setFilters({
        ...filterObject,
        isSearchPlaceholder: filterObject.locationOption !== 3,
        sortOption: filterObject.sortOption ?? 0,
        availableTime: filterObject.availableTime ?? strings.filterAntTime,
      });
    }
  }, [filterObject, isVisible]);

  const handleSetLocationOptions = useCallback(
    (location1) => {
      // eslint-disable-next-line no-prototype-builtins
      if (location1.hasOwnProperty('address')) {
        setFilters({
          ...filters,
          location: location1?.formattedAddress,
          isSearchPlaceholder: false,
          searchCityLoc: location1?.formattedAddress,
        });
      } else {
        setFilters({
          ...filters,
          location: location1?.city,
          isSearchPlaceholder: false,
          searchCityLoc: location1?.city,
        });
      }
    },
    [filters],
  );
  const handleDatePress = (date) => {
    if (tag === 1) {
      setFilters({...filters, fromDateTime: date});
    } else if (tag === 2) {
      setFilters({...filters, toDateTime: date});
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
          setFilters({
            ...filters,
            sport: strings.allSport,
            sport_name: strings.allSport,
            sport_type: strings.allSport,
          });
        } else {
          setFilters({
            ...filters,
            sport: item.sport,
            sport_name: item.sport_name,
            sport_type: item.sport_type,
          });
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
      locationOption: 0,
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
  const applyValidation = useCallback(() => {
    if (Number(filters.minFee) > 0 && Number(filters.maxFee) <= 0) {
      Alert.alert(strings.refereeFeeMax);
      return false;
    }
    if (Number(filters.minFee) <= 0 && Number(filters.maxFee) > 0) {
      Alert.alert(strings.refereeFeeMin);
      return false;
    }
    if (Number(filters.minFee) > Number(filters.maxFee)) {
      Alert.alert(strings.refereeFeeCorrect);
      return false;
    }
    return true;
  }, [filters.maxFee, filters.minFee]);
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
  return (
    <View>
      <CustomModalWrapper
        isVisible={isVisible}
        closeModal={() => {
          onPressCancel();
        }}
        modalType={ModalTypes.style1}
        title={strings.filter}
        // containerStyle={styles.bottomPopupContainer}
        headerRightButtonText={strings.apply}
        onRightButtonPress={() => {
          if (applyValidation()) {
            const tempFilter = {
              ...filters,
            };
            // For fee
            if (Number(filters.minFee) >= 0 && Number(filters.maxFee) > 0) {
              tempFilter.fee = `${tempFilter.minFee}-${tempFilter.maxFee}`;
            }
            console.log('Apply tempFilter ==>', tempFilter);
            onPressApply(tempFilter);
          }
        }}>
        <View
          style={{
            flex: 1,
            position: 'absolute',
            // backgroundColor: colors.redColor,
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
                            filters.locationOption === 2
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
                        {strings.currentCity}
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
                            filters.locationOption === 0
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
                            <Icon size={24} color="black" name="chevron-down" />
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
                          filters.fromDateTime
                            ? moment(filters.fromDateTime).format('ll')
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
                          filters.toDateTime
                            ? moment(filters.toDateTime).format('ll')
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

                {filters?.sport !== strings.allSport && (
                  <View
                    style={{
                      flexDirection: 'column',
                      margin: 15,
                      marginTop: 5,
                      justifyContent: 'space-between',
                    }}>
                    <View style={{}}>
                      <Text style={styles.filterTitleBold}>
                        {strings.refereeFee}
                      </Text>
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
                          // clearButtonMode={'always'}
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
                          // clearButtonMode={'always'}
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
                <View
                  style={{
                    flexDirection: 'column',
                    margin: 15,
                    marginTop: 34,
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={styles.filterTitleBold}>{strings.sortBy}</Text>
                  </View>
                  <View style={{marginTop: 15}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 15,
                        // justifyContent: 'space-between',
                      }}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          // setSortOption(0);
                          setFilters({
                            ...filters,
                            sortOption: sortOptionType.RANDOM,
                          });
                        }}>
                        <Image
                          source={
                            filters.sortOption === sortOptionType.RANDOM
                              ? images.checkRoundOrange
                              : images.radioUnselect
                          }
                          style={styles.radioButtonStyle}
                        />
                      </TouchableWithoutFeedback>
                      <Text style={styles.sortOptionStyle}>
                        {strings.filterRandom}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 15,
                      }}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setFilters({
                            ...filters,
                            sortOption: sortOptionType.LOW_TO_HIGH,
                          });
                        }}>
                        <Image
                          source={
                            filters.sortOption === sortOptionType.LOW_TO_HIGH
                              ? images.checkRoundOrange
                              : images.radioUnselect
                          }
                          style={styles.radioButtonStyle}
                        />
                      </TouchableWithoutFeedback>
                      <Text style={styles.sortOptionStyle}>
                        {strings.filterLowtoHighRefereeFee}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 15,
                      }}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          // setSortOption(2);
                          setFilters({
                            ...filters,
                            sortOption: sortOptionType.HIGH_TO_LOW,
                          });
                        }}>
                        <Image
                          source={
                            filters.sortOption === sortOptionType.HIGH_TO_LOW
                              ? images.checkRoundOrange
                              : images.radioUnselect
                          }
                          style={styles.radioButtonStyle}
                        />
                      </TouchableWithoutFeedback>
                      <Text style={styles.sortOptionStyle}>
                        {strings.filterHightoLowRefereeFee}
                      </Text>
                    </View>
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
        <BottomSheet
          isVisible={showTimeActionSheet}
          closeModal={() => {
            setShowTimeActionSheet(false);
          }}
          optionList={filterOptions}
          onSelect={(option) => {
            if (option !== strings.filterPickaDate) {
              setTag(0);
              // setFromDateTime('');
              // setToDateTime('');
              setFilters({...filters, fromDateTime: '', toDateTime: ''});
            }
            // setSelectedTime(option);
            setFilters({...filters, availableTime: option});
            setShowTimeActionSheet(false);
          }}
        />
        <LocationModal
          visibleLocationModal={visibleLocationModal}
          title={strings.cityStateOrCountryTitle}
          setVisibleLocationModalhandler={() => setVisibleLocationModal(false)}
          onLocationSelect={handleSetLocationOptions}
          placeholder={strings.searchTitle}
          type={'country'}
        />
        <DateTimePickerView
          visible={datePickerShow}
          onDone={handleDatePress}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          mode={'date'}
          minimumDate={new Date()}
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
      </CustomModalWrapper>
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
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    height: 25,
    width: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 10,
    position: 'absolute',
    // flex: 1,
    bottom: 80,
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
    width: widthPercentageToDP('80%'),
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

  listItem: {},

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
  sortOptionStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    left: 10,
  },
  timeZoneText: {
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
});
