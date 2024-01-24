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
  JoinAsMember: 'who_can_join_for_member',
  InvitePersonToJoinGroup: 'who_can_invite_member',
  ViewYourGroupMembers: 'who_can_see_members',
  Followers: 'who_can_see_followers',
  InviteForTeam: 'who_can_invite_for_team',
  InviteForClub: 'who_can_invite_for_club',
  InviteForLeague: 'who_can_invite_for_league',
  LikeCount: 'who_can_see_like_count',
  TeamJoinClub: 'what_team_join_club',
};

const UserPrivacySettingOptions = [
  {
    title: 'mainHome',
    data: [
      {
        label: 'slogan',
        extraData: null,
      },
      {
        label: 'SportActivitiesList',
        extraData: null,
      },
      {
        label: 'postTitle',
        extraData: null,
      },
      {
        label: 'event',
        extraData: null,
      },
      {
        label: 'galleryTitle',
        extraData: null,
      },
    ],
  },
  {
    title: 'sportsActivityPage',
    data: [],
  },
  {
    title: 'otherTitle',
    data: [
      {label: 'followingFollower', extraData: null},
      {label: 'teamClubAndLeague', extraData: null},
      {label: 'eventInvitation', extraData: null},
      {label: 'chatsTitle', extraData: null},
      {label: 'tag', extraData: null},
      {label: 'blocked', extraData: null},
    ],
  },
];

const binaryPrivacyOptions = [
  {label: 'yes', value: 1},
  {label: 'no', value: 0},
];

const BinaryPrivacyOptionsEnum = {
  0: 'no',
  1: 'yes',
};

const PersonalUserPrivacyEnum = {
  0: 'onlymeTitleText',
  1: 'everyoneTitleText',
  2: 'followersMyTeamClub',
  3: 'myTeamClub',
};

const ScoreboardPeriodPrivacyOptionsEnum = {
  1: 'all',
  2: 'past6Months',
  3: 'past3Months',
  4: 'past1Month',
};

const defaultOptions = [
  {label: 'everyoneTitleText', value: 1},
  {label: 'followersMyTeamClub', value: 2},
  {label: 'myTeamClub', value: 3},
  {label: 'onlymeTitleText', value: 0},
];

const scoreboardPeriodPrivacyOptions = [
  {label: 'all', value: 1},
  {label: 'past6Months', value: 2},
  {label: 'past3Months', value: 3},
  {label: 'past1Month', value: 4},
];

const followerFollowingOptions = [
  {label: 'everyoneTitleText', value: 0},
  {label: 'byrequestaccepted', value: 1},
];

const FollowerFollowingOptionsEnum = {
  0: 'everyoneTitleText',
  1: 'byrequestaccepted',
};

const inviteToGroupOptions = [
  {label: 'teamAndTheirMembers', value: 1},
  {label: 'clubAndTheirMembers', value: 2},
  {label: 'leagueAndTheirMembers', value: 3},
  {label: 'noneText', value: 0},
];

const InviteToGroupOptionsEnum = {
  0: 'noneText',
  1: 'teamAndTheirMembers',
  2: 'clubAndTheirMembers',
  3: 'leagueAndTheirMembers',
};

const inviteToEventOptions = [
  {label: 'everyoneTitleText', value: 1},
  {label: 'followersMyTeamClub', value: 2},
  {label: 'myTeamClub', value: 3},
  {label: 'noneText', value: 4},
];

const InviteToEventOptionsEnum = {
  4: 'noneText',
  1: 'everyoneTitleText',
  2: 'followersMyTeamClub',
  3: 'myTeamClub',
};
const TeamPrivacySettingsOptions = [
  'postTitle',
  'events',
  'galleryTitle',
  'membersTitle',
  'clubAndLeague',
  'followerText',
  'chatsTitle',
  'tag',
  'blocked',
];

const ClubPrivacySettingsOptions = [
  'postTitle',
  'events',
  'galleryTitle',
  'membersTitle',
  'team',
  'followerText',
  'chatsTitle',
  'tag',
  'blocked',
];

const groupPrivacyDefalutOptions = [
  {label: 'everyoneTitleText', value: 1},
  {label: 'followersAndClub', value: 2},
  {label: 'teamMembersAndClub', value: 3},
  {label: 'onlyTeamTitle', value: 4},
];

const GroupDefalutPrivacyOptionsEnum = {
  1: 'everyoneTitleText',
  2: 'followersAndClub',
  3: 'teamMembersAndClub',
  4: 'onlyTeamTitle',
};

