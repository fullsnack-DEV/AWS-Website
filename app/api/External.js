import makeAPIRequest from '../utils/googleApiCall';

export const searchLocations = async (query, types = 'regions') =>
  makeAPIRequest({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(${types})&input=${query}`,
  });

export const searchCityState = async (query) =>
  makeAPIRequest({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}`,
  });

export const searchVenue = async (query) =>
  makeAPIRequest({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?type=address&input=${query}`,
  });

export const getLatLong = async (addressText) =>
  makeAPIRequest({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${addressText.replace(
      / /g,
      '+',
    )}`,
  });
export const searchLocationPlaceDetail = async (place_id) =>
  makeAPIRequest({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}`,
  });

export const getLocationNameWithLatLong = async (latValue, longValue) =>
  makeAPIRequest({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latValue},${longValue}`,
  });

export const getLatLongFromPlaceID = async (placeID) =>
  makeAPIRequest({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}`,
  });
export const searchNearByCity = async (latValue, longValue, radiusValue) =>
  makeAPIRequest({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latValue},${longValue}&radius=${radiusValue}`,
  });
