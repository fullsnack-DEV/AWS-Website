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
import Stats from '../../../components/game/soccer/home/stats/Stats';
import Review from '../../../components/game/soccer/home/review/Review';
import Gallery from '../../../components/game/soccer/home/gallary/Gallery';
import {
  approveDisapproveGameRecords, getGameData, getGameGallery, getGameMatchRecords, getGameReviews, getGameStats,
} from '../../../api/Games';
import { followUser, unfollowUser } from '../../../api/Users';
import LineUp from '../../../components/game/soccer/home/lineUp/LineUp';
import ImageProgress from '../../../components/newsFeed/ImageProgress';
import AuthContext from '../../../auth/context'

const TAB_ITEMS = ['Summary', 'Line-up', 'Stats', 'Review', 'Gallery']
const gameIds = [
  '265b7834-6bbf-40cc-8729-372f3b706331', // 0
  '049b0c20-f9c6-473d-aab8-76b2430efa68', // 1
  '0750bda5-942e-4de2-bb65-386aec7cf6c3', // 2
  '13f4cde8-6a90-4236-8cdd-5ede92e94d5b', // 3
]
const globalGameId = gameIds[0];
const TennisHome = ({ navigation, route }) => {
  const authContext = useContext(AuthContext)
  const [soccerGameId] = useState(route?.params?.gameId ?? globalGameId);
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
    getSoccerGameData(soccerGameId).then(async (res) => {
      if (res.status) {
        const entity = authContext.entity
        setUserRole(entity?.role);
        setUserId(entity?.uid);
        const checkIsAdmin = res?.payload?.home_team?.am_i_admin || res?.payload?.away_team?.am_i_admin;
        setIsAdmin(checkIsAdmin)
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
  const getSoccerGalleryData = (gameId) => getGameGallery(gameId)

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
            isAdmin={true}
            userRole={userRole}
            userId={userId}
        />
      )}
      {tabKey === 1 && <LineUp navigation={navigation} gameData={gameData}/>}
      {tabKey === 2 && (
        <Stats
              getGameStatsData={getSoccerGameStats}
              gameData={gameData}
          />
      )}
      {tabKey === 3 && <Review navigation={navigation} getSoccerGameReview={getSoccerGameReview} isAdmin={isAdmin} gameData={gameData}/>}
      {tabKey === 4 && (
        <Gallery
              setUploadImageProgressData={(uploadImageData) => setUploadImageProgressData(uploadImageData)}
              gameData={gameData}
              getSoccerGalleryData={getSoccerGalleryData}
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
