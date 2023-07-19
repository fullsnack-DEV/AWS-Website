// @flow
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useMessageContext, useOverlayContext} from 'stream-chat-react-native';
import colors from '../../../Constants/Colors';
import CustomMessageActionListItem from './CustomMessageActionListItem';
import CustomReactionComponent from './CustomReactionComponent';

const CustomMessageActionList = ({
  deleteMessageAction = () => {},
  channel = {},
}) => {
  const {message, handleQuotedReplyMessage} = useMessageContext();
  const {setOverlay} = useOverlayContext();

  const messageActions = [
    {
      action() {
        handleQuotedReplyMessage();
        setOverlay('none');
      },
      actionType: 'quotedReply',
      title: 'Reply',
    },
    {
      action() {
        deleteMessageAction(message);
        setOverlay('none');
      },
      actionType: 'deleteMessage',
      title: 'Delete',
    },
  ];

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
