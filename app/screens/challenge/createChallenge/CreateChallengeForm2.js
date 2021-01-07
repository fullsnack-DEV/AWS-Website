import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,

  ScrollView,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { parseInt } from 'lodash';
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCLabel from '../../../components/TCLabel';
import TCTextField from '../../../components/TCTextField';
import TCPicker from '../../../components/TCPicker';
import images from '../../../Constants/ImagePath';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import DataSource from '../../../Constants/DataSource';

export default function CreateChallengeForm2({ navigation, route }) {
  const [rules, setRules] = useState('');
  const [specialRules, setSpecialRules] = useState('');
  const isFocused = useIsFocused();
  const [editableAlter, setEditableAlter] = useState(false);
  const [userChallenge, setUserChallenge] = useState(false);
  const [sets, setSets] = useState(`${route?.params?.body?.gameRules?.total_sets}` || '5');
  const [games, setGames] = useState(`${route?.params?.body?.gameRules?.game_count_to_win_set}` || '1');
  const [applyDeuce, setApplyDeuce] = useState(route?.params?.body?.gameRules?.apply_duece_in_set ?? true);
  const [applyTie, setApplyTie] = useState(route?.params?.body?.gameRules?.apply_tiebreaker_in_game ?? true);
  const [applyDeuceTie, setApplyDeuceTie] = useState(route?.params?.body?.gameRules?.applyDueceInTieBreaker ?? true);
  const [applyDeuceWinGame, setApplyDeuceWinGame] = useState(route?.params?.body?.gameRules?.apply_duece_in_game ?? true);
  const [points, setPoints] = useState(`${route?.params?.body?.gameRules?.winning_point_in_tiebreaker}` || '7');
  const [pointsToWinGame, setPointsToWinGame] = useState(`${route?.params?.body?.gameRules?.winning_point_in_game}` || '4')
  const [playTie, setPlayTie] = useState(`${route?.params?.body?.gameRules?.tiebreaker_apply_at}` || '8');

  useEffect(() => {
    if (route && route.params && route.params.editableAlter && route.params.body) {
      console.log('gamerules::->', route.params.body.gameRules);
      if (route.params.body.sport.toLowerCase() === 'tennis') {
        setSpecialRules(route.params.body.special_rule);
      } else {
        setRules(route.params.body.special_rule);
      }
    }
    if (
      route
      && route.params
      && route.params.editableAlter
      && route.params.body
    ) {
      setEditableAlter(true);
      setRules(route.params.body.special_rule);
    }
    console.log('Body :', route.params.body);
    if (route?.params?.body.sport.toLowerCase() === 'tennis') {
      console.log('Body in rules:', route.params.body);
      setUserChallenge(true);
    } else {
      setUserChallenge(false);
    }
  }, [isFocused]);
  const checkValidation = () => {
    if (userChallenge) {
      if (specialRules === '') {
        Alert.alert('Towns Cup', 'Rules cannot be blank');
        return false;
      }
      return true;
    }

    if (rules === '') {
      Alert.alert('Towns Cup', 'Rules cannot be blank');
      return false;
    }
    return true;
  };
  // eslint-disable-next-line no-return-assign
  return (
    <TCKeyboardView>
      {editableAlter === false && (
        <View style={styles.formSteps}>
          <View style={styles.form1}></View>
          <View style={styles.form2}></View>
          <View style={styles.form3}></View>
          <View style={styles.form4}></View>
          <View style={styles.form5}></View>
        </View>
      )}

      {!userChallenge && (
        <View>
          <TCLabel title={'Rules'} />
          <Text style={styles.responsibilityText}>
            Please, add the rules of the match.
          </Text>
          <View style={{ height: 100 }}>
            <TCTextField
              height={100}
              multiline={true}
              placeholder={strings.writedownRulesPlaceholder}
              keyboardType={'default'}
              value={rules}
              onChangeText={(text) => setRules(text)}
            />
          </View>
        </View>
      )}

      {/* start view for user to user challenge rules */}
      {userChallenge && (
        <ScrollView>
          <TCLabel title={'Number of sets'} />
          <TCPicker
            dataSource={DataSource.NumberOfSet}
            placeholder={strings.selectSetText}
            value={sets}
            onValueChange={(value) => {
              setSets(value);
            }}
          />
          <TCThickDivider width={'100%'} marginTop={20}/>
          <TCLabel title={'Number of games to win set'} />
          <TCPicker
            dataSource={DataSource.NumberOfGame}
            placeholder={strings.selectNumberOfGameText}
            value={games}
            onValueChange={(value) => {
              setGames(value);
            }}
          />
          <View style={styles.checkBoxContainer}>
            <TouchableOpacity
              onPress={() => {
                if (!applyDeuce) {
                  setApplyTie(false)
                }
                setApplyDeuce(!applyDeuce);
              }}>
              <Image
                source={applyDeuce ? images.checkGreenBG : images.uncheckWhite}
                style={styles.checkBoxImage}
              />
            </TouchableOpacity>
            <Text style={styles.checkBoxTitle}>Apply deuce</Text>
          </View>
          {applyDeuce && <View>
            <View style={styles.checkBoxContainer}>
              <TouchableOpacity
              onPress={() => {
                setApplyTie(!applyTie);
              }}>
                <Image
                source={applyTie ? images.checkGreenBG : images.uncheckWhite}
                style={styles.checkBoxImage}
              />
              </TouchableOpacity>
              <Text style={styles.checkBoxTitle}>Apply tie-breaker</Text>
            </View>
            {applyTie && <View>
              <Text style={[styles.checkBoxTitle, { margin: 15 }]}>
                Play tie-breaker after the game score are
              </Text>

              <TCPicker
              dataSource={DataSource.TieBreaker}
              placeholder={strings.gameScoreText}
              value={playTie}
              onValueChange={(value) => {
                setPlayTie(value);
              }}
            />
              <Text style={[styles.checkBoxTitle, { margin: 15 }]}>
                Winning points in tie-breaker
              </Text>

              <TCPicker
              dataSource={DataSource.NumberOfGame}
              placeholder={strings.selectWiningPoints}
              value={points}
              onValueChange={(value) => {
                setPoints(value);
              }}
            />
              <View style={styles.checkBoxContainer}>
                <TouchableOpacity
              onPress={() => {
                setApplyDeuceTie(!applyDeuceTie);
              }}>
                  <Image
                source={applyDeuceTie ? images.checkGreenBG : images.uncheckWhite}
                style={styles.checkBoxImage}
              />
                </TouchableOpacity>
                <Text style={styles.checkBoxTitle}>Apply deuce in tie-breaker</Text>
              </View>
            </View>}
          </View>}
          <TCThickDivider width={'100%'} marginTop={10}/>
          <Text style={[styles.checkBoxTitle, { margin: 15 }]}>
            Number of points to win a game
          </Text>

          <TCPicker
              dataSource={DataSource.NumberOfGame}
              placeholder={strings.selectPointsText}
              value={pointsToWinGame}
              onValueChange={(value) => {
                setPointsToWinGame(value);
              }}
            />
          <View style={styles.checkBoxContainer}>
            <TouchableOpacity
              onPress={() => {
                setApplyDeuceWinGame(!applyDeuceWinGame);
              }}>
              <Image
                source={applyDeuceWinGame ? images.checkGreenBG : images.uncheckWhite}
                style={styles.checkBoxImage}
              />
            </TouchableOpacity>
            <Text style={styles.checkBoxTitle}>Apply deuce</Text>
          </View>
          <TCThickDivider width={'100%'} marginTop={10}/>
          <View style={{ marginBottom: 15 }}>
            <TCLabel title={'Other rules'} required={true} />
            <Text style={styles.responsibilityText}>
              Please, write down rules to the match that you need to inform the opposite player.
            </Text>
            <View style={{ height: 100 }}>
              <TCTextField
              height={100}
              multiline={true}
              placeholder={strings.writedownRulesPlaceholder}
              keyboardType={'default'}
              value={specialRules}
              onChangeText={(text) => setSpecialRules(text)}
            />
            </View>
          </View>
        </ScrollView>
      )}
      {/*  end view for user to user challenge rules */}
      <View style={{ flex: 1 }} />
      <View style={{ marginBottom: 20 }}>
        <TCGradientButton
          title={editableAlter === true ? strings.doneTitle : strings.nextTitle}
          onPress={() => {
            if (checkValidation()) {
              if (
                route
                && route.params
                && route.params.editable
                && route.params.body
              ) {
                navigation.navigate('CreateChallengeForm4', {
                  teamData: route.params.teamData,
                  body: {
                    ...route.params.body,
                    gameRules: {
                      winning_point_in_game: parseInt(pointsToWinGame),
                      tiebreaker_apply_at: parseInt(playTie),
                      apply_duece_in_set: applyDeuce,
                      apply_tiebreaker_in_game: applyTie,
                      apply_duece_in_game: applyDeuceWinGame,
                      total_sets: parseInt(sets),
                      game_count_to_win_set: parseInt(games),
                      applyDueceInTieBreaker: applyDeuceTie,
                      winning_point_in_tiebreaker: parseInt(points),
                    },
                    special_rule: rules || specialRules,
                  },
                });
              } else if (editableAlter === true) {
                navigation.navigate('EditChallenge', {
                  challengeObj: {
                    ...route.params.body,
                    gameRules: {
                      winning_point_in_game: parseInt(pointsToWinGame),
                      tiebreaker_apply_at: parseInt(playTie),
                      apply_duece_in_set: applyDeuce,
                      apply_tiebreaker_in_game: applyTie,
                      apply_duece_in_game: applyDeuceWinGame,
                      total_sets: parseInt(sets),
                      game_count_to_win_set: parseInt(games),
                      applyDueceInTieBreaker: applyDeuceTie,
                      winning_point_in_tiebreaker: parseInt(points),
                    },
                    special_rule: specialRules || rules,
                  },
                });
              } else {
                console.log('Normal  form filling');
                if (userChallenge) {
                  console.log('User challenge');
                  navigation.navigate('CreateChallengeForm3', {
                    teamData: route.params.teamData,
                    body: {
                      ...route.params.body,
                      gameRules: {
                        winning_point_in_game: parseInt(pointsToWinGame),
                        tiebreaker_apply_at: parseInt(playTie),
                        apply_duece_in_set: applyDeuce,
                        apply_tiebreaker_in_game: applyTie,
                        apply_duece_in_game: applyDeuceWinGame,
                        total_sets: parseInt(sets),
                        game_count_to_win_set: parseInt(games),
                        applyDueceInTieBreaker: applyDeuceTie,
                        winning_point_in_tiebreaker: parseInt(points),
                      },
                      special_rule: specialRules,
                    },
                  });
                } else {
                  navigation.navigate('CreateChallengeForm3', {
                    teamData: route.params.teamData,
                    body: {
                      ...route.params.body,
                      special_rule: rules,
                    },
                  });
                }
              }
            }
          }}/>
      </View>
    </TCKeyboardView>
  );
}

const styles = StyleSheet.create({
  form1: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form2: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form3: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form4: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form5: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
  },

  responsibilityText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  checkBoxImage: {
    marginRight: 10,
    resizeMode: 'cover',
    height: 20,
    width: 20,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
  },
  checkBoxTitle: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },

});
