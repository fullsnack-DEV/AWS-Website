// @flow
import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';

const TagOptions = [
  {
    label: strings.upcomingMatchesTitle,
    value: strings.upcomingTitleText,
    parentTag: 2,
  },
  {
    label: strings.completedMatches,
    value: strings.completedTitleText,
    parentTag: 2,
  },
  {label: strings.tournamentsTitle, value: null, parentTag: null},
  {label: strings.eventsTitle, value: strings.eventsTitle, parentTag: 3},
  {label: strings.teamsTitleText, value: strings.teamsTitleText, parentTag: 1},
  {label: strings.clubsTitleText, value: strings.clubsTitleText, parentTag: 1},
  {label: strings.leaguesTitle, value: strings.leaguesTitle, parentTag: 1},
  {label: strings.playerTitle, value: strings.playerTitle, parentTag: 0},
  {label: strings.refereesTitle, value: strings.refereesTitle, parentTag: 0},
  {
    label: strings.scorekeeperTitle,
    value: strings.scorekeeperTitle,
    parentTag: 0,
  },
];

const SearchTagList = ({onPress = () => {}}) => (
  <View style={styles.parent}>
    {TagOptions.map((tag, index) => (
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
