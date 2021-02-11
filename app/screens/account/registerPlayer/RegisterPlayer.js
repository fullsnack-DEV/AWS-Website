import React, {
  useState, useEffect, useContext,
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
  Dimensions,
  Platform,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'
import TCKeyboardView from '../../../components/TCKeyboardView';
import { getSportsList } from '../../../api/Games';
import AuthContext from '../../../auth/context';
import { patchPlayer } from '../../../api/Users';
import * as Utility from '../../../utils';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import TCThinDivider from '../../../components/TCThinDivider';

export default function RegisterPlayer({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const [sportsSelection, setSportsSelection] = useState();
  const [sports, setSports] = useState('');
  const [loading, setloading] = useState(false);
  const [description, setDescription] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languagesName, setLanguagesName] = useState('');
  const [languages, setLanguages] = useState([]);
  const [sportsData, setSportsData] = useState([]);
  const [allSportsData, setAllSportsData] = useState([]);
  const selectedLanguage = [];
  useEffect(() => {
    setloading(true);
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

    const arr = [];
    for (const tempData of language) {
      tempData.isChecked = false;
      arr.push(tempData);
    }
    setLanguages(arr);

    getSportsList(authContext).then((res) => {
      setAllSportsData([...res?.payload]);
      const sportArr = [];
      res.payload.map((item) => {
        sportArr.push({ label: item?.sport_name, value: item?.sport_name })
        return null;
      })
      setSportsData([...sportArr]);
    }).catch((e) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 0.7);
    }).finally(() => {
      setloading(false);
    });
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const checkValidation = () => {
    if (sports === '') {
      Alert.alert('Towns Cup', 'Sports cannot be blank');
      return false
    }
    return true
  };

  const isIconCheckedOrNot = ({ item, index }) => {
    languages[index].isChecked = !item.isChecked;

    setLanguages([...languages]);
  };

  useEffect(() => {
    let languageText = '';
    if (selectedLanguages) {
      selectedLanguages.map((langItem, index) => {
        languageText = languageText + (index ? ', ' : '') + langItem;
        return null;
      })
      setLanguagesName(languageText);
    }
  }, [selectedLanguages]);

  const renderLanguage = ({ item, index }) => (
    <TouchableWithoutFeedback
        style={ styles.listItem }
        onPress={ () => {
          isIconCheckedOrNot({ item, index });
        } }>
      <View style={{
 padding: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',
      }}>
        <Text style={ styles.languageList }>{item.language}</Text>
        <View style={ styles.checkbox }>
          {languages[index].isChecked ? (
            <Image
                source={ images.orangeCheckBox }
                style={ styles.checkboxImg }
              />
          ) : (
            <Image source={ images.uncheckWhite } style={ styles.checkboxImg } />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const renderSports = ({ item }) => (
    <TouchableWithoutFeedback
          style={ styles.listItem }
          onPress={ () => setSportsSelection(item?.value) }>
      <View style={{
          padding: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',
      }}>
        <Text style={ styles.languageList }>{item.value}</Text>
        <View style={ styles.checkbox }>
          {sportsSelection === item?.value ? (
            <Image
                    source={ images.radioSelectYellow }
                    style={ styles.checkboxImg }
                />
            ) : (
              <Image source={ images.radioUnselect } style={ styles.checkboxImg } />
            )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <TCKeyboardView>
      <ScrollView style={ styles.mainContainer }>
        <ActivityLoader visible={ loading } />
        <View style={ styles.formSteps }>
          <View style={ styles.form1 } />
          <View style={ styles.form2 } />
        </View>
        <Text style={ styles.LocationText }>
          {strings.sportsEventsTitle}
          <Text style={ styles.mendatory }> {strings.star}</Text>
        </Text>
        {/* <RNPickerSelect */}
        {/*  placeholder={ { */}
        {/*    label: strings.selectSportPlaceholder, */}
        {/*    value: '', */}
        {/*  } } */}
        {/*  items={sportsData ?? []} */}
        {/*  onValueChange={ (value) => { */}
        {/*    setSports(value); */}
        {/*  } } */}
        {/*  useNativeAndroidPickerStyle={ false } */}
        {/*  // eslint-disable-next-line no-sequences */}
        {/*  style={{ ...(Platform.OS === 'ios' ? styles.inputIOS : styles.inputAndroid), ...styles }} */}
        {/*  value={ sports } */}
        {/*  Icon={ () => ( */}
        {/*    <Image source={ images.dropDownArrow } style={ styles.downArrow } /> */}
        {/*  ) } */}
        {/* /> */}

        <TouchableOpacity onPress={ () => setVisibleSportsModal(true) }>
          <View style={ styles.searchView }>
            <TextInput
                style={ styles.searchTextField }
                placeholder={ strings.selectSportPlaceholder }
                value={sports}
                editable={ false }
                pointerEvents="none"/>
          </View>
        </TouchableOpacity>
        <View
          style={ {
            flexDirection: 'row',
            alignItems: 'center',
          } }>
          <Text style={ styles.LocationText }>{strings.descriptionText}</Text>
        </View>
        <TextInput
          style={ styles.descriptionTxt }
          onChangeText={ (text) => setDescription(text) }
          value={ description }
          multiline
          textAlignVertical={'top'}
          numberOfLines={ 4 }
          placeholder={ strings.descriptionPlaceholder }
        />

        <Text style={ styles.LocationText }>
          {strings.languageTitle}
          <Text style={ styles.smallTxt }> {strings.opetionalText} </Text>
        </Text>
        <TouchableOpacity onPress={ toggleModal }>
          <View style={ styles.searchView }>
            <TextInput
            style={ styles.searchTextField }
            placeholder={ strings.languagePlaceholder }
            value={languagesName}
            editable={ false }
            pointerEvents="none"/>
          </View>
        </TouchableOpacity>

        <Modal
        isVisible={ isModalVisible }
        backdropColor="black"
        onBackdropPress={() => setModalVisible(false)}
        onRequestClose={() => setModalVisible(false)}
        backdropOpacity={ 0 }
        style={ {
 marginLeft: 0, backgroundColor: 'rgba(0,0,0,0.5)', marginRight: 0, marginBottom: 0,
        } }>
          <View
          style={ {
            width: '100%',
            height: Dimensions.get('window').height / 1.3,
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
            elevation: 15,
          } }>
            <View style={{
 flexDirection: 'row', paddingHorizontal: 15, justifyContent: 'space-between', alignItems: 'center',
            }}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Image source={images.cancelImage} style={styles.closeButton}/>
              </TouchableOpacity>
              <Text
            style={ {
              alignSelf: 'center',
              marginVertical: 20,
              fontSize: 16,
              fontFamily: fonts.RBold,
              color: colors.lightBlackColor,
            } }>
                Languages
              </Text>
              <TouchableOpacity onPress={() => {
                for (const temp of languages) {
                  if (temp.isChecked) {
                    selectedLanguage.push(temp.language);
                  }
                }
                setSelectedLanguages(selectedLanguage);
                toggleModal();
              }}>
                <Text
                  style={ {
                    alignSelf: 'center',
                    marginVertical: 20,
                    fontSize: 16,
                    fontFamily: fonts.RRegular,
                    color: colors.themeColor,
                  }}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
            <View style={ styles.separatorLine } />
            <FlatList
                ItemSeparatorComponent={() => <TCThinDivider/>}
                data={ languages }
                keyExtractor={(item, index) => index.toString()}
                renderItem={ renderLanguage }
          />
          </View>
        </Modal>

        <Modal
            isVisible={ visibleSportsModal }
            backdropColor="black"
            onBackdropPress={() => setVisibleSportsModal(false)}
            onRequestClose={() => setVisibleSportsModal(false)}
            backdropOpacity={ 0 }
            style={ {
              marginLeft: 0, backgroundColor: 'rgba(0,0,0,0.5)', marginRight: 0, marginBottom: 0,
            } }>
          <View
              style={ {
                width: '100%',
                height: Dimensions.get('window').height / 1.3,
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
                elevation: 15,
              } }>
            <View style={{
              flexDirection: 'row', paddingHorizontal: 15, justifyContent: 'space-between', alignItems: 'center',
            }}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setVisibleSportsModal(false)}>
                <Image source={images.cancelImage} style={styles.closeButton}/>
              </TouchableOpacity>
              <Text
                  style={ {
                    alignSelf: 'center',
                    marginVertical: 20,
                    fontSize: 16,
                    fontFamily: fonts.RBold,
                    color: colors.lightBlackColor,
                  } }>
                Sports
              </Text>
              <TouchableOpacity onPress={() => {
                setSports(sportsSelection);
                setVisibleSportsModal(false);
              }}>
                <Text
                    style={ {
                      alignSelf: 'center',
                      marginVertical: 20,
                      fontSize: 16,
                      fontFamily: fonts.RRegular,
                      color: colors.themeColor,
                    }}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
            <View style={ styles.separatorLine } />
            <FlatList
                ItemSeparatorComponent={() => <TCThinDivider/>}
                data={ sportsData }
                keyExtractor={(item, index) => index.toString()}
                renderItem={ renderSports }
            />
          </View>
        </Modal>
        {/* registerPlayerCall() */}
        <TouchableOpacity onPress={ () => {
          if (checkValidation()) {
            if (authContext?.user?.registered_sports?.some((e) => e.sport_name?.toLowerCase() === sports?.toLowerCase())) {
              Alert.alert(strings.alertmessagetitle, strings.sportAlreadyRegisterd)
            } else {
              const bodyParams = {};
              bodyParams.sport_name = sports;
              bodyParams.descriptions = description;
              bodyParams.currency_type = 'CAD';
              bodyParams.language = selectedLanguages;
              const spData = allSportsData?.find((item) => item?.sport_name?.toLowerCase() === sports?.toLowerCase())
              if (spData?.sport_type !== 'single') {
                setloading(true);
                const registerdPlayerData = authContext?.user?.registered_sports || []
                registerdPlayerData.push(bodyParams);
                const body = {
                  registered_sports: registerdPlayerData,
                }
                patchPlayer(body, authContext).then(async (response) => {
                  if (response.status === true) {
                    const entity = authContext.entity
                    entity.auth.user = response.payload;
                    entity.obj = response.payload;
                    authContext.setEntity({ ...entity })
                    authContext.setUser(response.payload)
                    await Utility.setStorage('authContextUser', response.payload);
                    navigation.navigate('RegisterPlayerSuccess');
                  } else {
                    Alert.alert('Towns Cup', response.messages);
                  }
                  console.log('RESPONSE IS:: ', response);
                  setloading(false);
                }).catch(() => setloading(false));
              } else {
                navigation.navigate('RegisterPlayerForm2', {
                  bodyParams,
                  comeFrom: (route && route.params && route.params.comeFrom) ? route.params.comeFrom : null,
                })
              }
            }
          }
        } }>
          <LinearGradient
            colors={ [colors.yellowColor, colors.themeColor] }
            style={ styles.nextButton }>
            <Text style={ styles.nextButtonText }>{strings.nextTitle}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: '22%',
  },
  formSteps: {

    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
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
  LocationText: {
    marginTop: hp('2%'),
    color: colors.lightBlackColor,
    fontSize: wp('3.8%'),
    textAlign: 'left',
    // fontFamily: fonts.RBold,
    paddingLeft: 15,
  },
  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  smallTxt: {
    color: colors.grayColor,
    fontSize: wp('2.8%'),
    marginTop: hp('2%'),

    textAlign: 'left',
    // fontFamily: fonts.RBold,
  },
  descriptionTxt: {
    height: 120,
    fontSize: wp('3.8%'),
    width: wp('92%'),
    alignSelf: 'center',
    marginTop: 12,
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
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 14,
    width: wp('92%'),
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

  mendatory: {
    color: 'red',
  },
  searchView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    marginTop: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    paddingLeft: 15,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  searchTextField: {
    alignSelf: 'center',
    color: colors.blackColor,
    flex: 1,
    fontSize: wp('3.8%'),
    width: wp('80%'),
  },
  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',

  },
  checkbox: {
  },
});
