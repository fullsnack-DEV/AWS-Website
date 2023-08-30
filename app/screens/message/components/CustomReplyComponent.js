import React, {useContext} from 'react';
import {Image, Text, View} from 'react-native';
import {useMessageContext} from 'stream-chat-react-native';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';

const CustomReplyComponent = () => {
  const {message} = useMessageContext();
  const authContext = useContext(AuthContext);

  let attachementType;
  if (message.quoted_message.attachments.length > 0) {
    if (message.quoted_message.attachments[0].type === 'image') {
      attachementType = strings.photoText;
    } else {
      attachementType =
        message.quoted_message.attachments[0].type.toUpperCase();
    }
  }

  if (
    message?.deleted_for_me?.status &&
    message.deleted_for_me.user_id.includes(authContext.entity.uid)
  ) {
    return null;
  }

  return (
    <>
      {message.quoted_message && (
        <View
          style={{
            paddingHorizontal: 3,
            paddingVertical: 3,
          }}>
          <View
            style={{
              borderBottomColor:
                message.user.id === authContext.chatClient.userID
                  ? colors.whiteColor
                  : colors.grayBackgroundColor,
              borderBottomWidth: 1,
            }}>
            <Text style={{fontSize: 10, color: colors.themeColor2}}>
              {strings.replyTo}{' '}
              {message.quoted_message.user.group_name ??
                message.quoted_message.user.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {message.quoted_message.attachments.length > 0 && (
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    marginRight: 10,
                    marginVertical: 5,
                  }}
                  source={{
                    uri: message.quoted_message.attachments[0].image_url,
                  }}
                />
              )}
              {message.quoted_message.type === 'deleted' ? (
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.placeHolderColor,
                    marginTop: 5,
                    marginBottom: 5,
                  }}>
                  {strings.messageDeletedText}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.placeHolderColor,
                    marginTop: 5,
                    marginBottom: 5,
                  }}>
                  {message.quoted_message.attachments.length > 0
                    ? attachementType
                    : message.quoted_message.text}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default CustomReplyComponent;
