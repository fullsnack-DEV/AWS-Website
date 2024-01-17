// @flow
import React from 'react';
import {StyleSheet} from 'react-native';
import {useMessageContext} from 'stream-chat-react-native';
import GroupIcon from '../../../components/GroupIcon';
import Verbs from '../../../Constants/Verbs';
import {
  checkIsMessageDeleted,
  getChannelMembers,
} from '../../../utils/streamChat';

const MessageAvatar = ({channel = {}, chatUserId = ''}) => {
  const {message, isMyMessage} = useMessageContext();
  const isDeletedMessage = checkIsMessageDeleted(chatUserId, message);

  const getMessageAvtar = (messageUserId = '') => {
    const obj = {
      imageUrl: '',
      entityType: Verbs.entityTypePlayer,
    };
    const memberList = getChannelMembers(channel);

    memberList.forEach((item) => {
      const member = item.members.find((ele) => ele.user_id === messageUserId);
      if (member) {
        if (member.user.group_image) {
          obj.imageUrl = member.user.group_image;
        } else if (memberList.length > 2) {
          obj.imageUrl = member.user.image;
        }
        obj.entityType = member.user.entityType ?? '';
      }
    });

    return obj;
  };

  return isMyMessage ? null : (
    <GroupIcon
      imageUrl={getMessageAvtar(message.user.id).imageUrl}
      groupName={message.user.group_name ?? message.user.name}
      entityType={getMessageAvtar(message.user.id).entityType}
      textstyle={{fontSize: 10, marginTop: 1}}
      containerStyle={[
        styles.iconContainer,
        isDeletedMessage ? {bottom: 0} : {},
      ]}
      placeHolderStyle={styles.placeHolderStyle}
    />
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 30,
    height: 30,
    borderWidth: 1,
    marginRight: 10,
    position: 'absolute',
    left: 0,
    bottom: 20,
  },
  placeHolderStyle: {
    width: 12,
    height: 12,
    bottom: -3,
    right: -2,
  },
});
export default MessageAvatar;
