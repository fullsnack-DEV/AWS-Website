import React, { useState, useEffect } from 'react';
import {
  View,
  Text,

  Image,
  TextInput,

  TouchableOpacity,
  TouchableWithoutFeedback,

  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

import styles from './style';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

function RegisterReferee({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);

  const [sports, setSports] = useState('');
  const [certificate, setSCertificate] = useState([]);
  const [description, onChangeText] = useState('');
  const [matchFee, onMatchFeeChanged] = useState(0.0);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);
  const selectedLanguage = [];
  let index = 0;

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
    // eslint-disable-next-line no-restricted-syntax
    for (const tempData of language) {
      tempData.isChecked = false;
      arr.push(tempData);
    }
    setLanguages(arr);
  }, []);
  const addMore = () => {
    setSCertificate([...certificate, index]);

    // eslint-disable-next-line no-plusplus
    index++;
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderItem = () => (
      <View style={ { flexDirection: 'column' } }>
          <View style={ styles.addCertificateView }>
              <TouchableOpacity>
                  <Image style={ styles.certificateImg } />
                  <Image source={ images.certificateUpload } style={ styles.chooseImage } />
              </TouchableOpacity>
              <TextInput
            placeholder={ strings.titleOrDescriptionText }
            style={ styles.certificateDescription }
            onChangeText={ (text) => onMatchFeeChanged(text) }
            value={ matchFee }></TextInput>
          </View>
          <TouchableOpacity>
              <Text style={ styles.delete }>{strings.deleteTitle}</Text>
          </TouchableOpacity>
      </View>
  );
  const isIconCheckedOrNot = ({ item, ind }) => {
    languages[ind].isChecked = !item.isChecked;

    setLanguages([...languages]);

    // eslint-disable-next-line no-restricted-syntax
    for (const temp of languages) {
      if (temp.isChecked) {
        selectedLanguage.push(temp.language);
      }
    }
    setSelectedLanguages(selectedLanguage);
  };
  const renderLanguage = ({ item, ind }) => (
      <TouchableWithoutFeedback
        style={ styles.listItem }
        onPress={ () => {
          isIconCheckedOrNot({ item, ind });
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

  const checkValidation = () => {
    if (sports === '') {
      Alert.alert('Towns Cup', 'Sports cannot be blank');
      return false
    }

    return true
  };

  return (
      <ScrollView style={ styles.mainContainer }>
          <View style={ styles.formSteps }>
              <View style={ styles.form1 }></View>
              <View style={ styles.form2 }></View>
          </View>
          <Text style={ styles.LocationText }>
              {strings.sportsEventsTitle}<Text style={ styles.mendatory }> {strings.star}</Text>
          </Text>
          <RNPickerSelect
        placeholder={ {
          label: strings.selectSportPlaceholder,
          value: null,
        } }
        items={ [
          { label: 'Football', value: 'football' },
          { label: 'Baseball', value: 'baseball' },
          { label: 'Hockey', value: 'hockey' },
        ] }
        onValueChange={ (value) => {
          setSports(value);
        } }
        useNativeAndroidPickerStyle={ false }
        style={ { ...styles } }
        value={ sports }
        Icon={ () => <Image source={ images.dropDownArrow } style={ styles.downArrow } /> }
      />

          <View
        style={ {
          flexDirection: 'row',
          alignItems: 'center',
        } }>
              <Text style={ styles.LocationText }>{strings.descriptionText}</Text>

          </View>
          <TextInput
        style={ styles.descriptionTxt }
        onChangeText={ (text) => onChangeText(text) }
        value={ description }
        multiline
        numberOfLines={ 4 }
        placeholder={ strings.descriptionRefereePlaceholder }
      />

          <Text style={ styles.LocationText }>
              {strings.certificateTitle}

          </Text>
          <Text style={ styles.certificateSubText }>{strings.certificateSubTitle}</Text>

          <FlatList
        scrollEnabled={ false }
        data={ certificate }
        // keyExtractor={ ( index ) => index }
        renderItem={ renderItem }
      />
          <TouchableOpacity onPress={ addMore } style={ styles.addCertificateButton }>
              <Text style={ styles.addCertificateText }>
                  {strings.addCertificateTitle}
              </Text>
          </TouchableOpacity>
          <Text style={ styles.LocationText }>
              {strings.languageTitle}

          </Text>
          <View style={ styles.searchView }>
              <TouchableOpacity onPress={ toggleModal }>
                  <TextInput
            style={ styles.searchTextField }
            placeholder={ strings.languagePlaceholder }
            onChangeText={ (text) => setPlayer2(text) }
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
          <TouchableOpacity
        onPress={ () => {
          if (checkValidation()) {
            let bodyParams = {};
            const referee_data = [];

            bodyParams.sport_name = sports;
            bodyParams.descriptions = description;
            bodyParams.language = selectedLanguages;

            referee_data[0] = bodyParams;
            bodyParams = { referee_data };
            console.log('bodyPARAMS:: ', JSON.stringify(bodyParams));

            navigation.navigate('RegisterRefereeForm2', { bodyParams });
          }
        } }>
              <LinearGradient
          colors={ [colors.yellowColor, colors.themeColor] }
          style={ styles.nextButton }>
                  <Text style={ styles.nextButtonText }>{strings.nextTitle}</Text>
              </LinearGradient>
          </TouchableOpacity>
      </ScrollView>
  );
}

export default RegisterReferee;
