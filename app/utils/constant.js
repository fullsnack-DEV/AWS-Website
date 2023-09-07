import Config from 'react-native-config';
import {strings} from '../../Localization/translation';
import images from '../Constants/ImagePath';
import Verbs from '../Constants/Verbs';

// AsyncConstants
export const authToken = 'authToken';
export const token_details = 'token_details';
export const Google_API_Key = Config.GOOGLE_PLACE_KEY;

export const monthsSelectionData = [
  {label: 'Past 3 Months', value: 'Past 3 Months'},
  {label: 'Past 6 Months', value: 'Past 6 Months'},
  {label: 'Past 9 Months', value: 'Past 9 Months'},
  {label: 'Past 12 Months', value: 'Past 12 Months'},
];

export const invoiceMonthsSelectionData = [
  {label: 'For past 3 Months', value: 'For past 3 Months'},
  {label: 'For past 6 Months', value: 'For past 6 Months'},
  {label: 'For past 9 Months', value: 'For past 9 Months'},
  {label: 'For past 12 Months', value: 'For past 12 Months'},
];

export const heightMesurement = [
  {label: 'cm', value: 'cm'},
  {label: 'ft', value: 'ft'},
];

export const weightMesurement = [
  {label: 'kg', value: 'kg'},
  {label: 'lb', value: 'lb'},
];

export const localize_language = [
  {name: 'English', code: 'en'},
  {name: 'Korean', code: 'ko'},
  {name: 'Thai', code: 'th'},
  {name: 'French', code: 'fr'},
];

export const mostUsedFeet = [
  {label: 'Right', value: 'Right'},
  {label: 'Left', value: 'Left'},
  {label: 'Pose', value: 'Pose'},
];

export const privacy_Data = [
  {
    id: 0,
    title: 'Everyone',
    isSelected: true,
  },
  {
    id: 1,
    title: 'Followers',
    isSelected: false,
  },
  {
    id: 2,
    title: 'Members in groups',
    isSelected: false,
  },
  {
    id: 3,
    title: 'Only me',
    isSelected: false,
  },
];

export const moveToData = ['Starting', 'Subs', 'Non-roster'];

export const TAB_ITEMS = ['Summary', 'Line-up', 'Stats', 'Gallery'];

export const TAB_ITEMS_REFEREE = ['Info', 'Refereed Match', 'Reviews'];
export const TAB_ITEMS_SCOREKEEPER = ['Info', 'Scorekeepers Match', 'Reviews'];

export const league_Data = [
  {
    group_name: 'Premiereague League',
    thumbnail: 'image',
  },
  {
    group_name: 'Premiereague League',
  },
  {
    group_name: 'La Liga',
    thumbnail: 'image',
  },
  {
    group_name: 'Premier League',
  },
];

export const history_Data = [
  {
    name: 'TownsCup',
    year: '2013',
    winner: true,
  },
  {
    name: 'Premier League',
    year: '2009-2010',
    winner: false,
  },
  {
    name: 'Established',
    year: '2002',
  },
];

export const recordButtonList = [
  'General',
  'Ace',
  'Winner',
  'Unforced',
  'Fault',
  'Foot Fault',
  'Let',
];

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const shortMonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const reservationOpetions = [
  strings.all,
  strings.playingTitleText,
  strings.refeeringText,
  strings.scorekeeperingText,
  strings.othersText,
];

export const mobileCountryCode = [
  {label: 'Canada(+1)', value: 'Canada(+1)'},
  {label: 'United States(+1)', value: 'United States(+1)'},
];

export const groupsType = [
  {type: strings.teamstitle},
  {type: strings.clubstitle},
  {type: strings.leaguesTitle},
];

export const locationType = {
  CURRENT_LOCATION: 0,
  HOME_CITY: 1,
  WORLD: 2,
  SEARCH_CITY: 3,
};
export const sortOptionType = {
  RANDOM: 0,
  LOW_TO_HIGH: 1,
  HIGH_TO_LOW: 2,
};
export const filterType = {
  RECENTMATCHS: 0,
  UPCOMINGMATCHES: 1,
  TEAMAVAILABLECHALLENGE: 2,
  PLAYERAVAILABLECHALLENGE: 3,
  REFEREES: 4,
  SCOREKEEPERS: 5,
  RECRUIITINGMEMBERS: 6,
  LOOKINGFORTEAMCLUB: 7,
};

