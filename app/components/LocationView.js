import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {strings} from '../../Localization/translation';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import TCLabel from './TCLabel';
import TCTextField from './TCTextField';

function LocationView({
  onPressVisibleLocationPopup,
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
        <Text style={styles.title} onPress={onPressVisibleLocationPopup}>
          {strings.searchForAddress}
        </Text>
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

    marginTop: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    textDecorationLine: 'underline',
  },
});

export default LocationView;
