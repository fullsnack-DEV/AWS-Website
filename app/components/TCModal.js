import React from 'react';
import {
  StyleSheet,
} from 'react-native';

import Modal from 'react-native-modal';

export default function TCModal({isShow,onBackdropPress,onRequestClose,child}) {
  return (

    <Modal
    isVisible={isShow}
    onBackdropPress={onBackdropPress}
    onRequestClose={onRequestClose}
    animationInTiming={300}
    animationOutTiming={800}
    backdropTransitionInTiming={10}
    backdropTransitionOutTiming={10}
    style={styles.modalStyle}>
      {child}
    </Modal>

  );
}

const styles = StyleSheet.create({

    modalStyle: {
        margin: 0,
      },

});
