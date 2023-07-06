import {StreamChat} from 'stream-chat';
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

export const allStreamUserData = async () => {
  const chatClient = StreamChat.getInstance(STREAMCHATKEY);
  const data = await chatClient.queryUsers({banned: false});
  if (data.users.length > 0) {
    const users = data.users.map((user) => ({
      id: user.id,
      name: user.name,
      entityType: user.entityType,
      image: user.image,
    }));
    return users;
  }
  return [];
};

const getStreamChatUserToken = async (authContext) => {
  const userToken = await getUserToken(authContext);
  return userToken.payload;
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

export const upsertUserInstance = async (authContext) => {
  const streamUserId = await getStreamChatIdBasedOnRole(authContext);
  const chatClient = StreamChat.getInstance(STREAMCHATKEY);
  const streamChatToken = await getStreamChatUserToken(authContext);

  if (authContext.entity) {
    const user = {
      id: streamUserId,
    };
    if (chatClient.userID) {
      if (streamUserId !== chatClient.userID) {
        await chatClient.disconnectUser();
        await chatClient.connectUser(user, streamChatToken);
      }
    }
    if (!chatClient.userID) {
      await chatClient.connectUser(user, streamChatToken);
    }
  }
};

export const getStreamChatChannel = async (filterChannel) => {
  const chatClient = StreamChat.getInstance(STREAMCHATKEY);
  const sort = [{last_message_at: -1}];
  const channels = await chatClient.queryChannels(filterChannel, sort, {
    watch: true,
    state: true,
  });

  return channels;
};
