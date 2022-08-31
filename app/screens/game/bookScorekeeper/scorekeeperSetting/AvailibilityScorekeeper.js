import React, {useState, useLayoutEffect, useContext} from 'react';
import {StyleSheet, View, Text, Alert, SafeAreaView} from 'react-native';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import AuthContext from '../../../../auth/context';

import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLabel from '../../../../components/TCLabel';
import ToggleView from '../../../../components/Schedule/ToggleView';
import * as Utility from '../../../../utils';
import {patchPlayer} from '../../../../api/Users';

export default function AvailibilityScorekeeoer({navigation, route}) {
  const [comeFrom] = useState(route?.params?.comeFrom);
  const [sportName] = useState(route?.params?.sportName);
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [acceptChallenge, setAcceptChallenge] = useState(
    route?.params?.settingObj?.scorekeeper_availibility
      ? route?.params?.settingObj?.scorekeeper_availibility === 'On'
      : true,
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
  }, [navigation, acceptChallenge]);

  const onSavePressed = () => {
    const scorekeeperSetting = (
      authContext?.entity?.obj?.scorekeeper_data ?? []
    ).filter((obj) => obj.sport === sportName)?.[0]?.setting;

    const modifiedSetting = {
      ...scorekeeperSetting,
      sport: sportName,
      entity_type: 'scorekeeper',
      scorekeeper_availibility: acceptChallenge ? 'On' : 'Off',
    };

    setloading(true);
    const registerdScorekeeperData =
      authContext?.entity?.obj?.scorekeeper_data?.filter(
        (obj) => obj?.sport !== sportName,
      );

    let selectedSport = authContext?.entity?.obj?.scorekeeper_data?.filter(
      (obj) => obj?.sport === sportName,
    )[0];

    selectedSport = {
      ...selectedSport,
      setting: modifiedSetting,
    };
    registerdScorekeeperData.push(selectedSport);

    const body = {
      ...authContext?.entity?.obj,
      scorekeeper_data: registerdScorekeeperData,
    };
    console.log('Body::::--->', body);

    patchPlayer(body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          const entity = authContext.entity;
          console.log('Register scorekeeper response IS:: ', response.payload);
          entity.auth.user = response.payload;
          entity.obj = response.payload;
          authContext.setEntity({...entity});
          authContext.setUser(response.payload);
          await Utility.setStorage('authContextUser', response.payload);
          await Utility.setStorage('authContextEntity', {...entity});
          navigation.navigate(comeFrom, {
            settingObj: response.payload.scorekeeper_data.filter(
              (obj) => obj.sport === sportName,
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

  return (
    <SafeAreaView>
      <ActivityLoader visible={loading} />
      <View>
        <TCLabel
          title={strings.availibilityScorekeeperTitle}
          style={{marginRight: 15}}
        />

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
            {strings.AvailibilityRefereeSubTitle}
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
