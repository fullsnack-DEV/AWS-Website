import React from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {strings} from '../../Localization/translation';
import TCLabel from './TCLabel';
import TCTextField from './TCTextField';

function LocationView({
  onChangeLocationText,
  locationText,
  locationString,
  onPressCityPopup,
  postalCodeText,
  onChangePostalCodeText,
  showTitle = true,
}) {
  return (
    <View>
      <View style={styles.titleContainer}>
        {showTitle ? (
          <TCLabel
            title={strings.address.toUpperCase()}
            required={true}
            style={{marginTop: 0, marginBottom: 12}}
          />
        ) : (
          <View style={{marginTop: 0, marginBottom: 12}} />
        )}
      </View>

      <TCTextField
        value={locationText}
        onChangeText={onChangeLocationText}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={strings.streetAddress}
      />

      <View style={{marginTop: 15}}>
        <TouchableOpacity onPress={onPressCityPopup}>
          <TCTextField
            value={locationString}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={strings.cityStateCountry}
            pointerEvents="none"
            editable={false}
          />
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 15, marginBottom: 15}}>
        <TCTextField
          value={postalCodeText}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={strings.postalCode}
          onChangeText={onChangePostalCodeText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 15,

    alignItems: 'center',
  },
});

export default LocationView;
