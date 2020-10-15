//import {makeAPIRequest} from '../utils/Global';
import {RNS3} from 'react-native-s3-upload';
// import {api} from '../utils/apiConstants';

export const uploadImage = ({image}) => async (dispatch) => {
  let str = image.uri.split('/');
  image.name = new Date().getTime() + '-' + str[str.length - 1];
  const options = {
    keyPrefix: 'uploads/',
    bucket: '',
    region: '',
    accessKey: '',
    secretKey: '',
    successActionStatus: 201,
  };
  try {
    return RNS3.put(image, options).then((response) => {
      if (response.status !== 201)
        throw new Error('Failed to upload image to S3');
      return Promise.resolve(image.name);
    });
  } catch (error) {
    console.log({file, error});
  }
};

// export const getImage = ({imageId}) => async (dispatch) => {
//   return makeAPIRequest({
//     method: 'get',
//     url: api.imageBaseURL + imageId,
//     responseType: 'arraybuffer',
//     isS3: true,
//   }).then((response) => {
//     return Promise.resolve(
//       'data:image/png;base64,' +
//         Buffer.from(response.data, 'binary').toString('base64'),
//     );
//   });
// };





/**
 * 
 * 
 * 
const image = {​
    uri: resizeImage.uri,
    type: 'image/png',
    name: 'Profile_Picture'
}​;
uploadImage({​ image: image }​).then((res) => {​
    let facebookSignupObj = {​
        name: result.name,
        email: result.email,
        image: res
    }​;
    navigation.navigate('SelectBankCountry', {​ data: facebookSignupObj, type: FACEBOOK }​);
}​);
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */