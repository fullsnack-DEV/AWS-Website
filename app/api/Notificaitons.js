import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const getUnreadCount = () => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}notifications/unreadcount/`,
});

export const getNotificationsList = (params) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}notifications`,
  params,
});

export const deleteNotification = (id, type) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}notifications`,
  data: type === 'request' ? { notificationIds: id } : { requestIds: id },
});

export const restoreNotification = (id, type) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}notifications/restore`,
  data: type === 'request' ? { notificationIds: id } : { requestIds: id },
});

export const acceptRequest = (requestId) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}requests/${requestId}/accept`,
});

export const declineRequest = (requestId) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}requests/${requestId}/reject`,
});

export const getTrash = (params) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}trash`,
  params,
});
