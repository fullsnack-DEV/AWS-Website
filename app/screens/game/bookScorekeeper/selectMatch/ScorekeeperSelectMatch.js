import React, {useContext, useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';

import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCSearchBox from '../../../../components/TCSearchBox';
import AuthContext from '../../../../auth/context';
import TCInnerLoader from '../../../../components/TCInnerLoader';
import {getSearchData} from '../../../../utils';
import GameCard from '../../../../components/TCGameCard';
import * as Utility from '../../../../utils';
import {getCalendarIndex, getGameIndex} from '../../../../api/elasticSearch';
import {strings} from '../../../../../Localization/translation';

const TYPING_SPEED = 200;
let bodyParams = {};

const ScorekeeperSelectMatch = ({navigation, route}) => {
  const userData = route?.params?.userData;
  const authContext = useContext(AuthContext);
  const [searchText, setSearchText] = useState('');
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(0);

  useEffect(() => {
    if (
      route &&
      route.params &&
      route.params.editableAlter &&
      route.params.body
    ) {
      console.log('EDIT Games::', route.params.body);
      bodyParams = {
        ...route.params.body,
      };
    }
  }, [route]);

  useEffect(() => {
    console.log('userData:::::=>', userData);
    setLoading(true);
    const headers = {};
    headers.caller_id = authContext?.entity?.uid;
    getGamesForScorekeeper(authContext?.entity?.uid, userData?.user_id).then(
      (res) => {
        setLoading(false);
        setMatchData([...res]);
      },
    );
    // getGameSlots(
    //   'scorekeepers',
    //   userData?.user_id,
    //   `status=accepted&sport=${sport}&scorekeeperDetail=true`,
    //   headers,
    //   authContext,
    // )
    //   .then((res) => {
    //     setMatchData([...res?.payload]);
    //   }).finally(() => setLoading(false))
  }, [authContext?.entity?.uid, userData]);

  const getGamesForScorekeeper = async (scorekeeperId, teamId) => {
    const gameListWithFilter = {
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  {term: {'home_team.keyword': teamId}},
                  {term: {'away_team.keyword': teamId}},
                ],
              },
            },
            {
              range: {
                end_datetime: {
                  gt: parseFloat(new Date().getTime() / 1000).toFixed(0),
                },
              },
            },
            {term: {'status.keyword': 'accepted'}},
            {
              term: {
                'challenge_scorekeeper.who_secure.responsible_team_id.keyword':
                  teamId,
              },
            },
          ],
        },
      },
      sort: [{start_datetime: 'asc'}],
    };

    console.log('Json string:=>', JSON.stringify(gameListWithFilter));
    const scorekeeperList = {
      query: {
        bool: {
          must: [
            {term: {'participants.entity_id.keyword': scorekeeperId}},
            {
              range: {
                end_datetime: {
                  gt: parseFloat(new Date().getTime() / 1000).toFixed(0),
                },
              },
            },
            {term: {'cal_type.keyword': 'event'}},
            {match: {blocked: true}},
          ],
        },
      },
    };

    const promiseArr = [
      getGameIndex(gameListWithFilter),
      getCalendarIndex(scorekeeperList),
    ];

    return Promise.all(promiseArr)
      .then(([gameList, eventList]) => {
        setLoading(false);
        console.log('gameList', gameList);
        console.log('scorekeeperList', eventList);

        for (const game of gameList) {
          game.isAvailable = true;
          eventList.forEach((slot) => {
            // check if slot start time comes between the game time
            if (
              game.start_datetime <= slot.start_datetime &&
              game.end_datetime >= slot.start_datetime
            ) {
              game.isAvailable = false;
            }

            // check if slot end time comes between the game time
            if (
              game.start_datetime <= slot.end_datetime &&
              game.end_datetime >= slot.end_datetime
            ) {
              game.isAvailable = false;
            }

            // Check if game is under the blocked time
            if (
              slot.start_datetime <= game.start_datetime &&
              slot.end_datetime >= game.start_datetime
            ) {
              game.isAvailable = false;
            }
          });
        }

        return Utility.getGamesList(gameList).then((gamedata) => gamedata);
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.messages);
        }, 10);
      });
  };

  const onSearchTextChange = (text) => {
    if (typingTimeout) clearTimeout(typingTimeout);
    setSearchText(text);
    const search = () => {
      console.log(matchData);
      if (text !== '') {
        const data = getSearchData(matchData, ['sport'], text);
        if (data?.length > 0) setSearchData([...data]);
        else setSearchData([]);
      }
    };
    setTypingTimeout(setTimeout(search, TYPING_SPEED));
  };
  return (
    <View style={styles.mainContainer}>
      {/* Loader */}
      <TCInnerLoader visible={loading} />

      {/* Content */}
      {!loading && (
        <View style={styles.contentContainer}>
          {/*  Search Bar */}
          <TCSearchBox
            value={searchText}
            placeholderText={'Search'}
            onChangeText={onSearchTextChange}
          />

          {/*  Match List Container */}
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{marginTop: 20}}
            keyExtractor={(item) => item?.user_id}
            bounces={false}
            data={searchText === '' ? matchData : searchData}
            renderItem={({item}) => (
              <View style={{marginVertical: 5}}>
                <GameCard
                  data={item}
                  onPress={() => {
                    const game = item;
                    let isSameScorekeeper = false;
                    const sameScorekeeperCount = game?.scorekeepers?.filter(
                      (gameScorekeeper) =>
                        gameScorekeeper?.user_id === userData?.user_id,
                    );
                    if (sameScorekeeperCount?.length > 0)
                      isSameScorekeeper = true;

                    let message = '';
                    if (isSameScorekeeper) {
                      message =
                        'This scorekeeper is already booked for this game.';
                    }
                    if (message === '') {
                      // navigation.navigate(route?.params?.comeFrom, {
                      //   comeFrom: 'ScorekeeperSelectMatch',
                      //   gameData: item,
                      // });
                      navigation.navigate(route?.params?.comeFrom, {
                        reservationObj: {
                          ...bodyParams,
                          game: item,
                        },
                      });
                    }
                  }}
                />
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptySectionListItem}>
                {searchText === ''
                  ? 'No match found'
                  : `No match found for '${searchText}'`}
              </Text>
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
    padding: 15,
    paddingBottom: 0,
  },
  emptySectionListItem: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    marginLeft: 10,
    marginTop: 10,
    color: colors.lightBlackColor,
    textAlign: 'center',
  },
});
export default ScorekeeperSelectMatch;
