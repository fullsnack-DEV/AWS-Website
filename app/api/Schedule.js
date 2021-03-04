import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const blockedSlots = async (entityType, entityID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}${entityType}/${entityID}/calendars`,
  authContext,
});

export const getEvents = async (entity_type, entity_id, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/${entity_type}/${entity_id}/events`,
  authContext,
});

export const getSlots = async (entity_type, entity_id, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/${entity_type}/${entity_id}/slots`,
  authContext,
});

export const editSlots = async (entity_type, entity_id, data, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/${entity_type}/${entity_id}/slots`,
  data,
  authContext,
});

export const deleteEvent = async (entity_type, entity_id, eventID, authContext) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}/${entity_type}/${entity_id}/events/${eventID}`,
  authContext,
});

export const getEventById = async (entity_type, entity_id, eventID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/${entity_type}/${entity_id}/events/${eventID}`,
  authContext,
});

export const createEvent = async (entity_type, entity_id, data, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/${entity_type}/${entity_id}/events`,
  data,
  authContext,
});

export const editEvent = async (entity_type, entity_id, data, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}${entity_type}/${entity_id}/events`,
  data,
  authContext,
});
