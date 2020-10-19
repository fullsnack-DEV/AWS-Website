import { development, production, staging } from '../config/constants';

const Config = require('../config/config');

const setAPIBaseURL = () => {
  switch (Config.env) {
    case development:
      return Config.developmentUrl;
    case staging:
      return Config.stagingUrl;
    case production:
      return Config.productionUrl;
    default:
      return null;
  }
};

const API_BASE_URL = setAPIBaseURL();

export default { API_BASE_URL, setAPIBaseURL };
