import React, {
 useEffect, useState, useContext, useLayoutEffect,
 } from 'react';
import {
 Alert, StyleSheet, View, Text, FlatList,
  SafeAreaView,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import AuthContext from '../../../../auth/context';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import TCLabel from '../../../../components/TCLabel';
import TCMessageButton from '../../../../components/TCMessageButton';
import TCTextInputClear from '../../../../components/TCTextInputClear';

let entity = {};
export default function Venue({ navigation, route }) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);

  const [venue, setVenue] = useState([
    {
      id: 0,

      responsible_team_id: 'none',
      name: '',
      address: '',
      details: '',
    },
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => Alert.alert('Save')}>
          Save
        </Text>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    entity = authContext.entity;
    console.log(entity);
    if (route && route.params && route.params.editable && route.params.body) {
      setVenue([...route.params.body.referee]);
    }
    if (
      route
      && route.params
      && route.params.editableAlter
      && route.params.body
    ) {
      setVenue([...route.params.body.referee]);
    }
  }, [isFocused]);

  const addVenue = () => {
    if (venue.length < 10) {
      const obj = {
        id: venue.length === 0 ? 0 : venue.length,

        responsible_team_id: 'none',
        name: '',
        address: '',
        details: '',
      };
      setVenue([...venue, obj]);
    } else {
      Alert.alert(strings.titleBasic, strings.maxVenue);
    }
  };

  const renderVenue = ({ index }) => (
    <View>
      <View style={styles.viewTitleContainer}>
        <Text style={styles.venueCountTitle}>Venue {index + 1}</Text>
        {index !== 0 && (
          <Text
            style={styles.deleteButton}
            onPress={() => {
              venue.splice(index, 1);
              setVenue([...venue]);
            }}>
            Delete
          </Text>
        )}
      </View>

      <View style={styles.viewContainer}>

        <TCTextInputClear
        placeholder={strings.venueNamePlaceholder}
          onChangeText={(text) => {
            const ven = [...venue];
            venue[index].name = text;
            setVenue(ven);
          }}
          value={venue[index].name}
          onPressClear={() => {
            const ven = [...venue];
            venue[index].name = '';
            setVenue(ven);
          }}
          multiline={false}
        />

        <TCTextInputClear
        placeholder={strings.venueAddressPlaceholder}
          onChangeText={(text) => {
            const ven = [...venue];
            venue[index].address = text;
            setVenue(ven);
          }}
          value={venue[index].address}
          onPressClear={() => {
            const ven = [...venue];
            venue[index].address = '';
            setVenue(ven);
          }}
          multiline={false}
        />

        <TCTextInputClear
        placeholder={strings.venueDetailsPlaceholder}
          onChangeText={(text) => {
            const ven = [...venue];
            venue[index].details = text;
            setVenue(ven);
          }}
          value={venue[index].details}
          onPressClear={() => {
            const ven = [...venue];
            venue[index].details = '';
            setVenue(ven);
          }}
          multiline={true}
        />

        {/* <View style={styles.radioContainer}>
            <Text style={styles.radioText}>None</Text>
            <TouchableOpacity
              onPress={() => {
                const ref = [...venue];
                ref[index].responsible_team_id = 'none';
                setVenue(ref);
              }}>
              <Image
                source={
                  venue[index].responsible_team_id === 'none'
                    ? images.radioCheckGreenBG
                    : images.radioUnselect
                }
                style={styles.radioSelectStyle}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.radioContainer}>
            <Text style={styles.radioText}>
              {route.params.teamData[0].group_name
                || `${route.params.teamData[0].first_name} ${route.params.teamData[0].last_name}`}
              ’s home
            </Text>
            <TouchableOpacity
              onPress={() => {
                const ref = [...venue];
                ref[index].responsible_team_id = route.params.teamData[0].group_id
                  || route.params.teamData[0].user_id;
                setVenue(ref);
              }}>
              <Image
                source={
                  venue[index].responsible_team_id
                    === route.params.teamData[0].group_id
                  || venue[index].responsible_team_id
                    === route.params.teamData[0].user_id
                    ? images.radioCheckGreenBG
                    : images.radioUnselect
                }
                style={styles.radioSelectStyle}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.radioContainer}>
            <Text style={styles.radioText}>
              {route.params.teamData[1].group_name
                || `${route.params.teamData[1].first_name} ${route.params.teamData[1].last_name}`}
              ’s home
            </Text>
            <TouchableOpacity
              onPress={() => {
                const ref = [...venue];
                ref[index].responsible_team_id = route.params.teamData[1].group_id
                  || route.params.teamData[1].user_id;
                setVenue(ref);
              }}>
              <Image
                source={
                  venue[index].responsible_team_id
                    === route.params.teamData[1].group_id
                  || venue[index].responsible_team_id
                    === route.params.teamData[1].user_id
                    ? images.radioCheckGreenBG
                    : images.radioUnselect
                }
                style={styles.radioSelectStyle}
              />
            </TouchableOpacity>
          </View> */}
      </View>
    </View>
  );

  return (
    <TCKeyboardView>
      <SafeAreaView>
        <View>
          <TCLabel title={strings.venueTitle} style={{ marginRight: 15 }} />

          <FlatList
          data={venue}
          renderItem={renderVenue}
          keyExtractor={(item, index) => index.toString()}
          style={{ marginBottom: 15 }}
        />
          <TCMessageButton
          title={'+ Add Venue'}
          width={120}
          alignSelf={'center'}
          marginTop={15}
          marginBottom={40}
          onPress={() => addVenue()}
        />
        </View>
      </SafeAreaView>

      {/* <TCGradientButton title={editableAlter ? strings.doneTitle : strings.nextTitle} onPress={() => {
        if (editableAlter) {
          navigation.navigate('EditChallenge', {
            challengeObj: {
              ...route.params.body,
              referee: referees.map(({ is_chief, responsible_team_id }) => ({ is_chief, responsible_team_id })),
            },
          })
        } else {
          navigation.push('CreateChallengeForm4', {
            teamData: route.params.teamData,
            body: {
              ...route.params.body,
              referee: referees.map(({ is_chief, responsible_team_id }) => ({ is_chief, responsible_team_id })),
            },
          })
        }
      }}/> */}
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  viewContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
  venueCountTitle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginLeft: 25,
    marginTop: 15,

  },

  deleteButton: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.darkThemeColor,
    marginRight: 25,
  },
  viewTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },

});
