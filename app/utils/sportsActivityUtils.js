import {format} from 'react-string-format';
import {strings} from '../../Localization/translation';
import colors from '../Constants/Colors';
import Verbs from '../Constants/Verbs';

const getProgressBarColor = (entityType = Verbs.entityTypePlayer) => {
  switch (entityType) {
    case Verbs.entityTypePlayer:
      return colors.darkYellowColor;

    case Verbs.entityTypeReferee:
      return colors.darkThemeColor;

    case Verbs.entityTypeScorekeeper:
      return colors.eventBlueColor;

    default:
      return colors.grayBackgroundColor;
  }
};

const getIsAvailable = (sportObj = {}, entityType = Verbs.entityTypePlayer) => {
  switch (entityType) {
    case Verbs.entityTypePlayer:
      return sportObj?.setting?.availibility === Verbs.on;

    case Verbs.entityTypeReferee:
      return sportObj?.setting?.referee_availibility === Verbs.on;

    case Verbs.entityTypeScorekeeper:
      return sportObj?.setting?.scorekeeper_availibility === Verbs.on;

    default:
      return false;
  }
};

const getEntityTpeLabel = (type = Verbs.entityTypePlayer) => {
  switch (type) {
    case Verbs.entityTypePlayer:
      return strings.playingText;

    case Verbs.entityTypeReferee:
      return strings.refereeingTitleText;

    case Verbs.entityTypeScorekeeper:
      return strings.scorekeepingTitleText;

    default:
      return type;
  }
};

const getHeaderTitle = (entityType = Verbs.entityTypePlayer) => {
  switch (entityType) {
    case Verbs.entityTypePlayer:
      return strings.playingText;

    case Verbs.entityTypeReferee:
      return strings.refereeingTitleText;

    case Verbs.entityTypeScorekeeper:
      return strings.scorekeepingTitleText;

    default:
      return '';
  }
};

const getScoreboardListTitle = (entityType = Verbs.entityTypePlayer) => {
  switch (entityType) {
    case Verbs.entityTypePlayer:
      return strings.scoreboard;

    case Verbs.entityTypeReferee:
      return strings.refereedMatchesTitle;

    case Verbs.entityTypeScorekeeper:
      return strings.scorekeptMatches;

    default:
      return '';
  }
};

const getTitleForRegister = (
  entityType = Verbs.entityTypePlayer,
  forHome = false,
) => {
  switch (entityType) {
    case Verbs.entityTypePlayer:
      return forHome
        ? strings.registeredAsPlayerTitle
        : strings.registerAsPlayerTitle;

    case Verbs.entityTypeReferee:
      return forHome
        ? strings.registeredRefreeTitle
        : strings.registerRefereeTitle;

    case Verbs.entityTypeScorekeeper:
      return forHome
        ? strings.registeredScorekeeperTitle
        : strings.registerScorekeeperTitle;

    default:
      return '';
  }
};

const getSportList = (sportList, role = Verbs.entityTypePlayer) => {
  const list = [];
  if (
    role === Verbs.entityTypePlayer ||
    role === Verbs.entityTypeUser ||
    role === Verbs.entityTypeClub
  ) {
    sportList.forEach((item) => {
      if (item.format?.length > 0) {
        item.format.forEach((sport) => {
          const obj = {
            sport: sport.sport,
            sport_name: sport.sport_name,
            sport_type: sport.sport_type,
            player_review_properties: item.player_review_properties,
            sport_image: item.player_image,
            default_setting: item.default_setting,
          };
          list.push(obj);
        });
      }
    });
  } else if (role === Verbs.entityTypeTeam) {
    sportList.forEach((item) => {
      if (item.format?.length > 0) {
        item.format.forEach((sport) => {
          if (sport.entity_type === Verbs.sportTypeTeam) {
            const obj = {
              sport: sport.sport,
              sport_name: sport.sport_name,
              sport_type: sport.sport_type,
              sport_image: item.player_image,
              team_review_properties: item.team_review_properties,
              default_setting: item.default_setting,
            };
            list.push(obj);
          }
        });
      }
    });
  } else {
    sportList.forEach((item) => {
      const obj = {
        sport: item.sport,
        sport_name: item.sport_name,
        sport_type: item.sport_type,
        default_setting: item.default_setting,
      };
      if (role === Verbs.entityTypeReferee) {
        obj.sport_image = item.referee_image;
        obj.referee_review_properties = item.referee_review_properties;
      }

      if (role === Verbs.entityTypeScorekeeper) {
        obj.sport_image = item.scorekeeper_image;
        obj.scorekeeper_review_properties = item.scorekeeper_review_properties;
      }

      list.push(obj);
    });
  }
  return list.length > 0
    ? list.sort((a, b) => a.sport.localeCompare(b.sport))
    : [];
};
const getSingleSportList = (sports) => {
  const sportList = (sports || []).filter(
    (obj) => obj.sport_type === Verbs.singleSport,
  );
  sportList.sort((a, b) =>
    a.sport_name.normalize().localeCompare(b.sport_name.normalize()),
  );
  return sportList;
};
const getEntitySportList = (user = {}, role = Verbs.entityTypePlayer) => {
  let sportList = [];
  if (role === Verbs.entityTypePlayer || role === Verbs.entityTypeUser) {
    sportList =
      user.registered_sports?.length > 0
        ? user.registered_sports.filter(
            (item) => item.is_active || !('is_active' in item),
          )
        : [];
  } else if (role === Verbs.entityTypeReferee) {
    sportList =
      user.referee_data?.length > 0
        ? user.referee_data.filter(
            (item) => item.is_active || !('is_active' in item),
          )
        : [];
  } else if (role === Verbs.entityTypeScorekeeper) {
    sportList =
      user.scorekeeper_data?.length > 0
        ? user.scorekeeper_data.filter(
            (item) => item.is_active || !('is_active' in item),
          )
        : [];
  }

  return [...sportList];
};

