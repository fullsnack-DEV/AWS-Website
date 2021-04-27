import React, {
  useState, useEffect, useLayoutEffect, useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  FlatList,
  Dimensions, Platform,
} from 'react-native';

import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import RNPickerSelect from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

import { updateUserProfile } from '../../../api/Users';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import * as Utility from '../../../utils/index';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCLabel from '../../../components/TCLabel';
import TCMessageButton from '../../../components/TCMessageButton';
import Header from '../../../components/Home/Header';
import TCKeyboardView from '../../../components/TCKeyboardView';
import { languageList } from '../../../utils';

export default function PersonalInformationScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);

  // For activity indigator
  const [loading, setloading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState(authContext.entity.obj)
  const [languagesName, setLanguagesName] = useState('')

  const [phoneNumbers, setPhoneNumbers] = useState(authContext.entity.obj.phone_numbers || [{
    id: 0,
    phone_number: '',
    country_code: '',
  }]);

  const [languageData, setLanguageData] = useState(languageList);
  const [isModalVisible, setModalVisible] = useState(false);
  const [languages, setLanguages] = useState(authContext?.entity?.obj?.language);
  const selectedLanguage = [];
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
  }, [navigation, editMode, languages, phoneNumbers]);

  useEffect(() => {
    let languageText = '';
    if (userInfo?.language) {
      userInfo.language.map((langItem, index) => {
        languageText = languageText + (index ? ', ' : '') + langItem;
        return null;
      })
      setLanguagesName(languageText);
    }
  }, [userInfo?.language]);

  useEffect(() => {
    const arr = [];
    for (const temp of languageData) {
      if (userInfo.language) {
        if (userInfo.language.includes(temp.language)) {
          temp.isChecked = true
        } else {
          temp.isChecked = false
        }
        arr.push(temp)
      }
    }
    setLanguages(arr);
  }, []);

  useEffect(() => {
    if (route.params && route.params.city) {
      setUserInfo({
        ...userInfo,
        city: route.params.city,
        state_abbr: route.params.state,
        country: route.params.country,
      })
    }
  }, [route.params])
  const addPhoneNumber = () => {
    const obj = {
      id: phoneNumbers.length === 0 ? 0 : phoneNumbers.length,
      code: '',
      number: '',
    }
    setPhoneNumbers([...phoneNumbers, obj]);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  // Form Validation
  const checkValidation = () => {
    if (userInfo.first_name === '') {
      Alert.alert('Towns Cup', 'First name cannot be blank');
      return false
    } if (userInfo.last_name === '') {
      Alert.alert('Towns Cup', 'Last name cannot be blank');
      return false
    } if (userInfo.city && userInfo.state_abbr && userInfo.country === '') {
      Alert.alert('Towns Cup', 'Location cannot be blank');
      return false
    }

    return true
  };

  // Change Edit mode states
  const changeEditMode = () => {
    setEditMode(!editMode);
  }

  const isIconCheckedOrNot = ({ item, index }) => {
    console.log('SELECTED:::', index);

    languageData[index].isChecked = !item.isChecked;

    setLanguageData([...languageData]);

    for (const temp of languageData) {
      if (temp.isChecked) {
        selectedLanguage.push(temp.language);
      }
    }
    setUserInfo({ ...userInfo, language: selectedLanguage })
    // setSelectedLanguages(selectedLanguage);
    console.log('language Checked :::', selectedLanguage);
  };
  const renderLanguage = ({ item, index }) => (
    <TouchableWithoutFeedback
            style={ styles.listItem }
            onPress={ () => {
              isIconCheckedOrNot({ item, index });
            } }>
      <View>
        <Text style={ styles.languageData }>{item.language}</Text>
        <View style={ styles.checkbox }>
          {item.isChecked ? (
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
  )
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

              const filteredNumber = phoneNumbers.filter((obj) => ![null, undefined, ''].includes(obj.phone_number && obj.country_code))
              setUserInfo({ ...userInfo, phone_numbers: filteredNumber.map(({ country_code, phone_number }) => ({ country_code, phone_number })) })
            } }
            value={ item.country_code }
            disabled={ !editMode }
            useNativeAndroidPickerStyle={ false }
            style={ {
              inputIOS: {
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
                const filteredNumber = phoneNumbers.filter((obj) => ![null, undefined, ''].includes(obj.phone_number && obj.country_code))
                setUserInfo({ ...userInfo, phone_numbers: filteredNumber.map(({ country_code, phone_number }) => ({ country_code, phone_number })) })
              } }
              editable={ editMode }
              value={ item.phone_number }></TextInput>

        </View>
      </View>
    </View>
  )
  return (
    <TCKeyboardView>
      <ScrollView style={ styles.mainContainer }>
        <ActivityLoader visible={ loading } />
        <TCLabel title={'Name'}/>
        {editMode && <View><TextInput
            placeholder={ strings.fnameText }
            style={ styles.matchFeeTxt }
            onChangeText={ (text) => {
              setUserInfo({ ...userInfo, first_name: text })
            }}
            editable={ editMode }
            value={ userInfo.first_name }></TextInput>
          <TextInput
            placeholder={ strings.lnameText }
            style={ styles.matchFeeTxt }
            onChangeText={ (text) => {
              setUserInfo({ ...userInfo, last_name: text })
            }}
            editable={ editMode }
            value={ userInfo.last_name }></TextInput></View>}

        {!editMode && <TextInput
            placeholder={ 'Name' }
            style={ styles.matchFeeTxt }
            editable={ editMode }
            value={ `${userInfo.first_name} ${userInfo.last_name}` }></TextInput>
        }

        <TCLabel title={'E-mail'}/>
        <TextInput
            placeholder={ strings.emailPlaceHolder }
            style={ styles.matchFeeTxt }
            editable={ false }
            value={ userInfo.email }></TextInput>

        <TCLabel title={'Phone'}/>
        <FlatList
            data={ phoneNumbers }
            keyExtractor={(index) => index.toString()}
            renderItem={ renderPhoneNumber }
        />
        <TCMessageButton title={strings.addPhone} width={85} alignSelf = 'center' marginTop={15} onPress={() => addPhoneNumber()}/>
        <View style={ styles.fieldView }>

          <TCLabel title={strings.locationTitle}/>
          <TouchableOpacity
              disabled={!editMode}
              onPress={ () => {
                // eslint-disable-next-line no-unused-expressions
                editMode && navigation.navigate('SearchLocationScreen', {
                  comeFrom: 'PersonalInformationScreen',
                })
              }}>
            <TextInput
                placeholder={ strings.searchCityPlaceholder }
                style={ styles.matchFeeTxt }
                value={userInfo?.city && `${userInfo?.city?.trim()}, ${userInfo.state_abbr?.trim()}, ${userInfo.country?.trim()}`}
                editable={ false }
                pointerEvents="none"
                ></TextInput>
          </TouchableOpacity>
        </View>
        <TCLabel title={strings.languageTitle}/>
        <TouchableOpacity
            style={ styles.searchView }
            disabled={!editMode}
            onPress={ () => {
              // eslint-disable-next-line no-unused-expressions
              editMode && toggleModal();
            }}>
          <TextInput
            style={ styles.searchTextField }
            placeholder={ strings.languagePlaceholder }
            value={ userInfo.language ? languagesName : '' }
            editable={ false }
            pointerEvents="none"/>
        </TouchableOpacity>
        <Modal
        isVisible={ isModalVisible }
        backdropColor="black"
        hasBackdrop={true}
        onBackdropPress={() => {
          setModalVisible(false)
        }}
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
            elevation: 10,
          } }>
            <Header
              mainContainerStyle={{ marginTop: 15 }}
              centerComponent={
                <Text style={styles.headerCenterStyle}>{'Languages'}</Text>
              }
              rightComponent={
                <TouchableOpacity onPress={() => {
                  setModalVisible(false)
                }}>
                  <Image source={images.cancelImage} style={styles.cancelImageStyle} resizeMode={'contain'} />
                </TouchableOpacity>
              }
            />
            <View style={styles.sepratorStyle} />
            <View style={ styles.separatorLine }></View>
            <FlatList
            data={ languageData }
            keyExtractor={(index) => index.toString()}
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
            bodyParams.first_name = userInfo.first_name;
            bodyParams.last_name = userInfo.last_name;
            bodyParams.full_name = `${userInfo.first_name} ${userInfo.last_name}`;
            bodyParams.city = userInfo.city;
            bodyParams.state_abbr = userInfo.state_abbr;
            bodyParams.country = userInfo.country;
            if (userInfo.language) {
              bodyParams.language = userInfo.language;
            }
            if (phoneNumbers) {
              bodyParams.phone_numbers = userInfo.phone_numbers;
            }
            console.log('bodyPARAMS:: ', bodyParams);
            setloading(true);
            updateUserProfile(bodyParams, authContext).then(async (response) => {
              const currentEntity = {
                ...authContext.entity, obj: response.payload,
              }
              authContext.setEntity({ ...currentEntity })
              Utility.setStorage('authContextEntity', { ...currentEntity })
              setEditMode(false);
              setloading(false);
              setTimeout(() => {
                Alert.alert('Towns Cup', 'Profile changed sucessfully');
              }, 1000);
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
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({

  checkbox: {
    alignSelf: 'center',
    position: 'absolute',
    right: wp('5%'),
  },
  checkboxImg: {
    width: wp('5.5%'),

    // paddingLeft: wp('25%'),
    resizeMode: 'contain',
    alignSelf: 'center',

  },

  fieldView: {

    marginBottom: 2,
  },
  halfMatchFeeView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: wp('3.5%'),
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('46%'),
  },
  halffeeText: {
    alignSelf: 'center',
    fontSize: wp('3.8%'),
    width: '90%',
  },
  headerRightButton: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 20,
  },

  languageApplyButton: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 45,
    marginBottom: 40,
    marginTop: wp('5%'),
    width: '90%',
  },
  languageData: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  matchFeeTxt: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: colors.lightBlackColor,
    elevation: 3,
    fontSize: wp('3.8%'),
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

  searchTextField: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    flex: 1,
    fontSize: wp('3.8%'),
    width: wp('80%'),
  },
  searchView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 12,
    paddingLeft: 15,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 14,
    width: wp('92%'),
  },
  cancelImageStyle: {
    height: 15,
    width: 15,
    tintColor: colors.lightBlackColor,
  },
  headerCenterStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
});
