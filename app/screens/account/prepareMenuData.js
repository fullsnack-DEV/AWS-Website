import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';
import {
  getEntitySportList,
  getSportDetails,
} from '../../utils/sportsActivityUtils';
import {getUserDetails} from '../../api/Users';
// TODO: Move this file to right place. Improve this methods

// TODO: call utility.getSportName() to fetch correct sports title
// TODO: apply isAccountDeactivated logic to not display add sports button

const prepareSportsSubMenuOfUser = (
  sports,
  baseUrl,
  authContext,
  entityType,
) => {
  let updatedList = [];
  if (sports) {
    updatedList = sports.map((item) => {
      const sportDetails = getSportDetails(
        item.sport,
        item.sport_type,
        authContext.sports,
        entityType,
      );

      return {
        option: sportDetails?.sport_name,
        icon: sportDetails?.sport_image
          ? `${baseUrl}${sportDetails?.sport_image}`
          : images.accountMyScoreKeeping,
        iconRight: images.settingSport,
        navigateTo: {
          screenName: 'SportAccountSettingScreen',
          data: {
            type: entityType,
            sport: item,
          },
        },
        sport: item,
      };
    });
  }
  return updatedList;
};

const prepareGroupsSubMenu = (groupList) =>
  // TODO: call utility.getSportName() to fetch correct sports title
  // TODO: apply isAccountDeactivated logic to not display add sports button
  {
    let menu = [];
    if (groupList) {
      menu = groupList?.map((item) => ({
        option: item,
        icon: item.thumbnail,
        // iconRight: images.settingSport,
        navigateTo: {
          screenName: 'HomeScreen',
          data: {
            uid: item.group_id,
            role: item.entity_type,
            backButtonVisible: true,
            menuBtnVisible: false,
          },
        },
      }));
    }
    return menu;
  };

const paymentMethodMenu = () => [
  {
    key: strings.paymentPayoutText,
    icon: images.accountPaymentPayout,
    member: [
      {
        option: strings.paymentMethodTitle,
        icon: images.Payment_method,
        navigateTo: {
          screenName: 'Account',
          data: {
            screen: 'PaymentMethodsScreen',
            params: {
              comeFrom: 'AccountScreen',
            },
          },
        },
      },
      {
        option: strings.payoutMethodTitle,
        icon: images.Payout_method,
        navigateTo: {
          screenName: 'PayoutMethodList',
          data: {
            comeFrom: 'AccountScreen',
          },
        },
      },
    ],
  },
];

const invoicesMenuForUser = () => [
  {
    key: strings.invoicesTitle,
    icon: images.invoiceIcon,
    member: [
      {
        option: strings.invoicereceived,
        icon: images.invoiceRecievedIcon,
        navigateTo: {
          screenName: 'Account',
          data: {
            screen: 'InvoiceReceivedScreen',
            params: {
              comeFrom: 'AccountScreen',
            },
          },
        },
      },
      {
        option: strings.invoicesent,
        icon: images.invoiceIcon,
        navigateTo: {
          screenName: 'InvoiceSentScreen',
          data: {
            comeFrom: 'AccountScreen',
          },
        },
      },
    ],
  },
];

