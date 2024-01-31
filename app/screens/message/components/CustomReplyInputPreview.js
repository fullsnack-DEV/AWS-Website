import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useMessageInputContext} from 'stream-chat-react-native';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';

const CustomReplyInputPreview = () => {
  const {quotedMessage, clearQuotedMessageState} = useMessageInputContext();

  return (
    <View style={styles.replyContainer}>
      <View style={styles.row}>
        {quotedMessage.attachments.length > 0 ? (
          <View style={styles.attachment}>
            <Image
              source={{
                uri:
                  quotedMessage.attachments[0].image_url ??
                  quotedMessage.attachments[0].asset_url,
              }}
              style={[styles.icon, {borderRadius: 5, resizeMode: 'cover'}]}
            />
          </View>
        ) : null}

        <View style={styles.replyInnerContainer}>
          <View style={{flex: 1, marginRight: 10}}>
            <Text style={styles.repliedTo} numberOfLines={1}>
              {strings.replyTo}{' '}
              {quotedMessage.user.group_name ?? quotedMessage.user.name}
            </Text>
            <Text style={styles.replyMessage} numberOfLines={2}>
              {quotedMessage.attachments.length > 0
                ? strings.photoText
                : quotedMessage.text}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              clearQuotedMessageState();
            }}
            style={styles.crossIconContainer}>
            <Image style={styles.icon} source={images.replyCancelImage} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.chatSeparateLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  chatSeparateLine: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
  replyContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    width: '100%',
  },
  replyInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingLeft: 5,
  },
  repliedTo: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.RRegular,
    color: colors.themeColor,
  },
  crossIconContainer: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  replyMessage: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachment: {
    width: 45,
    height: 45,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default CustomReplyInputPreview;
