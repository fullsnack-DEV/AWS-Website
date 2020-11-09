import makeAPIRequest from '../utils/Global';

export const searchLocations = async (query) => makeAPIRequest({
  method: 'get',
  url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4&input=${query}`,
})

export const searchLocationPlaceDetail = async (place_id) => makeAPIRequest({
  method: 'get',
  url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4`,
});
