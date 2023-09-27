import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';

import CustomModalWrapper from './CustomModalWrapper';

import colors from '../Constants/Colors';
import countryCodeList from '../utils/countryCode.json';
import {strings} from '../../Localization/translation';
import fonts from '../Constants/Fonts';
import {ModalTypes} from '../Constants/GeneralConstants';
import AuthContext from '../auth/context';

const TCCountryCodeModal = ({
  countryCodeVisible,
  onCloseModal,
  countryCodeObj,
}) => {
  const authContext = useContext(AuthContext);

  const [countryList, setCountryList] = useState(countryCodeList);

  useEffect(() => {
    const countryIndex = countryCodeList.findIndex(
      (item) => item.country === authContext?.user?.country,
    );

    if (countryIndex !== -1) {
      const updatedCountryList = [...countryCodeList];
      const selectedCountry = updatedCountryList.splice(countryIndex, 1)[0];
      updatedCountryList.unshift(selectedCountry);
      setCountryList(updatedCountryList);
    }
  }, [countryCodeVisible]);

  const renderCountryCode = ({item}) => (
    <>
      <Pressable onPress={() => countryCodeObj(item)} style={styles.row}>
        <View>
          <Text style={styles.label}>{item.country}</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={[styles.label, {textAlign: 'right'}]}>+{item.code}</Text>
        </View>
      </Pressable>
      <View style={styles.dividor} />
    </>
  );

  const searchCode = (text) => {
    if (text.length > 0) {
      const results = countryCodeList.filter(
        (x) =>
          x.country.includes(text) ||
          x.iso.includes(text) ||
          x.code.includes(text),
      );
      setCountryList(results);
    } else {
      setCountryList(countryCodeList);
    }
  };

  return (
    <CustomModalWrapper
      isVisible={countryCodeVisible}
      closeModal={onCloseModal}
      modalType={ModalTypes.style6}
      title={strings.countryCode}
      containerStyle={{paddingHorizontal: 15}}>
      <TextInput
        autoCorrect={false}
        spellCheck={false}
        style={styles.textInput}
        clearButtonMode="always"
        placeholder={strings.searchCountryCode}
        placeholderTextColor={colors.userPostTimeColor}
        onChangeText={(text) => searchCode(text)}
      />
      <FlatList
        data={countryList}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={renderCountryCode}
      />
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 16,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  textInput: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 25,
    fontFamily: fonts.RRegular,
    fontSize: 15,
    color: colors.lightBlackColor,
  },
  dividor: {
    height: 1,
    marginHorizontal: 10,
    backgroundColor: colors.grayBackgroundColor,
  },
});
export default TCCountryCodeModal;
