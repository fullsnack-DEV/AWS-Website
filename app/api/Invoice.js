import Config from 'react-native-config';

import makeAPIRequest from '../utils/Global';

export const createInvoice = (params, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}/invoices`,
    data: params,
    authContext,
  });

export const resendInvoice = (invoiceID, params, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}/invoices/${invoiceID}/resend`,
    data: params,
    authContext,
  });

export const createBatchInvoice = (batchID, params, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}/invoices/batch/${batchID}`,
    data: params,
    authContext,
  });

export const cancelBatchInvoice = (batchID, params, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}/invoices/batch/${batchID}/cancel`,
    data: params,
    authContext,
  });

export const resendBatchInvoice = (batchID, params, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}/invoices/batch/${batchID}/resend`,
    data: params,
    authContext,
  });

export const getSenderInvoices = (authContext, invoiceDate, invoiceEndDate) => {
  let str = '';

  if (invoiceDate) {
    str = `invoice_date=${invoiceDate}`;
  }
  if (invoiceEndDate) {
    if (str.length > 0) {
      str = `${str}&invoice_enddate=${invoiceEndDate}`;
    }
  }

  return makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/invoices/sender?${str}`,
    authContext,
  });
};

// recevier_id

export const getRecieverInvoices = (
  authContext,
  invoiceDate,
  invoiceEndDate,
) => {
  let str = '';

  if (invoiceDate) {
    str = `invoice_date=${invoiceDate}`;
  }
  if (invoiceEndDate) {
    if (str.length > 0) {
      str = `${str}&invoice_enddate=${invoiceEndDate}`;
    }
  }

  return makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/invoices/receiver?${str}`,
    authContext,
  });
};

export const getBatchInvoices = (bacthID, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/invoices/batch/${bacthID}`,
    authContext,
  });

export const getCancelledInvoice = (type, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/invoices/${type}?cancel_invoice=true`,
    authContext,
  });

export const getInvoiceDetail = (invoiceID, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/invoices/${invoiceID}`,
    authContext,
  });

export const payStripeInvoice = (invoiceID, params, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}/invoices/${invoiceID}/payment`,
    data: params,
    authContext,
  });

export const rejectInvoice = (invoiceID, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}/invoices/${invoiceID}/reject`,
    authContext,
  });

export const cancelInvoice = (invoiceID, authContext) =>
  makeAPIRequest({
    method: 'post',
    url: `${Config.BASE_URL}/invoices/${invoiceID}/cancel`,
    authContext,
  });

export const addLog = (invoiceID, params, authContext) =>
  makeAPIRequest({
    method: 'patch',
    url: `${Config.BASE_URL}/invoices/${invoiceID}`,
    data: params,
    authContext,
  });

export const addRecipientList = (batchID, authContext) =>
  makeAPIRequest({
    method: 'get',
    url: `${Config.BASE_URL}/invoices/batch/${batchID}/list`,
    authContext,
  });

export const deleteInvoiceLog = (invoiceID, logID, authContext) =>
  makeAPIRequest({
    method: 'delete',
    url: `${Config.BASE_URL}/invoices/${invoiceID}/logs/${logID}`,
    authContext,
  });
