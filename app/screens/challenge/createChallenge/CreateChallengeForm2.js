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
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCLabel from '../../../components/TCLabel';
import TCTextField from '../../../components/TCTextField';
import TCPicker from '../../../components/TCPicker';
import images from '../../../Constants/ImagePath';

export default function CreateChallengeForm2({ navigation, route }) {
  const [rules, setRules] = useState('');
  const [specialRules, setSpecialRules] = useState('');
  const isFocused = useIsFocused();
  const [editableAlter, setEditableAlter] = useState(false);
  const [userChallenge, setUserChallenge] = useState(false);
  const [sets, setSets] = useState();
  const [games, setGames] = useState();
  const [applyDeuce, setApplyDeuce] = useState(true);
  const [applyTie, setApplyTie] = useState(true);
  const [applyDeuceTie, setApplyDeuceTie] = useState(true);
  const [points, setPoints] = useState(2);

  const [playTie, setPlayTie] = useState();

  useEffect(() => {
    if (route && route.params && route.params.editable && route.params.body) {
      setRules(route.params.body.special_rule);
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
    if (route?.params?.body?.sport === ('tennis' || 'Tennis')) {
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
    <>
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
            dataSource={[
              { label: '1', value: '1' },
              { label: '3', value: '3' },
              { label: '5', value: '5' },
              { label: '9', value: '9' },
            ]}
            placeholder={'Select sets'}
            value={sets}
            onValueChange={(value) => {
              setSets(value);
            }}
          />
          <TCLabel title={'Number of games to win set'} />
          <TCPicker
            dataSource={[
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '3', value: '3' },
              { label: '4', value: '4' },
              { label: '5', value: '5' },
              { label: '6', value: '6' },
              { label: '7', value: '7' },
            ]}
            placeholder={'Select number of games'}
            value={games}
            onValueChange={(value) => {
              setGames(value);
            }}
          />
          <View style={styles.checkBoxContainer}>
            <TouchableOpacity
              onPress={() => {
                setApplyDeuce(!applyDeuce);
              }}>
              <Image
                source={applyDeuce ? images.checkGreenBG : images.uncheckWhite}
                style={styles.checkBoxImage}
              />
            </TouchableOpacity>
            <Text style={styles.checkBoxTitle}>Apply deuce</Text>
          </View>
          <View>
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

            <Text style={[styles.checkBoxTitle, { margin: 15 }]}>
              Play tie-breaker after the game score are
            </Text>

            <TCPicker
              dataSource={[
                { label: '1', value: '1' },
                { label: '3', value: '3' },
                { label: '5', value: '5' },
                { label: '9', value: '9' },
              ]}
              placeholder={'Select score'}
              value={playTie}
              onValueChange={(value) => {
                setPlayTie(value);
              }}
            />
            <Text style={[styles.checkBoxTitle, { margin: 15 }]}>
              Winning points in tie-breaker
            </Text>

            <TCPicker
              dataSource={[
                { label: '1', value: '1' },
                { label: '3', value: '3' },
                { label: '5', value: '5' },
                { label: '9', value: '9' },
              ]}
              placeholder={'Select points'}
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
          </View>
          <Text style={[styles.checkBoxTitle, { margin: 15 }]}>
            Number of points to win a game
          </Text>

          <TCPicker
              dataSource={[
                { label: '1', value: '1' },
                { label: '3', value: '3' },
                { label: '5', value: '5' },
                { label: '9', value: '9' },
              ]}
              placeholder={'Select points'}
              value={points}
              onValueChange={(value) => {
                setPoints(value);
              }}
            />
          <View style={styles.checkBoxContainer}>
            <TouchableOpacity
              onPress={() => {
                setApplyDeuce(!applyDeuce);
              }}>
              <Image
                source={applyDeuce ? images.checkGreenBG : images.uncheckWhite}
                style={styles.checkBoxImage}
              />
            </TouchableOpacity>
            <Text style={styles.checkBoxTitle}>Apply deuce</Text>
          </View>
          <View>
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
                    special_rule: rules,
                  },
                });
              } else if (editableAlter === true) {
                navigation.navigate('AlterAcceptDeclineScreen', {
                  body: {
                    ...route.params.body,
                    special_rule: rules,
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
                        winning_point_in_game: 4,
                        tiebreaker_apply_at: 6,
                        apply_duece_in_set: true,
                        apply_tiebreaker_in_game: true,
                        apply_duece_in_game: true,
                        total_sets: 5,
                        game_count_to_win_set: 6,
                        applyDueceInTieBreaker: true,
                        winning_point_in_tiebreaker: 7,
                      },
                      special_rule: specialRules,
                    },
                  });
                } else {
                  navigation.navigate('CreateChallengeForm3', {
                    teamData: route.params.teamData,
                    body: {
                      ...route.params.body,
                      gameRules: rules,
                    },
                  });
                }
              }
            }
          }}/>
      </View>
    </>
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
