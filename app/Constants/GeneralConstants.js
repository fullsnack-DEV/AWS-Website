import {strings} from '../../Localization/translation';

const EntityStatus = {
  playin: 'player',
  refereein: 'referee',
  scorekeeperin: 'scorekeeper',
  addNew: 'add_new',
  moreActivity: 'more',
};

const privacySettingEnum = {
  0: strings.everyoneTitleText,
  1: strings.onlymeTitleText,
  2: strings.membersTitle,
  3: strings.followerTitleText,
};

const privacyKey = {
  bio: 'who_can_see_bio',
  basicInfo: {
    gender: 'who_can_see_gender',
    yearOfBirth: 'who_can_see_year_of_birth',
    height: 'who_can_see_height',
    weight: 'who_can_see_weight',
    language: 'who_can_see_language',
  },
  club: 'who_can_see_club',
  leagues: 'who_can_see_leagues',
  homeFacility: 'who_can_see_home_facility',
  ntrp: 'who_can_see_ntrp',
  teams: 'who_can_see_teams',
};

export const ReviewRole = {
  Reviewer: 'REVIEWER',
  Reviewee: 'REVIEWEE',
  Other: 'OTHERS',
};

export const SportActivityOrder = {
  1: strings.latestDoneActivity,
  2: strings.displayInFixOrder,
};

export const ModalTypes = {
  default: 'default',
  style1: 'style1',
  style2: 'style2',
  style3: 'style3',
  style4: 'style4',
  style5: 'style5',
  style6: 'style6',
  style7: 'style7',
  style8: 'style8',
};


export const InvoiceType = {
  Invoice: 0,
  Event: 1
};

export const InvoiceRowType = {
  Recipient: 0,
  CancelRecipient: 1,
  SelectAll: 2,
};

export const InvoiceRecipientTabType = {
  People: 0,
  Teams: 1
};


export const doublesInviteOptions = {
  0: strings.none,
  1: strings.everyoneTitleText,
  2: strings.myFollowing,
};

export default EntityStatus;
export {privacySettingEnum, privacyKey};
