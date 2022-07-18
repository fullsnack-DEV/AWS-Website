import React from 'react';
import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MapView, {Marker} from 'react-native-maps';

function EventMapView({region, coordinate, style}) {
  return (
    <MapView
      // mapType={Platform.OS === 'android' ? 'none' : 'standard'}
      // provider={PROVIDER_GOOGLE}
      region={region}
      scrollEnabled={false}
      zoomEnabled={false}
      style={[styles.mapViewStyle, style]}
    >
      <Marker coordinate={coordinate} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  mapViewStyle: {
    width: wp('92%'),
    height: hp('20%'),
    borderRadius: 5,
    marginTop: 10,
  },
});

export default EventMapView;
