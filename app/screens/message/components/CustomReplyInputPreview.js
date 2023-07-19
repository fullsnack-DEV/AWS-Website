import React, {useContext} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useMessageInputContext} from 'stream-chat-react-native';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import {renderChatTitle} from '../../../utils/streamChat';

const CustomReplyInputPreview = ({channel}) => {
  const {quotedMessage, clearQuotedMessageState} = useMessageInputContext();
  const authContext = useContext(AuthContext);
  return (
    <View style={{marginBottom: 8}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 5,
          paddingVertical: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {quotedMessage.attachments.length > 0 && (
            <Image
              style={{width: 30, height: 30, marginRight: 10}}
              source={{uri: quotedMessage.attachments[0].image_url}}
            />
          )}
          <View>
            <Text style={{fontSize: 14, color: colors.themeColor}}>
              Reply to {renderChatTitle(channel, authContext)}
            </Text>
            <Text style={{fontSize: 14, marginTop: 5}}>
              {quotedMessage.attachments.length > 0
                ? 'Photo'
                : quotedMessage.text}
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              clearQuotedMessageState();
            }}>
            <Image
              style={{width: 12, height: 12}}
              source={images.crossSingle}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.chatSeparateLine} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default CustomReplyInputPreview;
