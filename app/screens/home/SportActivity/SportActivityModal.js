// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {strings} from '../../../../Localization/translation';
import {getGameScoreboardEvents} from '../../../api/Games';
import AuthContext from '../../../auth/context';

import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';
import ChallengeButton from './components/ChallengeButton';
import ReviewSection from './components/ReviewSection';
import ScoreBoardList from './components/ScoreBoardList';
import styles from './SportActivityModalStyles';
import StatSection from './components/StatSection';
import UserInfo from './components/UserInfo';
import TeamsList from './components/TeamsList';
import {getSportIconUrl} from '../../../utils';

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

  useEffect(() => {
    if (isVisible) {
      getMatchList();
    }
  }, [isVisible, getMatchList]);

  useEffect(() => {
    getSportIconUrl(sport, userData.entity_type, authContext).then((url) => {
      setSportIcon(url);
    });
  }, [sport, authContext, userData]);

  useEffect(() => {
    (userData.scorekeeper_data ?? []).forEach((item) => {
      setIsScoreKeeper(
        item.sport === sportObj?.sport &&
          item.sport_type === sportObj?.sport_type,
      );
    });
    // registered_sports
    (userData.referee_data ?? []).forEach((item) => {
      setIsReferee(
        item.sport === sportObj?.sport &&
          item.sport_type === sportObj?.sport_type,
      );
    });

    (userData.registered_sports ?? []).forEach((item) => {
      setIsUserWithSameSport(
        item.sport === sportObj?.sport &&
          item.sport_type === sportObj?.sport_type,
      );
    });
  }, [userData, sportObj]);

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.parent}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View />
            <View style={styles.row}>
              <View style={styles.imageContainer}>
                <Image
                  source={sportIcon ? {uri: sportIcon} : images.accountMySports}
                  style={styles.image}
                />
              </View>
              <Text style={styles.headerRowTitle}>
                {`${strings.playingText} ${sportName}`}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.headerButtonContainer}
              onPress={closeModal}>
              <Image source={images.closeSearch} style={styles.image} />
            </TouchableOpacity>
          </View>
          <View style={{height: 3, backgroundColor: colors.themeColor}} />
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

export default SportActivityModal;
