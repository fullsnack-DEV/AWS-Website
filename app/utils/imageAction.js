import { RNS3 } from 'react-native-s3-upload';

const uploadImage = ({ image }) => () => {
  const str = image.uri.split('/');
  image.name = `${new Date().getTime()}-${str[str.length - 1]}`;
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
      if (response.status !== 201) { throw new Error('Failed to upload image to S3'); }
      return Promise.resolve(image.name);
    });
  } catch (error) {
    console.log({ file, error });
  }
};

export default uploadImage;
