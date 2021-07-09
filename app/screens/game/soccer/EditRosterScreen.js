import React, {
  useLayoutEffect, useState, useEffect, useContext,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';

import ActivityLoader from '../../../components/loader/ActivityLoader';

import {
  getGameLineUp,
  createGameLineUp,
  deleteGameLineUp,
} from '../../../api/Games';
import AuthContext from '../../../auth/context';

import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCSearchBox from '../../../components/TCSearchBox';
import TCGreenSwitcher from '../../../components/TCGreenSwitcher';
import TCLabel from '../../../components/TCLabel';
import TCGradientButton from '../../../components/TCGradientButton';
import LineUpPlayerView from '../../../components/game/soccer/home/lineUp/LineUpPlayerView';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import LineUpPlayerMultiSelectionView from '../../../components/game/soccer/home/lineUp/LineUpPlayerMultiSelectionView';

export default function EditRosterScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [roster, setRoster] = useState([]);
  const [nonRoster, setNonRoster] = useState([]);
  const [selected, setSelected] = useState(1);
  const [selectedMember, setSelectedMember] = useState();
  const [enabledSection, setEnabledSection] = useState(0);
  const [searchNonRoster, setSearchNonRoster] = useState([]);
  const [searchRoster, setSearchRoster] = useState([]);

  useEffect(() => {
    if (
      route
        && route.params
        && route.params.gameObj
        && route.params.selectedTeam
    ) {
      getLineUpOfTeams(
        route.params.selectedTeam === 'home'
          ? route.params.gameObj.home_team.group_id
          : route.params.gameObj.away_team.group_id,
        route.params.gameObj.game_id,
      );
    }
  }, [route]);
  const getLineUpOfTeams = (teamID, gameID) => {
    setLoading(true);
    getGameLineUp(teamID, gameID, authContext).then((response) => {
      const nonRosterData = response.payload.non_roster.map((el) => {
        const o = { ...el };
        o.modified = false;
        o.selected = false;
        return o;
      });

      const rosterData = response.payload.roster.map((el) => {
        const o = { ...el };
        o.modified = false;
        o.selected = false;
        return o;
      });

      setLoading(false);
      setNonRoster(nonRosterData);
      setRoster(rosterData);
      setSearchRoster(rosterData);
      setSearchNonRoster(nonRosterData);
      console.log('roseter api data:: ', JSON.stringify(response.payload));
    }).catch((e) => {
      setLoading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
  };

  useLayoutEffect(() => {

  }, [nonRoster, roster, enabledSection, selected, selectedMember]);

  const sectionNumber = () => {
    if (roster.some((e) => e.selected === true)) {
      console.log('1');
      return 1;
    }
    if (nonRoster.some((e) => e.selected === true)) {
      console.log('3');
      return 3;
    }
    return 0;
  };
  //   if (selectedSection === 1) {
  //     const tempRoster = [...roster];

  //     const index = tempRoster.findIndex(
  //       (obj) => obj === selectedMember,
  //     );
  //     tempRoster[index].modified = true;
  //     tempRoster[index].lineup = undefined;
  //     nonRoster.unshift(tempRoster[index]);
  //     setNonRoster([...nonRoster]);
  //     roster.splice(index, 1);
  //     setRoster([...roster]);
  //   } else {
  //     const tempNonRoster = [...nonRoster];
  //     const index = tempNonRoster.findIndex(
  //       (obj) => obj === selectedMember,
  //     );
  //     tempNonRoster[index].modified = true;
  //     tempNonRoster[index].lineup = 'subs';
  //     roster.unshift(tempNonRoster[index]);
  //     setRoster([...roster]);
  //     nonRoster.splice(index, 1);
  //     setNonRoster([...nonRoster]);
  //   }
  const renderNonRoster = ({ item }) => (
    <LineUpPlayerView
        buttonType={'moveup'}
        userData={item}
        onButtonPress={(bType) => {
          if (bType === 'moveup') {
            setSelectedMember(item);
            const index = nonRoster.findIndex(
              (obj) => obj === item,
            );
            console.log('ITEM INDEX::', index);
            const tempNonRoster = item
            tempNonRoster.modified = true;
            tempNonRoster.lineup = 'subs';
            roster.unshift(tempNonRoster);
            setRoster([...roster]);
            nonRoster.splice(index, 1);
            setNonRoster([...nonRoster]);
          }
          console.log('ITEM BTYPE::', bType);
          console.log('ITEM PRESSED::', item);
        }}
      />
  );
  const renderNonRosterMultiple = ({ item }) => (
    <LineUpPlayerMultiSelectionView
        userData={item}
        enable={enabledSection === 1 }
        onButtonPress={(checked) => {
          setEnabledSection(sectionNumber());
          const tempNonRoster = [...nonRoster];
          const index = nonRoster.findIndex((obj) => obj === item);
          tempNonRoster[index].selected = !checked;
          console.log('ITEM BTYPE::', tempNonRoster[index].selected);
          setNonRoster([...tempNonRoster]);
          setEnabledSection(sectionNumber());
        }}
      />
  );
  const renderRoster = ({ item }) => (
    <LineUpPlayerView
        buttonType={'movedown'}
        userData={item}
        onButtonPress={(bType) => {
          if (bType === 'movedown') {
            setSelectedMember(item);
            const index = roster.findIndex(
              (obj) => obj === item,
            );
            const tempRoster = item
            tempRoster.modified = true;
            tempRoster.lineup = undefined;
            nonRoster.unshift(tempRoster);
            setNonRoster([...nonRoster]);
            roster.splice(index, 1);
            setRoster([...roster]);
          }
          console.log('ITEM BTYPE::', bType);
          console.log('ITEM PRESSED::', item);
        }}
      />
  );
  const renderRosterMultiple = ({ item }) => (
    <LineUpPlayerMultiSelectionView
        userData={item}
        enable={enabledSection === 3 || false}
        onButtonPress={(checked) => {
          setEnabledSection(sectionNumber());

          console.log('ENABLED::', enabledSection);
          const tempRoster = [...roster];
          const index = roster.findIndex((obj) => obj === item);
          console.log('FIRST VALUE:: ', tempRoster[index].selected);
          tempRoster[index].selected = !checked;
          console.log('LAST VALUE:: ', tempRoster[index]);
          setRoster([...tempRoster]);

          setEnabledSection(sectionNumber());
        }}
      />
  );

  //   const renderMoveToView = ({ item, index }) => (
  //     <TouchableOpacity
  //         disabled={(selected === 1 && selectedSection === index + 1) || (selected === 2 && enabledSection === index + 1)}
  //         onPress={() => {
  //           setSelectedPosition(index + 1);
  //         }}>
  //       {selectedPosition === index + 1 ? (
  //         <LinearGradient
  //             colors={[colors.greenGradientStart, colors.greenGradientEnd]}
  //             style={styles.topViewContainer}>
  //           <Text style={styles.radioText} numberOfLines={1}>
  //             {item}
  //           </Text>
  //           <Image
  //               source={images.radioSelectGreen}
  //               style={styles.checkGreenImage}
  //             />
  //         </LinearGradient>
  //       ) : (
  //         <View
  //             style={
  //               (selected === 1 && selectedSection === index + 1) || (selected === 2 && enabledSection === index + 1)
  //                 ? styles.topViewOpacityContainer
  //                 : styles.topViewContainer
  //             }>
  //           <Text
  //               style={[styles.radioText, { color: colors.lightBlackColor }]}
  //               numberOfLines={1}>
  //             {item}
  //           </Text>
  //           <Image
  //               source={images.radioUnSelectGreen}
  //               style={styles.checkGreenImage}
  //             />
  //         </View>
  //       )}
  //     </TouchableOpacity>
  //   );

  const saveButtonPress = () => {
    setLoading(true);
    const modifiedData = roster.filter((e) => e.modified === true);
    const tempArray = [];
    // eslint-disable-next-line array-callback-return
    modifiedData.map((e) => {
      const body = {};
      body.lineup = e.lineup;
      body.member_id = e.profile.user_id;
      body.role = 'player';
      tempArray.push(body);
    });
    console.log('tempArray Object', tempArray);

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
    console.log('tempNonRosterArray Object', tempNonRosterArray);

    if (tempArray.length > 0) {
      if (
        route
          && route.params
          && route.params.gameObj
          && route.params.selectedTeam
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
        }).catch((error) => {
          setLoading(false)
          setTimeout(() => Alert.alert(strings.alertmessagetitle, error), 10)
        });
      }
    } else if (tempNonRosterArray.length > 0) {
      deleteGameLineUp(
        route.params.selectedTeam === 'home'
          ? route.params.gameObj.home_team.group_id
          : route.params.gameObj.away_team.group_id,
        route.params.gameObj.game_id,
        tempNonRosterArray,
      ).then(() => {
        setLoading(false);
        navigation.goBack();
      }).catch((error) => {
          setLoading(false)
          setTimeout(() => Alert.alert(strings.alertmessagetitle, error), 10)
        });
    } else {
      setLoading(false);
      Alert.alert('Please modify lineup first');
    }
  }

  const searchFilterFunction = (text) => {
    const resultRoster = searchRoster.filter(
      (x) => x.profile.first_name.includes(text) || x.profile.last_name.includes(text),
    );

    const resultNonRoster = searchNonRoster.filter(
      (x) => x.profile.first_name.includes(text) || x.profile.last_name.includes(text),
    );
    setRoster(resultRoster);
    setNonRoster(resultNonRoster);
  };
  return (
    <View style={{ flex: 1 }}>
      <ActivityLoader visible={loading} />
      <View style={styles.mainContainer}>
        <TCSearchBox
          style={{ alignSelf: 'center', marginTop: 15 }}
          onChangeText={ (text) => searchFilterFunction(text) }/>
        <TCGreenSwitcher
            firstTabText={'Single selection'}
            secondTabText={'Multi Selection'}
            selectedTab={selected}
            onFirstTabPress={() => setSelected(1)}
            onSecondTabPress={() => setSelected(2)}
          />
        {selected === 1 ? (
          <View style={{ flex: 1 }}>
            <ScrollView>
              <TCLabel title={'Roster'} />

              {roster.length === 0 ? (
                <Text style={styles.noDataView}>No Player</Text>
              ) : (
                <FlatList
                  data={roster}
                  renderItem={renderRoster}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                />
              )}

              <TCLabel title={'Non-Roster'} />
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
            </ScrollView>
            <TCGradientButton
              title={strings.saveTitle}
              onPress={() => {
                saveButtonPress()
              }}
            />

          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <ScrollView>
              <TCLabel title={'Roster'} />

              {roster.length === 0 ? (
                <Text style={styles.noDataView}>No Player</Text>
              ) : (
                <FlatList
                  data={roster}
                  renderItem={renderRosterMultiple}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                />
              )}

              <TCLabel title={'Non-Roster'} />
              {nonRoster.length === 0 ? (
                <Text style={styles.noDataView}>No Player</Text>
              ) : (
                <FlatList
                  data={nonRoster}
                  renderItem={renderNonRosterMultiple}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                />
              )}
            </ScrollView>
            <TouchableOpacity onPress={() => {
              if (enabledSection === 1) {
                const tempArray = [];
                // eslint-disable-next-line array-callback-return
                roster.map((e) => {
                  if (e.selected === true) {
                    e.modified = true;
                    e.selected = false;
                    e.lineup = undefined;
                    nonRoster.unshift(e);
                    tempArray.push(e)
                  }
                })
                setNonRoster([...nonRoster]);
                // eslint-disable-next-line array-callback-return
                tempArray.map((e) => {
                  const index = roster.findIndex(
                    (obj) => obj === e,
                  );
                  roster.splice(index, 1);
                })
                setRoster([...roster]);
                setEnabledSection(0)
              } else {
                const tempArray = [];
                // eslint-disable-next-line array-callback-return
                nonRoster.map((e) => {
                  if (e.selected) {
                    e.modified = true;
                    e.selected = false;
                    e.lineup = 'subs';
                    roster.unshift(e);
                    tempArray.push(e)
                  }
                })
                setRoster([...roster]);
                // eslint-disable-next-line array-callback-return
                tempArray.map((e) => {
                  const index = nonRoster.findIndex(
                    (obj) => obj === e,
                  );
                  nonRoster.splice(index, 1);
                })
                setEnabledSection(0)
                setNonRoster([...nonRoster]);
              }
            }} disabled={enabledSection === 0}>
              <Image
              source={images.moveFlottyButton}
              style={{
                width: 80,
                height: 80,
                resizeMode: 'cover',
                position: 'absolute',
                right: 0,
                bottom: 0,

              }}
            />
            </TouchableOpacity>
            <TCGradientButton
              title={strings.saveTitle}
              onPress={() => {
                saveButtonPress()
              }}
            />
          </View>
        )}
      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  noDataView: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.grayColor,
    marginLeft: 35,
    marginTop: 10,
  },
});
