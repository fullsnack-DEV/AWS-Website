// @flow
import React, {useRef, useState} from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from '../../Constants/GeneralConstants';

import AddressWithMapModal from '../AddressWithMap/AddressWithMapModal';
import EventMapView from '../Schedule/EventMapView';

import styles from './ModalStyles';

const VenueModal = ({venues = [], onChange = () => {}}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedVenueIndex, setSelectedVenueIndex] = useState();
  const inputRef = useRef();
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
  const [mapAddress, setMapAddress] = useState();
  const [openMap, setOpenMap] = useState(false);

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={venues}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 30}}
        ListHeaderComponent={() => (
          <View>
            <Text
              style={[
                styles.title,
                {marginBottom: 15, fontFamily: fonts.RMedium},
              ]}>
              {strings.venueInfo}
            </Text>
          </View>
        )}
        renderItem={({item, index}) => (
          <View style={{marginBottom: 25}}>
            <Text style={[styles.label, {fontFamily: fonts.RBold}]}>
              {strings.venue.toUpperCase()} {index + 1}{' '}
              {index === 0 ? (
                <Text
                  style={[
                    styles.label,
                    {
                      fontFamily: fonts.RBold,
                      color: colors.redColor,
                    },
                  ]}>
                  *
                </Text>
              ) : null}
            </Text>

            <TextInput
              placeholder={strings.venueNamePlaceholder}
              style={[
                styles.greyContainer,
                {
                  marginBottom: 5,
                  height: 40,
                  paddingVertical: 0,
                  marginTop: 10,
                },
              ]}
              onChangeText={(text) => {
                const list = [...venues];
                list[index].name = text;
                onChange(list);
              }}
              value={item.name}
            />

            <TextInput
              placeholder={strings.addressPlaceholder}
              style={[
                styles.greyContainer,
                {marginTop: 8, marginBottom: 5, height: 40, paddingVertical: 0},
              ]}
              onFocus={() => {
                Keyboard.dismiss();
                setSelectedVenueIndex(index);
                setOpenMap(false);
                setShowLocationModal(true);
              }}
              value={item.address}
            />

            {item?.address ? (
              <TouchableOpacity
                onPress={() => {
                  setMapRegion(item.region);
                  setMapCoordinate(item.coordinate);

                  setMapAddress(item?.address);
                  setOpenMap(true);
                  setSelectedVenueIndex(index);

                  setShowLocationModal(true);
                }}>
                <EventMapView
                  coordinate={item.coordinate}
                  region={item.region}
                  style={{marginBottom: 25}}
                />
              </TouchableOpacity>
            ) : null}

            <Pressable
              style={[
                styles.inputContainer,
                {minHeight: 100, marginBottom: 10},
              ]}
              onPress={() => {
                inputRef.current?.focus();
              }}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder={strings.detailTextVenue}
                multiline
                onChangeText={(text) => {
                  const list = [...venues];
                  list[index].details = text;
                  onChange(list);
                }}
                value={item.details}
                maxLength={50}
              />
            </Pressable>
          </View>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={styles.addVenueButton}
            onPress={() => {
              onChange([
                ...venues,
                {
                  name: '',
                  address: '',
                  details: '',
                  region: {},
                  coordinate: {},
                },
              ]);
            }}>
            <Text style={styles.addVenueButtonText}>
              {strings.addVenueBtnText}
            </Text>
          </TouchableOpacity>
        )}
      />
      <AddressWithMapModal
        visibleLocationModal={showLocationModal}
        setVisibleAddressModalhandler={() => setShowLocationModal(false)}
        onAddressSelect={(location) => {
          const list = [...venues];

          list[selectedVenueIndex] = {
            ...list[selectedVenueIndex],
            ...location,
          };

          onChange(list);
        }}
        existedregion={mapRegion}
        existedcoordinates={mapcoordinate}
        openMap={openMap}
        mapAddress={mapAddress}
      />
    </View>
  );
};

export default VenueModal;
