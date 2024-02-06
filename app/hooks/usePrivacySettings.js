import {useCallback, useContext, useEffect, useState} from 'react';
import {strings} from '../../Localization/translation';
import AuthContext from '../auth/context';
import Verbs from '../Constants/Verbs';
import {
  PersonalUserPrivacyEnum,
  PrivacyKeyEnum,
  ScoreboardPeriodPrivacyOptionsEnum,
} from '../Constants/PrivacyOptionsConstant';
import {getUserFollowerFollowing} from '../api/Users';
import {getGroupMembers} from '../api/Groups';

const usePrivacySettings = () => {
  const authContext = useContext(AuthContext);
  const [followings, setFollowings] = useState([]);
  const [memberList, setMemberList] = useState([]);

  useEffect(() => {
    getUserFollowerFollowing(
      authContext.entity.uid,
      Verbs.entityTypePlayers,
      Verbs.followingVerb,
      authContext,
    )
      .then((res) => {
        const idList =
          res.payload?.length > 0
            ? res.payload.map((item) => item.user_id ?? item.group_id)
            : [];
        setFollowings(idList);
      })
      .catch((err) => {
        console.log('error ==>', err);
      });
  }, [authContext]);

  useEffect(() => {
    if (
      authContext.entity.role === Verbs.entityTypeTeam ||
      authContext.entity.role === Verbs.entityTypeClub
    ) {
      getGroupMembers(authContext.entity.uid, authContext)
        .then((res) => {
          const idList =
            res.payload?.length > 0
              ? res.payload.map((item) => item.user_id)
              : [];
          setMemberList(idList);
        })
        .catch((err) => {
          console.log('error ==>', err);
        });
    }
  }, [authContext]);

  const checkIsMyTeamClub = useCallback(
    (entityId = '') => {
      if (
        authContext.entity.role === Verbs.entityTypeTeam ||
        authContext.entity.role === Verbs.entityTypeClub
      ) {
        if (memberList.length > 0) {
          return memberList.includes(entityId);
        }

        if (authContext.entity.obj.user_history?.length > 0) {
          return authContext.entity.obj.user_history.includes(entityId);
        }
        return false;
      }

      return false;
    },
    [authContext.entity.role, authContext.entity.obj.user_history, memberList],
  );

  const checkIsMyFollower = useCallback(
    (entityId = '', entityObj = {}) => {
      const isMyFollower =
        followings.includes(entityId) || entityObj?.is_following;

      return isMyFollower;
    },
    [followings],
  );

  const getPrivacyStatus = useCallback(
    (value = '', entityObj = {}) => {
      if (!value) {
        return true;
      }
      const privacyVal = strings[value];

      const entityId = entityObj.user_id ?? entityObj.group_id;

      if (privacyVal === strings.yes) {
        return true;
      }
      if (privacyVal === strings.no) {
        return false;
      }

      if (
        entityId === authContext.entity.uid ||
        [strings.all, strings.everyoneTitleText].includes(privacyVal)
      ) {
        return true;
      }

      if (
        [
          strings.onlymeTitleText,
          strings.noneText,
          strings.onlyTeamTitle,
          strings.onlyClub,
        ].includes(privacyVal)
      ) {
        return authContext.entity.uid === entityId;
      }

      if (privacyVal === strings.invitedOnly) {
        return false;
      }

      if (privacyVal === strings.myTeamClub) {
        if (
          authContext.entity.role === Verbs.entityTypeTeam ||
          authContext.entity.role === Verbs.entityTypeClub
        ) {
          const isMyTeamClub = checkIsMyTeamClub(entityId);

          return isMyTeamClub;
        }
        return false;
      }

      if (privacyVal === strings.followersMyTeamClub) {
        const isMyTeamClub = checkIsMyTeamClub(entityId);
        const isMyFollower = checkIsMyFollower(entityId, entityObj);

        return isMyTeamClub || isMyFollower;
      }

      if (
        privacyVal === strings.teamAndTheirMembers ||
        privacyVal === strings.clubAndTheirMembers
      ) {
        const isMyTeamClub = checkIsMyTeamClub(entityId);
        return isMyTeamClub;
      }

      if (privacyVal === strings.followersAndClub) {
        const isMyFollower = checkIsMyFollower(entityId, entityObj);
        const isMyClub =
          entityObj.parent_groups?.length > 0
            ? entityObj.parent_groups.includes(authContext.entity.uid)
            : false;

        return isMyClub || isMyFollower;
      }

      if (privacyVal === strings.teamMembersAndClub) {
        const isTeamMember =
          entityObj.user_history?.length > 0
            ? entityObj.user_history.includes(authContext.entity.uid)
            : false;

        const isMyClub =
          entityObj.parent_groups?.length > 0
            ? entityObj.parent_groups.includes(authContext.entity.uid)
            : false;

        return isTeamMember || isMyClub;
      }

      if (privacyVal === strings.clubsAndTeam) {
        if (authContext.entity.role === Verbs.entityTypeTeam) {
          return authContext.entity.uid === entityId;
        }

        if (authContext.entity.role === Verbs.entityTypeClub) {
          const isMyClub =
            entityObj.parent_groups?.length > 0
              ? entityObj.parent_groups.includes(authContext.entity.uid)
              : false;

          return isMyClub;
        }
        return false;
      }

      if (
        privacyVal === strings.teamMembers ||
        privacyVal === strings.clubMember
      ) {
        return memberList.includes(entityId);
      }

      if (privacyVal === strings.followerTitleText) {
        const isMyFollower = checkIsMyFollower(entityId, entityObj);
        return isMyFollower;
      }

      if (privacyVal === strings.allTeams) {
        return authContext.entity.role === Verbs.entityTypeTeam;
      }

      if (privacyVal === strings.clubMembersAndTeams) {
        if (authContext.entity.role === Verbs.entityTypeTeam) {
          const isMyTeam =
            authContext.entity.obj.parent_groups?.length > 0
              ? entityObj.parent_groups.includes(authContext.entity.uid)
              : false;

          const isMyMember = memberList.includes(authContext.entity.uid);

          return isMyMember || isMyTeam;
        }
        return false;
      }

      if (privacyVal === strings.teamsTitleText) {
        if (authContext.entity.role === Verbs.entityTypeTeam) {
          const isMyTeam =
            authContext.entity.obj.parent_groups?.length > 0
              ? entityObj.parent_groups.includes(authContext.entity.uid)
              : false;
          return isMyTeam;
        }
        return false;
      }
      return true;
    },
    [
      authContext.entity.obj.parent_groups,
      authContext.entity.role,
      authContext.entity.uid,
      checkIsMyFollower,
      checkIsMyTeamClub,
      memberList,
    ],
  );

  const getPrivacyStatusForSportActivity = (sportObj = {}, entityObj = {}) => {
    const privacyKeys = [
      PrivacyKeyEnum.HomeFacility,
      PrivacyKeyEnum.Clubs,
      PrivacyKeyEnum.Leagues,
      PrivacyKeyEnum.Teams,
      PrivacyKeyEnum.Scoreboard,
      PrivacyKeyEnum.ScoreboardTimePeriod,
    ];
    const privacyObj = {};

    privacyKeys.forEach((key) => {
      if (
        sportObj.privacy_settings &&
        sportObj.privacy_settings[key] !== undefined
      ) {
        if (sportObj.sport_type === Verbs.singleSport) {
          if (key === PrivacyKeyEnum.ScoreboardTimePeriod) {
            privacyObj[key] =
              ScoreboardPeriodPrivacyOptionsEnum[
                sportObj.privacy_settings[key]
              ];
          } else {
            privacyObj[key] =
              PersonalUserPrivacyEnum[sportObj.privacy_settings[key]];
          }
        } else {
          privacyObj[key] =
            PersonalUserPrivacyEnum[sportObj.privacy_settings[key]];
        }
      } else if (sportObj.sport_type === Verbs.singleSport) {
        if (key === PrivacyKeyEnum.ScoreboardTimePeriod) {
          privacyObj[key] = ScoreboardPeriodPrivacyOptionsEnum[1];
        } else {
          privacyObj[key] = PersonalUserPrivacyEnum[1];
        }
      } else {
        privacyObj[key] = PersonalUserPrivacyEnum[0];
      }
    });

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
