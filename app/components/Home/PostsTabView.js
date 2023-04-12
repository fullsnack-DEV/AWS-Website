// @flow
import React from 'react';
import {View, StyleSheet, Pressable, Text, FlatList} from 'react-native';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const PostsTabView = ({list = [], onPress = () => {}}) =>
  list.length > 0 ? (
    <View style={styles.parent}>
      <Text style={styles.title}>{strings.postsTitleText}</Text>
      <FlatList
        data={list}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <Pressable
            style={[
              styles.buttonContainer,
              index !== list.length - 1 ? {marginRight: 10} : {},
            ]}
            onPress={() => onPress(item)}>
            <Text style={styles.buttonText}>{item}</Text>
          </Pressable>
        )}
      />
    </View>
  ) : null;

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBackgroundColor,
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    marginBottom: 15,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
});
export default PostsTabView;
