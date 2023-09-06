import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Keyboard,
  Alert,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import locationModalStyles from '../../Constants/LocationModalStyle';
import {searchAddressPredictions} from '../../api/External';

import {strings} from '../../../Localization/translation';
import {getHitSlop} from '../../utils';
import images from '../../Constants/ImagePath';
import LocationView from '../LocationView';
import LocationModal from '../LocationModal/LocationModal';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {getPlaceNameFromPlaceID} from '../../utils/location';
import ActivityLoader from '../loader/ActivityLoader';

const AddressLocationModal = ({
  visibleLocationModal,
  setVisibleAddressModalhandler,
  onAddressSelect,
  handleSetLocationOptions,
  onDonePress,
}) => {
  const [addressManual, setAddressManual] = useState(false);
  const [location, setLocation] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [country, setCountry] = useState();
  const [searchText, setSearchText] = useState('');
  const [visibleCityModal, setVisibleCityModal] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [postalCode, setPostalCode] = useState();
  const [loading, setLoading] = useState(false);

  const handleVisibleAddressModal = () => {
    setVisibleAddressModalhandler();
  };

  const addressManualString = () =>
    [city, state, country].filter((w) => w).join(', ');

  const onSelectAddressHandler = async (item) => {
    setLoading(true);
    getPlaceNameFromPlaceID(item.place_id).then((_location) => {
      setLoading(false);
      if (_location) {
        onAddressSelect(_location);
      }
      setVisibleAddressModalhandler();
      setSearchText('');
    });
  };

  const renderAdressItem = ({item}) => (
    <Pressable onPress={() => onSelectAddressHandler(item)}>
      <View style={locationModalStyles.listItem}>
        <Text style={locationModalStyles.cityText}>{item.description}</Text>
      </View>
      <View style={locationModalStyles.itemSeprater} />
    </Pressable>
  );

  const setHandleSetLocationOptions = (locations) => {
    setCity(locations.city);
    setState(locations.state);
    setCountry(locations.country);
    onAddressSelect(locations);
    handleSetLocationOptions(locations, postalCode);
  };

  useEffect(() => {
    if (searchText.length >= 3) {
      if (visibleLocationModal) {
        searchAddressPredictions(searchText)
          .then((response) => {
            console.log('search address:=>', response);
            setLocationData(response.predictions);
          })
          .catch((e) => {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      } else {
        console.log('error');
      }
    } else {
      setLocationData([]);
    }
  }, [searchText]);

  const validator = () => {
    if (postalCode === '' || location === '') {
      Alert.alert(strings.fillAllFields);
    } else {
      onDonePress(location, postalCode);
      setVisibleAddressModalhandler(false);
      setAddressManual(false);
    }
  };

  return (
    <View>
      <ActivityLoader visible={loading} />
      <Modal
        isVisible={visibleLocationModal}
        onBackdropPress={() => handleVisibleAddressModal()}
        onRequestClose={() => handleVisibleAddressModal()}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          behavior="height"
          enabled={false}
          style={locationModalStyles.mainView}>
          {!addressManual ? (
            <View
              style={[
                locationModalStyles.headerView,
                {justifyContent: 'center'},
              ]}>
              <Text
                style={[
                  locationModalStyles.headerText,
                  {
                    textAlign: 'center',
                    paddingBottom: 8,
                  },
                ]}>
                {strings.address}
              </Text>
              <View
                style={{
                  paddingTop: 20,
                  height: '100%',
                  position: 'absolute',
                  right: 21,
                }}>
                <TouchableOpacity
                  hitSlop={getHitSlop(15)}
                  style={locationModalStyles.closeButton}
                  onPress={() => {
                    setVisibleAddressModalhandler(false);
                    setAddressManual(false);
                  }}>
                  <Image
                    source={images.cancelImage}
                    style={[
                      locationModalStyles.closeButton,
                      {marginLeft: 0, marginRight: 0},
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={locationModalStyles.headerView}>
              {/* for Manual Addresses */}
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                onPress={() => {
                  setAddressManual(false);
                }}>
                <Image
                  source={images.nextArrow}
                  style={{
                    height: 22,
                    width: 20,
                    marginTop: 7,
                    resizeMode: 'contain',
                    tintColor: colors.blackColor,
                    transform: [{rotate: '180deg'}],
                  }}
                />
              </TouchableOpacity>
              <Text
                style={[
                  locationModalStyles.headerText,
                  {
                    textAlign: 'center',
                    paddingBottom: 8,
                    alignSelf: 'center',
                    marginLeft: 30,
                  },
                ]}>
                {strings.address}
              </Text>
              <View style={{paddingTop: 20, height: '100%'}}>
                <TouchableOpacity
                  hitSlop={getHitSlop(15)}
                  onPress={() => {
                    validator();
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.RMedium,
                      fontSize: 15,
                    }}>
                    {strings.done}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={locationModalStyles.separatorLine} />
          {!addressManual ? (
            <View>
              <View style={styles.floatingInput}>
                <View style={styles.inputContainer}>
                  <TextInput
                    testID="choose-location-input"
                    style={locationModalStyles.searchTextInput}
                    placeholder={strings.searchForAddress}
                    value={searchText}
                    placeholderTextColor={colors.userPostTimeColor}
                    onChangeText={(text) => setSearchText(text)}
                  />
                  {searchText.length > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        setSearchText('');
                      }}>
                      <Image
                        source={images.closeRound}
                        style={{height: 15, width: 15}}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {searchText.length < 3 && (
                <Text style={locationModalStyles.noDataText}>
                  {strings.enter3CharText}
                </Text>
              )}

              {searchText.length < 3 && (
                <Pressable
                  onPress={() => {
                    setAddressManual(!addressManual);
                    // set previous address to null if  required
                    setCity('');
                    setCountry('');
                    setPostalCode('');
                    setLocation('');
                    setState('');
                  }}
                  style={{
                    marginLeft: 30,
                    marginTop: 25,
                  }}>
                  <Text
                    style={{
                      textDecorationLine: 'underline',
                      lineHeight: 24,
                      fontFamily: fonts.RRegular,
                      fontSize: 16,
                      color: colors.lightBlackColor,
                    }}>
                    {strings.filladdressmanually}
                  </Text>
                </Pressable>
              )}

              {locationData.length > 0 && (
                <FlatList
                  style={{marginTop: 10}}
                  data={locationData}
                  renderItem={renderAdressItem}
                  keyExtractor={(item, index) => index.toString()}
                  onScroll={Keyboard.dismiss}
                />
              )}
            </View>
          ) : (
            <View
              style={{
                width: '100%',
                position: 'absolute',
                top: 76,
              }}>
              <LocationView
                onChangeLocationText={(text) => setLocation(text)}
                locationText={location}
                onChangePostalCodeText={(text) => setPostalCode(text)}
                postalCodeText={postalCode}
                locationString={addressManualString()}
                onPressCityPopup={() => setVisibleCityModal(true)}
              />
            </View>
          )}
        </View>

        <LocationModal
          visibleLocationModal={visibleCityModal}
          setVisibleLocationModalhandler={() => setVisibleCityModal(false)}
          title={strings.cityStateCountryTitle}
          onLocationSelect={(locations) =>
            setHandleSetLocationOptions(locations)
          }
          placeholder={strings.cityStateCountry}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: colors.inputBgOpacityColor,
    height: 45,
  },
  floatingInput: {
    alignSelf: 'center',
    zIndex: 1,
    width: '90%',
    marginTop: 20,
  },
});

export default AddressLocationModal;
