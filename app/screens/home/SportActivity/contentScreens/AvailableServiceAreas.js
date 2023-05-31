import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import TCLabel from '../../../../components/TCLabel';

import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';

import LocationModal from '../../../../components/LocationModal/LocationModal';
import fonts from '../../../../Constants/Fonts';

export default function AvailableServiceAreas({
  areas = [],
  setData = () => {},
}) {
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);

  const [activeIndex, setActiveIndex] = useState();
  const [area, setAreas] = useState(areas);

  const handleSetLocationOptions = (locationObj) => {
    if (Object.prototype.hasOwnProperty.call(locationObj, 'address')) {
      area[activeIndex].address = locationObj?.formattedAddress;
    } else {
      area[activeIndex].address = locationObj?.formattedAddress;
    }

    setData(area);
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        extraData={area}
        data={area}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 30}}
        ListHeaderComponent={() => (
          <TCLabel
            title={strings.address.toUpperCase()}
            style={{marginBottom: 10, marginTop: 25}}
          />
        )}
        renderItem={({item, index}) => (
          <>
            <Pressable
              onPress={() => {
                console.log(index, 'From index7');
                setActiveIndex(index);
                setVisibleLocationModal(true);
              }}
              style={{
                width: '100%',
                marginVertical: 10,
              }}>
              <TextInput
                value={item.address}
                editable={false}
                pointerEvents="none"
                placeholder={strings.searchcitystatecountry}
                placeholderTextColor={colors.userPostTimeColor}
                style={styles.textInputStyles}
              />
            </Pressable>

            <LocationModal
              visibleLocationModal={visibleLocationModal}
              title={strings.cityStateCountryTitle}
              setVisibleLocationModalhandler={() =>
                setVisibleLocationModal(false)
              }
              onLocationSelect={(locationobj) => {
                handleSetLocationOptions(locationobj);
              }}
              placeholder={strings.searchcitystatecountry}
              type={'country'}
            />
          </>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={styles.addVenueButton}
            onPress={() => {
              const newAreas = [...area, {}];
              setAreas([...newAreas]);
            }}>
            <Text style={styles.addVenueButtonText}>
              {strings.addServicableAreas}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addVenueButton: {
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: colors.lightGrey,
    marginTop: 35,
  },
  addVenueButtonText: {
    fontSize: 12,
    lineHeight: 21,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  textInputStyles: {
    backgroundColor: colors.lightGrey,
    height: 40,
    borderRadius: 4,

    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingHorizontal: 10,
    color: colors.lightBlackColor,

    marginHorizontal: 15,
  },
});
