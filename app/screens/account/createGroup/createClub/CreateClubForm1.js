import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
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

import RNPickerSelect from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import { getSportsList } from '../../../../api/Games';
import AuthContext from '../../../../auth/context';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import DataSource from '../../../../Constants/DataSource';

export default function CreateClubForm1({ navigation, route }) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [sports, setSports] = useState('');
  const [gender, setGender] = useState('');
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(0);
  const [clubName, setClubName] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [sportList, setSportList] = useState([]);

  const [minAgeValue, setMinAgeValue] = React.useState([]);
  const [maxAgeValue, setMaxAgeValue] = React.useState([]);

  useEffect(() => {
    getSports()
    const minAgeArray = [];
    let maxAgeArray = [];
    for (let i = 1; i <= 70; i++) {
      const dataSource = {
        label: `${i}`,
        value: i,
      };
      minAgeArray.push(dataSource);
    }
    for (let i = minAge; i <= 70; i++) {
      const dataSource = {
        label: `${i}`,
        value: i,
      };
      maxAgeArray.push(dataSource);
    }
    setMinAgeValue(minAgeArray);
    setMaxAgeValue(maxAgeArray);
    if (minAge === 0 || minAge === null) {
      setMaxAge((maxAgeArray = []));
    }

    if (route.params && route.params.city) {
      setCity(route.params.city);
      setState(route.params.state);
      setCountry(route.params.country);
      setLocation(
        `${route.params.city
        }, ${
          route.params.state
        }, ${
          route.params.country}`,
      );
    } else {
      setCity('');
      setState('');
      setCountry('');
      setLocation('');
    }
  }, [minAge, isFocused]);

  const checkValidation = () => {
    if (sports === '') {
      Alert.alert('Towns Cup', 'Sports cannot be blank');
    } else if (clubName === '') {
      Alert.alert('Towns Cup', 'Team name cannot be blank');
    } else if (location === '') {
      Alert.alert('Towns Cup', 'Location cannot be blank');
    }
  };
  const getSports = () => {
    getSportsList(authContext).then((response) => {
      const arr = [];
      for (const tempData of response.payload) {
        const obj = {};
        obj.label = tempData.sport_name;
        obj.value = tempData.sport_name;
        arr.push(obj);
      }
      setSportList(arr);
      setTimeout(() => setloading(false), 1000);
    }).catch((e) => {
      setloading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
  }
  return (
    <>
      <ScrollView style={ styles.mainContainer }>
        <ActivityLoader visible={ loading } />
        <View style={ styles.formSteps }>
          <View style={ styles.form1 }></View>
          <View style={ styles.form2 }></View>
          <View style={ styles.form3 }></View>
        </View>
        <View>
          <Text style={ styles.fieldTitle }>
            {strings.SportsTextFieldTitle}
            <Text style={ styles.mendatory }> {strings.star}</Text>
          </Text>
          <RNPickerSelect
            placeholder={ {
              label: strings.selectSportPlaceholder,
              value: '',
            } }
            items={ sportList }
            onValueChange={ (value) => {
              setSports(value);
            } }
            useNativeAndroidPickerStyle={ false }
            style={ {
              inputIOS: {
                height: 40,
                width: wp('92%'),
                alignSelf: 'center',
                marginTop: 12,
                fontSize: wp('3.5%'),
                paddingVertical: 12,
                paddingHorizontal: 15,

                color: 'black',
                paddingRight: 30,
                backgroundColor: colors.offwhite,

                borderRadius: 5,
                shadowColor: colors.googleColor,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.5,
                shadowRadius: 1,
                elevation: 3,
              },
              inputAndroid: {
                height: 40,
                width: wp('92%'),
                alignSelf: 'center',
                marginTop: 12,
                fontSize: wp('4%'),
                paddingVertical: 12,
                paddingHorizontal: 15,

                color: 'black',
                paddingRight: 30,
                backgroundColor: colors.offwhite,

                borderRadius: 5,

                elevation: 3,
              },
            } }
            value={ sports }
            Icon={ () => (
              <Image source={ images.dropDownArrow } style={ styles.downArrow } />
            ) }
          />
        </View>
        <View style={ styles.fieldView }>
          <Text style={ styles.fieldTitle }>
            {strings.clubNameTitle}
            <Text style={ styles.mendatory }> {strings.star}</Text>
          </Text>

          <TextInput
            placeholder={ strings.clubNameplaceholder }
            style={ styles.matchFeeTxt }
            onChangeText={ (text) => setClubName(text) }
            value={ clubName }></TextInput>
        </View>
        <View style={ styles.fieldView }>
          <Text style={ styles.fieldTitle }>{strings.genderTitle}</Text>
          <RNPickerSelect
            placeholder={ {
              label: strings.selectGenderPlaceholder,
              value: '',
            } }
            items={ DataSource.Gender }
            onValueChange={ (value) => {
              setGender(value);
            } }
            useNativeAndroidPickerStyle={ false }
            style={ {
              inputIOS: {
                height: 40,
                width: wp('92%'),
                alignSelf: 'center',
                marginTop: 12,
                fontSize: wp('3.5%'),
                paddingVertical: 12,
                paddingHorizontal: 15,

                color: 'black',
                paddingRight: 30,
                backgroundColor: colors.offwhite,

                borderRadius: 5,
                shadowColor: colors.googleColor,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.5,
                shadowRadius: 1,
                elevation: 3,
              },
              inputAndroid: {
                height: 40,
                width: wp('92%'),
                alignSelf: 'center',
                marginTop: 12,
                fontSize: wp('4%'),
                paddingVertical: 12,
                paddingHorizontal: 15,

                color: 'black',
                paddingRight: 30,
                backgroundColor: colors.offwhite,

                borderRadius: 5,

                elevation: 3,
              },
            } }
            value={ gender }
            Icon={ () => (
              <Image source={ images.dropDownArrow } style={ styles.downArrow } />
            ) }
          />
        </View>
        <View style={ styles.fieldView }>
          <Text style={ styles.fieldTitle }>{strings.membersAgeTitle}</Text>
          <View
            style={ {
              flexDirection: 'row',

              marginTop: 12,

              align: 'center',
              marginLeft: 15,
              marginRight: 15,
              justifyContent: 'space-between',
            } }>
            <RNPickerSelect
              placeholder={ {
                label: strings.minPlaceholder,
                value: 0,
              } }
              items={ minAgeValue }
              onValueChange={ (value) => {
                setMinAge(value);
              } }
              useNativeAndroidPickerStyle={ false }
              style={ {
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
                  paddingRight: 30,
                  backgroundColor: colors.offwhite,

                  borderRadius: 5,
                  shadowColor: colors.googleColor,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.5,
                  shadowRadius: 1,

                  elevation: 3,
                },
              } }
              value={ minAge }
              Icon={ () => (
                <Image
                    source={ images.dropDownArrow }
                    style={ styles.miniDownArrow }
                  />
              ) }
            />
            <RNPickerSelect
              placeholder={ {
                label: strings.maxPlaceholder,
                value: 0,
              } }
              items={ maxAgeValue }
              onValueChange={ (value) => {
                setMaxAge(value);
              } }
              useNativeAndroidPickerStyle={ false }
              style={ {
                iconContainer: {},
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
                  elevation: 3,
                },
                inputAndroid: {
                  height: 40,
                  fontSize: wp('4%'),
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  width: wp('45%'),
                  backgroundColor: colors.offwhite,

                  borderRadius: 5,
                  color: 'black',

                  elevation: 3,
                },
              } }
              value={ maxAge }
              Icon={ () => (
                <Image
                    source={ images.dropDownArrow }
                    style={ styles.miniDownArrow }
                  />
              ) }
            />
          </View>
          <View style={ styles.fieldView }>
            <Text style={ styles.fieldTitle }>
              {strings.locationTitle}
              <Text style={ styles.mendatory }> {strings.star}</Text>
            </Text>
            <TouchableOpacity
              onPress={ () => navigation.navigate('SearchLocationScreen', {
                comeFrom: 'CreateClubForm1',
              })
              }>
              <TextInput
                placeholder={ strings.searchCityPlaceholder }
                style={ styles.matchFeeTxt }
                value={ location }
                editable={ false }
                pointerEvents="none"></TextInput>
            </TouchableOpacity>
          </View>
          <View style={ { marginLeft: 15 } }>
            <Text style={ styles.smallTxt }>
              (<Text style={ styles.mendatory }>{strings.star} </Text>
              {strings.requiredText})
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={ () => {
            const form1 = {};
            if (minAge !== 0) {
              form1.min_age = minAge;
            } else if (maxAge !== 0) {
              form1.max_age = maxAge;
            } else if (gender !== '') {
              form1.gender = gender;
            }
            checkValidation();
            if (sports !== '' && clubName !== '' && location !== '') {
              navigation.navigate('CreateClubForm2', {
                createClubForm1: {
                  ...form1,
                  sport: sports,
                  group_name: clubName,
                  city,
                  state_abbr: state,
                  country,
                },
              });
            }
          } }>
          <LinearGradient
            colors={ [colors.yellowColor, colors.themeColor] }
            style={ styles.nextButton }>
            <Text style={ styles.nextButtonText }>{strings.nextTitle}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  downArrow: {
    alignSelf: 'center',
    height: 12,
    resizeMode: 'contain',

    right: 25,
    tintColor: colors.grayColor,
    top: 25,
    width: 12,
  },

  fieldTitle: {
    marginTop: hp('2%'),

    fontSize: wp('3.8%'),
    textAlign: 'left',
    // fontFamily: fonts.RBold,
    paddingLeft: 15,

    color: colors.lightBlackColor,
  },
  fieldView: {
    marginTop: 15,
  },
  form1: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },

  form2: {
    backgroundColor: colors.lightgrayColor,
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

  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  matchFeeTxt: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('3.8%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  mendatory: {
    color: 'red',
  },
  miniDownArrow: {
    alignSelf: 'center',
    height: 12,
    resizeMode: 'contain',

    right: 15,
    tintColor: colors.grayColor,

    top: 15,
    width: 12,
  },
  nextButton: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 45,
    marginBottom: 40,
    marginTop: wp('12%'),
    width: '90%',
  },
  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginVertical: 10,
  },

  smallTxt: {
    color: colors.grayColor,
    fontSize: wp('2.8%'),
    marginTop: hp('2%'),

    textAlign: 'left',
  },
});
