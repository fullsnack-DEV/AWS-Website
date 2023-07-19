// @flow
import React, {useContext} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
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
      <View style={{maxWidth: Dimensions.get('window').width * 0.6}}>
        <Text style={styles.messageHeaderText} numberOfLines={1}>
          {message.user.group_name ?? message.user.name}
        </Text>
      </View>
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
