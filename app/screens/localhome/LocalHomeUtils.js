import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';

import {getSportName} from '../../utils';
import {locationType} from '../../utils/constant';
import {getGroupIndex, getUserIndex} from '../../api/elasticSearch';
import {getUnreadCount} from '../../api/Notificaitons';
import {getExcludedSportsList} from '../../utils/sportsActivityUtils';

const getDataForNextScreen = (
  type = '',
  filters = {},
  location = '',
  selectedLocationOption = '',
  authContext = {},
) => {
  const getLocation = () => {
    if (selectedLocationOption === locationType.CURRENT_LOCATION) {
      return 0;
    }
    if (selectedLocationOption === locationType.HOME_CITY) {
      return 1;
    }
    if (selectedLocationOption === locationType.WORLD) {
      return 2;
    }
    if (selectedLocationOption === locationType.SEARCH_CITY) {
      return 3;
    }
    return 0;
  };

  const setSportName = () => {
    if (type === Verbs.SPORT_DATA) {
      getSportName(filters, authContext);
    }

    if (type === Verbs.TEAM_DATA) {
      if (authContext.entity.role === Verbs.entityTypeTeam) {
        getSportName(authContext.entity.obj, authContext);
      } else {
        getSportName(filters, authContext);
      }
    }
  };

  if (type === 'sportData') {
    const data = {
      sport: filters.sport === strings.all ? strings.allSport : filters.sport,
      sport_type:
        filters.sport_type === strings.all
          ? strings.allSport
          : filters.sport_type,
      sport_name:
        filters.sport_type === strings.all
          ? setSportName()
          : filters.sport_name,
      location,
      locationOption: getLocation(),
      searchCityLoc: location,
    };

    return data ?? {};
  }

  if (type === 'teamData') {
    const filterObject = {
      sport: filters.sport,
      sport_type: filters.sport_type,
      location,
      locationOption: getLocation(),
      searchCityLoc: location,
    };

    const data = {
      teamSportData: {
        sport:
          filters.sport === strings.all &&
          authContext.entity.role === Verbs.entityTypeTeam
            ? authContext.entity.obj.sport
            : filters.sport,
        sport_type:
          filters.sport === strings.all &&
          authContext.entity.role === Verbs.entityTypeTeam
            ? authContext.entity.obj.sport_type
            : filters.sport_type,
        sport_name:
          filters.sport === strings.all &&
          authContext.entity.role === Verbs.entityTypeTeam
            ? setSportName()
            : filters.sport_name ?? strings.all,
      },
      filters: filterObject,
    };

    return data ?? {};
  }

  return null;
};

const filterCurrentUserFromData = (queryData, authContext) => {
  if (authContext.entity.role === Verbs.entityTypeTeam) {
    const filteredQueryData = queryData.filter(
      (item) => item?.user_id !== authContext.entity.auth?.user.user_id,
    );

    return filteredQueryData;
  }

  const filteredQueryData = queryData.filter(
    (item) => item?.user_id !== authContext.entity.obj?.user_id,
  );

  return filteredQueryData;
};

const filterCurrentTeam = (queryData, authContext) => {
  const filteredQueryData = queryData.filter(
    (item) => item?.group_id !== authContext.entity.obj?.group_id,
  );
  return filteredQueryData;
};

