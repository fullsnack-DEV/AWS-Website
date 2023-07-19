// @flow
import React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {
  AutoCompleteInput,
  useMessageInputContext,
} from 'stream-chat-react-native';
import * as Progress from 'react-native-progress';
import colors from '../../../Constants/Colors';
import {widthPercentageToDP as wp} from '../../../utils';
import images from '../../../Constants/ImagePath';

const CancelFileUpload = (files, removeFile) => {
  files.forEach((item) => {
    removeFile(item.id);
  });
};

const CustomFileUploadPreview = () => {
  const {fileUploads, setFileUploads, numberOfUploads, removeFile} =
    useMessageInputContext();

  setFileUploads(fileUploads);
  let fileState;
  fileUploads.forEach((item) => {
    fileState = item.state;
  });

  return (
    <>
      {fileUploads.length > 0 ? (
        <View style={{marginBottom: fileState === 'uploading' ? 12 : 8}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 5,
              paddingVertical: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{width: 28, height: 28, marginRight: 10}}
                source={{uri: fileUploads[0].url}}
                onPress={() => {
                  CancelFileUpload(fileUploads, removeFile);
                }}
              />
              <Text>
                {fileState === 'uploading' ? 'Uploading' : 'Uploaded'} :{' '}
                {numberOfUploads}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  CancelFileUpload(fileUploads, removeFile);
                }}>
                <Image
                  style={{width: 12, height: 12}}
                  source={images.crossSingle}
                />
              </TouchableOpacity>
            </View>
          </View>
          {fileState !== 'uploading' && (
            <View style={styles.chatSeparateLine} />
          )}

          {fileState === 'uploading' && (
            <View style={{position: 'absolute', bottom: -8, left: -10}}>
              <Progress.Bar
                progress={1}
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

const CustomInput = () => {
  const {sendMessage, toggleAttachmentPicker, ImageUploadPreview} =
    useMessageInputContext();
  return (
    <View style={styles.parent}>
      <ImageUploadPreview />
      <CustomFileUploadPreview />
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.cameraIcon}
          onPress={toggleAttachmentPicker}>
          <Image source={images.chatCamera} style={styles.image} />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <View style={{flex: 1}}>
            <AutoCompleteInput />
          </View>
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Image style={{width: 17, height: 19}} source={images.chatBtn} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraIcon: {
    width: 25,
    height: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  inputContainer: {
    flex: 1,
    height: 40,
    backgroundColor: colors.lightGrey,
    borderRadius: 25,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButton: {
    width: 30,
    height: 30,
    marginLeft: 10,
    backgroundColor: colors.themeColor,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default CustomInput;
