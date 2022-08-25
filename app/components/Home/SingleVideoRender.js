import React, {useState} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, Image} from 'react-native';
import Video from 'react-native-video';
import Modal from 'react-native-modal';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import MultipleImageModal from '../newsFeed/MultipleImageModal';

function SingleVideoRender({data}) {
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
        <Video
          source={{uri: data.attachments[0].url}}
          style={styles.videoStyle}
          resizeMode={'cover'}
          paused={true}
        />
      </TouchableWithoutFeedback>
      <Image
        style={styles.multiImageIconStyle}
        source={images.galleryVideoIcon}
      />
      <Modal
        isVisible={isModalVisible}
        backdropColor="black"
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
  videoStyle: {
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiImageIconStyle: {
    width: 40,
    height: 40,
    position: 'absolute',
  },
});

export default SingleVideoRender;
