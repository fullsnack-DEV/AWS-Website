import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  StatusBar, Platform,
} from 'react-native';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import TopBackgroundHeader from '../../../components/game/tennis/home/TopBackgroundHeader';
import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';
import Summary from '../../../components/game/tennis/home/summary/Summary';
import Stats from '../../../components/game/common/stats/Stats';
import Review from '../../../components/game/soccer/home/review/Review';
import Gallery from '../../../components/game/common/gallary/Gallery';
import {
  approveDisapproveGameRecords, getGameData, getGameGallery, getGameMatchRecords, getGameReviews, getGameStats,
} from '../../../api/Games';
import { followUser, unfollowUser } from '../../../api/Users';
import ImageProgress from '../../../components/newsFeed/ImageProgress';
import AuthContext from '../../../auth/context'

const TAB_ITEMS = ['Summary', 'Stats', 'Review', 'Gallery']
const gameIds = [
  '265b7834-6bbf-40cc-8729-372f3b706331', // 0
  '049b0c20-f9c6-473d-aab8-76b2430efa68', // 1
  '0750bda5-942e-4de2-bb65-386aec7cf6c3', // 2
  '13f4cde8-6a90-4236-8cdd-5ede92e94d5b', // 3
]
const globalGameId = gameIds[3];
const TennisHome = ({ navigation, route }) => {
  const authContext = useContext(AuthContext)
  const [tennisGameId] = useState(route?.params?.gameId ?? globalGameId);
  const [currentTab, setCurrentTab] = useState(0);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const [userId, setUserId] = useState(null);
  const [uploadImageProgressData, setUploadImageProgressData] = useState(null);

  useEffect(() => {
    getGameDetails();
  }, []);

  const getGameDetails = () => {
    setLoading(true)
    getTennisGameData(tennisGameId).then(async (res) => {
      if (res.status) {
        const entity = authContext.entity
        setUserRole(entity?.role);
        setUserId(entity?.uid);
        const checkIsAdmin = [res?.payload?.home_team?.user_id, res?.payload?.away_team?.user_id].includes(entity?.uid);
        setIsAdmin(checkIsAdmin)
        setGameData(res.payload);
      }
    }).catch((error) => {
      console.log(error);
    }).finally(() => setLoading(false));
  }

  const getTennisGameData = (gameId = tennisGameId, fetchTeamData = true) => getGameData(gameId, fetchTeamData, authContext);
  const followSoccerUser = (params, userID) => followUser(params, userID, authContext);
  const unFollowSoccerUser = (params, userID) => unfollowUser(params, userID, authContext);
  const getTennisGameMatchRecords = (gameId) => getGameMatchRecords(gameId, authContext);
  const approveDisapproveGameScore = (gameId, teamId, type, params) => approveDisapproveGameRecords(gameId, teamId, type, params, authContext)
  const getTennisGameStats = (gameId) => getGameStats(gameId, authContext)
  const getTennisGameReview = (gameId) => getGameReviews(gameId, authContext)
  const getTennisGalleryData = (gameId) => getGameGallery(gameId, authContext)

  const renderTabContain = (tabKey) => (
    <View style={{ flex: Platform.OS === 'ios' ? 0 : 10 }}>
      {tabKey === 0 && (
        <Summary
            getSoccerGameReview={getTennisGameReview}
            getSoccerGameStats={getTennisGameStats}
            getGameData={getTennisGameData}
            approveDisapproveGameScore={approveDisapproveGameScore}
            getGameMatchRecords={getTennisGameMatchRecords}
            unFollowSoccerUser={unFollowSoccerUser}
            followSoccerUser={followSoccerUser}
            navigation={navigation}
            gameData={gameData}
            isAdmin={isAdmin}
            userRole={userRole}
            userId={userId}
        />
      )}
      {tabKey === 1 && (
        <Stats
            homeTeamName={gameData?.singlePlayerGame
              ? gameData?.home_team?.full_name
              : gameData?.home_team?.group_name}
            awayTeamName={gameData?.singlePlayerGame
              ? gameData?.away_team?.full_name
              : gameData?.away_team?.group_name}
              getGameStatsData={getTennisGameStats}
              gameData={gameData}
          />
      )}
      {tabKey === 2 && <Review navigation={navigation} getSoccerGameReview={getTennisGameReview} isAdmin={isAdmin} gameData={gameData}/>}
      {tabKey === 3 && (
        <Gallery
              setUploadImageProgressData={(uploadImageData) => setUploadImageProgressData(uploadImageData)}
              gameData={gameData}
              getSoccerGalleryData={getTennisGalleryData}
              navigation={navigation}/>
      )}
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
    {uploadImageProgressData && (
      <ImageProgress
            numberOfUploaded={uploadImageProgressData?.doneUploadCount}
            totalUpload={uploadImageProgressData?.totalUploadCount}
            onCancelPress={() => {
              console.log('Cancel Pressed!');
            }}
            postDataItem={uploadImageProgressData?.postData ? uploadImageProgressData?.postData[0] : {}}
        />
    )}
  </View>

  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
})
export default TennisHome;
