import {useContext} from 'react';
import {strings} from '../../Localization/translation';
import AuthContext from '../auth/context';
import Verbs from '../Constants/Verbs';
import {
  PersonalUserPrivacyEnum,
  PrivacyKeyEnum,
  ScoreboardPeriodPrivacyOptionsEnum,
} from '../Constants/PrivacyOptionsConstant';

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

    if (
      entityId === authContext.entity.uid ||
      [strings.all, strings.everyoneTitleText].includes(privacyVal)
    ) {
      return true;
    }

    if ([strings.onlymeTitleText, strings.noneText].includes(privacyVal)) {
      return authContext.entity.uid === entityId;
    }

    if (privacyVal === strings.myTeamClub) {
      const isMyTeamClub = checkIsMyTeamClub(entityId);
      return isMyTeamClub;
    }

    if (privacyVal === strings.followersMyTeamClub) {
      const isMyTeamClub = checkIsMyTeamClub(entityId);

      return isMyTeamClub || entityObj.is_following;
    }

    if (privacyVal === strings.byrequestaccepted) {
      return entityObj.is_following;
    }

    if (
      privacyVal === strings.teamAndTheirMembers ||
      privacyVal === strings.clubAndTheirMembers
    ) {
      const isMyTeamClub = checkIsMyTeamClub(entityId);
      return isMyTeamClub;
    }
    return true;
  };

  const getPrivacyStatusForSportActivity = (sportObj = {}, entityObj = {}) => {
    const privacyKeys = [
      PrivacyKeyEnum.HomeFacility,
      PrivacyKeyEnum.Clubs,
      PrivacyKeyEnum.Leagues,
      PrivacyKeyEnum.Teams,
      PrivacyKeyEnum.YearOfBirth,
      PrivacyKeyEnum.Gender,
      PrivacyKeyEnum.Height,
      PrivacyKeyEnum.Weight,
      PrivacyKeyEnum.Langueages,
      PrivacyKeyEnum.Scoreboard,
      PrivacyKeyEnum.ScoreboardTimePeriod,
    ];
    const privacyObj = {};
    if (sportObj.privacy_settings) {
      privacyKeys.forEach((key) => {
        if (
          [
            PrivacyKeyEnum.Clubs,
            PrivacyKeyEnum.Leagues,
            PrivacyKeyEnum.Teams,
            PrivacyKeyEnum.HomeFacility,
            PrivacyKeyEnum.Scoreboard,
          ].includes(key)
        ) {
          privacyObj[key] =
            PersonalUserPrivacyEnum[sportObj.privacy_settings[key]] ??
            PersonalUserPrivacyEnum[1];
        } else if (key === PrivacyKeyEnum.ScoreboardTimePeriod) {
          privacyObj[key] =
            ScoreboardPeriodPrivacyOptionsEnum[
              sportObj.privacy_settings[key]
            ] ?? ScoreboardPeriodPrivacyOptionsEnum[1];
        } else {
          privacyObj[key] =
            PersonalUserPrivacyEnum[sportObj.privacy_settings[key]] ??
            PersonalUserPrivacyEnum[0];
        }
      });
    } else {
      privacyKeys.forEach((key) => {
        if (
          [
            PrivacyKeyEnum.Clubs,
            PrivacyKeyEnum.Leagues,
            PrivacyKeyEnum.Teams,
            PrivacyKeyEnum.HomeFacility,
            PrivacyKeyEnum.Scoreboard,
          ].includes(key)
        ) {
          privacyObj[key] = PersonalUserPrivacyEnum[1];
        } else if (key === PrivacyKeyEnum.ScoreboardTimePeriod) {
          privacyObj[key] = ScoreboardPeriodPrivacyOptionsEnum[1];
        } else {
          privacyObj[key] = PersonalUserPrivacyEnum[0];
        }
      });
    }
    const privacySettings = {};
    privacyKeys.forEach((item) => {
      const status = getPrivacyStatus(privacyObj[item], entityObj);
      privacySettings[item] = status;
    });

    return privacySettings;
  };

  return {getPrivacyStatus, getPrivacyStatusForSportActivity};
};

export default usePrivacySettings;
