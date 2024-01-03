// @flow
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import {useMessageInputContext} from 'stream-chat-react-native';
import * as Progress from 'react-native-progress';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import {widthPercentageToDP as wp} from '../../../utils';
import {strings} from '../../../../Localization/translation';

const CustomImageUploadPreview = () => {
  const {
    imageUploads,
    setImageUploads,
    removeImage,
    fileUploads,
    setFileUploads,
    removeFile,
  } = useMessageInputContext();

  let imageState;
  if (imageUploads.length > 0) {
    setImageUploads(imageUploads);
    imageUploads.forEach((item) => {
      imageState = item.state;
    });
  }

  if (fileUploads.length > 0) {
    setFileUploads(fileUploads);
    fileUploads.forEach((item) => {
      imageState = item.state;
    });
  }

  const CancelImageUpload = (list, removalFunction) => {
    list.forEach((item) => {
      removalFunction(item.id);
    });
  };

  const imageUploadView = () => {
    if (imageUploads.length > 0) {
      const uploadedImageCount = imageUploads.filter(
        (item) => item.state === 'uploaded',
      ).length;

      return (
        <View style={styles.parent}>
          <View style={styles.row}>
            <Image
              style={styles.image}
              source={{
                uri: imageUploads[0].url ?? imageUploads[0].thumb_url,
              }}
              onPress={() => {
                CancelImageUpload(imageUploads, removeImage);
              }}
            />
            <Text>
              {imageState === 'uploading'
                ? `${strings.uploadingText}... ${uploadedImageCount + 1}/${
                    imageUploads.length
                  }`
                : strings.uploadedText}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                CancelImageUpload(imageUploads, removeImage);
              }}>
              <Image
                style={{width: 12, height: 12}}
                source={images.crossSingle}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  const fileUploadView = () => {
    if (fileUploads.length > 0) {
      const uploadedVideoCount = fileUploads.filter(
        (item) => item.state === 'uploaded',
      ).length;

      return (
        <View style={styles.parent}>
          <View style={styles.row}>
            <Image
              style={styles.image}
              source={{
                uri: fileUploads[0].url ?? fileUploads[0].thumb_url,
              }}
              onPress={() => {
                CancelImageUpload(fileUploads, removeFile);
              }}
            />
            <Text>
              {imageState === 'uploading'
                ? `${strings.uploadingText}... ${uploadedVideoCount + 1}/${
                    fileUploads.length
                  }`
                : strings.uploadedVideoText}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                CancelImageUpload(fileUploads, removeFile);
              }}>
              <Image
                style={{width: 12, height: 12}}
                source={images.crossSingle}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <>
      {imageUploads.length > 0 || fileUploads.length > 0 ? (
        <View style={{marginBottom: imageState === 'uploading' ? 12 : 8}}>
          {imageUploads.length > 0 && imageUploadView()}
          {fileUploads.length > 0 &&
            imageUploads.length === 0 &&
            fileUploadView()}
          {imageState !== 'uploading' && (
            <View style={styles.chatSeparateLine} />
          )}

          {imageState === 'uploading' && (
            <View style={styles.bottomView}>
              <Progress.Bar
                width={wp(100)}
                height={5}
                borderRadius={5}
                borderWidth={0}
                color={'rgba(255, 138, 1, 0.6)'}
                unfilledColor={colors.grayBackgroundColor}
                indeterminate={true}
              />
            </View>
          )}
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  chatSeparateLine: {
    borderColor: colors.writePostSepratorColor,
    // marginTop: 15,
    borderWidth: 0.5,
    width: wp(15),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  bottomView: {
    position: 'absolute',
    bottom: -8,
    left: -10,
  },
});
export default CustomImageUploadPreview;
