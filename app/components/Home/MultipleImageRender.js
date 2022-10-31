import React, {useState} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import MultipleImageModal from '../newsFeed/MultipleImageModal';

function MultipleImageRender({data}) {
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
          style={styles.imageStyle}
          source={{uri: data.attachments[0].thumbnail}}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableWithoutFeedback>
      <Image
        style={styles.multiImageIconStyle}
        source={images.multipleImagesIcon}
      />
      <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        style={{margin: 0}}
        backdropOpacity={0}>
        <MultipleImageModal
          attachedImages={data.attachments.length > 0 ? data.attachments : []}
          backBtnPress={() => setModalVisible(false)}
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
    marginTop: 0,
    borderWidth: 0.5,
    borderColor: colors.disableColor,
    height: wp(32.3),
    width: wp(32.3),
  },
  multiImageIconStyle: {
    width: 15,
    height: 15,
    position: 'absolute',
    right: 5,
    top: 5,
  },
});

export default MultipleImageRender;
