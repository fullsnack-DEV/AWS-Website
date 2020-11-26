import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar, Platform,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import TopBackgroundHeader from '../../../components/game/soccer/home/TopBackgroundHeader';
import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';
import Summary from '../../../components/game/soccer/home/summary/Summary';
import Stats from '../../../components/game/soccer/home/stats/Stats';
import Review from '../../../components/game/soccer/home/review/Review';
import Gallery from '../../../components/game/soccer/home/gallary/Gallery';
import {
  approveDisapproveGameRecords, getGameData, getGameMatchRecords, getGameReviews, getGameStats,
} from '../../../api/Games';
import * as Utility from '../../../utils';
import { followUser, unfollowUser } from '../../../api/Users';
import LineUp from '../../../components/game/soccer/home/lineUp/LineUp';

const TAB_ITEMS = ['Summary', 'Line-up', 'Stats', 'Review', 'Gallery']
const gameIds = [
  'f88963d1-6817-48d6-897f-4edb236ca37d', // 0 -
  '6f3b91f5-a1c9-4fb7-94a4-6dfae2217469', // 1 -
  '460adeca-f36e-4cb7-9d97-8928a6f77281', // 2 -
  'daeab9de-0af9-4172-ae3e-9d480794effc', // 3 -
  '6b1dd495-9d68-4a8b-8feb-363406d279ba', // 4 - 19-11-2020 9-00
  '1dd4f109-0a7c-40a3-b616-f0cf055ba61c', // 5 - Admin: Arvind  20-11-2020 6-50
  'fb6e4794-4fdd-4af2-b07a-a109d3f550f7', // 6  Admin: Arvind
  '433bb585-8488-4b9a-86f2-087a424b2855', // 7 - For Review
  '8385c959-ca3a-4471-9fd5-8a3637a5217e', // 8 - For Review
]
const globalGameId = gameIds[8];
const SoccerHome = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const [soccerGameId] = useState(route?.params?.gameId ?? globalGameId);
  const [currentTab, setCurrentTab] = useState(0);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getGameDetails();
  }, [isFocused]);

  const getGameDetails = () => {
    setLoading(true)
    getSoccerGameData(soccerGameId).then(async (res) => {
      if (res.status) {
        const entity = await Utility.getStorage('loggedInEntity');
        setUserRole(entity?.role);
        setUserId(entity?.uid);
        setIsAdmin(res?.payload?.home_team?.am_i_admin ?? false)
        setGameData(res.payload);
      }
    }).catch((error) => {
      console.log(error);
    }).finally(() => setLoading(false));
  }

  const getSoccerGameData = (gameId = soccerGameId, fetchTeamData = true) => getGameData(gameId, fetchTeamData);
  const followSoccerUser = (params, userID) => followUser(params, userID);
  const unFollowSoccerUser = (params, userID) => unfollowUser(params, userID);
  const getSoccerGameMatchRecords = (gameId) => getGameMatchRecords(gameId);
  const approveDisapproveGameScore = (gameId, teamId, type, params) => approveDisapproveGameRecords(gameId, teamId, type, params)
  const getSoccerGameStats = (gameId) => getGameStats(gameId)
  const getSoccerGameReview = (gameId) => getGameReviews(gameId)

  const renderTabContain = (tabKey) => (
    <View style={{ flex: Platform.OS === 'ios' ? 0 : 10 }}>
      {tabKey === 0 && (
        <Summary
            getSoccerGameReview={getSoccerGameReview}
            getSoccerGameStats={getSoccerGameStats}
            getGameData={getSoccerGameData}
            approveDisapproveGameScore={approveDisapproveGameScore}
            getGameMatchRecords={getSoccerGameMatchRecords}
            unFollowSoccerUser={unFollowSoccerUser}
            followSoccerUser={followSoccerUser}
            navigation={navigation}
            gameData={gameData}
            isAdmin={isAdmin}
            userRole={userRole}
            userId={userId}
        />
      )}
      {tabKey === 1 && <LineUp/>}
      {tabKey === 2 && (
        <Stats
              getGameStatsData={getSoccerGameStats}
              gameData={gameData}
          />
      )}
      {tabKey === 3 && <Review getSoccerGameReview={getSoccerGameReview} isAdmin={isAdmin} gameData={gameData}/>}
      {tabKey === 4 && <Gallery/>}
    </View>
  )
  return (<View style={styles.mainContainer}>
    <StatusBar
        style={{ height: 1 }}
        barStyle="light-content"
    />
    <ActivityLoader visible={loading} />
    <TopBackgroundHeader navigation={navigation} gameData={gameData}>
      <TCScrollableProfileTabs
        tabItem={TAB_ITEMS}
        onChangeTab={(ChangeTab) => {
          setCurrentTab(ChangeTab.i)
        }}
        customStyle={{ flex: 1 }}
        currentTab={currentTab}
        renderTabContain={renderTabContain}
    />
    </TopBackgroundHeader>
  </View>

  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
})
export default SoccerHome;
