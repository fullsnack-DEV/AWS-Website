// @flow
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Dimensions, Platform} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';

import colors from '../Constants/Colors';
import {ModalTypes} from '../Constants/GeneralConstants';
import images from '../Constants/ImagePath';
import ScreenHeader from './ScreenHeader';

const renderBackdrop = (props) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={1}
    style={styles.backdropStyle}
    opacity={6}
  />
);

const layout = Dimensions.get('window');

const CustomModalWrapper = ({
  loading = false,
  isVisible = false,
  title = '',
  containerStyle = {},
  closeModal = () => {},
  onRightButtonPress = () => {},
  headerRightButtonText = '',
  modalType = ModalTypes.default,
  headerStyle = {},
  children = null,
  isFullTitle = false,
  headerLeftIconStyle = {},
  backIcon = null,
  externalSnapPoints = [],
  rightIcon1 = null,
  rightIcon1Press = () => {},
  rightIcon2 = null,
  rightIcon2Press = () => {},
  iconContainerStyle = {},
  showSportIcon = false,
  sportIcon = null,
}) => {
  const modalRef = useRef();
  const navigation = useNavigation();
  const [topMargin, setTopMargin] = useState(50);

  useEffect(() => {
    if (isVisible) {
      const type = navigation.getState().type;

      if (type === 'tab') {
        setTopMargin(
          Platform.OS === 'android'
            ? layout.height * 0.1
            : layout.height * 0.15,
        );
      } else {
        setTopMargin(
          Platform.OS === 'android'
            ? layout.height * 0.049
            : layout.height * 0.05,
        );
      }
    }
  }, [isVisible, navigation]);

  const snapPoints = useMemo(() => {
    switch (modalType) {
      case ModalTypes.style5:
        return [layout.height - topMargin, layout.height * 0.66];

      case ModalTypes.style6:
      case ModalTypes.style7:
        return [
          layout.height - (topMargin + 10),
          layout.height - (topMargin + 10),
        ];

      case ModalTypes.style9:
      case ModalTypes.style10:
        return [
          layout.height - (topMargin + 20),
          layout.height - (topMargin + 20),
        ];

      default:
        return [layout.height - topMargin, layout.height - topMargin];
    }
  }, [modalType]);

  const getModalHeader = () => {
    switch (modalType) {
      case ModalTypes.style1:
      case ModalTypes.style6:
      case ModalTypes.style10:
        return (
          <ScreenHeader
            leftIcon={backIcon ?? images.crossImage}
            leftIconPress={() => {
              modalRef?.current?.dismiss();
              closeModal();
            }}
            title={title}
            isRightIconText
            rightButtonText={headerRightButtonText}
            onRightButtonPress={onRightButtonPress}
            loading={loading}
            isFullTitle={isFullTitle}
            leftIconStyle={headerLeftIconStyle}
            containerStyle={headerStyle}
            showSportIcon={showSportIcon}
            sportIcon={sportIcon}
          />
        );

      case ModalTypes.style2:
      case ModalTypes.style5:
      case ModalTypes.style7:
      case ModalTypes.style9:
        return <View style={styles.handle} />;

      case ModalTypes.style3:
        return (
          <ScreenHeader
            rightIcon1={images.crossImage}
            rightIcon1Press={() => {
              modalRef?.current?.dismiss();
              closeModal();
            }}
            containerStyle={headerStyle}
          />
        );

      case ModalTypes.style8:
        return (
          <ScreenHeader
            title={title}
            rightIcon1={images.crossImage}
            rightIcon1Press={() => {
              modalRef?.current?.dismiss();
              closeModal();
            }}
            containerStyle={headerStyle}
          />
        );

      default:
        if (title) {
          return (
            <>
              <View style={[styles.handle, {marginBottom: 0}]} />
              <ScreenHeader
                title={title}
                rightIcon1={rightIcon1}
                rightIcon1Press={rightIcon1Press}
                rightIcon2={rightIcon2}
                rightIcon2Press={rightIcon2Press}
                iconContainerStyle={iconContainerStyle}
                containerStyle={headerStyle}
              />
            </>
          );
        }
        return <View style={styles.handle} />;
    }
  };

  useEffect(() => {
    if (isVisible) {
      modalRef?.current?.present();
    } else {
      modalRef?.current?.dismiss();
    }
  }, [isVisible]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        onDismiss={() => {
          modalRef?.current?.dismiss();
          closeModal();
        }}
        ref={modalRef}
        backgroundStyle={styles.bottomSheetStyle}
        index={1}
        snapPoints={
          externalSnapPoints.length > 0 ? externalSnapPoints : snapPoints
        }
        enablePanDownToClose
        enableDismissOnClose
        backdropComponent={renderBackdrop}
        handleComponent={() => getModalHeader()}
        keyboardBehavior={Platform.OS === 'ios' ? 'extend' : 'interactive'}
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize">
        {/* {Platform.OS === 'android' && (
          <StatusBar
            backgroundColor={colors.modalBackgroundColor}
            barStyle="light-content"
          />
        )} */}
        <View style={[styles.parent, containerStyle]}>{children}</View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  parent: {
    padding: 25,
  },
  backdropStyle: {
    backgroundColor: colors.modalBackgroundColor,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomSheetStyle: {
    borderRadius: 10,
    paddingTop: 0,
  },
  handle: {
    backgroundColor: colors.modalHandleColor,
    width: 40,
    height: 5,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 5,
  },
});

export default CustomModalWrapper;
