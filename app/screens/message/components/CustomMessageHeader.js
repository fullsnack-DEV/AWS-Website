// @flow
import React, {useContext} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import CustomAvatar from './CustomAvatar';

const CustomMessageHeader = ({message, channel}) => {
  const authContext = useContext(AuthContext);

  const groupStyle = message.groupStyles[0];
  if (
    message.user.id !== authContext.chatClient.userID &&
    (groupStyle === 'top' || groupStyle === 'single')
  ) {
    return (
      <View
        style={{
          maxWidth: Dimensions.get('window').width * 0.6,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <CustomAvatar
          channel={channel}
          imageStyle={{width: 30, height: 30}}
          iconTextStyle={{fontSize: 12, marginTop: 1}}
          placeHolderStyle={{width: 12, height: 12}}
        />
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
