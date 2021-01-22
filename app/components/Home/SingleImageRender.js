import React, { useState } from 'react';
import {
  StyleSheet, View, TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SingleImageModal from '../newsFeed/SingleImageModal';
import colors from '../../Constants/Colors';

function SingleImageRender({ data }) {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.imagesViewStyle}>
      <TouchableWithoutFeedback
        onPress={() => {
          toggleModal();
        }}
        style={styles.imagesViewStyle}>
        <FastImage
            style={ styles.imageStyle }
            source={{ uri: data.attachments[0].thumbnail }}
            resizeMode={ FastImage.resizeMode.cover }
        />
      </TouchableWithoutFeedback>
      <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        style={{ margin: 0 }}
        supportedOrientations={['portrait', 'landscape']}
        backdropOpacity={0}>
        <SingleImageModal
            uploadImageURL={data.attachments[0].thumbnail}
            backBtnPress={() => setModalVisible(false)}
            data={data}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: wp(32.3),
    width: wp(32.3),
  },
  imagesViewStyle: {
    flexDirection: 'row',
    margin: 1.5,
    borderWidth: 0.5,
    borderColor: colors.disableColor,
    height: wp(32.3),
    width: wp(32.3),
  },
});

export default SingleImageRender;
