import React, {useState, useEffect, Component} from 'react';
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
  Dimensions
} from 'react-native';

import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

import styles from './style';
import constants from '../../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import * as Utility from '../../../utility/index';


function RegisterPlayer({navigation, route}) {
  const [sports, setSports] = useState('');
  const [description, setDescription] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);
  var selectedLanguage = [];


  useEffect(() => {
    const language = [
      {language: 'English', id: 1},
      {language: 'English(Canada)', id: 2},
      {language: 'English(Singapore)', id: 3},
      {language: 'English(UK)', id: 4},
      {language: 'English(US)', id: 5},
      {language: 'Deutsch', id: 6},
      {language: 'Italiano', id: 7},
      {language: 'Korean', id: 8},
    ];

    var arr = [];
    for (var tempData of language) {
      tempData['isChecked'] = false;
      arr.push(tempData);
    }
    setLanguages(arr);
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  checkValidation = () => {
    if (sports == '') {
      Alert.alert('Towns Cup', 'Sports cannot be blank');
      return false
    }
    else{
      return true
    }
  };

  isIconCheckedOrNot = ({item, index}) => {
    console.log('SELECTED:::', index);

    languages[index].isChecked = !item.isChecked;

    setLanguages((languages) => [...languages]);

    for (let temp of languages) {
      if (temp.isChecked) {
        selectedLanguage.push(temp.language);
      }
    }
    setSelectedLanguages(selectedLanguage);
    console.log('language Checked ?:::', selectedLanguage);
  };
  const renderLanguage = ({item, index}) => {
    return (
      <TouchableWithoutFeedback
        style={styles.listItem}
        onPress={() => {
          this.isIconCheckedOrNot({item, index});
        }}>
        <View>
          <Text style={styles.languageList}>{item.language}</Text>
          <View style={styles.checkbox}>
            {languages[index].isChecked ? (
              <Image
                source={PATH.checkWhiteLanguage}
                style={styles.checkboxImg}
              />
            ) : (
              <Image source={PATH.uncheckWhite} style={styles.checkboxImg} />
            )}
          </View>
          <View style={styles.shortSeparatorLine}></View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  return (
    <>
      <ScrollView style={styles.mainContainer}>
      <View style={styles.formSteps}>
          <View style={styles.form1}></View>
          <View style={styles.form2}></View>
        </View>
        <Text style={styles.LocationText}>
          {strings.sportsEventsTitle}
          <Text style={styles.mendatory}> {strings.star}</Text>
        </Text>
        <RNPickerSelect
          placeholder={{
            label: strings.selectSportPlaceholder,
            value: '',
          }}
          items={[{label: 'Tennis', value: 'Tennis'}]}
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

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={styles.LocationText}>{strings.descriptionText}</Text>
          {/* <Text style={styles.smallTxt}> {strings.opetionalText} </Text> */}
        </View>
        <TextInput
          style={styles.descriptionTxt}
          onChangeText={(text) => setDescription(text)}
          value={description}
          multiline
          numberOfLines={4}
          placeholder={strings.descriptionPlaceholder}
        />

        {/* <Text style={styles.LocationText}>
          {strings.matchFeesTitle}
          <Text style={styles.mendatory}> {strings.star}</Text>
          <Text style={styles.smallTxt}> {strings.perHourText} </Text>
        </Text>

        <View style={styles.matchFeeView}>
          <TextInput
            placeholder={strings.enterFeePlaceholder}
            style={styles.feeText}
            onChangeText={(text) => onMatchFeeChanged(text)}
            value={matchFee}
            keyboardType={'decimal-pad'}></TextInput>
          <Text style={styles.curruency}>CAD/match</Text>
        </View> */}
        <Text style={styles.LocationText}>
        {strings.languageTitle}
        <Text style={styles.smallTxt}> {strings.opetionalText} </Text>
      </Text>
      <View style={styles.searchView}>
        <TouchableOpacity onPress={toggleModal}>
          <TextInput
            style={styles.searchTextField}
            placeholder={strings.languagePlaceholder}
            onChangeText={(text) => setPlayer2(text)}
            value={selectedLanguages.toString()}
            editable={false}
            pointerEvents="none"></TextInput>
        </TouchableOpacity>
      </View>
    
      <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        backdropOpacity={0}
        style={{marginLeft: 0, marginRight: 0, marginBottom: 0}}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 2,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.5,
            shadowRadius: 5,
          }}>
          <Text
            style={{
              alignSelf: 'center',
              marginTop: 20,
              marginBottom: 20,
              fontSize: 16,
              fontFamily: fonts.RBold,
              color: colors.lightBlackColor,
            }}>
            Languages
          </Text>
          <View style={styles.separatorLine}></View>
          <FlatList
            data={languages}
            keyExtractor={(item) => item.id}
            renderItem={renderLanguage}
            style={{marginBottom: '25%'}}
          />
          <View
            style={{
              width: '100%',
              height: '25%',
              backgroundColor: 'white',
              position: 'absolute',
              bottom: 0,
              left: 0,

              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.5,
              shadowRadius: 5,
            }}>
            <TouchableOpacity
              onPress={() => {
                toggleModal();
              }}>
              <LinearGradient
                colors={[colors.yellowColor, colors.themeColor]}
                style={styles.languageApplyButton}>
                <Text style={styles.nextButtonText}>{strings.applyTitle}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        {/* registerPlayerCall() */}
        <TouchableOpacity onPress={() => {
          if (checkValidation()) {
            let bodyParams = {};
            let registered_sports= [];

            bodyParams.sport_name = sports;
            bodyParams.Tennis = 'single-multiplayer';
            bodyParams.descriptions = description;
            bodyParams.language=selectedLanguages;

            registered_sports[0]=bodyParams;
            bodyParams={registered_sports};
            console.log('bodyPARAMS:: ', JSON.stringify(bodyParams));
      

            navigation.navigate('RegisterPlayerForm2',{bodyParams: bodyParams})
          }
        }}>
          <LinearGradient
            colors={[colors.yellowColor, colors.themeColor]}
            style={styles.nextButton}>
            <Text style={styles.nextButtonText}>{strings.nextTitle}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

export default RegisterPlayer;
