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
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import React, {useState, useEffect, useContext, useRef} from 'react';
import Modal from 'react-native-modal';
import locationModalStyles from '../../Constants/LocationModalStyle';
import {
  getLatLong,
  searchAddress,
  searchAddressPredictions,
} from '../../api/External';
import {getPlaceNameFromPlaceID} from '../../utils/location';

import {strings} from '../../../Localization/translation';
import {getHitSlop} from '../../utils';
import images from '../../Constants/ImagePath';
import LocationView from '../LocationView';
import LocationModal from '../LocationModal/LocationModal';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

import ActivityLoader from '../loader/ActivityLoader';
import AuthContext from '../../auth/context';
import {
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from '../../Constants/GeneralConstants';

const AddressWithMapModal = ({
  visibleLocationModal,
  setVisibleAddressModalhandler,
  onAddressSelect,

  onDonePress,
  existedregion = {
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  },
  existedcoordinates = {
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  },
  openMap = false,
  mapAddress = '',
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
  const authContext = useContext(AuthContext);
  const handleVisibleAddressModal = () => {
    setVisibleAddressModalhandler();
  };
  const [addressforMap, setAddressForMap] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [coordinate, setCoordinates] = useState({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [region, setRegion] = useState({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const mapRef = useRef(null);

  const addressManualString = () =>
    [city, state, country].filter((w) => w).join(', ');

  const getLatLongData = (addressDescription) => {
    setLoading(true);
    getLatLong(addressDescription, authContext)
      .then((response) => {
        setLoading(false);

        const coordinates = {
          latitude: response.results[0].geometry.location.lat,
          longitude: response.results[0].geometry.location.lng,
        };

        const mapregion = {
          latitude: response.results[0].geometry.location.lat,
          longitude: response.results[0].geometry.location.lng,
          latitudeDelta: 0.0043,
          longitudeDelta: 0.0034,
        };
        setCoordinates(coordinates);
        setRegion(mapregion);
        const address = addressDescription;
        setAddressManual(true);
        setShowMap(true);
        setAddressForMap(address);
        setSearchText('');
        // handleVisibleAddressModal();

        onAddressSelect({coordinate, region, address, city, state, country});
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(e.message);
      });
  };

  const getLocationDetail = (item) => {
    getPlaceNameFromPlaceID(item.place_id)
      .then((response) => {
        setCity(response.city);
        setCountry(response.country);
        setState(response.state);
        //  handleVisibleAddressModal();
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(e.message);
      });
  };

  const onSelectAddressHandler = async (item) => {
    getLocationDetail(item);

    getLatLongData(item.description);
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
    // handleSetLocationOptions(locations, postalCode);
  };

  useEffect(() => {
    if (searchText.length >= 3) {
      if (visibleLocationModal) {
        searchAddressPredictions(searchText)
          .then((response) => {
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
  }, [searchText, visibleLocationModal]);

  const validator = () => {
    if (postalCode === '' || location === '') {
      Alert.alert(strings.fillAllFields);
    } else {
      setLoading(true);
      searchAddress(location)
        .then((response) => {
          setLoading(false);

          const coordinates = {
            latitude: response.results[0].geometry.location.lat,
            longitude: response.results[0].geometry.location.lng,
          };
          setCoordinates(coordinates);

          const mapregion = {
            latitude: response.results[0].geometry.location.lat,
            longitude: response.results[0].geometry.location.lng,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05,
          };
          setRegion(mapregion);
          const address = `${location} ${city} ${postalCode}`;
          setAddressManual(true);
          setShowMap(true);
          setAddressForMap(address);
          setSearchText('');
          onDonePress(location, postalCode);
          onAddressSelect({coordinate, region, address, city, state, country});
        })
        .catch((e) => {
          console.log(e);
        });
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
        onModalWillShow={() => {
          setShowMap(openMap);
          setAddressForMap(mapAddress);
          setAddressManual(openMap);
          setRegion(existedregion);
          setCoordinates(existedcoordinates);
        }}
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
                  if (addressManual) {
                    if (showMap) {
                      setShowMap(false);
                    } else {
                      setAddressManual(false);
                    }
                  }
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
                {showMap ? strings.chooseLocationOnMap : strings.address}
              </Text>
              <View style={{paddingTop: 20, height: '100%'}}>
                <TouchableOpacity
                  hitSlop={getHitSlop(15)}
                  onPress={() => {
                    if (showMap) {
                      setVisibleAddressModalhandler();

                      onAddressSelect({coordinate, region, addressforMap});
                      setAddressManual(false);
                      setShowMap(false);
                    } else {
                      validator();
                    }
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
              <View style={locationModalStyles.searchSectionStyle}>
                <TextInput
                  testID="choose-location-input"
                  style={locationModalStyles.searchTextInput}
                  placeholder={strings.searchForAddress}
                  clearButtonMode="always"
                  placeholderTextColor={colors.userPostTimeColor}
                  onChangeText={(text) => setSearchText(text)}
                />
              </View>

              {searchText.length < 3 && (
                <Text style={locationModalStyles.noDataText}>
                  {strings.enter3CharText}
                </Text>
              )}

              {searchText.length < 3 && (
                <Pressable
                  onPress={() => {
                    setShowMap(false);
                    setAddressManual(!addressManual);

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
            <>
              {showMap ? (
                <>
                  <Text
                    style={{
                      lineHeight: 30,
                      fontFamily: fonts.RBold,
                      fontSize: 20,
                      marginHorizontal: 15,
                      marginTop: 13,
                    }}>
                    {strings.adjustLocationOnMap}
                  </Text>

                  <Text
                    style={{
                      marginTop: 10,
                      paddingHorizontal: 15,
                      fontSize: 16,
                      fontFamily: fonts.RRegular,
                      lineHeight: 24,
                    }}>
                    {addressforMap}
                  </Text>

                  <View style={{flex: 1}}>
                    <MapView
                      ref={mapRef}
                      style={{flex: 1, marginTop: 15}}
                      initialRegion={region}
                      onRegionChange={(points) => {
                        setRegion({
                          latitude: points.latitude,
                          longitude: points.longitude,
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                        });
                        setCoordinates({
                          latitude: points.latitude,
                          longitude: points.longitude,
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                        });
                      }}>
                      <Marker coordinate={coordinate} />
                    </MapView>
                    <Image
                      source={images.plusInvoice}
                      style={{
                        width: 24,
                        height: 30,
                        zIndex: 3,
                        position: 'absolute',

                        left: '43%',
                        top: '45%',
                      }}
                    />
                  </View>
                </>
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
            </>
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

export default AddressWithMapModal;
