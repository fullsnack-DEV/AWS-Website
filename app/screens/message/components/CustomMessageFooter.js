// @flow
import moment from 'moment';
import React, {useContext} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import {useMessageContext} from 'stream-chat-react-native';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {checkIsMessageDeleted} from '../../../utils/streamChat';

const ReactionItems = ({url, count, onPress = () => {}}) => {
  const {message} = useMessageContext();

  return (
    <TouchableOpacity
      style={styles.reactionContainer}
      onPress={() => {
        onPress(message.id);
      }}>
      <Image source={url} style={{width: 15, height: 15, marginRight: 5}} />
      <Text style={{fontSize: 12}}>{count}+</Text>
    </TouchableOpacity>
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
        <View style={{flexDirection: 'row'}}>
          {message.reaction_counts?.happy && (
            <ReactionItems
              url={images.emojiHappy}
              count={message.reaction_counts.happy}
              onPress={onPress}
            />
          )}
          {message.reaction_counts?.wow && (
            <ReactionItems
              url={images.emojiWow}
              count={message.reaction_counts.wow}
              onPress={onPress}
            />
          )}
          {message.reaction_counts?.sad && (
            <ReactionItems
              url={images.emojiSad}
              count={message.reaction_counts.sad}
              onPress={onPress}
            />
          )}
          {message.reaction_counts?.correct && (
            <ReactionItems
              url={images.emojiCorrect}
              count={message.reaction_counts.correct}
              onPress={onPress}
            />
          )}
          {message.reaction_counts?.like && (
            <ReactionItems
              url={images.emojiLike}
              count={message.reaction_counts.like}
              onPress={onPress}
            />
          )}
          {message.reaction_counts?.love && (
            <ReactionItems
              url={images.emojiLove}
              count={message.reaction_counts.love}
              onPress={onPress}
            />
          )}
        </View>
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
    flexDirection: 'row',
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    margin: 5,
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
});
export default CustomMessageFooter;
