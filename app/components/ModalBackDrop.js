import React from 'react';

import {StyleSheet} from 'react-native';
import {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import colors from '../Constants/Colors';

const ModalBackDrop = (props) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={1}
    style={styles.backdropStyle}
    opacity={6}
  />
);

const styles = StyleSheet.create({
  backdropStyle: {
    backgroundColor: colors.modalBackgroundColor,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ModalBackDrop;
