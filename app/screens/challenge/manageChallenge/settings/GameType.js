import React, {useState, useLayoutEffect, useContext} from 'react';
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

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AuthContext from '../../../../auth/context';
import images from '../../../../Constants/ImagePath';
import * as Utility from '../../../../utils';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import {patchPlayer} from '../../../../api/Users';
import {patchGroup} from '../../../../api/Groups';

import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLable from '../../../../components/TCLabel';
import {strings} from '../../../../../Localization/translation';
import Verbs from '../../../../Constants/Verbs';

const gameTypeList = [
  {key: strings.officialOnly, id: 1},
  {key: strings.friendlyOnly, id: 2},
  {key: strings.allType, id: 3},
];
export default function GameType({navigation, route}) {
  const [comeFrom] = useState(route?.params?.comeFrom);
  const [sportName] = useState(route?.params?.sportName);
  const [sportType] = useState(route?.params?.sportType);

  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [typeSelection, setTypeSelection] = useState(
    (route?.params?.settingObj?.game_type === Verbs.official &&
      gameTypeList[0]) ||
      (route?.params?.settingObj?.game_type === Verbs.friendly &&
        gameTypeList[1]) ||
      (route?.params?.settingObj?.game_type === Verbs.allStatus &&
        gameTypeList[2]),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => {
            onSavePressed();
          }}>
          {strings.save}
        </Text>
      ),
    });
  }, [comeFrom, navigation, typeSelection.key]);

  const saveUser = () => {
    const bodyParams = {
      sport: sportName,
      sport_type: sportType,
      entity_type: 'player',
      game_type:
        (typeSelection.key === strings.officialOnly && Verbs.official) ||
        (typeSelection.key === strings.friendlyOnly && Verbs.friendly) ||
        (typeSelection.key === strings.allType && Verbs.allStatus),
    };
    setloading(true);
    const registerdPlayerData =
      authContext?.entity?.obj?.registered_sports?.filter((obj) => {
        if (obj.sport === sportName && obj.sport_type === sportType) {
          return null;
        }
        return obj;
      });

    let selectedSport = authContext?.entity?.obj?.registered_sports?.filter(
      (obj) => obj?.sport === sportName && obj?.sport_type === sportType,
    )[0];

    selectedSport = {
      ...selectedSport,
      setting: {...selectedSport?.setting, ...bodyParams},
    };
    registerdPlayerData.push(selectedSport);

    const body = {
      ...authContext?.entity?.obj,
      registered_sports: registerdPlayerData,
    };
    console.log('Body::::--->', body);

    patchPlayer(body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          const entity = authContext.entity;
          console.log('Register player response IS:: ', response.payload);
          entity.auth.user = response.payload;
          entity.obj = response.payload;
          authContext.setEntity({...entity});
          authContext.setUser(response.payload);
          await Utility.setStorage('authContextUser', response.payload);
          await Utility.setStorage('authContextEntity', {...entity});
          navigation.navigate(comeFrom, {
            settingObj: response.payload.registered_sports.filter(
              (obj) => obj.sport === sportName && obj.sport_type === sportType,
            )[0].setting,
          });
        } else {
          Alert.alert(strings.appName, response.messages);
        }
        console.log('RESPONSE IS:: ', response);
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const saveTeam = () => {
    const bodyParams = {
      sport: sportName,
      sport_type: sportType,
      entity_type: Verbs.entityTypeTeam,
      game_type:
        (typeSelection.key === strings.officialOnly && Verbs.official) ||
        (typeSelection.key === strings.friendlyOnly && Verbs.friendly) ||
        (typeSelection.key === strings.allType && Verbs.allStatus),
    };
    setloading(true);
    const selectedTeam = authContext?.entity?.obj;
    selectedTeam.setting = {...selectedTeam.setting, ...bodyParams};
    const body = {...selectedTeam};
    console.log('Body Team::::--->', body);

    patchGroup(authContext.entity.uid, body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          console.log('Team patch::::--->', response.payload);

          setloading(false);
          const entity = authContext.entity;
          entity.obj = response.payload;
          authContext.setEntity({...entity});

          await Utility.setStorage('authContextEntity', {...entity});
          navigation.navigate(comeFrom, {
            settingObj: response.payload.setting,
          });
        } else {
          Alert.alert(strings.appName, response.messages);
        }
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const onSavePressed = () => {
    if (comeFrom === 'InviteChallengeScreen' || comeFrom === 'EditChallenge') {
      navigation.navigate(comeFrom, {
        gameType:
          (typeSelection.key === strings.officialOnly &&
            strings.officialGameType) ||
          (typeSelection.key === strings.friendlyOnly &&
            strings.friendlyGameType) ||
          (typeSelection.key === strings.allType && strings.all),
      });
    } else if (authContext.entity.role === Verbs.entityTypeTeam) {
      saveTeam();
    } else {
      saveUser();
    }
  };

  const renderGameTypes = ({item}) => (
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
      {(typeSelection.key === strings.officialOnly ||
        typeSelection.key === strings.allType) && (
        <View style={styles.gameTypeNotes}>
          <Text style={styles.gameTypeTitle}>{strings.officialGameType}</Text>
          <Text style={styles.gameTypeNotesDetail}>
            {strings.challengeSettingTitle}
          </Text>
        </View>
      )}

      {(typeSelection.key === strings.friendlyOnly ||
        typeSelection.key === strings.allType) && (
        <View style={styles.gameTypeNotes}>
          <Text style={styles.gameTypeTitle}>{strings.friendlyGameType}</Text>
          <Text style={styles.gameTypeNotesDetail}>
            {strings.challengeSettingTitle}
          </Text>
        </View>
      )}
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
    shadowOffset: {width: 0, height: 1},
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
    shadowOffset: {width: 0, height: 1},
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
