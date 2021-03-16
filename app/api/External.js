import makeAPIRequest from '../utils/Global';
import apiCall from '../utils/apiCall';

export const searchLocations = async (query, types = 'regions') => apiCall({
  method: 'get',
  url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(${types})&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4&input=${query}`,
})

export const searchCityState = async (query) => apiCall({
  method: 'get',
  url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4&input=${query}`,
})

export const searchVenue = async (query, authContext) => makeAPIRequest({
  method: 'get',
  authContext,
  url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?type=address&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4&input=${query}`,
})

export const getLatLong = async (addressText, authContext) => makeAPIRequest({
  method: 'get',
  authContext,
  url: `https://maps.googleapis.com/maps/api/geocode/json?address=${addressText.replace(/ /g, '+')}&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4`,
  // url: `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4`,
})
export const searchLocationPlaceDetail = async (place_id, authContext) => makeAPIRequest({
  method: 'get',
  authContext,
  url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4`,
});

export const getLocationNameWithLatLong = async (latValue, longValue, authContext) => makeAPIRequest({
  method: 'get',
  authContext,
  url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latValue},${longValue}&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4`,
})
