import React, {
 useState, useContext, useLayoutEffect, useEffect,
 } from 'react';
import {
 StyleSheet, Text, Alert, View, SafeAreaView,
 } from 'react-native';

import { patchPlayer } from '../../../api/Users';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import * as Utility from '../../../utils';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCLabel from '../../../components/TCLabel';
import ToggleView from '../../../components/Schedule/ToggleView';
import strings from '../../../Constants/String';

export default function LookingForSettingScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [lookingFor, setLookingFor] = useState(false);
  const { sportName } = route?.params ?? {};
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.doneButtonStyle} onPress={() => updateProfile()}>
          Done
        </Text>
      ),
    });
  }, [navigation, lookingFor]);

  useEffect(() => {
    const selectedSport = authContext?.entity?.obj?.registered_sports?.filter(
      (obj) => obj?.sport === sportName,
    )[0];
    setLookingFor(selectedSport?.lookingForTeamClub);
  }, [authContext?.entity?.obj?.registered_sports, sportName]);
  const updateProfile = () => {
    setloading(true);

    const registerdPlayerData = authContext?.entity?.obj?.registered_sports?.filter(
      (obj) => obj.sport_name !== sportName && obj.sport_name,
    );

    console.log('registerdPlayerData:', registerdPlayerData);
    let selectedSport = authContext?.entity?.obj?.registered_sports?.filter(
      (obj) => obj?.sport === sportName,
    )[0];

    selectedSport = { ...selectedSport, lookingForTeamClub: lookingFor };
    console.log('selectedSport:', selectedSport);

    registerdPlayerData.push(selectedSport);
    console.log('Final data:', registerdPlayerData);

    const body = { ...authContext?.entity?.obj, registered_sports: registerdPlayerData };
    console.log('Body::::--->', body);

    patchPlayer(body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          const entity = authContext.entity;
          console.log('Register player response IS:: ', response.payload);
          entity.auth.user = response.payload;
          entity.obj = response.payload;
          authContext.setEntity({ ...entity });
          authContext.setUser(response.payload);
          await Utility.setStorage('authContextUser', response.payload);
          await Utility.setStorage('authContextEntity', { ...entity });
          navigation.goBack();
        } else {
          Alert.alert('Towns Cup', response.messages);
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
    <SafeAreaView style={{ flex: 1 }}>
      <ActivityLoader visible={loading} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginRight: 15,
        }}>
        <TCLabel title={sportName.toLowerCase() === 'tennis' ? 'Looking for Club' : 'Looking for Team'} />
        <ToggleView
          isOn={lookingFor}
          onToggle={() => {
            setLookingFor(!lookingFor);
          }}
          onColor={colors.themeColor}
          offColor={colors.grayBackgroundColor}
        />
      </View>
      <View style={{ flex: 1 }} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  doneButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
});
