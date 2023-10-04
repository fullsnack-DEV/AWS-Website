// @flow
import React, {useCallback, useContext, useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import {useMessageContext} from 'stream-chat-react-native';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {checkIsMessageDeleted} from '../../../utils/streamChat';
import {emojiRegex} from '../../../Constants/GeneralConstants';

const NUM_OF_LINES = 12;

const CustomMessageText = ({onTagPress = () => {}, onViewAll = () => {}}) => {
  const [showViewMoreOption, setShowViewMoreOption] = useState(false);
  const [numOfLines, setNumOfLines] = useState(0);

  const authContext = useContext(AuthContext);
  const {message} = useMessageContext();

  const isDeletedMessage = checkIsMessageDeleted(
    authContext.chatClient.userID,
    message,
  );

  const onTextLayout = useCallback(
    (e) => {
      if (numOfLines === 0 && e.nativeEvent.lines.length > NUM_OF_LINES) {
        setShowViewMoreOption(true);
        setNumOfLines(NUM_OF_LINES);
      }
    },
    [numOfLines],
  );

  const renderMentions = () => {
    const mentionRegex = /@\S+(\s+\S+)*/;
    const matchIndex = message.text.indexOf('@');
    const wordsArray = message.text.split(/\s+/);
    let processedText = '';
    if (matchIndex === -1) {
      processedText = message.text;
    } else {
      processedText = wordsArray.map((word, index) => {
        const match = word.match(mentionRegex);

        if (match) {
          const entityName = message.mentioned_users.find((item) =>
            item.name?.includes(match[0].slice(1)),
          );
          const mention = entityName
            ? `@${entityName.name}`
            : `${match[0]} ${wordsArray[index + 1]}`;

          return (
            <Text
              key={index}
              onPress={() => onTagPress(message.mentioned_users, mention)}
              style={[styles.messageText, {color: colors.tagColor}]}>
              {mention}{' '}
            </Text>
          );
        }

        return wordsArray[index - 1]?.match(mentionRegex) !== null
          ? ''
          : `${word} `;
      });
    }
    return message.text.trim().match(emojiRegex) &&
      message.text.trim().length === 2 ? (
      <Text style={styles.emojiText}>{message.text}</Text>
    ) : (
      <Text
        style={styles.messageText}
        numberOfLines={numOfLines}
        onTextLayout={onTextLayout}>
        {processedText}
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

  return (
    <View style={styles.parent}>
      {renderMentions()}
      {showViewMoreOption ? (
        <>
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
            onPress={() => {
              onViewAll(message.text);
            }}>
            <Text style={styles.messageText}>{strings.viewAll}</Text>
            <Image source={images.nextArrow} style={styles.nextArrow} />
          </TouchableOpacity>
        </>
      ) : null}
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
  emojiText: {
    fontSize: 40,
    lineHeight: 60,
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
