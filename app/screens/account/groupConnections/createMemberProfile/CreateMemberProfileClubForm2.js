import React, {
  useLayoutEffect,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Keyboard,
  Dimensions,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import {useIsFocused} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerView from '../../../../components/Schedule/DateTimePickerModal';

import images from '../../../../Constants/ImagePath';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import AuthContext from '../../../../auth/context';

import TCFormProgress from '../../../../components/TCFormProgress';
import {strings} from '../../../../../Localization/translation';
import TCPicker from '../../../../components/TCPicker';
import DataSource from '../../../../Constants/DataSource';
import TCLabel from '../../../../components/TCLabel';
import TCTouchableLabel from '../../../../components/TCTouchableLabel';
import {
  getHitSlop,
  heightPercentageToDP,
  monthNames,
  showAlert,
  widthPercentageToDP,
} from '../../../../utils';
import TCPhoneNumber from '../../../../components/TCPhoneNumber';
import TCMessageButton from '../../../../components/TCMessageButton';
import {searchAddress, searchCityState} from '../../../../api/External';
import LocationView from '../../../../components/LocationView';
import {heightMesurement, weightMesurement} from '../../../../utils/constant';

let entity = {};
export default function CreateMemberProfileClubForm2({navigation, route}) {
  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  const isFocused = useIsFocused();
  const [gender, setGender] = useState();
  const [birthday, setBirthday] = useState();
  const [showDate, setShowDate] = useState(false);
  const [postalCode, setPostalCode] = useState();
  const [minDateValue, setMinDateValue] = useState(new Date());
  const [maxDateValue, setMaxDateValue] = useState(new Date());
  const [memberInfo, setMemberInfo] = useState({});
  const [location, setLocation] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [country, setCountry] = useState();
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [cityData, setCityData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [visibleCityModal, setVisibleCityModal] = useState(false);

  const addPhoneNumber = () => {
    const obj = {
      id: phoneNumber.length === 0 ? 0 : phoneNumber.length,
      code: '',
      number: '',
    };
    setPhoneNumber([...phoneNumber, obj]);
  };

  const [phoneNumber, setPhoneNumber] = useState([
    {
      id: 0,
      phone_number: '',
      country_code: '',
    },
  ]);

  useEffect(() => {
    searchAddress(searchText).then((response) => {
      setLocationData(response.results);
    });
  }, [searchText]);

  useEffect(() => {
    searchCityState(searchText).then((response) => {
      setCityData(response.predictions);
    });
  }, [searchText]);

  useEffect(() => {
    const mindate = new Date();
    const maxdate = new Date();
    mindate.setFullYear(mindate.getFullYear() - 13);
    maxdate.setFullYear(maxdate.getFullYear() - 123);
    // setDateValue(mindate);
    setMinDateValue(mindate);
    setMaxDateValue(maxdate);
  }, []);

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = authContext.entity;
    };
    getAuthEntity();
  }, []);

  useEffect(() => {
    if (isFocused) {
      if (route?.params?.city) {
        setCity(route?.params?.city);
        setState(route?.params?.state);
        setCountry(route?.params?.country);
      } else {
        setCity('');
        setState('');
        setCountry('');
      }
    }
  }, [isFocused]);

  const validation = useCallback(() => {
    if (
      !city?.length ||
      !state?.length ||
      !country?.length ||
      !postalCode?.length ||
      !location?.length
    ) {
      showAlert(strings.addressValidation);
      return false;
    }
    return true;
  }, [city, country, location, postalCode, state]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => pressedNext()}>
          {strings.next}
        </Text>
      ),
    });
  }, [
    navigation,
    gender,
    location,
    city,
    state,
    country,
    postalCode,
    birthday,
  ]);

  const pressedNext = () => {
    if (validation()) {
      const membersAuthority = {
        ...memberInfo,
        ...route.params.form1,
        group_id: entity.uid,
        is_member: true,
        gender,
        street_address: location,
        city,
        state_abbr: state,
        country,
        postal_code: postalCode,
        birthday,
      };

      navigation.navigate('CreateMemberProfileClubForm3', {
        form2: membersAuthority,
      });
    }
  };

  const handleDonePress = (date) => {
    setBirthday(new Date(date).getTime());
    setShowDate(!showDate);
  };
  const handleCancelPress = () => {
    setShowDate(!showDate);
  };

  const renderPhoneNumber = ({item, index}) => (
    <TCPhoneNumber
      marginBottom={2}
      placeholder={strings.selectCode}
      value={item.country_code}
      numberValue={item.phone_number}
      onValueChange={(value) => {
        const tempCode = [...phoneNumber];
        tempCode[index].country_code = value;
        setPhoneNumber(tempCode);
        const filteredNumber = phoneNumber.filter(
          (obj) =>
            ![null, undefined, ''].includes(
              obj.phone_number && obj.country_code,
            ),
        );
        setMemberInfo({
          ...memberInfo,
          phone_numbers: filteredNumber.map(({country_code, phone_number}) => ({
            country_code,
            phone_number,
          })),
        });
      }}
      onChangeText={(text) => {
        const tempPhone = [...phoneNumber];
        tempPhone[index].phone_number = text;
        setPhoneNumber(tempPhone);
        const filteredNumber = phoneNumber.filter(
          (obj) =>
            ![null, undefined, ''].includes(
              obj.phone_number && obj.country_code,
            ),
        );
        setMemberInfo({
          ...memberInfo,
          phone_numbers: filteredNumber.map(({country_code, phone_number}) => ({
            country_code,
            phone_number,
          })),
        });
      }}
    />
  );

  const renderCityStateCountryItem = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setCity(item?.terms?.[0]?.value ?? '');
        setState(item?.terms?.[1]?.value ?? '');
        setCountry(item?.terms?.[2]?.value ?? '');
        setVisibleCityModal(false);
        setCityData([]);
        setLocationData([]);
      }}>
      <Text style={styles.cityList}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderLocationItem = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        const pCode = item.address_components.filter((obj) =>
          obj.types.some((p) => p === 'postal_code'),
        );
        setPostalCode(pCode.length && pCode[0].long_name);
        setLocation(item.formatted_address);
        setVisibleLocationModal(false);
      }}>
      <Text style={styles.cityList}>{item.formatted_address}</Text>
    </TouchableOpacity>
  );

  const heightView = () => (
    <View
      style={{
        flexDirection: 'row',
        align: 'center',
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'space-between',
      }}>
      <View style={{...styles.halfMatchFeeView, ...styles.shadowStyle}}>
        <TextInput
          placeholder={'-'}
          style={styles.halffeeText}
          keyboardType={'decimal-pad'}
          onChangeText={(text) => {
            setMemberInfo({
              ...memberInfo,
              height: {
                height: text,
                height_type: memberInfo?.height?.height_type,
              },
            });
          }}
          value={memberInfo?.height?.height}
          maxLength={3}
        />
      </View>
      <RNPickerSelect
        placeholder={{
          label: strings.heightTypeText,
          value: null,
        }}
        items={heightMesurement}
        onValueChange={(value) => {
          setMemberInfo({
            ...memberInfo,
            height: {
              height: memberInfo?.height?.height,
              height_type: value,
            },
          });
        }}
        value={memberInfo?.height?.height_type}
        useNativeAndroidPickerStyle={false}
        style={{
          inputIOS: {
            fontSize: widthPercentageToDP('3.5%'),
            paddingVertical: 12,
            paddingHorizontal: 15,
            width: widthPercentageToDP('45%'),
            color: 'black',
            paddingRight: 30,
            backgroundColor: colors.offwhite,
            borderRadius: 5,
            textAlign: 'center',
            ...styles.shadowStyle,
          },
          inputAndroid: {
            fontSize: widthPercentageToDP('4%'),
            paddingVertical: 12,
            paddingHorizontal: 15,
            width: widthPercentageToDP('45%'),
            color: 'black',
            paddingRight: 30,
            backgroundColor: colors.offwhite,
            borderRadius: 5,
            textAlign: 'center',
            ...styles.shadowStyle,
          },
        }}
        Icon={() => (
          <Image source={images.dropDownArrow} style={styles.miniDownArrow} />
        )}
      />
    </View>
  );

  const weightView = () => (
    <View
      style={{
        flexDirection: 'row',
        align: 'center',
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'space-between',
      }}>
      <View style={{...styles.halfMatchFeeView, ...styles.shadowStyle}}>
        <TextInput
          placeholder={'-'}
          style={styles.halffeeText}
          keyboardType={'decimal-pad'}
          onChangeText={(text) => {
            setMemberInfo({
              ...memberInfo,
              weight: {
                weight: text,
                weight_type: memberInfo?.weight?.weight_type,
              },
            });
          }}
          maxLength={3}
          value={memberInfo?.weight?.weight}
        />
      </View>
      <RNPickerSelect
        placeholder={{
          label: strings.weightTypeText,
          value: null,
        }}
        items={weightMesurement}
        onValueChange={(value) => {
          setMemberInfo({
            ...memberInfo,
            weight: {
              weight: memberInfo?.weight?.weight,
              weight_type: value,
            },
          });
        }}
        value={memberInfo?.weight?.weight_type}
        useNativeAndroidPickerStyle={false}
        style={{
          inputIOS: {
            fontSize: widthPercentageToDP('3.5%'),
            paddingVertical: 12,
            paddingHorizontal: 15,
            width: widthPercentageToDP('45%'),
            color: 'black',
            paddingRight: 30,
            backgroundColor: colors.offwhite,
            borderRadius: 5,
            textAlign: 'center',
            ...styles.shadowStyle,
          },
          inputAndroid: {
            fontSize: widthPercentageToDP('4%'),
            paddingVertical: 12,
            paddingHorizontal: 15,
            width: widthPercentageToDP('45%'),
            color: 'black',
            paddingRight: 30,
            backgroundColor: colors.offwhite,
            borderRadius: 5,
            textAlign: 'center',
            ...styles.shadowStyle,
          },
        }}
        Icon={() => (
          <Image source={images.dropDownArrow} style={styles.miniDownArrow} />
        )}
      />
    </View>
  );

  const locationString = () => {
    let str = '';
    if (city) {
      str += `${city}, `;
    }
    if (state) {
      str += `${state}, `;
    }
    if (country) {
      str += `${country}, `;
    }
    return str;
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <TCFormProgress totalSteps={3} curruentStep={2} />

      <View>
        <TCLabel
          title={strings.gender.toUpperCase()}
          style={{marginBottom: 12}}
        />
        <TCPicker
          dataSource={DataSource.Gender}
          placeholder={strings.selectGenderPlaceholder}
          value={gender}
          onValueChange={(value) => {
            setGender(value);
          }}
        />
      </View>
      <View>
        <TCLabel
          title={strings.birthDatePlaceholder.toUpperCase()}
          style={{marginBottom: 12}}
        />

        <TCTouchableLabel
          title={
            birthday &&
            `${`${monthNames[new Date(birthday).getMonth()]} ${new Date(
              birthday,
            ).getDate()}`}, ${new Date(birthday).getFullYear()}`
          }
          placeholder={strings.birthDatePlaceholder}
          onPress={() => setShowDate(!showDate)}
        />
      </View>

      <TCLabel
        title={strings.height.toUpperCase()}
        style={{marginBottom: 12}}
      />
      {heightView()}

      <TCLabel
        title={strings.weight.toUpperCase()}
        style={{marginBottom: 12}}
      />
      {weightView()}

      <View>
        <TCLabel
          title={strings.phone.toUpperCase()}
          style={{marginBottom: 12}}
        />
        <FlatList
          data={phoneNumber}
          renderItem={renderPhoneNumber}
          keyExtractor={(item, index) => index.toString()}></FlatList>
      </View>
      {phoneNumber?.length < 5 && (
        <TCMessageButton
          title={strings.addPhone}
          width={100}
          borderColor={colors.whiteColor}
          color={colors.lightBlackColor}
          alignSelf="center"
          marginTop={15}
          onPress={() => addPhoneNumber()}
        />
      )}

      <LocationView
        onPressVisibleLocationPopup={() => setVisibleLocationModal(true)}
        onChangeLocationText={(text) => setLocation(text)}
        locationText={location}
        onChangePostalCodeText={(text) => setPostalCode(text)}
        postalCodeText={postalCode}
        locationString={locationString()}
        onPressCityPopup={() => setVisibleCityModal(true)}
      />
      {showDate && (
        <View>
          <DateTimePickerView
            visible={showDate}
            date={birthday}
            onDone={handleDonePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            minimumDate={maxDateValue}
            maximumDate={minDateValue}
            mode={'date'}
          />
        </View>
      )}
      <Modal
        isVisible={visibleLocationModal}
        onBackdropPress={() => {
          setVisibleLocationModal(false);
          setCityData([]);
          setLocationData([]);
        }}
        onRequestClose={() => {
          setVisibleLocationModal(false);
          setCityData([]);
          setLocationData([]);
        }}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.15,
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
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => {
                setVisibleLocationModal(false);
                setCityData([]);
                setLocationData([]);
              }}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              {strings.locationTitleText}
            </Text>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <View>
            <View style={styles.sectionStyle}>
              <Image source={images.searchLocation} style={styles.searchImg} />
              <TextInput
                testID="choose-location-input"
                style={styles.textInput}
                placeholder={strings.addressSearchPlaceHolder}
                clearButtonMode="always"
                placeholderTextColor={colors.grayColor}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>
            {locationData.length > 0 && (
              <FlatList
                data={locationData}
                renderItem={renderLocationItem}
                keyExtractor={(item, index) => index.toString()}
                onScroll={Keyboard.dismiss}
              />
            )}
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={visibleCityModal}
        onBackdropPress={() => {
          setVisibleCityModal(false);
          setCityData([]);
          setLocationData([]);
        }}
        onRequestClose={() => {
          setVisibleCityModal(false);
          setCityData([]);
          setLocationData([]);
        }}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.15,
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
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => {
                setVisibleCityModal(false);
                setCityData([]);
                setLocationData([]);
              }}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              {strings.locationTitleText}
            </Text>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <View>
            <View style={styles.sectionStyle}>
              <Image source={images.searchLocation} style={styles.searchImg} />
              <TextInput
                testID="choose-location-input"
                style={styles.textInput}
                placeholder={strings.locationPlaceholderText}
                clearButtonMode="always"
                placeholderTextColor={colors.grayColor}
                onChangeText={(text) => setSearchText(text)}
                autoCorrect={false}
              />
            </View>
            <FlatList
              data={(cityData || []).filter((obj) => obj.terms.length === 3)}
              renderItem={renderCityStateCountryItem}
              keyExtractor={(item, index) => index.toString()}
              onScroll={Keyboard.dismiss}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 50,
  },

  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    width: widthPercentageToDP('100%'),
  },

  searchImg: {
    alignSelf: 'center',
    height: heightPercentageToDP('4%'),

    resizeMode: 'contain',
    width: widthPercentageToDP('4%'),
    tintColor: colors.lightBlackColor,
  },
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 25,

    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    margin: widthPercentageToDP('8%'),
    paddingLeft: 17,
    paddingRight: 5,

    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: widthPercentageToDP('4.5%'),
    paddingLeft: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: widthPercentageToDP('10%'),
    width: widthPercentageToDP('80%'),
  },
  cityList: {
    color: colors.lightBlackColor,
    fontSize: widthPercentageToDP('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    // paddingLeft: wp('1%'),
    width: widthPercentageToDP('70%'),
    margin: widthPercentageToDP('4%'),
    textAlignVertical: 'center',
  },

  miniDownArrow: {
    alignSelf: 'center',
    height: 12,
    resizeMode: 'contain',

    right: 15,
    tintColor: colors.grayColor,

    top: 15,
    width: 12,
  },
  halfMatchFeeView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    flexDirection: 'row',
    fontSize: widthPercentageToDP('3.5%'),
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    width: widthPercentageToDP('46%'),
  },
  halffeeText: {
    alignSelf: 'center',
    fontSize: widthPercentageToDP('3.8%'),
    width: '90%',
    textAlign: 'center',
  },

  shadowStyle: {
    elevation: 3,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.16,
    shadowRadius: 1,
  },
});
