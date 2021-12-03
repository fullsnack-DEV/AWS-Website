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
  Dimensions, Platform, SafeAreaView,
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
      navigation.setOptions({
        headerShown: false,
      });
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

  const onSavePress = () => {
    if (checkValidation()) {
      const bodyParams = {};

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
  }

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
                ...(editMode && shadowStyle),
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
                ...(editMode && shadowStyle),
              },
            } }
            Icon={ () => (
              <Image
                  source={ images.dropDownArrow }
                  style={ styles.miniDownArrow }
                />
            ) }
          />
        <View style={{ ...styles.halfMatchFeeView, ...(editMode && shadowStyle) }}>
          <TextInput
              placeholder={ 'Phone number' }
              style={{ ...styles.halffeeText, ...(editMode && shadowStyle) }}
              keyboardType={ 'phone-pad' }
              onChangeText={ (text) => {
                const tempphoneNumbers = [...phoneNumbers];
                tempphoneNumbers[index].phone_number = text;
                setPhoneNumbers(tempphoneNumbers);
                const filteredNumber = phoneNumbers.filter((obj) => ![null, undefined, ''].includes(obj.phone_number && obj.country_code))
                setUserInfo({ ...userInfo, phone_numbers: filteredNumber.map(({ country_code, phone_number }) => ({ country_code, phone_number })) })
              } }
              editable={ editMode }
              value={ item.phone_number }/>

        </View>
      </View>
    </View>
  )
  const shadowStyle = {
      elevation: 3,
      shadowColor: colors.googleColor,
      shadowOffset: { width: 0, height: 0.5 },
      shadowOpacity: 0.16,
      shadowRadius: 1,
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
            leftComponent={
              <TouchableOpacity onPress={() => navigation.goBack() }>
                <Image source={images.backArrow} style={styles.backImageStyle} />
              </TouchableOpacity>
            }
            centerComponent={
              <Text style={{
                fontSize: 16,
                color: colors.lightBlackColor,
                textAlign: 'center',
                fontFamily: fonts.RBold,
              }}>
                Personal Information
              </Text>
            }
            rightComponent={
              <Text style={ styles.headerRightButton } onPress={ () => {
                if (!editMode) changeEditMode()
                else onSavePress();
              } }>
                {!editMode ? 'Edit' : 'Done'}
              </Text>
            }
        />
      <View style={{ width: '100%', height: 0.5, backgroundColor: colors.writePostSepratorColor }}/>
      <TCKeyboardView>
        <ScrollView bounces={false} style={ styles.mainContainer }>
          <ActivityLoader visible={ loading } />
          <TCLabel title={'Name'}/>
          {editMode && <View style={{ marginHorizontal: 15, flexDirection: 'row' }}><TextInput
    placeholder={strings.fnameText}
    style={{
 ...styles.matchFeeTxt, flex: 1, marginRight: 5, ...(editMode && shadowStyle),
    }}
    onChangeText={(text) => {
      setUserInfo({ ...userInfo, first_name: text })
    }}
    editable={editMode}
    value={userInfo.first_name}/>
            <TextInput
    placeholder={strings.lnameText}
    style={{
 ...styles.matchFeeTxt, flex: 1, marginLeft: 5, ...(editMode && shadowStyle),
    }}
    onChangeText={(text) => {
      setUserInfo({ ...userInfo, last_name: text })
    }}
    editable={editMode}
    value={userInfo.last_name}/></View>}

          {!editMode && <TextInput
    placeholder={'Name'}
    style={{ ...styles.matchFeeTxt, ...(editMode && shadowStyle) }}
    editable={editMode}
    value={`${userInfo.first_name} ${userInfo.last_name}`}/>
        }

          <TCLabel title={'E-mail'}/>
          <TextInput
            placeholder={ strings.emailPlaceHolder }
            style={{ ...styles.matchFeeTxt, ...(editMode && shadowStyle) }}
            editable={ false }
            value={ userInfo.email }/>

          <TCLabel title={'Phone'}/>
          <FlatList
            data={ phoneNumbers }
            keyExtractor={(index) => index.toString()}
            renderItem={ renderPhoneNumber }
        />
          {editMode && <TCMessageButton title={strings.addPhone} width={85} alignSelf = 'center' marginTop={15} onPress={() => addPhoneNumber()}/>}
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
                style={{ ...styles.matchFeeTxt, ...(editMode && shadowStyle) }}
                value={userInfo?.city && `${userInfo?.city?.trim()}, ${userInfo.state_abbr?.trim()}, ${userInfo.country?.trim()}`}
                editable={ false }
                pointerEvents="none"
                />
            </TouchableOpacity>
          </View>
          <TCLabel title={strings.languageTitle}/>
          <TouchableOpacity
            style={{ ...styles.searchView, ...(editMode && shadowStyle) }}
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
        </ScrollView>
      </TCKeyboardView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({

  checkbox: {
    alignSelf: 'center',
    position: 'absolute',
    right: wp('5%'),
  },
  backImageStyle: {
    height: 20,
    width: 10,
    tintColor: colors.lightBlackColor,
    resizeMode: 'contain',
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
    flexDirection: 'row',
    fontSize: wp('3.5%'),
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
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
    fontSize: 16,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingRight: 30,
    paddingVertical: 12,
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
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 12,
    paddingLeft: 15,
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
