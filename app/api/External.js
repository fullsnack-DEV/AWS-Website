import axios from 'axios';
import makeAPIRequest from '../utils/googleApiCall';

export const searchLocations = async (query, types = 'regions') =>
  makeAPIRequest({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(${types})&input=${query}`,
  });

export const searchAddress = async (query) =>
  makeAPIRequest({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${query}`,
  });

export const searchAddressPredictions = async (query) =>
  makeAPIRequest({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=geocode&input=${query}`,
  });

export const searchCityState = async (query) =>
  makeAPIRequest({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&input=${query}`,
  });

export const searchRegion = async (query) =>
  makeAPIRequest({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(regions)&input=${query}`,
  });

export const searchNearByCityState = async (radius, lat, long) =>
  axios({
    method: 'get',
    url: `http://getnearbycities.geobytes.com/GetNearbyCities?radius=${radius}&latitude=${lat}&longitude=${long}&limit=500`,
  })
    .then((response) => {
      const cityList = response.data.map((obj) => ({
        description: obj[1],
        city: obj[1],
        state: obj[12],
        state_abbr: obj[2],
        country: obj[3],
      }));
      return cityList;
    })
    .catch((e) => {
      throw new Error(e);
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
