import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MapView, {Marker} from 'react-native-maps';
import images from '../../Constants/ImagePath';

function EventMapView({region, coordinate, style, onPress = () => {}}) {
  return (
    <>
      <MapView
        onPress={onPress}
        // mapType={Platform.OS === 'android' ? 'none' : 'standard'}
        // provider={PROVIDER_GOOGLE}
        region={region}
        scrollEnabled={false}
        zoomEnabled={false}
        style={[styles.mapViewStyle, style]}>
        <Marker coordinate={coordinate}>
          <Image
            source={images.mappin}
            style={{
              width: 24,
              height: 30,
              zIndex: 3,
            }}
          />
        </Marker>
      </MapView>
    </>
  );
}

const styles = StyleSheet.create({
  mapViewStyle: {
    width: wp('92%'),
    height: hp('20%'),
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 10,
  },
});

export default EventMapView;
