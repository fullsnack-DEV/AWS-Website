import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {LinkPreview} from '@flyerhq/react-native-link-preview';
import colors from '../../Constants/Colors';

import fonts from '../../Constants/Fonts';

const urlRegex =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gim;

const addStr = (str, index, stringToAdd) =>
  str.substring(0, index) + stringToAdd + str.substring(index, str.length);

const CustomURLPreview = ({text}) => {
  let desc = text;

  const position = desc?.search && desc?.search(urlRegex);
  if (position !== -1 && desc?.substring(position)?.startsWith('www')) {
    desc = addStr(text, position, 'http://');
  }
  if (position === -1) {
    return null;
  }
  return (
    <LinkPreview
      text={desc}
      containerStyle={{}}
      renderLinkPreview={({previewData}) => (
        <View>
          {previewData?.image?.url && (
            <View style={styles.previewImageStyle}>
              <Image
                source={{uri: previewData.image.url}}
                style={styles.previewImage}
              />
            </View>
          )}
          <View style={styles.previewTextContainerStyle}>
            <Text style={styles.previewTitleStyle} numberOfLines={2}>
              {previewData?.title}
            </Text>
            <Text style={styles.previewDescription} numberOfLines={1}>
              {previewData?.description}
            </Text>
            <Text style={styles.previewLink} numberOfLines={1}>
              {previewData?.image?.url}
            </Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  previewImageStyle: {
    height: 175,
    alignItems: 'center',

    marginBottom: 15,
  },
  previewTextContainerStyle: {
    // marginBottom: 15,
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
  previewLink: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RRegular,
    color: colors.linkGrey,
    marginTop: 5,
  },
  previewImage: {
    height: '100%',
    width: wp('100%'),
    backgroundColor: 'red',
    resizeMode: 'cover',
  },
});

export default CustomURLPreview;
