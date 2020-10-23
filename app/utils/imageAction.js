import fs from 'react-native-fs';
import axios from 'axios';
// import ImageResizer from 'react-native-image-resizer';
import { decode as atob } from 'base-64';
import { getImagePreSignedURL } from '../api/NewsFeedapi';

const base64ToArrayBuffer = (base64) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const uploadImageOnPreSignedUrls = async ({ url, uri, type }) => {
  const base64 = await fs.readFile(uri, 'base64');
  const imgBuffer = base64ToArrayBuffer(base64);
  const options = {
    method: 'PUT',
    url,
    timeout: 180000,
    headers: {
      'Content-Type': `image/${type}`,
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

const uploadImage = ({ data }) => {
  const image = {
    ...data,
    thumbURL: '',
    originalURL: '',
  };
  return getImagePreSignedURL({
    count: 2,
  }).then((response) => {
    const preSignedUrls = response.payload.preSignedUrls || [];
    if (preSignedUrls.length !== 2) {
      throw new Error('failed-presigned-url')
    }
    return Promise.all([
      uploadImageOnPreSignedUrls({
        url: preSignedUrls[0],
        uri: image.path,
        type: image.path.split('.')[1] || 'jpeg',
      }),
      // FIXME: resize image here.
      // FIXME: handle ios and android specific path
      uploadImageOnPreSignedUrls({
        url: preSignedUrls[1],
        uri: image.path,
        type: image.path.split('.')[1] || 'jpeg',
      }),
    ]).then(([fullImage, thumbnail]) => ({ fullImage, thumbnail }))
  });
};

const uploadImages = async (images, cb) => {
  let completed = 0;
  const promises = [];
  images.forEach((item) => promises.push(uploadImage(item)));
  cb(0, images.length);
  // eslint-disable-next-line no-restricted-syntax
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
