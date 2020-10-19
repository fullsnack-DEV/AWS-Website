// import {useState} from 'react';

// export default useApi = (apiFunction) => {
//   const [data, setData] = useState([]);
//   const [error, setError] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const request = async (...args) => {
//     setLoading(true);
//     const response = await apiFunction(...args);

//     setLoading(false);

//     if (!response.ok) return setError(true);

//     setData(response.data);
//     setError(false);
//   };
//   return {data, error, loading, request};
// };

import { useState } from 'react';

export default useApi = (apiFunction) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const request = async (...args) => {
    setLoading(true);
    const response = await apiFunction(...args);
    console.log('response..........', response.data);
    const json = await response.json();
    console.log('Json..........', json);
    if (!json.status) return setError(true);

    setData(json);
    setError(false);
    setLoading(false);
    console.log('RESPONSE DATA: ', json);
    return {
      data, error, loading, request,
    };
    // await apiFunction(...args)
    //   .then((response) => response.json())
    //   .then((result) => {
    //     if (!result.status) return setError(true);

    //     setData(result);
    //     setError(false);
    //     setLoading(false);
    //     console.log('RESPONSE DATA: ', result, error, loading);
    //   });
  };
  return {
    data, error, loading, request,
  };
};
