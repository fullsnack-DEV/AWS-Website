import { View } from 'react-native';
import React, {
 memo, useContext, useEffect, useState,
} from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ScheduleTabView from '../../../../components/Home/ScheduleTabView';
import ScoreboardSportsScreen from '../../ScoreboardSportsScreen';
import UpcomingMatchScreen from '../../UpcomingMatchScreen';
import { getGameScoreboardEvents } from '../../../../api/Games';
import AuthContext from '../../../../auth/context';
import TCInnerLoader from '../../../../components/TCInnerLoader';
import GameStatus from '../../../../Constants/GameStatus';

const PlayInScoreboardView = ({
  sportName,
  navigation,
  closePlayInModal = () => {},
  openPlayInModal = () => {},
}) => {
  const authContext = useContext(AuthContext);
  const [scoreboardTabNumber, setScroboardTabNumber] = useState(0);
  const [upcomingMatchData, setUpcomingMatchData] = useState([]);
  const [recentMatchData, setRecentMatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const entity = authContext?.entity;
    const params = {
      sport: sportName,
      role: 'player',
    };
    getGameScoreboardEvents(entity.uid || entity.auth.user_id, params, authContext).then((res) => {
      const date = new Date().getTime();
      const recentMatch = [];
      const upcomingMatch = [];
      res.payload.map((event_item) => {
        const eventStartDate = event_item.start_datetime * 1000
        const isFutureDate = eventStartDate > date;
        const isGameEnded = event_item?.status === GameStatus.ended;
        if (isGameEnded) {
          recentMatch.push(event_item);
          setRecentMatchData([...recentMatch]);
        } else if (isFutureDate && !isGameEnded) {
          upcomingMatch.push(event_item);
          setUpcomingMatchData([...upcomingMatch]);
        }
        return null;
      });
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [authContext, sportName]);

  return (
    <View style={{ flex: 1 }}>
      <ScheduleTabView
            firstTabTitle={`Completed (${recentMatchData?.length ?? 0})`}
            secondTabTitle={`Upcoming (${upcomingMatchData?.length ?? 0})`}
            indexCounter={scoreboardTabNumber}
            eventPrivacyContianer={{ width: wp('70%') }}
            onFirstTabPress={() => setScroboardTabNumber(0)}
            onSecondTabPress={() => setScroboardTabNumber(1)}
        />
      {loading ? (
        <TCInnerLoader visible={loading}/>
      ) : (
        <>
          {scoreboardTabNumber === 0 && <ScoreboardSportsScreen
                sportsData={recentMatchData}
                navigation={navigation}
                onItemPress={closePlayInModal}
                onBackPress={openPlayInModal}
            />}
          {scoreboardTabNumber === 1 && <UpcomingMatchScreen
                onBackPress={openPlayInModal}
                sportsData={upcomingMatchData}
                navigation={navigation}
                onItemPress={closePlayInModal}
            />}
        </>
      )}
    </View>
  )
}

export default memo(PlayInScoreboardView);