export const game_data = [
  {
    id: 0,
    image: images.gamesImage,
    selectImage: images.gamesSelected,
    title: 'Match',
    total: 139,
    isSelected: true,
  },

  {
    id: 1,
    image: images.goalsImage,
    selectImage: images.goalsSelected,
    title: 'Goals',
    total: 12,
    isSelected: false,
  },
  {
    id: 2,
    image: images.assistsImage,
    selectImage: images.assistsSelected,
    title: 'Assists',
    total: 5,
    isSelected: false,
  },
  {
    id: 3,
    image: images.yellowCardImage,
    selectImage: images.yellowCardSelected,
    title: 'Yellow card',
    total: 6,
    isSelected: false,
  },
  {
    id: 4,
    image: images.yellowCardImage,
    selectImage: images.yellowCardSelected,
    title: 'Red card',
    total: 2,
    isSelected: false,
  },
];

export const statsData = [
  {key: 'Ace', value: '12'},
  {key: 'Double Faults', value: '4'},
  {key: '1st serve in %', value: '64%'},
  {key: '1st serve pts won %', value: '87%'},
  {key: '2nd serve pts won %', value: '52%'},
  {key: 'Winners ', value: '17'},
  {key: 'Unforced errors ', value: '12'},
  {key: 'Break Points Won ', value: '3/4'},
  {key: 'Total Points Won ', value: '57'},
];

export const gameData = [
  {
    away_team: {
      group_name: 'Towns Cup Sport',
    },

    home_team: {
      group_name: 'Towns Cup Sport',
    },

    away_team_goal: 0,
  },
  {
    away_team: {
      group_name: 'Towns Cup Sport',
    },

    home_team: {
      group_name: 'Towns Cup Sport',
    },
  },
];

export const dummyTeamData = [
  {
    background_thumbnail:
      'https://dev-townscup-gallery.s3.amazonaws.com/EFp8BNTdXLWnik6dbRaxZ385Qq82/97544687-a729-4290-8fe4-2029236e6f16',
    gender: 'male',
    city: 'Vancouver, BC',
    unread: 1,
    background_full_image:
      'https://dev-townscup-gallery.s3.amazonaws.com/EFp8BNTdXLWnik6dbRaxZ385Qq82/ddba23a9-c852-4920-9d79-7e753f1418da',

    group_name: 'Towns Cup 1',
    entity_type: 'team',

    sport: 'SPORTS',
  },
  {
    background_thumbnail:
      'https://dev-townscup-gallery.s3.amazonaws.com/EFp8BNTdXLWnik6dbRaxZ385Qq82/97544687-a729-4290-8fe4-2029236e6f16',
    gender: 'male',
    city: 'Vancouver, BC',
    unread: 1,
    background_full_image:
      'https://dev-townscup-gallery.s3.amazonaws.com/EFp8BNTdXLWnik6dbRaxZ385Qq82/ddba23a9-c852-4920-9d79-7e753f1418da',

    point: 500,

    group_name: 'Towns Cup 2',
    entity_type: 'team',

    sport: 'SPORTS',
  },
  {
    background_thumbnail:
      'https://dev-townscup-gallery.s3.amazonaws.com/EFp8BNTdXLWnik6dbRaxZ385Qq82/97544687-a729-4290-8fe4-2029236e6f16',
    gender: 'male',
    city: 'Vancouver, BC',
    unread: 1,
    background_full_image:
      'https://dev-townscup-gallery.s3.amazonaws.com/EFp8BNTdXLWnik6dbRaxZ385Qq82/ddba23a9-c852-4920-9d79-7e753f1418da',

    point: 500,

    group_name: 'Towns Cup 3',
    entity_type: 'team',
    state_abbr: 'CA',
    sport: 'SPORTS',
  },
];

export const dummyEventdata = [
  {
    title: 'No event',
    date: 'Fri, Sep 01 · 00:00am',
    is_Offline: false,
    name: 'Towns Cup Sports',
  },
  {
    title: 'No event',
    date: 'Fri, Sep 01 · 00:00am',
    is_Offline: false,
    name: 'Towns Cup Sports',
  },
];

