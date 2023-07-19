// @flow
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {AutoCompleteSuggestionItem} from 'stream-chat-react-native';
import GroupIcon from '../../../components/GroupIcon';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

const CustomAutoCompleteSuggestionItem = ({itemProps, triggerType}) => {
  if (triggerType === 'mention') {
    return (
      <View style={styles.parent}>
        <GroupIcon
          imageUrl={itemProps.members[0].image}
          entityType={itemProps.members[0].entityType}
          containerStyle={styles.profileIcon}
        />
        <Text style={styles.label}>{itemProps.entityName}</Text>
      </View>
    );
  }
  return (
    <AutoCompleteSuggestionItem
      itemProps={itemProps.members[0]}
      key={itemProps.name}
      triggerType={triggerType}
    />
  );
};

const styles = StyleSheet.create({
  parent: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
export default CustomAutoCompleteSuggestionItem;
