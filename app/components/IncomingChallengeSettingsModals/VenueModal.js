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
import EventMapView from '../Schedule/EventMapView';
import ChooseAddressModal from './ChooseAddressModal';
import styles from './ModalStyles';

const VenueModal = ({venues = [], onChange = () => {}}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedVenueIndex, setSelectedVenueIndex] = useState();
  const inputRef = useRef();

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={venues}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 30}}
        ListHeaderComponent={() => (
          <Text style={[styles.title, {marginBottom: 28}]}>
            {strings.venueInfo}
          </Text>
        )}
        renderItem={({item, index}) => (
          <View style={{marginBottom: 25}}>
            <Text style={[styles.label, {fontFamily: fonts.RBold}]}>
              {strings.venue.toUpperCase()} {index + 1}{' '}
              {index === 0 ? (
                <Text
                  style={[
                    styles.label,
                    {fontFamily: fonts.RBold, color: colors.redColor},
                  ]}>
                  *
                </Text>
              ) : null}
            </Text>

            <TextInput
              placeholder={strings.venueNamePlaceholder}
              style={[styles.greyContainer, {marginTop: 8, marginBottom: 10}]}
              onChangeText={(text) => {
                const list = [...venues];
                list[index].name = text;
                onChange(list);
              }}
              value={item.name}
            />

            <TextInput
              placeholder={strings.addressPlaceholder}
              style={[styles.greyContainer, {marginTop: 8, marginBottom: 10}]}
              onFocus={() => {
                Keyboard.dismiss();
                setSelectedVenueIndex(index);
                setShowLocationModal(true);
              }}
              value={item.address}
            />
            {item?.address ? (
              <EventMapView
                coordinate={item.coordinate}
                region={item.region}
                style={{marginBottom: 25}}
              />
            ) : null}

            <Text style={styles.inputLabel}>{strings.detailText}</Text>
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
                placeholder={strings.durationDetails}
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
      <ChooseAddressModal
        isVisible={showLocationModal}
        closeModal={() => setShowLocationModal(false)}
        onChange={(location) => {
          const list = [...venues];
          list[selectedVenueIndex] = {
            ...list[selectedVenueIndex],
            ...location,
          };

          onChange(list);
        }}
      />
    </View>
  );
};

export default VenueModal;
