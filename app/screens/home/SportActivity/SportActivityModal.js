// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, Modal, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {strings} from '../../../../Localization/translation';
import {getGameScoreboardEvents} from '../../../api/Games';
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
}) => {
  const authContext = useContext(AuthContext);
  const [matchList, setMatchList] = useState([]);
  const [isFetchingMatchList, setIsFetchingMatchList] = useState(false);
  const [isScorekeeper, setIsScoreKeeper] = useState(false);
  const [isReferee, setIsReferee] = useState(false);
  const [isUserWithSameSport, setIsUserWithSameSport] = useState(false);
  const [sportIcon, setSportIcon] = useState('');
  const [availabilityList, setAvailabilityList] = useState([]);
  const [fetchingAvailability, setFectchingAavailability] = useState(false);

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

  useEffect(() => {
    if (isVisible) {
      getMatchList();
      getAvailability();
    }
  }, [isVisible, getMatchList, getAvailability]);

  useEffect(() => {
    getSportIconUrl(sport, userData.entity_type, authContext).then((url) => {
      setSportIcon(url);
    });
  }, [sport, authContext, userData]);

  useEffect(() => {
    const scorekeeperObj = (userData.scorekeeper_data ?? []).find(
      (item) =>
        item.sport === sportObj?.sport &&
        item.sport_type === sportObj?.sport_type,
    );
    if (scorekeeperObj) {
      setIsScoreKeeper(true);
    }
    // registered_sports
    const refereeObj = (userData.referee_data ?? []).find(
      (item) =>
        item.sport === sportObj?.sport &&
        item.sport_type === sportObj?.sport_type,
    );
    if (refereeObj) {
      setIsReferee(true);
    }

    const userWithSameSport = (userData.registered_sports ?? []).find(
      (item) =>
        item.sport === sportObj?.sport &&
        item.sport_type === sportObj?.sport_type,
    );
    if (userWithSameSport) {
      setIsUserWithSameSport(true);
    }
  }, [userData, sportObj]);

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.parent}>
        <View style={styles.card}>
          <ScreenHeader
            sportIcon={sportIcon}
            title={`${strings.playingText} ${sportName}`}
            rightIcon2={images.closeSearch}
            rightIcon2Press={closeModal}
            containerStyle={{
              borderBottomWidth: 3,
              borderBottomColor: colors.themeColor,
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
              />
              <ChallengeButton
                isAdmin={isAdmin}
                isAvailable={sportObj?.setting?.availibility === 'On'}
                isScorekeeper={isScorekeeper}
                isReferee={isReferee}
                isUserWithSameSport={isUserWithSameSport}
                onPress={handleChallengeClick}
              />

              {sportObj?.sport_type === Verbs.singleSport ? (
                <AvailabilitySection
                  list={availabilityList}
                  loading={fetchingAvailability}
                  onSeeAll={() => onSeeAll(strings.availability)}
                />
              ) : null}

              {sportObj?.sport_type !== Verbs.singleSport ? (
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
                onSeeAll={() => onSeeAll(strings.scoreboard)}
                screenType={Verbs.screenTypeModal}
              />
              <StatSection
                onSeeAll={() => onSeeAll(strings.statsTitle)}
                sportType={sportObj?.sport_type}
              />
              {sportObj?.sport_type === Verbs.singleSport ? (
                <ReviewSection
                  onSeeAll={() => onSeeAll(strings.reviews)}
                  ratings={
                    sportObj?.avg_review?.total_avg
                      ? parseFloat(sportObj.avg_review.total_avg).toFixed(2)
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
