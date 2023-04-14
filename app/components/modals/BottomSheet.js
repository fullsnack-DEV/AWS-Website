// @flow
import React from 'react';
import {View, StyleSheet, Text, Modal, Pressable, Platform} from 'react-native';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const BottomSheet = ({
  isVisible = false,
  closeModal = () => {},
  optionList = [],
  onSelect = () => {},
}) => {
  if (optionList.length > 0) {
    if (Platform.OS === 'ios') {
      return (
        <Modal visible={isVisible} transparent animationType="slide">
          <Pressable style={styles.modalParent} onPress={closeModal}>
            <Pressable style={styles.card} onPress={() => {}}>
              {optionList.map((item, index) => (
                <View key={index}>
                  <Pressable
                    style={styles.modalButtonContainer}
                    onPress={() => onSelect(item)}>
                    <Text style={styles.modalButtonText}>{item}</Text>
                  </Pressable>
                  <View style={styles.modalLineSeparator} />
                </View>
              ))}
            </Pressable>
            <Pressable style={styles.modalCancelButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>{strings.cancel}</Text>
            </Pressable>
          </Pressable>
        </Modal>
      );
    }

    if (Platform.OS === 'android') {
      return (
        <Modal visible={isVisible} transparent animationType="fade">
          <Pressable style={styles.modalParent} onPress={closeModal}>
            <Pressable style={styles.cardAndroid} onPress={() => {}}>
              {optionList.map((item) => (
                <>
                  <Pressable
                    style={styles.modalButtonContainerAndroid}
                    onPress={() => onSelect(item)}>
                    <Text style={styles.modalButtonTextAndroid}>{item}</Text>
                  </Pressable>
                  <View style={styles.modalLineSeparator} />
                </>
              ))}
            </Pressable>
          </Pressable>
        </Modal>
      );
    }
  }
  return null;
};

const styles = StyleSheet.create({
  modalParent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  card: {
    marginHorizontal: 15,
    marginBottom: 6,
    backgroundColor: colors.lightWhite,
    opacity: 0.96,
    borderRadius: 13,
  },
  cardAndroid: {
    backgroundColor: colors.lightWhite,
    paddingVertical: 15,
    paddingHorizontal: 18,
  },
  modalButtonContainer: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonContainerAndroid: {
    paddingVertical: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.eventBlueColor,
  },
  modalButtonTextAndroid: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  modalLineSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#09141F',
    opacity: 0.13,
  },
  modalCancelButton: {
    backgroundColor: colors.whiteColor,
    marginHorizontal: 15,
    marginBottom: 35,
    borderRadius: 13,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default BottomSheet;
