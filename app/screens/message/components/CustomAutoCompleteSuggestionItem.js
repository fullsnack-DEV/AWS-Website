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
          groupName={itemProps.members[0].group_name}
          entityType={itemProps.members[0].entityType}
          containerStyle={styles.profileIcon}
          textstyle={{fontSize: 10, marginTop: 2}}
          placeHolderStyle={{width: 8, height: 8}}
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
