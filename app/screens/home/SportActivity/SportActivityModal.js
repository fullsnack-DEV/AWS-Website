// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, Modal, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {strings} from '../../../../Localization/translation';
import {
  getGameScoreboardEvents,
  getGameStatsData,
  getRefereedMatch,
  getScorekeeperMatch,
} from '../../../api/Games';
import AuthContext from '../../../auth/context';

import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';
import ChallengeButton from './components/ChallengeButton';
import ReviewSection from './components/ReviewSection';
import ScoreBoardList from './components/ScoreBoardList';
import StatSection from './components/StatSection';
import UserInfo from './components/UserInfo';
import TeamsList from './components/TeamsList';
import {getCalendar, getSportIconUrl, getTCDate} from '../../../utils';
import ScreenHeader from '../../../components/ScreenHeader';
import AvailabilitySection from './components/availability/AvailabilitySection';
import {
  getHeaderTitle,
  getIsAvailable,
  getProgressBarColor,
  getScoreboardListTitle,
} from '../../../utils/sportsActivityUtils';

const SportActivityModal = ({
  sport,
  sportName,
  isAdmin,
  userData = {},
  isVisible = false,
  closeModal = () => {},
  onSeeAll = () => {},
  sportObj = {},
  handleChallengeClick = () => {},
  onMessageClick = () => {},
  entityType = Verbs.entityTypePlayer,
  continueToChallenge = () => {},
  bookReferee = () => {},
  bookScoreKeeper = () => {},
}) => {
  const authContext = useContext(AuthContext);
  const [matchList, setMatchList] = useState([]);
  const [isFetchingMatchList, setIsFetchingMatchList] = useState(false);
  const [sportIcon, setSportIcon] = useState('');
  const [availabilityList, setAvailabilityList] = useState([]);
  const [fetchingAvailability, setFectchingAavailability] = useState(false);
  const [statsObject, setStatsObject] = useState({
    totalWins: 0,
    totalLosses: 0,
    totalDraws: 0,
    totalMatches: 0,
  });

  const getMatchList = useCallback(() => {
    setIsFetchingMatchList(true);
    const params = {
      sport,
      role: Verbs.entityTypePlayer,
    };

    getGameScoreboardEvents(userData.user_id, params, authContext)
      .then((res) => {
        setMatchList(res.payload);
        setIsFetchingMatchList(false);
      })
      .catch(() => {
        setIsFetchingMatchList(false);
      });
  }, [authContext, sport, userData]);

  const getAvailability = useCallback(() => {
    const date = new Date();
    date.setDate(new Date().getDate() + 7);
    setFectchingAavailability(true);
    getCalendar(
      userData.user_id,
      getTCDate(new Date()),
      getTCDate(date),
      'blocked',
    )
      .then((res) => {
        setAvailabilityList(res);
        setFectchingAavailability(false);
      })
      .catch((err) => {
        console.log({err});
        setFectchingAavailability(false);
      });
  }, [userData]);

  const loadStatsData = useCallback(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    const chartParameter = {
      sport,
      fromDate: getTCDate(date),
    };
    getGameStatsData(userData?.user_id, chartParameter, authContext)
      .then((res) => {
        const list = res.payload.filter((item) => item.sport_name === sport);
        let totalMatches = 0;
        let totalWins = 0;
        let totalLosses = 0;
        let totalDraws = 0;
        list.forEach((item) => {
          totalMatches += item.stats.all.total_games;
          totalWins += item.stats.all.winner;
          totalLosses += item.stats.all.looser;
          totalDraws += item.stats.all.draw;
        });
        setStatsObject({totalMatches, totalWins, totalLosses, totalDraws});
      })
      .catch((err) => {
        console.log({err});
      });
  }, [authContext, sport, userData]);

  const getRefereeMatchList = useCallback(() => {
    setIsFetchingMatchList(true);
    getRefereedMatch(userData?.user_id, sport, authContext)
      .then((res) => {
        setMatchList(res.payload);
        setIsFetchingMatchList(false);
      })
      .catch((err) => {
        console.log(err);
        setIsFetchingMatchList(false);
      });
  }, [userData, sport, authContext]);

  const getScorekeeperMatchList = useCallback(() => {
    setIsFetchingMatchList(true);
    getScorekeeperMatch(userData?.user_id, sport, authContext)
      .then((res) => {
        setMatchList(res.payload);
        setIsFetchingMatchList(false);
      })
      .catch((err) => {
        console.log(err);
        setIsFetchingMatchList(false);
      });
  }, [userData, sport, authContext]);

  useEffect(() => {
    if (isVisible) {
      getAvailability();
      if (entityType === Verbs.entityTypePlayer) {
        getMatchList();
        loadStatsData();
      }
      if (entityType === Verbs.entityTypeReferee) {
        getRefereeMatchList();
      }
      if (entityType === Verbs.entityTypeScorekeeper) {
        getScorekeeperMatchList();
      }
    }
  }, [
    isVisible,
    getMatchList,
    getAvailability,
    loadStatsData,
    getRefereeMatchList,
    entityType,
    getScorekeeperMatchList,
  ]);

  useEffect(() => {
    getSportIconUrl(sport, userData.entity_type, authContext).then((url) => {
      setSportIcon(url);
    });
  }, [sport, authContext, userData]);

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.parent}>
        <View style={styles.card}>
          <ScreenHeader
            sportIcon={sportIcon}
            title={`${getHeaderTitle(entityType)} ${sportName}`}
            rightIcon2={images.crossImage}
            rightIcon2Press={closeModal}
            containerStyle={{
              borderBottomWidth: 3,
              borderBottomColor: getProgressBarColor(entityType),
            }}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{padding: 15, flex: 1}}>
              <UserInfo
                screenType={Verbs.screenTypeModal}
                user={userData}
                onMore={() => onSeeAll(strings.infoTitle)}
                isLookingForClub={sportObj?.lookingForTeamClub}
                isAdmin={isAdmin}
                onMessageClick={onMessageClick}
                level={sportObj?.level}
                entityType={entityType}
                description={sportObj?.descriptions}
                sportType={sportObj?.sport_type}
              />
              <ChallengeButton
                isAdmin={isAdmin}
                loggedInEntity={authContext.entity.obj}
                sportObj={sportObj}
                isAvailable={getIsAvailable(sportObj, entityType)}
                inviteToChallenge={handleChallengeClick}
                continueToChallenge={continueToChallenge}
                bookReferee={bookReferee}
                bookScoreKeeper={bookScoreKeeper}
              />

              {sportObj?.sport_type === Verbs.singleSport ||
              entityType !== Verbs.entityTypePlayer ? (
                <AvailabilitySection
                  list={availabilityList}
                  loading={fetchingAvailability}
                  onSeeAll={() => onSeeAll(strings.availability)}
                />
              ) : null}

              {sportObj?.sport_type !== Verbs.singleSport &&
              entityType === Verbs.entityTypePlayer ? (
                <TeamsList
                  list={userData.joined_teams ?? []}
                  sportType={sportObj?.sport_type}
                  sport={sportObj?.sport}
                  showHorizontalList
                />
              ) : null}

              <ScoreBoardList
                loading={isFetchingMatchList}
                matchList={matchList}
                onSeeAll={() => onSeeAll(getScoreboardListTitle(entityType))}
                screenType={Verbs.screenTypeModal}
                title={getScoreboardListTitle(entityType)}
              />
              {entityType === Verbs.entityTypePlayer ? (
                <StatSection
                  onSeeAll={() => onSeeAll(strings.statsTitle)}
                  sportType={sportObj?.sport_type}
                  {...statsObject}
                />
              ) : null}

              {sportObj?.sport_type === Verbs.singleSport ||
              entityType !== Verbs.entityTypePlayer ? (
                <ReviewSection
                  onSeeAll={() => onSeeAll(strings.reviews)}
                  ratings={
                    sportObj?.avg_review?.total_avg
                      ? parseFloat(sportObj.avg_review.total_avg).toFixed(1)
                      : 0.0
                  }
                />
              ) : null}
            </View>
          </ScrollView>
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
});

export default SportActivityModal;
