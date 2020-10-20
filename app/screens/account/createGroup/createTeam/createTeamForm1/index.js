import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import constants from '../../../../../config/constants';
import PATH from '../../../../../Constants/ImagePath';
import strings from '../../../../../Constants/String';

const { colors } = constants;

function CreateTeamForm1({ navigation, route }) {
  const isFocused = useIsFocused();
  const [sports, setSports] = useState('');
  const [gender, setGender] = useState('');
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(0);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [player1ID, setPlayer1ID] = useState('');
  const [player2ID, setPlayer2ID] = useState('');
  const [parentGroupID, setParentGroupID] = useState('');

  const [minAgeValue, setMinAgeValue] = React.useState([]);
  const [maxAgeValue, setMaxAgeValue] = React.useState([]);
  const [teamName, setTeamName] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    const minAgeArray = [];
    let maxAgeArray = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= 70; i++) {
      const dataSource = {
        label: `${i}`,
        value: i,
      };
      minAgeArray.push(dataSource);
    }
    // eslint-disable-next-line no-plusplus
    for (let i = minAge; i <= 70; i++) {
      const dataSource = {
        label: `${i}`,
        value: i,
      };
      maxAgeArray.push(dataSource);
    }
    if (minAge === 0) {
      maxAgeArray = [];
      setMaxAge(maxAgeArray);
    }
    setMinAgeValue(minAgeArray);
    setMaxAgeValue(maxAgeArray);

    if (route.params && route.params.clubObject) {
      setParentGroupID(route.params.clubObject.group_id);
    }
    if (route.params && route.params.city) {
      setCity(route.params.city);
      setState(route.params.state);
      setCountry(route.params.country);
      setLocation(
        `${route.params.city}, ${route.params.state}, ${route.params.country}`,
      );
    } else {
      setCity('');
      setState('');
      setCountry('');
      setLocation('');
    }
    if (route.params && route.params.user) {
      if (route.params.selectedPlayer === 1) {
        setPlayer1(
          `${route.params.user.first_name} ${route.params.user.last_name}`,
        );
        setPlayer1ID(route.params.user.user_id);
      } else if (route.params.selectedPlayer === 2) {
        setPlayer2(
          `${route.params.user.first_name} ${route.params.user.last_name}`,
        );
        setPlayer2ID(route.params.user.user_id);
      }
    } else {
      setPlayer1('');
      setPlayer2('');
    }
  }, [minAge, isFocused]);

  const checkValidation = () => {
    if (sports === '') {
      Alert.alert('Towns Cup', 'Sports cannot be blank');
    } else if (teamName === '') {
      Alert.alert('Towns Cup', 'Team name cannot be blank');
    } else if (location === '') {
      Alert.alert('Towns Cup', 'Location cannot be blank');
    } else if (player1ID === player2ID) {
      if (player1ID !== '' && player2ID !== '') {
        Alert.alert('Towns Cup', 'Both player cannot be same');
      }
    } else if (
      (player1ID === '' && player2ID !== '')
      || (player1ID !== '' && player2ID === '')
    ) {
      Alert.alert('Towns Cup', 'One player cannot be blank');
    }
  };

  return (
      <>
          <ScrollView style={styles.mainContainer}>
              <View style={styles.formSteps}>
                  <View style={styles.form1}></View>
                  <View style={styles.form2}></View>
                  <View style={styles.form3}></View>
                  <View style={styles.form4}></View>
              </View>
              {parentGroupID !== '' && (
              <View>
                  <View>
                      <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 15,
                  marginTop: 15,
                }}>
                          {route.params.clubObject.full_image ? (
                              <Image
                    source={{ uri: route.params.clubObject.full_image }}
                    style={styles.profileImgGroup}
                  />
                          ) : (
                              <Image source={PATH.club_ph} style={styles.profileImgGroup} />
                          )}
                          <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    height: 20,
                  }}>
                              <Text style={styles.nameText}>
                                  {route.params.clubObject.group_name}
                              </Text>
                              <View style={styles.identityViewClub}>
                                  <Text style={styles.badgeCounter}>C</Text>
                              </View>
                          </View>
                      </View>
                  </View>
                  <View>
                      <View style={styles.separatorLine}></View>
                      <Text style={styles.clubBelongText}>
                          {strings.clubBelongText} {route.params.clubObject.group_name}{' '}
                          {strings.clubText}.
                      </Text>
                  </View>
              </View>
              )}

              <View>
                  <Text style={styles.fieldTitle}>
                      {strings.SportsTextFieldTitle}
                      <Text style={styles.mendatory}> {strings.star}</Text>
                  </Text>
                  <RNPickerSelect
            placeholder={{
              label: strings.selectSportPlaceholder,
              value: '',
            }}
            items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Tennis', value: 'tennis' },
              { label: 'Hockey', value: 'hockey' },
            ]}
            onValueChange={(value) => {
              setPlayer1ID('');
              setPlayer2ID('');
              setSports(value);
            }}
            useNativeAndroidPickerStyle={false}
            style={{ ...styles }}
            value={sports}
            Icon={() => (
                <Image source={PATH.dropDownArrow} style={styles.downArrow} />
            )}
          />
              </View>
              <View style={styles.fieldView}>
                  <Text style={styles.fieldTitle}>
                      {strings.teamNameTitle}
                      <Text style={styles.mendatory}> *</Text>
                  </Text>

                  <TextInput
            placeholder={strings.teamNamePlaceholder}
            style={styles.matchFeeTxt}
            onChangeText={(text) => setTeamName(text)}
            value={teamName}></TextInput>
              </View>
              {sports === 'tennis' && (
              <View>
                  <Text style={styles.fieldTitle}>{strings.playerTitle}</Text>
                  <View style={styles.fieldView}>
                      <Text style={styles.playerTitle}>{strings.player1Title}</Text>
                      <View style={styles.searchView}>
                          <Image source={PATH.searchLocation} style={styles.searchImg} />
                          <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SearchPlayerScreen', { player: 1 });
                  }}>
                              <TextInput
                    style={styles.searchTextField}
                    placeholder={strings.searchHereText}
                    onChangeText={(text) => setPlayer1(text)}
                    value={player1}
                    editable={false}
                    pointerEvents="none"></TextInput>
                          </TouchableOpacity>
                      </View>
                  </View>
                  <View style={styles.fieldView}>
                      <Text style={styles.playerTitle}>{strings.player2Title}</Text>

                      <View style={styles.searchView}>
                          <Image source={PATH.searchLocation} style={styles.searchImg} />
                          <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SearchPlayerScreen', { player: 2 });
                  }}>
                              <TextInput
                    style={styles.searchTextField}
                    placeholder={strings.searchHereText}
                    onChangeText={(text) => setPlayer2(text)}
                    value={player2}
                    editable={false}
                    pointerEvents="none"></TextInput>
                          </TouchableOpacity>
                      </View>
                  </View>
              </View>
              )}
              {sports !== 'tennis' && (
              <View style={styles.fieldView}>
                  <Text style={styles.fieldTitle}>{strings.genderTitle}</Text>
                  <RNPickerSelect
              placeholder={{
                label: strings.selectGenderPlaceholder,
                value: '',
              }}
              items={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
              ]}
              onValueChange={(value) => {
                setGender(value);
              }}
              useNativeAndroidPickerStyle={false}
              style={{
                ...styles,
              }}
              value={gender}
              Icon={() => (
                  <Image source={PATH.dropDownArrow} style={styles.downArrow} />
              )}
            />
              </View>
              )}

              <View style={styles.fieldView}>
                  {sports !== 'tennis' && (
                  <Text style={styles.fieldTitle}>{strings.membersAgeTitle}</Text>
                  )}
                  {sports !== 'tennis' && (
                  <View
              style={{
                flexDirection: 'row',

                marginTop: 12,

                align: 'center',
                marginLeft: 15,
                marginRight: 15,
                justifyContent: 'space-between',
              }}>
                      <RNPickerSelect
                placeholder={{
                  label: strings.minPlaceholder,
                  value: 0,
                }}
                items={minAgeValue}
                onValueChange={(value) => {
                  setMinAge(value);
                }}
                useNativeAndroidPickerStyle={false}
                style={{
                  iconContainer: {
                    top: 0,
                    right: 0,
                  },
                  inputIOS: {
                    height: 40,

                    fontSize: wp('3.5%'),
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    width: wp('45%'),
                    color: 'black',
                    paddingRight: 30,
                    backgroundColor: colors.offwhite,

                    borderRadius: 5,
                    shadowColor: colors.googleColor,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.5,
                    shadowRadius: 1,
                  },
                  inputAndroid: {
                    height: 40,

                    fontSize: wp('4%'),
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    width: wp('45%'),
                    color: 'black',

                    backgroundColor: colors.offwhite,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#fff',

                    elevation: 3,
                  },
                }}
                value={minAge}
                Icon={() => (
                    <Image
                    source={PATH.dropDownArrow}
                    style={styles.miniDownArrow}
                  />
                )}
              />
                      <RNPickerSelect
                placeholder={{
                  label: strings.maxPlaceholder,
                  value: 0,
                }}
                items={maxAgeValue}
                onValueChange={(value) => {
                  setMaxAge(value);
                }}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: {
                    height: 40,

                    fontSize: wp('3.5%'),
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    width: wp('45%'),
                    color: 'black',

                    backgroundColor: colors.offwhite,

                    borderRadius: 5,
                    shadowColor: colors.googleColor,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.5,
                    shadowRadius: 1,
                  },
                  inputAndroid: {
                    height: 40,
                    fontSize: wp('4%'),
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    width: wp('45%'),
                    color: 'black',
                    backgroundColor: colors.offwhite,
                    borderRadius: 5,
                    elevation: 3,
                  },
                }}
                value={maxAge}
                Icon={() => (
                    <Image
                    source={PATH.dropDownArrow}
                    style={styles.miniDownArrow}
                  />
                )}
              />
                  </View>
                  )}

                  <View style={styles.fieldView}>
                      <Text style={styles.fieldTitle}>
                          {strings.locationTitle}
                          <Text style={styles.mendatory}> {strings.star}</Text>
                      </Text>
                      <TouchableOpacity
              onPress={() => navigation.navigate('SearchLocationScreen', {
                comeFrom: 'CreateTeamForm1',
              })
              }>
                          <TextInput
                placeholder={strings.searchCityPlaceholder}
                style={styles.matchFeeTxt}
                value={location}
                editable={false}
                pointerEvents="none"></TextInput>
                      </TouchableOpacity>
                  </View>
                  <View style={{ marginLeft: 15 }}>
                      <Text style={styles.smallTxt}>
                          (<Text style={styles.mendatory}>{strings.star} </Text>
                          {strings.requiredText})
                      </Text>
                  </View>
              </View>
              {parentGroupID !== '' && (
              <TouchableOpacity
            onPress={() => {
              checkValidation();

              if (sports !== '' && teamName !== '' && location !== '') {
                if (player1ID !== '' && player2 !== '') {
                  navigation.navigate('CreateTeamForm2', {
                    createTeamForm1: {
                      sport: sports,
                      group_name: teamName,
                      gender,
                      min_age: minAge,
                      max_age: maxAge,
                      city,
                      state_abbr: state,
                      country,
                      parent_group_id: parentGroupID,
                      player1: player1ID,
                      player2: player2ID,
                    },
                  });
                } else {
                  navigation.navigate('CreateTeamForm2', {
                    createTeamForm1: {
                      sport: sports,
                      group_name: teamName,
                      gender,
                      min_age: minAge,
                      max_age: maxAge,
                      city,
                      state_abbr: state,
                      country,
                      parent_group_id: parentGroupID,
                    },
                  });
                }
              }
            }}>
                  <LinearGradient
              colors={[colors.yellowColor, colors.themeColor]}
              style={styles.nextButton}>
                      <Text style={styles.nextButtonText}>{strings.nextTitle}</Text>
                  </LinearGradient>
              </TouchableOpacity>
              )}
              {parentGroupID === '' && (
              <TouchableOpacity
            onPress={() => {
              checkValidation();

              if (sports !== '' && teamName !== '' && location !== '') {
                if (player1ID !== '' && player2 !== '') {
                  navigation.navigate('CreateTeamForm2', {
                    createTeamForm1: {
                      sport: sports,
                      group_name: teamName,
                      gender,
                      min_age: minAge,
                      max_age: maxAge,
                      city,
                      state_abbr: state,
                      country,

                      player1: player1ID,
                      player2: player2ID,
                    },
                  });
                } else {
                  console.log('MOVE TO NEXT');
                  navigation.navigate('CreateTeamForm2', {
                    createTeamForm1: {
                      sport: sports,
                      group_name: teamName,
                      gender,
                      min_age: minAge,
                      max_age: maxAge,
                      city,
                      state_abbr: state,
                      country,
                    },
                  });
                }
              }
            }}>
                  <LinearGradient
              colors={[colors.yellowColor, colors.themeColor]}
              style={styles.nextButton}>
                      <Text style={styles.nextButtonText}>{strings.nextTitle}</Text>
                  </LinearGradient>
              </TouchableOpacity>
              )}
          </ScrollView>
      </>
  );
}

export default CreateTeamForm1;