const LocalHomeQuery = async (
  location,
  defaultPageSize,
  selectedSport,
  sportType,
  authContext,
  setRecentMatch,
  setUpcomingMatch,
  setChallengeeMatch,
  setHiringPlayers,
  setLookingTeam,
  setReferees,
  setScorekeepers,
  setCardLoader,
  setTeamsAvailable,
) => {
  setCardLoader(true);

  const recentMatchQuery = {
    size: defaultPageSize,
    query: {
      bool: {
        must: [
          {match: {status: 'accepted'}},
          {
            range: {
              start_datetime: {
                lt: parseFloat(new Date().getTime() / 1000).toFixed(0),
              },
            },
          },
        ],
      },
    },
    sort: [{actual_enddatetime: 'desc'}],
  };

  if (location !== strings.worldTitleText) {
    recentMatchQuery.query.bool.must.push({
      multi_match: {
        query: location,
        fields: ['city', 'country', 'state', 'venue.address'],
      },
    });
  }
  if (selectedSport !== strings.allType) {
    recentMatchQuery.query.bool.must.push({
      term: {
        'sport.keyword': {
          value: selectedSport,
        },
      },
    });
    recentMatchQuery.query.bool.must.push({
      term: {
        'sport_type.keyword': {
          value: sportType,
        },
      },
    });
  }

  const upcomingMatchQuery = {
    size: defaultPageSize,
    query: {
      bool: {
        must: [
          {
            range: {
              start_datetime: {
                gt: parseFloat(new Date().getTime() / 1000).toFixed(0),
              },
            },
          },
        ],
      },
    },
    sort: [{actual_enddatetime: 'desc'}],
  };

  if (location !== strings.worldTitleText) {
    upcomingMatchQuery.query.bool.must.push({
      multi_match: {
        query: location,
        fields: ['city', 'country', 'state', 'venue.address'],
      },
    });
  }
  if (selectedSport !== strings.allType) {
    upcomingMatchQuery.query.bool.must.push({
      term: {
        'sport.keyword': {
          value: selectedSport,
        },
      },
    });
    upcomingMatchQuery.query.bool.must.push({
      term: {
        'sport_type.keyword': {
          value: sportType,
        },
      },
    });
  }

  const playerAvailableForchallengeQuery = {
    size: defaultPageSize,
    query: {
      bool: {
        must: [
          {match: {entity_type: 'player'}},
          {
            nested: {
              path: 'registered_sports',
              query: {
                bool: {
                  must: [
                    {
                      term: {
                        'registered_sports.setting.availibility.keyword':
                          Verbs.on,
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
  };

  // Sport filter
  if (selectedSport !== strings.allType) {
    playerAvailableForchallengeQuery.query.bool.must[1].nested.query.bool.must.push(
      {
        term: {
          'registered_sports.sport.keyword': `${selectedSport.toLowerCase()}`,
        },
      },
    );
    playerAvailableForchallengeQuery.query.bool.must[1].nested.query.bool.must.push(
      {
        term: {
          'registered_sports.sport_type.keyword': `${sportType.toLowerCase()}`,
        },
      },
    );
  }
  // World filter
  if (location && location !== strings.worldTitleText) {
    // Check if location is defined and not empty
    playerAvailableForchallengeQuery.query.bool.must.push({
      multi_match: {
        query: `${location.toLowerCase()}`,
        fields: ['city', 'country', 'state', 'state_abbr', 'venue.address'],
      },
    });
  }

  const teamAvailableForchallengeQuery = {
    size: defaultPageSize,
    query: {
      bool: {
        must: [
          {term: {'setting.availibility.keyword': Verbs.on}},
          {term: {entity_type: 'team'}},
          {term: {is_pause: false}},
        ],
      },
    },
  };

  if (location !== strings.worldTitleText) {
    teamAvailableForchallengeQuery.query.bool.must.push({
      multi_match: {
        query: location,
        fields: ['city', 'country', 'state_abbr', 'venue.address'],
      },
    });
  }
  if (selectedSport && sportType && selectedSport !== strings.allType) {
    teamAvailableForchallengeQuery.query.bool.must.push({
      term: {
        'sport.keyword': {
          value: `${selectedSport.toLowerCase()}`,
        },
      },
    });

    teamAvailableForchallengeQuery.query.bool.must.push({
      term: {
        'sport_type.keyword': {
          value: `${sportType.toLowerCase()}`,
        },
      },
    });
  }

  const recruitingPlayersQuery = {
    size: defaultPageSize,
    query: {
      bool: {
        must: [{match: {hiringPlayers: 1}}],
      },
    },
  };

  if (location !== strings.worldTitleText) {
    recruitingPlayersQuery.query.bool.must.push({
      multi_match: {
        query: location,
        fields: ['city', 'country', 'state', 'venue.address'],
      },
    });
  }
  if (selectedSport !== strings.allType) {
    recruitingPlayersQuery.query.bool.must.push({
      term: {
        'sport.keyword': {
          value: selectedSport,
        },
      },
    });
    recruitingPlayersQuery.query.bool.must.push({
      term: {
        'sport_type.keyword': {
          value: sportType,
        },
      },
    });
  }

  const lookingQuery = {
    size: defaultPageSize,
    query: {
      bool: {
        must: [
          {
            nested: {
              path: 'registered_sports',
              query: {
                bool: {
                  must: [
                    {
                      match: {
                        'registered_sports.lookingForTeamClub': true,
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
  };

  if (location !== strings.worldTitleText) {
    lookingQuery.query.bool.must.push({
      multi_match: {
        query: `${location}`,
        fields: ['city', 'country', 'state'],
      },
    });
  }
  if (selectedSport !== strings.allType) {
    lookingQuery.query.bool.must[0].nested.query.bool.must.push({
      term: {
        'registered_sports.sport.keyword': {
          value: selectedSport,
        },
      },
    });
    lookingQuery.query.bool.must[0].nested.query.bool.must.push({
      term: {
        'registered_sports.sport_type.keyword': {
          value: sportType,
        },
      },
    });
  }

  const refereeQuery = {
    size: defaultPageSize,
    query: {
      bool: {
        must: [
          {
            nested: {
              path: 'referee_data',
              query: {
                bool: {must: [{term: {'referee_data.is_published': true}}]},
              },
            },
          },
        ],
      },
    },
  };

  if (location !== strings.worldTitleText) {
    refereeQuery.query.bool.must.push({
      multi_match: {
        query: `${location}`,
        fields: ['city', 'country', 'state'],
      },
    });
  }
  if (selectedSport !== strings.allType) {
    refereeQuery.query.bool.must[0].nested.query.bool.must.push({
      term: {
        'referee_data.sport.keyword': {
          value: selectedSport,
        },
      },
    });
  }

  const scorekeeperQuery = {
    size: defaultPageSize,
    query: {
      bool: {
        must: [
          {
            nested: {
              path: 'scorekeeper_data',
              query: {
                bool: {
                  must: [{term: {'scorekeeper_data.is_published': true}}],
                },
              },
            },
          },
        ],
      },
    },
  };

  if (
    location &&
    strings.worldTitleText &&
    location !== strings.worldTitleText
  ) {
    scorekeeperQuery.query.bool.must.push({
      multi_match: {
        query: `${location.toLowerCase()}`,
        fields: ['city', 'country', 'state'],
      },
    });
  }

  if (selectedSport !== strings.allType) {
    scorekeeperQuery.query.bool.must[0].nested.query.bool.must.push({
      term: {
        'scorekeeper_data.sport.keyword': {
          value: selectedSport,
        },
      },
    });
  }

  // Create an array of promises for each API call

  const promises = [
    // Wrap the API calls in promises
    // getGameIndex(recentMatchQuery).then((games) => getGamesList(games)  ),
    // getGameIndex(upcomingMatchQuery).then((games) => getGamesList(games)),

    getUserIndex(playerAvailableForchallengeQuery).then((players) =>
      filterCurrentUserFromData(players, authContext),
    ),
    getGroupIndex(teamAvailableForchallengeQuery).then((teams) =>
      filterCurrentTeam(teams, authContext),
    ),
    getGroupIndex(recruitingPlayersQuery),
    getUserIndex(lookingQuery).then((players) =>
      filterCurrentUserFromData(players, authContext),
    ),
    getUserIndex(refereeQuery).then((res) =>
      filterCurrentUserFromData(res, authContext),
    ),
    getUserIndex(scorekeeperQuery).then((res) =>
      filterCurrentUserFromData(res, authContext),
    ),
  ];

  Promise.all(promises)
    .then((results) => {
      const [
        //  recentMatchGames,
        // upcomingMatchGames,
        playerData,
        teamData,
        hiringPlayers,
        lookingTeam,
        referees,
        scorekeepers,
      ] = results;

      // setCardLoader(false);

      // if (recentMatchGames.length > 0) {
      //   const result = groupBy(recentMatchGames, 'sport');
      //   const dataArray = Object.keys(result).map((title) => ({
      //     title,
      //     data: result[title],
      //   }));
      //   console.log(dataArray, 'from array');
      //   setRecentMatch(dataArray);
      // } else {
      //   setRecentMatch([]);
      // }

      // if (upcomingMatchGames.value.length > 0) {
      //   const result = groupBy(upcomingMatchGames, 'sport');
      //   const dataArray = Object.keys(result).map((title) => ({
      //     title,
      //     data: result[title],
      //   }));
      //   console.log(dataArray, 'from array');
      //   setUpcomingMatch(dataArray);
      // } else {
      //   setUpcomingMatch([]);
      // }

      setTeamsAvailable(teamData ?? []);

      setChallengeeMatch(playerData);

      setHiringPlayers(hiringPlayers ?? []);

      setLookingTeam(lookingTeam ?? []);

      setReferees([...referees] ?? []);

      setScorekeepers([...scorekeepers] ?? []);
      setCardLoader(false);
    })
    .catch((e) => {
      setCardLoader(false);
      console.log(e.message);
    });
};

const getNotificationCountHome = (authContext, handleSetNotificationCount) => {
  const {entity, setTotalNotificationCount} = authContext;

  getUnreadCount(authContext)
    .then((response) => {
      const {teams, clubs, user, totalUnread} = response.payload;
      let count = 0;

      if (entity.obj.entity_type === Verbs.entityTypeClub) {
        const obj = clubs.find((item) => item.group_id === entity.uid);
        count = obj?.unread ?? 0;
      } else if (entity.obj.entity_type === Verbs.entityTypeTeam) {
        const obj = teams.find((item) => item.group_id === entity.uid);
        count = obj?.unread ?? 0;
      } else {
        count = user?.unread ?? 0;
      }

      setTotalNotificationCount(totalUnread ?? 0);
      handleSetNotificationCount(count);
    })
    .catch((error) => {
      console.log(error.message);
      // Alert.alert(strings.alertmessagetitle, error.message);
    });
};

const getTeamSportOnlyList = (authContext, selectedMenuOptionType) => {
  const sportArr = getExcludedSportsList(authContext, selectedMenuOptionType);
  sportArr.sort((a, b) =>
    a.sport_name.normalize().localeCompare(b.sport_name.normalize()),
  );

  const OnlyTeamSport = sportArr.filter(
    (item) => item.sport === item.sport_type,
  );
  const OnlyDoubleSport = sportArr.filter(
    (item) => item.sport_type === Verbs.sportTypeDouble,
  );

  const TeamSportList = [...OnlyTeamSport, ...OnlyDoubleSport];

  return TeamSportList;
};

const getSportsForHome = (
  userSport,
  authContext,
  setSportHandler,
  sports,
  setSportIconLoader,
) => {
  setSportIconLoader(true);

  if (userSport?.payload && authContext.entity.role !== Verbs.entityTypeClub) {
    setSportIconLoader(true);

    const favouriteSports =
      userSport.payload?.favouriteSport?.map((item) => item) || [];
    const registeredSports =
      userSport.payload?.registered_sports?.map((item) => item) || [];
    const scorekeeperSports =
      userSport.payload?.scorekeeper_data?.map((item) => item) || [];
    const favsports = userSport.payload.sports?.map((item) => item) || [];
    const refereeSports =
      userSport.payload?.referee_data?.map((item) => item) || [];

    // Combine all the arrays and remove duplicates using a Set
    const uniqueSports = [
      ...new Set([
        ...favouriteSports,
        ...registeredSports,
        ...scorekeeperSports,
        ...favsports,
        ...refereeSports,
      ]),
    ];

    const res = uniqueSports.map((obj) => ({
      sport: obj.sport,
      sport_type: obj.sport_type ?? obj.type,
      sport_name: obj.sport_name ?? obj.sport,
    }));

    const result = res.reduce((unique, o) => {
      if (
        !unique.some(
          (obj) => obj.sport === o.sport && obj.sport_type === o.sport_type,
        )
      ) {
        unique.push(o);
      }

      return unique;
    }, []);

    setSportIconLoader(false);
    setSportHandler(result);

    return;
  }

  if (
    authContext.entity.role === Verbs.entityTypeClub &&
    // eslint-disable-next-line no-prototype-builtins
    userSport?.payload
  ) {
    const clubFavSport = userSport.payload?.favouriteSport || [];
    const clubSports = userSport.payload?.sports || [];

    const combineSoprts = [...clubFavSport, ...clubSports];

    const res = combineSoprts.map((obj) => ({
      sport: obj.sport,
      sport_type: obj.sport_type,
      sport_name: obj.sport_name ?? obj.sport,
    }));

    const result = res.reduce((unique, o) => {
      if (
        !unique.some(
          (obj) => obj.sport === o.sport && obj.sport_type === o.sport_type,
        )
      ) {
        unique.push(o);
      }

      return unique;
    }, []);

    setSportHandler(result);

    setSportIconLoader(false);
  }
};

const convertToKFormat = (number) => {
  if (typeof number === 'undefined') {
    return '';
  }

  if (number >= 1000) {
    const suffixes = ['', 'k', 'm', 'b', 't'];
    const suffixNum = Math.floor(`${number}`?.length / 3);
    let shortValue = parseFloat(
      (suffixNum !== 0 ? number / 1000 ** suffixNum : number).toPrecision(2),
    );
    if (shortValue % 1 !== 0) {
      shortValue = shortValue.toFixed(1);
    }
    return shortValue + suffixes[suffixNum];
  }

  return number.toString();
};

export {
  getDataForNextScreen,
  LocalHomeQuery,
  getNotificationCountHome,
  getTeamSportOnlyList,
  getSportsForHome,
  convertToKFormat,
};
