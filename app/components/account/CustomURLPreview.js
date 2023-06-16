import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {LinkPreview} from '@flyerhq/react-native-link-preview';
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
  if (position === -1) {
    return null;
  }
  return (
    <LinkPreview
      text={desc}
      containerStyle={{marginTop: 15}}
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
    borderRadius: 10,
    marginBottom: 15,
    width: Dimensions.get('screen').width - 30,
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
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default CustomURLPreview;
