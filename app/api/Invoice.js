import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const createInvoice = (params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/invoices`,
  data: params,
  authContext,
})
export const getTeamInvoice = (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/invoices`,
  authContext,
})
export const getTeamMemberInvoice = (memberID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/invoices/member/${memberID}`,
  authContext,
})
export const getMemberInvoice = (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/invoices`,
  authContext,
})

export const getInvoiceDetail = (invoiceID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/invoices/${invoiceID}`,
  authContext,
})
export const deleteInvoice = (invoiceID, authContext) => makeAPIRequest({
  method: 'delete',
  url: `${Config.BASE_URL}/invoices/${invoiceID}`,
  authContext,
})

export const cancelInvoice = (invoiceID, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/invoices/${invoiceID}/cancel`,
  authContext,
})

export const addLog = (invoiceID, params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}/invoices/${invoiceID}`,
  data: params,
  authContext,
})
