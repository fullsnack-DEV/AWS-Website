/* eslint-disable consistent-return */
import { Alert } from 'react-native';
import strings from '../../../Constants/String';
import { getUserDetails } from '../../../api/Users';
import { getGroupDetails } from '../../../api/Groups';

// eslint-disable-next-line import/prefer-default-export
export const getSetting = async (entityID, entityType, sportName, authContext) => {
  let obj = {};
  if (entityType === 'user' || entityType === 'player') {
    if (entityID === authContext.entity.uid) {
      obj = (authContext?.user?.registered_sports ?? []).filter(
          (o) => o.sport_name === sportName,
        )[0]?.setting ?? {};
    } else {
       return getUserDetails(entityID, authContext)
        .then((response) => (response?.payload?.registered_sports ?? []).filter(
              (o) => o.sport_name === sportName,
            )[0]?.setting ?? {})
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }
  if (entityType === 'team') {
    if (entityID === authContext.entity.uid) {
      obj = authContext?.entity?.obj?.setting ?? {};
    } else {
       return getGroupDetails(entityID, authContext)
        .then((response) => {
            console.log('team setting obj:=>', response);
          return response?.payload?.setting
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
     }
  }
  if (entityType === 'referee') {
    if (entityID === authContext.entity.uid) {
      obj = (authContext?.user?.referee_data ?? []).filter(
          (o) => o.sport_name === sportName,
        )[0]?.setting ?? {};
    } else {
       return getUserDetails(entityID, authContext)
        .then((response) => (response?.payload?.referee_data ?? []).filter(
              (o) => o.sport_name === sportName,
            )[0]?.setting ?? {})
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
     }
  }
  if (entityType === 'scorekeeper') {
    if (entityID === authContext.entity.uid) {
      obj = (authContext?.user?.scorekeeper_data ?? []).filter(
          (o) => o.sport_name === sportName,
        )[0].setting ?? {};
    } else {
        return getUserDetails(entityID, authContext)
        .then((response) => (response?.payload?.scorekeeper_data ?? []).filter(
              (o) => o.sport_name === sportName,
            )[0].setting ?? {})
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }
  return obj
};
