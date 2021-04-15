import fs from 'react-native-fs';
import axios from 'axios';
import { decode as atob } from 'base-64';
import ImageResizer from 'react-native-image-resizer';
import _ from 'lodash';
import getImagePreSignedURL from '../api/Media';

export const MAX_UPLOAD_POST_ASSETS = 12
const base64ToArrayBuffer = (base64) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
  // return Buffer.from(binaryString)
};

// Image compression and resize constants
const T_LANDSCAPE_IMAGE_HEIGHT = 400;
const T_PORTRAIT_IMAGE_WIDTH = 400;
export const T_COMPRESSION_RATE = 60; // 0 to 100

const O_LANDSCAPE_IMAGE_HEIGHT = 1200;
const O_PORTRAIT_IMAGE_WIDTH = 1200;
const O_COMPRESSION_RATE = 72; // 0 to 100

export const getPickedData = (pickedData, existingImageLength) => {
  if (pickedData?.length > (MAX_UPLOAD_POST_ASSETS - (existingImageLength ?? 0))) {
    return pickedData.slice(0, MAX_UPLOAD_POST_ASSETS - (existingImageLength ?? 0))
  }
  return pickedData;
}

export const uploadImageOnPreSignedUrls = async ({
  url, uri, type, cancelToken,
}) => {
   const base64 = await fs.readFile(uri, 'base64');
   const imgBuffer = base64ToArrayBuffer(base64);

    const options = {
      method: 'PUT',
      url,
      timeout: 180000,
      headers: {
        'Content-Type': type,
        'Content-Length': imgBuffer.length,
      },
      data: imgBuffer,
      cancelToken,
    };
    const response = await axios(options);
    if (response.status === 200) {
      console.log('RESPONSE CAME')
      return url.split('?')[0]
    }

  throw new Error('upoad-failed')
};

export const thumbnailImageSize = (imageData) => {
  const img = {};
  if (imageData.height < imageData.width) {
    if (imageData.height > T_LANDSCAPE_IMAGE_HEIGHT) {
      img.height = T_LANDSCAPE_IMAGE_HEIGHT
      img.width = parseInt((imageData.width / imageData.height) * T_LANDSCAPE_IMAGE_HEIGHT, 10)
    } else {
      img.height = imageData.height
      img.width = imageData.width
    }
      return img
  }
    if (imageData.width > T_PORTRAIT_IMAGE_WIDTH) {
      img.height = parseInt((imageData.height / imageData.width) * T_PORTRAIT_IMAGE_WIDTH, 10)
      img.width = T_PORTRAIT_IMAGE_WIDTH
    } else {
      img.height = imageData.height
      img.width = imageData.width
    }
      return img
}
const originalImageSize = (imageData) => {
  const img = {};
  if (imageData.height < imageData.width) {
    if (imageData.height > O_LANDSCAPE_IMAGE_HEIGHT) {
      img.height = O_LANDSCAPE_IMAGE_HEIGHT
      img.width = parseInt((imageData.width / imageData.height) * O_LANDSCAPE_IMAGE_HEIGHT, 10)
    } else {
      img.height = imageData.height
      img.width = imageData.width
    }
      return img
  }
    if (imageData.width > O_PORTRAIT_IMAGE_WIDTH) {
      img.height = parseInt((imageData.height / imageData.width) * O_PORTRAIT_IMAGE_WIDTH, 10)
      img.width = O_PORTRAIT_IMAGE_WIDTH
    } else {
      img.height = imageData.height
      img.width = imageData.width
    }
      return img

  // const heightRatio = imageData.height > 400 ?
}
const uploadImage = async (data, authContext, cancelToken, preSignedUrls) => {
  console.log('CALLED AT A TIME');
  const image = {
    ...data,
    thumbURL: '',
    originalURL: '',
  };
  let resThumb;
  let resOriginal
  if (image?.mime?.split('/')?.[0] === 'image') {
   const thumbImgData = thumbnailImageSize(image)
   const originalImgData = originalImageSize(image)
     resThumb = await ImageResizer.createResizedImage(image.path, thumbImgData.width, thumbImgData.height, 'JPEG', T_COMPRESSION_RATE, 0, null)
     resOriginal = await ImageResizer.createResizedImage(image.path, originalImgData.width, originalImgData.height, 'JPEG', O_COMPRESSION_RATE, 0, null)
  }

    const promises = [
        uploadImageOnPreSignedUrls({
          url: preSignedUrls[0],
          uri: image?.mime?.split('/')?.[0] === 'image' ? resOriginal.uri : image.path,
          type: image.mime,
          cancelToken,
      }),
      uploadImageOnPreSignedUrls({
        url: preSignedUrls[1],
        uri: image?.mime?.split('/')?.[0] === 'image' ? resThumb.uri : image.path,
        type: image.mime,
        cancelToken,
      })]
    return Promise.all(promises).then(([fullImage, thumbnail]) => {
      const originalImgData = originalImageSize(image)
      return ({
        fullImage,
        thumbnail,
        height: originalImgData.height,
        width: originalImgData.width,
        type: image?.mime?.split('/')?.[0],
      })
    })
};

const uploadImages = async (images, authContext, setUploadedCount = () => {}, cancelRequest = () => {}) => new Promise((resolve, reject) => {
  const responses = [];
  const source = axios.CancelToken.source();
  cancelRequest(source);

  getImagePreSignedURL({ count: images?.length * 2 }, authContext, source.token).then(async (responsePresignedURLS) => {
    const preSignedUrls = await _.chunk(responsePresignedURLS?.payload?.preSignedUrls, 2);
    if (preSignedUrls?.length > 0) {
      setUploadedCount(0, images.length);
      const getAssetsURLS = ({ currentCount = 0 }) => {
        if (currentCount !== images?.length) {
          uploadImage(images?.[currentCount], authContext, source?.token, preSignedUrls[currentCount]).then((res) => {
            setUploadedCount(currentCount + 1, images?.length, res)
            responses.push(res);
            getAssetsURLS({ currentCount: currentCount + 1 })
          }).catch(() => reject(new Error('Uploading Error')))
        } else {
          resolve(responses);
        }
      }
      getAssetsURLS({ preSignedUrls });
    }
  });
});

export default uploadImages;
