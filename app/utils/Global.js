import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {authToken, token_details} from '../utils/constant';
import firebase from '@react-native-firebase/app';

// const getToken = async() => {

//     const tokenDetails = await AsyncStorage.getItem(token_details);

//     var expiryDate = new Date(JSON.parse(tokenDetails).expirationTime)
//     var currentDate = new Date();

//     if (expiryDate.getTime() <= currentDate.getTime()) {
//         console.log('Current Date Big');
//         firebase.auth().onAuthStateChanged(  (user)  => {
//             if  (user) {
//               user.getIdTokenResult().then( async (idTokenResult) =>{
//                 console.log("idTokenResult.token",idTokenResult);

//                 let tokenDetail = {
//                     token: idTokenResult.token,
//                     expirationTime: idTokenResult.expirationTime,
//                   };
//                   await AsyncStorage.setItem(token_details, JSON.stringify(tokenDetail));
//               });
//             }
//         });
//     } else {
//         console.log('Expiry Date Big');
//     }
//    }  

export const makeAPIRequest = ({
  method,
  url,
  data,
  headers,
  params,
  responseType,
}) =>
  new Promise(async (resolve, reject) => {

    const tokenDetails = await AsyncStorage.getItem(token_details);
    var authToken = JSON.parse(tokenDetails).token;
    var expiryDate = new Date(JSON.parse(tokenDetails).expirationTime)
    var currentDate = new Date();

    if (expiryDate.getTime() <= currentDate.getTime()) {
        console.log('Current Date Big');
        firebase.auth().onAuthStateChanged(  (user)  => {
            if  (user) {
              user.getIdTokenResult().then( async (idTokenResult) =>{
                console.log("idTokenResult.token",idTokenResult);
                authToken = idTokenResult.token;
                let tokenDetail = {
                    token: idTokenResult.token,
                    expirationTime: idTokenResult.expirationTime,
                  };
                  await AsyncStorage.setItem(token_details, JSON.stringify(tokenDetail));
              });
            }
        });
    } else {
        console.log('Expiry Date Big');
    }
    var apiHeaders = {};
    if (authToken != null) {
      const authHeader = {
        Authorization: 'Bearer ' + authToken,
      };
      apiHeaders = Object.assign({}, authHeader, headers);
    } else {
      apiHeaders = headers;
    }

    const options = {
      method: method,
      url: url,
      data: data,
      headers: apiHeaders,
      params: params,
      responseType: responseType,
    };

    await axios(options)
      .then((response) => {
        if (response.status === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch(async (error) => {
        reject(error);
      });
  });
