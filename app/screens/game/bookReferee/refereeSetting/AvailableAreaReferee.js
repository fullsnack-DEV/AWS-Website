/* eslint-disable guard-for-in */
/* eslint-disable array-callback-return */
import React, {
 useState, useLayoutEffect, useCallback, useContext,
 } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import AuthContext from '../../../../auth/context';

import ActivityLoader from '../../../../components/loader/ActivityLoader';

import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCKeyboardView from '../../../../components/TCKeyboardView';

import images from '../../../../Constants/ImagePath';
import { widthPercentageToDP } from '../../../../utils';
import TCThinDivider from '../../../../components/TCThinDivider';
import LocationSearchModal from '../../../../components/Home/LocationSearchModal';
import * as Utility from '../../../../utils';
import { patchPlayer } from '../../../../api/Users';
// const entity = {};
export default function AvailableAreaReferee({ navigation, route }) {
  const { comeFrom, sportName } = route?.params;

  // const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  // const [selectedAddressIndex, setSelectedAddressIndex] = useState();

  console.log(
    'route?.params?.settingObj?.available_area?.address',
    route?.params?.settingObj?.available_area?.address,
  );
  const [loading, setloading] = useState(false);
  const [areaRadio, setAreaRadio] = useState(
    route?.params?.settingObj?.available_area?.is_specific_address ? 0 : 1,
  );
  const [addressType, setAddressType] = useState();
  const [searchAddress, setSearchAddress] = useState(
    route?.params?.settingObj?.available_area,
  );
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addressListIndex, setAddressListIndex] = useState();

  const [distancePopup, setDistancePopup] = useState(false);
  const [selectedDistanceOption, setSelectedDistanceOption] = useState(
    route?.params?.settingObj?.available_area?.distance_type
      && route?.params?.settingObj?.available_area?.distance_type === 'Mi'
      ? 0
      : 1,
  );

  const [radious, setRadious] = useState(
    route?.params?.settingObj?.available_area?.radious
      && `${route?.params?.settingObj?.available_area?.radious}`,
  );
  const [addressList, setAddressList] = useState(
    route?.params?.settingObj?.available_area?.address_list
      ? route?.params?.settingObj?.available_area?.address_list
      : [
          {
            id: 0,
            address: '',
          },
        ],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => {
            console.log('searchAddress::', searchAddress?.address);
            console.log(
              'searchAddress?.description::',
              searchAddress?.description,
            );

            console.log(
              '!route?.params?.settingObj?.available_area?.address::',
              !route?.params?.settingObj?.available_area?.address,
            );

            if (areaRadio === 0) {
              const addresses = addressList.filter(
                (obj) => obj?.address === '',
              );

              if (addresses.length > 0) {
                Alert.alert('Please fill all address fields.');
              } else {
                onSavePressed();
              }
            } else if (selectedDistanceOption === undefined) {
              Alert.alert('Please selected type of distance.');
            } else if (
              searchAddress?.address === ''
              || searchAddress?.description === ''
            ) {
              Alert.alert('Please selected address for calculate range.');
            } else if (!radious) {
              Alert.alert('Please selected radious for calculate range.');
            } else {
              onSavePressed();
            }
          }}>
          Save
        </Text>
      ),
    });
  }, [
    navigation,
    areaRadio,
    selectedDistanceOption,
    searchAddress,
    radious,
    addressList,
    route?.params?.settingObj?.available_area?.address,
  ]);

  const onSavePressed = () => {
    let availableArea = {};
    if (areaRadio === 0) {
      const list = addressList.map((v) => {
        const o = v;
        delete o.id;
        return o;
      });

      console.log('list', list);

      availableArea = {
        is_specific_address: areaRadio === 0,
        address_list: list,
      };
    }
    if (areaRadio === 1) {
      availableArea = {
        is_specific_address: areaRadio === 0,
        radious: Number(radious),
        distance_type: selectedDistanceOption === 0 ? 'Mi' : 'Km',
        address:
          searchAddress?.description
          ?? searchAddress?.address
          ?? route?.params?.settingObj?.available_area?.address,
        latlong: {
          latitude:
            searchAddress.latitude
            ?? searchAddress?.latlong?.latitude
            ?? route?.params?.settingObj?.available_area?.latlong?.latitude,
          longitude:
            searchAddress.longitude
            ?? searchAddress?.latlong?.longitude
            ?? route?.params?.settingObj?.available_area?.latlong?.longitude,
        },
      };
    }

    console.log('availableArea', availableArea);
    const bodyParams = {};
    bodyParams.available_area = availableArea;
    bodyParams.sport = sportName;
    bodyParams.entity_type = 'referee';
    setloading(true);
    const registerdRefereeData = authContext?.user?.referee_data?.filter(
      (obj) => obj.sport_name !== sportName,
    );

    const selectedSport = authContext?.user?.referee_data?.filter(
      (obj) => obj.sport_name === sportName,
    )[0];

    selectedSport.setting = { ...selectedSport?.setting, ...bodyParams };
    registerdRefereeData.push(selectedSport);

    const body = { ...authContext?.user, referee_data: registerdRefereeData };
    console.log('Body::::--->', body);

    patchPlayer(body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          const entity = authContext.entity;
          console.log('Register referee response IS:: ', response.payload);
          entity.auth.user = response.payload;
          entity.obj = response.payload;
          authContext.setEntity({ ...entity });
          authContext.setUser(response.payload);
          await Utility.setStorage('authContextUser', response.payload);
          await Utility.setStorage('authContextEntity', { ...entity });
          navigation.navigate(comeFrom, {
            settingObj: response.payload.referee_data.filter(
              (obj) => obj.sport_name === sportName,
            )[0].setting,
          });
        } else {
          Alert.alert('Towns Cup', response.messages);
        }
        console.log('RESPONSE IS:: ', response);
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const addAddress = () => {
    if (addressList.length < 10) {
      const obj = {
        id: addressList.length === 0 ? 0 : addressList.length,
        address: '',
      };
      setAddressList([...addressList, obj]);
    } else {
      Alert.alert(strings.titleBasic, strings.maxPeriod);
    }
  };

  const renderAddress = useCallback(
    ({ index }) => (
      <View>
        <View style={styles.viewTitleContainer}>
          {index !== 0 && (
            <Text
              style={styles.deleteButton}
              onPress={() => {
                addressList.splice(index, 1);
                setAddressList([...addressList]);
              }}>
              Delete
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.detailsSingleContainer}
          onPress={() => {
            setAddressModalVisible(true);
            setAddressType('short');
            setAddressListIndex(index);
          }}>
          <TextInput
            editable={false}
            pointerEvents="none"
            style={styles.detailsSingleText}
            placeholder={strings.searchCityStatePlaceholder}
            value={addressList[index].address}
          />
        </TouchableOpacity>
      </View>
    ),
    [addressList],
  );

  const onCloseLocationModal = () => {
    setAddressModalVisible(false);
  };

  return (
    <TCKeyboardView>
      <SafeAreaView>
        <ActivityLoader visible={loading} />

        <View>
          <TouchableOpacity
            style={[
              styles.checkBoxContainer,
              {
                marginTop: 10,
              },
            ]}
            onPress={() => {
              setAreaRadio(0);
              setAddressType('short');
            }}>
            <Text style={[styles.radioTitleText, { flex: 0.9 }]}>
              {strings.addAreaText}
            </Text>
            <View style={{ flex: 0.1 }}>
              {areaRadio === 0 ? (
                <Image
                  source={images.radioCheckYellow}
                  style={styles.checkboxImg}
                />
              ) : (
                <Image
                  source={images.radioUnselect}
                  style={styles.checkboxImg}
                />
              )}
            </View>
          </TouchableOpacity>

          <View pointerEvents={areaRadio === 0 ? 'auto' : 'none'}>
            <FlatList
              data={addressList}
              renderItem={renderAddress}
              keyExtractor={(item, index) => index.toString()}
              style={{ marginBottom: 10 }}
            />

            <TouchableOpacity
              style={styles.buttonView}
              onPress={() => addAddress()}>
              <Text style={styles.textStyle} numberOfLines={1}>
                {'+ Add Area'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.checkBoxContainer,
              {
                marginTop: 10,
              },
            ]}
            onPress={() => {
              setAreaRadio(1);
              setAddressType('long');
            }}>
            <Text style={[styles.radioTitleText, { flex: 0.9 }]}>
              {strings.setRangeText}
            </Text>
            <View style={{ flex: 0.1 }}>
              {areaRadio === 1 ? (
                <Image
                  source={images.radioCheckYellow}
                  style={styles.checkboxImg}
                />
              ) : (
                <Image
                  source={images.radioUnselect}
                  style={styles.checkboxImg}
                />
              )}
            </View>
          </TouchableOpacity>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', margin: 15 }}
            pointerEvents={areaRadio === 1 ? 'auto' : 'none'}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.lightBlackColor,
              }}>
              Within
            </Text>
            <View style={styles.textInputContainer}>
              <TextInput
                placeholder={'Number'}
                keyboardType="numeric"
                style={styles.textInput}
                onChangeText={(text) => {
                  setRadious(text);
                }}
                value={radious}
              />
            </View>
            <TouchableOpacity
              style={styles.textRightInputContainer}
              onPress={() => {
                setDistancePopup(true);
              }}>
              <Text>{selectedDistanceOption === 0 ? 'Mi' : 'Km'}</Text>
              <Image
                source={images.dropDownArrow}
                style={styles.miniDownArrow}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              margin: 15,
              marginTop: 0,
            }}
            pointerEvents={areaRadio === 1 ? 'auto' : 'none'}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.lightBlackColor,
              }}>
              of
            </Text>

            <TouchableOpacity
              style={styles.searchContainer}
              onPress={() => {
                setAddressModalVisible(true);
                setAddressType('long');
              }}>
              <TextInput
                editable={false}
                pointerEvents="none"
                style={styles.detailsSingleText}
                placeholder={'Address'}
                value={
                  searchAddress?.description
                  ?? searchAddress?.address
                  ?? route?.params?.settingObj?.available_area?.address
                }
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Distance modal modal */}
        <Modal
          onBackdropPress={() => setDistancePopup(false)}
          backdropOpacity={0.2}
          animationType="slide"
          hasBackdrop
          style={{
            margin: 0,
            backgroundColor: colors.whiteOpacityColor,
          }}
          visible={distancePopup}>
          <View style={styles.bottomPopupContainer}>
            <View style={styles.viewsContainer}>
              <Text
                onPress={() => setDistancePopup(false)}
                style={styles.cancelText}>
                Cancel
              </Text>
              <Text style={styles.locationText}>Range</Text>
              <Text style={styles.cancelText}>{'       '}</Text>
            </View>
            <TCThinDivider width={'100%'} marginBottom={15} />
            <TouchableOpacity
              onPress={() => {
                setSelectedDistanceOption(0);
                setTimeout(() => {
                  setDistancePopup(false);
                }, 600);
              }}>
              {selectedDistanceOption === 0 ? (
                <LinearGradient
                  colors={[colors.yellowColor, colors.orangeGradientColor]}
                  style={styles.backgroundView}>
                  <Text
                    style={[
                      styles.curruentLocationText,
                      { color: colors.whiteColor },
                    ]}>
                    Mi
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.backgroundView}>
                  <Text style={styles.curruentLocationText}>Mi</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedDistanceOption(1);
                setTimeout(() => {
                  setDistancePopup(false);
                }, 600);
              }}>
              {selectedDistanceOption === 1 ? (
                <LinearGradient
                  colors={[colors.yellowColor, colors.orangeGradientColor]}
                  style={styles.backgroundView}>
                  <Text style={[styles.myCityText, { color: colors.whiteColor }]}>
                    Km
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.backgroundView}>
                  <Text style={styles.myCityText}>Km</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </Modal>
        {/* Distance modal */}

        {/* Address modal */}
        <LocationSearchModal
          visible={addressModalVisible}
          addressType={addressType}
          onSelect={(data) => {
            console.log('select:', data);

            if (addressType === 'short') {
              const obj = [...addressList];
              obj[addressListIndex].address = data.description;
              setAddressList(obj);

              console.log('select:', data.description);
            } else {
              setSearchAddress(data);
            }
          }}
          onClose={onCloseLocationModal}
        />
        {/* Address modal */}
      </SafeAreaView>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },

  radioTitleText: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },

  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  checkBoxContainer: {
    flex: 1,
    width: '92%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },

  detailsSingleContainer: {
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: '92%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
    marginLeft: 25,
    marginRight: 25,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContainer: {
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: '88%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
    marginLeft: 25,
    marginRight: 25,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsSingleText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontSize: 16,
    height: 40,
    fontFamily: fonts.RRegular,
  },

  buttonView: {
    width: '30%',
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    height: 25,
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
    paddingHorizontal: 5,
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textStyle: {
    alignSelf: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 12,
    textAlign: 'center',
    color: colors.lightBlackColor,
  },
  deleteButton: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.darkThemeColor,
    alignSelf: 'flex-end',
    marginRight: 15,
  },

  textInputContainer: {
    flexDirection: 'row',
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: widthPercentageToDP('35%'),
    alignItems: 'center',
    marginBottom: 2,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    paddingRight: 15,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
    marginLeft: 15,
    marginRight: 25,
    justifyContent: 'space-between',
  },
  textRightInputContainer: {
    flexDirection: 'row',
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: widthPercentageToDP('35%'),
    alignItems: 'center',

    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,

    justifyContent: 'space-between',
  },
  textInput: {
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: '76%',
    alignSelf: 'center',
    color: colors.lightBlackColor,
  },

  miniDownArrow: {
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 12,
  },

  bottomPopupContainer: {
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
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 50,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: '86%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  myCityText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  curruentLocationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },

  locationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.requestConfirmColor,
  },
  viewsContainer: {
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
});
