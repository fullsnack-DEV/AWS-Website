// @flow
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Dimensions,
  Pressable,
  Image,
  FlatList,
} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import {
  getGameIndex,
  getGroupIndex,
  getUserIndex,
} from '../../../../api/elasticSearch';

import AuthContext from '../../../../auth/context';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';
import Verbs from '../../../../Constants/Verbs';
import {getTCDate} from '../../../../utils';
import ListShimmer from './ListShimmer';
import MatchCard from './MatchCard';

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

  return (
    <Modal
      visible={isVisible}
      transparent
      onRequestClose={() => {
        closeModal();
      }}>
      <View style={styles.parent}>
        <View style={styles.card}>
          <View style={styles.closeButtonContainer}>
            <Pressable style={styles.closeIcon} onPress={closeModal}>
              <Image source={images.crossImage} style={styles.image} />
            </Pressable>
          </View>
          <View style={{marginHorizontal: 35, marginTop: 70, marginBottom: 25}}>
            <Text style={styles.congratsText}>
              {entityType === Verbs.entityTypeReferee
                ? strings.refereeCongratsModalTitle
                : strings.scoreKeeperCongratsModalTitle}
              <Text style={styles.congratsSportText}> {sportName}.</Text>
            </Text>
          </View>
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
              ? strings.refereeCongratulationsModal
              : strings.scoreKeeperCongratulationsModal}
          </Text>
          <View style={styles.dividor} />
          {renderList()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.whiteColor,
    height: Dimensions.get('window').height - 50,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  congratsText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    lineHeight: 35,
    paddingBottom: 10,
  },
  congratsSportText: {
    alignSelf: 'center',
    color: colors.darkYellowColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    lineHeight: 35,
    paddingBottom: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    marginHorizontal: 25,
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
    marginHorizontal: 25,
  },
  dividor: {
    height: 1,
    marginVertical: 25,
    backgroundColor: colors.grayBackgroundColor,
  },
  closeButtonContainer: {
    position: 'absolute',
    right: 15,
    top: 20,
  },
  closeIcon: {
    width: 25,
    height: 25,
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
