// @flow
import React, {useContext, useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import {useMessageContext} from 'stream-chat-react-native';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {tagRegex} from '../../../Constants/GeneralConstants';
import images from '../../../Constants/ImagePath';
import {checkIsMessageDeleted} from '../../../utils/streamChat';

const CustomMessageText = () => {
  const [showFullMessage, setShowFullMessage] = useState(false);
  const authContext = useContext(AuthContext);
  const {message} = useMessageContext();
  const isDeletedMessage = checkIsMessageDeleted(
    authContext.chatClient.userID,
    message,
  );

  const renderTagText = (match) => {
    let color = colors.black;
    let isTagName = false;

    if (message.mentioned_users && message.mentioned_users.length > 0) {
      isTagName =
        message.mentioned_users.filter((item) => item.name === match).length >
        0;

      if (isTagName) color = colors.tagColor;
    }

    return (
      <Text
        // onPress={() => isTagName && handleNamePress(match, startTagIndex)}
        style={{...styles.username, color}}>
        {match}
      </Text>
    );
  };

  if (isDeletedMessage) {
    return (
      <View style={styles.parent}>
        <View style={styles.row}>
          <Image source={images.deleteChat} style={styles.infoIcon} />
          <Text style={styles.deletedText}>{strings.messageDeletedText}</Text>
        </View>
      </View>
    );
  }
  if (!showFullMessage && message.text.length > 400) {
    return (
      <View style={styles.parent}>
        <Text style={styles.messageText} numberOfLines={8}>
          {message.text}
        </Text>
        <View
          style={[
            styles.hrLine,
            message.user_id === authContext.chatClient.userID
              ? {backgroundColor: colors.whiteColor}
              : {},
          ]}
        />
        <TouchableOpacity
          style={styles.viewMoreContainer}
          onPress={() => setShowFullMessage(!showFullMessage)}>
          <Text style={styles.messageText}>{strings.viewAll}</Text>
          <Image source={images.nextArrow} style={styles.nextArrow} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.parent}>
      {/* <Text style={styles.messageText}>{message.text}</Text> */}
      <ParsedText
        style={styles.text}
        parse={[{pattern: tagRegex, renderText: renderTagText}]}
        childrenProps={{allowFontScaling: false}}>
        {message.text}
      </ParsedText>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
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
  hrLine: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginTop: 15,
    marginBottom: 10,
  },
  viewMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextArrow: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
});
export default CustomMessageText;