const getEntitySport = ({
  user = {},
  role = Verbs.entityTypePlayer,
  sportType = '',
  sport = '',
}) => {
  const sportList = getEntitySportList(user, role);
  let obj = {};
  if (role === Verbs.entityTypePlayer) {
    obj = sportList.find(
      (ele) => ele.sport === sport && ele.sport_type === sportType,
    );
  } else {
    obj = sportList.find((ele) => ele.sport === sport);
  }
  return obj ?? {};
};

const getExcludedSportsList = (authContext, role = Verbs.entityTypePlayer) => {
  const newData = [];
  const sportArr = getSportList(authContext.sports, role);
  const alreadyAddedSportsList = getEntitySportList(
    authContext.entity.obj,
    role,
  );
  sportArr.forEach((item) => {
    let obj = {};
    if (role === Verbs.entityTypePlayer) {
      obj = alreadyAddedSportsList.find(
        (ele) => ele.sport === item.sport && ele.sport_type === item.sport_type,
      );
    } else {
      obj = alreadyAddedSportsList.find((ele) => ele.sport === item.sport);
    }
    if (!obj) {
      newData.push(item);
    }
  });
  return newData;
};

const getSportDefaultSettings = (sport = '', sportList = []) => {
  if (sport) {
    const sportObj = sportList.find((item) => item.sport === sport);
    return sportObj?.default_setting ?? {};
  }
  return {};
};

const getSportDetails = (
  sport = '',
  sportType = '',
  sportList = [],
  role = Verbs.entityTypePlayer,
) => {
  const obj = {
    sport,
    sport_type: sportType,
  };
  if (sport) {
    const sportObj = sportList.find((item) => item.sport === sport);

    if (!sportObj) {
      return obj;
    }
    if (sportType) {
      const sportWithType = sportObj.format.find(
        (ele) => ele.sport_type === sportType,
      );
      if (sportWithType) {
        obj.sport_name = sportWithType.sport_name;
      } else {
        obj.sport_name = sportObj.sport_name;
      }
    } else {
      obj.sport_name = sportObj.sport_name;
    }

    if (role === Verbs.entityTypeReferee) {
      obj.sport_image = sportObj.referee_image;
    }

    if (role === Verbs.entityTypeScorekeeper) {
      obj.sport_image = sportObj.scorekeeper_image;
    }

    if (
      role === Verbs.entityTypeTeam ||
      role === Verbs.entityTypePlayer ||
      role === Verbs.entityTypeUser ||
      role === Verbs.entityTypeClub
    ) {
      if (sportObj.format.length > 1 && sportType === Verbs.sportTypeDouble) {
        obj.sport_image = sportObj.format[1].player_image;
        obj.sport_image_orange = sportObj.format[1].player_image_orange_doubles;
      } else if (
        sportObj.format.length > 1 &&
        sportType === Verbs.sportTypeSingle
      ) {
        obj.sport_image = sportObj.format[0].player_image;
        obj.sport_image_orange = sportObj.format[0].player_image_orange;
      } else {
        obj.sport_image = sportObj.player_image;
        obj.sport_image_orange = sportObj.player_image_orange;
      }
    }
  }

  return obj;
};

const getSportName = (sport = '', sportType = '', sportList = []) => {
  const obj = {
    sport,
    sport_type: sportType,
  };
  if (sport) {
    const sportObj = sportList.find((item) => item.sport === sport);
    if (!sportObj) {
      return obj.sport;
    }
    if (sportType) {
      const sportWithType = sportObj.format.find(
        (ele) => ele.sport_type === sportType,
      );
      if (sportWithType) {
        obj.sport_name = sportWithType.sport_name;
      } else {
        obj.sport_name = sportObj.sport_name;
      }
    } else {
      obj.sport_name = sportObj.sport_name;
    }
  }

  return obj.sport_name;
};

const getCardBorderColor = (entityType) => {
  switch (entityType) {
    case Verbs.entityTypePlayer:
      return colors.orangeColorCard;

    case Verbs.entityTypeReferee:
      return colors.darkThemeColor;

    case Verbs.entityTypeScorekeeper:
      return colors.blueColorCard;

    default:
      return colors.userPostTimeColor;
  }
};

const getGroupSportName = (groupData = {}, sportList = [], maxSports = 0) => {
  if (groupData.entity_type === Verbs.entityTypeClub) {
    let name = '';

    if (groupData.sports?.length > 0) {
      groupData.sports.forEach((item, index) => {
        const sportname = getSportName(item.sport, item.sport_type, sportList);

        if (maxSports === 0) {
          name += index !== 0 ? `, ${sportname}` : sportname;
        } else if (index < maxSports) {
          name += index !== 0 ? `, ${sportname}` : sportname;
        }
      });
      if (maxSports !== 0 && groupData.sports.length > maxSports) {
        name += ` ${format(
          strings.andMoreText,
          groupData.sports.length - maxSports,
        )}`;
      }
    } else {
      name = '';
    }
    return name;
  }
  return getSportName(groupData.sport, groupData.sport_type, sportList);
};

export {
  getProgressBarColor,
  getIsAvailable,
  getHeaderTitle,
  getScoreboardListTitle,
  getTitleForRegister,
  getEntitySportList,
  getEntitySport,
  getSportList,
  getExcludedSportsList,
  getSportDetails,
  getSportName,
  getCardBorderColor,
  getSportDefaultSettings,
  getEntityTpeLabel,
  getSingleSportList,
  getGroupSportName,
};
