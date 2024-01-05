import {useContext} from 'react';
import {strings} from '../../Localization/translation';
import AuthContext from '../auth/context';
import Verbs from '../Constants/Verbs';

const usePrivacySettings = () => {
  const authContext = useContext(AuthContext);

  const checkIsMyTeamClub = (entityId = '') => {
    if (
      authContext.entity.role === Verbs.entityTypeTeam ||
      authContext.entity.role === Verbs.entityTypeClub
    ) {
      return authContext.entity.obj.user_history.includes(entityId);
    }

    return false;
  };

  const getPrivacyStatus = (privacyVal = '', entityObj = {}) => {
    const entityId = entityObj.user_id ?? entityObj.group_id;

    if (privacyVal === strings.onlymeTitleText) {
      return authContext.entity.uid === entityId;
    }

    if (privacyVal === strings.everyoneTitleText) {
      return true;
    }

    if (privacyVal === strings.myTeamClub) {
      const isMyTeamClub = checkIsMyTeamClub(entityId);
      return isMyTeamClub;
    }

    if (privacyVal === strings.followersMyTeamClub) {
      const isMyTeamClub = checkIsMyTeamClub(entityId);

      return isMyTeamClub || entityObj.is_following;
    }

    return true;
  };
  return {getPrivacyStatus};
};

export default usePrivacySettings;
