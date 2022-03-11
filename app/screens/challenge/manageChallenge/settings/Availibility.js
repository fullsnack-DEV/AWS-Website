import React, {useState, useLayoutEffect, useContext} from 'react';
import {StyleSheet, View, Text, Alert, SafeAreaView} from 'react-native';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import AuthContext from '../../../../auth/context';

import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLabel from '../../../../components/TCLabel';
import ToggleView from '../../../../components/Schedule/ToggleView';
import * as Utility from '../../../../utils';

import {patchPlayer} from '../../../../api/Users';
import {patchGroup} from '../../../../api/Groups';

export default function Availibility({navigation, route}) {
  const {comeFrom, sportName, sportType} = route?.params ?? {};

  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [acceptChallenge, setAcceptChallenge] = useState(
    route?.params?.settingObj?.availibility
      ? route?.params?.settingObj?.availibility === 'On'
      : true,
  );

  console.log('comeFrom ', comeFrom);
  console.log('sportName ', sportName);

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
  }, [acceptChallenge, comeFrom, navigation]);

  const saveUser = () => {
    const bodyParams = {
      sport: sportName,
      sport_type: sportType,
      entity_type: 'player',
      availibility: acceptChallenge ? 'On' : 'Off',
    };
    setloading(true);

    const registerdPlayerData = authContext?.entity?.obj?.registered_sports?.filter(
      (obj) => {
        if (obj.sport === sportName && obj.sport_type === sportType) {
          return null;
        }
        return obj;
      },
    );

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

    console.log('registerdPlayerData::::--->', registerdPlayerData);
    console.log('selectedSport::::--->', selectedSport);

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
            settingObj: response?.payload?.registered_sports?.filter(
              (obj) => obj.sport === sportName && obj.sport_type === sportType,
            )[0]?.setting,
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
      availibility: acceptChallenge ? 'On' : 'Off',
    };
    setloading(true);
    let selectedTeam = {...authContext?.entity?.obj};
    selectedTeam = {
      ...selectedTeam,
      setting: {...selectedTeam?.setting, ...bodyParams},
    };
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
    console.log('Save press');
    if (authContext.entity.role === 'team') {
      saveTeam();
    } else {
      saveUser();
    }
  };

  return (
    <SafeAreaView>
      <ActivityLoader visible={loading} />
      <View>
        <TCLabel title={strings.availibilityTitle} style={{marginRight: 15}} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 15,
            marginTop: 35,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.RRegular,
              color: colors.lightBlackColor,
            }}>
            {strings.AvailibilitySubTitle}
          </Text>
          <ToggleView
            isOn={acceptChallenge}
            onToggle={() => setAcceptChallenge(!acceptChallenge)}
            onColor={colors.themeColor}
            offColor={colors.grayBackgroundColor}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },
});
