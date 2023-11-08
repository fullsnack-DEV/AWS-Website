import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const getActivityLogs = async (authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}activitylog`,
    authContext,
  });

export const getNextActivityLogs = async (timestamp, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}activitylog?timestamp=${timestamp}`,
    authContext,
  });

export const getActivityLogCount = async (timestamp, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}activitylogcount?timestamp=${timestamp}`,
    authContext,
  });
