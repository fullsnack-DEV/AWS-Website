import React, { useState, useLayoutEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,

} from 'react-native';

import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import {
  patchChallengeSetting,
} from '../../../../api/Challenge';
import AuthContext from '../../../../auth/context';
import colors from '../../../../Constants/Colors'
import strings from '../../../../Constants/String';
import TCLabel from '../../../../components/TCLabel';
import fonts from '../../../../Constants/Fonts';

export default function GameRules({ navigation, route }) {
  const { comeFrom, sportName } = route?.params;
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);

  const [generalRules, setGeneralRules] = useState(route?.params?.settingObj?.general_rules ? route?.params?.settingObj?.general_rules : '');
  const [specialRules, setSpecialRules] = useState(route?.params?.settingObj?.special_rules ? route?.params?.settingObj?.special_rules : '');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.saveButtonStyle} onPress={() => {
          onSavePressed()
        }}>Save</Text>
      ),
    });
  }, [comeFrom, navigation, generalRules, specialRules]);

  const onSavePressed = () => {
    if (comeFrom === 'InviteChallengeScreen' || comeFrom === 'EditChallenge') {
      navigation.navigate(comeFrom, {
        gameGeneralRules: generalRules,
        gameSpecialRules: specialRules,
      });
    } else {
      const bodyParams = {
        sport: sportName,
        entity_type: authContext.entity.role === 'user' ? 'player' : 'team',
        general_rules: generalRules,
        special_rules: specialRules,
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

  return (
    <View style={ styles.mainContainer }>
      <ActivityLoader visible={loading} />

      <TCLabel title={strings.gameRulesTitle}/>
      <Text style={styles.subTitleText}>{strings.gameRulesSubTitle1}</Text>

      <TextInput
          style={styles.rulesText}
          onChangeText={(text) => setGeneralRules(text)}
          value={generalRules}
          multiline
          textAlignVertical={'top'}
          numberOfLines={4}
          placeholder={strings.generalRulesPlaceholder}
          placeholderTextColor={colors.userPostTimeColor}
        />
      <Text style={styles.subTitleText}>{strings.gameRulesSubTitle2}</Text>
      <TextInput
          style={styles.rulesText}
          onChangeText={(text) => setSpecialRules(text)}
          value={specialRules}
          multiline
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
        shadowOffset: { width: 0, height: 1 },
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
