import React, {useState, useLayoutEffect, useContext} from 'react';
import {StyleSheet, View, Text, TextInput, Alert} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ActivityLoader from '../../../../components/loader/ActivityLoader';

import AuthContext from '../../../../auth/context';
import colors from '../../../../Constants/Colors';
import {strings} from '../../../../../Localization/translation';
import TCLabel from '../../../../components/TCLabel';
import fonts from '../../../../Constants/Fonts';
import {patchPlayer} from '../../../../api/Users';
import {patchGroup} from '../../../../api/Groups';

import * as Utility from '../../../../utils';

export default function GameRules({navigation, route}) {
  const [comeFrom] = useState(route?.params?.comeFrom);
  const [sportName] = useState(route?.params?.sportName);
  const [sportType] = useState(route?.params?.sportType);

  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);

  const [generalRules, setGeneralRules] = useState(
    route?.params?.settingObj?.general_rules
      ? route?.params?.settingObj?.general_rules
      : '',
  );
  const [specialRules, setSpecialRules] = useState(
    route?.params?.settingObj?.special_rules
      ? route?.params?.settingObj?.special_rules
      : '',
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
  }, [comeFrom, navigation, generalRules, specialRules]);

  const saveUser = () => {
    const bodyParams = {
      sport: sportName,
      sport_type: sportType,
      entity_type: 'player',
      general_rules: generalRules,
      special_rules: specialRules,
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
      entity_type: 'team',
      general_rules: generalRules,
      special_rules: specialRules,
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
        gameGeneralRules: generalRules,
        gameSpecialRules: specialRules,
      });
    } else if (authContext.entity.role === 'team') {
      saveTeam();
    } else {
      saveUser();
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <TCLabel title={strings.gameRulesTitle} />
      <Text style={styles.subTitleText}>{strings.gameRulesSubTitle1}</Text>

      <TextInput
        testID="general-rules-input"
        style={styles.rulesText}
        onChangeText={(text) => setGeneralRules(text)}
        value={generalRules}
        multiline
        maxLength={1000}
        textAlignVertical={'top'}
        numberOfLines={4}
        placeholder={strings.generalRulesPlaceholder}
        placeholderTextColor={colors.userPostTimeColor}
      />
      <Text style={styles.subTitleText}>{strings.gameRulesSubTitle2}</Text>
      <TextInput
        testID="special-rules-input"
        style={styles.rulesText}
        onChangeText={(text) => setSpecialRules(text)}
        value={specialRules}
        multiline
        maxLength={1000}
        textAlignVertical={'top'}
        numberOfLines={4}
        placeholder={strings.specialRulesPlaceholder}
        placeholderTextColor={colors.userPostTimeColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rulesText: {
    height: 120,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: wp('92%'),
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    paddingRight: 30,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },
  subTitleText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginTop: 15,
    marginLeft: 15,
  },
});
