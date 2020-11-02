import makeAPIRequest from '../utils/Global';

const searchLocations = async (query) => makeAPIRequest({
  method: 'get',
  url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4&input=${query}`,
})

export default searchLocations
