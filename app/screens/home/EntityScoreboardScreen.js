/* eslint-disable no-unused-vars */
import React, {useContext, useEffect, useState, useCallback} from 'react';
import {SafeAreaView, View} from 'react-native';

import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import ScoreboardSportsScreen from './ScoreboardSportsScreen';
import {getScroreboardGameDetails} from '../../api/Games';
import ScreenHeader from '../../components/ScreenHeader';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import ScoreboardContentScreen from './SportActivity/contentScreens/ScoreboardContentScreen';
// import { useIsFocused } from '@react-navigation/native';

// const entity = {};
export default function EntityScoreboardScreen({navigation, route}) {
  const [uid] = useState(route?.params?.uid);
  const [isAdmin] = useState(route?.params?.isAdmin);

  const authContext = useContext(AuthContext);
  const [userData, setCurrentUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [scoreboardSearchText, setScoreboardSearchText] = useState([]);
  const [scoreboardGameData, setScoreboardGameData] = useState([]);
  const [filterScoreboardGameData, setFilterScoreboardGameData] = useState([]);
  const [refereeMatchModalVisible, setRefereeMatchModalVisible] =
    useState(false);
  const [refereesInModalVisible, setRefereesInModalVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    getScroreboardGameDetails(uid, authContext)
      .then((res) => {
        setLoading(false);
        setScoreboardGameData(res.payload);
      })
      .catch((error) => {
        setLoading(false);
        console.log('error :-', error);
      });
  }, [authContext, uid]);

  const onScoreboardSearchTextChange = useCallback(
    (text) => {
      setScoreboardSearchText(text);
      const result = scoreboardGameData.filter(
        (x) =>
          (x.sport && x.sport.toLowerCase().includes(text.toLowerCase())) ||
          (x.sport && x.sport.toLowerCase().includes(text.toLowerCase())),
      );
      setFilterScoreboardGameData(result);
    },
    [scoreboardGameData],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.scoreboard}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        rightIcon2={images.searchUser}
        containerStyle={{
          paddingHorizontal: 10,
          paddingTop: 6,
          paddingBottom: 14,
        }}
      />
      <ActivityLoader visible={loading} />
      <View style={{flex: 1}}>
        <ScoreboardContentScreen
          userData={route.params.groupData}
          entityType={route.params.entityType}
        />
        {/* <ScoreboardSportsScreen
          sportsData={
            scoreboardSearchText.length > 0
              ? filterScoreboardGameData
              : scoreboardGameData
          }
          navigation={navigation}
          onItemPress={() => {
            setRefereeMatchModalVisible(false);
            setRefereesInModalVisible(false);
          }}
        /> */}
      </View>
    </SafeAreaView>
  );
}
