import { Alert } from 'react-native';
import * as Url from './Url';

export const get = async (url, token, caller_id, caller) => {
  let headers;

  if (token === '' || token === null || token === undefined) {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  } else if (caller_id === null && caller === null) {
    headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  } else if (caller === null) {
    headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      caller_id: `${caller_id}`,
    };
  } else {
    headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      caller_id: `${caller_id}`,
      caller: `${caller}`,
    };
  }
  const completeUrl = Url.BASE_URL + url;
  console.log('completeUrl', completeUrl);

  const response = await fetch(completeUrl, {
    method: 'GET',
    headers,
  });
  console.log('HEADER IS: ', headers);
  const res = await response.json();
  console.log('ressssssponsse', JSON.stringify(res));
  if (res !== null) {
    return res;

    // if (res !== null && Object.keys(res).length !== 0) {
    //     if (res.statusCode === 200 || res.statusCode === 303) {

    //     }
    // }
    // console.log('res', res)
    // Alert.alert('', res.error)
  }
};
export const upLoad = async (url, token, body) => {
  let headers;

  if (token === '' || token === null || token === undefined) {
    headers = {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    };
  } else {
    headers = {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      'x-access-token': token,
    };
  }

  const completeUrl = Url.BASE_URL + url;
  console.log('completeUrl', completeUrl);
  try {
    const response = await fetch(completeUrl, {
      method: 'PUT',
      headers,
      body,
    });

    const res = await response.json();

    if (res !== null) {
      if (res !== null && Object.keys(res).length !== 0) {
        if (res.statusCode === 200) {
          console.log('res', res);
          return res;
        }
      }
      console.log('res', res);
      Alert.alert('', res.error);
    }
  } catch (err) {
    Alert.alert('', ' Somthing Went Wrong');
    console.log('err', err.message);
  }
};

export const post = async (url, token, body, caller_id, caller) => {
  let headers;
  if (token === '' || token === null || token === undefined) {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  } else if (caller_id === null && caller === null) {
    headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  } else if (caller === null) {
    headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      caller_id: `${caller_id}`,
    };
  } else {
    headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      caller_id: `${caller_id}`,
      caller: `${caller}`,
    };
  }

  const data = JSON.stringify(body);
  const completeUrl = Url.BASE_URL + url;
  console.log('completeUrl', completeUrl);
  const response = await fetch(completeUrl, {
    method: 'POST',
    headers,
    body: data,
  });
  const res = await response.json();
  console.log('ressssssponsse', JSON.stringify(res));
  if (res !== null) {
    return res;
    // throw new Error(res.error)
  }
};

export const patch = async (url, token, body, caller_id, caller) => {
  let headers;
  if (token === '' || token === null || token === undefined) {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  } else if (caller_id === null && caller === null) {
    headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  } else if (caller === null) {
    headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      caller_id: `${caller_id}`,
    };
  } else {
    headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      caller_id: `${caller_id}`,
      caller: `${caller}`,
    };
  }
  const completeUrl = Url.BASE_URL + url;
  console.log('completeUrl', completeUrl);
  const data = JSON.stringify(body);
  try {
    const response = await fetch(completeUrl, {
      method: 'PATCH',
      headers,
      body: data,
    });

    const res = await response.json();
    console.log('API Response: ', JSON.stringify(res));
    if (res !== null) {
      return res;
      // throw new Error(res.error)
    }
  } catch (error) {
    console.log('patch::error', error.message);
  }
};

export const put = async (url, token, body) => {
  let headers;

  if (token === '' || token === null || token === undefined) {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  } else {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token,
    };
  }
  const completeUrl = Url.BASE_URL + url;
  console.log('completeUrl', completeUrl);
  const data = JSON.stringify(body);
  try {
    const response = await fetch(completeUrl, {
      method: 'PUT',
      headers,
      body: data,
    });

    const res = await response.json();

    if (res !== null) {
      if (res !== null && Object.keys(res).length !== 0) {
        if (res.statusCode === 200 || res.statusCode === 303) {
          console.log('res', res);
          return res;
        } if (res.statusCode === 400) {
          console.log('else::res', res);
          return res;
        }
      }
      console.log('res', res);
      Alert.alert('', res.error);
    }
  } catch (err) {
    console.log('put::err', err.message);
  }
};

export const deleteApi = async (url, token) => {
  let headers;

  if (token === '' || token === null || token === undefined) {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  } else {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token,
    };
  }
  const completeUrl = Url.BASE_URL + url;
  console.log('completeUrl', completeUrl);
  // let data = JSON.stringify(body)
  try {
    const response = await fetch(completeUrl, {
      method: 'DELETE',
      headers,
      // body: data
    });

    const res = await response.json();

    if (res !== null) {
      if (res !== null && Object.keys(res).length !== 0) {
        if (res.statusCode === 200 || res.statusCode === 303) {
          console.log('res', res);
          return res;
        } if (res.statusCode === 400) {
          console.log('else::res', res);
          return res;
        }
      }
      console.log('res', res);
      Alert.alert('', res.error);
    }
  } catch (err) {
    console.log('put::err', err.message);
  }
};

export const getLocation = async (url, token) => {
  let headers;

  if (token === '' || token === null || token === undefined) {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  } else {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token,
    };
  }
  const completeUrl = `${Url.GET_LOCATION}mohali`;
  console.log('completeUrl.........', completeUrl);

  const response = await fetch(completeUrl, {
    method: 'GET',
    headers,
  });

  const res = await response.json();
  console.log('ressssssponsse.................locatiionnnn', res);
  if (res !== null) {
    return res;

    // if (res !== null && Object.keys(res).length !== 0) {
    //     if (res.statusCode === 200 || res.statusCode === 303) {

    //     }
    // }
    // console.log('res', res)
    // Alert.alert('', res.error)
  }
};
