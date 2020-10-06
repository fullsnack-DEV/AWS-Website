import React, {useState, useEffect, Component} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import constants from '../../../../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../../../../Constants/ImagePath';
import strings from '../../../../../Constants/String';
import * as Utility from '../../../../../utility/index';

function CreateTeamForm1({navigation, route}) {
  const isFocused = useIsFocused();
  const [sports, setSports] = useState('');
  const [gender, setGender] = useState('');
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(0);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [parentGroupID, setParentGroupID] = useState();
  const [switchBy, setSwitchBy] = useState();

  const [minAgeValue, setMinAgeValue] = React.useState([]);
  const [maxAgeValue, setMaxAgeValue] = React.useState([]);

  const [teamName, setTeamName] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    getEntityPreference();
    let minAgeArray = [];
    let maxAgeArray = [];
    for (let i = 1; i <= 70; i++) {
      let dataSource = {
        label: '' + i,
        value: i,
      };
      minAgeArray.push(dataSource);
    }
    for (let i = minAge; i <= 70; i++) {
      let dataSource = {
        label: '' + i,
        value: i,
      };
      maxAgeArray.push(dataSource);
    }
    setMinAgeValue(minAgeArray);
    setMaxAgeValue(maxAgeArray);
    if (minAge == 0 || minAge == null) {
      setMaxAge(0);
    }

    if (switchBy == 'club') {
      setParentGroupID(route.params.clubObject.group_id);
    }
    if (route.params != null || route.params != undefined) {
      setLocation(
        route.params.city +
          ', ' +
          route.params.state +
          ', ' +
          route.params.country,
      );
    }
  }, [minAge, isFocused]);

  checkValidation = () => {
    if (sports == '') {
      Alert.alert('Towns Cup', 'Sports cannot be blank');
    } else if (teamName == '') {
      Alert.alert('Towns Cup', 'Team name cannot be blank');
    } else if (location == '') {
      Alert.alert('Towns Cup', 'Location cannot be blank');
    }
  };
  getEntityPreference = async () => {
    const switchEntity = await Utility.getStorage('switchBy');
    setSwitchBy(switchEntity);
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
        {parentGroupID != null && (
          <>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 15,
                marginTop: 15,
              }}>
              {!route.params.clubObject.full_image && (
                <Image source={PATH.club_ph} style={styles.profileImgGroup} />
              )}

              {route.params.clubObject.full_image && (
                <Image
                  source={{uri: route.params.clubObject.full_image}}
                  style={styles.profileImgGroup}
                />
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
            <View style={styles.separatorLine}></View>
            <Text style={styles.clubBelongText}>
              {strings.clubBelongText} {route.params.clubObject.group_name}{' '}
              {strings.clubText}.
            </Text>
          </>
        )}

        <View>
          <Text style={styles.fieldTitle}>
            {strings.SportsTextFieldTitle}
            <Text style={styles.mendatory}> {strings.star}</Text>
          </Text>
          <RNPickerSelect
            placeholder={{
              label: strings.selectSportPlaceholder,
              value: null,
            }}
            items={[
              {label: 'Football', value: 'football'},
              {label: 'Baseball', value: 'baseball'},
              {label: 'Tennis', value: 'tennis'},
              {label: 'Hockey', value: 'hockey'},
            ]}
            onValueChange={(value) => {
              setSports(value);
            }}
            useNativeAndroidPickerStyle={false}
            style={{...styles}}
            value={sports}
            Icon={() => {
              return (
                <Image source={PATH.dropDownArrow} style={styles.downArrow} />
              );
            }}
          />
        </View>
        <View style={styles.fieldView}>
          <Text style={styles.fieldTitle}>
            {strings.teamNameTitle} <Text style={styles.mendatory}> *</Text>
          </Text>

          <TextInput
            placeholder={strings.teamNamePlaceholder}
            style={styles.matchFeeTxt}
            onChangeText={(text) => setTeamName(text)}
            value={teamName}></TextInput>
        </View>
        {sports == 'tennis' && (
          <View>
            <Text style={styles.fieldTitle}>{strings.playerTitle}</Text>
            <View style={styles.fieldView}>
              <Text style={styles.playerTitle}>{strings.player1Title}</Text>
              <View style={styles.searchView}>
                <Image source={PATH.searchLocation} style={styles.searchImg} />
                <TextInput
                  style={styles.searchTextField}
                  placeholder={strings.searchHereText}
                  onChangeText={(text) => setPlayer1(text)}
                  value={player1}></TextInput>
              </View>
            </View>
            <View style={styles.fieldView}>
              <Text style={styles.playerTitle}>{strings.player2Title}</Text>

              <View style={styles.searchView}>
                <Image source={PATH.searchLocation} style={styles.searchImg} />
                <TextInput
                  style={styles.searchTextField}
                  placeholder={strings.searchHereText}
                  onChangeText={(text) => setPlayer2(text)}
                  value={player2}></TextInput>
              </View>
            </View>
          </View>
        )}
        {sports != 'tennis' && (
          <View style={styles.fieldView}>
            <Text style={styles.fieldTitle}>{strings.genderTitle}</Text>
            <RNPickerSelect
              placeholder={{
                label: strings.selectGenderPlaceholder,
                value: null,
              }}
              items={[
                {label: 'Male', value: 'male'},
                {label: 'Female', value: 'female'},
              ]}
              onValueChange={(value) => {
                setGender(value);
              }}
              useNativeAndroidPickerStyle={false}
              style={{
                ...styles,
              }}
              value={gender}
              Icon={() => {
                return (
                  <Image source={PATH.dropDownArrow} style={styles.downArrow} />
                );
              }}
            />
          </View>
        )}

        <View style={styles.fieldView}>
          {sports != 'tennis' && (
            <Text style={styles.fieldTitle}>{strings.membersAgeTitle}</Text>
          )}
          {sports != 'tennis' && (
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
                  value: null,
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
                    shadowOffset: {width: 0, height: 1},
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
                Icon={() => {
                  return (
                    <Image
                      source={PATH.dropDownArrow}
                      style={styles.miniDownArrow}
                    />
                  );
                }}
              />
              <RNPickerSelect
                placeholder={{
                  label: strings.maxPlaceholder,
                  value: null,
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
                    shadowOffset: {width: 0, height: 1},
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
                Icon={() => {
                  return (
                    <Image
                      source={PATH.dropDownArrow}
                      style={styles.miniDownArrow}
                    />
                  );
                }}
              />
            </View>
          )}

          <View style={styles.fieldView}>
            <Text style={styles.fieldTitle}>
              {strings.locationTitle}
              <Text style={styles.mendatory}> {strings.star}</Text>
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SearchLocationScreen', {
                  comeFrom: 'CreateTeamForm1',
                })
              }>
              <TextInput
                placeholder={strings.searchCityPlaceholder}
                style={styles.matchFeeTxt}
                onChangeText={(text) => setLocation(text)}
                value={location}
                editable={false}
                pointerEvents="none"></TextInput>
            </TouchableOpacity>
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={styles.smallTxt}>
              (<Text style={styles.mendatory}>{strings.star} </Text>
              {strings.requiredText})
            </Text>
          </View>
        </View>
        {parentGroupID != null && (
          <TouchableOpacity
            onPress={() => {
              checkValidation();
              if (sports != '' && teamName != '' && location != '') {
                navigation.navigate('CreateTeamForm2', {
                  createTeamForm1: {
                    sport: sports,
                    group_name: teamName,
                    gender: gender,
                    min_age: minAge,
                    max_age: maxAge,
                    city: route.params.city,
                    state_abbr: route.params.state,
                    country: route.params.country,
                    parent_group_id: parentGroupID,
                  },
                });
              }
            }}>
            <LinearGradient
              colors={[colors.yellowColor, colors.themeColor]}
              style={styles.nextButton}>
              <Text style={styles.nextButtonText}>{strings.nextTitle}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        {parentGroupID == null && (
          <TouchableOpacity
            onPress={() => {
              checkValidation();
              if (sports != '' && teamName != '' && location != '') {
                navigation.navigate('CreateTeamForm2', {
                  createTeamForm1: {
                    sport: sports,
                    group_name: teamName,
                    gender: gender,
                    min_age: minAge,
                    max_age: maxAge,
                    city: route.params.city,
                    state_abbr: route.params.state,
                    country: route.params.country,
                  },
                });
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
