// @flow
import React, {useContext} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {useMessageContext} from 'stream-chat-react-native';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {checkIsMessageDeleted} from '../../../utils/streamChat';

const CustomMessageText = () => {
  const authContext = useContext(AuthContext);
  const {message} = useMessageContext();
  const isDeletedMessage = checkIsMessageDeleted(
    authContext.chatClient.userID,
    message,
  );

  return (
    <View style={{paddingHorizontal: 4, paddingVertical: 8}}>
      {isDeletedMessage ? (
        <View style={styles.row}>
          <Image source={images.deleteChat} style={styles.infoIcon} />
          <Text style={styles.deletedText}>{strings.messageDeletedText}</Text>
        </View>
      ) : (
        <Text style={styles.messageText}>{message.text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
    resizeMode: 'contain',
  },
  deletedText: {
    fontSize: 14,
    lineHeight: 24,
    color: colors.veryLightBlack,
    fontFamily: fonts.RRegular,
  },
});
export default CustomMessageText;
