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
      return '';

    default:
      return '';
  }
};

const getTitleForRegister = (entityType = Verbs.entityTypePlayer) => {
  switch (entityType) {
    case Verbs.entityTypePlayer:
      return strings.registerAsPlayerTitle;

    case Verbs.entityTypeReferee:
      return strings.registerRefereeTitle;

    case Verbs.entityTypeScorekeeper:
      return strings.registerScorekeeperTitle;

    default:
      return '';
  }
};

export {
  getProgressBarColor,
  getIsAvailable,
  getHeaderTitle,
  getScoreboardListTitle,
  getTitleForRegister,
};
