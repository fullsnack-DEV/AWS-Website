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

const teamInvitePrivacy = {
  teamAndMemberPrivacy: 1,
  teamOnlyPrivacyOption: 0,
};

const JoinPrivacy = {
  everyone: 0,
  acceptedByMe: 1,
  inviteOnly: 2,
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
  Event: 1,
};

export const InvoiceActionType = {
  Resend: 0,
  ResendBatch: 1,
  AddRecipient: 2,
};

export const ShowFollower = {
  visible: 1,
  notVisible: 0,
};

export const ShowMember = {
  visible: 1,
  notVisible: 0,
};

export const LogType = {
  Refund: 0,
  Payment: 1,
};

export const InvoiceRowType = {
  Recipient: 0,
  CancelRecipient: 1,
  SelectAll: 2,
};

export const InvoiceRecipientTabType = {
  People: 0,
  Teams: 1,
};

export const EventInvitePrivacy = {
  everyoneTitleText: 1,
  followersMyTeamClub: 2,
  myTeamClub: 3,

  none: 4,
};

export const groupInviteOptionsList = [
  {
    key: strings.yes,
    id: 1,
  },
  {
    key: strings.no,
    id: 0,
  },
];
export const doublesInviteOptionsList = [
  {
    key: strings.everyoneTitleText,
    id: 1,
  },
  {
    key: strings.myFollowing,
    id: 2,
  },
  {
    key: strings.none,
    id: 0,
  },
];

export const eventsInviteOptionsList = [
  {
    key: strings.everyoneTitleText,
    id: 1,
  },
  {
    key: strings.followersMyTeamClub,
    id: 2,
  },
  {
    key: strings.myTeamClub,
    id: 3,
  },
  {
    key: strings.none,
    id: 4,
  },
];

export const grouInviteOptions = {
  0: strings.no,
  1: strings.yes,
};

export const doublesInviteOptions = {
  0: strings.none,
  1: strings.everyoneTitleText,
  2: strings.myFollowing,
};

export const MonthData = [
  strings.past30DaysText,
  strings.past90DaysText,
  strings.past180Days,
  strings.past1year,
  strings.pickaDate,
];

export const eventsInviteOptions = {
  1: strings.everyoneTitleText,
  2: strings.followersMyTeamClub,
  3: strings.myTeamClub,
  0: strings.none,
};

export const currencyList = [
  {
    countryName: 'Canada',
    currency: 'CAD',
  },
  {
    countryName: 'India',
    currency: 'INR',
  },
  {
    countryName: 'Korea',
    currency: 'KRW',
  },
  {
    countryName: 'Thailand',
    currency: 'THB',
  },
  {
    countryName: 'Unites States',
    currency: 'USD',
  },
];

export const repeatArray = [
  {
    label: strings.threetimes,
    value: 3,
  },
  {
    label: strings.fourtimes,
    value: 4,
  },
  {
    label: strings.fivetimes,
    value: 5,
  },
  {
    label: strings.sixtimes,
    value: 6,
  },
  {
    label: strings.seventimes,
    value: 7,
  },
  {
    label: strings.eighttimes,
    value: 8,
  },
  {
    label: strings.ninetimes,
    value: 9,
  },
  {
    label: strings.tentimes,
    value: 10,
  },
  {
    label: strings.eleventimes,
    value: 11,
  },
  {
    label: strings.twelevetimes,
    value: 12,
  },
  {
    label: strings.thirteentimes,
    value: 13,
  },

  {
    label: strings.fourteenimes,
    value: 14,
  },
  {
    label: strings.fifteentimes,
    value: 15,
  },
  {
    label: strings.sixsteentimes,
    value: 16,
  },
  {
    label: strings.seventeentimes,
    value: 17,
  },
  {
    label: strings.eighteentimes,
    value: 18,
  },
  {
    label: strings.nineteentimes,
    value: 19,
  },
  {
    label: strings.twentyimes,
    value: 20,
  },
];

export const activeCurerncy = ['CAD', 'INR', 'KRW', 'THB', 'USD'];

export const DEFAULT_NTRP = '5.0';
export const DEFAULT_LATITUDE = 18.5204;
export const DEFAULT_LONGITUDE = 73.8567;
export const LATITUDE_DELTA = 0.01;
export const LONGITUDE_DELTA = 0.01;

export const privacyOptionForWhoCanSee = {
  0: strings.everyoneTitleText,
  2: strings.followingAndFollowers,
  3: strings.following,
  1: strings.onlymeTitleText,
};

export default EntityStatus;
export {privacySettingEnum, privacyKey, JoinPrivacy, teamInvitePrivacy};

export const urlRegex =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gim;
// export const tagRegex = /(?!\w)@\w+/gim;
export const tagRegex = /(?!\w)@[\w\p{Extended_Pictographic}]+/gu;
export const hashTagRegex = /\B(#[a-zA-Z]+\b)(?!;)/;
export const emojiRegex = /\p{Emoji}/u;
