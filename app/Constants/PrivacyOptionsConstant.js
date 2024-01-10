import {strings} from '../../Localization/translation';

const PrivacyKeyEnum = {
  Slogan: 'who_can_view_slogan',
  SportActivityList: 'who_can_view_sport_activity_list',
  Posts: 'who_can_view_posts',
  Events: 'who_can_view_events',
  Gallery: 'who_can_view_gallery',
  HomeFacility: 'who_can_see_home_facility',
  Clubs: 'who_can_see_clubs',
  Leagues: 'who_can_see_leagues',
  Teams: 'who_can_see_teams',
  YearOfBirth: 'who_can_see_year_of_birth',
  Gender: 'who_can_see_gender',
  Height: 'who_can_see_height',
  Weight: 'who_can_see_weight',
  Langueages: 'who_can_see_languages',
  Scoreboard: 'who_can_see_scoreboard',
  ScoreboardTimePeriod: 'what_period_can_other_people_can_see',
  Follow: 'who_can_follow_you',
  Chats: 'who_can_invite_you_to_chat',
  FollowingAndFollowers: 'who_can_view_follower_following',
  InviteToJoinGroup: 'who_can_invite_to_join_group',
  InviteToJoinEvent: 'invite_me_event',
  Tag: 'who_can_tag_post_comment_or_reply',
  CreateTeamForDoubleSport: 'who_can_invite_for_doubles_team',
  SharePost: 'who_can_share_post',
  CommentOnPost: 'who_can_comment_reply_post',
};

const UserPrivacySettingOptions = [
  {
    title: strings.mainHome,
    data: [
      {
        label: strings.slogan,
        extraData: null,
      },
      {
        label: strings.SportActivitiesList,
        extraData: null,
      },
      {
        label: strings.postTitle,
        extraData: null,
      },
      {
        label: strings.event,
        extraData: null,
      },
      {
        label: strings.galleryTitle,
        extraData: null,
      },
    ],
  },
  {
    title: strings.sportsActivityPage,
    data: [],
  },
  {
    title: strings.otherTitle,
    data: [
      {label: strings.followingAndFollowers, extraData: null},
      {label: strings.chatsTitle, extraData: null},
      {label: strings.invite, extraData: null},
      {label: strings.tag, extraData: null},
      {label: strings.createTeamDoublesSports, extraData: null},
      {label: strings.commentAndReply, extraData: null},
      {label: strings.shareTitle, extraData: null},
    ],
  },
];

const binaryPrivacyOptions = [
  {label: strings.everyoneTitleText, value: 1},
  {label: strings.onlymeTitleText, value: 0},
];

const BinaryPrivacyOptionsEnum = {
  0: strings.onlymeTitleText,
  1: strings.everyoneTitleText,
};

const PersonalUserPrivacyEnum = {
  0: strings.onlymeTitleText,
  1: strings.everyoneTitleText,
  2: strings.followersMyTeamClub,
  3: strings.myTeamClub,
};

const ScoreboardPeriodPrivacyOptionsEnum = {
  1: strings.all,
  2: strings.past6Months,
  3: strings.past3Months,
  4: strings.past1Month,
};

const defaultOptions = [
  {label: strings.everyoneTitleText, value: 1},
  {label: strings.followersMyTeamClub, value: 2},
  {label: strings.myTeamClub, value: 3},
  {label: strings.onlymeTitleText, value: 0},
];

const scoreboardPeriodPrivacyOptions = [
  {label: strings.all, value: 1},
  {label: strings.past6Months, value: 2},
  {label: strings.past3Months, value: 3},
  {label: strings.past1Month, value: 4},
];

const followerFollowingOptions = [
  {label: strings.everyoneTitleText, value: 1},
  {label: strings.byrequestaccepted, value: 2},
];

const FollowerFollowingOptionsEnum = {
  1: strings.everyoneTitleText,
  2: strings.byrequestaccepted,
};

const inviteToGroupOptions = [
  {label: strings.teamAndTheirMembers, value: 1},
  {label: strings.clubAndTheirMembers, value: 2},
  {label: strings.leagueAndTheirMembers, value: 3},
  {label: strings.noneText, value: 0},
];

const InviteToGroupOptionsEnum = {
  0: strings.noneText,
  1: strings.teamAndTheirMembers,
  2: strings.clubAndTheirMembers,
  3: strings.leagueAndTheirMembers,
};

const inviteToEventOptions = [
  {label: strings.everyoneTitleText, value: 1},
  {label: strings.followersMyTeamClub, value: 2},
  {label: strings.myTeamClub, value: 3},
  {label: strings.noneText, value: 0},
];

const InviteToEventOptionsEnum = {
  0: strings.noneText,
  1: strings.everyoneTitleText,
  2: strings.followersMyTeamClub,
  3: strings.myTeamClub,
};

export {
  UserPrivacySettingOptions,
  defaultOptions,
  PersonalUserPrivacyEnum,
  PrivacyKeyEnum,
  scoreboardPeriodPrivacyOptions,
  ScoreboardPeriodPrivacyOptionsEnum,
  followerFollowingOptions,
  inviteToGroupOptions,
  inviteToEventOptions,
  FollowerFollowingOptionsEnum,
  InviteToEventOptionsEnum,
  InviteToGroupOptionsEnum,
  binaryPrivacyOptions,
  BinaryPrivacyOptionsEnum,
};
