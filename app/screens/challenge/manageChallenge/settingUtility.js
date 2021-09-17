/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import { Alert } from 'react-native';
import strings from '../../../Constants/String';
import { getUserDetails } from '../../../api/Users';
import { getGroupDetails } from '../../../api/Groups';

export const getSetting = async (entityID, entityType, sportName, authContext) => {
  let obj = {};
  console.log('1');

  if (entityType === 'user' || entityType === 'player') {
    console.log('user11');

    if (entityID === authContext.entity.uid) {
      obj = (authContext?.user?.registered_sports ?? []).filter(
          (o) => o.sport_name.toLowerCase() === sportName.toLowerCase(),
        )[0]?.setting ?? {};
        return obj
    }
      return getUserDetails(entityID, authContext)
        .then((response) => {
          obj = (response?.payload?.registered_sports ?? []).filter(
            (o) => o.sport_name.toLowerCase() === sportName.toLowerCase(),
          )[0]?.setting ?? {}
          return obj
        })
        // eslint-disable-next-line no-unused-vars
        .catch((e) => {
          setTimeout(() => {
            // Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
  }
  if (entityType === 'team') {
    if (entityID === authContext.entity.uid) {
      obj = authContext?.entity?.obj?.setting ?? {};
      return obj
    }
        return getGroupDetails(entityID, authContext)
        .then((response) => {
            console.log('team setting obj:=>', response);
          obj = response?.payload?.setting
          return obj
        })
        // eslint-disable-next-line no-unused-vars
        .catch((e) => {
          setTimeout(() => {
            // Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
  }
  if (entityType === 'referee') {
    if (entityID === authContext.entity.uid) {
      obj = (authContext?.user?.referee_data ?? []).filter(
          (o) => o?.sport_name?.toLowerCase() === sportName?.toLowerCase(),
        )[0]?.setting ?? {};
        return obj
    }
       return getUserDetails(entityID, authContext)
        .then((response) => {
          obj = (response?.payload?.referee_data ?? []).filter(
            (o) => o?.sport_name?.toLowerCase() === sportName?.toLowerCase(),
          )[0]?.setting ?? {}
          return obj
        })
        .catch((e) => {
          setTimeout(() => {
            // Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
  }
  if (entityType === 'scorekeeper') {
    if (entityID === authContext.entity.uid) {
      obj = (authContext?.user?.scorekeeper_data ?? []).filter(
          (o) => o.sport_name.toLowerCase() === sportName.toLowerCase(),
        )[0]?.setting ?? {};
        return obj
    }
        return getUserDetails(entityID, authContext)
        .then((response) => {
          obj = (response?.payload?.scorekeeper_data ?? []).filter(
            (o) => o.sport_name.toLowerCase() === sportName.toLowerCase(),
          )[0]?.setting ?? {}
          return obj
        })
        .catch((e) => {
          setTimeout(() => {
            // Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
  }
  return obj
};
