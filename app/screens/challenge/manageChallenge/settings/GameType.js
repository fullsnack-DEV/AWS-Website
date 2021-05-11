import React, { useState, useLayoutEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  Text,
  Alert,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AuthContext from '../../../../auth/context';
import images from '../../../../Constants/ImagePath';
import {
  patchChallengeSetting,
} from '../../../../api/Challenge';
import ActivityLoader from '../../../../components/loader/ActivityLoader';

import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLable from '../../../../components/TCLabel';
import strings from '../../../../Constants/String';

const gameTypeList = [
  { key: strings.officialOnly, id: 1 },
  { key: strings.friendlyOnly, id: 2 },
  { key: strings.allType, id: 3 },
];
export default function GameType({ navigation, route }) {
  const { comeFrom } = route?.params;
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [typeSelection, setTypeSelection] = useState(route?.params?.settingObj?.game_type ? (route?.params?.settingObj?.game_type === 'Official' && gameTypeList[0]) || (route?.params?.settingObj?.game_type === 'Friendly' && gameTypeList[1]) || (route?.params?.settingObj?.game_type === 'All' && gameTypeList[2]) : gameTypeList[2]);

  const { sportName } = route?.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => {
            onSavePressed()
          }}>
          Save
        </Text>
      ),
    });
  }, [comeFrom, navigation, typeSelection.key]);

  const onSavePressed = () => {
    if (comeFrom === 'InviteChallengeScreen') {
      navigation.navigate(comeFrom, { gameType: (typeSelection.key === strings.officialOnly && 'Official') || (typeSelection.key === strings.friendlyOnly && 'Friendly') || (typeSelection.key === strings.allType && 'All') })
    } else {
      const bodyParams = {
        sport: sportName,
        game_type: (typeSelection.key === strings.officialOnly && 'Official') || (typeSelection.key === strings.friendlyOnly && 'Friendly') || (typeSelection.key === strings.allType && 'All'),
      }
      setloading(true);
      patchChallengeSetting(authContext?.entity?.uid, bodyParams, authContext)
      .then((response) => {
        setloading(false);
        navigation.navigate(comeFrom, { settingObj: response.payload })
        console.log('patch challenge response:=>', response.payload);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
    }
  }

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
      <ActivityLoader visible={loading} />
      <TCLable title={strings.gameTyleTitle} required={false} />
      <FlatList
        // ItemSeparatorComponent={() => <TCThinDivider />}
        data={gameTypeList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderGameTypes}
      />
      {(typeSelection.key === strings.officialOnly || typeSelection.key === strings.allType) && <View
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

      {(typeSelection.key === strings.friendlyOnly || typeSelection.key === strings.allType) && <View
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
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },
});
