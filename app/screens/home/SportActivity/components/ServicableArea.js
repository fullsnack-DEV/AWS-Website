// @flow
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {strings} from '../../../../../Localization/translation';
// import MapPinWithRadious from '../../../../components/Schedule/MapPinWithRadious';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

const ServicableArea = ({avialableArea = null}) => {
  if (avialableArea) {
    if (avialableArea.is_specific_address) {
      return (avialableArea.address_list ?? []).map((item, index) => (
        <View style={{marginBottom: 15}} key={index}>
          <Text style={styles.label}>{item.address}</Text>
        </View>
      ));
    }
    // return (
    //   <View>
    //     <Text style={styles.label}>
    //       Within{' '}
    //       <Text
    //         style={{
    //           color: colors.themeColor,
    //           fontFamily: fonts.RMedium,
    //         }}>
    //         {avialableArea.radious} {avialableArea.distance_type}
    //       </Text>{' '}
    //       of{' '}
    //       <Text
    //         style={{
    //           color: colors.themeColor,
    //           fontFamily: fonts.RMedium,
    //         }}>
    //         {avialableArea.address}
    //       </Text>
    //     </Text>
    //     <MapPinWithRadious
    //       coordinate={avialableArea.latlong ?? {}}
    //       radious={
    //         avialableArea.distance_type === 'Mi'
    //           ? avialableArea.radious * 1609.344
    //           : avialableArea.radious * 1000
    //       }
    //       region={{
    //         ...avialableArea.latlong,
    //         latitudeDelta: 0.0922,
    //         longitudeDelta: 0.0421,
    //       }}
    //       style={styles.map}
    //     />
    //   </View>
    // );
  }
  return (
    <Text
      style={{
        ...styles.label,
        color: colors.grayColor,
      }}>
      {strings.noSettingConfigureText}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  // map: {
  //   height: 150,
  //   marginTop: 15,
  //   marginBottom: 15,
  // },
});
export default ServicableArea;
