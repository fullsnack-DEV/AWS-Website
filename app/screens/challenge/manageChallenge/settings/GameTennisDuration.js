/* eslint-disable guard-for-in */
/* eslint-disable array-callback-return */
import React, {useState, useLayoutEffect, useContext, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import Modal from 'react-native-modal';
import {format} from 'react-string-format';
import AuthContext from '../../../../auth/context';
import {patchPlayer} from '../../../../api/Users';
import {patchGroup} from '../../../../api/Groups';
import * as Utility from '../../../../utils';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import TCTextInputClear from '../../../../components/TCTextInputClear';
import images from '../../../../Constants/ImagePath';
import TCThinDivider from '../../../../components/TCThinDivider';

const NUMBER_OF_SET = 20;
const NUMBER_OF_GAME = 20;
const PLAY_TIE = 20;
const WIN_POINT = 99;
const MATCH_DURATION = 99;

const numberOfSet = [];
const numberOfGame = [];
let playTie = [];
const winPoint = [];
const matchDuration = [];

export default function GameTennisDuration({navigation, route}) {
  const [comeFrom] = useState(route?.params?.comeFrom);
  const [sportName] = useState(route?.params?.sportName);
  const [sportType] = useState(route?.params?.sportType);
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [visibleWinMatchModal, setVisibleWinMatchModal] = useState(false);
  const [visibleWinSetModal, setVisibleWinSetModal] = useState(false);
  const [visiblePlayTieModal, setVisiblePlayTieModal] = useState(false);
  const [visibleWinPointModal, setVisibleWinPointModal] = useState(false);
  const [visibleMatchDurationModal, setVisibleMatchDurationModal] =
    useState(false);

  const [matchSetting, setMatchSetting] = useState(
    route?.params?.settingObj && route?.params?.settingObj?.score_rules
      ? route?.params?.settingObj.score_rules
      : {
          total_sets: 3,
          total_available_games_in_set: 5,
          game_count_to_win_set: 3,
          win_set_by_two_games: true,
          apply_tiebreaker_in_game: false,
          tiebreaker_apply_at: 6,
          winning_point_in_tiebreaker: 7,
          win_two_points_in_tiebreaker: true,
          match_duration: '2h 00m',
          winning_point_in_game: 4,
          win_game_by_two_points: true,
          details: '',
        },
  );

  useEffect(() => {
    for (let i = 1; i <= NUMBER_OF_SET; i++) {
      if (i % 2 !== 0) {
        numberOfSet.push(i);
      }
    }
    for (let i = 1; i <= NUMBER_OF_GAME; i++) {
      if (i % 2 !== 0) {
        numberOfGame.push(i);
      }
    }
    playTie = [];
    for (
      let i = (matchSetting.total_available_games_in_set + 1) / 2;
      i <= PLAY_TIE;
      i++
    ) {
      // PLAY_TIE
      playTie.push(i);
    }
    for (let i = 1; i <= WIN_POINT; i++) {
      winPoint.push(i);
    }
    for (let i = 0; i <= MATCH_DURATION; i++) {
      if (i === 0) {
        matchDuration.push('0h 00m');
        matchDuration.push('0h 30m');
      } else {
        matchDuration.push(`${i}h 00m`);
        matchDuration.push(`${i}h 30m`);
      }
    }
  }, [matchSetting.total_available_games_in_set]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => {
            if (
              comeFrom === 'InviteChallengeScreen' ||
              comeFrom === 'EditChallenge'
            ) {
              navigation.navigate(comeFrom, {
                tennisMatchDuration: matchSetting,
              });
            } else if (authContext.entity.role === 'team') {
              saveTeam();
            } else {
              saveUser();
            }
          }}>
          {strings.save}
        </Text>
      ),
    });
  }, [comeFrom, navigation, matchSetting]);

  const saveUser = () => {
    if (sportType === 'single' && comeFrom === 'IncomingChallengeSettings') {
      navigation.navigate(comeFrom, {
        settingObj: {
          score_rules: {
            ...matchSetting,
            winning_point_in_game: 4,
            win_game_by_two_points: true,
            // apply_duece_in_set: true,
            // apply_duece_in_tiebreaker: true,
          },
        },
        sportType,
        sportName,
      });
    } else {
      const bodyParams = {
        sport: sportName,
        sport_type: sportType,
        entity_type: 'player',
        score_rules: {
          ...matchSetting,
          winning_point_in_game: 4,
          win_game_by_two_points: true,
          // apply_duece_in_set: true,
          // apply_duece_in_tiebreaker: true,
        },
      };

      setloading(true);
      const registerdPlayerData =
        authContext?.entity?.obj?.registered_sports?.filter((obj) => {
          if (obj.sport === sportName && obj.sport_type === sportType) {
            return null;
          }
          return obj;
        });

      let selectedSport = authContext?.entity?.obj?.registered_sports?.filter(
        (obj) => obj?.sport === sportName && obj?.sport_type === sportType,
      )[0];

      selectedSport = {
        ...selectedSport,
        setting: {...selectedSport?.setting, ...bodyParams},
      };
      registerdPlayerData.push(selectedSport);

      const body = {
        registered_sports: registerdPlayerData,
      };

      patchPlayer(body, authContext)
        .then(async (response) => {
          if (response.status === true) {
            setloading(false);
            const entity = authContext.entity;

            entity.auth.user = response.payload;
            entity.obj = response.payload;
            authContext.setEntity({...entity});
            authContext.setUser(response.payload);
            await Utility.setStorage('authContextUser', response.payload);
            await Utility.setStorage('authContextEntity', {...entity});
            navigation.navigate(comeFrom, {
              settingObj: response.payload.registered_sports.filter(
                (obj) =>
                  obj.sport === sportName && obj.sport_type === sportType,
              )[0].setting,
            });
          } else {
            Alert.alert(strings.appName, response.messages);
          }

          setloading(false);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  const saveTeam = () => {
    const bodyParams = {
      sport: sportName,
      sport_type: sportType,
      entity_type: 'team',
      score_rules: {
        ...matchSetting,
        winning_point_in_game: 4,
        win_game_by_two_points: true,
      },
    };

    setloading(true);
    const selectedTeam = authContext?.entity?.obj;
    selectedTeam.setting = {...selectedTeam.setting};
    const body = {...bodyParams};

    patchGroup(authContext.entity.uid, body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          const entity = authContext.entity;
          entity.obj = response.payload;
          authContext.setEntity({...entity});

          await Utility.setStorage('authContextEntity', {...entity});
          navigation.navigate(comeFrom, {
            settingObj: response.payload.setting,
          });
        } else {
          Alert.alert(strings.appName, response.messages);
        }
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const renderNumbersOfSets = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setMatchSetting({
          ...matchSetting,
          total_sets: item,
        });
        setVisibleWinMatchModal(false);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>
          {format(
            strings.bestOfSets,
            item,
            item === 1 ? strings.set : strings.sets,
          )}
        </Text>
        <View>
          {matchSetting.total_sets === item ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNumbersOfGames = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setMatchSetting({
          ...matchSetting,
          total_available_games_in_set: item,
          game_count_to_win_set: (item + 1) / 2,
        });
        setVisibleWinSetModal(false);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>
          Best of {item} {item === 1 ? 'game' : 'games'}
        </Text>
        <View>
          {matchSetting.total_available_games_in_set === item ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPlayTie = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setMatchSetting({
          ...matchSetting,
          tiebreaker_apply_at: item,
        });
        setVisiblePlayTieModal(false);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>
          {item} : {item}
        </Text>
        <View>
          {matchSetting.tiebreaker_apply_at === item ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderWinPoint = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setMatchSetting({
          ...matchSetting,
          winning_point_in_tiebreaker: item,
        });
        setVisibleWinPointModal(false);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item}</Text>
        <View>
          {matchSetting.winning_point_in_tiebreaker === item ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMatchDuration = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setMatchSetting({
          ...matchSetting,
          match_duration: item,
        });
        setVisibleMatchDurationModal(false);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item}</Text>
        <View>
          {matchSetting.match_duration === item ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <TCKeyboardView>
      <SafeAreaView>
        <ActivityLoader visible={loading} />

        <View>
          <Text
            style={{
              marginLeft: 15,
              marginTop: 20,
              marginBottom: 10,
              color: colors.lightBlackColor,
              fontSize: 16,
              textAlign: 'left',
              fontFamily: fonts.RBold,
            }}>
            {'NUMBER OF SETS'}
            <Text style={{color: colors.darkThemeColor}}> *</Text>
          </Text>
          <TouchableOpacity
            style={styles.setContainer}
            onPress={() => setVisibleWinMatchModal(true)}>
            <Text style={styles.itemView}>
              Best of {matchSetting?.total_sets}{' '}
              {matchSetting?.total_sets === 1 ? 'set' : 'sets'}
            </Text>
            <Image
              source={images.dropDownArrow}
              style={styles.downArrowImage}
            />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 15,
              marginTop: 20,
              marginBottom: 10,
              color: colors.lightBlackColor,
              fontSize: 16,
              textAlign: 'left',
              fontFamily: fonts.RBold,
            }}>
            {'NUMBER OF GAMES IN A SET'}
            <Text style={{color: colors.darkThemeColor}}> *</Text>
          </Text>

          <TouchableOpacity
            style={styles.setContainer}
            onPress={() => setVisibleWinSetModal(true)}>
            <Text style={styles.itemView}>
              Best of {matchSetting.total_available_games_in_set}{' '}
              {matchSetting.total_available_games_in_set === 1
                ? 'game'
                : 'games'}
            </Text>
            <Image
              source={images.dropDownArrow}
              style={styles.downArrowImage}
            />
          </TouchableOpacity>
          <View
            style={{
              justifyContent: 'center',
              marginBottom: 5,
              marginTop: 10,
            }}>
            <TouchableOpacity
              style={styles.checkBoxContainer}
              onPress={() => {
                setMatchSetting({
                  ...matchSetting,
                  win_set_by_two_games: !matchSetting.win_set_by_two_games,
                  apply_tiebreaker_in_game:
                    !matchSetting.apply_tiebreaker_in_game,
                  win_two_points_in_tiebreaker:
                    !matchSetting.win_two_points_in_tiebreaker,
                });
              }}>
              <Image
                source={
                  matchSetting.win_set_by_two_games
                    ? images.orangeCheckBox
                    : images.uncheckBox
                }
                style={styles.checkboxImg}
              />

              <Text style={styles.minText}>
                A{' '}
                <Text style={styles.minText}>
                  {authContext.entity.role === 'team' ? 'team' : 'player'}
                </Text>{' '}
                must win a set by two games
              </Text>
            </TouchableOpacity>
          </View>

          {matchSetting.win_set_by_two_games && (
            <View
              style={{
                justifyContent: 'center',
                marginBottom: 5,
                marginTop: 10,
              }}>
              <TouchableOpacity
                style={styles.checkBoxContainer}
                onPress={() => {
                  setMatchSetting({
                    ...matchSetting,
                    apply_tiebreaker_in_game:
                      !matchSetting.apply_tiebreaker_in_game,
                  });
                }}>
                <Image
                  source={
                    matchSetting.apply_tiebreaker_in_game
                      ? images.orangeCheckBox
                      : images.uncheckBox
                  }
                  style={styles.checkboxImg}
                />

                <Text style={styles.minText}>{'Apply tie-breaker'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {matchSetting.apply_tiebreaker_in_game && (
            <View>
              <View style={styles.playTieContainer}>
                <Text style={styles.playTieStyle}>
                  Play tie-breaker after the game scores are
                </Text>
                <TouchableOpacity
                  style={[styles.setContainer, {flex: 0.5}]}
                  onPress={() => setVisiblePlayTieModal(true)}>
                  <Text style={styles.itemView}>
                    {matchSetting.tiebreaker_apply_at} :{' '}
                    {matchSetting.tiebreaker_apply_at}
                  </Text>

                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrowImage}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.playTieContainer}>
                <Text style={styles.playTieStyle}>
                  Winning points in tie-breaker
                </Text>
                <TouchableOpacity
                  style={[styles.setContainer, {flex: 0.5}]}
                  onPress={() => setVisibleWinPointModal(true)}>
                  <Text style={styles.itemView}>
                    {matchSetting.winning_point_in_tiebreaker}
                  </Text>

                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrowImage}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.playerWinContainer}
                onPress={() => {
                  setMatchSetting({
                    ...matchSetting,
                    win_two_points_in_tiebreaker:
                      !matchSetting.win_two_points_in_tiebreaker,
                  });
                }}>
                <Image
                  source={
                    matchSetting.win_two_points_in_tiebreaker
                      ? images.orangeCheckBox
                      : images.uncheckBox
                  }
                  style={styles.checkboxImg}
                />
                <Text style={styles.minText}>
                  {'A player must win a set by two games in tie-breaker'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* <Text
            style={{
              marginLeft: 15,
              marginTop: 20,
              color: colors.lightBlackColor,
              fontSize: 16,
              textAlign: 'left',
              fontFamily: fonts.RBold,
            }}>
            {'NUMBER OF POINTS TO WIN A GAME'}
          </Text>

          <TouchableOpacity
            style={styles.setContainer}
            onPress={() => setVisibleWinGameModal(true)}>
            <Text style={styles.itemView}> {selection || '-'}</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.itemView}>{'Referee(s)'}</Text>
              <Image
                source={images.dropDownArrow}
                style={styles.downArrowImage}
              />
            </View>
          </TouchableOpacity> */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
              marginBottom: 10,
            }}>
            <Text
              style={{
                marginLeft: 15,

                color: colors.lightBlackColor,
                fontSize: 16,
                textAlign: 'left',
                fontFamily: fonts.RBold,
              }}>
              {'MAXIMUM MATCH DURATION'}
              <Text style={{color: colors.darkThemeColor}}> *</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                setToolTipVisible(true);
              }}>
              <Image
                source={images.infoToolTipIcon}
                style={styles.toolTipStyle}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.setContainer}
            onPress={() => setVisibleMatchDurationModal(true)}>
            <Text style={styles.itemView}>{matchSetting.match_duration}</Text>

            <Image
              source={images.dropDownArrow}
              style={styles.downArrowImage}
            />
          </TouchableOpacity>

          <Text
            style={{
              marginLeft: 15,
              marginTop: 20,
              color: colors.lightBlackColor,
              fontSize: 16,
              textAlign: 'left',
              fontFamily: fonts.RBold,
            }}>
            {'DETAILS'}
          </Text>
          <TCTextInputClear
            placeholder={
              'Write down the details about sets, games, points, tiebreakers and the maximum match duration'
            }
            onChangeText={(text) => {
              setMatchSetting({
                ...matchSetting,
                details: text,
              });
            }}
            value={matchSetting.details}
            onPressClear={() => {
              setMatchSetting({
                ...matchSetting,
                details: '',
              });
            }}
            multiline={true}
          />
        </View>

        <Modal
          isVisible={visibleWinMatchModal}
          onBackdropPress={() => setVisibleWinMatchModal(false)}
          onRequestClose={() => setVisibleWinMatchModal(false)}
          animationInTiming={300}
          animationOutTiming={800}
          backdropTransitionInTiming={10}
          backdropTransitionOutTiming={10}
          style={styles.modalStyle}>
          <View style={styles.modalViewContainer}>
            <View style={styles.modalHeaderContainer}>
              <TouchableOpacity
                hitSlop={Utility.getHitSlop(15)}
                style={styles.closeButton}
                onPress={() => setVisibleWinMatchModal(false)}>
                <Image source={images.cancelImage} style={styles.closeButton} />
              </TouchableOpacity>
              <Text style={styles.itemText}>{strings.chooseSetting}</Text>
              <Text></Text>
            </View>
            <View style={styles.separatorLine} />
            <FlatList
              ItemSeparatorComponent={() => <TCThinDivider />}
              data={numberOfSet}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderNumbersOfSets}
            />
          </View>
        </Modal>

        <Modal
          isVisible={visibleWinSetModal}
          onBackdropPress={() => setVisibleWinSetModal(false)}
          onRequestClose={() => setVisibleWinSetModal(false)}
          animationInTiming={300}
          animationOutTiming={800}
          backdropTransitionInTiming={10}
          backdropTransitionOutTiming={10}
          style={styles.modalStyle}>
          <View style={styles.modalViewContainer}>
            <View style={styles.modalHeaderContainer}>
              <TouchableOpacity
                hitSlop={Utility.getHitSlop(15)}
                style={styles.closeButton}
                onPress={() => setVisibleWinSetModal(false)}>
                <Image source={images.cancelImage} style={styles.closeButton} />
              </TouchableOpacity>
              <Text style={styles.itemText}>{strings.chooseSetting}</Text>
              <Text></Text>
            </View>
            <View style={styles.separatorLine} />
            <FlatList
              ItemSeparatorComponent={() => <TCThinDivider />}
              data={numberOfGame}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderNumbersOfGames}
            />
          </View>
        </Modal>

        <Modal
          isVisible={visiblePlayTieModal}
          onBackdropPress={() => setVisiblePlayTieModal(false)}
          onRequestClose={() => setVisiblePlayTieModal(false)}
          animationInTiming={300}
          animationOutTiming={800}
          backdropTransitionInTiming={10}
          backdropTransitionOutTiming={10}
          style={styles.modalStyle}>
          <View style={styles.modalViewContainer}>
            <View style={styles.modalHeaderContainer}>
              <TouchableOpacity
                hitSlop={Utility.getHitSlop(15)}
                style={styles.closeButton}
                onPress={() => setVisiblePlayTieModal(false)}>
                <Image source={images.cancelImage} style={styles.closeButton} />
              </TouchableOpacity>
              <Text style={styles.itemText}>{strings.chooseSetting}</Text>
              <Text></Text>
            </View>
            <View style={styles.separatorLine} />
            <FlatList
              ItemSeparatorComponent={() => <TCThinDivider />}
              data={playTie}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderPlayTie}
            />
          </View>
        </Modal>

        <Modal
          isVisible={visibleWinPointModal}
          onBackdropPress={() => setVisibleWinPointModal(false)}
          onRequestClose={() => setVisibleWinPointModal(false)}
          animationInTiming={300}
          animationOutTiming={800}
          backdropTransitionInTiming={10}
          backdropTransitionOutTiming={10}
          style={styles.modalStyle}>
          <View style={styles.modalViewContainer}>
            <View style={styles.modalHeaderContainer}>
              <TouchableOpacity
                hitSlop={Utility.getHitSlop(15)}
                style={styles.closeButton}
                onPress={() => setVisibleWinPointModal(false)}>
                <Image source={images.cancelImage} style={styles.closeButton} />
              </TouchableOpacity>
              <Text style={styles.itemText}>{strings.chooseSetting}</Text>
              <Text></Text>
            </View>
            <View style={styles.separatorLine} />
            <FlatList
              ItemSeparatorComponent={() => <TCThinDivider />}
              data={winPoint}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderWinPoint}
            />
          </View>
        </Modal>

        {/* <Modal
          isVisible={visibleWinGameModal}
          onBackdropPress={() => setVisibleWinGameModal(false)}
          onRequestClose={() => setVisibleWinGameModal(false)}
          animationInTiming={300}
          animationOutTiming={800}
          backdropTransitionInTiming={10}
          backdropTransitionOutTiming={10}
          style={styles.modalStyle}>
          <View style={styles.modalViewContainer}>
            <View style={styles.modalHeaderContainer}>
              <TouchableOpacity
                hitSlop={Utility.getHitSlop(15)}
                style={styles.closeButton}
                onPress={() => setVisibleWinGameModal(false)}>
                <Image source={images.cancelImage} style={styles.closeButton} />
              </TouchableOpacity>
              <Text style={styles.itemText}>{strings.chooseSetting}</Text>
              <Text></Text>
            </View>
            <View style={styles.separatorLine} />
            <FlatList
              ItemSeparatorComponent={() => <TCThinDivider />}
              data={matchDuration}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderMatchDuration}
            />
          </View>
        </Modal> */}

        <Modal
          isVisible={visibleMatchDurationModal}
          onBackdropPress={() => setVisibleMatchDurationModal(false)}
          onRequestClose={() => setVisibleMatchDurationModal(false)}
          animationInTiming={300}
          animationOutTiming={800}
          backdropTransitionInTiming={10}
          backdropTransitionOutTiming={10}
          style={styles.modalStyle}>
          <View style={styles.modalViewContainer}>
            <View style={styles.modalHeaderContainer}>
              <TouchableOpacity
                hitSlop={Utility.getHitSlop(15)}
                style={styles.closeButton}
                onPress={() => setVisibleMatchDurationModal(false)}>
                <Image source={images.cancelImage} style={styles.closeButton} />
              </TouchableOpacity>
              <Text style={styles.itemText}>{strings.chooseSetting}</Text>
              <Text></Text>
            </View>
            <View style={styles.separatorLine} />
            <FlatList
              ItemSeparatorComponent={() => <TCThinDivider />}
              data={matchDuration}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderMatchDuration}
            />
          </View>
        </Modal>

        <Modal
          isVisible={toolTipVisible}
          onBackdropPress={() => setToolTipVisible(false)}
          onRequestClose={() => setToolTipVisible(false)}
          animationInTiming={300}
          animationOutTiming={800}
          backdropTransitionInTiming={10}
          backdropTransitionOutTiming={10}
          style={styles.modalStyle}>
          <View style={styles.modalViewContainer}>
            <View
              style={{
                alignSelf: 'center',
                backgroundColor: colors.modalHandleColor,
                width: 50,
                height: 5,
                marginBottom: 40,
                marginTop: 15,
                borderRadius: 10,
              }}
            />

            <Text
              style={{
                alignSelf: 'center',
                marginLeft: 15,
                marginRight: 15,
                fontSize: 16,
                fontFamily: fonts.RMedium,
                color: colors.lightBlackColor,
              }}>
              • The match can be played for up to The maximum duration.{'\n'}
              {'\n'}• The referee and scorekeeper fees for a match are
              calculated according to the maximum match duration and their
              hourly rates when you hire them.
            </Text>
          </View>
        </Modal>
      </SafeAreaView>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },

  minText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    flex: 1,
  },

  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 15,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 35,
  },
  //   totalTimeContainer: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     marginRight: 25,
  //     marginLeft: 5,
  //     justifyContent: 'space-between',
  //   },
  //   totalTimeText: {
  //     fontSize: 16,
  //     fontFamily: fonts.RBold,
  //     color: colors.lightBlackColor,
  //   },
  setContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    color: colors.lightBlackColor,
    flexDirection: 'row',

    height: 40,
    width: '92%',
    paddingHorizontal: 15,
    // shadowColor: colors.googleColor,
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.5,
    // shadowRadius: 1,
    // elevation: 3,
  },

  itemView: {
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: colors.blackColor,
  },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    resizeMode: 'contain',
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,

    width: '100%',
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },

  downArrowImage: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    alignSelf: 'center',
    marginLeft: 10,
    position: 'absolute',
    right: 0,
    marginRight: 15,
  },
  toolTipStyle: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginLeft: 10,
  },
  modalViewContainer: {
    width: '100%',
    height: Dimensions.get('window').height / 2,
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
    elevation: 15,
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    alignSelf: 'center',
    marginVertical: 20,
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  modalStyle: {
    margin: 0,
  },
  playTieStyle: {
    flex: 0.5,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginRight: 15,
  },
  playTieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    flex: 1,
    marginLeft: 30,
    marginRight: 15,
  },
  playerWinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 12,
    flex: 1,
    marginLeft: 30,
  },
});
