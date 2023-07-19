// @flow
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import moment from 'moment';
import {useMessageContext} from 'stream-chat-react-native';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {checkIsMessageDeleted} from '../../../utils/streamChat';
import {newReactionData} from '../constants';

const Reactions = ({messageId, reactions = {}, onPress = () => {}}) => {
  const [totalReactionCount, setTotalReactionCount] = useState(0);
  const keys = Object.keys(reactions);

  useEffect(() => {
    if (keys.length > 0) {
      let count = 0;
      keys.forEach((item) => {
        count += reactions[item];
      });
      setTotalReactionCount(count);
    }
  }, [keys, reactions]);

  if (keys.length === 0) {
    return null;
  }

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {keys.map((item) => {
        const emojiPath = newReactionData.find((ele) => item === ele.type).Icon;
        return (
          <TouchableOpacity
            key={item}
            style={styles.reactionContainer}
            onPress={() => {
              onPress(messageId);
            }}>
            <Image source={emojiPath} style={styles.emoji} />
            <Text style={styles.countText}>{reactions[item]}+</Text>
          </TouchableOpacity>
        );
      })}
      {totalReactionCount ? (
        <Text style={styles.totalCount}>{totalReactionCount}</Text>
      ) : null}
    </View>
  );
};

const CustomMessageFooter = ({onPress = () => {}}) => {
  const authContext = useContext(AuthContext);
  const {message} = useMessageContext();
  const groupStyle = message.groupStyles[0];
  const isDeletedMessage = checkIsMessageDeleted(
    authContext.chatClient.userID,
    message,
  );

  if (
    (groupStyle === 'single' || groupStyle === 'bottom') &&
    !isDeletedMessage
  ) {
    return (
      <View style={styles.reactionAndTimeContainer}>
        <Reactions
          messageId={message.id}
          reactions={message.reaction_counts}
          onPress={onPress}
        />
        <View>
          <Text style={styles.time}>
            {moment(message.updated_at).format('hh:mm A')}
          </Text>
        </View>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  reactionContainer: {
    padding: 3,
    marginRight: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
  },
  time: {
    fontSize: 10,
    lineHeight: 15,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
  },
  reactionAndTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  countText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  emoji: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    marginRight: 5,
  },
  totalCount: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.themeColor,
    fontFamily: fonts.RBold,
    marginRight: 5,
  },
});
export default CustomMessageFooter;
