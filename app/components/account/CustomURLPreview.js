import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import RNUrlPreview from 'react-native-url-preview';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const urlRegex =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gim;

const addStr = (str, index, stringToAdd) =>
  str.substring(0, index) + stringToAdd + str.substring(index, str.length);

const CustomURLPreview = ({text}) => {
  let desc = text;

  const position = desc?.search(urlRegex);
  if (position !== -1 && desc?.substring(position)?.startsWith('www')) {
    desc = addStr(text, position, 'http://');
  }

  return (
    <RNUrlPreview
      text={desc}
      containerStyle={styles.previewContainerStyle}
      imageProps={styles.previewImageStyle}
      textContainerStyle={styles.previewTextContainerStyle}
      titleStyle={styles.previewTitleStyle}
      descriptionStyle={styles.previewDescription}
      descriptionNumberOfLines={2}
    />
  );
};

const styles = StyleSheet.create({
  previewContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 15,
  },
  previewImageStyle: {
    width: Dimensions.get('screen').width - 35,
    borderRadius: 10,
    height: 175,
  },
  previewTextContainerStyle: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  previewTitleStyle: {
    fontSize: 14,
    lineHeight: 19,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  previewDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.placeHolderColor,
    fontFamily: fonts.RRegular,
  },
});

export default CustomURLPreview;
