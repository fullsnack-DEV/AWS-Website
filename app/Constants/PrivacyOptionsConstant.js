import {strings} from '../../Localization/translation';

const UserPrivacySettingOptions = [
  {
    title: strings.mainHome,
    data: [
      strings.slogan,
      strings.SportActivitiesList,
      strings.postTitle,
      strings.event,
      strings.galleryTitle,
    ],
  },
  {
    title: strings.sportsActivityPage,
    data: [],
  },
  {
    title: strings.otherTitle,
    data: [
      strings.followingAndFollowers,
      strings.chatsTitle,
      strings.invite,
      strings.tag,
      strings.CreateTeamDoublesSports,
      strings.shareTitle,
    ],
  },
];

const PersonUserPrivacyEnum = {
  0: strings.onlymeTitleText,
  1: strings.everyoneTitleText,
  2: strings.followersMyTeamClub,
  3: strings.myTeamClub,
};

const PrivacyKeyEnum = {
  Slogan: 'who_can_view_slogan',
  SportActivityList: 'who_can_view_sport_activity_list',
  Posts: 'who_can_view_posts',
  Events: 'who_can_view_events',
  Gallery: 'who_can_view_gallery',
};

const defaultOptions = [
  {
    label: strings.everyoneTitleText,
    value: 1,
  },
  {
    label: strings.followersMyTeamClub,
    value: 2,
  },
  {
    label: strings.myTeamClub,
    value: 3,
  },
  {
    label: strings.onlymeTitleText,
    value: 0,
  },
];

export {
  UserPrivacySettingOptions,
  defaultOptions,
  PersonUserPrivacyEnum,
  PrivacyKeyEnum,
};
