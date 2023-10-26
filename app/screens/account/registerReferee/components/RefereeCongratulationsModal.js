// @flow
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, Pressable, Dimensions} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {format} from 'react-string-format';
import {strings} from '../../../../../Localization/translation';
import {
  getGameIndex,
  getGroupIndex,
  getUserIndex,
} from '../../../../api/elasticSearch';
import AuthContext from '../../../../auth/context';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import Verbs from '../../../../Constants/Verbs';
import {getTCDate} from '../../../../utils';
import ListShimmer from './ListShimmer';
import MatchCard from './MatchCard';
import CustomModalWrapper from '../../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../../Constants/GeneralConstants';

const RefereeCongratulationsModal = ({
  isVisible,
  closeModal = () => {},
  sportName,
  goToSportActivityHome = () => {},
  entityType = Verbs.entityTypeReferee,
  sport,
}) => {
  const [matchList, setMatchList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teamsData, setTeamsData] = useState({});
  const [isTeamSport, setIsTeamSport] = useState(false);
  const [snapPoints, setSnapPoints] = useState([]);

  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);

  const renderList = () => {
    if (loading) {
      return (
        <View style={{flex: 1}}>
          <Text style={styles.listTitle}>{strings.matchesNearYou}</Text>
          <ListShimmer />
        </View>
      );
    }
    if (matchList.length > 0) {
      return (
        <View style={{flex: 1}}>
          <Text style={styles.listTitle}>{strings.matchesNearYou}</Text>
          <FlatList
            data={matchList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <MatchCard
                match={item}
                onSendOffer={() => {
                  closeModal();
                }}
                teamsData={teamsData}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      );
    }
    return null;
  };

  const getData = useCallback((entityId, isUserChallenge = false) => {
    const queryParams = {
      size: 100,
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [],
              },
            },
          ],
        },
      },
    };

    if (isUserChallenge) {
      queryParams.query.bool.must[0].bool.should.push({
        match: {
          user_id: {query: entityId},
        },
      });
    } else {
      queryParams.query.bool.must[0].bool.should.push({
        match: {
          group_id: {query: entityId},
        },
      });
    }

    return isUserChallenge
      ? getUserIndex(queryParams)
      : getGroupIndex(queryParams);
  }, []);

  const getUpcomingGameList = useCallback(() => {
    setLoading(true);
    // Upcoming match query
    const upcomingMatchQuery = {
      query: {
        bool: {
          must: [
            {
              range: {
                start_datetime: {
                  gte: getTCDate(new Date()),
                },
              },
            },
          ],
        },
      },
      sort: [{actual_enddatetime: 'desc'}],
    };
    if (authContext.entity.obj?.country) {
      upcomingMatchQuery.query.bool.must.push({
        multi_match: {
          query: authContext.entity.obj?.country,
          fields: ['country'],
        },
      });
    }
    if (sport !== strings.all) {
      upcomingMatchQuery.query.bool.must.push({
        term: {
          'sport.keyword': {
            value: sport.toLowerCase(),
            case_insensitive: true,
          },
        },
      });
    }

    getGameIndex(upcomingMatchQuery)
      .then((games) => {
        if (games.length > 0) {
          const queryList = [];
          games.forEach((element) => {
            queryList.push(getData(element.away_team, element.user_challenge));
            queryList.push(getData(element.home_team, element.user_challenge));
          });

          Promise.all(queryList)
            .then((response) => {
              const obj = {};
              response.forEach((item) => {
                const id = item[0].user_id ?? item[0].group_id;
                obj[id] = {...item[0]};
              });
              setTeamsData(obj);
            })
            .catch((err) => {
              console.log({err});
            });
        }
        setMatchList([...games]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sport, authContext, getData]);

  useEffect(() => {
    if (isFocused && isVisible) {
      getUpcomingGameList();
    }
  }, [isFocused, isVisible, getUpcomingGameList]);

  useEffect(() => {
    if (sport) {
      const obj = authContext.sports.find((item) => item.sport === sport);

      if (obj) {
        const sportFormat = (obj.format ?? []).find(
          (item) => item.entity_type === Verbs.entityTypePlayer,
        );
        if (sportFormat) {
          setIsTeamSport(false);
        } else {
          setIsTeamSport(true);
        }
      }
    }
  }, [sport, authContext.sports]);

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeModal}
      modalType={ModalTypes.style2}
      containerStyle={{paddingHorizontal: 0}}
      externalSnapPoints={snapPoints}>
      <View
        onLayout={(event) => {
          const contentHeight = event.nativeEvent.layout.height + 80;

          setSnapPoints([
            '50%',
            contentHeight,
            Dimensions.get('window').height - 40,
          ]);
        }}>
        <View style={{paddingHorizontal: 35}}>
          <Text style={styles.congratsText}>
            {entityType === Verbs.entityTypeReferee
              ? strings.refereeCongratsModalTitle
              : strings.scoreKeeperCongratsModalTitle}
            <Text
              style={[styles.congratsText, {color: colors.darkYellowColor}]}>
              {' '}
              {sportName}.
            </Text>
          </Text>
        </View>
        <View style={{paddingHorizontal: 25}}>
          <Pressable
            style={styles.buttonContainer}
            onPress={() => {
              goToSportActivityHome();
            }}>
            <Text style={styles.buttonText}>
              {strings.goToSportActivityHomeText}
            </Text>
          </Pressable>

          <Text style={styles.description}>
            {entityType === Verbs.entityTypeReferee
              ? format(
                  strings.refereeCongratulationsModal,
                  isTeamSport ? strings.teams : strings.teamsAndPlayers,
                )
              : format(
                  strings.scoreKeeperCongratulationsModal,
                  isTeamSport ? strings.teams : strings.teamsAndPlayers,
                )}
          </Text>
        </View>
        <View style={styles.dividor} />
        <View style={{flex: 1}}>{renderList()}</View>
      </View>
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  congratsText: {
    fontSize: 25,
    lineHeight: 35,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    marginTop: 25,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.themeColor,
    fontFamily: fonts.RBold,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  dividor: {
    height: 1,
    marginVertical: 25,
    backgroundColor: colors.grayBackgroundColor,
  },
  listTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    paddingHorizontal: 25,
  },
});
export default RefereeCongratulationsModal;
