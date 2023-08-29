/* eslint-disable no-bitwise */
import moment from 'moment';
import {strings} from '../../Localization/translation';
import getUserToken from '../api/StreamChat';
import {updateUserProfile} from '../api/Users';
import Verbs from '../Constants/Verbs';

export const generateUserStreamToken = async (authContext) => {
  try {
    const responseChat = await getUserToken(authContext);

    await updateUserProfile(
      {streamChatToken: responseChat.payload},
      authContext,
    );

    await authContext.setStreamChatToken(responseChat.payload);
  } catch (error) {
    console.error('Error in generateUserStreamToken:', error);
  }
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
  const channel = authContext.chatClient.channel(
    Verbs.channelTypeMessaging,
    channelId,
    {
      name: channelName,
      members,
      image: channelAvatar,
      group_type: groupType,
    },
  );
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

export const getChannelAvatar = (channel = {}, streamUserId = '') => {
  if (channel.data?.channel_type === Verbs.channelTypeAuto) {
    return [
      {
        imageUrl: channel.data?.image ?? '',
        entityType: channel.data.group_type,
      },
    ];
  }

  if (channel.data.image) {
    return [
      {
        imageUrl: channel.data.image.thumbnail,
        entityType: channel.data.group_type,
      },
    ];
  }

  const membersList = getChannelMembers(channel);
  const members = [];
  membersList.forEach((ele) => {
    const obj = ele.members.find((item) => item.user_id === streamUserId);
    if (!obj) {
      members.push(ele);
    }
  });

  let profiles = [];
  if (members.length === 0) {
    profiles.push({imageUrl: '', entityType: channel.data.group_type});
  } else {
    members.forEach((item) => {
      profiles = [...profiles, ...item.profiles];
    });
  }

  return [...profiles];
};

export const getChannelName = (channel = {}, streamUserId = '') => {
  const {data} = channel;
  if (
    data?.channel_type === Verbs.channelTypeAuto ||
    (data?.group_type === Verbs.channelTypeGeneral && data.name)
  ) {
    return data.name;
  }

  const membersData = getChannelMembers(channel);
  const members = [];
  membersData.forEach((ele) => {
    const obj = ele.members.find((item) => item.user_id === streamUserId);
    if (!obj) {
      members.push(ele);
    }
  });
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

export const getChannelMembers = (channel = {}) => {
  const {state} = channel;
  const keys = Object.keys(state.members);

  const admins = keys.filter((memberId) => memberId.includes('@'));

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

    const profiles = objList.map((member) => ({
      imageUrl: member.user.image ?? '',
      entityType: member.user.entityType,
    }));

    const obj = {
      profiles,
      memberName: groupName,
      members: [...objList],
    };
    adminList.push(obj);
  });

  const str = admins.join('_');
  const membersList = [];
  keys.forEach((memberId) => {
    if (!memberId.includes('@') && !str.includes(memberId)) {
      const obj = {
        profiles: [
          {
            imageUrl: state.members[memberId].user.image ?? '',
            entityType: state.members[memberId].user.entityType,
          },
        ],
        memberName: state.members[memberId].user.name,
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

export const renderChatTitle = (channel = {}, authContext = {}) => {
  let name;
  if (channel.data?.member_count === 2) {
    const members = channel?.state?.members;
    const filteredMember = Object.fromEntries(
      Object.entries(members).filter(
        ([key]) => key !== authContext.entity.obj.user_id,
      ),
    );
    name = Object.entries(filteredMember).map((obj) => obj[1]?.user?.name);
  } else {
    name = channel.data?.name;
  }
  return name;
};
