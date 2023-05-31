// @flow

import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TextInput, Pressable} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import AddressWithMapModal from '../../../../components/AddressWithMap/AddressWithMapModal';
import EventMapView from '../../../../components/Schedule/EventMapView';
import TCTextField from '../../../../components/TCTextField';
import colors from '../../../../Constants/Colors';
import {
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from '../../../../Constants/GeneralConstants';

const EditHomeFacilityScreen = ({place = '', setData = () => {}}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [mapcoordinate, setMapCoordinate] = useState({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [placeName, setPlaceName] = useState('');
  const [HomePlace, setHomePlace] = useState({
    country: '',
    address: {},
    coordinate: {},
    city: '',
    name: '',
    details: '',
    state: '',
    region: {},
  });

  const [openMap, setOpenMap] = useState(false);

  useEffect(() => {
    setHomePlace({
      address: place.address,
      country: place.country,
      city: place.city,
      state: place.state,
    });
    setPlaceName(place.name);
    setMapRegion(place.region);
    setMapCoordinate(place.coordinate);
  }, [place]);

  return (
    <View style={styles.parent}>
      <View
        style={{
          marginBottom: 15,
        }}>
        <TextInput
          placeholder={strings.venueNamePlaceholder}
          style={[styles.greyContainer, {height: 40}]}
          onChangeText={(text) => {
            setData({
              homePlace: {
                ...HomePlace,
                name: text,
              },
            });
          }}
          onFocus={() => {}}
          value={placeName}
        />
      </View>

      <Pressable onPress={() => setShowLocationModal(true)} style={{}}>
        <TCTextField
          value={HomePlace.address}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={strings.streetAddress}
          placeholderTextColor={colors.userPostTimeColor}
          pointerEvents="none"
          editable={false}
          borderRadius={5}
          backgroundColor={colors.lightGrey}
          style={{
            marginTop: 5,
            marginBottom: 27,
          }}
        />
      </Pressable>

      <View
        style={{
          marginTop: 10,
        }}>
        {HomePlace.address && (
          <EventMapView
            onPress={() => {
              setOpenMap(true);
              setShowLocationModal(true);
              console.log(showLocationModal);
            }}
            coordinate={mapcoordinate}
            region={mapRegion}
            style={{
              zIndex: 10,
              alignSelf: 'center',
              height: 345,
            }}
          />
        )}
      </View>

      <AddressWithMapModal
        visibleLocationModal={showLocationModal}
        setVisibleAddressModalhandler={() => setShowLocationModal(false)}
        onAddressSelect={(location) => {
          setMapCoordinate(location.coordinate);
          setMapRegion(location.region);
          HomePlace.address = location.addressforMap;
          HomePlace.city = location.city;
          HomePlace.country = location.country;
          HomePlace.coordinate = location.coordinate;
          HomePlace.region = location.region;
          HomePlace.name = placeName;
          setData({homePlace: HomePlace});
        }}
        existedregion={mapRegion}
        existedcoordinates={mapcoordinate}
        openMap={openMap}
        mapAddress={HomePlace.address}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingVertical: 20,
  },
  greyContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 15,

    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
  },
});
export default EditHomeFacilityScreen;
