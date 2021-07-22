import {
 Image, StyleSheet, Text, View,
 } from 'react-native';
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ScoreboardSportsScreen from '../ScoreboardSportsScreen';
import UpcomingMatchScreen from '../UpcomingMatchScreen';
import { getGameScoreboardEvents } from '../../../api/Games';
import AuthContext from '../../../auth/context';
import TCInnerLoader from '../../../components/TCInnerLoader';
import GameStatus from '../../../Constants/GameStatus';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import Header from '../../../components/Home/Header';

export default function UserScoreboardScreen({ route, navigation }) {
  const { uid } = route?.params;
  const authContext = useContext(AuthContext);
  const [scoreboardTabNumber, setScroboardTabNumber] = useState(0);
  const [upcomingMatchData, setUpcomingMatchData] = useState([]);
  const [recentMatchData, setRecentMatchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    setLoading(true);
    const params = {};
    getGameScoreboardEvents(uid, params, authContext)
      .then((res) => {
        const date = new Date().getTime();
        const recentMatch = [];
        const upcomingMatch = [];

        // eslint-disable-next-line array-callback-return
        Array.from(Object.keys(res.payload)).map((sportNameKey) => {
          res.payload[sportNameKey].map((event_item) => {
            const eventStartDate = event_item.start_datetime * 1000;
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
        });

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [authContext, uid]);

  const topRightButton = useMemo(
    () => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => {}}>
          <FastImage
            source={images.messageSearchButton2}
            resizeMode={'contain'}
            style={styles.rightImageStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <FastImage
            source={images.scheduleThreeDot}
            resizeMode={'contain'}
            style={styles.rightImageStyle}
          />
        </TouchableOpacity>
      </View>
    ),
    [],
  );

  return (
    <View style={{ flex: 1 }}>
      <Header
        showBackgroundColor={true}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={images.backArrow}
              style={styles.backImageStyle}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTitleTextStyle}>Scoreboard</Text>
        }
        rightComponent={topRightButton}
      />
      <View style={styles.separateLine} />
      <View style={{ flexDirection: 'row', margin: 15 }}>
        <Text
          style={
            scoreboardTabNumber === 0
              ? styles.activeButton
              : styles.inActiveButton
          }
          onPress={() => setScroboardTabNumber(0)}>
          {`Completed (${recentMatchData?.length ?? 0})`}
        </Text>
        <Text
          style={
            scoreboardTabNumber === 1
              ? styles.activeButton
              : styles.inActiveButton
          }
          onPress={() => setScroboardTabNumber(1)}>
          {`Upcoming (${upcomingMatchData?.length ?? 0})`}
        </Text>
      </View>
      <View style={styles.separateLine} />
      {loading ? (
        <TCInnerLoader visible={loading} />
      ) : (
        <View style={{ flex: 1, marginTop: 15 }}>
          {scoreboardTabNumber === 0 && (
            <ScoreboardSportsScreen
              sportsData={recentMatchData}
              navigation={navigation}
            />
          )}
          {scoreboardTabNumber === 1 && (
            <UpcomingMatchScreen
              sportsData={upcomingMatchData}
              navigation={navigation}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  activeButton: {
    marginRight: 20,
    fontSize: 16,
    fontFamily: fonts.RBlack,
    color: colors.themeColor,
  },
  inActiveButton: {
    marginRight: 20,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  eventTitleTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
  rightImageStyle: {
    height: 25,
    width: 25,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  backImageStyle: {
    tintColor: colors.lightBlackColor,
    height: 20,
    width: 20,
  },
  separateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    width: wp(100),
  },
});
