import fs from 'react-native-fs';
import axios from 'axios';
// import ImageResizer from 'react-native-image-resizer';
import { decode as atob } from 'base-64';
import getImagePreSignedURL from '../api/Media';

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

export const uploadImageOnPreSignedUrls = async ({ url, uri, type }) => {
  const base64 = await fs.readFile(uri, 'base64');
  const imgBuffer = base64ToArrayBuffer(base64);
  const options = {
    method: 'PUT',
    url,
    timeout: 180000,
    headers: {
      'Content-Type': type,
      // 'Content-Type': `image/${type}`,
      'Content-Length': imgBuffer.length,
    },
    data: imgBuffer,
  };
  const response = await axios(options);
  if (response.status === 200) {
    return url.split('?')[0]
  }
  throw new Error('upoad-failed')
};

const uploadImage = (data, authContext) => {
  const image = {
    ...data,
    thumbURL: '',
    originalURL: '',
  };
  return getImagePreSignedURL({
    count: 2,
  }, authContext).then((response) => {
    const preSignedUrls = response.payload.preSignedUrls || [];
    if (preSignedUrls.length !== 2) {
      throw new Error('failed-presigned-url')
    }
    return Promise.all([
      uploadImageOnPreSignedUrls({
        url: preSignedUrls[0],
        uri: image.path,
        type: image.mime,
        // type: image.path.split('.')[1] || 'jpeg',
      }),
      // FIXME: resize image here.
      uploadImageOnPreSignedUrls({
        url: preSignedUrls[1],
        uri: image.path,
        type: image.mime,
        // type: image.path.split('.')[1] || 'jpeg',
      }),
    ]).then(([fullImage, thumbnail]) => ({
      fullImage,
      thumbnail,
      height: image.height,
      width: image.width,
      type: image.mime.split('/')[0],
    }))
  });
};

const uploadImages = async (images, authContext, cb = () => {}) => {
  let completed = 0;
  const promises = [];
  images.forEach((item) => promises.push(uploadImage(item, authContext)));
  cb(0, images.length);
  for (const promise of promises) {
    // eslint-disable-next-line no-loop-func
    promise.then((image) => {
      completed += 1;
      cb(completed, images.length, image);
    });
  }
  return Promise.all(promises);
};

export default uploadImages;
