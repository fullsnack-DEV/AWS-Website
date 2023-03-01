// @flow
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TextInput, Keyboard} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import {languageList} from '../../../../utils';
import LanguagesListModal from '../../../account/registerPlayer/modals/LanguagesListModal';

const EditBasicInfoScreen = ({
  birthday,
  gender,
  height,
  weight,
  language = [],
  setData = () => {},
}) => {
  const [languages, setLanguages] = useState([]);
  const [languageName, setLanguageName] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    const arr = languageList.map((item) => ({
      ...item,
      isChecked: false,
    }));
    setLanguages(arr);
  }, []);

  useEffect(() => {
    if (language.length > 0) {
      const arr = languageList.filter((item) =>
        language.includes(item.language),
      );
      setSelectedLanguages(arr);
    }
  }, [language]);

  useEffect(() => {
    if (selectedLanguages.length > 0) {
      let name = '';
      selectedLanguages.forEach((item) => {
        name += name ? `, ${item.language}` : item.language;
      });
      setLanguageName(name);
    }
  }, [selectedLanguages]);

  const handleLanguageSelection = (lang) => {
    const newList = languages.map((item) => ({
      ...item,
      isChecked: item.id === lang.id ? !item.isChecked : item.isChecked,
    }));
    setLanguages([...newList]);

    const list = newList.filter((item) => item.isChecked);
    setSelectedLanguages([...list]);
  };

  return (
    <View style={styles.parent}>
      <View style={{marginBottom: 35}}>
        <Text style={styles.label}>{strings.gender.toUpperCase()}</Text>
        <Text style={[styles.label, styles.value]}>
          {gender
            ? gender
                .toLowerCase()
                .replace(/(^\s*\w|[.!?]\s*\w)/g, (str) => str.toUpperCase())
            : '--'}
        </Text>
      </View>

      <View style={{marginBottom: 35}}>
        <Text style={styles.label}>{strings.yearOfBirth.toUpperCase()}</Text>
        <Text style={[styles.label, styles.value]}>
          {birthday ? moment(birthday).format('YYYY') : '--'}
        </Text>
      </View>

      <View style={{marginBottom: 35}}>
        <Text style={styles.label}>{strings.height.toUpperCase()}</Text>
        <Text style={[styles.label, styles.value]}>
          {height ? `${height} cm` : '--'}
        </Text>
      </View>

      <View style={{marginBottom: 35}}>
        <Text style={styles.label}>{strings.weight.toUpperCase()}</Text>
        <Text style={[styles.label, styles.value]}>
          {weight ? `${weight} kg` : '--'}
        </Text>
      </View>

      <View style={{marginBottom: 35}}>
        <Text style={styles.label}>{strings.languages.toUpperCase()}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={languageName}
            onFocus={() => {
              Keyboard.dismiss();
              setShowLanguageModal(true);
            }}
          />
        </View>
      </View>

      <LanguagesListModal
        isVisible={showLanguageModal}
        closeList={() => setShowLanguageModal(false)}
        languageList={languages}
        onSelect={handleLanguageSelection}
        onApply={() => {
          setShowLanguageModal(false);
          const list = selectedLanguages.map((item) => item.language);
          setData({language: [...list]});
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  value: {
    fontFamily: fonts.RRegular,
    color: '#0A0808',
    marginLeft: 10,
    marginTop: 5,
  },
  input: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  inputContainer: {
    backgroundColor: colors.textFieldBackground,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
    borderRadius: 5,
  },
});
export default EditBasicInfoScreen;
