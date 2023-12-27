import Config from 'react-native-config';

import makeAPIRequest from '../utils/Global';

export const blockedSlots = async (entityType, entityID, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}${entityType}/${entityID}/calendars`,
    authContext,
  });

// export const getEvents = async (entity_type, entity_id, authContext) => makeAPIRequest({
//   method: 'get',
//   url: `${Config.BASE_URL}/${entity_type}/${entity_id}/events`,
//   authContext,
// });

// export const getSlots = async (entity_type, entity_id, authContext) => makeAPIRequest({
//   method: 'get',
//   url: `${Config.BASE_URL}/${entity_type}/${entity_id}/slots`,
//   authContext,
// });

export const editSlots = async (entity_type, entity_id, data, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}/${entity_type}/${entity_id}/slots`,
    data,
    authContext,
  });

export const deleteEvent = async (
  entity_type,
  entity_id,
  eventID,
  authContext,
  data = {},
) =>
  makeAPIRequest({
    method: 'delete',
    url: `${Config.BASE_URL}/${entity_type}/${entity_id}/events/${eventID}`,
    data,
    authContext,
  });

export const getEventById = async (
  entity_type,
  entity_id,
  eventID,
  authContext,
) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/${entity_type}/${entity_id}/events/${eventID}`,
    authContext,
  });

export const createEvent = async (entity_type, entity_id, data, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}/${entity_type}/${entity_id}/events`,
    data,
    authContext,
  });

export const editEvent = async (entity_type, entity_id, data, authContext) =>
  makeAPIRequest({
    method: 'patch',
    url: `${Config.BASE_URL}${entity_type}/${entity_id}/events`,
    data,
    authContext,
  });

export const inviteToEvent = async (event_id, params, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}events/${event_id}/invite`,
    data: params,
    authContext,
  });

export const attendEvent = async (event_id, params, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}events/${event_id}/attend`,
    data: params,
    authContext,
  });

export const removeAttendeeFromEvent = async (
  event_id,
  user_ids,
  authContext,
) =>
  makeAPIRequest({
    method: 'delete',
    url: `${Config.BASE_URL}events/${event_id}/attend`,
    data: user_ids,
    authContext,
  });

export const likeEvent = async (event_id, authContext) =>
  makeAPIRequest({
    method: 'put',
    url: `${Config.BASE_URL}events/${event_id}/like`,
    authContext,
  });

export const likeEventUsers = async (event_id, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}events/${event_id}/like`,
    authContext,
  });

export const myLikeEvents = async (authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}events/me/like`,
    authContext,
  });
