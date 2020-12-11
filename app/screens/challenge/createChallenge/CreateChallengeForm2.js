import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCLabel from '../../../components/TCLabel';
import TCTextField from '../../../components/TCTextField';
import TCPicker from '../../../components/TCPicker';

export default function CreateChallengeForm2({ navigation, route }) {
  const [rules, setRules] = useState('')
  const isFocused = useIsFocused();
  const [editableAlter, setEditableAlter] = useState(false);
  const [userChallenge, setUserChallenge] = useState(false);
  const [sets, setSets] = useState();
  const [games, setGames] = useState();

  useEffect(() => {
    if (route && route.params && route.params.editable && route.params.body) {
      setRules(route.params.body.special_rule)
    }
    if (route && route.params && route.params.editableAlter && route.params.body) {
      setEditableAlter(true)
      setRules(route.params.body.special_rule)
    }
    if (route?.params?.body?.sport === ('tennis' || 'Tennis')) {
      console.log('Body in rules:', route.params.body);
      setUserChallenge(true)
    } else {
      setUserChallenge(false)
    }
  }, [isFocused]);
  const checkValidation = () => {
    if (rules === '') {
      Alert.alert('Towns Cup', 'Rules cannot be blank');
      return false
    }
    return true
  };
  return (
    <>

      {editableAlter === false && <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
        <View style={styles.form3}></View>
        <View style={styles.form4}></View>
        <View style={styles.form5}></View>
      </View>}

      {!userChallenge && <View>
        <TCLabel title={'Rules'}/>
        <Text style={styles.responsibilityText}>Please, add the rules of the match.</Text>
        <View style={{ height: 100 }}>
          <TCTextField
            height={100}
            multiline={true}
            placeholder={strings.writedownRulesPlaceholder}
            keyboardType={'default'}
            value={rules}
            onChangeText={(text) => setRules(text)}/>
        </View>

      </View>}

      {/* start view for user to user challenge rules */}
      {userChallenge && <View style={{
        flex: 1,
      }}>
        <TCLabel title={'Number of sets'}/>
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
        <TCLabel title={'Number of games to win set'}/>
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
      </View>}
      {/*  end view for user to user challenge rules */}
      <View style={{ flex: 1 }}/>
      <View style={{ marginBottom: 20 }}>
        <TCGradientButton title={editableAlter === true ? strings.doneTitle : strings.nextTitle} onPress={() => {
          if (checkValidation()) {
            if (route && route.params && route.params.editable && route.params.body) {
              navigation.navigate('CreateChallengeForm4', {
                teamData: route.params.teamData,
                body: {
                  ...route.params.body,
                  special_rule: rules,
                },
              })
            } else if (editableAlter === true) {
              navigation.navigate('AlterAcceptDeclineScreen', {
                body: {
                  ...route.params.body,
                  special_rule: rules,
                },
              })
            } else {
              navigation.navigate('CreateChallengeForm3', {
                teamData: route.params.teamData,
                body: {
                  ...route.params.body,
                  special_rule: rules,
                },
              })
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

});
