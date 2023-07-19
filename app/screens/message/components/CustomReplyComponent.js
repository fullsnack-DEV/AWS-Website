import React, {useContext} from 'react';
import {Image, Text, View} from 'react-native';
import {useMessageContext} from 'stream-chat-react-native';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import {renderChatTitle} from '../../../utils/streamChat';

const CustomReplyComponent = ({channel = {}}) => {
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
              {strings.replyTo} {renderChatTitle(channel, authContext)}
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
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default CustomReplyComponent;
