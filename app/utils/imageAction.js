import fs from 'react-native-fs';
import axios from 'axios';
import { decode as atob } from 'base-64';
import ImageResizer from 'react-native-image-resizer';
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
    console.log(`image width  ::${img.width} image height  ::${img.height}`);
      return img
  }
    if (imageData.width > T_PORTRAIT_IMAGE_WIDTH) {
      img.height = parseInt((imageData.height / imageData.width) * T_PORTRAIT_IMAGE_WIDTH, 10)
      img.width = T_PORTRAIT_IMAGE_WIDTH
    } else {
      img.height = imageData.height
      img.width = imageData.width
    }
    console.log(`image width  ::${img.width} image height  ::${img.height}`);
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
    console.log(`image width  ::${img.width} image height  ::${img.height}`);
      return img
  }
    if (imageData.width > O_PORTRAIT_IMAGE_WIDTH) {
      img.height = parseInt((imageData.height / imageData.width) * O_PORTRAIT_IMAGE_WIDTH, 10)
      img.width = O_PORTRAIT_IMAGE_WIDTH
    } else {
      img.height = imageData.height
      img.width = imageData.width
    }
    console.log(`image width  ::${img.width} image height  ::${img.height}`);
      return img

  // const heightRatio = imageData.height > 400 ?
}
const uploadImage = async (data, authContext, cancelToken) => {
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

  return getImagePreSignedURL({ count: 2 }, authContext, cancelToken).then((response) => {
    const preSignedUrls = response.payload.preSignedUrls || [];
    if (preSignedUrls.length !== 2) {
      throw new Error('failed-presigned-url')
    }
    const promises = [uploadImageOnPreSignedUrls({
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
  });
};

const uploadImages = (images, authContext, cb = () => {}, cancelRequest = () => {}) => new Promise((resolve) => {
  let completed = 0;
  const promises = [];
  const source = axios.CancelToken.source();
  cancelRequest(source);
  images.forEach((item) => promises.push(uploadImage(item, authContext, source.token)));
  cb(0, images.length);
  for (const promise of promises) {
    // eslint-disable-next-line no-loop-func
    promise.then((image) => {
      completed += 1;
      cb(completed, images.length, image);
    });
  }
  resolve(Promise.all(promises));
});

export default uploadImages;
