/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable guard-for-in */
/* eslint-disable array-callback-return */
import React, {useState, useLayoutEffect, useCallback, useContext} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import AuthContext from '../../../../auth/context';

import ActivityLoader from '../../../../components/loader/ActivityLoader';

import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';

import TCThinDivider from '../../../../components/TCThinDivider';
import LocationSearchModal from '../../../../components/Home/LocationSearchModal';
import * as Utility from '../../../../utils';
import {patchPlayer} from '../../../../api/Users';
import Verbs from '../../../../Constants/Verbs';

export default function AvailableAreaReferee({navigation, route}) {
  const [comeFrom] = useState(route?.params?.comeFrom);
  const [sportName] = useState(route?.params?.sportName);
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [areaRadio, setAreaRadio] = useState(0);
  const [addressType, setAddressType] = useState();
  const [searchAddress, setSearchAddress] = useState(
    route?.params?.settingObj?.available_area,
  );
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addressListIndex, setAddressListIndex] = useState();

  const [distancePopup, setDistancePopup] = useState(false);
  const [selectedDistanceOption, setSelectedDistanceOption] = useState(
    route?.params?.settingObj?.available_area?.distance_type &&
      route?.params?.settingObj?.available_area?.distance_type === 'Mi'
      ? 0
      : 1,
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
            if (areaRadio === 0) {
              const addresses = addressList.filter(
                (obj) => obj?.address === '',
              );

              if (addresses.length > 0) {
                Alert.alert(strings.fillAddressFieldValidation);
              } else {
                onSavePressed();
              }
            } else if (selectedDistanceOption === undefined) {
              Alert.alert(strings.typeDistanceValidation);
            } else if (
              searchAddress?.address === '' ||
              searchAddress?.description === ''
            ) {
              Alert.alert(strings.selectAddressValidation);
            } else {
              onSavePressed();
            }
          }}>
          {strings.save}
        </Text>
      ),
    });
  }, [
    navigation,
    areaRadio,
    selectedDistanceOption,
    searchAddress,
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

      availableArea = {
        is_specific_address: areaRadio === 0,
        address_list: list,
      };
    }

    const refereeSetting = (
      authContext?.entity?.obj?.referee_data ?? []
    ).filter((obj) => obj.sport === sportName)?.[0]?.setting;

    const modifiedSetting = {
      ...refereeSetting,
      available_area: availableArea,
      sport: sportName,
      entity_type: 'referee',
    };

    setloading(true);

    const registerdRefereeData = authContext?.entity?.obj?.referee_data?.filter(
      (obj) => obj?.sport !== sportName,
    );

    let selectedSport = authContext?.entity?.obj?.referee_data?.filter(
      (obj) => obj?.sport === sportName,
    )[0];

    selectedSport = {
      ...selectedSport,
      setting: modifiedSetting,
    };
    registerdRefereeData.push(selectedSport);

    const body = {
      ...authContext?.entity?.obj,
      referee_data: registerdRefereeData,
    };

    patchPlayer(body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          const entity = authContext.entity;
          entity.auth.user = response.payload;
          entity.obj = response.payload;
          authContext.setEntity({...entity});
          authContext.setUser(response.payload);
          await Utility.setStorage('authContextUser', response.payload);
          await Utility.setStorage('authContextEntity', {...entity});
          navigation.navigate(comeFrom, {
            settingObj: response.payload.referee_data.filter(
              (obj) => obj.sport === sportName,
            )[0].setting,
          });
        } else {
          Alert.alert(strings.appName, response.messages);
        }
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
    ({index}) => (
      <View>
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
        {index !== 0 && (
          <Text
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                '',
                strings.deleteAvailableArea,
                [
                  {
                    text: strings.cancel,
                    style: Verbs.cancelVerb,
                  },
                  {
                    text: strings.delete,
                    onPress: () => {
                      const tempEmail = [...addressList];
                      tempEmail.splice(index, 1);
                      setAddressList([...tempEmail]);
                    },
                    style: 'destructive',
                  },
                ],
                {cancelable: false},
              );
            }}>
            {strings.delete}
          </Text>
        )}
      </View>
    ),
    [addressList],
  );

  const onCloseLocationModal = () => {
    setAddressModalVisible(false);
  };

  return (
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
          <Text style={[styles.radioTitleText, {flex: 0.9}]}>
            {strings.addAreaText}
          </Text>
        </TouchableOpacity>

        <View pointerEvents={areaRadio === 0 ? 'auto' : 'none'}>
          <FlatList
            data={addressList}
            renderItem={renderAddress}
            keyExtractor={(item, index) => index.toString()}
            style={{marginBottom: 10}}
          />

          <TouchableOpacity
            style={styles.buttonView}
            onPress={() => addAddress()}>
            <Text style={styles.textStyle} numberOfLines={1}>
              {strings.addArea}
            </Text>
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
              {strings.cancel}
            </Text>
            <Text style={styles.locationText}>{strings.range}</Text>
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
                    {color: colors.whiteColor},
                  ]}>
                  {strings.mi}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.curruentLocationText}>{strings.mi}</Text>
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
                <Text style={[styles.myCityText, {color: colors.whiteColor}]}>
                  {strings.km}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.myCityText}>{strings.km}</Text>
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
          if (addressType === 'short') {
            const obj = [...addressList];
            obj[addressListIndex].address = data.description;
            setAddressList(obj);
          } else {
            setSearchAddress(data);
          }
        }}
        onClose={onCloseLocationModal}
      />
    </SafeAreaView>
    // {/* Address modal */}
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
    shadowOffset: {width: 0, height: 1},
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
    justifyContent: 'center',
    flex: 1,
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 5,
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
        shadowOffset: {width: 0, height: 3},
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
    shadowOffset: {width: 0, height: 5},
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
