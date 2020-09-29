// import {create} from 'apisauce';

// import useTokenizer from './useTokenizer';
// import storage from '../auth/storage';

// const apiClient = create({
//   baseURL: 'https://90gtjgmtoe.execute-api.us-east-1.amazonaws.com/dev/',
//   headers: {Accept: 'application/json'},
// });

// apiClient.setHeader(
//   'Authorization',
//   'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyODA5ZGQyMzlkMjRiZDM3OWMwYWQxOTFmOGIwZWRjZGI5ZDM5MTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdG93bnNjdXAtZmVlNmUiLCJhdWQiOiJ0b3duc2N1cC1mZWU2ZSIsImF1dGhfdGltZSI6MTU5ODAwNTc4MCwidXNlcl9pZCI6IlhTNGNqQndxOFJiaGhNNEF0Zmdmb09qQXpXNzIiLCJzdWIiOiJYUzRjakJ3cThSYmhoTTRBdGZnZm9PakF6VzcyIiwiaWF0IjoxNTk4MDA1NzgwLCJleHAiOjE1OTgwMDkzODAsImVtYWlsIjoiZWVAZWUuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImVlQGVlLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.Wc_aizB6RdtSjIQeg-ZaI1qk59kY9NJQJFY3ECBaOJRoUndW2GF3JLaAM2cp-CohLI40whTC_0igCDl_t5NFMud0eJKgIQwDr0b_VRUOgJyKfnkouhxnwEN6rgWMhEtnY8lOnqg3LapHHFQbYLk8oQCed6MO_xdkkdpoa9X09kL6jK3KF_vQzP3skxBOHxxWvuCMoJ6Dp2gEix85H0w1hx8kVn7bzdLG-XYYvpBY4E5FOfCzmSSZge3XzNWrF5Y3nCucy2hYWWjM9p1OSGznPXwooeALLhNcoc4QmA63SfPxQWAplVRVv6dHr6SS23gCe9nibpEvg8nVnIb7ku87QA',
// );

// export default apiClient;

//*************** */ Fetch api call

import {create} from 'apisauce';
import auth from '@react-native-firebase/auth';

import constants from '../../app/config/constants';
const {urls} = constants;

const apiPostClient = (body, query) => {
  let response = fetch(urls.BASEURL + query, {
    method: 'post',
    headers: new Headers({
      Authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjczNzVhZmY3MGRmZTNjMzNlOTBjYTM2OWUzYTBlZjQxMzE3MmZkODIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdG93bnNjdXAtZmVlNmUiLCJhdWQiOiJ0b3duc2N1cC1mZWU2ZSIsImF1dGhfdGltZSI6MTYwMDUwNTI4OSwidXNlcl9pZCI6ImtSb2h3VDRyandkbVdFZk5WTlQwQkdyR09FbzIiLCJzdWIiOiJrUm9od1Q0cmp3ZG1XRWZOVk5UMEJHckdPRW8yIiwiaWF0IjoxNjAwNTA1Mjg5LCJleHAiOjE2MDA1MDg4ODksImVtYWlsIjoia2lzaGFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJraXNoYW5AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.I4eEKNVmb3Lf1ySNkpJcb_2zoEFjkOuthu6gzSqGVlSIBgrH_ZS-z_E718sl20FS-jJhTv43JYfzmnitmEX8HX_vPNGq2b7xQgjlpj9vYO46UtEBtYRYOqEh463yZx3ELE2xeRQU1jvfl7EoHzz1jLRfsmPsF7Gje6lbiK4KcxiuoOKZ_dKQfh9NYRv-mzYITyhhZm8xfBblcI5Ev6YFAHO2R4JUcacfB3zcy10z_w7EfiLOhCJJhoTTKBYMISa86W8NGgAO_DeESYwaxAmNYKomWsc45qx8LhV8Qe26AVhmbj9bV72k5e6AeTyLo6HI3galQjXikrRZjGEu904M1A',
      'Content-Type': 'application/json',
    }),
    body: body,
  });

  return response;
};

