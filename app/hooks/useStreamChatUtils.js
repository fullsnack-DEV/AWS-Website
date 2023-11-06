import {useContext, useState} from 'react';
import {format} from 'react-string-format';
import {getGroupMembers} from '../api/Groups';
import AuthContext from '../auth/context';
import Verbs from '../Constants/Verbs';
import {
  createStreamChatChannel,
  generateUUID,
  prepareChannelId,
} from '../utils/streamChat';
import {strings} from '../../Localization/translation';

const useStreamChatUtils = () => {
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const entity = {...authContext.entity.obj};
  const entityId = entity.user_id ?? entity.group_id;

  const fetchEntityMember = async (
    entity_id,
    entityType,
    entityName,
    isGeneralChat = false,
    getEntityName = false,
  ) => {
    let list = [];
    if (
      entityType === Verbs.entityTypePlayer ||
      entityType === Verbs.entityTypeUser
    ) {
      list = getEntityName
        ? [
            {
              user_id: entity_id,
              channel_role:
                entityId === entity_id || isGeneralChat
                  ? 'channel_moderator'
                  : 'channel_member',
              entityName,
            },
          ]
        : [
            {
              user_id: entity_id,
              channel_role:
                entityId === entity_id || isGeneralChat
                  ? 'channel_moderator'
                  : 'channel_member',
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
            const obj = {
              user_id: adminId,
              channel_role:
                entityId === entity_id || isGeneralChat
                  ? Verbs.channelModerator
                  : Verbs.channelMember,
            };

            if (getEntityName) {
              obj.entityName = entityName;
            }
            groupMembers.push(obj);
          }
        }
      });

      list = groupMembers;
    }

    return list;
  };

  const fetchMembers = async (
    inviteeData = [],
    isGeneralChat = false,
    getEntityName = false,
  ) => {
    const promisesArr = inviteeData.map((invitee) =>
      fetchEntityMember(
        invitee.id,
        invitee.entityType,
        invitee.name,
        isGeneralChat,
        getEntityName,
      ),
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

    const entityList = await fetchEntityMember(
      entityId,
      entity.entity_type,
      groupType === Verbs.channelTypeGeneral,
    );
    const members = await fetchMembers(
      inviteesList,
      groupType === Verbs.channelTypeGeneral,
    );
    // const memberList = [...entityList, ...members];
    let tempChannelName = '';
    if (!groupName && groupType === Verbs.channelTypeGeneral) {
      let name = '';
      inviteesList.forEach((item, index) => {
        name +=
          name.length === 0
            ? item.name
            : `${
                index === inviteesList.length - 1
                  ? ` & ${item.name}`
                  : `, ${item.name}`
              }`;
      });
      tempChannelName = name;
    }

    const channel = await createStreamChatChannel({
      authContext,
      channelId,
      channelName: inviteesList.length > 1 ? groupName : '',
      members: entityList,
      channelAvatar: inviteesList.length > 1 ? groupProfile : '',
      groupType,
      tempChannelName,
      isGeneralChat: groupType === Verbs.channelTypeGeneral,
    });

    if (groupType === Verbs.channelTypeGeneral) {
      const idList = members.map((item) => item.user_id);
      await channel.addModerators([...idList]);
    } else {
      await channel.addMembers([...members], {
        text: format(
          strings.nCreatedThisGroup,
          entity.full_name ?? entity.group_name,
        ),
      });
    }

    setLoading(false);
    return channel;
  };

  const addMembersToChannel = async ({
    channel = {},
    newMembers = [],
    isGeneralChat = false,
    ownerName = '',
  }) => {
    setLoading(true);
    const members = await fetchMembers(newMembers, isGeneralChat, true);
    let nameList = '';
    const finalList = members.map((item) => {
      const obj = {
        user_id: item.user_id,
        channel_role: item.channel_role,
      };
      nameList +=
        nameList.length > 0 ? `, ${item.entityName}` : item.entityName;
      return obj;
    });
    let response = {};
    try {
      response = await channel.addMembers([...finalList], {
        text: `${ownerName} invited ${nameList}`,
      });
      setLoading(false);
    } catch (error) {
      console.log('error ==>', error);
      setLoading(false);
    }
    return response;
  };

  return {
    createChannel,
    isCreatingChannel: loading,
    addMembersToChannel,
    isMemberAdding: loading,
    fetchMembers,
  };
};

export default useStreamChatUtils;
