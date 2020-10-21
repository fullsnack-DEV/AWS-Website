import React, {
  useState, useEffect, useLayoutEffect, useContext,
} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';

import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import RNPickerSelect from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

import { useIsFocused } from '@react-navigation/native';
import styles from './style';
import { updateUserProfile } from '../../../../api/Accountapi';
import AuthContext from '../../../../auth/context';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import * as Utility from '../../../../utils/index';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

export default function PersonalInformationScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  // For activity indigator
  const [loading, setloading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState('');

  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');

  const [phoneNumbers, setPhoneNumbers] = useState([]);

  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);
  const selectedLanguage = [];

  const language = [
    { language: 'English', id: 1 },
    { language: 'English(Canada)', id: 2 },
    { language: 'English(Singapore)', id: 3 },
    { language: 'English(UK)', id: 4 },
    { language: 'English(US)', id: 5 },
    { language: 'Deutsch', id: 6 },
    { language: 'Italiano', id: 7 },
    { language: 'Korean', id: 8 },
  ];
  useLayoutEffect(() => {
    if (editMode) {
      navigation.setOptions({
        title: 'Edit Personal Information',
        headerRight: () => (
            <Text></Text>
        ),
      });
    } else {
      navigation.setOptions({
        title: 'Personal Information',
        headerRight: () => (
            <Text style={ styles.headerRightButton } onPress={ () => {
              changeEditMode();
            } }>Edit</Text>
        ),
      });
    }
  }, [navigation, editMode]);

  useEffect(() => {
    getUserInformation();
    const arr = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const tempData of language) {
      tempData.isChecked = false;
      arr.push(tempData);
    }
    setLanguages(arr);

    if (route.params && route.params.city) {
      setLocation(
        `${route.params.city
        }, ${
          route.params.state
        }, ${
          route.params.country}`,
      );
      setCity(route.params.city);
      setState(route.params.state);
      setCountry(route.params.country);
    } else {
      setCity('');
      setState('');
      setCountry('');
      setLocation('');
    }
  }, [isFocused]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  // Form Validation
  const checkValidation = () => {
    if (fName === '') {
      Alert.alert('Towns Cup', 'First name cannot be blank');
      return false
    } if (lName === '') {
      Alert.alert('Towns Cup', 'Last name cannot be blank');
      return false
    } if (location === '') {
      Alert.alert('Towns Cup', 'Location cannot be blank');
      return false
    }

    return true
  };

  // Get user information from async store
  const getUserInformation = async () => {
    const userDetails = await Utility.getStorage('user')
    setFName(userDetails.first_name);
    setLName(userDetails.last_name);
    setFullName(userDetails.full_name);
    setEmail(userDetails.email);
    setCity(userDetails.city);
    setState(userDetails.state_abbr);
    setCountry(userDetails.country);
    setLocation(
      `${userDetails.city
      }, ${
        userDetails.state_abbr
      }, ${
        userDetails.country}`,
    );
    setPhoneNumbers(userDetails.phone_numbers);

    const arr = [];
    const tempArr = []
    let match = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const temp of language) {
      // eslint-disable-next-line no-restricted-syntax
      for (const tempLang of userDetails.language) {
        if (tempLang === temp.language) {
          match = true;
          break
        } else {
          match = false;
        }
      }
      if (match) {
        temp.isChecked = true;
        arr.push(temp);
        tempArr.push(temp.language);
      } else {
        temp.isChecked = false;
        arr.push(temp);
      }
    }
    setLanguages(arr);
    setSelectedLanguages(tempArr);
  }

  // Change Edit mode states
  const changeEditMode = () => {
    setEditMode(!editMode);
  }

  const isIconCheckedOrNot = ({ item, index }) => {
    console.log('SELECTED:::', index);

    languages[index].isChecked = !item.isChecked;

    setLanguages([...languages]);

    // eslint-disable-next-line no-restricted-syntax
    for (const temp of languages) {
      if (temp.isChecked) {
        selectedLanguage.push(temp.language);
      }
    }
    setSelectedLanguages(selectedLanguage);
    console.log('language Checked ?:::', selectedLanguage);
  };
  const renderLanguage = ({ item, index }) => (
      <TouchableWithoutFeedback
        style={ styles.listItem }
        onPress={ () => {
          isIconCheckedOrNot({ item, index });
        } }>
          <View>
              <Text style={ styles.languageList }>{item.language}</Text>
              <View style={ styles.checkbox }>
                  {languages[index].isChecked ? (
                      <Image
                source={ images.checkWhiteLanguage }
                style={ styles.checkboxImg }
              />
                  ) : (
                      <Image source={ images.uncheckWhite } style={ styles.checkboxImg } />
                  )}
              </View>
              <View style={ styles.shortSeparatorLine }></View>
          </View>
      </TouchableWithoutFeedback>
  );
  const renderPhoneNumber = ({ item, index }) => (
      <View style={ styles.fieldView }>

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
              label: strings.selectCode,
              value: null,
            } }
            items={ [
              { label: 'Canada(+1)', value: 'Canada(+1)' },
              { label: 'United States(+1)', value: 'United States(+1)' },
            ] }
            onValueChange={ (value) => {
              const tmpphoneNumbers = [...phoneNumbers];
              tmpphoneNumbers[index].country_code = value;
              setPhoneNumbers(tmpphoneNumbers);
            } }
            value={ item.country_code }
            disabled={ !editMode }
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
            Icon={ () => (
                <Image
                  source={ images.dropDownArrow }
                  style={ styles.miniDownArrow }
                />
            ) }
          />
              <View style={ styles.halfMatchFeeView }>
                  <TextInput
              placeholder={ 'Phone number' }
              style={ styles.halffeeText }
              keyboardType={ 'phone-pad' }
              onChangeText={ (text) => {
                const tempphoneNumbers = [...phoneNumbers];
                tempphoneNumbers[index].phone_number = text;
                setPhoneNumbers(tempphoneNumbers);
                console.log('====================================');
                console.log('::', phoneNumbers);
                console.log('====================================');
              } }
              editable={ editMode }
              value={ item.phone_number }></TextInput>

              </View>
          </View>
      </View>
  )
  return (
      <>
          <ScrollView style={ styles.mainContainer }>
              <ActivityLoader visible={ loading } />
              <Text style={ styles.LocationText }>
                  Name
              </Text>
              {editMode && <View><TextInput
            placeholder={ strings.fnameText }
            style={ styles.matchFeeTxt }
            onChangeText={ (text) => setFName(text) }
            editable={ editMode }
            value={ fName }></TextInput>
                  <TextInput
            placeholder={ strings.lnameText }
            style={ styles.matchFeeTxt }
            onChangeText={ (text) => setLName(text) }
            editable={ editMode }
            value={ lName }></TextInput></View>}

              {!editMode && <TextInput
            placeholder={ 'Name' }
            style={ styles.matchFeeTxt }
            onChangeText={ (text) => setFullName(text) }
            editable={ editMode }
            value={ fullName }></TextInput>
        }

              <Text style={ styles.LocationText }>
                  E-mail
              </Text>
              <TextInput
            placeholder={ strings.emailPlaceHolder }
            style={ styles.matchFeeTxt }
            onChangeText={ (text) => setEmail(text) }
            editable={ false }
            value={ email }></TextInput>

              <Text style={ styles.LocationText }>Phone</Text>
              <FlatList
            data={ phoneNumbers }
            keyExtractor={ (item) => item.phone_number }
            renderItem={ renderPhoneNumber }
        />

              <View style={ styles.fieldView }>
                  <Text style={ styles.LocationText }>
                      {strings.locationTitle}

                  </Text>
                  <TouchableOpacity
              onPress={ () => {
                // eslint-disable-next-line no-unused-expressions
                editMode && navigation.navigate('SearchLocationScreen', {
                  comeFrom: 'PersonalInformationScreen',
                })
              }
              }>
                      <TextInput
                placeholder={ strings.searchCityPlaceholder }
                style={ styles.matchFeeTxt }
                value={ location }
                editable={ false }
                pointerEvents="none"
                ></TextInput>
                  </TouchableOpacity>
              </View>

              <Text style={ styles.LocationText }>
                  {strings.languageTitle}

              </Text>
              <View style={ styles.searchView }>
                  <TouchableOpacity
           onPress={ () => {
             // eslint-disable-next-line no-unused-expressions
             editMode && toggleModal();
           } }>
                      <TextInput
            style={ styles.searchTextField }
            placeholder={ strings.languagePlaceholder }
            value={ selectedLanguages.toString() }
            editable={ false }
            pointerEvents="none"></TextInput>
                  </TouchableOpacity>
              </View>

              <Modal
        isVisible={ isModalVisible }
        backdropColor="black"
        backdropOpacity={ 0 }
        style={ { marginLeft: 0, marginRight: 0, marginBottom: 0 } }>
                  <View
          style={ {
            width: '100%',
            height: Dimensions.get('window').height / 2,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
          } }>
                      <Text
            style={ {
              alignSelf: 'center',
              marginTop: 20,
              marginBottom: 20,
              fontSize: 16,
              fontFamily: fonts.RBold,
              color: colors.lightBlackColor,
            } }>
                          Languages
                      </Text>
                      <View style={ styles.separatorLine }></View>
                      <FlatList
            data={ languages }
            keyExtractor={ (item) => item.id }
            renderItem={ renderLanguage }
            style={ { marginBottom: '25%' } }
          />
                      <View
            style={ {
              width: '100%',
              height: '25%',
              backgroundColor: 'white',
              position: 'absolute',
              bottom: 0,
              left: 0,

              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
            } }>
                          <TouchableOpacity
              onPress={ () => {
                toggleModal();
              } }>
                              <LinearGradient
                colors={ [colors.yellowColor, colors.themeColor] }
                style={ styles.languageApplyButton }>
                                  <Text style={ styles.nextButtonText }>{strings.applyTitle}</Text>
                              </LinearGradient>
                          </TouchableOpacity>
                      </View>
                  </View>
              </Modal>

              {editMode && <TouchableOpacity onPress={ () => {
                if (checkValidation()) {
                  const bodyParams = {};
                  // let registered_sports= [];

                  // bodyParams.sport_name = sports;
                  // bodyParams.Tennis = 'single-multiplayer';
                  // bodyParams.descriptions = description;
                  // bodyParams.language=selectedLanguages;

                  // registered_sports[0]=bodyParams;
                  // bodyParams={registered_sports};
                  // console.log('bodyPARAMS:: ', JSON.stringify(bodyParams));

                  // navigation.navigate('RegisterPlayerForm2',{bodyParams: bodyParams})
                  bodyParams.first_name = fName;
                  bodyParams.last_name = lName;
                  bodyParams.full_name = `${fName} ${lName}`;
                  bodyParams.city = city;
                  bodyParams.state_abbr = state;
                  bodyParams.country = country;
                  bodyParams.language = selectedLanguages;
                  bodyParams.phone_numbers = phoneNumbers;
                  setloading(true);
                  updateUserProfile(bodyParams).then(async (response) => {
                    if (response.status === true) {
                      Alert.alert('Towns Cup', 'Profile changed sucessfully');
                      await Utility.setStorage('user', response.payload);
                      setEditMode(false);
                      authContext.setUser(response.payload);
                    } else {
                      Alert.alert('Towns Cup', 'Something went wrong');
                    }
                    setloading(false);
                  })
                }
              } }>
                  <LinearGradient
            colors={ [colors.yellowColor, colors.themeColor] }
            style={ styles.nextButton }>
                      <Text style={ styles.nextButtonText }>{strings.saveTitle}</Text>
                  </LinearGradient>
              </TouchableOpacity>}
          </ScrollView>
      </>
  );
}
