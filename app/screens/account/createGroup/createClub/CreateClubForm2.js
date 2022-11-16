import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
} from 'react-native';

import Modal from 'react-native-modal';

import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import {getHitSlop, languageList} from '../../../../utils';
import TCFormProgress from '../../../../components/TCFormProgress';

import TCThinDivider from '../../../../components/TCThinDivider';
import TCGradientButton from '../../../../components/TCGradientButton';
import styles from './style';

export default function CreateClubForm2({navigation, route}) {
  const [createClubForm1] = useState(route?.params?.createClubForm1);

  const [languagesName, setLanguagesName] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [description, setDescription] = useState('');

  const [isModalVisible, setModalVisible] = useState(false);

  const selectedLanguage = [];

  useEffect(() => {
    let languageText = '';
    if (selectedLanguages) {
      selectedLanguages.map((langItem, index) => {
        languageText = languageText + (index ? ', ' : '') + langItem;
        return null;
      });
      setLanguagesName(languageText);
    }
  }, [selectedLanguages]);

  useEffect(() => {
    const arr = [];
    for (const tempData of languageList) {
      tempData.isChecked = false;
      arr.push(tempData);
    }
    setLanguages(arr);
  }, []);

  const isIconCheckedOrNot = ({item, index}) => {
    languages[index].isChecked = !item.isChecked;

    setLanguages([...languages]);
  };

  const renderLanguage = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        isIconCheckedOrNot({item, index});
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.language}</Text>
        <View style={styles.checkbox}>
          {languages[index].isChecked ? (
            <Image source={images.orangeCheckBox} style={styles.checkboxImg} />
          ) : (
            <Image source={images.uncheckWhite} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const nextOnPress = () => {
    console.log('createClubForm1:=>', createClubForm1);
    const obj = {
      language: selectedLanguages,
    };
    if (description !== '') {
      obj.descriptions = description;
    }

    navigation.navigate('CreateClubForm3', {
      createClubForm2: {
        ...createClubForm1,
        ...obj,
      },
    });
  };

  return (
    <>
      <TCFormProgress totalSteps={3} curruentStep={2} />
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.LocationText}>{strings.languageText}</Text>
        <TouchableOpacity style={styles.languageView} onPress={toggleModal}>
          <Text
            style={
              languagesName
                ? styles.languageText
                : styles.languagePlaceholderText
            }
            numberOfLines={50}>
            {languagesName || strings.addLanguageText}
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={styles.LocationText}>
            {strings.descriptionClubTextDetails}
          </Text>
        </View>
        <TextInput
          style={styles.descriptionTxt}
          onChangeText={(text) => setDescription(text)}
          value={description}
          multiline
          maxLength={1000}
          textAlignVertical={'top'}
          numberOfLines={4}
          placeholder={strings.descriptionClubTextPlaceholder}
          placeholderTextColor={colors.userPostTimeColor}
        />
        <View style={{flex: 1}} />
      </ScrollView>
      <TCGradientButton
        isDisabled={languagesName === ''}
        title={strings.nextTitle}
        style={{marginBottom: 30}}
        onPress={nextOnPress}
      />
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onRequestClose={() => setModalVisible(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.3,
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
            elevation: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              {strings.languages}
            </Text>
            <TouchableOpacity
              onPress={() => {
                for (const temp of languages) {
                  if (temp.isChecked) {
                    selectedLanguage.push(temp.language);
                  }
                }
                setSelectedLanguages(selectedLanguage);
                toggleModal();
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  color: colors.themeColor,
                }}>
                {strings.apply}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={languages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderLanguage}
          />
        </View>
      </Modal>
    </>
  );
}
