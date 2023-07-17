// @flow
import React, {useContext} from 'react';
import {StyleSheet, Text} from 'react-native';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

const CustomMessageHeader = ({message}) => {
  const authContext = useContext(AuthContext);

  const groupStyle = message.groupStyles[0];
  if (
    message.user.id !== authContext.chatClient.userID &&
    (groupStyle === 'top' || groupStyle === 'single')
  ) {
    return (
      <Text style={styles.messageHeaderText}>
        {message.user.group_name ?? message.user.name}
      </Text>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  messageHeaderText: {
    fontSize: 16,
    lineHeight: 21,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    marginBottom: 5,
  },
});
export default CustomMessageHeader;
