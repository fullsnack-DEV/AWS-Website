import {development, production, staging} from '../config/constants';

const {Config} = require('../config/config');

const setAPIBaseURL = () => {
  switch (Config.env) {
    case development:
      return Config.developmentUrl;
    case staging:
      return Config.stagingUrl;
    case production:
      return Config.productionUrl;
  }
};

export const API_BASE_URL = setAPIBaseURL();
