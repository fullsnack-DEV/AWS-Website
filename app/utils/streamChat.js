/* eslint-disable no-bitwise */
import moment from 'moment';
import {strings} from '../../Localization/translation';
import getUserToken from '../api/StreamChat';
import {updateUserProfile} from '../api/Users';
import Verbs from '../Constants/Verbs';

export const STREAMCHATKEY = 'zc2b2gy9aymw';

export const generateUserStreamToken = async (authContext) => {
  await getUserToken(authContext).then(async (responseChat) => {
    updateUserProfile({streamChatToken: responseChat.payload}, authContext);
    await authContext.setStreamChatToken(responseChat.payload);
  });
};

export const getStreamChatIdBasedOnRole = async (authContext) => {
  if (
    authContext.entity.role === Verbs.entityTypeTeam ||
    authContext.entity.role === Verbs.entityTypeClub
  ) {
    return `${authContext.entity.uid}@${authContext.entity.auth.user_id}`;
  }

  return authContext.entity.uid;
};

const getStreamChatToken = async (authContext) => {
  const userToken = await getUserToken(authContext);
  return userToken.payload;
};

export const connectUserToStreamChat = async (authContext) => {
  const streamUserId = await getStreamChatIdBasedOnRole(authContext);
  const streamChatToken = await getStreamChatToken(authContext);

  if (
    authContext.chatClient.userID &&
    streamUserId !== authContext.chatClient.userID
  ) {
    await authContext.chatClient.disconnectUser();
  }

  await authContext.chatClient.connectUser({id: streamUserId}, streamChatToken);
};

export const createStreamChatChannel = async ({
  authContext,
  channelId,
  members = [],
  channelName = '',
  groupType = '',
  channelAvatar = '',
}) => {
  const channel = authContext.chatClient.channel('messaging', channelId, {
    name: channelName,
    members,
    image: channelAvatar,
    group_type: groupType,
  });
  return channel;
};

export const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 32) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export const prepareChannelId = (entityId, inviteeId) => {
  const entity_id = entityId.split('-').join('');
  const invitee_id = inviteeId.split('-').join('');

  return `${entity_id}${invitee_id}`;
};

export const getChannelAvatar = (channel = {}, currentEntityId = '') => {
  if (channel.data.image) {
    return [
      {
        imageUrl: channel.data.image.thumbnail,
        entityType: channel.data.group_type,
      },
    ];
  }
  const membersList = getChannelMembers(channel, currentEntityId);

  const profiles = [];
  if (membersList.length === 0) {
    profiles.push({imageUrl: '', entityType: channel.data.group_type});
  } else {
    membersList.forEach((item) => {
      profiles.push(item.profileIcon);
    });
  }

  return [...profiles];
};

export const getChannelName = (channel = {}, currentEntityId = '') => {
  const {data} = channel;
  if (
    data?.channel_type === 'Auto' ||
    (data.group_type === 'General' && data.name)
  ) {
    return data.name;
  }

  const members = getChannelMembers(channel, currentEntityId);
  let channelName = '';
  if (members.length === 1) {
    channelName = members[0].memberName;
  } else {
    members.forEach((member) => {
      channelName +=
        channelName.length === 0 ? member.memberName : `, ${member.memberName}`;
    });
  }

  return channelName;
};

export const getLastMessageTime = (channel = {}) => {
  const {data, state} = channel;
  if (state.last_message_at) {
    const time = new Date(state.last_message_at);
    time.setMinutes(time.getMinutes());
    const minute = moment(new Date()).diff(time, 'minute');
    const hour = moment(new Date()).diff(time, 'hour');

    if (minute === 0) {
      return strings.justNow;
    }
    if (hour < 24) {
      return moment(time).format('hh:mm A');
    }

    return moment(data.updated_at).format('DD MMM');
  }

  return moment(data.updated_at).format('DD MMM');
};

export const getChannelMembers = (channel = {}, currentEntityId = '') => {
  const {data, state} = channel;
  const keys = Object.keys(state.members);

  const admins = keys.filter(
    (memberId) => memberId.includes('@') && !memberId.includes(currentEntityId),
  );

  const groupIds = [];
  admins.forEach((item) => {
    const groupId = item.split('@')[0];
    if (groupIds.length === 0 || !groupIds.includes(groupId)) {
      groupIds.push(groupId);
    }
  });

  const adminList = [];
  groupIds.forEach((item) => {
    const objList = [];
    keys.forEach((memberId) => {
      if (state.members[memberId].user_id.includes(item)) {
        objList.push(state.members[memberId]);
      }
    });
    const groupName = objList.find((member) => member.user.group_name)?.user
      .group_name;
    const obj = {
      memberName: groupName,
      profileIcon: {
        imageUrl: data.image?.thumbnail ?? '',
        entityType: data.group_type,
      },
      members: [...objList],
    };
    adminList.push(obj);
  });

  const str = admins.join('_');
  const membersList = [];
  keys.forEach((memberId) => {
    if (
      !memberId.includes('@') &&
      !str.includes(memberId) &&
      memberId !== currentEntityId
    ) {
      const obj = {
        memberName: state.members[memberId].user.name,
        profileIcon: {
          imageUrl: state.members[memberId].user.image ?? '',
          entityType: state.members[memberId].user.entityType,
        },
        members: [state.members[memberId]],
      };
      membersList.push(obj);
    }
  });
  const finalMembers = [...adminList, ...membersList];

  return finalMembers;
};

export const checkIsMessageDeleted = (chatUserId = '', message = {}) => {
  if (message.type === 'deleted') {
    return true;
  }
  if (message.deleted_for_me?.status) {
    const userId = message.deleted_for_me.user_id.find(
      (item) => item === chatUserId,
    );
    if (userId) {
      return true;
    }
    return false;
  }
  return false;
};
