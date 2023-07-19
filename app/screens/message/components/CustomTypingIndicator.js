// @flow
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useTypingContext} from 'stream-chat-react-native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

const CustomTypingIndicator = () => {
  const {typing = {}} = useTypingContext();
  const members = Object.keys(typing);

  let memberName = '';

  if (members.length > 0) {
    members.forEach((item) => {
      const member = {...typing[item].user};
      memberName += member.group_name ?? member.name;
    });
  }

  return (
    <View style={styles.parent}>
      <Text style={styles.label}>{memberName} is typing...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    marginHorizontal: 15,
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
});
export default CustomTypingIndicator;
