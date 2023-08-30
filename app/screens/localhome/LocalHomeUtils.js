import {Alert} from 'react-native';
import {RRule} from 'rrule';
import _ from 'lodash';
import moment from 'moment';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';

import {
  getSportName,
  getGamesList,
  getStorage,
  getJSDate,
  getTCDate,
  getEventsSlots,
  groupBy,
} from '../../utils';
import {locationType} from '../../utils/constant';
import {
  getGameIndex,
  getGroupIndex,
  getUserIndex,
} from '../../api/elasticSearch';
import {getUnreadCount} from '../../api/Notificaitons';
import {getExcludedSportsList} from '../../utils/sportsActivityUtils';

import {getGroups, getTeamsOfClub} from '../../api/Groups';

const getDataForNextScreen = (
  type = '',
  filters = {},
  location = '',
  selectedLocationOption = '',
  authContext = {},
) => {
  const getLocation = () => {
    if (selectedLocationOption === locationType.WORLD) {
      return 2;
    }
    if (selectedLocationOption === locationType.HOME_CITY) {
      return 1;
    }
    if (selectedLocationOption === locationType.CURRENT_LOCATION) {
      return 0;
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
      getSportName(authContext.entity.obj, authContext);
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
    };

    return data;
  }

  if (type === 'teamData' && authContext.entity.role === Verbs.entityTypeTeam) {
    const data = {
      teamSportData: {
        sport:
          filters.sport === strings.all
            ? authContext.entity.obj.sport
            : filters.sport,
        sport_type:
          filters.sport_type === strings.all
            ? authContext.entity.obj.sport_type
            : filters.sport_type,
        sport_name:
          filters.sport_type === strings.all
            ? setSportName()
            : filters.sport_name,
      },
      location,
      locationOption: getLocation(),
    };
    return data;
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
  // Recent match query
  // Upcoming match query
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
  // Player available for challenge
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
  if (location !== strings.worldTitleText) {
    playerAvailableForchallengeQuery.query.bool.must.push({
      multi_match: {
        query: `${location.toLowerCase()}`,
        fields: ['city', 'country', 'state', 'state_abbr', 'venue.address'],
      },
    });
  }

  // Team available for challenge
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
  if (selectedSport !== strings.allType) {
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

  // Looking Challengee query

  // Hiring player query

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
  // Hiring player query

  // Looking team query
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

  // Referee query
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
  // Scorekeeper query
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

  if (location !== strings.worldTitleText) {
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

  getGameIndex(recentMatchQuery).then((games) => {
    getGamesList(games).then((gamedata) => {
      if (games?.length > 0) {
        const result = groupBy(gamedata, 'sport');

        const dataArray = Object.keys(result).map((title) => ({
          title,
          data: result[title],
        }));

        setRecentMatch(dataArray);
      } else {
        setRecentMatch([]);
      }
    });
  });

  getGameIndex(upcomingMatchQuery).then((games) => {
    getGamesList(games).then((gamedata) => {
      if (games?.length > 0) {
        const result = groupBy(gamedata, 'sport');

        const dataArray = Object.keys(result).map((title) => ({
          title,
          data: result[title],
        }));

        setUpcomingMatch(dataArray);
      } else {
        setUpcomingMatch([]);
      }
    });
  });

  // getEntityIndex(availableForchallengeQuery).then((entity) => {
  //   setChallengeeMatch(entity);
  // });
  if (authContext.entity.role === Verbs.entityTypeUser) {
    getUserIndex(playerAvailableForchallengeQuery).then((players) => {
      setCardLoader(false);

      const playersData = filterCurrentUserFromData(players, authContext);

      setChallengeeMatch(playersData);
    });
  } else if (authContext.entity.role === Verbs.entityTypeTeam) {
    getGroupIndex(teamAvailableForchallengeQuery).then((teams) => {
      setCardLoader(false);
      const filterTeam = filterCurrentTeam(teams, authContext);
      setChallengeeMatch(filterTeam);
    });
  }

  getGroupIndex(recruitingPlayersQuery).then((teams) => {
    setCardLoader(false);
    setHiringPlayers(teams);
  });

  getUserIndex(lookingQuery).then((players) => {
    setCardLoader(false);
    const playersData = filterCurrentUserFromData(players, authContext);
    setLookingTeam(playersData);
  });
  getUserIndex(refereeQuery).then((res) => {
    setCardLoader(false);
    const filterRefreeData = filterCurrentUserFromData(res, authContext);

    setReferees([...filterRefreeData]);
  });
  getUserIndex(scorekeeperQuery).then((res) => {
    setCardLoader(false);
    const filterScoreKeeperData = filterCurrentUserFromData(res, authContext);
    setScorekeepers([...filterScoreKeeperData]);
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
      Alert.alert(strings.alertmessagetitle, error.message);
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
  authContext,
  setSportHandler,
  sports,
  setSportIconLoader,
) => {
  setSportIconLoader(true);
  getStorage('sportSetting')
    .then((setting) => {
      if (setting === null) {
        setSportIconLoader(false);
        const playerSport =
          authContext?.entity?.auth?.user?.registered_sports || [];
        const followedSport = authContext?.entity?.obj?.sports;

        const combineSoprts =
          authContext.entity.role === Verbs.entityTypeClub
            ? [...followedSport]
            : [...playerSport, ...followedSport];

        const res = combineSoprts.map((obj) => ({
          sport: obj.sport,
          sport_type: obj.sport_type,
          sport_name: obj.sport_name,
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
      }
      const arr = [];
      for (const sport of sports) {
        const isFound = setting.filter((obj) => obj.sport === sport.sport);
        if (isFound?.length > 0) {
          arr.push(sport);
        }
      }

      const allSport = [
        ...arr,
        ...setting,
        ...authContext?.entity?.auth?.user?.registered_sports,
      ];
      const uniqSports = {};
      const uniqueSports = allSport.filter(
        // eslint-disable-next-line no-return-assign
        (obj) => !uniqSports[obj.sport] && (uniqSports[obj.sport] = true),
      );

      return [...uniqueSports];
    })
    // eslint-disable-next-line no-unused-vars
    .catch((e) => {
      const playerSport =
        authContext?.entity?.auth?.user?.registered_sports || [];
      const followedSport = authContext?.entity?.obj?.sports;
      const res = ([...playerSport, ...followedSport] || []).map((obj) => ({
        sport: obj.sport,
        sport_type: obj.sport_type,
        sport_name: obj.sport_name,
        player_image: obj.player_image,
      }));
      const result = res.reduce((unique, o) => {
        if (
          !unique.some(
            (obj) =>
              obj.sport === o.sport &&
              obj.sport_type === o.sport_type &&
              obj.sport_name === o.sport_name &&
              obj.player_image === o.player_image,
          )
        ) {
          unique.push(o);
        }
        return unique;
      }, []);

      return result;

      // setSportHandler(result);
    });
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
const getEventOccuranceFromRule = (event) => {
  const ruleObj = RRule.parseString(event.rrule);
  ruleObj.dtstart = getJSDate(event.start_datetime);
  ruleObj.until = getJSDate(event.untilDate);
  const rule = new RRule(ruleObj);
  const duration = event.end_datetime - event.start_datetime;
  let occr = rule.all();
  if (event.exclusion_dates) {
    // _.remove(occr, function (date) {
    //   return event.exclusion_dates.includes(Utility.getTCDate(date))
    // })
    occr = occr.filter(
      (date) => !event.exclusion_dates.includes(getTCDate(date)),
    );
  }
  occr = occr.map((RRItem) => {
    const newEvent = {...event};
    newEvent.start_datetime = getTCDate(RRItem);
    newEvent.end_datetime = newEvent.start_datetime + duration;
    // eslint-disable-next-line no-param-reassign
    RRItem = newEvent;
    return RRItem;
  });
  return occr;
};
const getQueryParticipants = async (authContext, setAllUserData) => {
  let participants = [];

  if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
    try {
      const [response] = await Promise.all([
        getTeamsOfClub(authContext.entity.uid, authContext),
      ]);

      const teams = [];
      const group_data = [
        {
          id: authContext.entity?.obj?.group_id,
          name: authContext.entity?.obj?.group_name,
        },
      ];

      if (response?.payload && response?.payload?.length > 0) {
        response.payload.forEach((item) => {
          teams.push(item.group_id);
          const temp = {};
          temp.id = item.group_id;
          temp.name = item.group_name;
          group_data.push(temp);
        });
      }
      participants = [authContext?.entity?.uid, ...teams];

      setAllUserData(group_data);
    } catch (error) {
      Alert.alert(strings.townsCupTitle, error.message);
    }
  } else {
    try {
      const [response] = await Promise.all([getGroups(authContext)]);

      const group_data = [
        {
          id: authContext?.user?.user_id,
          name: authContext?.user?.full_name,
        },
      ];
      if (response?.payload && response?.payload.clubs?.length > 0) {
        response.payload.clubs.forEach((item) => {
          const temp = {};
          temp.id = item.group_id;
          temp.name = item.group_name;
          group_data.push(temp);
        });
      }
      if (response?.payload && response?.payload.teams?.length > 0) {
        response.payload.teams.forEach((item) => {
          const temp = {};
          temp.id = item.group_id;
          temp.name = item.group_name;
          group_data.push(temp);
        });
      }
      setAllUserData(group_data);

      const clubs = authContext?.entity?.obj?.clubIds || [];
      const teams = authContext?.entity?.obj?.teamIds || [];
      participants = [authContext?.entity?.uid, ...clubs, ...teams];
    } catch (error) {
      Alert.alert(strings.townsCupTitle, error.message);
    }
  }

  return participants;
};

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const setEventList = (setFilterData, eventList = []) => {
  if (eventList?.length > 0) {
    const result = _(eventList)
      .groupBy((event) =>
        // event.start_datetime,

        moment(getJSDate(event.start_datetime)).format('MMM DD, YYYY'),
      )
      .value();

    const filData = [];
    const nextDateTime = getJSDate(getTCDate(new Date()) + 24 * 60 * 60);
    nextDateTime.setHours(0, 0, 0, 0);
    for (const property in result) {
      if (property) {
        let temp = {};
        const value = result[property];

        const start = getJSDate(result[property][0]?.start_datetime);
        start.setHours(0, 0, 0, 0);

        const currentDateTime = new Date();
        currentDateTime.setHours(0, 0, 0, 0);

        let title = `${
          days[getJSDate(result[property][0]?.start_datetime).getDay()]
        }, ${moment(getJSDate(result[property][0]?.start_datetime)).format(
          'MMM DD',
        )}`;

        if (start.getTime() === currentDateTime.getTime()) {
          title = strings.todayTitleText;
        }

        if (start.getTime() === nextDateTime.getTime()) {
          title = strings.tomorrowTitleText;
        }

        temp = {
          title,
          time:
            result[property]?.length > 0
              ? result[property][0]?.start_datetime
              : '',
          data: result[property]?.length > 0 ? value : [],
        };
        filData.push(temp);
      }
    }
    setFilterData(filData.map((obj) => obj.data[0]));
  } else {
    setFilterData([]);
  }
};

const Eventfucn = (
  eventData,
  filterSetting,
  selectedOptions,
  authContext,
  setFilterData,
) => {
  const events = eventData.filter(
    (obj) => (obj.game_id && obj.game) || obj.title,
  );

  setEventList(setFilterData, events);
};

const configureEvents = (
  eventsData,
  games,
  setFilterData,
  filterSetting,
  selectedOptions,
  authContext,
) => {
  const eventTimeTableData = eventsData.map((item) => {
    if (item?.game_id) {
      const gameObj =
        (games || []).filter((game) => game.game_id === item.game_id) ?? [];
      if (gameObj?.length > 0) {
        // eslint-disable-next-line no-param-reassign
        item.game = gameObj[0];
      }
    } else {
      return item;
    }
    return item;
  });

  Eventfucn(
    (eventTimeTableData || []).sort(
      (a, b) => getJSDate(a.start_datetime) - getJSDate(b.start_datetime),
    ),
    filterSetting,
    setFilterData,
    selectedOptions,
    authContext,
  );
};

const getEventsAndSlotsList = async (
  authContext,
  setAllUserData,
  setOwners,

  filterSetting,
  selectedOptions,
  setFilterData,
  allUserData = [],
  data = {},
) => {
  const eventTimeTableData = [];
  const participants = await getQueryParticipants(authContext, setAllUserData);

  getEventsSlots(participants)
    .then((response) => {
      const allUserIds = [];
      response.forEach((item) => {
        if (
          item.cal_type === Verbs.eventVerb &&
          // eslint-disable-next-line no-undef
          !allUserData.includes(item.created_by.uid)
        ) {
          allUserIds.push(item.created_by.uid);
        }
      });
      const getUserDetailQuery = {
        size: 1000,
        from: 0,
        query: {
          terms: {
            'user_id.keyword': [...allUserIds],
          },
        },
      };

      getUserIndex(getUserDetailQuery)
        .then((res) => {
          setOwners(res);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });

      let resCalenders = [];
      let eventsCal = [];
      if (response) {
        let hasRecord = false;
        response.forEach((item) => {
          if (item.cal_id === data.cal_id) {
            hasRecord = true;
          }
        });
        if (data && !hasRecord) {
          // eslint-disable-next-line no-param-reassign
          response = [...response, data];
        }
        // eslint-disable-next-line no-unused-vars
        resCalenders = response.filter(
          (obj) => obj.cal_type === Verbs.blockedVerb,
        );
        eventsCal = response.filter((obj) => {
          if (obj.cal_type === Verbs.eventVerb) {
            if (obj?.expiry_datetime) {
              if (obj?.expiry_datetime >= getTCDate(new Date())) {
                return obj;
              }
            } else {
              return obj;
            }
          }
          return false;
        });
      }

      eventsCal.forEach((item) => {
        if (item?.rrule) {
          let rEvents = getEventOccuranceFromRule(item);
          rEvents = rEvents.filter(
            (x) => x.end_datetime > getTCDate(new Date()),
          );
          eventTimeTableData.push(...rEvents);
        } else {
          eventTimeTableData.push(item);
        }
      });

      let gameIDs = [...new Set(response.map((item) => item.game_id))];
      gameIDs = (gameIDs || []).filter((item) => item !== undefined);

      if (gameIDs?.length > 0) {
        const gameList = {
          query: {
            terms: {
              _id: gameIDs,
            },
          },
        };

        getGameIndex(gameList).then((games) => {
          // eslint-disable-next-line array-callback-return, consistent-return
          const listObj = response.map((obj) => {
            if (obj.game_id === obj.challenge_id) {
              return obj.game;
            }
          });

          const pendingChallenge = listObj.filter((obj) => obj !== undefined);

          const gamelists = [
            ...games,
            ...pendingChallenge,
            ...response.filter((obj) => obj.owner_id),
          ];
          // eslint-disable-next-line no-unused-vars
          getGamesList(gamelists).then((gamedata) => {});
        });
      }

      configureEvents(
        eventTimeTableData,
        [],
        filterSetting,
        selectedOptions,
        authContext,
        setFilterData,
      );
    })
    .catch((e) => {
      Alert.alert(strings.alertmessagetitle, e.message);
    });
};

export {
  getDataForNextScreen,
  LocalHomeQuery,
  getNotificationCountHome,
  getTeamSportOnlyList,
  getSportsForHome,
  convertToKFormat,
  getEventOccuranceFromRule,
  getEventsAndSlotsList,
};
