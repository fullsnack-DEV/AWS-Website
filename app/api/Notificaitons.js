import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const getUnreadCount = () => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/notifications/unreadcount/`,
})

export const getNotificationsList = (params) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/notifications`,
  params,
});

export const deleteNotification = (entityType, entityId) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}notifications?entity_type/${entityType}/entity_id/${entityId}`,
})

export const acceptRequest = (requestId) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}requests/${requestId}/accept`,
});

export const declineRequest = (requestId) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}requests/${requestId}/decline`,
});
