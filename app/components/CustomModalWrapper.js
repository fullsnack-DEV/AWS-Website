// @flow
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';
import {
  gestureHandlerRootHOC,
  PanGestureHandler,
} from 'react-native-gesture-handler';
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
  Top = 50,
  showBackButton = false,
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
      }, 30);
    }
  }, [isVisible]);

  const handleCloseModal = () => {
    closeModal();
    setShowModal(false);
  };

  const getModalHeader = () => {
    switch (modalType) {
      case ModalTypes.style1:
      case ModalTypes.style4:
        return (
          <ScreenHeader
            leftIcon={showBackButton ? images.backArrow : images.crossImage}
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
            title={title}
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
      case ModalTypes.style4:
        return styles.card;

      case ModalTypes.style5:
        return [styles.card, {height: screenHeight * 0.66}];

      default:
        return [styles.card, {flex: 1}];
    }
  };

  const ModalChildWithHoc = gestureHandlerRootHOC(() => (
    <Pressable
      style={[styles.parent, {paddingTop: Top}]}
      onPress={() => {
        handleCloseModal();
      }}>
      {(modalType === ModalTypes.style7 ||
        modalType === ModalTypes.style2 ||
        modalType === ModalTypes.default) &&
      showModal ? (
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
            <Pressable onPress={() => {}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'stretch',
                  justifyContent: 'center',
                }}>
                {getModalHeader()}
              </View>

              <View style={[{padding: 25}, containerStyle]}>{children}</View>
            </Pressable>
          </Animated.View>
        </PanGestureHandler>
      ) : (
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
          <Pressable onPress={() => {}} style={{}}>
            <View style={{flexDirection: 'row', alignSelf: 'stretch'}}>
              {getModalHeader()}
            </View>
            <View style={[{padding: 25}, containerStyle]}>{children}</View>
          </Pressable>
        </Animated.View>
      )}
    </Pressable>
  ));

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={() => handleCloseModal()}>
      <ModalChildWithHoc />
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
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
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
    height: '100%',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorderColor,
  },
});
export default CustomModalWrapper;
