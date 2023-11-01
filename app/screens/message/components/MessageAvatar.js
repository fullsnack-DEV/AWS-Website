// @flow
import React from 'react';
import {StyleSheet} from 'react-native';
import {useMessageContext} from 'stream-chat-react-native';
import GroupIcon from '../../../components/GroupIcon';
import Verbs from '../../../Constants/Verbs';

const MessageAvatar = ({channel = {}}) => {
  const {message, isMyMessage} = useMessageContext();

  const getMessageAvtar = (messageUserId = '') => {
    const obj = {
      imageUrl: '',
      entityType: Verbs.entityTypePlayer,
    };

    const member = channel.state.members[messageUserId];
    if (
      member.user.entityType === Verbs.entityTypeTeam ||
      member.user.entityType === Verbs.entityTypeClub
    ) {
      if (member.role === 'moderator' || member.role === 'owner') {
        obj.imageUrl = channel.data?.image;
        obj.entityType = member.user.entityType;
      } else {
        obj.imageUrl = channel.data?.image ?? '';
        obj.entityType = member.user.entityType;
      }
    } else {
      obj.imageUrl = member.user.group_image ?? '';
      obj.entityType = member.user.entityType;
    }

    return obj;
  };

  return isMyMessage ? null : (
    <GroupIcon
      imageUrl={getMessageAvtar(message.user.id).imageUrl}
      groupName={message.user.group_name ?? message.user.name}
      entityType={getMessageAvtar(message.user.id).entityType}
      textstyle={{fontSize: 10, marginTop: 1}}
      containerStyle={styles.iconContainer}
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
