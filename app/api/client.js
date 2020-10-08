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
import {makeAPIRequest} from '../utils/Global';
import {api} from '../utils/apiConstants';
const {urls} = constants;

const apiPostClient = (body, query) => {
  let response = fetch(urls.BASEURL + query, {
    method: 'post',
    headers: new Headers({
      Authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2NzUwM2UwYWVjNTJkZGZiODk2NTIxYjkxN2ZiOGUyMGMxZjMzMDAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdG93bnNjdXAtZmVlNmUiLCJhdWQiOiJ0b3duc2N1cC1mZWU2ZSIsImF1dGhfdGltZSI6MTYwMTU1Mjc5NywidXNlcl9pZCI6ImtSb2h3VDRyandkbVdFZk5WTlQwQkdyR09FbzIiLCJzdWIiOiJrUm9od1Q0cmp3ZG1XRWZOVk5UMEJHckdPRW8yIiwiaWF0IjoxNjAxNTUyNzk3LCJleHAiOjE2MDE1NTYzOTcsImVtYWlsIjoia2lzaGFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJraXNoYW5AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.oy1Xjuy6sMEq5hy5ajJYs3zT-zkL67alWo5s3jkY7Vj3HFKdPJKmcQ5mnzmLjCQ-Jkc-RM-OvocmrYw0Pt1GwNTRaXqrg-_XY2e7vVV0Y8K3Z4oGqOJ_Q2O2B1YG9j9BZa9W3lEHt16AFRldKVA8NTIICe-cx0D65gsqQxR_ZK6139FcbM9bvrMJNEr03rUQG2NXu2ZPdhW9DuhSaSYEkxTKiI7bF-drEAW8aHW0tOaLP5UhEyDO9fAn--ljol73SBxwPVHSSjYsuSAcwZ7g5BIYbEYn4Qx_BCpDh5vVb8KTYEI1k039g18RFNWoYjyCj2MqVVk1BIW-iWdPupfcwQ',
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
        'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2NzUwM2UwYWVjNTJkZGZiODk2NTIxYjkxN2ZiOGUyMGMxZjMzMDAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdG93bnNjdXAtZmVlNmUiLCJhdWQiOiJ0b3duc2N1cC1mZWU2ZSIsImF1dGhfdGltZSI6MTYwMTU1Mjc5NywidXNlcl9pZCI6ImtSb2h3VDRyandkbVdFZk5WTlQwQkdyR09FbzIiLCJzdWIiOiJrUm9od1Q0cmp3ZG1XRWZOVk5UMEJHckdPRW8yIiwiaWF0IjoxNjAxNTUyNzk3LCJleHAiOjE2MDE1NTYzOTcsImVtYWlsIjoia2lzaGFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJraXNoYW5AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.oy1Xjuy6sMEq5hy5ajJYs3zT-zkL67alWo5s3jkY7Vj3HFKdPJKmcQ5mnzmLjCQ-Jkc-RM-OvocmrYw0Pt1GwNTRaXqrg-_XY2e7vVV0Y8K3Z4oGqOJ_Q2O2B1YG9j9BZa9W3lEHt16AFRldKVA8NTIICe-cx0D65gsqQxR_ZK6139FcbM9bvrMJNEr03rUQG2NXu2ZPdhW9DuhSaSYEkxTKiI7bF-drEAW8aHW0tOaLP5UhEyDO9fAn--ljol73SBxwPVHSSjYsuSAcwZ7g5BIYbEYn4Qx_BCpDh5vVb8KTYEI1k039g18RFNWoYjyCj2MqVVk1BIW-iWdPupfcwQ',
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
        'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2NzUwM2UwYWVjNTJkZGZiODk2NTIxYjkxN2ZiOGUyMGMxZjMzMDAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdG93bnNjdXAtZmVlNmUiLCJhdWQiOiJ0b3duc2N1cC1mZWU2ZSIsImF1dGhfdGltZSI6MTYwMTU1Mjc5NywidXNlcl9pZCI6ImtSb2h3VDRyandkbVdFZk5WTlQwQkdyR09FbzIiLCJzdWIiOiJrUm9od1Q0cmp3ZG1XRWZOVk5UMEJHckdPRW8yIiwiaWF0IjoxNjAxNTUyNzk3LCJleHAiOjE2MDE1NTYzOTcsImVtYWlsIjoia2lzaGFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJraXNoYW5AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.oy1Xjuy6sMEq5hy5ajJYs3zT-zkL67alWo5s3jkY7Vj3HFKdPJKmcQ5mnzmLjCQ-Jkc-RM-OvocmrYw0Pt1GwNTRaXqrg-_XY2e7vVV0Y8K3Z4oGqOJ_Q2O2B1YG9j9BZa9W3lEHt16AFRldKVA8NTIICe-cx0D65gsqQxR_ZK6139FcbM9bvrMJNEr03rUQG2NXu2ZPdhW9DuhSaSYEkxTKiI7bF-drEAW8aHW0tOaLP5UhEyDO9fAn--ljol73SBxwPVHSSjYsuSAcwZ7g5BIYbEYn4Qx_BCpDh5vVb8KTYEI1k039g18RFNWoYjyCj2MqVVk1BIW-iWdPupfcwQ',
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
