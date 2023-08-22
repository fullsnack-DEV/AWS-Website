import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useMessageInputContext} from 'stream-chat-react-native';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import {widthPercentageToDP as wp} from '../../../utils';

const CustomReplyInputPreview = () => {
  const {quotedMessage, clearQuotedMessageState} = useMessageInputContext();

  return (
    <View style={{marginBottom: 8}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',

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
              {strings.replyTo}{' '}
              {quotedMessage.user.group_name ?? quotedMessage.user.name}
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
              style={{width: 12, height: 12,}}
              source={images.crossImage}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.chatSeparateLine} />
    </View>
  );
};

const styles = StyleSheet.create({
   chatSeparateLine: {
    borderColor: colors.grayBackgroundColor,
    marginTop: 5,
    borderWidth: 0.5,
    width: wp(95),
  },
});

export default CustomReplyInputPreview;
