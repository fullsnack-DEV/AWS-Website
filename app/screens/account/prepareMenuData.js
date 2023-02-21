import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
// import {getSportIcon} from '../../utils/index';
import Verbs from '../../Constants/Verbs';
import {getSportImage, getSportName} from '../../utils';
// TODO: Move this file to right place. Improve this methods

// TODO: call utility.getSportName() to fetch correct sports title
// TODO: apply isAccountDeactivated logic to not display add sports button
const prepareSportsSubMenuOfUser = (sports, baseUrl, authContext) => {
  let updatedList = [];
  if (sports) {
    updatedList = sports.map((item) => {
      const iconName = getSportImage(item.sport, item.type, authContext);
      return {
        option: getSportName(item, authContext),
        icon: iconName ? `${baseUrl}${iconName}` : images.accountMyScoreKeeping,
        iconRight: images.settingSport,
        navigateTo: {
          screenName: 'SportAccountSettingScreen',
          data: {
            type: item.type,
            sport: item,
          },
        },
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
        icon:
          item.thumbnail ||
          (item.entity_type === Verbs.entityTypeClub
            ? images.clubPlaceholder
            : images.teamPlaceholder),
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
      {
        option: strings.invoicesTitle,
        icon: images.Invoicing,
        navigateTo: {
          screenName: 'UserInvoiceScreen',
        },
      },
    ],
  },
];

export const prepareUserMenu = (authContext, teams, clubs, baseUrl) => {
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
        ...prepareSportsSubMenuOfUser(
          authContext.entity.obj.registered_sports ?? [],
          baseUrl,
          authContext,
        ),
        {
          option: strings.addSportsTitle,
          icon: images.addSport,
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
        ...prepareSportsSubMenuOfUser(
          authContext.entity.obj.referee_data ?? [],
          baseUrl,
          authContext,
        ),
        {
          option: strings.registerRefereeTitle,
          icon: images.registerReferee,
          iconRight: images.nextArrow,
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
        ...prepareSportsSubMenuOfUser(
          authContext.entity.obj.scorekeeper_data ?? [],
          baseUrl,
          authContext,
        ),
        {
          option: strings.registerScorekeeperTitle,
          icon: images.registerScorekeeper,
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
          navigateTo: {
            screenName: 'CreateClubForm1',
          },
        },
      ],
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
};

export const prepareTeamMenu = (authContext, teams, clubs) => {
  const teamMenu = [
    {
      key: strings.reservationsTitleText,
      icon: images.accountMySchedule,
      navigateTo: {
        screenName: 'ReservationNavigator',
        data: {
          screen: 'ReservationScreen',
        },
      },
    },
    {
      key: strings.challengeSettingText,
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
      key: strings.membersTitle,
      icon: images.Members,
      navigateTo: {
        screenName: 'GroupMembersScreen',
        data: {
          groupID: authContext.entity.uid,
          groupObj: authContext.entity.obj,
        },
      },
    },
    {
      key: strings.clubstitle,
      icon: images.accountMyClubs,
      member: [
        ...prepareGroupsSubMenu(clubs),
        {
          option: strings.createClubText,
          icon: images.createClub,
          navigateTo: {
            screenName: 'CreateClubForm1',
          },
        },
      ],
    },
    ...paymentMethodMenu(),
    {
      key: strings.settingsTitleText,
      icon: images.accountSettingPrivacy,
      navigateTo: {
        screenName: 'GroupSettingPrivacyScreen',
        data: {
          groups: teams,
        },
      },
    },
  ];
  return teamMenu;
};

export const prepareClubMenu = (authContext, teams, clubs) => {
  const clubMenu = [
    {
      key: strings.membersTitle,
      icon: images.Members,
      navigateTo: {
        screenName: 'GroupMembersScreen',
        data: {
          groupID: authContext.entity.uid,
          groupObj: authContext.entity.obj,
        },
      },
    },

    {
      key: strings.teamstitle,
      icon: images.accountMyTeams,
      member: [
        ...prepareGroupsSubMenu(teams),
        {option: strings.createTeamText, icon: images.createTeam},
      ],
    },

    ...paymentMethodMenu(),
    {
      key: strings.settingsTitleText,
      icon: images.accountSettingPrivacy,
      navigateTo: {
        screenName: 'GroupSettingPrivacyScreen',
        data: {
          groups: clubs,
        },
      },
    },
  ];
  return clubMenu;
};
