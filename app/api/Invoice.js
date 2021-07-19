import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const createInvoice = (params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/invoices`,
  data: params,
  authContext,
})

// Temp call
export const createGroupRequest = (params, caller_id, caller, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}groups/request`,
  caller_id,
  caller,
  data: params,
  authContext,
})

export const patchGroup = (groupID, params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}groups/${groupID}`,
  data: params,
  authContext,
})
