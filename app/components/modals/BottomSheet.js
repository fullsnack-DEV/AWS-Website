// @flow
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const BottomSheet = ({
  isVisible = false,
  closeModal = () => {},
  optionList = [],
  optionSubTextsList = [],
  onSelect = () => {},
  itemStyle = {},
  cardStyle = {},
  title = '',
  subTitle = '',
  headerStyle = {},
  headerTitleStyle = {},
  separatorLineStyle = {},
  textStyle = {},
  cancelButtonContainerStyle = {},
  cancelButtonTextStyle = {},
}) => {
  const [optionsWithSubText, setOptionsWithSubText] = useState([]);

  useEffect(() => {
    if (isVisible && optionSubTextsList.length > 0) {
      const updatedList = optionList.map((item, index) => {
        const obj = {
          label: item,
          subText: optionSubTextsList[index],
        };
        return obj;
      });
      setOptionsWithSubText(updatedList);
    }
  }, [isVisible, optionList, optionSubTextsList]);

  const renderView = () => {
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.parent}>
          <View style={[styles.card, cardStyle]}>
            {title && (
              <>
                <View style={[styles.buttonContainer, headerStyle]}>
                  <Text style={[styles.title, headerTitleStyle]}>{title}</Text>
                  {subTitle && (
                    <Text style={[styles.subTitle, {textAlign: 'center'}]}>
                      {subTitle}
                    </Text>
                  )}
                </View>
                <View style={[styles.dividor, separatorLineStyle]} />
              </>
            )}

            {optionList.map((item, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={[styles.buttonContainer, itemStyle]}
                  onPress={() => onSelect(item, index)}>
                  <Text
                    style={[
                      styles.buttonText,
                      item?.includes('Delete') ? {color: colors.redColor} : {},
                      textStyle,
                    ]}>
                    {optionsWithSubText.length > 0 ? item.label : item}
                  </Text>
                  {optionsWithSubText.length > 0 && (
                    <Text
                      style={[
                        styles.subTitle,
                        {color: colors.neonBlue, textAlign: 'center'},
                      ]}>
                      {item.subText}
                    </Text>
                  )}
                </TouchableOpacity>
                {index !== optionList.length - 1 && (
                  <View style={[styles.dividor, separatorLineStyle]} />
                )}
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.buttonContainer,
              {backgroundColor: colors.whiteColor, borderRadius: 12},
              cancelButtonContainerStyle,
            ]}
            onPress={closeModal}>
            <Text
              style={[
                styles.buttonText,
                {fontFamily: fonts.RBold},
                cancelButtonTextStyle,
              ]}>
              {strings.cancel}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (Platform.OS === 'android') {
      return (
        <View style={[styles.parent, cardStyle]}>
          <View style={styles.handle} />
          {title && (
            <View style={[{marginBottom: 30}, headerStyle]}>
              <Text style={[styles.title, headerTitleStyle]}>{title}</Text>
              {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
            </View>
          )}

          {optionList.map((item, index) => (
            <TouchableOpacity
              style={[
                {marginBottom: index !== optionList.length - 1 ? 30 : 0},
                itemStyle,
              ]}
              key={index}
              onPress={() => onSelect(item, index)}>
              <Text style={[styles.androidButtonText, textStyle]}>
                {optionsWithSubText.length > 0 ? item.label : item}
              </Text>
              {optionsWithSubText.length > 0 && (
                <Text style={styles.subTitle}>{item.subText}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return null;
  };

  if (optionList.length > 0) {
    return (
      <Modal
        isVisible={isVisible}
        onBackButtonPress={closeModal}
        onBackdropPress={closeModal}
        avoidKeyboard
        backdropColor={colors.blackColor}
        deviceWidth={Dimensions.get('window').width}
        swipeDirection={['down']}
        onSwipeComplete={closeModal}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}>
        {renderView()}
      </Modal>
    );
  }

  if (title) {
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.parent}>
          <View style={[styles.card, cardStyle]}>
            <View style={[styles.buttonContainer, headerStyle]}>
              <Text style={[styles.title, headerTitleStyle]}>{title}</Text>
              {subTitle && (
                <Text style={[styles.subTitle, {textAlign: 'center'}]}>
                  {subTitle}
                </Text>
              )}
            </View>
          </View>
        </View>
      );
    }

    if (Platform.OS === 'android') {
      return (
        <View style={[styles.parent, cardStyle]}>
          <View style={styles.handle} />
          <View style={headerStyle}>
            <Text style={[styles.title, headerTitleStyle]}>{title}</Text>
            {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
          </View>
        </View>
      );
    }
  }
  return null;
};

const styles = StyleSheet.create({
  parent: Platform.select({
    ios: {
      marginBottom: 50,
      marginHorizontal: 8,
    },
    android: {
      backgroundColor: colors.whiteColor,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      paddingHorizontal: 25,
      paddingBottom: 50,
      elevation: 5,
    },
  }),
  card: Platform.select({
    ios: {
      backgroundColor: colors.iosActionSheetBgColor,
      borderRadius: 12,
      marginBottom: 10,
    },
    android: {},
  }),
  buttonContainer: {
    paddingHorizontal: 25,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RRegular,
    color: colors.neonBlue,
  },
  handle: {
    backgroundColor: colors.modalHandleColor,
    width: 40,
    height: 5,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 5,
    marginBottom: 25,
  },
  androidButtonText: {
    fontSize: 17,
    lineHeight: 25,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  dividor: {
    height: 1,
    backgroundColor: colors.userPostTimeColor,
  },
  title: {
    fontSize: 17,
    lineHeight: 25,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  subTitle: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
export default BottomSheet;
