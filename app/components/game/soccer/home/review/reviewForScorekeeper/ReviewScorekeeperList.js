import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AuthContext from '../../../../../../auth/context';
import TCSwitcher from '../../../../../TCSwitcher';
import ActivityLoader from '../../../../../loader/ActivityLoader';
import {getGameLineUp, getGameReview} from '../../../../../../api/Games';

import colors from '../../../../../../Constants/Colors';
// import TCMessageButton from '../../../../../TCMessageButton';
import images from '../../../../../../Constants/ImagePath';
import fonts from '../../../../../../Constants/Fonts';

export default function ReviewRefereeList({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState();
  const [selectedTeamTab, setSelectedTeamTab] = useState(1);
  const [gameData] = useState(route?.params?.gameData);

  useEffect(() => {
    if (selectedTeamTab === 1) {
      getLineUpOfTeams(gameData.home_team.group_id, gameData.game_id);
    } else {
      getLineUpOfTeams(gameData.away_team.group_id, gameData.game_id);
    }
  }, []);

  const getGameReviewsData = (item) => {
    setLoading(true);
    getGameReview(gameData?.game_id, gameData?.review_id, authContext)
      .then((response) => {
        navigation.navigate('PlayerReviewScreen', {
          gameReviewData: response.payload,
          gameData,
          userData: item,
          sliderAttributesForPlayer: route?.params?.sliderAttributesForPlayer,
          starAttributesForPlayer: route?.params?.starAttributesForPlayer,
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => Alert.alert('TownsCup', error?.message), 100);
      });
  };

  const getLineUpOfTeams = (teamID, gameID) => {
    setLoading(true);
    getGameLineUp(teamID, gameID, authContext).then((response) => {
      const rosterData = response.payload.roster;
      setLoading(false);

      setPlayers(rosterData.filter((el) => el.role === 'player'));

      console.log(JSON.stringify(response.payload));
    });
  };
  const renderRoster = ({item: userData}) => (
    <TouchableOpacity
      onPress={() => {
        console.log('row pressed');
      }}>
      <View style={styles.topViewContainer}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.profileView}>
            <Image
              source={
                userData.profile.thumbnail
                  ? {uri: userData.profile.thumbnail}
                  : images.profilePlaceHolder
              }
              style={styles.profileImage}
            />
          </View>
          <View style={styles.topTextContainer}>
            <Text
              style={styles.mediumNameText}
              numberOfLines={
                1
              }>{`${userData.profile.first_name} ${userData.profile.last_name}`}</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {`${userData.profile.jersey_number || ''} ${
                userData.profile.positions || ''
              }`}
            </Text>
          </View>
        </View>
        {userData.profile.user_id !== authContext.entity.obj.user_id && (
          <View style={styles.buttonStyle}>
            <TouchableOpacity
              onPress={() => {
                console.log('gameData::=>', gameData);
                if (userData?.review_id) {
                  getGameReviewsData(userData);
                } else {
                  navigation.navigate('RefereeReviewScreen', {
                    gameData,
                    userData,
                    sliderAttributesForReferee:
                      route?.params?.sliderAttributesForReferee,
                    starAttributesForReferee:
                      route?.params?.starAttributesForReferee,
                  });
                }
              }}>
              <LinearGradient
                colors={[colors.yellowColor, colors.themeColor]}
                style={styles.buttonStyle}>
                <Text style={styles.buttonText}>
                  {userData?.review_id ? 'Edit Review' : 'Review'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <TCSwitcher
        tabs={[gameData.home_team.group_name, gameData.away_team.group_name]}
        selectedTab={selectedTeamTab === 1 ? 0 : 1}
        onTabPress={(index) => {
          if (index === 0) {
            setSelectedTeamTab(1);
            // setSelected(1);
            getLineUpOfTeams(gameData.home_team.group_id, gameData.game_id);
          } else {
            setSelectedTeamTab(2);
            // setSelected(2);
            getLineUpOfTeams(gameData.away_team.group_id, gameData.game_id);
          }
        }}
        style={{height: 40}}
      />
      <FlatList
        data={players}
        renderItem={renderRoster}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
  },
  profileImage: {
    alignSelf: 'center',
    height: 36,
    resizeMode: 'cover',
    width: 36,
    borderRadius: 18,
  },

  topViewContainer: {
    flexDirection: 'row',
    backgroundColor: colors.offwhite,
    height: 60,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 5,

    borderRadius: 10,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 38,
    width: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
  },
  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  mediumNameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  locationText: {
    fontSize: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },

  buttonStyle: {
    height: 22,
    width: 75,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: fonts.RBold,
    fontSize: 12,
    color: colors.whiteColor,
  },
});
