import {Alert, Platform} from 'react-native';
import {format} from 'react-string-format';
import {strings} from '../../Localization/translation';
import {groupValidate} from '../api/Groups';
import {getUnreadCount} from '../api/Notificaitons';
import Verbs from '../Constants/Verbs';
import {getSportDetails} from './sportsActivityUtils';

const getUnreadNotificationCount = (authContext) => {
  getUnreadCount(authContext)
    .then((response) => {
      const {teams, clubs, user} = response.payload;
      const allAccounts = [{...user}, ...clubs, ...teams];
      authContext.setTotalNotificationCount(response.payload.totalUnread ?? 0);
      const obj = {};
      allAccounts.forEach((item) => {
        obj[`${item.user_id ?? item.group_id}`] = item.unread ?? 0;
      });
      authContext.setUnreadNotificationCount(obj, allAccounts);
    })
    .catch((e) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
};
const getNotificationCount = (entityId, authContext) => {
  let count = 0;
  if (
    authContext.unreadNotificationCount &&
    Object.keys(authContext.unreadNotificationCount).includes(entityId)
  ) {
    count = authContext.unreadNotificationCount[entityId];
  }
  return count;
};

const getSportsLabel = ({entityData = {}, sportList = [], maxSports = 1}) => {
  let sportDetails = {};
  if (entityData.entity_type === Verbs.entityTypeTeam) {
    sportDetails = getSportDetails(
      entityData.sport,
      entityData.sport_type,
      sportList,
      Verbs.entityTypeTeam,
    );

    return sportDetails?.sport_name;
  }
  if (entityData.sports?.length > 0) {
    sportDetails = getSportDetails(
      entityData.sports[0].sport,
      entityData.sports[0].sport_type,
      sportList,
      entityData.entity_type,
    );
    if (entityData.sports.length > maxSports) {
      return `${sportDetails.sport_name} ${format(
        strings.andMoreText,
        entityData.sports.length - maxSports,
      )}`;
    }
    return sportDetails.sport_name;
  }
  return '';
};

const onResendRequest = (
  player1,
  player2,
  sport,
  sport_type,
  request_id,
  seLoaderHandler,
  handleMemberModal,
  authContext,
) => {
  const obj = {
    player1,
    player2,
    sport,
    sport_type,
    entity_type: Verbs.entityTypeTeam,
    request_id,
    seLoaderHandler,
    handleMemberModal,
  };
  seLoaderHandler(true);

  groupValidate(obj, authContext)
    .then(() => {
      seLoaderHandler(false);

      Alert.alert(
        Platform.OS === 'android' ? '' : strings.requestSent,
        Platform.OS === 'android' ? strings.requestSent : '',

        [
          {
            text: strings.OkText,
            onPress: () => handleMemberModal(false),
          },
        ],
        {cancelable: false},
      );
    })
    .catch((e) => {
      seLoaderHandler(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
};

export {
  getUnreadNotificationCount,
  getNotificationCount,
  getSportsLabel,
  onResendRequest,
};
