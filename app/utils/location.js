import {
  PERMISSIONS,
  RESULTS,
  request,
  checkMultiple,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {
  getLocationNameWithLatLong,
  searchLocationPlaceDetail,
} from '../api/External';
import {strings} from '../../Localization/translation';
import Verbs from '../Constants/Verbs';

const checkPermAndGetGeoCoordinates = async (platform) => {
  let permKeys = []; // Define permission array in preference order only
  if (platform === 'android') {
    permKeys = [
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    ];
  } else {
    permKeys = [
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      PERMISSIONS.IOS.LOCATION_ALWAYS,
    ];
  }
  const availablePermissions = await checkMultiple(permKeys);
  if (
    availablePermissions[permKeys[0]] === RESULTS.GRANTED ||
    availablePermissions[permKeys[1]] === RESULTS.GRANTED
  ) {
    return getGeocoordinates();
  }

  if (
    availablePermissions[permKeys[0]] === RESULTS.BLOCKED &&
    availablePermissions[permKeys[1]] === RESULTS.BLOCKED
  ) {
    const err = new Error(strings.userdeniedgps);
    err.name = Verbs.gpsErrorDeined;
    throw err;
  }

  if (
    availablePermissions[permKeys[0]] === RESULTS.UNAVAILABLE &&
    availablePermissions[permKeys[1]] === RESULTS.UNAVAILABLE
  ) {
    const err = new Error(strings.userdeniedgps);
    err.name = Verbs.gpsErrorDeined;
    throw err;
  }

  if (availablePermissions[permKeys[0]] === RESULTS.DENIED) {
    // Denied but still requestable
    if ((await request(permKeys[0])) === RESULTS.GRANTED) {
      return getGeocoordinates();
    }
    /* eslint-disable no-else-return */
    const err = new Error(strings.userdeniedgps);
    err.name = Verbs.gpsErrorDeined;
    throw err;
  } else if (availablePermissions[permKeys[1]] === RESULTS.DENIED) {
    // Denied but still requestable
    if ((await request(permKeys[1])) === RESULTS.GRANTED) {
      // get geo location
      return getGeocoordinates();
    } else {
      /* no-else-return */
      const err = new Error(strings.userdeniedgps);
      err.name = Verbs.gpsErrorDeined;
      throw err;
    }
  }
  return null;
};

// Geolocation.getCurrentPosition return call back . Promisifying it for ease of use
const getGeocoordinates = () =>
  new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      // callback on error
      (error) => {
        // FIXME: not sure why reject not working here. resolving for now with error data

        resolve(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 1000,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  });

const getGeocoordinatesWithPlaceName = async (platform) => {
  const location = {};
  const result = await checkPermAndGetGeoCoordinates(platform);
  if (result.message) {
    // this is error case
    if (result.code === 2 && result.PERMISSION_DENIED === 1) {
      const err = new Error(strings.userdeniedgps);
      err.name = Verbs.gpsErrorDeined;
      throw err;
    }
  } else {
    location.position = result;
  }

  // fail safe
  try {
    const locationDetails = await getLocationNameWithLatLong(
      location.position.coords.latitude,
      location.position.coords.longitude,
    );
    // eslint-disable-next-line array-callback-return
    locationDetails.results[0].address_components.map((e) => {
      if (e.types.includes('administrative_area_level_1')) {
        location.state = e.short_name;
      } else if (e.types.includes('locality')) {
        location.city = e.short_name;
      } else if (e.types.includes('country')) {
        location.country = e.long_name;
      }
    });
    location.formattedAddress = locationDetails.results[0].formatted_address;
  } catch (error) {
    // do nothing
  }
  return location;
};

const getGeocoordinatesWithoutPlaceName = async (platform) => {
  const location = {};
  const result = await checkPermAndGetGeoCoordinates(platform);
  if (result.message) {
    // this is error case
    if (result.code === 2 && result.PERMISSION_DENIED === 1) {
      const err = new Error(strings.userdeniedgps);
      err.name = Verbs.gpsErrorDeined;
      throw err;
    }
  } else {
    location.position = result;
  }

  return location;
};

const getPlaceNameFromPlaceID = async (placeID) => {
  const location = {};
  // fail safe
  try {
    const locationDetails = await searchLocationPlaceDetail(placeID);

    location.latitude = locationDetails.result.geometry.location.lat;
    location.longitude = locationDetails.result.geometry.location.lng;

    // eslint-disable-next-line array-callback-return
    locationDetails.result.address_components.map((e) => {
      if (e.types.includes('administrative_area_level_1')) {
        location.state = e.short_name;
        location.state_full = e.long_name;
      } else if (e.types.includes('locality')) {
        location.city = e.long_name;
      } else if (e.types.includes('country')) {
        location.country = e.long_name;
      } else if (e.types.includes('postal_code')) {
        location.postalCode = e.long_name;
      }
    });
    if (location.state === location.city) {
      delete location.state;
    }
    location.formattedAddress = locationDetails.result.formatted_address;
    location.address = locationDetails.result.name;
  } catch (error) {
    // do nothing
  }
  return location;
};

export {
  getGeocoordinatesWithPlaceName,
  getGeocoordinatesWithoutPlaceName,
  getPlaceNameFromPlaceID,
};
