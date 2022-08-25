import React, {useLayoutEffect, useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import AuthContext from '../../../../auth/context';
import fonts from '../../../../Constants/Fonts';
import TCSearchBox from '../../../../components/TCSearchBox';
import {
  getGameLineUp,
  createGameLineUp,
  deleteGameLineUp,
} from '../../../../api/Games';
import TCLabel from '../../../../components/TCLabel';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import LineUpPlayerView from '../../../../components/game/soccer/home/lineUp/LineUpPlayerView';
import colors from '../../../../Constants/Colors';

export default function EditLineUpCoachScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [nonRoster, setNonRoster] = useState([]);
  const [searchRoster, setSearchRoster] = useState([]);
  const [searchNonRoster, setSearchNonRoster] = useState([]);
  const [roster, setRoster] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.nextButtonStyle}
          onPress={() => {
            setLoading(true);
            console.log('roster Data', roster);
            const modifiedData = roster.filter((e) => e.modified === true);
            const tempArray = [];
            // eslint-disable-next-line array-callback-return
            modifiedData.map((e) => {
              const body = {};
              body.member_id = e.profile.user_id;
              body.role = 'coach';
              tempArray.push(body);
            });
            const modifiedNonRosterData = nonRoster.filter(
              (e) => e.modified === true,
            );
            const tempNonRosterArray = [];
            // eslint-disable-next-line array-callback-return
            modifiedNonRosterData.map((e) => {
              const body = {};
              body.member_id = e.profile.user_id;
              tempNonRosterArray.push(body);
            });
            console.log('Modified Data', modifiedData);

            if (tempArray.length > 0) {
              if (
                route &&
                route.params &&
                route.params.gameObj &&
                route.params.selectedTeam
              ) {
                createGameLineUp(
                  route.params.selectedTeam === 'home'
                    ? route.params.gameObj.home_team.group_id
                    : route.params.gameObj.away_team.group_id,
                  route.params.gameObj.game_id,
                  tempArray,
                  authContext,
                ).then((response) => {
                  console.log('Response:::', response.payload);

                  if (tempNonRosterArray.length > 0) {
                    deleteGameLineUp(
                      route.params.selectedTeam === 'home'
                        ? route.params.gameObj.home_team.group_id
                        : route.params.gameObj.away_team.group_id,
                      route.params.gameObj.game_id,
                      tempNonRosterArray,
                      authContext,
                    ).then(() => {
                      setLoading(false);
                      navigation.goBack();
                    });
                  } else {
                    setLoading(false);
                    navigation.goBack();
                  }
                });
              }
            } else if (tempNonRosterArray.length > 0) {
              deleteGameLineUp(
                route.params.selectedTeam === 'home'
                  ? route.params.gameObj.home_team.group_id
                  : route.params.gameObj.away_team.group_id,
                route.params.gameObj.game_id,
                tempNonRosterArray,
                authContext,
              ).then(() => {
                setLoading(false);
                navigation.goBack();
              });
            } else {
              setLoading(false);
              Alert.alert('Please modify coaches first');
            }
          }}>
          Save
        </Text>
      ),
    });
  }, [navigation, nonRoster, roster]);
  useEffect(() => {
    if (
      route &&
      route.params &&
      route.params.gameObj &&
      route.params.selectedTeam
    ) {
      getLineUpOfTeams(
        route.params.selectedTeam === 'home'
          ? route.params.gameObj.home_team.group_id
          : route.params.gameObj.away_team.group_id,
        route.params.gameObj.game_id,
      );
    }
  }, []);
  const getLineUpOfTeams = (teamID, gameID) => {
    setLoading(true);
    getGameLineUp(teamID, gameID, authContext).then((response) => {
      const nonRosterData = response.payload.non_roster.map((el) => {
        const o = {...el};
        o.modified = false;
        return o;
      });
      const rosterData = response.payload.roster.map((el) => {
        const o = {...el};
        o.modified = false;
        return o;
      });
      setLoading(false);
      setNonRoster(nonRosterData);
      setRoster(rosterData.filter((el) => el.role === 'coach'));
      setSearchRoster([...roster]);
      setSearchNonRoster(nonRosterData);
      console.log('roseter :: ', roster);
      console.log('roseter api data:: ', JSON.stringify(response.payload));
    });
  };
  const renderNonRoster = ({item}) => (
    <LineUpPlayerView
      buttonType={'moveup'}
      userData={item}
      onButtonPress={(bType) => {
        if (bType === 'moveup') {
          const tempNonRoster = [...nonRoster];
          const index = tempNonRoster.findIndex((obj) => obj === item);
          tempNonRoster[index].modified = true;
          tempNonRoster[index].role = 'coach';
          roster.unshift(tempNonRoster[index]);
          nonRoster.splice(index, 1);
          setRoster([...roster]);
          setNonRoster([...nonRoster]);
        }
        console.log('ITEM BTYPE::', bType);
        console.log('ITEM PRESSED::', item);
      }}
    />
  );
  const renderCoches = ({item}) => (
    <LineUpPlayerView
      buttonType={'movedown'}
      userData={item}
      onButtonPress={(bType) => {
        if (bType === 'movedown') {
          const tempCoach = [...roster];
          const index = tempCoach.findIndex((obj) => obj === item);
          tempCoach[index].modified = true;
          nonRoster.unshift(tempCoach[index]);
          roster.splice(index, 1);
          setRoster([...roster]);
          setNonRoster([...nonRoster]);
        }
        console.log('ITEM BTYPE::', bType);
        console.log('ITEM PRESSED::', item);
      }}
    />
  );
  const searchFilterFunction = (text) => {
    const resultRoster = searchRoster.filter(
      (x) =>
        x.profile.first_name.includes(text) ||
        x.profile.last_name.includes(text),
    );
    const resultNonRoster = searchNonRoster.filter(
      (x) =>
        x.profile.first_name.includes(text) ||
        x.profile.last_name.includes(text),
    );
    setRoster(resultRoster);
    setNonRoster(resultNonRoster);
  };
  return (
    <ScrollView>
      <ActivityLoader visible={loading} />
      <View style={styles.mainContainer}>
        <TCSearchBox
          style={{alignSelf: 'center', marginTop: 15}}
          onChangeText={(text) => searchFilterFunction(text)}
        />
        <View>
          <TCLabel title={'Coaches'} />
          {roster.length === 0 ? (
            <Text style={styles.noDataView}>No Coches</Text>
          ) : (
            <FlatList
              data={roster}
              renderItem={renderCoches}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          )}
        </View>
        <View>
          <TCLabel title={'Members'} />
          {nonRoster.length === 0 ? (
            <Text style={styles.noDataView}>No Player</Text>
          ) : (
            <FlatList
              data={nonRoster}
              renderItem={renderNonRoster}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
  noDataView: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.grayColor,
    marginLeft: 35,
    marginTop: 10,
  },
});
