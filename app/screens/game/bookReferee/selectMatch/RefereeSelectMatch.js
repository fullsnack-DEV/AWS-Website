import React, {useContext, useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';

import {format} from 'react-string-format';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCSearchBox from '../../../../components/TCSearchBox';
import AuthContext from '../../../../auth/context';
import TCInnerLoader from '../../../../components/TCInnerLoader';
import {getSearchData} from '../../../../utils';
import TCGameCard from '../../../../components/TCGameCard';
import {strings} from '../../../../../Localization/translation';
import * as Utility from '../../../../utils';
import {getCalendarIndex, getGameIndex} from '../../../../api/elasticSearch';

const TYPING_SPEED = 200;

let bodyParams = {};

const RefereeSelectMatch = ({navigation, route}) => {
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
      bodyParams = {
        ...route.params.body,
      };
    }
  }, [route]);

  useEffect(() => {
    setLoading(true);
    const headers = {};
    headers.caller_id = authContext?.entity?.uid;

    getGamesForReferee(userData?.user_id, authContext?.entity?.uid).then(
      (res) => {
        setLoading(false);
        setMatchData([...res]);
      },
    );
  }, [authContext, userData]);

  const getGamesForReferee = async (refereeId, teamId) => {
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
                'challenge_referee.who_secure.responsible_team_id.keyword':
                  teamId,
              },
            },
          ],
        },
      },
      sort: [{start_datetime: 'asc'}],
    };

    console.log('Json string:=>', JSON.stringify(gameListWithFilter));
    const refereeList = {
      query: {
        bool: {
          must: [
            {term: {'participants.entity_id.keyword': refereeId}},
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
      getCalendarIndex(refereeList),
    ];

    return Promise.all(promiseArr)
      .then(([gameList, eventList]) => {
        setLoading(false);

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
            placeholderText={strings.searchText}
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
                <TCGameCard
                  data={item}
                  cardWidth={'88%'}
                  onPress={() => {
                    const game = item;
                    let isSameReferee = false;
                    const sameRefereeCount = game?.referees?.filter(
                      (gameReferee) =>
                        gameReferee?.user_id === userData?.user_id,
                    );
                    if (sameRefereeCount?.length > 0) isSameReferee = true;
                    // const isCheif = userData?.chief_referee;
                    // const cheifCnt = game?.referees?.filter((chal_ref) => chal_ref?.chief_referee)?.length;
                    // const assistantCnt = game?.referees?.filter((chal_ref) => !chal_ref?.chief_referee)?.length;
                    let message = '';
                    if (isSameReferee) {
                      message = strings.refereeAlreadyBookedValidation;
                    }
                    // else if (!game.isAvailable) {
                    //   message = 'There is no available slot of a referee who you can book in this game.';
                    // } else if ((game?.referees?.count ?? 0) >= 3) {
                    //   message = 'There is no available slot of a referee who you can book in this game.';
                    // } else if (isCheif && cheifCnt >= 1) {
                    //   message = 'There is no available slot of a chief referee who you can book in this game.';
                    // } else if (!isCheif && assistantCnt >= 2) {
                    //   message = 'There is no available slot of an assistant referee who you can book in this game.';
                    // }
                    if (message === '') {
                      // navigation.navigate(route?.params?.comeFrom, {
                      //   comeFrom: 'RefereeSelectMatch',
                      //   gameData: item,
                      //   reservationObj: { ...bodyParams, game: item },

                      // });

                      navigation.navigate(route?.params?.comeFrom, {
                        reservationObj: {
                          ...bodyParams,
                          game: item,
                        },
                      });
                    }

                    // navigation.navigate(route?.params?.comeFrom, {
                    //   comeFrom: 'RefereeSelectMatch',
                    //   gameData: item,
                    // });
                  }}
                />
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptySectionListItem}>
                {searchText === ''
                  ? strings.noGameFound
                  : format(strings.noGameFoundFor, searchText)}
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
export default RefereeSelectMatch;
