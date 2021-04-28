import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  Text,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import images from '../../../../Constants/ImagePath';

import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLable from '../../../../components/TCLabel';
import strings from '../../../../Constants/String';

export default function GameType() {
  const [typeSelection, setTypeSelection] = useState({ key: 'All', id: 3 });

  const gameTypeList = [
    { key: 'Official only', id: 1 },
    { key: 'Friendly only', id: 2 },
    { key: 'All', id: 3 },
  ];

  const renderGameTypes = ({ item }) => (
    <TouchableWithoutFeedback
      onPress={() => {
        setTypeSelection(item);
      }}>
      <View style={styles.radioItem}>
        <Text style={styles.languageList}>{item.key}</Text>
        <View style={styles.checkbox}>
          {typeSelection?.key === item?.key ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <ScrollView
      style={styles.mainContainer}
      showsVerticalScrollIndicator={false}>
      <TCLable title={strings.gameTyleTitle} required={false} />
      <FlatList
        // ItemSeparatorComponent={() => <TCThinDivider />}
        data={gameTypeList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderGameTypes}
      />
      {(typeSelection.key === 'Official only' || typeSelection.key === 'All') && <View
        style={styles.gameTypeNotes}>
        <Text
          style={styles.gameTypeTitle}>
          {strings.officialGameType}
        </Text>
        <Text
          style={styles.gameTypeNotesDetail}>
          {strings.challengeSettingTitle}
        </Text>
      </View>}

      {(typeSelection.key === 'Friendly only' || typeSelection.key === 'All') && <View
        style={styles.gameTypeNotes}>
        <Text
          style={styles.gameTypeTitle}>
          {strings.friendlyGameType}
        </Text>
        <Text
          style={styles.gameTypeNotesDetail}>
          {strings.challengeSettingTitle}
        </Text>
      </View>}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
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
  // eslint-disable-next-line react-native/no-unused-styles
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
  mainContainer: {
    flex: 1,
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
  checkbox: {},
  radioItem: {
    paddingLeft: 25,
    paddingTop: 15,
    paddingRight: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gameTypeNotes: {
    margin: 15,
    padding: 15,
    backgroundColor: colors.offwhite,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 15,
  },
  gameTypeTitle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.veryLightBlack,
  },
  gameTypeNotesDetail: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.veryLightBlack,
  },

});
