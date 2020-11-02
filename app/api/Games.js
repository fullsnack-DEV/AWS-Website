import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

const getSportsList = async () => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/games/sports/`,
})

export default getSportsList
