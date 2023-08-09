// @flow
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useMessageContext, useOverlayContext} from 'stream-chat-react-native';
import colors from '../../../Constants/Colors';
import CustomMessageActionListItem from './CustomMessageActionListItem';
import CustomReactionComponent from './CustomReactionComponent';
import {strings} from '../../../../Localization/translation';

const CustomMessageActionList = ({
  deleteMessageAction = () => {},
  channel = {},
  streamChatUserId = '',
}) => {
  const {message, handleQuotedReplyMessage} = useMessageContext();
  const {setOverlay} = useOverlayContext();

  const [messageActions, setMessageActions] = useState([]);

  useEffect(() => {
    const actions = [
      {
        action() {
          handleQuotedReplyMessage();
          setOverlay('none');
        },
        actionType: 'quotedReply',
        title: strings.reply,
      },
    ];
    if (message.user.id === streamChatUserId) {
      actions.push({
        action() {
          deleteMessageAction(message);
          setOverlay('none');
        },
        actionType: 'deleteMessage',
        title: strings.delete,
      });
    }
    setMessageActions(actions);
  }, [
    handleQuotedReplyMessage,
    deleteMessageAction,
    message,
    streamChatUserId,
    setOverlay,
  ]);

  return (
    <View style={styles.parent}>
      {messageActions.map(({actionType, ...rest}) => (
        <CustomMessageActionListItem
          actionType={actionType}
          key={actionType}
          {...rest}
        />
      ))}
      <CustomReactionComponent channel={channel} />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    backgroundColor: colors.whiteColor,
    marginTop: 10,
    borderRadius: 5,
    width: 255,
    marginLeft: 25,
  },
});
export default CustomMessageActionList;
