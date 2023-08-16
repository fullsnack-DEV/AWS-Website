// @flow
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  Animated,
  Pressable,
  InteractionManager,
} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
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
  isSwipeUp = false,
  showBackButton = false,
  ratio = 2.5,
  parentStyle = {},
  isFullTitle = false,
  headerLeftIconStyle = {},
}) => {
  const [isFullHeight, setIsFullHeight] = useState(isSwipeUp);
  const translateY = new Animated.Value(0);
  let isGestureActive = false;

  const SWIPE_THRESHOLD = 50;

  const onPanGestureEvent = Animated.event(
    [{nativeEvent: {translationY: translateY}}],
    {
      useNativeDriver: false,
      listener: (event) => {
        if (event.nativeEvent.translationY <= 0) {
          translateY.setValue(0);

          if (isSwipeUp && event.nativeEvent.translationY < -SWIPE_THRESHOLD) {
            setIsFullHeight(true);
            translateY.setValue(0);
          }
        } else if (event.nativeEvent.translationY > 0) {
          translateY.setValue(event.nativeEvent.translationY);
        }
      },
    },
  );

  const onPanGestureStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      isGestureActive = true;
    } else if (event.nativeEvent.state === State.END) {
      if (isGestureActive) {
        isGestureActive = false;
        if (event.nativeEvent.translationY > 0) {
          handleCloseModal();
        } else {
          InteractionManager.runAfterInteractions(() => {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          });
        }
      }
    }
  };

  useEffect(() => {
    setIsFullHeight(false);
  }, [isVisible]);

  const handleCloseModal = () => {
    closeModal();
  };

  const getModalHeader = () => {
    switch (modalType) {
      case ModalTypes.style1:
      case ModalTypes.style4:
        return (
          <ScreenHeader
            leftIcon={showBackButton ? images.backArrow : images.crossImage}
            leftIconPress={handleCloseModal}
            title={title}
            isRightIconText
            rightButtonText={headerRightButtonText}
            onRightButtonPress={onRightButtonPress}
            loading={loading}
            containerStyle={styles.headerStyle}
            isFullTitle={isFullTitle}
            leftIconStyle={headerLeftIconStyle}
          />
        );

      case ModalTypes.style2:
      case ModalTypes.style7:
        return <View style={styles.handle} />;

      case ModalTypes.style3:
        return (
          <ScreenHeader
            rightIcon2={images.crossImage}
            rightIcon2Press={handleCloseModal}
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
            rightIcon2Press={handleCloseModal}
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
    if (isFullHeight) {
      const animatedTranslateY = new Animated.Value(300);

      const animatedStyle = {
        transform: [
          {
            translateY: animatedTranslateY,
          },
        ],
      };

      Animated.timing(animatedTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      return [styles.card, animatedStyle];
    }

    switch (modalType) {
      case ModalTypes.style1:
        return [styles.card, {flex: 1}, parentStyle];

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

  return (
    <Modal
      visible={isVisible}
      collapsable
      transparent
      animationType="fade"
      onRequestClose={handleCloseModal}>
      <GestureHandlerRootView style={{flex: 1}}>
        <Pressable
          style={[styles.parent, {paddingTop: Top}]}
          onPress={handleCloseModal}>
          {(modalType === ModalTypes.style7 ||
            modalType === ModalTypes.style2 ||
            modalType === ModalTypes.default) && (
            <PanGestureHandler
              onGestureEvent={onPanGestureEvent}
              onHandlerStateChange={onPanGestureStateChange}
              shouldCancelWhenOutside={false}>
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

                  <View
                    style={[
                      {
                        height: !isFullHeight
                          ? Dimensions.get('window').height -
                            Dimensions.get('window').height / ratio
                          : '100%',
                        padding: 25,
                      },
                      containerStyle,
                    ]}>
                    {children}
                  </View>
                </Pressable>
              </Animated.View>
            </PanGestureHandler>
          )}

          {modalType !== ModalTypes.style7 &&
            modalType !== ModalTypes.style2 &&
            modalType !== ModalTypes.default && (
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
                <Pressable onPress={() => {}} style={{flex: 1}}>
                  <View style={{flexDirection: 'row', alignSelf: 'stretch'}}>
                    {getModalHeader()}
                  </View>
                  <View style={[{padding: 25}, containerStyle]}>
                    {children}
                  </View>
                </Pressable>
              </Animated.View>
            )}
        </Pressable>
      </GestureHandlerRootView>
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
