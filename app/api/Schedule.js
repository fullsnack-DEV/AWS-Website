import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const blockedSlots = async (groupID) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}team/${groupID}/slots`,
});

export const getEvents = async (entity_type, entity_id) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/${entity_type}/${entity_id}/events`,
});

export const getSlots = async (entity_type, entity_id) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/${entity_type}/${entity_id}/slots`,
});

export const deleteEvent = async (entity_type, entity_id, eventID) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}/${entity_type}/${entity_id}/events/${eventID}`,
});

export const getEventById = async (entity_type, entity_id, eventID) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/${entity_type}/${entity_id}/events/${eventID}`,
});

export const createEvent = async (entity_type, entity_id, data) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/${entity_type}/${entity_id}/events`,
  data,
});

export const editEvent = async (entity_type, entity_id, data) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/${entity_type}/${entity_id}/events`,
  data,
});
