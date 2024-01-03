// @flow
import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';

const SearchTagList = ({onPress = () => {}, searchTagOption}) => (
  <View style={styles.parent}>
    {searchTagOption.map((tag, index) => (
      <Pressable
        key={index}
        style={styles.tagItem}
        onPress={() => onPress(tag)}>
        <Text style={styles.tagItemText}>{tag.label}</Text>
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tagItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: colors.textFieldBackground,
    alignSelf: 'baseline',
    marginBottom: 15,
    marginRight: 7,
  },
  tagItemText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
});
export default SearchTagList;
