import React from 'react';

import {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import colors from '../Constants/Colors';

const ModalBackDrop = (props) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={1}
    style={{
      backgroundColor: colors.modalBackgroundColor,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }}
    opacity={6}
  />
);

export default ModalBackDrop;