const apiGetClient = (query) => {
  let response = fetch(urls.BASEURL + query, {
    method: 'get',
    headers: new Headers({
      Authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjczNzVhZmY3MGRmZTNjMzNlOTBjYTM2OWUzYTBlZjQxMzE3MmZkODIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdG93bnNjdXAtZmVlNmUiLCJhdWQiOiJ0b3duc2N1cC1mZWU2ZSIsImF1dGhfdGltZSI6MTYwMDUwNTI4OSwidXNlcl9pZCI6ImtSb2h3VDRyandkbVdFZk5WTlQwQkdyR09FbzIiLCJzdWIiOiJrUm9od1Q0cmp3ZG1XRWZOVk5UMEJHckdPRW8yIiwiaWF0IjoxNjAwNTA1Mjg5LCJleHAiOjE2MDA1MDg4ODksImVtYWlsIjoia2lzaGFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJraXNoYW5AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.I4eEKNVmb3Lf1ySNkpJcb_2zoEFjkOuthu6gzSqGVlSIBgrH_ZS-z_E718sl20FS-jJhTv43JYfzmnitmEX8HX_vPNGq2b7xQgjlpj9vYO46UtEBtYRYOqEh463yZx3ELE2xeRQU1jvfl7EoHzz1jLRfsmPsF7Gje6lbiK4KcxiuoOKZ_dKQfh9NYRv-mzYITyhhZm8xfBblcI5Ev6YFAHO2R4JUcacfB3zcy10z_w7EfiLOhCJJhoTTKBYMISa86W8NGgAO_DeESYwaxAmNYKomWsc45qx8LhV8Qe26AVhmbj9bV72k5e6AeTyLo6HI3galQjXikrRZjGEu904M1A',
      'Content-Type': 'application/json',
    }),
  });
  console.log('URL LINK: ', urls.BASEURL + query);
  return response;
};

const apiGetClientQuery = (endPoints, params) => {
  let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

  let response = fetch(urls.BASEURL + endPoints + '?' + query, {
    method: 'get',
    headers: new Headers({
      Authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjczNzVhZmY3MGRmZTNjMzNlOTBjYTM2OWUzYTBlZjQxMzE3MmZkODIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdG93bnNjdXAtZmVlNmUiLCJhdWQiOiJ0b3duc2N1cC1mZWU2ZSIsImF1dGhfdGltZSI6MTYwMDUwNTI4OSwidXNlcl9pZCI6ImtSb2h3VDRyandkbVdFZk5WTlQwQkdyR09FbzIiLCJzdWIiOiJrUm9od1Q0cmp3ZG1XRWZOVk5UMEJHckdPRW8yIiwiaWF0IjoxNjAwNTA1Mjg5LCJleHAiOjE2MDA1MDg4ODksImVtYWlsIjoia2lzaGFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJraXNoYW5AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.I4eEKNVmb3Lf1ySNkpJcb_2zoEFjkOuthu6gzSqGVlSIBgrH_ZS-z_E718sl20FS-jJhTv43JYfzmnitmEX8HX_vPNGq2b7xQgjlpj9vYO46UtEBtYRYOqEh463yZx3ELE2xeRQU1jvfl7EoHzz1jLRfsmPsF7Gje6lbiK4KcxiuoOKZ_dKQfh9NYRv-mzYITyhhZm8xfBblcI5Ev6YFAHO2R4JUcacfB3zcy10z_w7EfiLOhCJJhoTTKBYMISa86W8NGgAO_DeESYwaxAmNYKomWsc45qx8LhV8Qe26AVhmbj9bV72k5e6AeTyLo6HI3galQjXikrRZjGEu904M1A',
      'Content-Type': 'application/json',
    }),
  });
  return response;
};

const apiGetGoogleClient = (searchText) => {
  console.log('SEARCH TEXT: ', URL);
  let response = fetch(
    'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&key=AIzaSyCfHXf6aHFVbGZTCLl-Vte3YjyUQa-AFZ4&input=' +
      searchText,
    {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    },
  );
  return response;
};

// apiClient.setHeader(
//   'Authorization',
//   'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyODA5ZGQyMzlkMjRiZDM3OWMwYWQxOTFmOGIwZWRjZGI5ZDM5MTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdG93bnNjdXAtZmVlNmUiLCJhdWQiOiJ0b3duc2N1cC1mZWU2ZSIsImF1dGhfdGltZSI6MTU5ODAwNTc4MCwidXNlcl9pZCI6IlhTNGNqQndxOFJiaGhNNEF0Zmdmb09qQXpXNzIiLCJzdWIiOiJYUzRjakJ3cThSYmhoTTRBdGZnZm9PakF6VzcyIiwiaWF0IjoxNTk4MDA1NzgwLCJleHAiOjE1OTgwMDkzODAsImVtYWlsIjoiZWVAZWUuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImVlQGVlLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.Wc_aizB6RdtSjIQeg-ZaI1qk59kY9NJQJFY3ECBaOJRoUndW2GF3JLaAM2cp-CohLI40whTC_0igCDl_t5NFMud0eJKgIQwDr0b_VRUOgJyKfnkouhxnwEN6rgWMhEtnY8lOnqg3LapHHFQbYLk8oQCed6MO_xdkkdpoa9X09kL6jK3KF_vQzP3skxBOHxxWvuCMoJ6Dp2gEix85H0w1hx8kVn7bzdLG-XYYvpBY4E5FOfCzmSSZge3XzNWrF5Y3nCucy2hYWWjM9p1OSGznPXwooeALLhNcoc4QmA63SfPxQWAplVRVv6dHr6SS23gCe9nibpEvg8nVnIb7ku87QA',
// );

export default {
  apiPostClient,
  apiGetClient,
  apiGetGoogleClient,
  apiGetClientQuery,
};
