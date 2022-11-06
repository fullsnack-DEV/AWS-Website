import {
  PERMISSIONS,
  RESULTS,
  request,
  checkMultiple,
} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {getLocationNameWithLatLong} from '../api/External';

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
  if (availablePermissions[permKeys[0]] === RESULTS.DENIED) {
    // Denied but still requestable
    console.log('requesting perm 1');
    if ((await request(permKeys[0])) === RESULTS.GRANTED) {
      return getGeocoordinates();
    }
  } else if (availablePermissions[permKeys[1]] === RESULTS.DENIED) {
    // Denied but still requestable
    if ((await request(permKeys[1])) === RESULTS.GRANTED) {
      // get geo location
      return getGeocoordinates();
    }
  }
  return null;
};

// Geolocation.getCurrentPosition return call back . Promisifying it for ease of use
const getGeocoordinates = () =>
  new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(
          'file: location.js ~ line 31 ~ newPromise ~ position',
          position,
        );
        resolve(position);
      },
      // callback on error
      (error) => {
        console.log(
          'file: ChooseGenderScreen.js  ~ line 276 ~ ~ errorr',
          error,
        );
        // FIXME: not sure why reject not working here. resolving for now with null data
        resolve(null);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });

const getGeocoordinatesWithPlaceName = async (platform) => {
  const location = {};
  location.position = await checkPermAndGetGeoCoordinates(platform);
  // fail safe
  try {
    const locationDetails = await getLocationNameWithLatLong(
      location.position.coords.latitude,
      location.position.coords.longitude,
    );
    // eslint-disable-next-line array-callback-return
    locationDetails.results[0].address_components.map((e) => {
      if (e.types.includes('administrative_area_level_1')) {
        location.stateAbbr = e.short_name;
      } else if (e.types.includes('locality')) {
        location.city = e.short_name;
      } else if (e.types.includes('country')) {
        location.country = e.long_name;
      }
    });
  } catch (error) {
    // do nothing
  }
  return location;
};

const getGeocoordinatesWithoutPlaceName = async (platform) => {
  const location = {};
  location.position = await checkPermAndGetGeoCoordinates(platform);
  return location;
};

export {getGeocoordinatesWithPlaceName, getGeocoordinatesWithoutPlaceName};
