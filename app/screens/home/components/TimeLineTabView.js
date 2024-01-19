// @flow
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {strings} from '../../../../Localization/translation';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';

const tagList = [
  {key: Verbs.post, icon: images.postImageIcon},
  {key: Verbs.taggedPost, icon: images.postTagIcon},
];

const TimeLineTabView = ({
  postCount = 0,
  taggedPostCount = 0,
  selectedOption = Verbs.post,
  onSelect = () => {},
}) => {
  const getCount = (option) => {
    if (option === Verbs.post) {
      return postCount;
    }
    if (option === Verbs.taggedPost) {
      return taggedPostCount;
    }
    return 0;
  };
  return (
    <View style={styles.parent}>
      <Text style={styles.title}>{strings.postsTitleText}</Text>

      <View style={styles.switchContainer}>
        {tagList.map((item, index) => (
          <TouchableOpacity
            style={[
              styles.listItem,
              selectedOption === item.key
                ? {backgroundColor: colors.whiteColor}
                : {},
            ]}
            key={index}
            onPress={() => onSelect(item.key)}>
            <View style={styles.icon}>
              <Image source={item.icon} style={styles.image} />
            </View>
            <Text style={styles.countLabel}>{getCount(item.key)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingTop: 25,
    paddingBottom: 10,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    borderBottomColor: colors.grayBackgroundColor,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  switchContainer: {
    maxWidth: 100,
    flex: 1,
    height: 27,
    marginLeft: 10,
    borderRadius: 15,
    backgroundColor: colors.lightGrayBackground,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 2,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    padding: 5,
    justifyContent: 'center',
  },
  icon: {
    width: 11,
    height: 11,
    marginRight: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  countLabel: {
    fontSize: 12,
    lineHeight: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
});
export default TimeLineTabView;
