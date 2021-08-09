import React, { useState, useLayoutEffect, useContext } from 'react';
import {
 StyleSheet, View, Text, TextInput, Alert,
 } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import colors from '../../../../Constants/Colors';
import strings from '../../../../Constants/String';
import TCLabel from '../../../../components/TCLabel';
import fonts from '../../../../Constants/Fonts';
import AuthContext from '../../../../auth/context';
import { patchChallengeSetting } from '../../../../api/Challenge';

export default function ScorekeeperFee({ navigation, route }) {
  const { comeFrom, sportName } = route?.params;
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [basicFee, setBasicFee] = useState(
    route?.params?.settingObj?.game_fee
      ? route?.params?.settingObj?.game_fee?.fee?.toString()
      : '0.0',
  );
  const [currencyType] = useState(
    route?.params?.settingObj?.game_fee
      ? route?.params?.settingObj?.game_fee?.currency_type
      : authContext?.entity?.obj?.currency_type ?? 'CAD',
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => {
            onSavePressed();
          }}>
          Save
        </Text>
      ),
    });
  }, [authContext.entity.obj.currency_type, basicFee, comeFrom, currencyType, navigation]);

  const onSavePressed = () => {
    if (basicFee < 1 && basicFee > 0) {
      Alert.alert('User should not allow less than $1 game fee.');
    } else
     if (comeFrom === 'InviteChallengeScreen' || comeFrom === 'EditChallenge') {
        navigation.navigate(comeFrom, {
          gameFee: {
            fee: Number(basicFee).toFixed(2),
            currency_type: currencyType,
          },
        });
      } else {
        const bodyParams = {
          sport: sportName,
          entity_type: 'scorekeeper',
          game_fee: {
            fee: Number(basicFee).toFixed(2),
            currency_type: currencyType,
          },
        };
        setloading(true);
        patchChallengeSetting(authContext?.entity?.uid, bodyParams, authContext)
          .then((response) => {
            setloading(false);
            navigation.navigate(comeFrom, { settingObj: response.payload });
            console.log('patch challenge response:=>', response.payload);
          })
          .catch((e) => {
            setloading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      }
  };

  const IsNumeric = (num) => num >= 0 || num < 0;
  return (
    <View>
      <ActivityLoader visible={loading} />
      <TCLabel title={strings.scorekeeperFeeTitle} />
      <View style={styles.matchFeeView}>
        <TextInput
          placeholder={strings.enterFeePlaceholder}
          style={styles.feeText}
          onChangeText={(text) => {
            if (IsNumeric(text)) {
              setBasicFee(text);
            }
          }}
          value={basicFee}
          keyboardType={'decimal-pad'}>
        </TextInput>
        <Text style={styles.curruency}>{currencyType}/hour</Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  matchFeeView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    color: colors.lightBlackColor,
    elevation: 3,
    flexDirection: 'row',
    fontFamily: fonts.RRegular,
    fontSize: 16,
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  feeText: {
    alignSelf: 'center',
    fontSize: wp('3.8%'),
    height: 40,
    width: '86%',

  },
  curruency: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },
});