const groupDefaultPrivacyOptionsForDoubleTeam = [
  {label: 'everyoneTitleText', value: 1},
  {label: 'followersAndClub', value: 2},
  {label: 'teamMembersAndClub', value: 3},
  {label: 'clubsAndTeam', value: 0},
];

const GroupDefaultPrivacyOptionsForDoubleTeamEnum = {
  1: 'everyoneTitleText',
  2: 'followersAndClub',
  3: 'teamMembersAndClub',
  0: 'clubsAndTeam',
};

const groupJoinOptions = [
  {label: 'everyoneTitleText', value: 0},
  {label: 'requestAccepted', value: 1},
  {label: 'invitedOnly', value: 2},
];

const GroupJoinOptionsEnum = {
  0: 'everyoneTitleText',
  1: 'requestAccepted',
  2: 'invitedOnly',
};

const groupInviteToJoinOptions = [
  {label: 'teamMembers', value: 1},
  {label: 'onlyTeamTitle', value: 0},
];

const GroupInviteToJoinOptionsEnum = {
  1: 'teamMembers',
  0: 'onlyTeamTitle',
};

const groupInviteToJoinForTeamSportOptions = [
  {label: 'teamMembersAndClub', value: 1},
  {label: 'clubsAndTeam', value: 0},
];

const GroupInviteToJoinForTeamSportOptionsEnum = {
  1: 'teamMembersAndClub',
  0: 'clubsAndTeam',
};

const teamChatPrivacyOptions = [
  {label: 'everyoneTitleText', value: 1},
  {label: 'followersAndClub', value: 2},
  {label: 'teamMembersAndClub', value: 3},
  {label: 'clubstitle', value: 4},
];

const TeamChatPrivacyOptionsEnum = {
  1: 'everyoneTitleText',
  2: 'followersAndClub',
  3: 'teamMembersAndClub',
  4: 'clubstitle',
};

const feedsPrivacyOption = [
  {label: 'offText', value: 0},
  {label: 'onText', value: 1},
];

const feedsHideUnhideOption = [
  {label: 'hide', value: 0},
  {label: 'unhide', value: 1},
];

const defaultClubPrivacyOptions = [
  {label: 'everyoneTitleText', value: 1},
  {label: 'followerTitleText', value: 2},
  {label: 'clubMember', value: 3},
  {label: 'onlyClub', value: 4},
];

const DefaultClubPrivacyOptionsEnum = {
  1: 'everyoneTitleText',
  2: 'followerTitleText',
  3: 'clubMember',
  4: 'onlyClub',
};

const inviteToJoinClubOptions = [
  {label: 'clubMembersAndTeams', value: 1},
  {label: 'onlyClub', value: 0},
];

const InviteToJoinClubOptionsEnum = {
  0: 'onlyClub',
  1: 'clubMembersAndTeams',
};

const teamJoinClubOptions = [
  {label: 'allTeams', value: 0},
  {label: 'byrequestaccepted', value: 1},
  {label: 'invitedOnly', value: 2},
];

const TeamJoinClubOptionsEnum = {
  0: 'allTeams',
  1: 'byrequestaccepted',
  2: 'invitedOnly',
};

const clubChatPrivacyOptions = [
  {label: 'everyoneTitleText', value: 1},
  {label: 'followerTitleText', value: 2},
  {label: 'clubMember', value: 3},
  {label: 'teamsTitleText', value: 4},
];

const ClubChatPrivacyOptionsEnum = {
  1: 'everyoneTitleText',
  2: 'followerTitleText',
  3: 'clubMember',
  4: 'teamsTitleText',
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
  TeamPrivacySettingsOptions,
  groupPrivacyDefalutOptions,
  groupJoinOptions,
  groupInviteToJoinOptions,
  teamChatPrivacyOptions,
  groupDefaultPrivacyOptionsForDoubleTeam,
  GroupDefalutPrivacyOptionsEnum,
  GroupDefaultPrivacyOptionsForDoubleTeamEnum,
  feedsHideUnhideOption,
  feedsPrivacyOption,
  GroupJoinOptionsEnum,
  GroupInviteToJoinOptionsEnum,
  groupInviteToJoinForTeamSportOptions,
  GroupInviteToJoinForTeamSportOptionsEnum,
  TeamChatPrivacyOptionsEnum,
  ClubPrivacySettingsOptions,
  defaultClubPrivacyOptions,
  DefaultClubPrivacyOptionsEnum,
  inviteToJoinClubOptions,
  InviteToJoinClubOptionsEnum,
  teamJoinClubOptions,
  TeamJoinClubOptionsEnum,
  clubChatPrivacyOptions,
  ClubChatPrivacyOptionsEnum,
};
