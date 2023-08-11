import {useContext, useState} from 'react';
import {getGroupMembers} from '../api/Groups';
import AuthContext from '../auth/context';
import Verbs from '../Constants/Verbs';
import {
  createStreamChatChannel,
  generateUUID,
  prepareChannelId,
} from '../utils/streamChat';

const useStreamChatUtils = () => {
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const entity = {...authContext.entity.obj};
  const entityId = entity.user_id ?? entity.group_id;

  const fetchEntityMember = async (entity_id, entityType) => {
    let list = [];
    if (
      entityType === Verbs.entityTypePlayer ||
      entityType === Verbs.entityTypeUser
    ) {
      list = [
        {
          user_id: entity_id,
          channel_role:
            entityId === entity_id ? 'channel_moderator' : 'channel_member',
        },
      ];
    } else {
      const response = await getGroupMembers(entity_id, authContext);

      const groupMembers = [];
      response.payload.forEach((item) => {
        if (item.is_admin && item.connected) {
          const adminId = `${entity_id}@${item.user_id}`;

          const isAdminExists = groupMembers.find(
            (ele) => adminId === ele.user_id,
          );

          if (!isAdminExists) {
            groupMembers.push({
              user_id: adminId,
              channel_role:
                entityId === entity_id ? 'channel_moderator' : 'channel_member',
            });
          }
        }
      });

      list = groupMembers;
    }

    return list;
  };

  const fetchMembers = async (inviteeData = []) => {
    const promisesArr = inviteeData.map((invitee) =>
      fetchEntityMember(invitee.id, invitee.entityType),
    );
    const inviteeMembers = await Promise.all(promisesArr);

    let newList = [];
    inviteeMembers.forEach((item) => {
      newList = [...newList, ...item];
    });

    return [...newList];
  };

  const createChannel = async (
    inviteesList = [],
    groupProfile = '',
    groupName = '',
    groupType = '',
  ) => {
    if (inviteesList.length === 0) {
      return null;
    }

    setLoading(true);
    const inviteeId = inviteesList[0].id;

    if (inviteesList.length === 1) {
      const filter = {
        id: {
          $in: [
            prepareChannelId(entityId, inviteeId),
            prepareChannelId(inviteeId, entityId),
          ],
        },
      };

      const channels = await authContext.chatClient.queryChannels(filter);
      if (channels.length > 0) {
        setLoading(false);
        return channels[0];
      }
    }

    const channelId =
      inviteesList.length > 1
        ? generateUUID()
        : prepareChannelId(entityId, inviteeId);

    const entityList = await fetchEntityMember(entityId, entity.entity_type);
    const members = await fetchMembers(inviteesList);
    const memberList = [...entityList, ...members];

    const channel = await createStreamChatChannel({
      authContext,
      channelId,
      channelName: inviteesList.length > 1 ? groupName : '',
      members: memberList,
      channelAvatar: inviteesList.length > 1 ? groupProfile : '',
      groupType,
    });

    setLoading(false);
    return channel;
  };

  const addMembersToChannel = async ({channel = {}, newMembers = []}) => {
    setLoading(true);
    const members = await fetchMembers(newMembers);
    const response = await channel.addMembers([...members]);
    setLoading(false);
    return response;
  };

  return {
    createChannel,
    isCreatingChannel: loading,
    addMembersToChannel,
    isMemberAdding: loading,
  };
};

export default useStreamChatUtils;
