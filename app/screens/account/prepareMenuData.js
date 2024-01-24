import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';
import {
  getEntitySportList,
  getSportDetails,
} from '../../utils/sportsActivityUtils';
import {getUserDetails} from '../../api/Users';

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
          screenName: 'AccountStack',
          data: {
            screen: 'SportAccountSettingScreen',
            params: {
              type: entityType,
              sport: item,
            },
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
          screenName: 'HomeStack',
          data: {
            screen: 'HomeScreen',
            params: {
              uid: item.group_id,
              role: item.entity_type,
              backButtonVisible: true,
              menuBtnVisible: false,
            },
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
          screenName: 'AccountStack',
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
          screenName: 'AccountStack',
          data: {
            screen: 'PayoutMethodList',
            params: {
              comeFrom: 'AccountScreen',
            },
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
          screenName: 'AccountStack',
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
          screenName: 'AccountStack',
          data: {
            screen: 'InvoiceSentScreen',
            params: {
              comeFrom: 'AccountScreen',
            },
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
          screenName: 'AccountStack',
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
          screenName: 'AccountStack',
          data: {
            screen: 'InvoiceSentScreen',
            params: {
              comeFrom: 'AccountScreen',
            },
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
        title: strings.reservationsTitleText,
        data: [
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
        ],
      },
      {
        title: strings.registerAs,
        data: [
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
                  screenName: 'AccountStack',
                  data: {
                    screen: 'RegisterPlayer',
                  },
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
                  screenName: 'AccountStack',
                  data: {
                    screen: 'RegisterReferee',
                  },
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
                  screenName: 'AccountStack',
                  data: {
                    screen: 'RegisterScorekeeper',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        title: strings.group,
        data: [
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
                  screenName: 'AccountStack',
                  data: {
                    screen: 'CreateTeamForm1',
                  },
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
                  screenName: 'AccountStack',
                  data: {
                    screen: 'CreateClubForm1',
                  },
                },
              },
            ],
          },
          {
            key: strings.leagues,
            icon: images.accountMyLeagues,
            member: [],
          },
        ],
      },
      {
        title: strings.payment,
        data: [
          ...invoicesMenuForUser(),
          {
            key: strings.transactions,
            icon: images.transactionsIcon,
            member: [],
          },
          ...paymentMethodMenu(),
        ],
      },
      {
        title: strings.log,
        data: [
          {
            key: strings.accountLog,
            icon: images.accountLogIcon,
            navigateTo: {
              screenName: 'AccountStack',
              data: {
                screen: 'ActivityLogScreen',
              },
            },
          },
        ],
      },
      // {
      //   title: strings.settings,
      //   data: [
      //     {
      //       key: strings.settingsTitleText,
      //       icon: images.accountSettingPrivacy,
      //       navigateTo: {
      //         screenName: 'AccountStack',
      //         data: {
      //           screen: 'UserSettingPrivacyScreen',
      //         },
      //       },
      //     },
      //   ],
      // },
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
      title: strings.reservationsTitleText,
      data: [
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
      ],
    },
    {
      title: strings.challenge,
      data: [
        {
          key: strings.incomingChallengeSettingsTitle,
          icon: images.manageChallengeIcon,
          navigateTo: {
            screenName: 'AccountStack',
            data: {
              screen: 'ManageChallengeScreen',
              params: {
                groupObj: authContext.entity.obj,
                sportName: authContext.entity?.obj?.sport,
                sportType: authContext.entity?.obj?.sport_type,
              },
            },
          },
        },
        {
          key: strings.incomingMatchOfferSettings,
          icon: images.incomingMatchOfferSettingsIcon,
          member: [],
        },
      ],
    },
    {
      title: strings.group,
      data: [
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
      ],
    },
    {
      title: strings.payment,
      data: [
        ...invoicesMenuForGroup(),
        {
          key: strings.transactions,
          icon: images.transactionsIcon,
          member: [],
        },
        ...paymentMethodMenu(),
      ],
    },
    {
      title: strings.log,
      data: [
        {
          key: strings.accountLog,
          icon: images.accountLogIcon,
          navigateTo: {
            screenName: 'AccountStack',
            data: {
              screen: 'ActivityLogScreen',
            },
          },
        },
      ],
    },
    // {
    //   title: strings.settings,
    //   data: [
    //     {
    //       key: strings.settingsTitleText,
    //       icon: images.accountSettingPrivacy,
    //       navigateTo: {
    //         screenName: 'AccountStack',
    //         data: {
    //           screen: 'GroupSettingPrivacyScreen',
    //         },
    //       },
    //     },
    //   ],
    // },
  ];
  return teamMenu;
};

export const prepareClubMenu = (teams) => {
  const clubMenu = [
    {
      title: strings.group,
      data: [
        {
          key: strings.teamstitle,
          icon: images.accountMyTeams,
          member: [
            ...prepareGroupsSubMenu(teams),
            {option: strings.createTeamText, icon: images.createTeam},
          ],
        },
      ],
    },
    {
      title: strings.payment,
      data: [
        ...invoicesMenuForGroup(),
        {
          key: strings.transactions,
          icon: images.transactionsIcon,
          member: [],
        },
        ...paymentMethodMenu(),
      ],
    },
    {
      title: strings.log,
      data: [
        {
          key: strings.accountLog,
          icon: images.accountLogIcon,
          navigateTo: {
            screenName: 'AccountStack',
            data: {
              screen: 'ActivityLogScreen',
            },
          },
        },
      ],
    },
    // {
    //   title: strings.settings,
    //   data: [
    //     {
    //       key: strings.settingsTitleText,
    //       icon: images.accountSettingPrivacy,
    //       navigateTo: {
    //         screenName: 'AccountStack',
    //         data: {
    //           screen: 'GroupSettingPrivacyScreen',
    //         },
    //       },
    //     },
    //   ],
    // },
  ];
  return clubMenu;
};
