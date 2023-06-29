import {Text} from 'react-native';
import React from 'react';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';

export default function EditFilterModal({visible, onClose}) {
  return (
    <CustomModalWrapper
      isVisible={visible}
      closeModal={onClose}
      modalType={ModalTypes.style1}>
      <Text> Thisis the Filter Modal </Text>
    </CustomModalWrapper>
  );
}
