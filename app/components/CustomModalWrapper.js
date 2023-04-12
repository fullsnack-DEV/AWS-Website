// @flow
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Modal, Dimensions, Animated} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import colors from '../Constants/Colors';
import {ModalTypes} from '../Constants/GeneralConstants';
import images from '../Constants/ImagePath';
import ScreenHeader from './ScreenHeader';

const screenHeight = Dimensions.get('window').height;
const CustomModalWrapper = ({
  loading = false,
  isVisible = false,
  title = '',
  containerStyle = {},
  closeModal = () => {},
  onRightButtonPress = () => {},
  headerRightButtonText = '',
  modalType = ModalTypes.default,
  headerBottomBorderColor = colors.grayBackgroundColor,
  children = null,
  Top = 50
}) => {
  const [showModal, setShowModal] = useState(false);
  const translateY = new Animated.Value(0);
  const onPanGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationY: translateY,
        },
      },
    ],
    {useNativeDriver: true},
  );

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setShowModal(true);
      }, 200);
    }
  }, [isVisible]);

  const handleCloseModal = () => {
    closeModal();
    setShowModal(false);
  };

  const getModalHeader = () => {
    switch (modalType) {
      case ModalTypes.style1:
        return (
          <ScreenHeader
            leftIcon={images.crossImage}
            leftIconPress={() => handleCloseModal()}
            title={title}
            isRightIconText
            rightButtonText={headerRightButtonText}
            onRightButtonPress={onRightButtonPress}
            loading={loading}
            containerStyle={styles.headerStyle}
          />
        );

      case ModalTypes.style2:
      case ModalTypes.style7:
        return <View style={styles.handle} />;

      case ModalTypes.style3:
        return (
          <ScreenHeader
            rightIcon2={images.crossImage}
            rightIcon2Press={() => handleCloseModal()}
            containerStyle={[styles.headerStyle, {paddingRight: 15}]}
          />
        );

      case ModalTypes.style6:
      case ModalTypes.style8:
        return (
          <ScreenHeader
            title={title}
            rightIcon2={images.crossImage}
            rightIcon2Press={() => handleCloseModal()}
            containerStyle={[
              styles.headerStyle,
              {paddingRight: 15},
              modalType === ModalTypes.style8
                ? {
                    borderBottomColor: headerBottomBorderColor,
                    borderBottomWidth: 2,
                  }
                : {},
            ]}
          />
        );

      default:
        return <View style={styles.handle} />;
    }
  };

  const getCardStyle = () => {
    switch (modalType) {
      case ModalTypes.style1:
        return [styles.card, {flex: 1}];

      case ModalTypes.style2:
      case ModalTypes.style3:
        return styles.card;

      case ModalTypes.style5:
        return [styles.card, {height: screenHeight * 0.66}];

      default:
        return [styles.card, {flex: 1}];
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={() => handleCloseModal()}>
      <View
        style={[
          styles.parent,
            {paddingTop: Top}
        ]}>
        {showModal && (
          <PanGestureHandler
            onGestureEvent={onPanGestureEvent}
            onEnded={() => handleCloseModal()}>
            <Animated.View
              style={[
                getCardStyle(),
                {
                  transform: [
                    {
                      translateY,
                    },
                  ],
                },
              ]}>
              {getModalHeader()}
              <View style={[{padding: 25}, containerStyle]}>{children}</View>
            </Animated.View>
          </PanGestureHandler>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: colors.modalBackgroundColor,
    paddingTop: 50,
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.whiteColor,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  handle: {
    backgroundColor: colors.modalHandleColor,
    width: 40,
    height: 5,
    marginTop: 12,
    alignSelf: 'center',
    borderRadius: 5,
  },
  headerStyle: {
    paddingLeft: 15,
    paddingTop: 15,
    paddingRight: 17,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorderColor,
  },
});
export default CustomModalWrapper;
