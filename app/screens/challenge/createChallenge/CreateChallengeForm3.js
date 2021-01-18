import React, { useEffect, useState, useContext } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import AuthContext from '../../../auth/context';
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import images from '../../../Constants/ImagePath';
import TCLabel from '../../../components/TCLabel';

import TCMessageButton from '../../../components/TCMessageButton';

let entity = {};
export default function CreateChallengeForm3({ navigation, route }) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext)
  const [editableAlter, setEditableAlter] = useState(false);
  const [referees, setReferees] = useState([{
    id: 0,
    is_chief: true,
    responsible_team_id: 'none',
  }]);

  const [scorekeeper, setScorekeeper] = useState([{
    id: 0,
    is_chief: false,
    responsible_team_id: 'none',
  }]);
  useEffect(() => {
    entity = authContext.entity
    console.log(entity);
    if (route && route.params && route.params.editable && route.params.body) {
      setReferees([...route.params.body.referee])
      setScorekeeper([...route.params.body.scorekeeper])
    }
    if (route && route.params && route.params.editableAlter && route.params.body) {
      setReferees([...route.params.body.referee])
      setScorekeeper([...route.params.body.scorekeeper])
      setEditableAlter(true)
    }
  }, [isFocused]);
  const addReferee = () => {
    if (referees.length < 5) {
      const obj = {
        id: referees.length === 0 ? 0 : referees.length,
        is_chief: false,
        responsible_team_id: 'none',
      }
      setReferees([...referees, obj]);
    } else {
      Alert.alert(strings.titleBasic, strings.max5Referee)
    }
  };
  const addScorekeeper = () => {
    if (scorekeeper.length < 5) {
      const obj = {
        id: scorekeeper.length === 0 ? 0 : scorekeeper.length,
        is_chief: false,
        responsible_team_id: 'none',
      }
      setScorekeeper([...scorekeeper, obj]);
    } else {
      Alert.alert(strings.titleBasic, strings.max5Scorekeeper)
    }
  };
  const renderReferee = ({ index }) => (
    <View>
      <View style={styles.viewTitleContainer}>
        <Text style={styles.refereeCountTitle}>Referee {index + 1} {index === 0 && '(Chief)'}</Text>
        {index !== 0 && <Text style={styles.deleteButton} onPress={() => {
          referees.splice(index, 1)
          setReferees([...referees])
        }}>Delete</Text>}
      </View>
      {route && route.params && route.params.teamData && <View style={styles.viewContainer}>
        <View style={styles.radioContainer}>
          <Text style={styles.radioText}>None</Text>
          <TouchableOpacity onPress={() => {
            const ref = [...referees];
            ref[index].responsible_team_id = 'none'
            setReferees(ref)
          }}>
            <Image source={referees[index].responsible_team_id === 'none' ? images.radioCheckGreenBG : images.radioUnselect} style={styles.radioSelectStyle}/>
          </TouchableOpacity>
        </View>
        <View style={styles.radioContainer}>
          <Text style={styles.radioText}>{route.params.teamData[0].group_name || `${route.params.teamData[0].first_name} ${route.params.teamData[0].last_name}`}’s home</Text>
          <TouchableOpacity onPress={() => {
            const ref = [...referees];
            ref[index].responsible_team_id = route.params.teamData[0].group_id || route.params.teamData[0].user_id
            setReferees(ref)
          }}>
            <Image source={(referees[index].responsible_team_id === route.params.teamData[0].group_id) || (referees[index].responsible_team_id === route.params.teamData[0].user_id) ? images.radioCheckGreenBG : images.radioUnselect} style={styles.radioSelectStyle}/>
          </TouchableOpacity>
        </View>
        <View style={styles.radioContainer}>
          <Text style={styles.radioText}>{route.params.teamData[1].group_name || `${route.params.teamData[1].first_name} ${route.params.teamData[1].last_name}`}’s home</Text>
          <TouchableOpacity onPress={() => {
            const ref = [...referees];
            ref[index].responsible_team_id = route.params.teamData[1].group_id || route.params.teamData[1].user_id
            setReferees(ref)
          }}>
            <Image source={(referees[index].responsible_team_id === route.params.teamData[1].group_id) || (referees[index].responsible_team_id === route.params.teamData[1].user_id) ? images.radioCheckGreenBG : images.radioUnselect} style={styles.radioSelectStyle}/>
          </TouchableOpacity>
        </View>
      </View>}

    </View>
  );
  const renderScorekeeper = ({ index }) => (
    <View>
      <View style={styles.viewTitleContainer}>
        <Text style={styles.refereeCountTitle}>Scorekeeper {index + 1} </Text>
        <Text style={styles.deleteButton} onPress={() => {
          scorekeeper.splice(index, 1)
          setScorekeeper([...scorekeeper])
        }}>Delete</Text>
      </View>

      {route && route.params && route.params.teamData && <View style={styles.viewContainer}>
        <View style={styles.radioContainer}>
          <Text style={styles.radioText}>None</Text>
          <TouchableOpacity onPress={() => {
            const score = [...scorekeeper];
            score[index].responsible_team_id = 'none'
            setScorekeeper(score)
          }}>
            <Image source={scorekeeper[index].responsible_team_id === 'none' ? images.radioCheckGreenBG : images.radioUnselect} style={styles.radioSelectStyle}/>
          </TouchableOpacity>
        </View>
        <View style={styles.radioContainer}>
          <Text style={styles.radioText}>{route.params.teamData[0].group_name || `${route.params.teamData[0].first_name} ${route.params.teamData[0].last_name}`}’s home</Text>
          <TouchableOpacity onPress={() => {
            const score = [...scorekeeper];
            score[index].responsible_team_id = route.params.teamData[0].group_id || route.params.teamData[0].user_id
            setScorekeeper(score)
          }}>
            <Image source={(scorekeeper[index].responsible_team_id === route.params.teamData[0].group_id) || scorekeeper[index].responsible_team_id === route.params.teamData[0].user_id ? images.radioCheckGreenBG : images.radioUnselect} style={styles.radioSelectStyle}/>
          </TouchableOpacity>
        </View>
        <View style={styles.radioContainer}>
          <Text style={styles.radioText}>{route.params.teamData[1].group_name || `${route.params.teamData[1].first_name} ${route.params.teamData[1].last_name}`}’s home</Text>
          <TouchableOpacity onPress={() => {
            const score = [...scorekeeper];
            score[index].responsible_team_id = route.params.teamData[1].group_id || route.params.teamData[1].user_id
            setScorekeeper(score)
          }}>
            <Image source={(scorekeeper[index].responsible_team_id === route.params.teamData[1].group_id) || (scorekeeper[index].responsible_team_id === route.params.teamData[1].user_id) ? images.radioCheckGreenBG : images.radioUnselect} style={styles.radioSelectStyle}/>
          </TouchableOpacity>
        </View>
      </View>}
    </View>
  );
  return (

    <TCKeyboardView>
      {!editableAlter && <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
        <View style={styles.form3}></View>
        <View style={styles.form4}></View>
        <View style={styles.form5}></View>
      </View>}

      <View>
        <TCLabel title={'Responsibility To Secure Referees'} />
        <Text style={styles.responsibilityText}>Which team ought to secure and pay for
          referees for this game? </Text>

        <FlatList
                data={referees}
                renderItem={renderReferee}
                keyExtractor={(item, index) => index.toString()}

                >
        </FlatList>
        <TCMessageButton
         title={'+ Add Referee'}
         width={120}
         alignSelf={'center'}
          marginTop={15}
           marginBottom={20}
           onPress={() => addReferee()}/>
        <TCThickDivider/>

        <TCLabel title={'Responsibility To Scorekeeper'} />
        <Text style={styles.responsibilityText}>Who ought to secure and pay for scorekeeper
          for this game?  </Text>

        <FlatList
                data={scorekeeper}
                renderItem={renderScorekeeper}
                keyExtractor={(item, index) => index.toString()}

                >
        </FlatList>
        <TCMessageButton
        title={'+ Add Scorekeeper'}
         width={120}
         alignSelf={'center'}
          marginTop={15}
          marginBottom={20}
          onPress={() => addScorekeeper()}/>

        <Text style={styles.responsibilityNote}>
          These match fee doesn’t include the <Text style = {styles.responsibilityNoteMedium}>Match Place Fee, Referee Fee
          </Text> and <Text style = {styles.responsibilityNoteMedium}>Scorekeeper Fee.</Text> The match place, referees and
          scorekeepers should be secured by the team who has charge of
          them at its own expense.
        </Text>
      </View>

      <TCGradientButton title={editableAlter ? strings.doneTitle : strings.nextTitle} onPress={() => {
        if (editableAlter) {
          navigation.navigate('EditChallenge', {
            challengeObj: {
              ...route.params.body,
              referee: referees.map(({ is_chief, responsible_team_id }) => ({ is_chief, responsible_team_id })),
              scorekeeper: scorekeeper.map(({ is_chief, responsible_team_id }) => ({ is_chief, responsible_team_id })),
            },
          })
        } else {
          navigation.push('CreateChallengeForm4', {
            teamData: route.params.teamData,
            body: {
              ...route.params.body,
              referee: referees.map(({ is_chief, responsible_team_id }) => ({ is_chief, responsible_team_id })),
              scorekeeper: scorekeeper.map(({ is_chief, responsible_team_id }) => ({ is_chief, responsible_team_id })),
            },
          })
        }
      }}/>
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
    backgroundColor: colors.themeColor,
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

  viewContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
  radioSelectStyle: {
    resizeMode: 'cover',
    height: 22,
    width: 22,
    marginRight: 15,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  radioText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
  },
  refereeCountTitle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  responsibilityText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },
  responsibilityNote: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.orangeNotesColor,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  responsibilityNoteMedium: {
    fontFamily: fonts.RMedium,
  },
  deleteButton: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.themeColor,
    marginRight: 25,

  },
  viewTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
