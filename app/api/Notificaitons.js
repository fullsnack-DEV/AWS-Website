 import Config from 'react-native-config';

import makeAPIRequest from '../utils/Global';

export const getUnreadCount = (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}notifications/unreadcount/`,
  authContext,
});

export const getNotificationsList = (params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}notifications`,
  params,
  authContext,
});

export const deleteNotification = (id, type, authContext) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}notifications`,
  data: type === 'request' ? { requestIds: id } : { notificationIds: id },
  authContext,
});

export const restoreNotification = (id, type, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}notifications/restore`,
  data: type === 'request' ? { notificationIds: id } : { requestIds: id },
  authContext,
});

export const acceptRequest = (requestId, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}requests/${requestId}/accept`,
  authContext,
});

export const declineRequest = (requestId, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}requests/${requestId}/reject`,
  authContext,
});

export const getRequestDetail = (requestId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/groups/requests/${requestId}`,
  authContext,
});

export const getTrash = (params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}trash`,
  params,
  authContext,
});
