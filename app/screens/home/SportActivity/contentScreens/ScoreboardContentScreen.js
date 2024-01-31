// @flow
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import {
  getGameScoreboardEvents,
  getRefereedMatch,
  getScorekeeperMatch,
  getScroreboardGameDetails,
} from '../../../../api/Games';
import AuthContext from '../../../../auth/context';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import GameStatus from '../../../../Constants/GameStatus';
import Verbs from '../../../../Constants/Verbs';
import ScoreBoardList from '../components/ScoreBoardList';
import images from '../../../../Constants/ImagePath';

const ScoreboardContentScreen = ({
  userData = {},
  sport = '',
  entityType = Verbs.entityTypePlayer,
  onCardPress = () => {},
  viewPrivacyStatus = true,
}) => {
  const [scoreboardList, setScoreboardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matchCount, setMatchCount] = useState({
    completed: 0,
    upcoming: 0,
  });
  const [selectedTab, setSelectedTab] = useState(strings.completedTitleText);

  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const setMatchData = (data = []) => {
    if (data.length > 0) {
      const completedList = [];
      const upcomingList = [];

      data.forEach((item) => {
        const isGameEnded = item.status === GameStatus.ended;
        const isFutureDate = item.start_datetime > new Date().getTime();
        if (isGameEnded) {
          completedList.push(item);
        } else if (!isGameEnded && isFutureDate) {
          upcomingList.push(item);
        }
      });
      setMatchCount({
        completed: completedList.length,
        upcoming: upcomingList.length,
      });
    }
  };

  const getScoreboardList = useCallback(() => {
    setLoading(true);
    const params = {
      sport,
      role: Verbs.entityTypePlayer,
    };

    getGameScoreboardEvents(userData.user_id, params, authContext)
      .then((res) => {
        setScoreboardList(res.payload);
        setMatchData(res.payload);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [sport, userData, authContext]);

  const getRefereeMatchList = useCallback(() => {
    setLoading(true);
    getRefereedMatch(userData?.user_id, sport, authContext)
      .then((res) => {
        setScoreboardList(res.payload);
        setMatchData(res.payload);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [userData, sport, authContext]);

  const getScorekeeperMatchList = useCallback(() => {
    setLoading(true);
    getScorekeeperMatch(userData?.user_id, sport, authContext)
      .then((res) => {
        setScoreboardList(res.payload);
        setMatchData(res.payload);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [userData, sport, authContext]);

  const getScoreboardGroup = useCallback(() => {
    getScroreboardGameDetails(userData.group_id, authContext)
      .then((res) => {
        setLoading(false);
        setScoreboardList(res.payload);
        setMatchData(res.payload);
      })
      .catch((error) => {
        setLoading(false);
        console.log('error :-', error);
      });
  }, [userData.group_id, authContext]);
  useEffect(() => {
    if (isFocused) {
      if (entityType === Verbs.entityTypePlayer) {
        getScoreboardList();
      }
      if (entityType === Verbs.entityTypeReferee) {
        getRefereeMatchList();
      }
      if (entityType === Verbs.entityTypeScorekeeper) {
        getScorekeeperMatchList();
      }
      if (
        entityType === Verbs.entityTypeClub ||
        entityType === Verbs.entityTypeTeam
      ) {
        getScoreboardGroup();
      }
    }
  }, [
    isFocused,
    getScoreboardList,
    entityType,
    getScoreboardGroup,
    getRefereeMatchList,
    getScorekeeperMatchList,
  ]);

  const getSectionList = () => {
    if (selectedTab === strings.completedTitleText) {
      return [strings.today, strings.yesterday, strings.past];
    }
    if (selectedTab === strings.upcomingTitleText) {
      return [strings.today, strings.tomorrow, strings.future];
    }
    return [];
  };

  const getMatchCount = () => {
    if (selectedTab === strings.completedTitleText) {
      return matchCount.completed;
    }

    if (selectedTab === strings.upcomingTitleText) {
      return matchCount.upcoming;
    }
    return 0;
  };

  return (
    <View style={styles.parent}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setSelectedTab(strings.completedTitleText)}>
          <Text
            style={[
              styles.tabLabel,
              selectedTab === strings.completedTitleText
                ? styles.activeTabLabel
                : {},
            ]}>
            {strings.completedTitleText} ({matchCount.completed})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setSelectedTab(strings.upcomingTitleText)}>
          <Text
            style={[
              styles.tabLabel,
              selectedTab === strings.upcomingTitleText
                ? styles.activeTabLabel
                : {},
            ]}>
            {strings.upcomingTitleText} ({matchCount.upcoming})
          </Text>
        </TouchableOpacity>
      </View>
      {viewPrivacyStatus ? (
        <>
          {scoreboardList.length > 0 && (
            <ScoreBoardList
              loading={loading}
              matchList={scoreboardList}
              screenType={Verbs.screenTypeMainScreen}
              sectionList={getSectionList()}
              matchCount={getMatchCount()}
              onCardPress={onCardPress}
            />
          )}

          {!loading && scoreboardList.length === 0 ? (
            <View style={styles.container}>
              <View style={{alignItems: 'center', marginBottom: 50}}>
                <Text style={styles.noDataText}>{strings.noMatch}</Text>
                <Text style={styles.noDataSubText}>
                  {strings.newMatchesWillAppearHere}
                </Text>
              </View>
              <View style={styles.imageContainer}>
                <Image source={images.noMatchImageIcon} style={styles.image} />
              </View>
            </View>
          ) : null}
        </>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 90,
          }}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              color: colors.googleColor,
              fontFamily: fonts.RRegular,
            }}>
            {strings.noMatchesToShow}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  tabContainer: {
    paddingHorizontal: 15,
    paddingTop: 9,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: colors.writePostSepratorColor,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  activeTabLabel: {
    fontFamily: fonts.RBold,
    color: colors.tabFontColor,
  },
  imageContainer: {
    width: 208,
    height: 226,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.googleColor,
    fontFamily: fonts.RBold,
    textAlign: 'center',
  },
  noDataSubText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.googleColor,
    fontFamily: fonts.RRegular,
    marginTop: 5,
    textAlign: 'center',
  },
});
export default ScoreboardContentScreen;
