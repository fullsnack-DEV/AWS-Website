import {Alert} from 'react-native';
import {format} from 'react-string-format';
import {strings} from '../../Localization/translation';
import {getUnreadCount} from '../api/Notificaitons';
import Verbs from '../Constants/Verbs';
import {getSportDetails} from './sportsActivityUtils';

const getUnreadNotificationCount = (authContext) => {
  getUnreadCount(authContext)
    .then((response) => {
      const {teams, clubs, user} = response.payload;
      const allAccounts = [{...user}, ...clubs, ...teams];

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

export {getUnreadNotificationCount, getNotificationCount, getSportsLabel};
