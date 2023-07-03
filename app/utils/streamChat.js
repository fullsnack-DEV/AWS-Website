import {StreamChat} from 'stream-chat';
import getUserToken from '../api/StreamChat';
import {updateUserProfile} from '../api/Users';
import Verbs from '../Constants/Verbs';

export const STREAMCHATKEY = 'vn9s68zstmpd';

export const generateUserStreamToken = async (authContext) => {
  await getUserToken(authContext).then(async (responseChat) => {
    updateUserProfile({streamChatToken: responseChat.payload}, authContext);
    await authContext.setStreamChatToken(responseChat.payload);
  });
};

export const allStreamUserData = async () => {
  const chatClient = StreamChat.getInstance(STREAMCHATKEY);
  const data = await chatClient.queryUsers({banned: false}, {limit: 500});
  const users = [];
  data.users.forEach((item) => {
    const tempUser = {
      user: {
        id: item?.id,
        name: item?.name,
        entityType: item?.entityType,
        image: item?.image,
      },
    };
    users.push(tempUser);
  });
  return users;
};

const getStreamChatUserToken = async (authContext) => {
  const userToken = await getUserToken(authContext);
  return userToken.payload;
};

export const getStreamChatIdBasedOnRole = async (authContext) => {
  let userId;
  if (
    authContext.entity.role === Verbs.entityTypeTeam ||
    authContext.entity.role === Verbs.entityTypeClub
  ) {
    userId = `${authContext.entity.uid}@${authContext.entity.auth.user_id}`;
  } else {
    userId = authContext.entity?.obj?.user_id;
  }
  return userId;
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
