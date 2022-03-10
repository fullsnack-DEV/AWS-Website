/* eslint-disable no-unused-vars */
import React, {useContext, useEffect, useState, useCallback} from 'react';
import { SafeAreaView, View} from 'react-native';

import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import ScoreboardSportsScreen from './ScoreboardSportsScreen';
import { getScroreboardGameDetails } from '../../api/Games';
// import { useIsFocused } from '@react-navigation/native';

// const entity = {};
export default function EntityScoreboardScreen({navigation, route}) {
  const {uid, isAdmin,} = route?.params ?? {};
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [scoreboardSearchText, setScoreboardSearchText] = useState([]);
  const [scoreboardGameData, setScoreboardGameData] = useState([]);
  const [filterScoreboardGameData, setFilterScoreboardGameData] = useState([]);
  const [refereeMatchModalVisible, setRefereeMatchModalVisible] = useState(
    false,
  );
  const [refereesInModalVisible, setRefereesInModalVisible] = useState(false);

  console.log('currentUserData:=>', isAdmin);
  useEffect(() => {
    setLoading(true)
    getScroreboardGameDetails(uid, authContext)
    .then((res) => {
        setLoading(false)
      console.log('Get Scoreboard Game Details Res :-', res);
      setScoreboardGameData(res.payload);
    })
    .catch((error) => {
        setLoading(false)
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
      <ActivityLoader visible={loading} />
      <View style={{flex: 1}}>
        {/* <TCSearchBox
          onChangeText={onScoreboardSearchTextChange}
          marginTop={20}
          marginBottom={5}
          alignSelf={'center'}
          width={wp('94%')}
          borderRadius={0}
          backgroundColor={colors.grayBackgroundColor}
          height={40}
          shadowOpacity={0}
        /> */}
        <ScoreboardSportsScreen
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
        />
      </View>
    </SafeAreaView>
  );
}
