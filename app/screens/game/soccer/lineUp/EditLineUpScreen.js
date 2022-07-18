import React, {
  useLayoutEffect,
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  TouchableWithoutFeedback,
  SafeAreaView,
  TextInput,
} from 'react-native';

import Modal from 'react-native-modal';

import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';
import ActivityLoader from '../../../../components/loader/ActivityLoader';

import {
  getGameLineUp,
  createGameLineUp,
  deleteGameLineUp,
} from '../../../../api/Games';
import AuthContext from '../../../../auth/context';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import TCGreenSwitcher from '../../../../components/TCGreenSwitcher';
import TCLabel from '../../../../components/TCLabel';
import TCGradientButton from '../../../../components/TCGradientButton';
import LineUpPlayerView from '../../../../components/game/soccer/home/lineUp/LineUpPlayerView';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import LineUpPlayerMultiSelectionView from '../../../../components/game/soccer/home/lineUp/LineUpPlayerMultiSelectionView';

const moveToData = ['Starting', 'Subs', 'Non-roster'];
export default function EditLineUpScreen({navigation, route}) {
  const actionSheet = useRef();
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [roster, setRoster] = useState([]);
  const [nonRoster, setNonRoster] = useState([]);
  const [starting, setStarting] = useState([]);
  const [subs, setSubs] = useState([]);
  const [selected, setSelected] = useState(1);
  const [selectedMember, setSelectedMember] = useState();
  const [selectedSection, setSelectedSection] = useState();
  const [enabledSection, setEnabledSection] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchNonRoster, setSearchNonRoster] = useState([]);
  const [tempararyNonRoster, setTempararyNonRoster] = useState([]);
  const [tempararyStarting, setTempararyStarting] = useState([]);
  const [tempararySubs, setTempararySubs] = useState([]);
  const [search, setSearch] = useState(false);

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
  const getLineUpOfTeams = (teamID, gameID, loader = true) => {
    setLoading(loader);
    getGameLineUp(teamID, gameID, authContext).then((response) => {
      const nonRosterData = response.payload.non_roster.map((el) => {
        const o = {...el};
        o.modified = false;
        o.selected = false;
        return o;
      });

      const rosterData = response.payload.roster.map((el) => {
        const o = {...el};
        o.modified = false;
        o.selected = false;
        return o;
      });

      setLoading(false);
      setNonRoster(nonRosterData);
      setRoster(rosterData);
      setStarting(
        rosterData.filter(
          (el) => el.role === 'player' && el.lineup === 'starting',
        ),
      );
      setSubs(
        rosterData.filter((el) => el.role === 'player' && el.lineup === 'subs'),
      );
      setSearchNonRoster(nonRosterData);

      setTempararyNonRoster(nonRosterData);
      setTempararyStarting(starting);
      setTempararySubs(subs);
      console.log('roseter api data:: ', JSON.stringify(response.payload));
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => actionSheet.current.show()}>
          <Image
            source={images.vertical3Dot}
            style={styles.navigationRightItem}
          />
        </TouchableOpacity>
      ),
    });
  }, [
    starting,
    subs,
    nonRoster,
    roster,
    enabledSection,
    selected,
    selectedSection,
    selectedMember,
    searchNonRoster,
    tempararyNonRoster,
    tempararyStarting,
    tempararySubs,
  ]);
  const toggleModal = () => {
    console.log('Pressed Toggel::');
    setModalVisible(!isModalVisible);
  };

  const sectionNumber = () => {
    if (starting.some((e) => e.selected === true)) {
      console.log('1');
      return 1;
    }
    if (subs.some((e) => e.selected === true)) {
      console.log('2');
      return 2;
    }
    if (nonRoster.some((e) => e.selected === true)) {
      console.log('3');
      return 3;
    }
    return 0;
  };
  const renderNonRoster = ({item}) => (
    <LineUpPlayerView
      buttonType={'move'}
      userData={item}
      onButtonPress={(bType) => {
        if (bType === 'move') {
          setSelectedSection(3);
          setSelectedPosition();
          setSelectedMember(item);
          toggleModal();
        }
        console.log('ITEM BTYPE::', bType);
        console.log('ITEM PRESSED::', item);
      }}
      OnRowPress={() => {}}
    />
  );
  const renderNonRosterMultiple = ({item}) => (
    <LineUpPlayerMultiSelectionView
      userData={item}
      enable={enabledSection === 1 || enabledSection === 2}
      onButtonPress={(checked) => {
        setEnabledSection(sectionNumber());

        console.log('ENABLED::', enabledSection);
        const tempNonRoster = [...nonRoster];
        const index = nonRoster.findIndex((obj) => obj === item);
        tempNonRoster[index].selected = !checked;
        console.log('ITEM BTYPE::', tempNonRoster[index].selected);
        setNonRoster([...tempNonRoster]);
        setSelectedPosition();
        setEnabledSection(sectionNumber());
      }}
    />
  );
  const renderStarting = ({item}) => (
    <LineUpPlayerView
      buttonType={'move'}
      userData={item}
      onButtonPress={(bType) => {
        if (bType === 'move') {
          setSelectedSection(1);
          setSelectedPosition();
          setSelectedMember(item);
          toggleModal();
        }
      }}
      OnRowPress={(userInfo) => {
        if (userInfo.profile.connected) {
          navigation.push('HomeScreen', {
            uid: userInfo.profile.user_id,
            backButtonVisible: true,
            role: 'user',
            menuBtnVisible: false,
          });
        }
      }}
    />
  );
  const renderStartingMultiple = ({item}) => (
    <LineUpPlayerMultiSelectionView
      userData={item}
      enable={enabledSection === 2 || enabledSection === 3 || false}
      onButtonPress={(checked) => {
        setEnabledSection(sectionNumber());

        const tempRoster = [...roster];
        const tempStarting = [...starting];
        const index = roster.findIndex((obj) => obj === item);
        tempRoster[index].selected = !checked;

        const i = starting.findIndex((obj) => obj === item);
        tempStarting[i].selected = !checked;

        setRoster([...tempRoster]);
        setStarting([...tempStarting]);
        setSelectedPosition();
        setEnabledSection(sectionNumber());
      }}
    />
  );
  const renderSubs = ({item}) => (
    <LineUpPlayerView
      buttonType={'move'}
      userData={item}
      onButtonPress={(bType) => {
        if (bType === 'move') {
          setSelectedSection(2);
          setSelectedPosition();
          setSelectedMember(item);
          toggleModal();
        }
      }}
      OnRowPress={(userInfo) => {
        if (userInfo.profile.connected) {
          navigation.push('HomeScreen', {
            uid: userInfo.profile.user_id,
            backButtonVisible: true,
            role: 'user',
            menuBtnVisible: false,
          });
        }
      }}
    />
  );
  const renderSubsMultiple = ({item}) => (
    <LineUpPlayerMultiSelectionView
      userData={item}
      enable={enabledSection === 1 || enabledSection === 3}
      onButtonPress={(checked) => {
        setEnabledSection(sectionNumber());

        const tempRoster = [...roster];
        const tempSubs = [...subs];
        const index = roster.findIndex((obj) => obj === item);
        tempRoster[index].selected = !checked;

        const i = subs.findIndex((obj) => obj === item);
        tempSubs[i].selected = !checked;

        setRoster([...tempRoster]);
        setSubs([...tempSubs]);
        setSelectedPosition();
        setEnabledSection(sectionNumber());
      }}
    />
  );
  const renderMoveToView = ({item, index}) => (
    <TouchableOpacity
      disabled={
        (selected === 1 && selectedSection === index + 1) ||
        (selected === 2 && enabledSection === index + 1)
      }
      onPress={() => {
        setSelectedPosition(index + 1);
      }}
    >
      {selectedPosition === index + 1 ? (
        <LinearGradient
          colors={[colors.greenGradientStart, colors.greenGradientEnd]}
          style={styles.topViewContainer}
        >
          <Text style={styles.radioText} numberOfLines={1}>
            {item}
          </Text>
          <Image
            source={images.radioSelectGreen}
            style={styles.checkGreenImage}
          />
        </LinearGradient>
      ) : (
        <View
          style={
            (selected === 1 && selectedSection === index + 1) ||
            (selected === 2 && enabledSection === index + 1)
              ? styles.topViewOpacityContainer
              : styles.topViewContainer
          }
        >
          <Text
            style={[styles.radioText, {color: colors.lightBlackColor}]}
            numberOfLines={1}
          >
            {item}
          </Text>
          <Image
            source={images.radioUnSelectGreen}
            style={styles.checkGreenImage}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  const saveButtonPress = () => {
    console.log('This is ok');

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

    const modifiedNonRosterData = nonRoster.filter((e) => e.modified === true);
    const tempNonRosterArray = [];
    // eslint-disable-next-line array-callback-return
    modifiedNonRosterData.map((e) => {
      const body = {};
      body.member_id = e.profile.user_id;
      tempNonRosterArray.push(body);
    });

    if (tempArray.length > 0) {
      if (
        route &&
        route.params &&
        route.params.gameObj &&
        route.params.selectedTeam
      ) {
        setLoading(true);
        createGameLineUp(
          route.params.selectedTeam === 'home'
            ? route.params.gameObj.home_team.group_id
            : route.params.gameObj.away_team.group_id,
          route.params.gameObj.game_id,
          tempArray,
          authContext,
        )
          .then(() => {
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
          })
          .catch((error) => {
            setLoading(false);
            setTimeout(
              () => Alert.alert(strings.alertmessagetitle, `${error}`),
              10,
            );
          });
      }
    } else if (tempNonRosterArray.length > 0) {
      setLoading(true);
      deleteGameLineUp(
        route.params.selectedTeam === 'home'
          ? route.params.gameObj.home_team.group_id
          : route.params.gameObj.away_team.group_id,
        route.params.gameObj.game_id,
        tempNonRosterArray,
        authContext,
      )
        .then(() => {
          setLoading(false);
          navigation.goBack();
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(() => Alert.alert(strings.alertmessagetitle, error), 10);
        });
    } else {
      setLoading(false);
      Alert.alert('Please modify lineup first');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ActivityLoader visible={loading} />
      <View style={styles.mainContainer}>
        {/* <TCSearchBox
          style={{alignSelf: 'center', marginTop: 15}}
          onChangeText={(text) => searchFilterFunction(text)}
        /> */}
        <TCGreenSwitcher
          firstTabText={'Single selection'}
          secondTabText={'Multi Selection'}
          selectedTab={selected}
          onFirstTabPress={() => setSelected(1)}
          onSecondTabPress={() => setSelected(2)}
        />
        {selected === 1 ? (
          <View style={{flex: 1}}>
            <ScrollView>
              <TCLabel title={'Roster'} style={{marginBottom: 15}} />
              <Text
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                  marginLeft: 25,
                }}
              >
                Starting
              </Text>
              {starting.length === 0 ? (
                <Text style={styles.noDataView}>No Player</Text>
              ) : (
                <FlatList
                  data={starting}
                  renderItem={renderStarting}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                />
              )}
              <Text
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                  marginLeft: 25,
                  marginTop: 20,
                }}
              >
                Subs
              </Text>
              {subs.length === 0 ? (
                <Text style={styles.noDataView}>No Player</Text>
              ) : (
                <FlatList
                  data={subs}
                  renderItem={renderSubs}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                />
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',

                  alignItems: 'center',
                }}
              >
                <TCLabel title={'Non-Roster'} style={{height: 50}} />

                {search ? (
                  <View style={{flex: 1, marginLeft: 15, marginRight: 15}}>
                    <TextInput
                      style={{marginLeft: 10, marginRight: 10, height: 30}}
                      value={nonRoster}
                      onChangeText={(text) => {
                        setNonRoster(
                          searchNonRoster.filter(
                            (x) =>
                              x.profile.first_name
                                .toLowerCase()
                                .includes(text.toLowerCase()) ||
                              x.profile.last_name
                                .toLowerCase()
                                .includes(text.toLowerCase()),
                          ),
                        );
                        setSearchNonRoster(
                          searchNonRoster.filter((n) => !roster.includes(n)),
                        );
                        if (text.length <= 0) {
                          setSearch(false);
                        }
                      }}
                    />
                    <View style={{height: 1, backgroundColor: 'gray'}} />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setSearch(true);
                    }}
                  >
                    <Image
                      source={images.searchLocation}
                      style={styles.searchImg}
                    />
                  </TouchableOpacity>
                )}
              </View>
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
                saveButtonPress();
              }}
            />
          </View>
        ) : (
          <View style={{flex: 1}}>
            <ScrollView>
              <TCLabel title={'Roster'} />
              <Text
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                  marginLeft: 25,
                }}
              >
                Starting
              </Text>

              {starting.length === 0 ? (
                <Text style={styles.noDataView}>No Player</Text>
              ) : (
                <FlatList
                  data={starting}
                  renderItem={renderStartingMultiple}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                />
              )}
              {/* <LineUpPlayerMultiSelectionView/> */}
              <Text
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                  marginLeft: 25,
                  marginTop: 20,
                }}
              >
                Subs
              </Text>
              {subs.length === 0 ? (
                <Text style={styles.noDataView}>No Player</Text>
              ) : (
                <FlatList
                  data={subs}
                  renderItem={renderSubsMultiple}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                />
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',

                  alignItems: 'center',
                }}
              >
                <TCLabel title={'Non-Roster'} style={{height: 50}} />

                {search ? (
                  <View style={{flex: 1, marginLeft: 15, marginRight: 15}}>
                    <TextInput
                      style={{marginLeft: 10, marginRight: 10, height: 30}}
                      value={nonRoster}
                      onChangeText={(text) => {
                        setNonRoster(
                          searchNonRoster.filter(
                            (x) =>
                              x.profile.first_name
                                .toLowerCase()
                                .includes(text.toLowerCase()) ||
                              x.profile.last_name
                                .toLowerCase()
                                .includes(text.toLowerCase()),
                          ),
                        );
                        setSearchNonRoster(
                          searchNonRoster.filter((n) => !roster.includes(n)),
                        );
                        if (text.length <= 0) {
                          setSearch(false);
                        }
                      }}
                    />
                    <View style={{height: 1, backgroundColor: 'gray'}} />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setSearch(true);
                    }}
                  >
                    <Image
                      source={images.searchLocation}
                      style={styles.searchImg}
                    />
                  </TouchableOpacity>
                )}
              </View>

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
            <TouchableWithoutFeedback
              onPress={toggleModal}
              disabled={enabledSection === 0}
            >
              <Image
                source={images.moveFlottyButton}
                style={{
                  width: 80,
                  height: 80,
                  resizeMode: 'cover',
                  position: 'absolute',
                  right: 0,
                  bottom: 50,
                }}
              />
            </TouchableWithoutFeedback>
            <TCGradientButton
              title={strings.saveTitle}
              onPress={() => {
                saveButtonPress();
              }}
            />
          </View>
        )}
      </View>
      <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        backdropOpacity={0}
        style={{marginLeft: 0, marginRight: 0, marginBottom: 0}}
      >
        <View style={styles.modelViewContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <Text onPress={toggleModal} style={styles.cancelTitle}>
              Cancel
            </Text>
            <Text style={styles.modelTitle}>Move To</Text>
            <TouchableOpacity
              disabled={
                !(
                  selectedPosition === 1 ||
                  selectedPosition === 2 ||
                  selectedPosition === 3
                )
              }
              onPress={() => {
                toggleModal();
                let temp = [];
                if (selected === 1) {
                  if (selectedSection === 1 || selectedSection === 2) {
                    const tempRoster = [...roster];
                    if (selectedPosition === 3) {
                      const index = tempRoster.findIndex(
                        (obj) => obj === selectedMember,
                      );
                      tempRoster[index].modified = true;
                      tempRoster[index].lineup = undefined;
                      nonRoster.unshift(tempRoster[index]);
                      setNonRoster([...nonRoster]);

                      roster.splice(index, 1);
                      setRoster([...roster]);
                      setStarting(
                        roster.filter((el) => el.lineup === 'starting'),
                      );
                      setSubs(roster.filter((el) => el.lineup === 'subs'));
                    } else {
                      temp = [...roster];
                      const index = temp.findIndex(
                        (obj) => obj === selectedMember,
                      );
                      temp[index].modified = true;
                      temp[index].lineup =
                        (selectedPosition === 1 && 'starting') ||
                        (selectedPosition === 2 && 'subs');
                      setRoster(temp);
                      setStarting(
                        roster.filter((el) => el.lineup === 'starting'),
                      );
                      setSubs(roster.filter((el) => el.lineup === 'subs'));
                    }
                  } else {
                    const tempNonRoster = [...nonRoster];
                    const index = tempNonRoster.findIndex(
                      (obj) => obj === selectedMember,
                    );
                    tempNonRoster[index].modified = true;
                    if (selectedPosition === 1) {
                      tempNonRoster[index].lineup = 'starting';
                    } else if (selectedPosition === 2) {
                      tempNonRoster[index].lineup = 'subs';
                    }
                    roster.unshift(tempNonRoster[index]);
                    setRoster([...roster]);
                    nonRoster.splice(index, 1);
                    setNonRoster([...nonRoster]);

                    setStarting(
                      roster.filter((el) => el.lineup === 'starting'),
                    );
                    setSubs(roster.filter((el) => el.lineup === 'subs'));
                  }
                  console.log('NON', nonRoster);
                  console.log('ROS', roster);
                }
                if (selected === 2) {
                  if (enabledSection === 1 || enabledSection === 2) {
                    if (selectedPosition === 3) {
                      const tempArray = [];
                      // eslint-disable-next-line array-callback-return
                      roster.map((e) => {
                        if (e.selected === true) {
                          e.modified = true;
                          e.selected = false;
                          e.lineup = undefined;
                          nonRoster.unshift(e);
                          tempArray.push(e);
                        }
                      });
                      setNonRoster([...nonRoster]);

                      // eslint-disable-next-line array-callback-return
                      tempArray.map((e) => {
                        const index = roster.findIndex((obj) => obj === e);
                        roster.splice(index, 1);
                      });
                      setRoster([...roster]);
                      setEnabledSection(0);
                      setStarting(
                        roster.filter((el) => el.lineup === 'starting'),
                      );
                      setSubs(roster.filter((el) => el.lineup === 'subs'));
                    } else {
                      // eslint-disable-next-line array-callback-return
                      roster.map((e) => {
                        if (e.selected) {
                          e.modified = true;
                          e.selected = false;
                          e.lineup =
                            (selectedPosition === 1 && 'starting') ||
                            (selectedPosition === 2 && 'subs');
                        }
                      });
                      setEnabledSection(0);
                      setRoster([...roster]);
                      setStarting(
                        roster.filter((el) => el.lineup === 'starting'),
                      );
                      setSubs(roster.filter((el) => el.lineup === 'subs'));
                    }
                  } else {
                    const tempArray = [];
                    // eslint-disable-next-line array-callback-return
                    nonRoster.map((e) => {
                      if (e.selected) {
                        e.modified = true;
                        e.selected = false;
                        e.lineup =
                          (selectedPosition === 1 && 'starting') ||
                          (selectedPosition === 2 && 'subs');
                        roster.unshift(e);
                        tempArray.push(e);
                      }
                    });
                    setRoster([...roster]);
                    // eslint-disable-next-line array-callback-return
                    tempArray.map((e) => {
                      const index = nonRoster.findIndex((obj) => obj === e);
                      nonRoster.splice(index, 1);
                    });
                    setEnabledSection(0);
                    setNonRoster([...nonRoster]);

                    setStarting(
                      roster.filter((el) => el.lineup === 'starting'),
                    );
                    setSubs(roster.filter((el) => el.lineup === 'subs'));
                  }
                  console.log('NON', nonRoster);
                  console.log('ROS', roster);
                }
              }}
            >
              <Text style={styles.doneTitle}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.separatorLine}></View>
          <FlatList
            data={moveToData}
            renderItem={renderMoveToView}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </View>
      </Modal>
      <ActionSheet
        ref={actionSheet}
        // title={'News Feed Post'}
        options={['Clear all starting', 'Clear all subs', 'Cancel']}
        cancelButtonIndex={2}
        // destructiveButtonIndex={1}
        onPress={(index) => {
          if (index === 0) {
            const startingData = starting.map((el) => {
              const o = {...el};
              const i = roster.findIndex((obj) => obj === el);
              roster.splice(i, 1);
              o.modified = true;
              return o;
            });
            setStarting([]);
            setNonRoster([...startingData, ...nonRoster]);
          } else if (index === 1) {
            const subsData = subs.map((el) => {
              const o = {...el};
              const i = roster.findIndex((obj) => obj === el);
              roster.splice(i, 1);
              o.modified = true;
              return o;
            });
            setSubs([]);
            setNonRoster([...subsData, ...nonRoster]);
          }
        }}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 8,
    width: '100%',
  },
  modelTitle: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  doneTitle: {
    marginTop: 20,

    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  cancelTitle: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.medianGrayColor,
  },
  modelViewContainer: {
    width: '100%',
    height: Dimensions.get('window').height / 3.4,

    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    // backgroundColor: 'red',
  },
  topViewContainer: {
    flexDirection: 'row',
    backgroundColor: colors.offwhite,
    height: 40,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 20,
    marginBottom: 5,
    marginTop: 10,

    borderRadius: 5,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  topViewOpacityContainer: {
    flexDirection: 'row',
    backgroundColor: colors.offwhite,
    height: 40,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 20,
    opacity: 0.2,

    marginTop: 10,

    borderRadius: 5,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  radioText: {
    fontSize: 16,
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },

  checkGreenImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  navigationRightItem: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
  noDataView: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.grayColor,
    marginLeft: 35,
    marginTop: 10,
  },
  searchImg: {
    alignSelf: 'center',
    height: 15,
    tintColor: colors.magnifyIconColor,
    resizeMode: 'contain',
    width: 15,
    marginRight: 25,
  },
});
