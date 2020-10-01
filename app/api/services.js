import * as Url from './Url';
import {alert, Alert} from 'react-native';

export const get = async (url, token) => {
  var headers;

  if (token == '' || token == null || token == undefined) {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  } else {
    headers = {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    };
  }
  const completeUrl = Url.BASE_URL + url;
  console.log('completeUrl', completeUrl);

  const response = await fetch(completeUrl, {
    method: 'GET',
    headers,
  });

  let res = await response.json();
  console.log('ressssssponsse', res);
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
  var headers;

  if (token == '' || token == null || token == undefined) {
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
      body: body,
    });

    let res = await response.json();

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

export const post = async (url, token, body) => {
  var headers;
  if (token == '' || token == null || token == undefined) {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  } else {
    headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    };
  }

  let data = JSON.stringify(body);
  const completeUrl = Url.BASE_URL + url;
  console.log('completeUrl', completeUrl);
  const response = await fetch(completeUrl, {
    method: 'POST',
    headers,
    body: data,
  });
  let res = await response.json();
  if (res !== null) {
    if (res !== null && Object.keys(res).length !== 0) {
      if (res.statusCode === 200 || res.statusCode === 303) {
        return res;
      }
    }
    console.log('res', res);
    Alert.alert('', res.error);

    // throw new Error(res.error)
  }
};

export const put = async (url, token, body) => {
  var headers;

  if (token == '' || token == null || token == undefined) {
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
  let data = JSON.stringify(body);
  try {
    const response = await fetch(completeUrl, {
      method: 'PUT',
      headers,
      body: data,
    });

    let res = await response.json();

    if (res !== null) {
      if (res !== null && Object.keys(res).length !== 0) {
        if (res.statusCode === 200 || res.statusCode === 303) {
          console.log('res', res);
          return res;
        } else if (res.statusCode === 400) {
          console.log('else::res', res);
          return res;
        }
      }
      console.log('res', res);
      Alert.alert('', res.error);
    }
  } catch (err) {
    console.log('put::err', err.message);
    return;
  }
};

export const deleteApi = async (url, token) => {
  var headers;

  if (token == '' || token == null || token == undefined) {
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

    let res = await response.json();

    if (res !== null) {
      if (res !== null && Object.keys(res).length !== 0) {
        if (res.statusCode === 200 || res.statusCode === 303) {
          console.log('res', res);
          return res;
        } else if (res.statusCode === 400) {
          console.log('else::res', res);
          return res;
        }
      }
      console.log('res', res);
      Alert.alert('', res.error);
    }
  } catch (err) {
    console.log('put::err', err.message);
    return;
  }
};

export const getLocation = async (url, token) => {
  var headers;

  if (token == '' || token == null || token == undefined) {
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
  const completeUrl = Url.GET_LOCATION + 'mohali';
  console.log('completeUrl.........', completeUrl);

  const response = await fetch(completeUrl, {
    method: 'GET',
    headers,
  });

  let res = await response.json();
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
