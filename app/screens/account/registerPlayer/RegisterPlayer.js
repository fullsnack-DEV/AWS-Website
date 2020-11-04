import React, {
  useState, useEffect,
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

import RNPickerSelect from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'

export default function RegisterPlayer({ navigation }) {
  const [sports, setSports] = useState('');
  const [description, setDescription] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);
  const selectedLanguage = [];

  useEffect(() => {
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

    for (const temp of languages) {
      if (temp.isChecked) {
        selectedLanguage.push(temp.language);
      }
    }
    setSelectedLanguages(selectedLanguage);
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
  return (
    <>
      <ScrollView style={ styles.mainContainer }>
        <View style={ styles.formSteps }>
          <View style={ styles.form1 }></View>
          <View style={ styles.form2 }></View>
        </View>
        <Text style={ styles.LocationText }>
          {strings.sportsEventsTitle}
          <Text style={ styles.mendatory }> {strings.star}</Text>
        </Text>
        <RNPickerSelect
          placeholder={ {
            label: strings.selectSportPlaceholder,
            value: '',
          } }
          items={ [{ label: 'Tennis', value: 'Tennis' }] }
          onValueChange={ (value) => {
            setSports(value);
          } }
          useNativeAndroidPickerStyle={ false }
          // eslint-disable-next-line no-sequences
          style={ (Platform.OS === 'ios' ? styles.inputIOS : styles.inputAndroid), { ...styles } }
          value={ sports }
          Icon={ () => (
            <Image source={ images.dropDownArrow } style={ styles.downArrow } />
          ) }
        />

        <View
          style={ {
            flexDirection: 'row',
            alignItems: 'center',
          } }>
          <Text style={ styles.LocationText }>{strings.descriptionText}</Text>
          {/* <Text style={styles.smallTxt}> {strings.opetionalText} </Text> */}
        </View>
        <TextInput
          style={ styles.descriptionTxt }
          onChangeText={ (text) => setDescription(text) }
          value={ description }
          multiline
          numberOfLines={ 4 }
          placeholder={ strings.descriptionPlaceholder }
        />

        <Text style={ styles.LocationText }>
          {strings.languageTitle}
          <Text style={ styles.smallTxt }> {strings.opetionalText} </Text>
        </Text>
        <View style={ styles.searchView }>
          <TouchableOpacity onPress={ toggleModal }>
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
            elevation: 15,
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
            keyExtractor={(item, index) => index.toString()}
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
        {/* registerPlayerCall() */}
        <TouchableOpacity onPress={ () => {
          if (checkValidation()) {
            const bodyParams = {};

            bodyParams.sport_name = sports;
            bodyParams.Tennis = 'single-multiplayer';
            bodyParams.descriptions = description;
            bodyParams.language = selectedLanguages;

            // registered_sports[0]=bodyParams;
            // bodyParams={registered_sports};

            navigation.navigate('RegisterPlayerForm2', { bodyParams })
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
  smallTxt: {
    color: colors.grayColor,
    fontSize: wp('2.8%'),
    marginTop: hp('2%'),

    textAlign: 'left',
    // fontFamily: fonts.RBold,
  },
  descriptionTxt: {
    height: 120,
    // alignSelf: 'center',

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
  // curruency: {
  //   height: 40,
  //   width: 50,
  //   marginTop: 12,
  //   backgroundColor: colors.textFieldColor,
  //   textAlign: 'center',
  //   lineHeight: 37,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   fontSize: wp('4%'),
  // },

  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('3.5%'),
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
  inputAndroid: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('4%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,

    width: wp('92%'),
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 14,
    width: wp('92%'),
  },

  downArrow: {
    alignSelf: 'center',
    height: 18,
    resizeMode: 'contain',

    right: 25,
    tintColor: colors.grayColor,
    top: 22,
    width: 18,
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
    height: 40,

    marginTop: 12,
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
    height: 40,
    width: wp('80%'),
  },
  languageApplyButton: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 45,
    marginBottom: 40,
    marginTop: wp('5%'),
    width: '90%',
  },
  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  checkboxImg: {
    width: wp('5.5%'),

    // paddingLeft: wp('25%'),
    resizeMode: 'contain',
    alignSelf: 'center',

  },
  checkbox: {
    alignSelf: 'center',
    position: 'absolute',
    right: wp('5%'),
  },
});