const invoicesMenuForGroup = () => [
  {
    key: strings.invoicesTitle,
    icon: images.invoiceIcon,
    member: [
      {
        option: strings.sendnewinvoice,
        icon: images.sendNewInvoiceIcon,
      },
      {
        option: strings.invoicereceived,
        icon: images.invoiceRecievedIcon,
        navigateTo: {
          screenName: 'Account',
          data: {
            screen: 'InvoiceReceivedScreen',
            params: {
              comeFrom: 'AccountScreen',
            },
          },
        },
      },
      {
        option: strings.invoicesent,
        icon: images.invoiceIcon,
        navigateTo: {
          screenName: 'InvoiceSentScreen',
          data: {
            comeFrom: 'AccountScreen',
          },
        },
      },
    ],
  },
];
export const prepareUserMenu = async (authContext, teams, clubs, baseUrl) => {
  try {
    const userSport = await getUserDetails(authContext.entity.uid, authContext);

    const SportData = getEntitySportList(
      userSport.payload,
      Verbs.entityTypePlayer,
    );

    const playingMenu = prepareSportsSubMenuOfUser(
      SportData,
      baseUrl,
      authContext,
      Verbs.entityTypePlayer,
    );

    const refereeingMenu = prepareSportsSubMenuOfUser(
      getEntitySportList(authContext.entity.obj, Verbs.entityTypeReferee),
      baseUrl,
      authContext,
      Verbs.entityTypeReferee,
    );

    const scorekeepingMenu = prepareSportsSubMenuOfUser(
      getEntitySportList(authContext.entity.obj, Verbs.entityTypeScorekeeper),
      baseUrl,
      authContext,
      Verbs.entityTypeScorekeeper,
    );

    const userMenu = [
      {
        key: strings.reservationsTitleText,
        icon: images.accountMyReservations,
        navigateTo: {
          screenName: 'ReservationNavigator',
          data: {
            screen: 'ReservationScreen',
          },
        },
      },
      {
        key: strings.playingTitleText,
        icon: images.accountMySports,
        member: [
          ...playingMenu,
          {
            option: strings.addSportsTitle,
            icon: images.addSport,
            iconRight: images.nextArrow,
            menuOptionType: Verbs.entityTypePlayer,
            navigateTo: {
              screenName: 'RegisterPlayer',
            },
          },
        ],
      },
      {
        key: strings.refereeingTitleText,
        icon: images.accountMyRefereeing,
        member: [
          ...refereeingMenu,
          {
            option: strings.addSportsTitle,
            icon: images.registerReferee,
            iconRight: images.nextArrow,
            menuOptionType: Verbs.entityTypeReferee,
            navigateTo: {
              screenName: 'RegisterReferee',
            },
          },
        ],
      },
      {
        key: strings.scorekeepingTitleText,
        icon: images.accountMyScoreKeeping,
        member: [
          ...scorekeepingMenu,
          {
            option: strings.addSportsTitle,
            icon: images.registerScorekeeper,
            iconRight: images.nextArrow,
            menuOptionType: Verbs.entityTypeScorekeeper,
            navigateTo: {
              screenName: 'RegisterScorekeeper',
            },
          },
        ],
      },
      {
        key: strings.teamstitle,
        icon: images.accountMyTeams,
        member: [
          ...prepareGroupsSubMenu(teams),
          {
            option: strings.createTeamText,
            icon: images.createTeam,
            iconRight: images.nextArrow,
            navigateTo: {
              screenName: 'CreateTeamForm1',
            },
          },
        ],
      },
      {
        key: strings.clubstitle,
        icon: images.accountMyClubs,
        member: [
          ...prepareGroupsSubMenu(clubs),
          {
            option: strings.createClubText,
            icon: images.createClub,
            iconRight: images.nextArrow,
            navigateTo: {
              screenName: 'CreateClubForm1',
            },
          },
        ],
      },
      {
        key: strings.leagues,
        icon: images.accountMyLeagues,
        member: [],
      },
      ...invoicesMenuForUser(),
      {
        key: strings.transactions,
        icon: images.transactionsIcon,
        member: [],
      },
      ...paymentMethodMenu(),
      {
        key: strings.settingsTitleText,
        icon: images.accountSettingPrivacy,
        navigateTo: {
          screenName: 'UserSettingPrivacyScreen',
        },
      },
    ];

    return userMenu;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const prepareTeamMenu = (authContext, clubs) => {
  const teamMenu = [
    {
      key: strings.reservationsTitleText,
      icon: images.accountMyReservations,
      navigateTo: {
        screenName: 'ReservationNavigator',
        data: {
          screen: 'ReservationScreen',
        },
      },
    },
    {
      key: strings.incomingChallengeSettingsTitle,
      icon: images.manageChallengeIcon,
      navigateTo: {
        screenName: 'ManageChallengeScreen',
        data: {
          groupObj: authContext.entity.obj,
          sportName: authContext.entity?.obj?.sport,
          sportType: authContext.entity?.obj?.sport_type,
        },
      },
    },
    {
      key: strings.clubstitle,
      icon: images.accountMyClubs,
      member: [...prepareGroupsSubMenu(clubs)],
    },
    {
      key: strings.leagues,
      icon: images.accountMyLeagues,
      member: [],
    },
    ...invoicesMenuForGroup(),
    {
      key: strings.transactions,
      icon: images.transactionsIcon,
      member: [],
    },
    ...paymentMethodMenu(),
    {
      key: strings.settingsTitleText,
      icon: images.accountSettingPrivacy,
      navigateTo: {
        screenName: 'GroupSettingPrivacyScreen',
      },
    },
  ];
  return teamMenu;
};

export const prepareClubMenu = (authContext, teams) => {
  const clubMenu = [
    {
      key: strings.teamstitle,
      icon: images.accountMyTeams,
      member: [
        ...prepareGroupsSubMenu(teams),
        {option: strings.createTeamText, icon: images.createTeam},
      ],
    },
    ...invoicesMenuForGroup(),
    {
      key: strings.transactions,
      icon: images.transactionsIcon,
      member: [],
    },
    ...paymentMethodMenu(),
    {
      key: strings.settingsTitleText,
      icon: images.accountSettingPrivacy,
      navigateTo: {
        screenName: 'GroupSettingPrivacyScreen',
      },
    },
  ];
  return clubMenu;
};
