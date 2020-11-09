import makeAPIRequest from '../utils/Global';

export const searchLocations = async (query) => makeAPIRequest({
  method: 'get',
  url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4&input=${query}`,
})

export const searchVenue = async (query) => makeAPIRequest({
  method: 'get',
  url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?type=address&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4&input=${query}`,
})

export const getLatLong = async (addressText) => makeAPIRequest({
  method: 'get',
  url: `https://maps.googleapis.com/maps/api/geocode/json?address=${addressText.replace(/ /g, '+')}&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4`,
  // url: `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4`,
})
