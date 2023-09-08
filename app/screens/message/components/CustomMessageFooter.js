// @flow
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import {format} from 'react-string-format';
import {useMessageContext} from 'stream-chat-react-native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {newReactionData} from '../constants';
import {strings} from '../../../../Localization/translation';
// import {checkIsMessageDeleted} from '../../../utils/streamChat';
// import AuthContext from '../../../auth/context';

const MAX_REACTION_COUNT = 99;

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
            <Text style={styles.countText}>
              {reactions[item] > MAX_REACTION_COUNT
                ? `${MAX_REACTION_COUNT}+`
                : reactions[item]}
            </Text>
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
  const {message} = useMessageContext();
  // const authContext = useContext(AuthContext);
  // const groupStyle = message.groupStyles[0];
  // const isDeletedMessage = checkIsMessageDeleted(
  //   authContext.chatClient.userID,
  //   message,
  // );

  // if (
  //   groupStyle === 'single' ||
  //   groupStyle === 'bottom' ||
  //   message.latest_reactions.length > 0 ||
  //   message.own_reactions.length > 0 ||
  //   isDeletedMessage
  // ) {
  return (
    <View style={styles.reactionAndTimeContainer}>
      {message.latest_reactions?.length > 0 ||
      message.own_reactions?.length > 0 ? (
        <Reactions
          messageId={message.id}
          reactions={message.reaction_counts}
          onPress={onPress}
        />
      ) : null}

      {message.user.group_name ? (
        <View style={{maxWidth: '80%'}}>
          <Text style={[styles.time, {marginRight: 10}]} numberOfLines={1}>
            {format(strings.byUser, message.user.name)}
          </Text>
        </View>
      ) : null}
      <View>
        <Text style={styles.time}>
          {moment(message.updated_at).format('hh:mm A')}
        </Text>
      </View>
    </View>
  );
  // }
  // return null;
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
    maxWidth: Dimensions.get('window').width * 0.6,
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
