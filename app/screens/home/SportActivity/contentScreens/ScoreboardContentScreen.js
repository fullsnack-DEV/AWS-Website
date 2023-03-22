// @flow
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import {getGameScoreboardEvents, getRefereedMatch} from '../../../../api/Games';
import AuthContext from '../../../../auth/context';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import GameStatus from '../../../../Constants/GameStatus';
import Verbs from '../../../../Constants/Verbs';
import ScoreBoardList from '../components/ScoreBoardList';

const ScoreboardContentScreen = ({
  userData = {},
  sport = '',
  entityType = Verbs.entityTypePlayer,
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

  useEffect(() => {
    if (isFocused) {
      if (entityType === Verbs.entityTypePlayer) {
        getScoreboardList();
      }
      if (entityType === Verbs.entityTypeReferee) {
        getRefereeMatchList();
      }
    }
  }, [isFocused, getScoreboardList, entityType, getRefereeMatchList]);

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
      <ScoreBoardList
        loading={loading}
        matchList={scoreboardList}
        screenType={Verbs.screenTypeMainScreen}
        sectionList={getSectionList()}
        matchCount={getMatchCount()}
      />
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
});
export default ScoreboardContentScreen;