export const dummyPlayerData = [
  {
    entity_type: 'player',
    full_name: 'Towns Cup 1',
    user_id: 'n2glO0WF3DezU2dLrEfU33PA4Ot2',
    state_abbr: 'Vancouver, BC',
    sports: [{sport_name: 'SPORTS'}],
  },
  {
    entity_type: 'player',
    full_name: 'Towns Cup 2',
    user_id: 'n2glO0WF3DezU2dLrEfU33PA4Ot2',
    state_abbr: 'Vancouver, BC',
    sports: [{sport_name: 'SPORTS'}],
  },
  {
    entity_type: 'player',
    full_name: 'Towns Cup 3',
    user_id: 'n2glO0WF3DezU2dLrEfU33PA4Ot2',
    state_abbr: 'Vancouver, BC',
    sports: [{sport_name: 'SPORTS'}],
  },
];

export const whoCanDataSourceUser = [
  {text: strings.everyoneTitleText, value: 0, icon: images.privacyEveryoneIcon},
  {
    text: strings.followerTitleText,
    value: 3,
    icon: images.privacyFollowersIcon,
  },
  {text: strings.onlymeTitleText, value: 1, icon: images.lock},
];
export const whoCanDataSourceGroup = [
  {text: strings.everyoneTitleText, value: 0, icon: images.privacyEveryoneIcon},
  {
    text: strings.followerTitleText,
    value: 3,
    icon: images.privacyFollowersIcon,
  },
  {
    text: strings.memberInGroupText,
    value: 2,
    icon: images.pricacyMembersIcon,
  },
  {text: strings.onlymeTitleText, value: 1, icon: images.lock},
];

export const userSettingOption = {
  AccountInfo: 1,
  Profile: 2,
  BasicInfo: 3,
  SportActivities: 4,
  Team: 5,
  Club: 6,
  Event: 7,
  TimeZone: 8,
  AppLanguage: 9,
  DeactivateAccount: 10,
  TerminateAccount: 11,
};
export const ErrorCodes = {
  MEMBEREXISTERRORCODE: 101,
  MEMBERALREADYERRORCODE: 102,
  MEMBERALREADYINVITEERRORCODE: 103,
  MEMBERALREADYREQUESTERRORCODE: 104,
  MEMBERINVITEONLYERRORCODE: 105,
};

export const UserActionTiles = [
  {
    title: strings.registerAs,
    index: 0,

    createData: [
      {
        name: strings.playerText,
        icon: images.registerAsPlayerIcon,
        enityType: Verbs.entityTypePlayer,
        screenName: 'RegisterPlayer',
        index: 0,
      },
      {
        name: strings.refreeText,
        icon: images.registerAsRefreeIcon,
        enityType: Verbs.entityTypeReferee,
        screenName: 'RegisterReferee',
        index: 1,
      },
      {
        name: strings.scorekeeperText,
        icon: images.registerAsScoreKeeperIcon,
        enityType: Verbs.entityTypeScorekeeper,
        screenName: 'RegisterScorekeeper',
        index: 2,
      },
    ],
  },
  {
    title: strings.createText,
    index: 1,
    createData: [
      {
        name: strings.teamText,
        icon: images.createTeamIcon,
        action: Verbs.CREATE_TEAM,
        index: 0,
      },
      {
        name: strings.clubText,
        icon: images.createClubIcon,
        action: Verbs.CREATE_CLUB,
        index: 1,
      },
      {
        name: strings.leagueText,
        icon: images.createLeagueIcon,
        action: Verbs.CREATE_LEAGUE,
        index: 2,
      },
    ],
  },
  {
    title: strings.joinText,
    index: 2,
    createData: [
      {
        name: strings.teamText,
        icon: images.joinTeamIcon,
        action: Verbs.JOIN_TEAM,
        index: 0,
      },
      {
        name: strings.clubText,
        icon: images.joinClubIcon,
        action: Verbs.JOIN_CLUB,
        index: 1,
      },
      {
        name: strings.leagueText,
        icon: images.joinLeagueIcon,
        action: Verbs.JOIN_LEAGUE,
        index: 2,
      },
    ],
  },
];

export const tilesArray = {
  PersonalTeamSection: [
    {
      title: strings.challengeHometile,
      icon: images.challengeIcon,
    },
    {
      title: strings.bookRefreesHomeTile,
      icon: images.bookRefreeIcon,
    },
    {
      title: strings.bookSckorekeeperHomeTile,
      icon: images.bookScoreKeeper,
    },
    {
      title: strings.createEventhomeTitle,

      icon: images.eventIcon,
    },
  ],
  clubSection: [
    {
      title: strings.addTeamClub,
      icon: images.createTemIconHome,
    },
    {
      title: strings.createevents,
      icon: images.eventIcon,
    },
    {
      title: strings.inviteMemberClub,
      icon: images.inviteMemberIcon,
    },
  ],
};
