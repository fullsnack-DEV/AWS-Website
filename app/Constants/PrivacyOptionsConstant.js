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
  Follow: 'who_can_follow_me',
  Chats: 'who_can_invite_you_to_chat',
  FollowingAndFollowers: 'who_can_view_follower_following',
  InviteToJoinGroup: 'who_can_invite_to_join_group',
  InviteToJoinEvent: 'invite_me_event',
  Tag: 'who_can_tag_post_comment_or_reply',
  CreateTeamForDoubleSport: 'who_can_invite_for_doubles_team',
  SharePost: 'who_can_share_post',
  CommentOnPost: 'who_can_comment_reply_post',
  PostWrite: 'who_can_write_posts',
  MemberToJoinTeam: 'who_can_Join_Team',
  InvitePersonToJoinTeam: 'who_can_invite_person_to_join_your_team',
  ViewYourTeamMembers: 'who_Can_View_Your_Team_Members',
  Followers: 'who_Can_Follow_Your_Team',
  InviteForTeam: 'who_can_invite_for_team',
  InviteForClub: 'who_can_invite_for_club',
  InviteForLeague: 'who_can_invite_for_league',
  LikeCount: 'who_can_see_like_count',
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
      {label: strings.followingFollower, extraData: null},
      {label: strings.teamClubAndLeague, extraData: null},
      {label: strings.eventInvitation, extraData: null},
      {label: strings.chatsTitle, extraData: null},
      {label: strings.tag, extraData: null},
      {label: strings.blocked, extraData: null},
    ],
  },
];

const binaryPrivacyOptions = [
  {label: strings.yes, value: 1},
  {label: strings.no, value: 0},
];

const BinaryPrivacyOptionsEnum = {
  0: strings.no,
  1: strings.yes,
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
  {label: strings.everyoneTitleText, value: 0},
  {label: strings.byrequestaccepted, value: 1},
];

const FollowerFollowingOptionsEnum = {
  0: strings.everyoneTitleText,
  1: strings.byrequestaccepted,
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
const GroupPrivacySettingsOptions = [
  strings.postTitle,
  strings.events,
  strings.galleryTitle,
  strings.membersTitle,
  strings.followerTitleText,
  strings.chatsTitle,
  strings.invite,
  strings.tag,
];

const groupPrivacyDefalutOptions = [
  {label: strings.everyoneTitleText, value: 1},
  {label: strings.followersAndClub, value: 2},
  {label: strings.teamMembersAndClub, value: 3},
  {label: strings.clubsAndTeam, value: 4},
];

const GroupDefalutPrivacyOptionsEnum = {
  1: strings.everyoneTitleText,
  2: strings.followersAndClub,
  3: strings.teamMembersAndClub,
  4: strings.clubsAndTeam,
};

const groupDefaultPrivacyOptionsForDoubleTeam = [
  {label: strings.everyoneTitleText, value: 1},
  {label: strings.followersAndClub, value: 2},
  {label: strings.teamMembersAndClub, value: 3},
  {label: strings.onlyTeamTitle, value: 0},
];

const GroupDefaultPrivacyOptionsForDoubleTeamEnum = {
  1: strings.everyoneTitleText,
  2: strings.followersAndClub,
  3: strings.teamMembersAndClub,
  0: strings.onlyTeamTitle,
};

const groupMemberJoinTeam = [
  {label: strings.everyoneText, values: 1},
  {label: strings.requestAccepted, values: 2},
  {label: strings.invitedOnly, values: 0},
];

const groupMemberInvitePersonJoinTeam = [
  {label: strings.teamMembers, value: 1},
  {label: strings.onlyTeamTitle, value: 0},
];

const groupMembersSportdefaultOptions = [
  {label: strings.everyoneTitleText, value: 1},
  {label: strings.followersAndClub, value: 2},
  {label: strings.teamMembersAndClub, value: 3},
  {label: strings.clubsAndTeam, value: 4},
];

const feedsPrivacyOption = [
  {label: strings.offText, value: 0},
  {label: strings.onText, value: 1},
];

const feedsHideUnhideOption = [
  {label: strings.hide, value: 0},
  {label: strings.unhide, value: 1},
];

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
  GroupPrivacySettingsOptions,
  groupPrivacyDefalutOptions,
  groupMemberJoinTeam,
  groupMemberInvitePersonJoinTeam,
  groupMembersSportdefaultOptions,
  groupDefaultPrivacyOptionsForDoubleTeam,
  GroupDefalutPrivacyOptionsEnum,
  GroupDefaultPrivacyOptionsForDoubleTeamEnum,
  feedsHideUnhideOption,
  feedsPrivacyOption,
};
