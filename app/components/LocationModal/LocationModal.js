import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Text,
  Keyboard,
  Platform,
  Linking,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import colors from '../../Constants/Colors';
import {strings} from '../../../Localization/translation';
import {getHitSlop} from '../../utils';
import images from '../../Constants/ImagePath';
import {
  getPlaceNameFromPlaceID,
  getGeocoordinatesWithPlaceName,
} from '../../utils/location';
import ActivityLoader from '../loader/ActivityLoader';
import Verbs from '../../Constants/Verbs';
import {
  searchNearByCityState,
  searchCityState,
  searchRegion,
} from '../../api/External';
import locationModelStyles from './locationModelStyles';

function LocationModal({
  visibleLocationModal,
  setVisibleLocationModalhandler,
  title,
  onLocationSelect,
  type,
  placeholder,
}) {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [userDeniedLocPerm, setUserDeniedLocPerm] = useState(false);
  const [locationFetch, setLocationFetch] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  const [nearbyCities, setNearbyCities] = useState([]);
  const [noData, setNoData] = useState();
  const [cityData, setCityData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');

  /*  used for search functions */
  useEffect(() => {
    setSelectedItem('');
    let apiSearchtocall = '';
    apiSearchtocall = type === 'country' ? searchRegion : searchCityState;

    if (searchText.length >= 3) {
      apiSearchtocall(searchText)
        .then((response) => {
          setNoData(false);
          setCityData(response.predictions);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    } else {
      setNoData(true);
      setCityData([]);
    }
  }, [searchText]);

  /* for call from parent to call child function  */

  useEffect(() => {
    getGeoCoordinates();

    return () => {};
  }, []);

  const handleNearByCityData = (data) => {
    setNearbyCities(data);
    // SetNearbyCities(data);
  };

  const handleVisibleModal = () => {
    setVisibleLocationModalhandler();
  };

  const handleOnLocationSelect = (location) => {
    setSearchText('');

    onLocationSelect(location);

    setVisibleLocationModalhandler();
  };

  /* get place api call */

  const onSelectLocation = async (item) => {
    setLoading(true);
    getPlaceNameFromPlaceID(item.place_id).then((location) => {
      setLoading(false);
      if (location) {
        handleOnLocationSelect(location);
      }
      handleVisibleModal();
    });
  };

  const onSelectNoCurrentLocation = async () => {
    if (userDeniedLocPerm) {
      Alert.alert(
        strings.locationSettingTitleText,
        strings.locationSettingText,
        [
          {
            text: strings.cancel,
            style: 'cancel',
          },
          {
            text: strings.settingsTitleText,
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ],
      );
    } else {
      Alert.alert(strings.noGpsErrorMsg, '', [
        {
          text: strings.OkText,
          style: 'cancel',
        },
      ]);
    }
  };

  const getNearbyCityData = (lat, long, radius) => {
    searchNearByCityState(radius, lat, long)
      .then((response) => {
        const list = response.filter(
          (obj) =>
            !(
              obj.city === currentLocation?.city &&
              obj.country === currentLocation?.country
            ),
        );
        setNearbyCities(list);
        setLoading(false);
        handleVisibleModal();
      })
      .catch((e) => {
        setLoading(false);
        handleNearByCityData([]);
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            `${e.message}(getNearbyCityData),${lat},${long},${radius}`,
          );
        }, 10);
        handleVisibleModal();
      });
  };

  const getGeoCoordinates = () => {
    setLoading(true);
    setUserDeniedLocPerm(false);
    setSearchText('');
    setCityData([]);
    getGeocoordinatesWithPlaceName(Platform.OS)
      .then((location) => {
        setLocationFetch(true);
        if (location.position) {
          setCurrentLocation(location);
          getNearbyCityData(
            location.position.coords.latitude,
            location.position.coords.longitude,
            100,
          );
        } else {
          setLoading(false);
          setCurrentLocation(null);

          handleVisibleModal();
        }
      })
      .catch((e) => {
        setLoading(false);
        setLocationFetch(true);
        if (e.name === Verbs.gpsErrorDeined) {
          setCurrentLocation(null);
          setUserDeniedLocPerm(true);
        } else {
          setTimeout(() => {
            Alert.alert(
              strings.alertmessagetitle,
              `${e.message}(Location fetch`,
            );
          }, 10);
        }
        handleVisibleModal();
      });
  };

  /* Rendering the Location Item */
  const renderLocationItem = ({item}) => (
    <Pressable
      onPress={() => {
        onSelectLocation(item);
        setSelectedItem(item.description);
      }}>
      <View style={locationModelStyles.listItem}>
        <Text
          style={[
            locationModelStyles.cityText,
            {
              color:
                selectedItem === item?.description
                  ? colors.darkYellowColor
                  : colors.lightBlackColor,
            },
          ]}>
          {item.description}
        </Text>
      </View>
      <View style={locationModelStyles.itemSeprater} />
    </Pressable>
  );
  /*  Rendering the current location ITem  */

  const renderCurrentLocation = () => {
    let renderData;
    if (currentLocation && currentLocation.city) {
      renderData = (
        <Pressable
          onPress={() => {
            handleOnLocationSelect(currentLocation);
            setSelectedItem(currentLocation?.state);
          }}>
          <View style={locationModelStyles.listItemCurrentLocation}>
            <Text
              style={[
                locationModelStyles.cityText,
                {
                  color:
                    selectedItem === currentLocation.state
                      ? colors.darkYellowColor
                      : colors.lightBlackColor,
                },
              ]}>
              {[
                currentLocation?.city,
                currentLocation?.state,
                currentLocation?.country,
              ]
                .filter((v) => v)
                .join(', ')}
            </Text>
            <Text style={locationModelStyles.curruentLocationText}>
              {strings.currentLocationText}
            </Text>
          </View>
          <View style={locationModelStyles.itemSeprater} />
        </Pressable>
      );
    } else {
      renderData = <View />;
    }
    return renderData;
  };

  const renderCurrentLocationItem = ({item}) => (
    <Pressable
      onPress={() => {
        handleOnLocationSelect(item);
        setSelectedItem(item.city);
      }}>
      <View style={locationModelStyles.listItem}>
        <Text
          style={[
            locationModelStyles.cityText,
            {
              color:
                selectedItem === item.city
                  ? colors.darkYellowColor
                  : colors.lightBlackColor,
            },
          ]}>
          {[item.city, item.state, item.country].filter((v) => v).join(', ')}
        </Text>
      </View>
      <View style={locationModelStyles.itemSeprater} />
    </Pressable>
  );

  return (
    <View>
      <ActivityLoader visible={loading} />
      <Modal
        isVisible={visibleLocationModal}
        onBackdropPress={() => handleVisibleModal()}
        onRequestClose={() => handleVisibleModal()}
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
          style={locationModelStyles.mainView}>
          <View style={locationModelStyles.headerView}>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
            <Text style={locationModelStyles.headerText}>{title}</Text>
            <View style={{paddingTop: 20, height: '100%'}}>
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                style={locationModelStyles.closeButton}
                onPress={() => handleVisibleModal()}>
                <Image
                  source={images.cancelImage}
                  style={[
                    locationModelStyles.closeButton,
                    {marginLeft: 0, marginRight: 0},
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={locationModelStyles.separatorLine} />
          <View>
            <View style={locationModelStyles.searchSectionStyle}>
              <TextInput
                testID="choose-location-input"
                style={locationModelStyles.searchTextInput}
                placeholder={
                  placeholder !== ''
                    ? placeholder
                    : strings.locationPlaceholderText
                }
                clearButtonMode="always"
                placeholderTextColor={colors.userPostTimeColor}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>

            {searchText.length < 3 && (
              <Text style={locationModelStyles.noDataText}>
                {strings.enter3CharText}
              </Text>
            )}
            {noData &&
              searchText.length === 0 &&
              nearbyCities.length >= 0 &&
              cityData.length === 0 && (
                <FlatList
                  keyboardShouldPersistTaps="always"
                  style={[
                    locationModelStyles.nearbycitiesflatlist,
                    {marginTop: 25},
                  ]}
                  data={nearbyCities}
                  renderItem={renderCurrentLocationItem}
                  ListHeaderComponent={renderCurrentLocation}
                  keyExtractor={(item, index) => `${item}${index}`}
                  onScroll={Keyboard.dismiss}
                />
              )}
            {noData &&
              searchText.length === 0 &&
              locationFetch &&
              !currentLocation && (
                <Pressable onPress={() => onSelectNoCurrentLocation()}>
                  <View>
                    <Text style={locationModelStyles.currentLocationTextStyle}>
                      {strings.currentLocationText}
                    </Text>
                  </View>
                  <View style={locationModelStyles.itemSeprater} />
                  <Text
                    style={[
                      locationModelStyles.currentLocationTextStyle,
                      {marginTop: 15},
                    ]}>
                    {strings.noLocationText}
                  </Text>
                </Pressable>
              )}
            {cityData.length > 0 && (
              <FlatList
                keyboardShouldPersistTaps="always"
                style={{marginTop: 10}}
                data={cityData}
                renderItem={renderLocationItem}
                keyExtractor={(item, index) => `${item}${index}`}
                onScroll={Keyboard.dismiss}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default LocationModal;
