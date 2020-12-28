import React, { useRef, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import PropTypes from 'prop-types';

/**
 * @param markers is an array of objects containing keys latitude, longitude and name of the markers to be shown on the map
 */
const MapMarkerAutoZoom = ({ region, markers, style }) => {
  const mapRef = useRef();

  // Call fitToSuppliedMarkers() method on the MapView after markers get updated
  useEffect(() => {
    if (mapRef.current) {
      // list of _id's must same that has been provided to the identifier props of the Marker
      mapRef.current.fitToSuppliedMarkers(markers.map(({ id }) => id));
    }
  }, [markers]);

  return (
    <MapView region={region} style={style} ref={mapRef}>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          identifier={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          description={marker.adddress}
          title={marker.name}
          pinColor={marker.pinColor}
        />
      ))}
    </MapView>
  );
};

MapMarkerAutoZoom.defaultProps = {
  markers: [],
};

MapMarkerAutoZoom.propTypes = {
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
};

export default MapMarkerAutoZoom;
